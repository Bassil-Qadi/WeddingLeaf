/**
 * WeddingLeaf design tokens — for JS/TS contexts only (framer-motion color
 * animations, chart fills, <meta theme-color>, canvas/SVG exports, etc).
 *
 * These values MUST match app/globals.css exactly (the light-mode :root
 * block). globals.css is the source of truth for anything rendered via
 * Tailwind classes (bg-primary, text-foreground, etc) — this file exists
 * only because CSS custom properties aren't readable from plain JS/TS
 * without a DOM lookup. If you change a color, change it in BOTH places.
 */
export const designSystem = {
  colors: {
    background: "#F9F7F3", // ivory
    foreground: "#262626", // charcoal
    primary: "#C6A86A", // gold
    secondary: "#8FA88F", // sage
    accent: "#D7A7A0", // rose
    white: "#FFFFFF",
    black: "#171717",

    success: "#4CAF50",
    warning: "#F59E0B",
    error: "#EF4444",
  },

  radius: {
    sm: "8px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    full: "9999px",
  },

  spacing: {
    section: "7rem",
    container: "1280px",
  },

  animation: {
    fast: 0.15,
    normal: 0.3,
    luxury: 0.6,
    cinematic: 1.2,
  },

  shadow: {
    sm: "0 2px 8px rgba(0,0,0,.06)",
    md: "0 8px 24px rgba(0,0,0,.08)",
    lg: "0 16px 48px rgba(0,0,0,.12)",
  },
} as const;