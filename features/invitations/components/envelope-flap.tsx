"use client";

import { motion } from "framer-motion";
import { DamaskTexture } from "./decor/damask-texture";

type Side = "top" | "bottom" | "left" | "right";

interface EnvelopeFlapProps {
  side: Side;
  isOpening: boolean;
}

interface SideConfig {
  clip: string;
  origin: string;
  open: { rotateX?: number; rotateY?: number };
  /** directional paper tint: top in shadow, bottom catching light */
  tint: string;
  /** slight stagger so the flaps don't all peel in perfect lockstep */
  delay: number;
}

const SIDE_CONFIG: Record<Side, SideConfig> = {
  top: {
    clip: "polygon(0% 0%, 100% 0%, 50% 50%)",
    origin: "50% 0%",
    open: { rotateX: -168 },
    tint: "rgba(60,30,34,0.10)",
    delay: 0,
  },
  bottom: {
    clip: "polygon(0% 100%, 100% 100%, 50% 50%)",
    origin: "50% 100%",
    open: { rotateX: 168 },
    tint: "rgba(255,244,238,0.14)",
    delay: 0.06,
  },
  left: {
    clip: "polygon(0% 0%, 0% 100%, 50% 50%)",
    origin: "0% 50%",
    open: { rotateY: 168 },
    tint: "rgba(60,30,34,0.05)",
    delay: 0.04,
  },
  right: {
    clip: "polygon(100% 0%, 100% 100%, 50% 50%)",
    origin: "100% 50%",
    open: { rotateY: -168 },
    tint: "rgba(60,30,34,0.05)",
    delay: 0.04,
  },
};

/**
 * One triangular flap of the closed envelope. All four share an apex at the
 * dead-centre of the screen and hinge from their own outer edge, so on open
 * they peel outward in real 3-D — a flower blooming rather than a flat fade.
 * Warm light gathers along the central seam and flares as the flaps part.
 */
export function EnvelopeFlap({ side, isOpening }: EnvelopeFlapProps) {
  const config = SIDE_CONFIG[side];

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        clipPath: config.clip,
        transformOrigin: config.origin,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      initial={false}
      animate={{
        rotateX: isOpening ? config.open.rotateX ?? 0 : 0,
        rotateY: isOpening ? config.open.rotateY ?? 0 : 0,
      }}
      transition={{
        duration: 1.15,
        ease: [0.5, 0, 0.2, 1],
        delay: isOpening ? config.delay : 0,
      }}
    >
      {/* blush paper */}
      <div className="absolute inset-0 bg-[var(--inv-paper)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 140% at 50% 50%, var(--inv-paper-light) 0%, var(--inv-paper) 45%, var(--inv-paper-deep) 100%)",
        }}
      />

      {/* embossed damask */}
      <DamaskTexture className="absolute inset-0 h-full w-full" opacity={0.55} />

      {/* directional shading */}
      <div className="absolute inset-0" style={{ background: config.tint }} />

      {/* warm light gathering at the central seam */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--inv-gold-glow) 0%, transparent 22%)",
          mixBlendMode: "screen",
        }}
        initial={false}
        animate={{ opacity: isOpening ? [0.35, 1, 0.7] : 0.12 }}
        transition={{ duration: 1.15, ease: "easeOut" }}
      />

      {/* crisp fold hairline down the two inner edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, transparent 49.6%, rgba(120,60,50,0.18) 50%, transparent 50.4%)",
        }}
      />
    </motion.div>
  );
}
