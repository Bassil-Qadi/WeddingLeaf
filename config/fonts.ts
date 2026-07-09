import localFont from "next/font/local";
import { Amiri, Cormorant_Garamond } from "next/font/google";

/**
 * Primary Arabic body font — used everywhere by default (--font-sans).
 * Self-hosted from /assets/fonts so the app never depends on a live
 * connection to Google Fonts at build or request time.
 *
 * ExtraLight (200) exists for the invitation's large display text — the
 * hairline strokes at 100px are what make the names read as "luxury".
 */
export const arabic = localFont({
  src: [
    {
      path: "../assets/fonts/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBM_Plex_Sans_Arabic/IBMPlexSansArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
});

/**
 * Dashboard / UI font — distinct from the body font so the creator
 * dashboard feels a little more modern/geometric than the guest-facing
 * invitation copy. Cairo ships as a single variable-weight file.
 */
export const cairo = localFont({
  src: "../assets/fonts/Cairo/Cairo-VariableFont_slnt,wght.ttf",
  variable: "--font-cairo",
  display: "swap",
});

/**
 * Decorative font — invitation headline moments ONLY (bride & groom
 * names, cinematic titles). Never for body text or dashboard UI. We don't
 * have local files for this one, so it stays on next/font/google.
 */
export const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  weight: ["400", "700"],
  display: "swap",
});

/**
 * Latin serif companion for the invitation experience — carries the `&`,
 * the small-caps labels, the chapter numerals and the dates. It is never a
 * text face: it only ever sets a handful of glyphs beside the Arabic.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});