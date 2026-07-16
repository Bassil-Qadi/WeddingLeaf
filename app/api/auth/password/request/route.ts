import { NextResponse } from "next/server";

import { rateLimitByIp } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { createPasswordReset } from "@/services/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site-url";

/**
 * Minting a reset token costs a DB write and an outbound email, and the email
 * lands in someone else's inbox — so an open endpoint is a way to spam a victim
 * or probe which addresses have accounts. Tight ceiling per IP.
 */
const RESET_LIMIT = 5;
const RESET_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const limit = await rateLimitByIp(
    request,
    "password-reset",
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
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const reset = await createPasswordReset(parsed.data.email);

  // Only send when the address actually has an account — but say the same thing
  // either way (below), so the response can't be used to tell registered
  // addresses from unregistered ones.
  if (reset) {
    const link = new URL("/auth/reset-password", siteUrl());
    link.searchParams.set("token", reset.rawToken);

    const result = await sendPasswordResetEmail({
      to: reset.email,
      name: reset.name,
      link: link.toString(),
    });

    // A send failure is ours to notice, not the user's — they still get the
    // generic reply. Log it so a misconfigured provider doesn't fail silently.
    if (!result.ok) {
      console.error(`[password-reset] email send failed: ${result.error}`);
    }
  }

  // Deliberately identical whether or not an account exists.
  return NextResponse.json({
    ok: true,
    message: "إذا كان هناك حساب بهذا البريد، فستصلك رسالة لإعادة التعيين",
  });
}
