"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EASE_VEIL } from "../lib/motion";
import { Ornament } from "./ornament";
import { Wordmark } from "./ambient";

/**
 * The veil hangs from the top of the window and is drawn upward off it, so
 * everything about its motion is anchored to `transform-origin: top center`.
 * Blur and fade trail the lift rather than accompany it — fabric leaves the
 * frame before it dissolves.
 */
const veilVariants: Variants = {
  sealed: { y: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
  lifted: {
    y: "-106%",
    scale: 1.03,
    opacity: 0,
    filter: "blur(3px)",
    transition: {
      // The 0.47s head start lets the seal flare and the composition settle
      // before the fabric moves.
      y: { duration: 1.5, ease: EASE_VEIL, delay: 0.47 },
      scale: { duration: 1.5, ease: EASE_VEIL, delay: 0.47 },
      opacity: { duration: 1.1, ease: "easeInOut", delay: 0.97 },
      filter: { duration: 1.2, ease: "easeInOut", delay: 0.77 },
    },
  },
};

/** Reduced motion: no lift, no ceremony — the veil simply clears. */
const fadeVariants: Variants = {
  sealed: { opacity: 1 },
  lifted: { opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

const contentVariants: Variants = {
  sealed: { opacity: 1, y: 0, scale: 1 },
  lifted: {
    opacity: 0,
    y: -14,
    scale: 1.02,
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

const sealVariants: Variants = {
  sealed: { boxShadow: "0 0 0px 0px rgba(214,178,120,0)", scale: 1 },
  lifted: {
    boxShadow: "0 0 40px 3px rgba(214,178,120,0.7)",
    scale: 1.06,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface VeilProps {
  brideName: string;
  groomName: string;
  monogram: string;
  dateDisplay: string;
  opened: boolean;
  onOpen: () => void;
}

/**
 * كشف الطرحة — the opening overlay. The invitation is covered until the
 * guest chooses to uncover it; scroll stays locked until they do (see
 * `<InvitationExperience>`).
 */
export function Veil({
  brideName,
  groomName,
  monogram,
  dateDisplay,
  opened,
  onOpen,
}: VeilProps) {
  const reduceMotion = useReducedMotion();
  const [retired, setRetired] = useState(false);

  return (
    <motion.div
      className="gt-veil fixed inset-0 z-40 origin-top overflow-hidden"
      variants={reduceMotion ? fadeVariants : veilVariants}
      initial={false}
      animate={opened ? "lifted" : "sealed"}
      onAnimationComplete={(definition) => {
        if (definition === "lifted") setRetired(true);
      }}
      style={{
        visibility: retired ? "hidden" : "visible",
        pointerEvents: retired ? "none" : "auto",
      }}
    >
      {/* Silk shimmer travelling across the fabric, over a lace weave. */}
      <div
        aria-hidden="true"
        className="gt-sheen pointer-events-none absolute inset-y-0 left-0 w-[38%]"
      />
      <div aria-hidden="true" className="gt-lace pointer-events-none absolute inset-0" />

      <motion.div
        variants={reduceMotion ? undefined : contentVariants}
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 py-10 text-center"
      >
        <Wordmark className="absolute left-1/2 top-[34px] -translate-x-1/2 font-serif text-xs uppercase tracking-[0.44em] text-gt-ink/[0.42] ps-[0.44em]" />

        <Ornament className="mb-[26px]" width="w-[38px]" />

        {/* Two layers: the outer one flares on open, the inner one breathes.
            They would fight over `transform` if they were the same element. */}
        <motion.div
          variants={reduceMotion ? undefined : sealVariants}
          className="mb-[30px] size-[98px] rounded-full"
        >
          <div className="gt-breathe flex size-full items-center justify-center rounded-full border border-gt-gold/50 bg-[radial-gradient(circle_at_50%_38%,rgba(214,178,120,0.18),transparent_70%)] [--breathe-duration:4.6s]">
            <span className="font-serif text-3xl tracking-[0.12em] text-gt-gold">
              {monogram}
            </span>
          </div>
        </motion.div>

        <p className="mb-3.5 text-xs [word-spacing:0.34em] text-gt-gold/95">
          أنتم مدعوّون لحضور حفل زفاف
        </p>

        <p className="mb-2.5 text-[clamp(34px,10vw,58px)] font-extralight leading-[1.1] text-gt-ink">
          {brideName}{" "}
          <span className="font-serif font-medium italic text-gt-gold">&amp;</span>{" "}
          {groomName}
        </p>

        <p className="mb-10 text-[15px] [word-spacing:0.16em] text-gt-ink/55">
          {dateDisplay}
        </p>

        <Button
          variant="ghost"
          onClick={onOpen}
          className="gt-pulse h-auto rounded-full border border-gt-gold/55 bg-gt-gold/[0.06] px-11 py-4 text-[15px] font-normal [word-spacing:0.08em] text-gt-gold-btn transition-[background-color,border-color] duration-400 hover:border-gt-gold/85 hover:bg-gt-gold/15 hover:text-gt-gold-btn"
        >
          اكشفوا الطرحة
        </Button>

        <p className="mt-5 text-xs [word-spacing:0.2em] text-gt-ink/[0.42]">
          المسوا لكشف الدعوة
        </p>
      </motion.div>
    </motion.div>
  );
}
