"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Envelope } from "./envelope";
import { InvitationCard } from "./invitation-card";
import type { Invitation } from "@/types/invitation";

type Stage = "closed" | "opening" | "open";

interface InvitationExperienceProps {
  invitation: Invitation;
}

export function InvitationExperience({ invitation }: InvitationExperienceProps) {
  const [stage, setStage] = useState<Stage>("closed");

  useEffect(() => {
    if (stage === "opening") {
      const timer = setTimeout(() => setStage("open"), 600);
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
    <section className="relative h-dvh w-full overflow-hidden bg-background">
      <AnimatePresence>
        {stage !== "open" && (
          <motion.div
            key="envelope-wrap"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-4"
          >
            <button
              type="button"
              onClick={handleOpen}
              disabled={stage !== "closed"}
              aria-label="افتح الدعوة"
            >
              <Envelope isOpening={stage === "opening"} />
            </button>

            <AnimatePresence>
              {stage === "closed" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  اضغط على الظرف لفتح الدعوة
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "open" && (
          <InvitationCard invitation={invitation} onContinue={handleContinue} />
        )}
      </AnimatePresence>
    </section>
  );
}