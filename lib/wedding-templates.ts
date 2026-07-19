import type { WeddingTemplate } from "@/types/invitation";

/**
 * The layout a couple picks — the whole invitation experience, not the palette.
 * Distinct from `wedding-themes` (colours) and `wedding-styles` (region).
 */
export const TEMPLATE_LABELS: Record<WeddingTemplate, string> = {
  thread: "الخيط الذهبي",
  card: "البطاقة",
  album: "الألبوم",
};

/** A one-line hint under each option, so the choice reads without a preview. */
export const TEMPLATE_DESCRIPTIONS: Record<WeddingTemplate, string> = {
  thread: "تجربة سينمائية بخيط ذهبي يتكشّف فصلًا فصلًا",
  card: "بطاقة رسمية بصفحة واحدة — مباشرة وأنيقة",
  album: "الصور هي البطلة — يبرز أكثر مع صور مرفوعة",
};

export const TEMPLATE_OPTIONS: { value: WeddingTemplate; label: string }[] =
  Object.entries(TEMPLATE_LABELS).map(([value, label]) => ({
    value: value as WeddingTemplate,
    label,
  }));

/** Old events (and anything with a value we no longer ship) render as Thread. */
export function normalizeTemplate(value: unknown): WeddingTemplate {
  return value === "card" || value === "album" ? value : "thread";
}
