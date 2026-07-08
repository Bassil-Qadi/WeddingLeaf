"use client";

import { FloralSpray } from "../decor/floral-spray";
import { SectionTitle } from "../decor/section-title";
import { Reveal } from "../reveal";
import type { Invitation } from "@/types/invitation";

/**
 * "قواعد اللباس" and "الهدايا" — two short courtesy notes framed by floral
 * corners (assets/envelope.mp4, "Dress Code" / "Gift Preference").
 */
export function DetailsSection({ invitation }: { invitation: Invitation }) {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--inv-cream)] px-6 py-20">
      <FloralSpray
        flip
        className="pointer-events-none absolute -right-8 -top-4 h-36 w-36 opacity-90"
      />
      <FloralSpray className="pointer-events-none absolute -bottom-4 -left-8 h-36 w-36 rotate-180 opacity-90" />

      <div className="relative mx-auto flex max-w-md flex-col gap-16 text-center">
        {invitation.dressCodeNote && (
          <Reveal>
            <SectionTitle>قواعد اللباس</SectionTitle>
            <p className="mx-auto mt-6 max-w-sm font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
              {invitation.dressCodeNote}
            </p>
          </Reveal>
        )}

        {invitation.giftPreference && (
          <Reveal>
            <SectionTitle>الهدايا</SectionTitle>
            <p className="mx-auto mt-6 max-w-sm font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
              {invitation.giftPreference}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
