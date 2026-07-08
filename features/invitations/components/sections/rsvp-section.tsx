"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

import { WaxSeal } from "../wax-seal";
import { SectionTitle } from "../decor/section-title";
import { Reveal } from "../reveal";
import { RsvpForm } from "./rsvp-form";
import type { Invitation } from "@/types/invitation";

/**
 * "أكّدوا حضوركم" — the closing call-to-action. A burgundy RSVP wax seal
 * opens the attendance form; a portrait and the couple's sign-off round out
 * the invitation (assets/envelope.mp4).
 */
export function RsvpSection({ invitation }: { invitation: Invitation }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full bg-[var(--inv-cream-deep)] px-6 pb-24 pt-20">
      <Reveal className="mx-auto max-w-md text-center">
        <SectionTitle>أكّدوا حضوركم</SectionTitle>
        <p className="mx-auto mt-6 max-w-sm font-sans text-[15px] leading-loose text-[var(--inv-ink)]">
          لمساعدتنا في التحضير لهذه الأمسية السعيدة، نرجو منكم تأكيد حضوركم.
        </p>

        {/* RSVP wax seal */}
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto mt-10 flex flex-col items-center"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-label="افتح نموذج تأكيد الحضور"
        >
          <WaxSeal
            className="h-24 w-24 drop-shadow-[0_10px_22px_rgba(87,24,38,0.45)]"
            monogram="RSVP"
            monogramSize={17}
          />
          <span className="mt-3 flex flex-col items-center text-[var(--inv-ink-soft)]">
            <ChevronUp className="size-4" />
            <span className="font-heading text-base">اضغط للفتح</span>
          </span>
        </motion.button>

        <p className="mt-10 font-heading text-2xl text-[var(--inv-script)]">
          نتطلع لرؤيتكم
        </p>
        <p className="mt-1 font-heading text-lg text-[var(--inv-ink-soft)]">
          {invitation.groomName} و {invitation.brideName}
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
        {open && (
          <RsvpForm invitation={invitation} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
