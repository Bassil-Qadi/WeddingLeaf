import type { GuestRecord } from "@/services/guests";

/**
 * Dialling codes, keyed by the event's own time zone.
 *
 * This is a heuristic and it is here under protest. The honest fix is a country
 * field on the event, but the time zone is already required, already defaults to
 * Asia/Amman, and already tells us — for every market this app serves — which
 * country the wedding is in. A wedding is not a travelling circus: the couple's
 * guests dial the same country code the venue does.
 *
 * It only ever matters for a number typed *locally* ("0790000000"). Anything the
 * couple wrote in international form is taken at its word, so a guest abroad is
 * reachable regardless of what this table says.
 */
const DIAL_CODES: Record<string, string> = {
  "Asia/Amman": "962",
  "Asia/Riyadh": "966",
  "Asia/Dubai": "971",
  "Asia/Kuwait": "965",
  "Asia/Qatar": "974",
  "Asia/Bahrain": "973",
  "Asia/Muscat": "968",
  "Asia/Beirut": "961",
  "Asia/Damascus": "963",
  "Asia/Baghdad": "964",
  "Asia/Hebron": "970",
  "Asia/Gaza": "970",
  "Asia/Jerusalem": "972",
  "Africa/Cairo": "20",
  "Africa/Tripoli": "218",
  "Africa/Khartoum": "249",
  "Africa/Tunis": "216",
  "Africa/Algiers": "213",
  "Africa/Casablanca": "212",
};

const DEFAULT_DIAL_CODE = "962";

export function dialCodeFor(timeZone: string): string {
  return DIAL_CODES[timeZone] ?? DEFAULT_DIAL_CODE;
}

/**
 * A phone number in the shape `wa.me` demands: digits only, country code first,
 * no `+`, no leading zero.
 *
 * This is the single most breakable thing in the send flow. `wa.me/0790000000`
 * does not fail loudly — WhatsApp opens and says the number is invalid, once per
 * guest, three hundred times — and "0790000000" is exactly what a couple gets
 * when they paste a column out of their contacts. It is even what the add-guests
 * dialog shows as its own placeholder.
 *
 * Returns null when there is nothing dialable, so the caller can offer the guest
 * a copyable link instead of a button that leads somewhere broken.
 */
export function toWhatsAppNumber(
  phone: string | null | undefined,
  timeZone: string,
): string | null {
  if (!phone) return null;

  const raw = phone.replace(/[^\d+]/g, "");
  if (!raw) return null;

  const dial = dialCodeFor(timeZone);

  // Written internationally: believe it. This is the escape hatch for a guest
  // who lives somewhere the time-zone guess above would get wrong.
  let digits: string;
  if (raw.startsWith("+")) digits = raw.slice(1);
  else if (raw.startsWith("00")) digits = raw.slice(2);
  else if (raw.startsWith(dial)) digits = raw;
  // A leading zero is the national trunk prefix. It is *not* part of the number
  // and must be dropped before the country code goes on the front.
  else if (raw.startsWith("0")) digits = dial + raw.slice(1);
  else digits = dial + raw;

  // Shortest real E.164 subscriber numbers are ~8 digits with the code on.
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/** The link that actually gets sent — a guest's own invitation, not the couple's. */
export function invitationUrl(slug: string, token: string): string {
  return `${publicOrigin()}/i/${slug}/${token}`;
}

/**
 * The origin to build guest links against.
 *
 * `NEXT_PUBLIC_SITE_URL` first, because it is the canonical public address and
 * the dashboard may well be reached at some other one. `window.location.origin`
 * is the fallback — but only behind a `typeof window` guard: these components are
 * client components, and Next still renders them on the server first, where
 * touching `window` during render throws.
 */
function publicOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  if (typeof window !== "undefined") return window.location.origin;

  return "";
}

export interface MessageContext {
  slug: string;
  groomName: string;
  brideName: string;
  timeZone: string;
}

/**
 * A pre-written Arabic message with the guest's own link in it. Sending an
 * invitation in this market means sending it on WhatsApp, one person at a time,
 * so the couple should never have to compose it three hundred times.
 */
export function invitationMessage(
  guest: GuestRecord,
  { slug, groomName, brideName }: MessageContext,
): string {
  return [
    `عزيزنا ${guest.name}،`,
    "",
    `يسعدنا دعوتكم لحضور حفل زفاف ${groomName} و ${brideName}.`,
    guest.seats > 1
      ? `بطاقتكم تتّسع لـ ${guest.seats} أشخاص، وتجدونها هنا:`
      : "تجدون بطاقتكم الخاصة هنا:",
    invitationUrl(slug, guest.token!),
  ].join("\n");
}

/**
 * The `wa.me` deep link for one guest, or null when we have no number to dial.
 *
 * Note there is no send here, and there cannot be: WhatsApp has no web API a
 * couple could authorise. This opens the app with the message already typed and
 * a human presses send. Every "bulk send" in this product is, underneath, that
 * same tap repeated — which is why the queue exists.
 */
export function whatsappSendUrl(
  guest: GuestRecord,
  context: MessageContext,
): string | null {
  if (!guest.token) return null;

  const number = toWhatsAppNumber(guest.phone, context.timeZone);
  if (!number) return null;

  const text = encodeURIComponent(invitationMessage(guest, context));
  return `https://wa.me/${number}?text=${text}`;
}
