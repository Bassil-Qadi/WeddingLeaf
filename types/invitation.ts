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

  dressCode?: string;
  schedule: InvitationScheduleItem[];

  galleryImages: string[];

  /** Optional short Arabic invitation wording (from AI generation later) */
  message?: string;
}