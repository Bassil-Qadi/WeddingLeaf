"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock } from "lucide-react";

import { WaxSeal } from "../wax-seal";
import { SectionTitle } from "../decor/section-title";
import { Reveal } from "../reveal";
import { RsvpForm } from "./rsvp-form";
import type { Invitation } from "@/types/invitation";

/**
 * "أكّدوا حضوركم" — the closing call-to-action. A burgundy wax seal, haloed
 * and breathing, opens the attendance form; the couple's foil sign-off and an
 * optional portrait round out the invitation. Reference: assets/envelope.mp4.
 */
export function RsvpSection({ invitation }: { invitation: Invitation }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[var(--inv-cream-deep)] px-6 pb-28 pt-20">
      <Reveal className="mx-auto max-w-md text-center">
        <SectionTitle>أكّدوا حضوركم</SectionTitle>
        <p className="mx-auto mt-6 max-w-sm font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
          لمساعدتنا في التحضير لهذه الأمسية السعيدة، يسعدنا أن نستقبل تأكيد حضوركم.
        </p>

        {invitation.rsvpDeadline && (
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--inv-line)] bg-white/50 px-4 py-1.5 font-sans text-xs text-[var(--inv-ink-soft)]">
            <CalendarClock className="size-3.5 text-[var(--inv-gold)]" />
            يرجى التأكيد قبل {invitation.rsvpDeadline}
          </span>
        )}

        {/* wax-seal CTA */}
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mx-auto mt-10 flex flex-col items-center outline-none"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-label="افتح نموذج تأكيد الحضور"
        >
          <span className="relative">
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
              style={{
                background: "radial-gradient(circle, var(--inv-gold-glow) 0%, transparent 68%)",
                animation: "inv-breathe 2.8s ease-in-out infinite",
              }}
            />
            <WaxSeal
              className="h-24 w-24 drop-shadow-[0_10px_22px_rgba(87,24,38,0.45)]"
              monogram="RSVP"
              monogramSize={17}
            />
          </span>
          <span className="mt-4 font-heading text-base text-[var(--inv-wine)]">
            اضغط لتأكيد الحضور
          </span>
        </motion.button>

        <p className="mt-12 font-sans text-xs tracking-[0.28em] text-[var(--inv-ink-soft)]">
          بكل حب
        </p>
        <p className="mt-3 inv-foil font-heading text-3xl">
          {invitation.groomName} &amp; {invitation.brideName}
        </p>

        {invitation.couplePhoto && (
          <div className="mx-auto mt-8 h-56 w-44 overflow-hidden rounded-[9999px_9999px_1.5rem_1.5rem] border border-[var(--inv-line)] shadow-lg">
            <Image
              src={invitation.couplePhoto}
              alt={`${invitation.groomName} و ${invitation.brideName}`}
              width={176}
              height={224}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </Reveal>

      <AnimatePresence>
        {open && <RsvpForm invitation={invitation} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
