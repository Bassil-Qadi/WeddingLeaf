import type {
  WeddingStyle,
  WeddingTheme,
  WeddingTemplate,
} from "@/types/invitation";

export interface InvitationScheduleItem {
  /** Display-ready time in Arabic-Indic digits, e.g. "٨:٠٠". */
  time: string;
  title: string;
}

export type RsvpStatus = "pending" | "attending" | "declined";

/**
 * The guest this invitation was addressed to, when it was opened through a
 * personal /i/<slug>/<token> link. Absent on the open link, which is what
 * makes the invitation greet a stranger politely instead of by name.
 */
export interface InvitationGuest {
  token: string;
  name: string;
  /** How many people this invitation admits — the stepper's ceiling. */
  seats: number;
  status: RsvpStatus;
  partySize: number;
  note: string | null;
}

/**
 * The plain, serializable shape the guest-facing invitation experience
 * consumes. Produced by `services/invitation.ts` from an Event document, or
 * by the bundled sample on the /demo route.
 *
 * Everything below `message` is optional: those fields exist so a couple can
 * enrich the invitation, and each has a sensible derivation from the
 * required fields (see `resolveInvitation`). A freshly created event renders
 * a complete invitation without any of them.
 */
export interface InvitationData {
  slug: string;
  style: WeddingStyle;
  /** The visual register — selects the `.gt[data-theme]` palette. */
  theme: WeddingTheme;
  /** The layout — selects which invitation experience renders (see dispatcher). */
  template: WeddingTemplate;

  groomName: string;
  brideName: string;

  /** ISO timestamp of the ceremony — the countdown target. */
  dateISO: string;
  /** Display-ready Arabic date, e.g. "١٤ تشرين الثاني ٢٠٢٦". */
  dateDisplay: string;
  /** Line under the big date, e.g. "يوم الجمعة · الساعة الثامنة مساءً". */
  dateDetail: string;

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
  /** Shown on the closing knot, e.g. "+٩٦٦٥٠٠٠٠٠٠٠٠". */
  rsvpPhone?: string;
  /** Shown on the closing knot, e.g. "#سارة_و_عمر". */
  hashtag?: string;

  /** Portrait of the couple (3:4) for chapter 01. */
  couplePhotoUrl?: string;
  /** Photo of the venue for chapter 04. */
  venuePhotoUrl?: string;

  // --- RSVP ---
  rsvpEnabled: boolean;
  /** ISO instant after which the RSVP chapter goes read-only. */
  rsvpDeadline: string | null;
  /** Whether a visitor on the open link (no token) may answer at all. */
  allowOpenRsvp: boolean;
  /** Party-size ceiling for open responders; named guests use their `seats`. */
  maxPartySize: number;
  /** Present only when opened through a personal link. */
  guest?: InvitationGuest;
}

/**
 * `InvitationData` with every optional field filled in — what the chapter
 * components actually render against, so none of them has to know how a
 * hashtag or a monogram is derived.
 */
export interface ResolvedInvitation extends InvitationData {
  hashtag: string;
  /** Two initials around a middot, bride first: "س · ع". */
  monogram: string;
  /** `dateDisplay` split for the save-the-date: "١٤ نوفمبر" + "٢٠٢٦". */
  dateDayMonth: string;
  dateYear: string;
  /** "١٤ · ١١ · ٢٠٢٦" for the closing signature. */
  dateNumeric: string;
  /** False once the deadline has passed — the form renders, but read-only. */
  rsvpOpen: boolean;
  couplePhotoUrl?: string;
  venuePhotoUrl?: string;
}
