"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { InvitationData } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { Grain, GoldMotes, Wordmark } from "./ambient";
import { Closing } from "./closing";
import { GoldenThread } from "./golden-thread";
import { Hero } from "./hero";
import { Programme } from "./programme";
import { SaveTheDate } from "./save-the-date";
import { Story } from "./story";
import { ThreadProvider, useThread } from "./thread-context";
import { Veil } from "./veil";
import { Venue } from "./venue";

/** The veil is still travelling when the hero appears; scroll waits for it. */
const SCROLL_UNLOCK_MS = 1500;
const SCROLL_UNLOCK_REDUCED_MS = 650;

/**
 * The invitation, from the veil down to the knot. One continuous scroll, six
 * chapters, and a single gold thread running through all of them.
 */
export function InvitationExperience({
  invitation,
}: {
  invitation: InvitationData;
}) {
  return (
    <ThreadProvider>
      <Experience invitation={invitation} />
    </ThreadProvider>
  );
}

function Experience({ invitation }: { invitation: InvitationData }) {
  const { trackRef } = useThread();
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);

  const data = resolveInvitation(invitation);

  // The invitation stays covered — and unscrollable — until it is uncovered.
  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      return () => {
        document.body.style.overflow = "";
      };
    }

    const timer = setTimeout(
      () => {
        document.body.style.overflow = "";
      },
      reduceMotion ? SCROLL_UNLOCK_REDUCED_MS : SCROLL_UNLOCK_MS,
    );

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [opened, reduceMotion]);

  return (
    <div className="gt relative min-h-screen w-full overflow-x-hidden">
      <Grain />
      <GoldMotes />
      <Wordmark />

      <div
        ref={trackRef}
        className="relative mx-auto max-w-[680px] px-[clamp(18px,5vw,40px)]"
      >
        <GoldenThread opened={opened} />

        <Hero
          nodeIndex={0}
          brideName={data.brideName}
          groomName={data.groomName}
          message={data.message}
          city={data.city}
          dateDisplay={data.dateDisplay}
          opened={opened}
        />

        <Story nodeIndex={1} story={data.story} photoUrl={data.couplePhotoUrl} />

        <SaveTheDate
          nodeIndex={2}
          dateDayMonth={data.dateDayMonth}
          dateYear={data.dateYear}
          dateDetail={data.dateDetail}
          dateISO={data.dateISO}
        />

        <Programme nodeIndex={3} schedule={data.schedule} />

        <Venue
          nodeIndex={4}
          venueName={data.venueName}
          venueAddress={data.venueAddress}
          mapUrl={data.mapUrl}
          photoUrl={data.venuePhotoUrl}
        />

        <Closing
          nodeIndex={5}
          brideName={data.brideName}
          groomName={data.groomName}
          monogram={data.monogram}
          hashtag={data.hashtag}
          dateNumeric={data.dateNumeric}
          rsvpPhone={data.rsvpPhone}
        />
      </div>

      <Veil
        brideName={data.brideName}
        groomName={data.groomName}
        monogram={data.monogram}
        dateDisplay={data.dateDisplay}
        opened={opened}
        onOpen={() => setOpened(true)}
      />
    </div>
  );
}
