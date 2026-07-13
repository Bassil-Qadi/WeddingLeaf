/**
 * The bots that fetch a page purely to build a link preview.
 *
 * WhatsApp is the one that matters here: when a couple sends an invitation, its
 * crawler fetches the URL to render the preview card in the chat. That request
 * looks exactly like a visit, which means anything the page records as a "view"
 * gets recorded at the moment the link is *sent* rather than opened — and the
 * open-rate the couple is shown becomes 100% before a single guest has looked.
 *
 * Matched loosely and case-insensitively: a preview bot that slips through and
 * inflates one guest's row is a small error, while a real guest mistaken for a
 * bot never gets counted at all, so we bias toward the former.
 */
const CRAWLER_PATTERN =
  /bot|crawler|spider|facebookexternalhit|whatsapp|telegram|slackbot|discord|twitterbot|linkedin|pinterest|embedly|quora|skype|preview|vkshare|redditbot|applebot/i;

export function isCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return CRAWLER_PATTERN.test(userAgent);
}
