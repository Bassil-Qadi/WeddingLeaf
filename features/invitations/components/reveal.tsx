"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { EASE_OUT, inView, riseItem, staggerParent } from "../lib/anim";

/**
 * Fade-and-rise a block into view the first time it scrolls on-screen — the
 * gentle entrance every invitation section shares.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
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
      viewport={inView}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A container whose direct {@link RevealItem} children cascade into view one
 * after another when the group first scrolls on-screen.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {children}
    </motion.div>
  );
}

/** A single element in a {@link RevealGroup} cascade. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={riseItem}>
      {children}
    </motion.div>
  );
}
