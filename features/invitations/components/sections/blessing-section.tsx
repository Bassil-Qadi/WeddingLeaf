"use client";

import { FloralSpray } from "../decor/floral-spray";
import { Reveal } from "../reveal";
import type { Invitation } from "@/types/invitation";

/**
 * The invocation — three short poetic lines under a floral crown, followed
 * by the warm welcome to guests. (assets/envelope.mp4, "Two Souls / One
 * destiny / A Lifetime written by Allah", rendered in Arabic.)
 */
export function BlessingSection({ invitation }: { invitation: Invitation }) {
  const tagline = invitation.tagline ?? [];

  return (
    <section className="relative w-full overflow-hidden bg-[var(--inv-cream)] px-6 pb-20 pt-16">
      {/* floral crown */}
      <FloralSpray className="pointer-events-none absolute -left-6 -top-2 h-32 w-32 -rotate-12 opacity-90" />
      <FloralSpray
        flip
        className="pointer-events-none absolute -right-6 -top-2 h-32 w-32 rotate-12 opacity-90"
      />

      <Reveal className="mx-auto mt-10 max-w-md text-center">
        <div className="flex flex-col items-center gap-1">
          {tagline.map((line, i) => (
            <p
              key={i}
              className="font-heading text-2xl text-[var(--inv-script)] sm:text-3xl"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="mx-auto my-8 h-px w-20 bg-[var(--inv-gold)]/50" />

        {invitation.message && (
          <p className="font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
            {invitation.message}
          </p>
        )}
      </Reveal>
    </section>
  );
}
