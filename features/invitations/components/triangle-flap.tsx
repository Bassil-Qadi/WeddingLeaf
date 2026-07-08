"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

interface TriangleFlapProps {
  side: Side;
  isOpening: boolean;
}

interface SideConfig {
  clipPath: string;
  origin: string;
  shade: string;
  rotate: { rotateX?: number; rotateY?: number };
}

/**
 * The classic four-triangle envelope back (top/bottom/left/right meeting
 * at the exact center). Each flap hinges from its own screen edge and
 * folds open in real 3D — top/bottom tilt on rotateX, left/right on
 * rotateY — like a flower blooming open, not a flat fade.
 */
const SIDE_CONFIG: Record<Side, SideConfig> = {
  top: {
    clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)",
    origin: "50% 0%",
    // slightly bolder / darker — reads as the top-most fold catching shadow
    shade: "bg-black/[0.08]",
    rotate: { rotateX: -112 },
  },
  bottom: {
    clipPath: "polygon(0% 100%, 100% 100%, 50% 50%)",
    origin: "50% 100%",
    // catches light — subtly brighter than the rest
    shade: "bg-white/[0.35]",
    rotate: { rotateX: 112 },
  },
  left: {
    clipPath: "polygon(0% 0%, 0% 100%, 50% 50%)",
    origin: "0% 50%",
    shade: "bg-black/[0.02]",
    rotate: { rotateY: -112 },
  },
  right: {
    clipPath: "polygon(100% 0%, 100% 100%, 50% 50%)",
    origin: "100% 50%",
    shade: "bg-black/[0.02]",
    rotate: { rotateY: 112 },
  },
};

export function TriangleFlap({ side, isOpening }: TriangleFlapProps) {
  const config = SIDE_CONFIG[side];

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        clipPath: config.clipPath,
        transformOrigin: config.origin,
        backfaceVisibility: "hidden",
      }}
      animate={
        isOpening
          ? { rotateX: config.rotate.rotateX ?? 0, rotateY: config.rotate.rotateY ?? 0 }
          : { rotateX: 0, rotateY: 0 }
      }
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted" />

      {/* subtle paper texture */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 8px, color-mix(in oklch, var(--primary) 7%, transparent) 8px, color-mix(in oklch, var(--primary) 7%, transparent) 9px)",
        }}
      />

      {/* directional shading described: top = bolder/darker, bottom = lighter */}
      <div className={cn("absolute inset-0", config.shade)} />
    </motion.div>
  );
}