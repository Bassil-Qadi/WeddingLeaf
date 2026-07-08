"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FloatingLeaf } from "@/components/animation/floating-leaf";
import type { Invitation } from "@/types/invitation";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

interface InvitationCardProps {
  invitation: Invitation;
  onContinue: () => void;
}

/**
 * The hero reveal: an arch-topped card (dome achieved with a border-radius
 * that exceeds half the card's width, which CSS automatically clamps to a
 * perfect semicircle) rather than a flat rectangle — echoes the archway
 * silhouette from the reference without reproducing any specific
 * illustration.
 */
export function InvitationCard({ invitation, onContinue }: InvitationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex h-full w-full items-center justify-center bg-background px-4 py-8"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex h-full w-full max-w-md flex-col items-center justify-between overflow-hidden rounded-t-[9999px] rounded-b-3xl border border-primary/25 bg-card px-8 pt-16 pb-10 text-center shadow-[0_25px_70px_-30px_rgba(67,19,28,0.4)]"
      >
        <motion.div variants={item}>
          <FloatingLeaf className="text-3xl" />
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.p
            variants={item}
            className="font-heading text-xs tracking-[0.35em] text-muted-foreground uppercase"
          >
            يوم الزفاف · {invitation.dateDisplay}
          </motion.p>

          <motion.div variants={item} className="my-6 h-px w-16 bg-primary/50" />

          <motion.h1
            variants={item}
            className="font-heading text-4xl leading-relaxed text-foreground sm:text-5xl"
          >
            {invitation.groomName}
            <span className="mx-3 text-primary">&amp;</span>
            {invitation.brideName}
          </motion.h1>

          <motion.p variants={item} className="mt-5 text-sm text-muted-foreground">
            {invitation.city}
          </motion.p>
        </div>

        <motion.button
          type="button"
          onClick={onContinue}
          variants={item}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col items-center gap-1 text-primary"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <span className="text-sm font-medium">مرر للأسفل</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-5" />
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}