"use client";

import { motion } from "framer-motion";
import { FloatingLeaf } from "@/components/animation/floating-leaf";
import { SealButton } from "./seal-button";
import type { Invitation } from "@/types/invitation";

interface CoverScreenProps {
  invitation: Invitation;
  isOpening: boolean;
  onOpen: () => void;
}

/**
 * Full-bleed cover screen shown before the guest opens the invitation.
 * The entire viewport is styled as part of the invitation (not a small
 * icon floating on empty space) — a teaser of the couple's names, a
 * decorative frame, and the seal button as the single interactive
 * element.
 */
export function CoverScreen({ invitation, isOpening, onOpen }: CoverScreenProps) {
  const monogram = `${invitation.groomName.charAt(0)} ${invitation.brideName.charAt(0)}`;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-background via-background to-muted px-6 py-14 text-center"
    >
      <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-primary/20" />

      <FloatingLeaf className="absolute left-6 top-12 text-2xl opacity-70" />
      <FloatingLeaf className="absolute right-6 bottom-20 text-2xl opacity-70" />

      <div className="mt-10 flex flex-col items-center gap-3">
        <p className="font-heading text-xs tracking-[0.35em] text-muted-foreground uppercase">
          أنتم مدعوون
        </p>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">
          {invitation.groomName}
          <span className="mx-2 text-primary">&amp;</span>
          {invitation.brideName}
        </h2>
      </div>

      <SealButton monogram={monogram} isOpening={isOpening} onTap={onOpen} />

      <motion.p
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 text-sm text-muted-foreground"
      >
        اضغط لفتح الدعوة
      </motion.p>
    </motion.div>
  );
}