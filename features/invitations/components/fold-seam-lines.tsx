"use client";

import { motion } from "framer-motion";

export function FoldSeamLines({ isOpening }: { isOpening: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      animate={{ opacity: isOpening ? 0 : 1 }}
      transition={{ duration: 0.25 }}
    >
      {(
        [
          [0, 0],
          [100, 0],
          [0, 100],
          [100, 100],
        ] as const
      ).map(([x, y]) => (
        <line
          key={`${x}-${y}`}
          x1={x}
          y1={y}
          x2={50}
          y2={50}
          stroke="var(--primary)"
          strokeOpacity="0.35"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </motion.svg>
  );
}