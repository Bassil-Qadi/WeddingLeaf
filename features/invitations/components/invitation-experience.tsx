"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Envelope } from "./envelope";
import { InvitationCard } from "./invitation-card";
import type { Invitation } from "@/types/invitation";

type Stage = "closed" | "opening" | "revealing" | "open";

interface InvitationExperienceProps {
  invitation: Invitation;
}

export function InvitationExperience({
  invitation,
}: InvitationExperienceProps) {
  const [stage, setStage] = useState<Stage>("closed");

  // Auto-advance through the sequence once the guest taps to open.
  useEffect(() => {
    if (stage === "opening") {
      const timer = setTimeout(() => setStage("revealing"), 950);
      return () => clearTimeout(timer);
    }
    if (stage === "revealing") {
      const timer = setTimeout(() => setStage("open"), 950);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleOpen = () => {
    if (stage === "closed") setStage("opening");
  };

  const handleContinue = () => {
    document
      .getElementById("invitation-details")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted px-4">
      {/* Envelope + card sequence */}
      <div className="relative flex w-full flex-1 items-center justify-center">
        <button
          type="button"
          onClick={handleOpen}
          disabled={stage !== "closed"}
          className="group relative"
          aria-label="افتح الدعوة"
        >
          <Envelope isOpening={stage !== "closed"} />
        </button>

        <InvitationCard
          invitation={invitation}
          stage={
            stage === "closed"
              ? "hidden"
              : stage === "opening"
                ? "hidden"
                : stage === "revealing"
                  ? "revealing"
                  : "open"
          }
        />
      </div>

      {/* Tap hint — only while closed */}
      <AnimatePresence>
        {stage === "closed" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-10 text-sm text-muted-foreground"
          >
            اضغط على الظرف لفتح الدعوة
          </motion.p>
        )}
      </AnimatePresence>

      {/* Continue CTA — only once the card has fully opened */}
      <AnimatePresence>
        {stage === "open" && (
          <motion.button
            type="button"
            onClick={handleContinue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mb-10 flex flex-col items-center gap-1 text-primary"
          >
            <span className="text-sm font-medium">اكتشف التفاصيل</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="size-5" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}