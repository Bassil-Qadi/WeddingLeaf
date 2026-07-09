"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { riseIn } from "../lib/motion";

interface RevealProps {
  children: ReactNode;
  /** Stagger within a chapter, in seconds. */
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Rises its children into place the first time they enter the reading zone.
 * Under reduced motion the content is simply there — the reveal carries no
 * information, so there is nothing to replace it with.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 1,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={riseIn(delay, duration)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}
