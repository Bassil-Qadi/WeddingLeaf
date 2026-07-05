"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Invitation } from "@/types/invitation";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
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
 * Full-screen invitation reveal. Only `opacity` and `scale` are animated
 * on the root element — both are compositor-only properties, so this
 * stays smooth even on lower-end phones. It grows from the center of the
 * screen to fill it completely, landing edge-to-edge.
 */
export function InvitationCard({ invitation, onContinue }: InvitationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex h-full w-full flex-col items-center justify-between bg-gradient-to-b from-background via-background to-muted px-6 py-14 text-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-1 flex-col items-center justify-center"
      >
        <motion.p
          variants={item}
          className="font-heading text-xs tracking-[0.35em] text-muted-foreground uppercase"
        >
          دعوة زفاف
        </motion.p>

        <motion.div variants={item} className="my-5 h-px w-16 bg-primary/60" />

        <motion.h1
          variants={item}
          className="font-heading text-4xl leading-relaxed text-foreground sm:text-5xl"
        >
          {invitation.groomName}
          <span className="mx-3 text-primary">&amp;</span>
          {invitation.brideName}
        </motion.h1>

        <motion.p variants={item} className="mt-5 text-sm text-muted-foreground">
          {invitation.dateDisplay} · {invitation.city}
        </motion.p>
      </motion.div>

      <motion.button
        type="button"
        onClick={onContinue}
        variants={item}
        initial="hidden"
        animate="show"
        transition={{ delay: 1, duration: 0.5 }}
        className="flex flex-col items-center gap-1 text-primary"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <span className="text-sm font-medium">اكتشف التفاصيل</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}