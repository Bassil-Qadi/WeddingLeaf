import { Chapter, ChapterHeading } from "./chapter";
import { Reveal } from "./reveal";
import { RsvpForm } from "./rsvp-form";
import { ThreadNode } from "./thread-node";
import { toArabicPadded } from "../lib/arabic";
import type { InvitationGuest } from "../types";

interface RsvpProps {
  slug: string;
  /** Present when opened through a personal link — prefills and caps the form. */
  guest?: InvitationGuest;
  /** Ceiling for an open-link responder, who has no seat allowance of their own. */
  maxPartySize: number;
  /** False once the deadline has passed: the answer shows, but can't be changed. */
  open: boolean;
  /** Whether a visitor without a token may answer at all. */
  allowOpenRsvp: boolean;
  chapterNumber: number;
  nodeIndex: number;
}

/**
 * ٠٥ · تأكيد الحضور — the thread layout's RSVP chapter. The chapter frame,
 * heading, and thread waypoint live here; the form itself is the shared
 * {@link RsvpForm}, which both this and the card layout compose.
 */
export function Rsvp({
  slug,
  guest,
  maxPartySize,
  open,
  allowOpenRsvp,
  chapterNumber,
  nodeIndex,
}: RsvpProps) {
  // A stranger on a closed open-link has nothing to answer — skip the whole
  // chapter rather than render an empty frame around a null form.
  if (!guest && !allowOpenRsvp) return null;

  return (
    <Chapter className="flex-col justify-center py-[14vh] ps-11 pe-1.5">
      <ThreadNode index={nodeIndex} className="start-[44px] top-1/2" />

      <div className="relative z-[1] mx-auto w-full max-w-[440px] text-start">
        <ChapterHeading
          index={toArabicPadded(chapterNumber)}
          title="تأكيد الحضور"
          className="mb-2.5"
        />

        <Reveal delay={0.2}>
          <RsvpForm
            slug={slug}
            guest={guest}
            maxPartySize={maxPartySize}
            open={open}
            allowOpenRsvp={allowOpenRsvp}
          />
        </Reveal>
      </div>
    </Chapter>
  );
}
