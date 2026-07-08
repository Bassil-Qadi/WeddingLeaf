"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { EnvelopeGate } from "./envelope-gate";
import { ScrollProgress } from "./scroll-progress";
import { AmbientPetals } from "./decor/ambient-petals";
import { HeroArch } from "./sections/hero-arch";
import { BlessingSection } from "./sections/blessing-section";
import { CountdownSection } from "./sections/countdown-section";
import { ScheduleSection } from "./sections/schedule-section";
import { LocationSection } from "./sections/location-section";
import { DetailsSection } from "./sections/details-section";
import { RsvpSection } from "./sections/rsvp-section";
import type { Invitation } from "@/types/invitation";

type Stage = "closed" | "opening" | "revealed";

/**
 * The full guest-facing invitation: a wax-sealed envelope that peels open and
 * lifts its card away to reveal a scroll of romantic sections — hero,
 * blessing, countdown, schedule, location, courtesies and RSVP — dusted with
 * drifting petals throughout. Scrolling stays locked behind the sealed
 * envelope until the guest opens it. Reference: assets/envelope.mp4.
 */
export function InvitationExperience({ invitation }: { invitation: Invitation }) {
  const [stage, setStage] = useState<Stage>("closed");

  // Lock the page behind the sealed envelope until it's opened.
  useEffect(() => {
    if (stage === "revealed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [stage]);

  // Hand off from the peel-and-lift animation to the fully-revealed scroll.
  useEffect(() => {
    if (stage !== "opening") return;
    const t = setTimeout(() => setStage("revealed"), 2600);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div className="inv relative w-full">
      {stage === "revealed" && (
        <>
          <ScrollProgress />
          <AmbientPetals count={18} />
        </>
      )}

      {/* the invitation itself — waiting behind the sealed envelope */}
      <HeroArch invitation={invitation} />
      <BlessingSection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <ScheduleSection invitation={invitation} />
      <LocationSection invitation={invitation} />
      <DetailsSection invitation={invitation} />
      <RsvpSection invitation={invitation} />

      {/* the envelope gate */}
      <AnimatePresence>
        {stage !== "revealed" && (
          <EnvelopeGate
            invitation={invitation}
            isOpening={stage === "opening"}
            onOpen={() => setStage("opening")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
