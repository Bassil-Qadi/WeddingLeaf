"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { ArchFrame } from "../decor/arch-frame";
import { FloralSpray } from "../decor/floral-spray";
import { SwanPair } from "../decor/swan-pair";
import type { Invitation } from "@/types/invitation";

/**
 * The hero reveal — the couple's names cradled inside a floral archway above
 * a pair of swans, closing on the Bismillah. Mirrors the opening screen of
 * assets/envelope.mp4, adapted to Arabic / RTL.
 */
export function HeroArch({ invitation }: { invitation: Invitation }) {
  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden bg-[var(--inv-cream)] px-6 pt-16 pb-10">
      {/* soft watercolour wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, var(--inv-paper-light) 0%, var(--inv-cream) 55%, var(--inv-cream-deep) 100%)",
        }}
      />

      {/* archway behind the names */}
      <ArchFrame className="pointer-events-none absolute left-1/2 top-8 h-[78%] w-[92%] max-w-md -translate-x-1/2" />

      {/* florals climbing the arch */}
      <FloralSpray className="pointer-events-none absolute -left-4 top-4 h-40 w-40 sm:h-52 sm:w-52" />
      <FloralSpray
        flip
        className="pointer-events-none absolute -right-4 top-4 h-40 w-40 sm:h-52 sm:w-52"
      />

      {/* content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-lg text-[var(--inv-script)]"
        >
          يوم الزفاف
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-1 font-sans text-sm tracking-[0.3em] text-[var(--inv-ink-soft)]"
        >
          {invitation.dateDisplay}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center gap-2 font-heading text-[var(--inv-script)]"
        >
          <span className="text-5xl leading-none sm:text-6xl">
            {invitation.groomName}
          </span>
          {/* ornamental connector */}
          <span className="flex items-center gap-2 text-[var(--inv-gold)]">
            <span className="h-px w-8 bg-[var(--inv-gold)]/60" />
            <span className="text-2xl">&amp;</span>
            <span className="h-px w-8 bg-[var(--inv-gold)]/60" />
          </span>
          <span className="text-5xl leading-none sm:text-6xl">
            {invitation.brideName}
          </span>
        </motion.h1>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col items-center gap-1 text-[var(--inv-ink-soft)]"
        >
          <span className="font-heading text-base">مرر للأسفل</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-5" />
          </motion.span>
        </motion.div>
      </div>

      {/* swans + bismillah */}
      <div className="relative z-10 mt-6 flex w-full max-w-sm flex-col items-center">
        <SwanPair className="h-28 w-56" />
        <p className="mt-4 font-heading text-lg text-[var(--inv-script)]">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>
    </section>
  );
}
