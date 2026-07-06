"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Corner = "tl" | "tr" | "bl" | "br";

interface QuadrantPanelProps {
  corner: Corner;
  isOpening: boolean;
}

interface CornerConfig {
  position: string;
  origin: string;
  glow: string;
  exit: { x: string; y: string; rotateX: number; rotateY: number };
}

/**
 * Each panel pivots from the screen's outer corner (its transform-origin)
 * and flies diagonally off-screen with a 3D tilt (rotateX + rotateY) —
 * reads as the whole screen breaking open into four pieces, rather than
 * a flat fade or a flat 2D slide.
 */
const CORNER_CONFIG: Record<Corner, CornerConfig> = {
  tl: {
    position: "top-0 left-0",
    origin: "origin-top-left",
    glow:
      "bg-[radial-gradient(circle_at_100%_100%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_65%)]",
    exit: { x: "-55%", y: "-55%", rotateX: -14, rotateY: -14 },
  },
  tr: {
    position: "top-0 right-0",
    origin: "origin-top-right",
    glow:
      "bg-[radial-gradient(circle_at_0%_100%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_65%)]",
    exit: { x: "55%", y: "-55%", rotateX: -14, rotateY: 14 },
  },
  bl: {
    position: "bottom-0 left-0",
    origin: "origin-bottom-left",
    glow:
      "bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_65%)]",
    exit: { x: "-55%", y: "55%", rotateX: 14, rotateY: -14 },
  },
  br: {
    position: "bottom-0 right-0",
    origin: "origin-bottom-right",
    glow:
      "bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_65%)]",
    exit: { x: "55%", y: "55%", rotateX: 14, rotateY: 14 },
  },
};

export function QuadrantPanel({ corner, isOpening }: QuadrantPanelProps) {
  const config = CORNER_CONFIG[corner];

  return (
    <motion.div
      className={cn(
        "absolute h-1/2 w-1/2 overflow-hidden bg-gradient-to-b from-background via-background to-muted",
        config.position,
        config.origin,
      )}
      style={{ backfaceVisibility: "hidden" }}
      animate={
        isOpening
          ? { ...config.exit, opacity: 0 }
          : { x: "0%", y: "0%", rotateX: 0, rotateY: 0, opacity: 1 }
      }
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={cn("absolute inset-0", config.glow)} />
      <div className="pointer-events-none absolute inset-6 rounded-[1.5rem] border border-primary/15" />
    </motion.div>
  );
}