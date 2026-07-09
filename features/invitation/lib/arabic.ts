const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";

/** "2026" → "٢٠٢٦". Non-digits pass through untouched. */
export function toArabicDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => ARABIC_INDIC[Number(d)]);
}

/** Countdown cells are fixed-width: 7 → "٠٧", 143 → "١٤٣". */
export function toArabicPadded(value: number): string {
  return toArabicDigits(String(value).padStart(2, "0"));
}
