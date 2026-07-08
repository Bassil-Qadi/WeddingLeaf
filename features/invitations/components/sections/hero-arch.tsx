"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { ArchFrame } from "../decor/arch-frame";
import { FloralSpray } from "../decor/floral-spray";
import { SwanPair } from "../decor/swan-pair";
import { EASE_LUX, EASE_OUT } from "../../lib/anim";
import type { Invitation } from "@/types/invitation";

/**
 * The hero reveal — the couple's names in brushed gold, cradled inside a
 * floral archway that drifts on a gentle parallax as the guest scrolls, over
 * a pair of swans and the Bismillah. The opening moment of the invitation,
 * adapted to Arabic / RTL. Reference: assets/envelope.mp4.
 */
export function HeroArch({ invitation }: { invitation: Invitation }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layered parallax: the arch lifts, the florals sink, the whole thing fades.
  const archY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const floralY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden px-6 pb-10 pt-16"
    >
      {/* soft watercolour wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, var(--inv-paper-light) 0%, var(--inv-cream) 55%, var(--inv-cream-deep) 100%)",
        }}
      />

      {/* archway + florals (parallax) */}
      <motion.div style={{ y: archY, opacity: fade }} className="pointer-events-none absolute inset-0">
        <ArchFrame className="absolute left-1/2 top-8 h-[78%] w-[92%] max-w-md -translate-x-1/2" />
      </motion.div>
      <motion.div style={{ y: floralY }} className="pointer-events-none absolute inset-0">
        <FloralSpray className="absolute -left-4 top-4 h-40 w-40 sm:h-52 sm:w-52" />
        <FloralSpray flip className="absolute -right-4 top-4 h-40 w-40 sm:h-52 sm:w-52" />
      </motion.div>

      {/* content */}
      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center text-center"
      >
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

        {/* names, in gold foil with a light sheen sweeping across on entrance */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE_LUX }}
          className="relative mt-8 flex flex-col items-center gap-2 font-heading"
        >
          <span className="inv-foil text-6xl leading-none sm:text-7xl">
            {invitation.groomName}
          </span>
          <span className="flex items-center gap-3 text-[var(--inv-gold)]">
            <span className="h-px w-10 bg-gradient-to-l from-[var(--inv-gold)] to-transparent" />
            <span className="font-heading text-2xl">&amp;</span>
            <span className="h-px w-10 bg-gradient-to-r from-[var(--inv-gold)] to-transparent" />
          </span>
          <span className="inv-foil text-6xl leading-none sm:text-7xl">
            {invitation.brideName}
          </span>

          {/* one-shot specular sheen across the names */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, delay: 1.3 }}
          >
            <span
              className="absolute inset-y-0 -left-1/3 w-1/3"
              style={{
                background:
                  "linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent)",
                animation: "inv-sheen 1.4s ease-out 1.3s both",
              }}
            />
          </motion.span>
        </motion.h1>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
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
      </motion.div>

      {/* swans + bismillah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: EASE_OUT }}
        className="relative z-10 mt-6 flex w-full max-w-sm flex-col items-center"
      >
        <SwanPair className="h-28 w-56" />
        <p className="mt-4 font-heading text-lg text-[var(--inv-script)]">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </motion.div>
    </section>
  );
}
