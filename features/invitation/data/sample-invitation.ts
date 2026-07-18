import type { InvitationData } from "../types";

/**
 * The invitation the design was cut against. Rendered at /demo only.
 *
 * It is deliberately not reachable from /i/[slug]: an unknown slug 404s rather
 * than falling back to this, so no visitor is ever shown a wedding that isn't
 * real. Keep it in sync with `InvitationData` — it doubles as the fixture the
 * chapters are designed against.
 */
export const SAMPLE_INVITATION: InvitationData = {
  slug: "sara-omar",
  style: "gulf",
  theme: "classic",
  template: "thread",

  brideName: "سارة",
  groomName: "عمر",

  dateISO: "2026-11-14T17:00:00.000Z",
  dateDisplay: "١٤ نوفمبر ٢٠٢٦",
  dateDetail: "يوم السبت · الساعة الثامنة مساءً",

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
  story:
    "التقينا في مساءٍ عاديّ لم يكن يعرف أنه سيغيّر كل ما بعده. كبرت الحكاية على مهلٍ، بين ضحكةٍ وموعدٍ ووعد، حتى صار البقاء معًا هو القرار الوحيد الذي يشبهنا.",
  rsvpPhone: "‪+٩٦٦٥٠٠٠٠٠٠٠٠‬",

  rsvpEnabled: true,
  rsvpDeadline: null,
  allowOpenRsvp: true,
  maxPartySize: 4,
};
