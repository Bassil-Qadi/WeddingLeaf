"use client";

import { motion } from "framer-motion";
import { FloatingLeaf } from "@/components/animation/floating-leaf";
import type { Invitation } from "@/types/invitation";

interface InvitationCardProps {
  invitation: Invitation;
  stage: "hidden" | "revealing" | "open";
}

export function InvitationCard({ invitation, stage }: InvitationCardProps) {
  const isVisible = stage !== "hidden";
  const isOpen = stage === "open";

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[80vw] max-w-[340px] -translate-x-1/2 rounded-lg border border-border bg-card px-6 py-10 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]"
      initial={{ y: "10%", opacity: 0, scale: 0.92 }}
      animate={
        isOpen
          ? { y: "-50%", opacity: 1, scale: 1.08 }
          : isVisible
            ? { y: "-58%", opacity: 1, scale: 1 }
            : { y: "10%", opacity: 0, scale: 0.92 }
      }
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: isVisible ? 20 : 0 }}
    >
      <FloatingLeaf className="absolute -top-4 right-4 text-2xl" />

      <p className="font-heading text-sm tracking-[0.3em] text-muted-foreground uppercase">
        دعوة زفاف
      </p>

      <motion.h1
        className="mt-4 font-heading text-3xl leading-relaxed text-foreground sm:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {invitation.groomName}
        <span className="mx-2 text-primary">&amp;</span>
        {invitation.brideName}
      </motion.h1>

      <motion.p
        className="mt-6 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {invitation.dateDisplay} · {invitation.city}
      </motion.p>
    </motion.div>
  );
}