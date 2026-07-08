"use client";

import { motion } from "framer-motion";

import { RoseBloom } from "../decor/rose-bloom";
import { SectionTitle } from "../decor/section-title";
import { RevealGroup, RevealItem } from "../reveal";
import { EASE_OUT, inView } from "../../lib/anim";
import type { Invitation } from "@/types/invitation";

/**
 * "برنامج الحفل" — the order of the evening on a gilt timeline that draws
 * itself downward as it scrolls into view. A single rose blooms at the
 * ceremony while soft gold nodes mark the rest, and every row cascades in.
 */
export function ScheduleSection({ invitation }: { invitation: Invitation }) {
  // Feature the عقد القران / ceremony row with the rose; fall back to the 2nd.
  const featured = Math.min(1, invitation.schedule.length - 1);

  return (
    <section className="relative w-full bg-[var(--inv-cream)] px-6 py-20">
      <div className="mx-auto max-w-md">
        <SectionTitle>برنامج الحفل</SectionTitle>

        <div className="relative mt-12">
          {/* the drawing centre line */}
          <motion.span
            className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-[var(--inv-gold)]/70 via-[var(--inv-gold)]/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inView}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          />

          <RevealGroup>
            <ol dir="rtl">
              {invitation.schedule.map((item, i) => {
                const isFeatured = i === featured;
                return (
                  <RevealItem key={item.id}>
                    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                      {/* time (right) */}
                      <span className="text-right font-heading text-2xl text-[var(--inv-wine)]">
                        {item.time}
                      </span>

                      {/* node (center) */}
                      <span className="relative flex h-20 w-12 items-center justify-center">
                        {isFeatured ? (
                          <span className="relative">
                            <span className="absolute inset-0 -m-1.5 rounded-full bg-[var(--inv-rose)]/30 blur-md" />
                            <RoseBloom className="relative h-11 w-11 drop-shadow-sm" />
                          </span>
                        ) : (
                          <span className="relative grid size-3.5 place-items-center rounded-full border border-[var(--inv-gold)] bg-[var(--inv-cream)] shadow-[0_0_0_4px_var(--inv-cream)]">
                            <span className="size-1.5 rounded-full bg-[var(--inv-gold)]" />
                          </span>
                        )}
                      </span>

                      {/* title (left) */}
                      <span className="text-left font-sans text-[15px] leading-snug text-[var(--inv-ink)]">
                        {item.title}
                      </span>
                    </li>
                  </RevealItem>
                );
              })}
            </ol>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
