"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { TriangleFlap } from "./triangle-flap";
import { SealButton } from "./seal-button";
import { InvitationCard } from "./invitation-card";
import { FoldSeamLines } from "./fold-seam-lines";
import type { Invitation } from "@/types/invitation";

type Stage = "closed" | "opening" | "open";

const SIDES = ["top", "bottom", "left", "right"] as const;

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
          {/* light glowing from inside as the flaps separate */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
            animate={{
              opacity: stage === "opening" ? [0, 1, 0] : 0,
              scale: stage === "opening" ? [0.4, 1.6] : 0.4,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_55%,transparent),transparent_70%)] blur-xl" />
          </motion.div>

          <div className="absolute inset-0 z-10" style={{ perspective: 2000 }}>
            {SIDES.map((side) => (
              <TriangleFlap
                key={side}
                side={side}
                isOpening={stage === "opening"}
              />
            ))}
          </div>

          <FoldSeamLines isOpening={stage === "opening"} />

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