"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { CoverScreen } from "./cover-screen";
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
      const timer = setTimeout(() => setStage("open"), 500);
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
          <CoverScreen
            key="cover"
            invitation={invitation}
            isOpening={stage === "opening"}
            onOpen={handleOpen}
          />
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