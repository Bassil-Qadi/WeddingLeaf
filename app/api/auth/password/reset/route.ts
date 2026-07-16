import { NextResponse } from "next/server";

import { rateLimitByIp } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { consumePasswordReset } from "@/services/password-reset";

/**
 * The token is 256 bits of randomness, so brute force isn't the worry — but a
 * loose ceiling here is a cheap bcrypt-grinder (each attempt hashes a password
 * at cost 12). Keep it bounded.
 */
const RESET_LIMIT = 10;
const RESET_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const limit = await rateLimitByIp(
    request,
    "password-reset-confirm",
    RESET_LIMIT,
    RESET_WINDOW_MS,
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "محاولات كثيرة. يُرجى المحاولة لاحقًا" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const ok = await consumePasswordReset(
    parsed.data.token,
    parsed.data.password,
  );
  if (!ok) {
    // Unknown, used, or expired — all the same to the user.
    return NextResponse.json(
      { error: "انتهت صلاحية الرابط أو أنه غير صالح. اطلب رابطًا جديدًا" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
