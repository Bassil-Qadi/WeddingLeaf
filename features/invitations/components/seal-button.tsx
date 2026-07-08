"use client";

import { motion } from "framer-motion";
import { WaxSeal } from "./wax-seal";

interface SealButtonProps {
  monogram: string;
  isOpening: boolean;
  onTap: () => void;
}

/**
 * The wax-seal tap target sitting at the center of the closed envelope.
 * A soft gold ring pulses to invite the tap; on open, the seal presses
 * in and fades as the fold lines light up behind it.
 */
export function SealButton({ monogram, isOpening, onTap }: SealButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={isOpening}
      aria-label="افتح الدعوة"
      className="relative flex h-24 w-24 items-center justify-center"
    >
      <motion.span
        className="absolute inset-0 rounded-full border border-primary/50"
        animate={
          isOpening
            ? { scale: 1.7, opacity: 0 }
            : { scale: [1, 1.08, 1], opacity: [0.6, 0.15, 0.6] }
        }
        transition={
          isOpening
            ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.span
        className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center drop-shadow-[0_6px_16px_rgba(67,19,28,0.45)]"
        animate={
          isOpening ? { scale: 0.75, opacity: 0 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <WaxSeal className="absolute inset-0 h-full w-full" />
        <span className="relative font-heading text-base tracking-wide text-[#f3efe6]">
          {monogram}
        </span>
      </motion.span>
    </button>
  );
}