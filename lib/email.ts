import { Resend } from "resend";

/**
 * The one seam every outbound email goes through. Password reset is the first
 * caller; RSVP confirmations and receipts will plug in here too, which is why
 * the provider lives behind a function and not inlined at the call site.
 *
 * Configuration is read lazily, not at module load, so importing anything that
 * transitively pulls this in doesn't crash a build that has no key set yet.
 */

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

interface SendResult {
  ok: boolean;
  /** Present when ok is false — a reason for the server log, never the user. */
  error?: string;
}

function fromAddress(): string {
  // Resend will only deliver to arbitrary recipients once you've verified a
  // sending domain. Until then, `onboarding@resend.dev` is the only usable
  // sender and it can reach only your own Resend-account email — enough to
  // test the whole flow end to end, not enough for real couples.
  return process.env.EMAIL_FROM ?? "WeddingLeaf <onboarding@resend.dev>";
}

async function send({ to, subject, html }: SendArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // No provider configured. In development that's expected — surface the
    // content in the server log so the flow is still testable — but in
    // production it's a misconfiguration the operator needs to see.
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "RESEND_API_KEY is not set" };
    }
    console.warn(
      `[email] RESEND_API_KEY unset — not sending. to=${to} subject=${subject}`,
    );
    return { ok: true };
  }

  const resend = new Resend(apiKey);
  // Resend reports failures in the returned `error`, not by throwing; the
  // try/catch is only for transport-level faults (DNS, timeouts).
  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to,
      subject,
      html,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : "send failed" };
  }
}

/**
 * The password-reset email. `name` personalises the greeting; `link` is the
 * one-time reset URL. RTL Arabic body to match the rest of the product.
 */
export async function sendPasswordResetEmail(args: {
  to: string;
  name: string;
  link: string;
}): Promise<SendResult> {
  const { to, name, link } = args;

  const html = `
    <div dir="rtl" style="font-family: system-ui, -apple-system, Segoe UI, Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">
      <h1 style="font-size: 20px; margin: 0 0 16px;">إعادة تعيين كلمة المرور</h1>
      <p style="margin: 0 0 12px;">مرحبًا ${escapeHtml(name)}،</p>
      <p style="margin: 0 0 20px;">
        وصلنا طلب لإعادة تعيين كلمة المرور الخاصة بحسابك. اضغط الزر أدناه لاختيار كلمة مرور جديدة. الرابط صالح لمدة ساعة واحدة.
      </p>
      <p style="margin: 0 0 24px;">
        <a href="${link}" style="display: inline-block; background: #b45309; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
          إعادة تعيين كلمة المرور
        </a>
      </p>
      <p style="margin: 0 0 8px; color: #666; font-size: 13px;">
        إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة بأمان — لن يتغيّر شيء.
      </p>
      <p style="margin: 0; color: #999; font-size: 12px; word-break: break-all;">
        أو انسخ هذا الرابط: ${escapeHtml(link)}
      </p>
    </div>
  `;

  return send({
    to,
    subject: "إعادة تعيين كلمة المرور — WeddingLeaf",
    html,
  });
}

// The link and name are our own values, but escaping is cheap insurance and
// keeps a stray character in a display name from breaking the markup.
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
