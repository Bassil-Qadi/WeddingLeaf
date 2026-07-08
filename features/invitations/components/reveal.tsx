"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Fade-and-rise a block into view the first time it scrolls on-screen — the
 * gentle entrance every invitation section shares. Respects the amount of
 * the element that must be visible before firing.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
