"use client";

import { motion } from "framer-motion";
import { usePointerParallax } from "../hooks/use-pointer-parallax";

/**
 * Fixed grain over the whole page. Multiply-blended fractal noise is what
 * stops a flat ivory fill from reading as a screen instead of as paper.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="gt-grain pointer-events-none fixed inset-0 z-[6]"
    />
  );
}

/**
 * Hand-placed so the drift never clumps and never changes between server and
 * client. `size` is px; `duration`/`delay` are seconds.
 */
const MOTES = [
  { left: "12%", top: "70%", size: 3, duration: 11, delay: 0.2 },
  { left: "24%", top: "88%", size: 2, duration: 14, delay: 1.5 },
  { left: "38%", top: "64%", size: 4, duration: 16, delay: 0.8 },
  { left: "52%", top: "92%", size: 2, duration: 12, delay: 2.4 },
  { left: "63%", top: "76%", size: 3, duration: 15, delay: 0.4 },
  { left: "74%", top: "84%", size: 2, duration: 13, delay: 3.1 },
  { left: "85%", top: "68%", size: 3, duration: 17, delay: 1.1 },
  { left: "18%", top: "96%", size: 3, duration: 14, delay: 2.7 },
  { left: "44%", top: "80%", size: 2, duration: 12.5, delay: 1.9 },
  { left: "92%", top: "90%", size: 3, duration: 15.5, delay: 0.6 },
] as const;

/** Gold dust drifting slowly upward, drifting further as the pointer moves. */
export function GoldMotes() {
  const parallax = usePointerParallax(12);

  return (
    <motion.div
      aria-hidden="true"
      style={parallax}
      className="pointer-events-none fixed inset-0 z-[3] overflow-hidden"
    >
      {MOTES.map((mote) => (
        <span
          key={mote.left + mote.top}
          className="gt-mote absolute"
          style={
            {
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              "--mote-duration": `${mote.duration}s`,
              "--mote-delay": `${mote.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  );
}

/** The product's mark, whispered at the top of every screen. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={
        className ??
        "pointer-events-none fixed inset-x-0 top-[22px] z-[5] text-center font-serif text-xs uppercase tracking-[0.42em] text-gt-ink/40 ps-[0.42em]"
      }
    >
      WeddingLeaf
    </div>
  );
}
