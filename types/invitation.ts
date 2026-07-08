export type WeddingStyle =
  | "jordanian"
  | "gulf"
  | "palestinian"
  | "lebanese"
  | "egyptian";

export interface InvitationScheduleItem {
  id: string;
  time: string; // e.g. "٧:٠٠ مساءً"
  title: string; // e.g. "استقبال الضيوف"
}

export interface Invitation {
  slug: string;
  style: WeddingStyle;

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
