"use client";
import { EnvelopeFlap } from "./envelope-flap";
import { motion } from "framer-motion";

type Props = {
  opened: boolean;
  onOpen: () => void;
}

export function Envelope({
  onOpen,
  opened,
}: Props) {
  return (
    <motion.button
      whileHover={{
        scale: 1.03,
        y: -6
      }}
      onClick={onOpen}
      className="
        relative
        h-64
        w-80
        rounded-2xl
        bg-[#EADCC8]
        shadow-xl
        transition
        hover:scale-105
        before:absolute
before:inset-0
before:rounded-2xl
before:bg-primary/10
before:blur-xl
before:-z-10
      "
    >
      <EnvelopeFlap opened={opened} />
    </motion.button>
  );
}