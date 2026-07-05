"use client";

import { motion } from "framer-motion";
import { WaxSeal } from "./wax-seal";

interface EnvelopeProps {
  isOpening: boolean;
}

/**
 * Renders the closed envelope: a body (the pocket) + a flap that flips
 * open like a real envelope lid. The flap uses a real 3D rotation
 * (rotateX) around its top edge, with perspective set on the parent so it
 * reads as genuinely three-dimensional rather than a flat squash.
 */
export function Envelope({ isOpening }: EnvelopeProps) {
  return (
    <div
      className="relative w-[78vw] max-w-[320px] aspect-[4/3]"
      style={{ perspective: 1200 }}
    >
      {/* Envelope body (back + side pockets) */}
      <div className="absolute inset-0 rounded-md bg-card shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card to-muted" />
        {/* left/right pocket fold lines for realism */}
        <div className="absolute inset-0 [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)] bg-black/[0.03]" />
      </div>

      {/* Flap — pivots open around its top edge */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[58%] origin-top"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: isOpening ? -178 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary [clip-path:polygon(0_0,100%_0,50%_100%)]"
          style={{ backfaceVisibility: "hidden" }}
        />
      </motion.div>

      {/* Wax seal — sits at the flap's tip, fades out as it opens */}
      <motion.div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 drop-shadow-md"
        animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 0.6 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <WaxSeal className="w-full h-full" />
      </motion.div>
    </div>
  );
}