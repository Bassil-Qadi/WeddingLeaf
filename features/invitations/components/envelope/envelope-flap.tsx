"use client";

import { motion } from "framer-motion";

type Props = {
  opened: boolean;
};

export function EnvelopeFlap({ opened }: Props) {
  return (
    <motion.div
      animate={{
        rotateX: opened ? 180 : 0,
      }}
      transition={{
        duration: 0.8,
      }}
      style={{
        transformOrigin: "top",
      }}
      className="
        absolute
        inset-x-0
        top-0
        h-32
        bg-[#DCC8AD]
        border-b
        [clip-path:polygon(0_0,100%_0,50%_100%)]
      "
    />
  );
}