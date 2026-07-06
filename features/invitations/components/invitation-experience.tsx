"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { DoorHalf } from "./door-half";
import { SealButton } from "./seal-button";
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
      const timer = setTimeout(() => setStage("open"), 850);
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
            <DoorHalf side="left" isOpening={stage === "opening"} />
            <DoorHalf side="right" isOpening={stage === "opening"} />
          </div>

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