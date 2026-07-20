import type { ImageLoaderProps } from "next/image";

/**
 * Delivery for couple-uploaded photos.
 *
 * `next/image` asks this for a URL at each width in its srcset; we answer with
 * a Cloudinary transformation, so the browser downloads a variant sized to the
 * slot it will actually occupy instead of the couple's full-resolution phone
 * photo. Next never fetches the bytes itself, which is why these arbitrary
 * remote hostnames need no `remotePatterns` entry.
 *
 * The transformation is deliberately conservative about quality — these are
 * wedding photographs, and softening someone's face to save a few KB is the
 * wrong trade:
 *
 * - `f_auto`     — AVIF/WebP where the browser supports it, else the original.
 * - `q_auto:best` — the highest automatic quality. Measured on a real 390KB
 *   photo: 82KB at 1200px, versus 39KB for plain `q_auto`. Twice the bytes of
 *   the default, still a fifth of the original, and visually clean.
 * - `c_limit`    — scales down only. A couple who uploads a small photo gets it
 *   at its native size rather than upscaled into blur.
 *
 * Non-Cloudinary sources pass through untouched: events created before the
 * Cloudinary migration still hold Azure URLs, and the /demo fixture has none
 * at all. Those simply render as-is.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const marker = "/image/upload/";
  const at = src.indexOf(marker);
  if (!src.includes("res.cloudinary.com") || at === -1) return src;

  const head = src.slice(0, at + marker.length);
  const tail = src.slice(at + marker.length);

  // An explicit `quality` prop wins, so a caller can dial a specific image
  // down; otherwise we take Cloudinary's best automatic setting.
  const q = typeof quality === "number" ? `q_${quality}` : "q_auto:best";

  return `${head}f_auto,${q},c_limit,w_${width}/${tail}`;
}
