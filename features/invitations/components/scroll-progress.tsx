"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A hairline gilt bar across the top of the viewport that fills as the guest
 * reads down the invitation. Grows from the right edge to sit naturally with
 * the RTL reading direction. Spring-smoothed so it glides rather than jumps.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--inv-gold-deep), var(--inv-gold-glow), var(--inv-gold))",
        boxShadow: "0 1px 8px -1px rgba(201,162,74,0.7)",
      }}
    />
  );
}
