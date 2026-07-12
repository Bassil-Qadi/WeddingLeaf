import type { InvitationData, ResolvedInvitation } from "../types";
import { toArabicDigits } from "./arabic";

const firstLetter = (name: string) => Array.from(name.trim())[0] ?? "";

/**
 * Split "١٤ نوفمبر ٢٠٢٦" into its day+month and year halves so the
 * save-the-date can set the year in italic Cormorant beside the date. The
 * year is always the trailing token; if there isn't one, the whole string
 * stays on the left and the year renders empty.
 */
function splitDateDisplay(dateDisplay: string): [string, string] {
  const parts = dateDisplay.trim().split(/\s+/);
  if (parts.length < 2) return [dateDisplay, ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

/**
 * "2026-11-14T17:00:00.000Z" → "١٤ · ١١ · ٢٠٢٦".
 *
 * Read straight off the ISO string rather than through `Date` getters: the
 * server and the browser sit in different timezones, and a date that shifts
 * across midnight between them would tear on hydration.
 */
function toNumericSignature(dateISO: string): string {
  const [year, month, day] = dateISO.slice(0, 10).split("-");
  if (!year || !month || !day) return "";
  return [day, month, year].map(toArabicDigits).join(" · ");
}

/**
 * Fill in everything the chapters need but an event document doesn't
 * necessarily carry, so no component has to reach for a fallback itself.
 */
export function resolveInvitation(
  invitation: InvitationData,
): ResolvedInvitation {
  const { brideName, groomName, dateDisplay, dateISO } = invitation;
  const [dateDayMonth, dateYear] = splitDateDisplay(dateDisplay);

  const pastDeadline =
    invitation.rsvpDeadline !== null &&
    Date.now() > new Date(invitation.rsvpDeadline).getTime();

  return {
    ...invitation,
    // Deliberately no fallback story. A stock paragraph is worse than none:
    // it reads as the couple's own words, and every couple gets the same ones.
    // The experience drops the chapter instead — see `invitation-experience`.
    hashtag: invitation.hashtag ?? `#${brideName}_و_${groomName}`,
    monogram: `${firstLetter(brideName)} · ${firstLetter(groomName)}`,
    dateDayMonth,
    dateYear,
    dateNumeric: toNumericSignature(dateISO),
    rsvpOpen: invitation.rsvpEnabled && !pastDeadline,
    couplePhotoUrl:
      invitation.couplePhotoUrl ??
      invitation.coverImageUrl ??
      invitation.galleryImages[0],
    venuePhotoUrl: invitation.venuePhotoUrl ?? invitation.galleryImages[1],
  };
}
