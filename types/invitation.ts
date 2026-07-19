/**
 * The regional axis: it drives *localization*, not looks — which Arabic month
 * names print ("تشرين الثاني" vs "نوفمبر") and the default ceremony timezone.
 * See `lib/date.ts`. For the visual look, see {@link WeddingTheme}.
 */
export type WeddingStyle =
  | "jordanian"
  | "gulf"
  | "palestinian"
  | "lebanese"
  | "egyptian";

/**
 * The visual axis: the invitation's palette and mood. Independent of the
 * layout — a theme only swaps the colours (see the `.gt[data-theme]` blocks in
 * `app/globals.css`), so it recolours whichever {@link WeddingTemplate} the
 * couple picked without touching structure.
 */
export type WeddingTheme = "classic" | "modern" | "opulent" | "romantic";

/**
 * The layout axis: which invitation *experience* renders — the whole structure,
 * section order, and motion, not just colours. `thread` is the cinematic
 * veil-and-golden-thread scroll the design was cut against; `card` is a single
 * formal panel. Chosen independently of {@link WeddingTheme}, so any layout can
 * wear any palette. The dispatcher lives in `invitation-experience.tsx`.
 */
export type WeddingTemplate = "thread" | "card" | "album";

export interface InvitationScheduleItem {
  id: string;
  time: string; // e.g. "٧:٠٠ مساءً"
  title: string; // e.g. "استقبال الضيوف"
}

export interface Invitation {
  slug: string;
  style: WeddingStyle;
  theme: WeddingTheme;
  template: WeddingTemplate;

  groomName: string;
  brideName: string;

  /** ISO date string, e.g. "2026-10-24" */
  date: string;
  /** Display-ready Hijri/Gregorian date text in Arabic, e.g. "٢٤ أكتوبر ٢٠٢٦" */
  dateDisplay: string;

  city: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  /** Embeddable Google Maps URL (src for the <iframe> preview). */
  mapEmbedUrl?: string;

  /**
   * Three short poetic lines shown under the Bismillah, echoing the
   * reference's "Two Souls / One destiny / A Lifetime written by Allah".
   */
  tagline?: [string, string, string];

  dressCode?: string;
  /** Descriptive dress-code sentence shown on the details section. */
  dressCodeNote?: string;
  /** Gift-preference note, e.g. "نكتفي بحضوركم ودعواتكم". */
  giftPreference?: string;

  schedule: InvitationScheduleItem[];

  /** Display-ready RSVP deadline, e.g. "٩ أغسطس". */
  rsvpDeadline?: string;

  galleryImages: string[];
  /** Optional couple portrait shown near the RSVP call-to-action. */
  couplePhoto?: string;

  /** Optional short Arabic invitation wording (from AI generation later) */
  message?: string;
}
