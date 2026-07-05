"use client";

import { motion } from "framer-motion";

type FloatingLeafProps = {
  className?: string;
};

export function FloatingLeaf({
  className,
}: FloatingLeafProps) {
  return (
    <motion.div
      animate={{
        y: [-10, 12, -10],
        rotate: [-8, 8, -8],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      🌿
    </motion.div>
  );
}