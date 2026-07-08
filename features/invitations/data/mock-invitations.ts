import type { Invitation } from "@/types/invitation";

/**
 * TEMPORARY mock data source. Once Phase 1 (MongoDB + creator dashboard)
 * is wired up, replace getInvitationBySlug's lookup with a real database
 * query — the function signature is designed to make that swap a one-line
 * change wherever it's called from.
 */
const mockInvitations: Record<string, Invitation> = {
  "amir-lina": {
    slug: "amir-lina",
    style: "jordanian",
    groomName: "أمير",
    brideName: "لينا",
    date: "2026-10-24",
    dateDisplay: "٢٤ أكتوبر ٢٠٢٦",
    city: "عمّان",
    venueName: "قاعة الماسة",
    venueAddress: "شارع الملكة رانيا، عمّان، الأردن",
    mapUrl: "https://maps.google.com/?q=Amman+Jordan",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Amman+Jordan&output=embed",
    tagline: ["روحان", "قدرٌ واحد", "عمرٌ كتبه الله"],
    dressCode: "أنيق رسمي",
    dressCodeNote:
      "نرجو من ضيوفنا الكرام تجنّب الألوان الحمراء الداكنة والعنّابية في هذه الأمسية.",
    giftPreference: "يكفينا حضوركم ودعواتكم الطيبة، ونعتذر عن استقبال الهدايا المغلّفة.",
    schedule: [
      { id: "1", time: "٧:٠٠ مساءً", title: "استقبال الضيوف" },
      { id: "2", time: "٨:٠٠ مساءً", title: "عقد القران" },
      { id: "3", time: "٩:٠٠ مساءً", title: "حفل العشاء" },
      { id: "4", time: "١٠:٣٠ مساءً", title: "الزفة والرقص" },
    ],
    rsvpDeadline: "٩ أغسطس",
    galleryImages: [],
    message:
      "بقلوب مفعمة بالفرح، نتشرف بدعوتكم لمشاركتنا أجمل لحظات حياتنا، أمسيةً من الحبّ والفرح والدعوات والذكريات التي لا تُنسى، بينما نبدأ معًا رحلة العمر.",
  },
};

export function getInvitationBySlug(slug: string): Invitation | null {
  return mockInvitations[slug] ?? null;
}
