"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { QuadrantPanel } from "./quadrant-panel";
import { SealButton } from "./seal-button";
import { InvitationCard } from "./invitation-card";
import type { Invitation } from "@/types/invitation";

type Stage = "closed" | "opening" | "open";

const CORNERS = ["tl", "tr", "bl", "br"] as const;

interface InvitationExperienceProps {
  invitation: Invitation;
}

export function InvitationExperience({ invitation }: InvitationExperienceProps) {
  const [stage, setStage] = useState<Stage>("closed");

  useEffect(() => {
    if (stage === "opening") {
      const timer = setTimeout(() => setStage("open"), 900);
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

  const monogram = `${invitation.groomName.charAt(0)} ${invitation.brideName.charAt(0)}`;

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background">
      <AnimatePresence>
        {stage === "open" && (
          <InvitationCard invitation={invitation} onContinue={handleContinue} />
        )}
      </AnimatePresence>

      {stage !== "open" && (
        <>
          <div className="absolute inset-0 z-10" style={{ perspective: 2000 }}>
            {CORNERS.map((corner) => (
              <QuadrantPanel
                key={corner}
                corner={corner}
                isOpening={stage === "opening"}
              />
            ))}
          </div>

          {/* center seam cross-hair — ties the four panels into one design */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            animate={{ opacity: stage === "opening" ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-primary/40" />
            <div className="absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-primary/40" />
          </motion.div>

          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <SealButton
              monogram={monogram}
              isOpening={stage === "opening"}
              onTap={handleOpen}
            />
          </div>
        </>
      )}
    </section>
  );
}