import type { WeddingStyle } from "@/types/invitation";

/**
 * Where a wedding style is celebrated. Drives two things a couple should never
 * have to think about: which Arabic month names to print (the Levant says
 * "تشرين الثاني" where the Gulf says "نوفمبر" — ICU knows the difference, but
 * only if it is handed the right locale) and which timezone the ceremony hour
 * is expressed in, so the countdown targets the real instant.
 */
const STYLE_REGION: Record<WeddingStyle, { locale: string; timeZone: string }> =
  {
    jordanian: { locale: "ar-JO", timeZone: "Asia/Amman" },
    gulf: { locale: "ar-SA", timeZone: "Asia/Riyadh" },
    palestinian: { locale: "ar-PS", timeZone: "Asia/Hebron" },
    lebanese: { locale: "ar-LB", timeZone: "Asia/Beirut" },
    egyptian: { locale: "ar-EG", timeZone: "Africa/Cairo" },
  };

/**
 * For events written before `timeZone` existed on the schema. Mongoose applies
 * defaults on write, not on read, so those documents come back without one and
 * would otherwise hand `undefined` to `Intl` — which quietly formats in the
 * *server's* timezone, i.e. correctly in dev and wrongly in production.
 */
export const DEFAULT_TIME_ZONE = "Asia/Amman";

export const TIME_ZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "Asia/Amman", label: "عمّان" },
  { value: "Asia/Riyadh", label: "الرياض" },
  { value: "Asia/Dubai", label: "دبي" },
  { value: "Asia/Hebron", label: "القدس" },
  { value: "Asia/Beirut", label: "بيروت" },
  { value: "Africa/Cairo", label: "القاهرة" },
  { value: "Asia/Kuwait", label: "الكويت" },
  { value: "Asia/Qatar", label: "الدوحة" },
];

export function defaultTimeZoneForStyle(style: WeddingStyle): string {
  return STYLE_REGION[style].timeZone;
}

/** Arabic-Indic numerals, so "٢٠٢٦" rather than "2026". */
function arabicLocale(style: WeddingStyle): string {
  return `${STYLE_REGION[style].locale}-u-nu-arab`;
}

/**
 * How far `timeZone` sits ahead of UTC at a given instant, in milliseconds.
 * Read back out of `Intl` rather than a table, so DST is whatever the platform
 * says it is on the day.
 */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const at = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  const wallClock = Date.UTC(
    at("year"),
    at("month") - 1,
    at("day"),
    at("hour"),
    at("minute"),
    at("second"),
  );

  return wallClock - instant.getTime();
}

/**
 * "2026-11-14" + "20:00" in Amman → the UTC instant that actually is.
 *
 * The offset depends on the instant we are trying to find, so this guesses
 * once (reading the wall clock as if it were UTC), corrects, then re-checks:
 * the second pass is what gets a ceremony scheduled during a DST changeover
 * onto the right side of the jump.
 */
export function zonedToUtc(
  dateStr: string,
  timeStr: string,
  timeZone: string,
): Date {
  const naive = new Date(`${dateStr}T${timeStr}:00Z`).getTime();

  let instant = naive - zoneOffsetMs(new Date(naive), timeZone);
  instant = naive - zoneOffsetMs(new Date(instant), timeZone);

  return new Date(instant);
}

const HOUR_NAMES = [
  "الثانية عشرة",
  "الواحدة",
  "الثانية",
  "الثالثة",
  "الرابعة",
  "الخامسة",
  "السادسة",
  "السابعة",
  "الثامنة",
  "التاسعة",
  "العاشرة",
  "الحادية عشرة",
];

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";

function toArabicDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => ARABIC_INDIC[Number(d)]);
}

/** "١٤ تشرين الثاني ٢٠٢٦" in the Levant, "١٤ نوفمبر ٢٠٢٦" in the Gulf. */
export function formatArabicDate(
  instant: Date,
  style: WeddingStyle,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(arabicLocale(style), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(instant);
}

/**
 * "يوم السبت · الساعة الثامنة مساءً" — the line under the big date.
 *
 * The hour is spelled out rather than printed as digits: an invitation reads
 * as a sentence, and "الساعة ٨:٠٠ مساءً" reads as a receipt.
 */
export function formatArabicDateDetail(
  instant: Date,
  style: WeddingStyle,
  timeZone: string,
): string {
  const weekday = new Intl.DateTimeFormat(arabicLocale(style), {
    weekday: "long",
    timeZone,
  }).format(instant);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(instant);

  const hour24 = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);

  const hourName = HOUR_NAMES[hour24 % 12];
  const meridiem = hour24 < 12 ? "صباحًا" : "مساءً";

  const minutePhrase =
    minute === 0
      ? ""
      : minute === 30
        ? " والنصف"
        : ` و${toArabicDigits(minute)} دقيقة`;

  return `يوم ${weekday} · الساعة ${hourName}${minutePhrase} ${meridiem}`;
}

/** The date half of a stored instant, back in the `<input type="date">` shape. */
export function toDateInputValue(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const at = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${at("year")}-${at("month")}-${at("day")}`;
}

/** The time half, back in the `<input type="time">` shape. */
export function toTimeInputValue(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).format(instant);
}
