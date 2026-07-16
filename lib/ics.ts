/**
 * A single-event iCalendar (`.ics`) document, per RFC 5545.
 *
 * On the timezone question — the thing that makes `.ics` generation quietly
 * wrong so often: the event's moment is stored as a UTC instant, and that is
 * what we emit (`DTSTART:…Z`). An instant is unambiguous and DST-proof, and a
 * calendar renders it in the viewer's current zone — which, for a guest who is
 * at the venue, is the wedding's own zone, so "8:00 PM" shows as 8:00 PM. We
 * deliberately do *not* hand-roll a `VTIMEZONE` block: getting its DST rules
 * wrong is a worse failure than the cosmetic shift a guest sees only while
 * their phone is still in another country.
 */

interface IcsEvent {
  /** Stable per event, so re-adding updates the entry instead of duplicating. */
  uid: string;
  title: string;
  /** The ceremony instant. */
  start: Date;
  /** How long to block out; weddings run long, so a few hours is the default. */
  durationHours: number;
  location?: string;
  description?: string;
  url?: string;
}

/** `YYYYMMDDTHHMMSSZ` — the basic-format UTC timestamp iCalendar wants. */
function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Escape a TEXT value: backslash, semicolon and comma are delimiters, and a
 * literal newline becomes `\n`. Order matters — backslash first, or we'd
 * double-escape the escapes we just added.
 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Fold a content line to =75 octets, continued with CRLF + a single space.
 * The limit is on *octets*, not characters — Arabic text is multi-byte UTF-8,
 * so folding by character length would overrun it and some parsers choke. We
 * measure with the byte length and never split a multi-byte character across
 * the fold (walk back to a UTF-8 lead byte).
 */
function foldLine(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const chunks: string[] = [];
  let start = 0;
  // First line gets 75 octets; continuation lines get 74 (the leading space
  // counts against the limit).
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Don't cut through a UTF-8 continuation byte (10xxxxxx).
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    chunks.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74;
  }
  return chunks.join("\r\n ");
}

export function buildEventIcs(event: IcsEvent): string {
  const end = new Date(event.start.getTime() + event.durationHours * 3600_000);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingLeaf//Invitation//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(event.start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];

  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.description)
    lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.url) lines.push(`URL:${escapeText(event.url)}`);

  lines.push("END:VEVENT", "END:VCALENDAR");

  // CRLF line endings are mandatory, and every line is folded to spec.
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
