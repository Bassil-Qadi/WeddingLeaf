"use client";

import { motion } from "framer-motion";

interface SealButtonProps {
  monogram: string;
  isOpening: boolean;
  onTap: () => void;
}

/**
 * The tap target that replaces the old literal envelope. A soft pulsing
 * ring invites the tap; on open, the ring expands outward and the core
 * fades — reads as "unlocking" rather than "opening mail".
 */
export function SealButton({ monogram, isOpening, onTap }: SealButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={isOpening}
      aria-label="افتح الدعوة"
      className="relative flex h-28 w-28 items-center justify-center"
    >
      <motion.span
        className="absolute inset-0 rounded-full border border-primary/50"
        animate={
          isOpening
            ? { scale: 1.9, opacity: 0 }
            : { scale: [1, 1.08, 1], opacity: [0.6, 0.15, 0.6] }
        }
        transition={
          isOpening
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.span
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/90 to-primary shadow-[0_8px_30px_-8px_rgba(198,168,106,0.55)]"
        animate={
          isOpening ? { scale: 0.7, opacity: 0 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-heading text-lg text-primary-foreground">
          {monogram}
        </span>
      </motion.span>
    </button>
  );
}