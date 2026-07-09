"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import { EASE_CONTENT } from "../lib/motion";
import { usePointerParallax } from "../hooks/use-pointer-parallax";
import { Ornament } from "./ornament";
import { ThreadNode } from "./thread-node";

/**
 * The hero enters when the veil lifts, not when the page loads — the names
 * should be rising into place as the fabric clears them.
 */
function entrance(delay: number, duration = 1.2) {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      // 0.9s: mid-lift, while the veil is still travelling.
      transition: { duration, delay: 0.9 + delay, ease: EASE_CONTENT },
    },
  };
}

interface HeroProps {
  brideName: string;
  groomName: string;
  /** Node index on the thread — the hero holds the origin knot. */
  nodeIndex: number;
  message?: string;
  city: string;
  dateDisplay: string;
  opened: boolean;
}

export function Hero({
  brideName,
  groomName,
  nodeIndex,
  message,
  city,
  dateDisplay,
  opened,
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const aura = usePointerParallax(30);

  const animate = opened || reduceMotion ? "visible" : "hidden";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-2 py-[16vh] text-center">
      <motion.div
        aria-hidden="true"
        style={aura}
        className="pointer-events-none absolute inset-x-0 -inset-y-[20%] z-0 bg-[radial-gradient(46%_34%_at_50%_44%,rgba(214,178,120,0.16),transparent_70%)]"
      />

      {/* Where the thread is born. */}
      <ThreadNode
        index={nodeIndex}
        kind="origin"
        className="left-1/2 top-[calc(100%-150px)]"
      />

      <motion.div
        initial="hidden"
        animate={animate}
        variants={entrance(0, 1.1)}
        className="relative z-[1] mb-[26px] font-serif text-xs uppercase tracking-[0.5em] text-gt-gold/95 ps-[0.5em]"
      >
        بطاقة دعوة
      </motion.div>

      <motion.h1
        initial="hidden"
        animate={animate}
        variants={entrance(0.18)}
        className="relative z-[1] leading-[1.05]"
      >
        <span className="block text-[clamp(52px,15vw,104px)] font-extralight -tracking-[0.01em] text-gt-ink">
          {brideName}
        </span>
        <span className="gt-amp my-0.5 block font-serif text-[clamp(30px,8vw,52px)] italic">
          &amp;
        </span>
        <span className="block text-[clamp(52px,15vw,104px)] font-extralight -tracking-[0.01em] text-gt-ink">
          {groomName}
        </span>
      </motion.h1>

      <motion.div initial="hidden" animate={animate} variants={entrance(0.38)}>
        <Ornament className="relative z-[1] mt-[30px] gap-3.5" />
      </motion.div>

      <motion.p
        initial="hidden"
        animate={animate}
        variants={entrance(0.5)}
        className="relative z-[1] mx-auto mt-[22px] max-w-[360px] text-[clamp(15px,4.2vw,18px)] font-light leading-[1.9] text-gt-ink/[0.66]"
      >
        {message ?? "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر"}
        <br />
        <span className="font-serif text-sm tracking-[0.14em] text-gt-gold/90">
          {city} · {dateDisplay}
        </span>
      </motion.p>

      <motion.div
        initial="hidden"
        animate={animate}
        variants={entrance(0.7, 1)}
        className="absolute inset-x-0 bottom-11 z-[1] flex flex-col items-center gap-3"
      >
        <span className="text-xs tracking-[0.24em] text-gt-ink/50">
          تابعوا الخيط
        </span>
        <motion.span
          animate={
            reduceMotion ? undefined : { y: [0, 8, 0], opacity: [0.4, 0.95, 0.4] }
          }
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
          className="text-gt-gold"
        >
          <ChevronsDown className="size-[18px]" strokeWidth={1.3} />
        </motion.span>
      </motion.div>
    </section>
  );
}
