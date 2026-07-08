"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { EASE_OUT, inView } from "../../lib/anim";

function Flourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 20"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="var(--inv-gold)"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M2 10 H 40" opacity="0.7" />
      <path
        d="M40 10 q 6 -6 12 -3 q -5 1 -6 3 q 1 2 6 3 q -6 3 -12 -3 Z"
        fill="var(--inv-gold)"
        fillOpacity="0.5"
      />
      <circle cx="2" cy="10" r="1.4" fill="var(--inv-gold)" stroke="none" />
    </svg>
  );
}

/**
 * A script section heading rendered in brushed-gold foil and flanked by
 * mirrored flourishes that draw outward as the title scrolls into view — the
 * recurring "Schedule" / "Location" / "RSVP" title treatment, elevated.
 */
export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      <motion.span
        className="origin-right"
        variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1 } }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <Flourish className="h-4 w-12 scale-x-[-1] opacity-90" />
      </motion.span>

      <motion.h2
        className="inv-foil font-heading text-2xl leading-tight sm:text-3xl"
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
      >
        {children}
      </motion.h2>

      <motion.span
        className="origin-left"
        variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1 } }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <Flourish className="h-4 w-12 opacity-90" />
      </motion.span>
    </motion.div>
  );
}
