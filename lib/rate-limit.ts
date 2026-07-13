import { connectToDatabase } from "@/lib/mongodb";
import { RateLimit } from "@/models/RateLimit";

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the current window closes — the `Retry-After` value. */
  retryAfter: number;
}

/**
 * The caller's IP, or `null` if the request doesn't carry one.
 *
 * `NextRequest.ip` was removed in Next 15, so this reads forwarding headers.
 * Know what that is and isn't worth:
 *
 * `x-real-ip` is preferred because the proxies that set it (Vercel, nginx,
 * Azure Front Door) *overwrite* it with the address they actually accepted the
 * connection from, so a client cannot dictate it. `x-forwarded-for` is the
 * fallback, and it is only as honest as whatever sits in front of us — Next's
 * own server passes a client-supplied value straight through, so on an origin
 * exposed directly to the internet an attacker can rotate the header and mint a
 * fresh budget on every request.
 *
 * So: this is a throttle on casual abuse, never an access control. Nothing may
 * rest on it alone. The bound that actually holds is the per-event ceiling in
 * `submitRsvp`, which doesn't care about IPs at all.
 *
 * When there is no header we return `null` rather than a placeholder like
 * "unknown". A placeholder reads as a valid identity and quietly collapses every
 * visitor on earth into one shared bucket — so the sixteenth guest to answer
 * would get a 429, on the wedding day, when the couple can least afford it.
 * Leaving an unidentifiable caller unlimited is by far the lesser evil.
 */
export function clientIp(request: Request): string | null {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Left-most entry is the original client; everything after it is a proxy.
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return null;
}

async function bump(key: string, expiresAt: Date): Promise<number> {
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { upsert: true, new: true },
  ).lean();

  return doc?.count ?? 1;
}

async function countOf(key: string): Promise<number> {
  const doc = await RateLimit.findOne({ key }).select("count").lean();
  return doc?.count ?? 0;
}

/**
 * Allow at most `limit` hits against `scope` in any trailing `windowMs`.
 *
 * Counts live in fixed buckets, but the decision is made against a *sliding*
 * estimate: this bucket's count plus the previous bucket's, weighted by how
 * much of it still falls inside the trailing window. That is the standard
 * two-bucket approximation, and it costs one indexed read on top of the
 * increment — no timestamp list to read, trim and write back.
 *
 * Plain fixed windows are the obvious cheaper thing and they are a trap: a
 * caller who straddles a boundary gets a fresh budget immediately, so "15 per
 * 10 minutes" actually permits 30 back to back. That is not theoretical — the
 * test for this function straddled a boundary by accident on its second run and
 * sailed through 17 requests without a single refusal. A limit that only holds
 * when the clock is kind is not a limit.
 *
 * Fails open. If Mongo is unreachable the limiter can't say yes or no, and
 * refusing every guest's RSVP because the counter is down would turn a degraded
 * dependency into a total outage of the one feature the couple is paying for.
 */
export async function rateLimit(
  scope: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const windowEnds = (window + 1) * windowMs;
  const elapsed = now - window * windowMs;
  const retryAfter = Math.max(1, Math.ceil((windowEnds - now) / 1000));

  try {
    await connectToDatabase();

    // A grace period past the bucket's end, so the TTL reaper cannot delete a
    // bucket that the *next* window still needs to read for its estimate.
    const expiresAt = new Date(windowEnds + windowMs);
    const key = `${scope}:${window}`;

    let current: number;
    try {
      current = await bump(key, expiresAt);
    } catch {
      // Two requests raced to create this bucket and one lost the unique index.
      // The document exists now, so the retry just counts against it. Without
      // this, a burst — precisely what we are defending against — would fail
      // open on the duplicate-key error caught below.
      current = await bump(key, expiresAt);
    }

    const previous = await countOf(`${scope}:${window - 1}`);
    const estimate = previous * (1 - elapsed / windowMs) + current;

    return { ok: estimate <= limit, retryAfter };
  } catch {
    return { ok: true, retryAfter };
  }
}

/**
 * `rateLimit` keyed by the caller's IP, and a no-op when there isn't one.
 * See {@link clientIp} for why an unidentifiable caller goes unlimited.
 */
export async function rateLimitByIp(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  if (!ip) return { ok: true, retryAfter: 0 };

  return rateLimit(`${scope}:${ip}`, limit, windowMs);
}
