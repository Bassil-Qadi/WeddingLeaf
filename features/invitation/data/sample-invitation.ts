import type { InvitationData } from "../types";

/**
 * The invitation the design was cut against. Rendered at /i/[slug] when no
 * published event matches the slug, so the experience stays viewable before
 * the database is seeded and in local design preview.
 */
export const SAMPLE_INVITATION: InvitationData = {
  slug: "sara-omar",
  style: "gulf",

  brideName: "سارة",
  groomName: "عمر",

  dateISO: "2026-11-14T20:00:00+03:00",
  dateDisplay: "١٤ نوفمبر ٢٠٢٦",
  dateDetail: "يوم الجمعة · الساعة الثامنة مساءً",

  city: "الرياض",
  venueName: "قاعة الأندلس للاحتفالات",
  venueAddress: "طريق الملك فهد — حيّ العليا، الرياض",
  mapUrl: "https://maps.google.com/?q=قاعة+الأندلس+للاحتفالات+الرياض",

  schedule: [
    { time: "٧:٠٠", title: "استقبال الضيوف" },
    { time: "٨:٠٠", title: "عقد القِران" },
    { time: "٩:٠٠", title: "حفل العشاء" },
    { time: "١٠:٣٠", title: "السهرة" },
  ],

  coverImageUrl: null,
  galleryImages: [],

  message: "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر",
  rsvpPhone: "‪+٩٦٦٥٠٠٠٠٠٠٠٠‬",
};
