"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DoorHalfProps {
  side: "left" | "right";
  isOpening: boolean;
}

/**
 * One half of the 3D "double door" cover. Rotates open around its OUTER
 * edge (the screen edge), like a real door swinging away — not a generic
 * fade. backfaceVisibility hidden means it visually disappears once
 * rotated past ~90°, so there's no jarring "mirrored" flash mid-turn.
 */
export function DoorHalf({ side, isOpening }: DoorHalfProps) {
  const isLeft = side === "left";

  return (
    <motion.div
      className={cn(
        "absolute inset-y-0 w-1/2 overflow-hidden bg-gradient-to-b from-background via-background to-muted",
        isLeft ? "left-0 origin-left" : "right-0 origin-right",
      )}
      style={{ backfaceVisibility: "hidden" }}
      animate={{ rotateY: isOpening ? (isLeft ? -105 : 105) : 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "absolute inset-0",
          isLeft
            ? "bg-[radial-gradient(circle_at_100%_50%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_62%)]"
            : "bg-[radial-gradient(circle_at_0%_50%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_62%)]",
        )}
      />

      <div className="pointer-events-none absolute inset-6 rounded-[1.5rem] border border-primary/15" />

      <div
        className={cn(
          "absolute inset-y-6 w-px bg-primary/40",
          isLeft ? "right-6" : "left-6",
        )}
      />
    </motion.div>
  );
}