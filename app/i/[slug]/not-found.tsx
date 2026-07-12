import Link from "next/link";
import { Leaf } from "lucide-react";

/**
 * Shown when a slug or a guest token resolves to nothing. Guests reach this by
 * mistyping a link or by following one to an invitation that was unpublished,
 * so the tone is apologetic rather than technical — and it never speculates
 * about whose wedding it might have been.
 */
export default function InvitationNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
        <Leaf className="size-6" />
      </div>

      <div>
        <h1 className="font-heading text-2xl">هذه الدعوة غير متاحة</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          قد يكون الرابط غير صحيح، أو أن الدعوة لم تُنشر بعد. تأكّدوا من الرابط
          الذي وصلكم من العروسين.
        </p>
      </div>

      <Link
        href="/"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </main>
  );
}
