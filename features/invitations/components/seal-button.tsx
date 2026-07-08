"use client";

import { motion } from "framer-motion";
import { WaxSeal } from "./wax-seal";

interface SealButtonProps {
  monogram: string;
  isOpening: boolean;
  onTap: () => void;
}

/**
 * The wax-seal tap target at the centre of the closed envelope. A warm halo
 * breathes to invite the tap; on open the seal presses in and lifts away as
 * a burst of golden light blooms from behind it and the flaps begin to peel.
 */
export function SealButton({ monogram, isOpening, onTap }: SealButtonProps) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={isOpening}
      aria-label="اضغط لفتح الدعوة"
      className="group relative flex h-32 w-32 items-center justify-center outline-none"
    >
      {/* breathing halo behind the seal */}
      <span
        className="pointer-events-none absolute h-28 w-28 rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(circle, var(--inv-gold-glow) 0%, transparent 70%)",
          animation: isOpening ? "none" : "inv-seal-glow 2.6s ease-in-out infinite",
        }}
      />

      {/* golden burst on open */}
      <motion.span
        className="pointer-events-none absolute rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, var(--inv-gold-glow) 0%, rgba(244,214,155,0.5) 40%, transparent 72%)",
        }}
        initial={false}
        animate={
          isOpening
            ? { width: 360, height: 360, opacity: [0, 0.95, 0] }
            : { width: 112, height: 112, opacity: 0 }
        }
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      {/* the seal itself */}
      <motion.span
        className="relative flex h-24 w-24 items-center justify-center"
        initial={false}
        animate={
          isOpening
            ? { scale: [1, 0.86, 1.05], opacity: [1, 1, 0] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
      >
        <WaxSeal
          className="h-full w-full drop-shadow-[0_10px_22px_rgba(60,15,25,0.5)]"
          monogram={monogram}
          monogramSize={26}
        />
      </motion.span>
    </button>
  );
}
