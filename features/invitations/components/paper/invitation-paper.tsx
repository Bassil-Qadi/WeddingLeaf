"use client";

import { motion } from "framer-motion";
import { motion as motionPreset } from "@/config/motion";

type Props = {
  opened: boolean;
};

export function InvitationPaper({
  opened,
}: Props) {
  return (
    <motion.div
      animate={{
        y: opened ? -60 : 0,
        opacity: opened ? 1 : 0,
        scale: opened ? 1 : 0.95,
      }}
      transition={motionPreset.luxury}
      className="
        absolute
        left-1/2
        top-8
        h-[420px]
        w-[320px]
        -translate-x-1/2
        rounded-3xl
        border
        bg-white
        shadow-2xl
      "
    >
      <div className="flex h-full items-center justify-center">

        Invitation

      </div>
    </motion.div>
  );
}