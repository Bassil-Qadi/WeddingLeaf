"use client";

import { RoseBloom } from "../decor/rose-bloom";
import { SectionTitle } from "../decor/section-title";
import { Reveal } from "../reveal";
import type { Invitation } from "@/types/invitation";

/**
 * "برنامج الحفل" — the order of the evening on a dotted timeline, with a
 * single rose blooming at the ceremony itself and hairline gold nodes for
 * the rest (assets/envelope.mp4).
 */
export function ScheduleSection({ invitation }: { invitation: Invitation }) {
  // Feature the عقد القران / ceremony row with the rose; fall back to the 2nd.
  const featured = Math.min(1, invitation.schedule.length - 1);

  return (
    <section className="relative w-full bg-[var(--inv-cream)] px-6 py-20">
      <Reveal className="mx-auto max-w-md">
        <SectionTitle>برنامج الحفل</SectionTitle>

        <ol dir="rtl" className="mt-12">
          {invitation.schedule.map((item, i) => {
            const isFeatured = i === featured;
            const isLast = i === invitation.schedule.length - 1;
            return (
              <li
                key={item.id}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
              >
                {/* time (right) */}
                <span className="text-right font-heading text-2xl text-[var(--inv-wine)]">
                  {item.time}
                </span>

                {/* node + connecting line (center) */}
                <span className="relative flex h-20 w-12 items-center justify-center">
                  {!isLast && (
                    <span className="absolute top-1/2 h-full w-px border-l border-dashed border-[var(--inv-gold)]/60" />
                  )}
                  {i > 0 && (
                    <span className="absolute bottom-1/2 h-full w-px border-l border-dashed border-[var(--inv-gold)]/60" />
                  )}
                  {isFeatured ? (
                    <RoseBloom className="relative h-11 w-11 drop-shadow-sm" />
                  ) : (
                    <span className="relative h-3 w-3 rounded-full border border-[var(--inv-gold)] bg-[var(--inv-cream)]">
                      <span className="absolute inset-1 rounded-full bg-[var(--inv-rose)]" />
                    </span>
                  )}
                </span>

                {/* title (left) */}
                <span className="text-left font-sans text-[15px] leading-snug text-[var(--inv-ink)]">
                  {item.title}
                </span>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
