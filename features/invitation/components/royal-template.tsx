"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import type { CoverTreatment } from "@/types/invitation";
import type { InvitationData } from "../types";
import { resolveInvitation } from "../lib/resolve-invitation";
import { Grain, Wordmark } from "./ambient";
import { CoverReveal } from "./cover-reveal";
import { InviteStory } from "./invite-story";

/** The cover is still travelling when the story appears; scroll waits for it. */
const SCROLL_UNLOCK_MS = 1700;
const SCROLL_UNLOCK_REDUCED_MS = 550;

/**
 * The "royal" layouts (الدعوة الملكية) — a sealed cover that opens with a
 * cinematic animation onto one scrolling story. Three templates share this
 * single engine and differ only in how the cover opens, carried by `treatment`:
 *
 * - `envelope` — a wax-sealed envelope whose flap folds back.
 * - `doors`    — two gilded doors parting to the sides.
 * - `veil`     — a dark veil lifting away.
 *
 * Like the other layouts it owns its own `.gt` root with `data-theme` (so all
 * four palettes ride on it) and composes the shared {@link InviteStory}, which
 * in turn reuses the {@link RsvpForm}, {@link Countdown}, and the
 * `/i/<slug>/calendar` route rather than reimplementing any of them.
 */
export function RoyalTemplate({
  invitation,
  treatment,
}: {
  invitation: InvitationData;
  treatment: CoverTreatment;
}) {
  const data = resolveInvitation(invitation);
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);

  // The story stays covered — and unscrollable — until the cover is opened, so
  // the reveal isn't spoiled by a stray scroll. Mirrors `thread-template`.
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
    <div
      className="gt relative min-h-screen w-full overflow-x-hidden bg-gt-paper text-gt-ink"
      data-theme={data.theme}
    >
      <Grain />
      <Wordmark />

      <InviteStory data={data} />

      <CoverReveal
        data={data}
        treatment={treatment}
        opened={opened}
        onOpen={() => setOpened(true)}
        onReplay={() => setOpened(false)}
      />
    </div>
  );
}
