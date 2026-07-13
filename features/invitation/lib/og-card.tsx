import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { InvitationData } from "../types";
import { toVisualOrder } from "./bidi";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** The invitation's own palette — see the `--gt-*` tokens in globals.css. */
const PAPER = "#f4eee3";
const INK = "#2b2620";
const GOLD = "#a67c2e";
const GOLD_LIGHT = "#d8ab4a";

const FONT_DIR = "assets/fonts/IBM_Plex_Sans_Arabic";

async function loadFonts() {
  const [extraLight, light, regular] = await Promise.all([
    readFile(join(process.cwd(), FONT_DIR, "IBMPlexSansArabic-ExtraLight.ttf")),
    readFile(join(process.cwd(), FONT_DIR, "IBMPlexSansArabic-Light.ttf")),
    readFile(join(process.cwd(), FONT_DIR, "IBMPlexSansArabic-Regular.ttf")),
  ]);

  return [
    { name: "Plex", data: extraLight, style: "normal" as const, weight: 200 as const },
    { name: "Plex", data: light, style: "normal" as const, weight: 300 as const },
    { name: "Plex", data: regular, style: "normal" as const, weight: 400 as const },
  ];
}

/**
 * A line of Arabic, laid out right-to-left by hand.
 *
 * The explicit `gap` is not cosmetic: Satori's own inter-word spacing comes out
 * roughly three times too wide, which is what tore the first drafts of this card
 * apart. And note `flexDirection: row` — the reordering is already done, in
 * {@link toVisualOrder}, where it is testable and can be reasoned about.
 *
 * The corollary: never hand raw multi-word Arabic to a bare `<div>` in this
 * file. Always come through here.
 */
function ArabicLine({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center",
        flexWrap: "nowrap",
        gap: "0.24em",
        ...style,
      }}
    >
      {toVisualOrder(text).map((word, i) => (
        <div key={i}>{word}</div>
      ))}
    </div>
  );
}

/** A hairline rule with a diamond at its centre — the thread, at rest. */
function Divider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 320,
        marginTop: 26,
        marginBottom: 26,
      }}
    >
      <div style={{ display: "flex", height: 1, width: 130, background: GOLD, opacity: 0.45 }} />
      <div
        style={{
          display: "flex",
          width: 7,
          height: 7,
          marginLeft: 12,
          marginRight: 12,
          background: GOLD_LIGHT,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ display: "flex", height: 1, width: 130, background: GOLD, opacity: 0.45 }} />
    </div>
  );
}

/**
 * The share card — in practice the first thing a guest ever sees of a wedding,
 * met in a WhatsApp thread long before the invitation itself is opened.
 *
 * `guestName` personalises the card on a per-guest link, so the preview in
 * someone's chat is addressed to them rather than broadcast at them.
 */
export async function invitationOgImage(
  invitation: InvitationData,
  guestName?: string,
): Promise<ImageResponse> {
  const fonts = await loadFonts();
  const cover = invitation.coverImageUrl;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: PAPER,
          color: INK,
          fontFamily: "Plex",
        }}
      >
        {/* The couple's own photo, if they gave us one. Washed out hard: this is
            a backdrop for the words, not a photo with words on top of it.

            A bare <img> is not an oversight. Satori rasterises this tree to a
            PNG; `next/image` does not exist inside it, and `alt` has nothing to
            describe — the whole card is already announced by the `alt` export on
            the route. */}
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={cover}
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.22,
            }}
          />
        )}

        {/* Two hairline frames, a few pixels apart — the cheapest trick in
            stationery, and the one that reads as "engraved" rather than "web". */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 26,
            border: `1px solid ${GOLD}`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 33,
            left: 33,
            right: 33,
            bottom: 33,
            border: `1px solid ${GOLD}`,
            opacity: 0.25,
          }}
        />

        {/* No `letterSpacing` here, however much the eyebrow wants it: tracking
            prises apart letters that Arabic joins, so the cursive line breaks and
            the word stops looking like a word. It is a Latin-caps affectation and
            it does not transfer. Word `gap` is the only spacing lever we get. */}
        <ArabicLine
          text={guestName ? `دعوة خاصة لـ ${guestName}` : "بطاقة دعوة"}
          style={{ fontSize: 26, fontWeight: 400, color: GOLD }}
        />

        <ArabicLine
          text={`${invitation.groomName} و ${invitation.brideName}`}
          style={{
            fontSize: 96,
            fontWeight: 200,
            marginTop: 18,
            lineHeight: 1.25,
          }}
        />

        <Divider />

        <ArabicLine
          text={invitation.dateDisplay}
          style={{ fontSize: 40, fontWeight: 300, color: GOLD }}
        />

        <ArabicLine
          text={`${invitation.venueName} · ${invitation.city}`}
          style={{
            fontSize: 28,
            fontWeight: 300,
            marginTop: 18,
            opacity: 0.75,
          }}
        />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
