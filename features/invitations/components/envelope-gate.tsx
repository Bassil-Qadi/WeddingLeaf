"use client";

import { motion } from "framer-motion";

import { EnvelopeFlap } from "./envelope-flap";
import { SealButton } from "./seal-button";

const SIDES = ["top", "bottom", "left", "right"] as const;

interface EnvelopeGateProps {
  monogram: string;
  isOpening: boolean;
  onOpen: () => void;
}

/**
 * The closed envelope that greets every guest — a full-screen blush card of
 * four embossed flaps sealed with wax. Tapping the seal peels the flaps open
 * in 3-D and dissolves the gate to reveal the invitation beneath. Presented
 * as an overlay so the reveal (the hero) can already be sitting behind it.
 */
export function EnvelopeGate({ monogram, isOpening, onOpen }: EnvelopeGateProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ perspective: 1600 }}
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* the four peeling flaps (they fully tile the screen when closed) */}
      {SIDES.map((side) => (
        <EnvelopeFlap key={side} side={side} isOpening={isOpening} />
      ))}

      {/* seal + invitation hint, sitting above the flaps */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <SealButton monogram={monogram} isOpening={isOpening} onTap={onOpen} />

        <motion.p
          className="mt-6 font-sans text-sm tracking-wide text-[var(--inv-wine)]/70"
          initial={false}
          animate={{ opacity: isOpening ? 0 : [0, 1] }}
          transition={{ duration: isOpening ? 0.3 : 1.2, delay: isOpening ? 0 : 0.4 }}
        >
          اضغط على الختم لفتح الدعوة
        </motion.p>
      </div>
    </motion.div>
  );
}
