import type { WeddingStyle } from "@/types/invitation";

export interface InvitationScheduleItem {
  /** Display-ready time in Arabic-Indic digits, e.g. "٨:٠٠". */
  time: string;
  title: string;
}

/**
 * The plain, serializable shape the guest-facing invitation experience
 * consumes. Produced by `services/invitation.ts` from an Event document, or
 * by the bundled sample when there is no published event to render.
 *
 * Everything below `message` is optional: those fields exist so a couple can
 * enrich the invitation, and each has a sensible derivation from the
 * required fields (see `resolveInvitation`). A freshly created event renders
 * a complete invitation without any of them.
 */
export interface InvitationData {
  slug: string;
  style: WeddingStyle;

  groomName: string;
  brideName: string;

  /** ISO timestamp of the ceremony — the countdown target. */
  dateISO: string;
  /** Display-ready Arabic date, e.g. "١٤ نوفمبر ٢٠٢٦". */
  dateDisplay: string;

  city: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;

  dressCode?: string;
  schedule: InvitationScheduleItem[];

  coverImageUrl: string | null;
  galleryImages: string[];

  /** Short invitation wording shown under the names on the hero. */
  message?: string;

  /** The "قصتنا" paragraph. */
  story?: string;
  /** Line under the big date, e.g. "يوم الجمعة · الساعة الثامنة مساءً". */
  dateDetail?: string;
  /** Shown on the closing knot, e.g. "+٩٦٦٥٠٠٠٠٠٠٠٠". */
  rsvpPhone?: string;
  /** Shown on the closing knot, e.g. "#سارة_و_عمر". */
  hashtag?: string;

  /** Portrait of the couple (3:4) for chapter 01. */
  couplePhotoUrl?: string;
  /** Photo of the venue for chapter 04. */
  venuePhotoUrl?: string;
}

/**
 * `InvitationData` with every optional field filled in — what the chapter
 * components actually render against, so none of them has to know how a
 * hashtag or a monogram is derived.
 */
export interface ResolvedInvitation extends InvitationData {
  story: string;
  hashtag: string;
  /** Two initials around a middot, bride first: "س · ع". */
  monogram: string;
  /** `dateDisplay` split for the save-the-date: "١٤ نوفمبر" + "٢٠٢٦". */
  dateDayMonth: string;
  dateYear: string;
  /** "١٤ · ١١ · ٢٠٢٦" for the closing signature. */
  dateNumeric: string;
  couplePhotoUrl?: string;
  venuePhotoUrl?: string;
}
