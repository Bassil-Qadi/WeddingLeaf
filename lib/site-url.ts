/**
 * The public origin this app is being served from.
 *
 * Metadata needs it. `og:image` has to be an *absolute* URL — a crawler is not
 * fetching it in the context of the page — so Next resolves the generated card
 * against `metadataBase`. Leave that unset and Next falls back to
 * `http://localhost:3000`, which means the share card works perfectly in
 * development and, on any host that isn't Vercel, ships a link preview pointing
 * at the guest's own machine. WhatsApp fetches nothing and shows no image, and
 * nothing anywhere reports an error.
 *
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://weddingleaf.com). The
 * fallbacks below are only there so dev and preview deployments keep working.
 */
export function siteUrl(): URL {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL;
  if (explicit) return new URL(explicit);

  // Netlify hands us the site's own origin, already absolute and with a scheme.
  // `URL` is Netlify's name for it, not ours — hence the NETLIFY guard, so a
  // stray `URL` in some other environment cannot hijack every share card.
  if (process.env.NETLIFY && process.env.URL) {
    return new URL(process.env.URL);
  }

  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }

  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
