import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The OG card reads its font files off disk at request time — Satori needs raw
   * font bytes and cannot use the `next/font` CSS the rest of the app runs on.
   * Next's file tracing follows imports, not `readFile` paths, so without this
   * the .ttf files are missing from the serverless bundle and the card 500s in
   * production while working perfectly in dev.
   */
  outputFileTracingIncludes: {
    "/i/[slug]": ["./assets/fonts/IBM_Plex_Sans_Arabic/**"],
    "/i/[slug]/[token]": ["./assets/fonts/IBM_Plex_Sans_Arabic/**"],
  },
};

export default nextConfig;
