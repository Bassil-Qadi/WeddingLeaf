"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { InvitationData } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { Grain, GoldMotes, Wordmark } from "./ambient";
import { Closing } from "./closing";
import { GoldenThread } from "./golden-thread";
import { Hero } from "./hero";
import { Programme } from "./programme";
import { Rsvp } from "./rsvp";
import { SaveTheDate } from "./save-the-date";
import { Story } from "./story";
import { ThreadProvider, useThread } from "./thread-context";
import { Veil } from "./veil";
import { Venue } from "./venue";

/** The veil is still travelling when the hero appears; scroll waits for it. */
const SCROLL_UNLOCK_MS = 1500;
const SCROLL_UNLOCK_REDUCED_MS = 650;

/**
 * The invitation, from the veil down to the knot. One continuous scroll and a
 * single gold thread running through all of it. This is the `thread` layout —
 * the design the whole thing was cut against; the dispatcher in
 * `invitation-experience.tsx` chooses it or the `card` layout per event.
 */
export function ThreadTemplate({
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

  /**
   * Not every invitation has every chapter — a couple who wrote no story gets
   * no story chapter, and a wedding with RSVP switched off gets no form. Both
   * the chapter numerals and the thread's waypoints have to stay contiguous
   * regardless, so the chapters are assembled here and numbered as they go
   * rather than hardcoding either count.
   */
  const chapters: ReactNode[] = [];
  // The hero holds node 0; chapters are numbered from one.
  let nodeIndex = 1;
  let chapterNumber = 1;

  const tellsStory = Boolean(data.story || data.couplePhotoUrl);
  const asksRsvp = data.rsvpEnabled && (Boolean(data.guest) || data.allowOpenRsvp);

  if (tellsStory) {
    chapters.push(
      <Story
        key="story"
        nodeIndex={nodeIndex++}
        chapterNumber={chapterNumber++}
        story={data.story}
        photoUrl={data.couplePhotoUrl}
      />,
    );
  }

  chapters.push(
    <SaveTheDate
      key="save-the-date"
      nodeIndex={nodeIndex++}
      chapterNumber={chapterNumber++}
      dateDayMonth={data.dateDayMonth}
      dateYear={data.dateYear}
      dateDetail={data.dateDetail}
      dateISO={data.dateISO}
    />,
  );

  if (data.schedule.length > 0) {
    chapters.push(
      <Programme
        key="programme"
        nodeIndex={nodeIndex++}
        chapterNumber={chapterNumber++}
        schedule={data.schedule}
      />,
    );
  }

  chapters.push(
    <Venue
      key="venue"
      nodeIndex={nodeIndex++}
      chapterNumber={chapterNumber++}
      slug={data.slug}
      venueName={data.venueName}
      venueAddress={data.venueAddress}
      mapUrl={data.mapUrl}
      photoUrl={data.venuePhotoUrl}
    />,
  );

  if (asksRsvp) {
    chapters.push(
      <Rsvp
        key="rsvp"
        nodeIndex={nodeIndex++}
        chapterNumber={chapterNumber++}
        slug={data.slug}
        guest={data.guest}
        maxPartySize={data.maxPartySize}
        allowOpenRsvp={data.allowOpenRsvp}
        open={data.rsvpOpen}
      />,
    );
  }

  return (
    <div
      className="gt relative min-h-screen w-full overflow-x-hidden"
      data-theme={data.theme}
    >
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
          guestName={data.guest?.name}
          message={data.message}
          city={data.city}
          dateDisplay={data.dateDisplay}
          opened={opened}
        />

        {chapters}

        <Closing
          nodeIndex={nodeIndex}
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
        guestName={data.guest?.name}
        monogram={data.monogram}
        dateDisplay={data.dateDisplay}
        opened={opened}
        onOpen={() => setOpened(true)}
      />
    </div>
  );
}
