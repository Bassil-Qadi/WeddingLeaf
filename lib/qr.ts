import QRCode from "qrcode";

/**
 * A QR code for `text`, as an inline SVG data URI ready to drop into `<img src>`.
 *
 * SVG rather than PNG on purpose: the door sheet is printed, and a raster QR
 * that looks fine on screen turns soft at 300dpi. Vector stays crisp at any
 * size the printer picks. `margin: 1` keeps the mandatory quiet zone (a QR with
 * no border round it won't scan) without the library's default 4-module gutter,
 * which wastes half the card.
 *
 * Error-correction "M" is the sensible middle: ~15% of the code can be smudged,
 * folded, or coffee-stained on a clipboard and it still reads.
 */
export async function qrSvgDataUri(text: string): Promise<string> {
  const svg = await QRCode.toString(text, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
  });

  // utf8 (not base64) keeps it human-readable in dev tools and is a hair smaller.
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
