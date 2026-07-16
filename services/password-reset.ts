import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";

/** How long a reset link stays valid. Short on purpose — it's a takeover path. */
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * 32 bytes of randomness, base64url. Far more entropy than the 10-byte guest
 * tokens: this one guards an account, so it must be unguessable even against an
 * attacker who can make unlimited attempts before the rate limiter notices.
 */
function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

/** sha256, hex. Deterministic, so we can look a raw token up by its hash. */
function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Start a reset for `email`. Returns the raw token and the user's name so the
 * caller can build and send the link — or `null` when no such user exists.
 *
 * The caller must NOT let that null change what it tells the client: revealing
 * whether an address has an account turns this endpoint into an email-enumerator.
 * Returning null here, and a generic "check your inbox" there, is the whole
 * defence.
 *
 * Any previously outstanding tokens for the user are discarded first, so a
 * second request invalidates the first link rather than leaving two live.
 */
export async function createPasswordReset(
  email: string,
): Promise<{ rawToken: string; name: string; email: string } | null> {
  await connectToDatabase();

  const user = await User.findOne({ email }).select("_id name email");
  if (!user) return null;

  await PasswordResetToken.deleteMany({ userId: user._id });

  const rawToken = generateRawToken();
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  return { rawToken, name: user.name, email: user.email };
}

/**
 * Finish a reset: verify the raw token, set the new password, burn the token.
 *
 * Returns `false` for a token that is unknown, already used, or expired — the
 * three the caller must treat identically ("this link is no longer valid").
 * Expiry is checked here against the clock rather than trusted to the TTL
 * reaper, which runs on its own schedule and may not have swept yet.
 *
 * On success every reset token for that user is deleted, not just the one used,
 * so a link that leaked alongside this one can't be replayed afterwards.
 */
export async function consumePasswordReset(
  rawToken: string,
  newPassword: string,
): Promise<boolean> {
  await connectToDatabase();

  const record = await PasswordResetToken.findOne({
    tokenHash: hashToken(rawToken),
    expiresAt: { $gt: new Date() },
  });
  if (!record) return false;

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await User.updateOne(
    { _id: record.userId },
    { $set: { passwordHash } },
  );

  await PasswordResetToken.deleteMany({ userId: record.userId });

  return true;
}
