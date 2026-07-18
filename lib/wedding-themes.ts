import type { WeddingTheme } from "@/types/invitation";

/** The visual register a couple picks. Distinct from `wedding-styles` (region). */
export const THEME_LABELS: Record<WeddingTheme, string> = {
  classic: "كلاسيكي",
  modern: "حديث",
  opulent: "فخم",
  romantic: "وردي",
};

/** A one-line hint under each option, so the choice reads without a preview. */
export const THEME_DESCRIPTIONS: Record<WeddingTheme, string> = {
  classic: "عاجي دافئ وذهب — الطابع الأصلي",
  modern: "رمادي هادئ وبسيط",
  opulent: "خلفية داكنة وذهب غني",
  romantic: "وردي ناعم وذهب وردي",
};

/** The dot shown beside each option — the theme's signature accent. */
export const THEME_SWATCHES: Record<WeddingTheme, string> = {
  classic: "#a67c2e",
  modern: "#52707a",
  opulent: "#c9a24a",
  romantic: "#b76e79",
};

export const THEME_OPTIONS: { value: WeddingTheme; label: string }[] =
  Object.entries(THEME_LABELS).map(([value, label]) => ({
    value: value as WeddingTheme,
    label,
  }));

/** Old events (and anything with a value we no longer ship) render as Classic. */
export function normalizeTheme(value: unknown): WeddingTheme {
  return value === "modern" || value === "opulent" || value === "romantic"
    ? value
    : "classic";
}
