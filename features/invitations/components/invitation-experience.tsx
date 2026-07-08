"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { EnvelopeGate } from "./envelope-gate";
import { HeroArch } from "./sections/hero-arch";
import { BlessingSection } from "./sections/blessing-section";
import { CountdownSection } from "./sections/countdown-section";
import { ScheduleSection } from "./sections/schedule-section";
import { LocationSection } from "./sections/location-section";
import { DetailsSection } from "./sections/details-section";
import { RsvpSection } from "./sections/rsvp-section";
import type { Invitation } from "@/types/invitation";

type Stage = "closed" | "opening" | "revealed";

interface InvitationExperienceProps {
  invitation: Invitation;
}

/**
 * The full guest-facing invitation: a wax-sealed envelope that peels open to
 * reveal a scroll of romantic sections — hero, blessing, countdown, schedule,
 * location, courtesies and RSVP. Modelled on assets/envelope.mp4. Scrolling
 * is locked behind the sealed envelope until the guest opens it.
 */
export function InvitationExperience({ invitation }: InvitationExperienceProps) {
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

  // Hand off from the peel animation to the fully-revealed scroll.
  useEffect(() => {
    if (stage !== "opening") return;
    const t = setTimeout(() => setStage("revealed"), 1500);
    return () => clearTimeout(t);
  }, [stage]);

  const monogram = `${invitation.groomName.charAt(0)} · ${invitation.brideName.charAt(0)}`;

  return (
    <div className="inv relative w-full">
      {/* the invitation itself — sitting behind the sealed envelope */}
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
            monogram={monogram}
            isOpening={stage === "opening"}
            onOpen={() => setStage("opening")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
