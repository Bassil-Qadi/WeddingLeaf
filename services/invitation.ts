import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import {
  DEFAULT_TIME_ZONE,
  formatArabicDate,
  formatArabicDateDetail,
} from "@/lib/date";
import { getGuestByToken, markGuestOpened } from "@/services/guests";
import type { InvitationData } from "@/features/invitation/types";

/**
 * Unpublished events are only visible to their owner (`viewerId` matching
 * `ownerId`) — this powers the "preview as owner" link in the dashboard
 * without exposing draft invitations publicly.
 */
function visibilityFilter(slug: string, viewerId?: string) {
  return {
    slug: slug.toLowerCase(),
    $or: [{ isPublished: true }, ...(viewerId ? [{ ownerId: viewerId }] : [])],
  };
}

/**
 * Fetch an invitation by its public slug and map it into the plain,
 * serializable {@link InvitationData} DTO the client experience consumes.
 *
 * Returns `null` when no matching event is visible to this viewer, and the
 * page turns that into a `notFound()`. Note that a DB error is *not* swallowed
 * here: a slug that cannot be resolved must 404 rather than quietly render
 * someone else's wedding.
 */
export async function getInvitationBySlug(
  slug: string,
  viewerId?: string,
): Promise<InvitationData | null> {
  await connectToDatabase();

  const doc = await Event.findOne(visibilityFilter(slug, viewerId)).lean();
  if (!doc) return null;

  const instant = new Date(doc.date);
  const timeZone = doc.timeZone ?? DEFAULT_TIME_ZONE;

  return {
    slug: doc.slug,
    style: doc.style,
    groomName: doc.groomName,
    brideName: doc.brideName,
    dateISO: instant.toISOString(),
    dateDisplay: formatArabicDate(instant, doc.style, timeZone),
    dateDetail: formatArabicDateDetail(instant, doc.style, timeZone),
    city: doc.city,
    venueName: doc.venueName,
    venueAddress: doc.venueAddress,
    mapUrl: doc.mapUrl,
    dressCode: doc.dressCode ?? undefined,
    schedule: (doc.schedule ?? []).map((s) => ({
      time: s.time,
      title: s.title,
    })),
    coverImageUrl: doc.coverImageUrl ?? null,
    galleryImages: doc.galleryImages ?? [],
    couplePhotoUrl: doc.couplePhotoUrl ?? undefined,
    venuePhotoUrl: doc.venuePhotoUrl ?? undefined,
    message: doc.message ?? undefined,
    story: doc.story ?? undefined,
    hashtag: doc.hashtag ?? undefined,
    rsvpPhone: doc.rsvpPhone ?? undefined,
    rsvpEnabled: doc.rsvpEnabled ?? true,
    rsvpDeadline: doc.rsvpDeadline
      ? new Date(doc.rsvpDeadline).toISOString()
      : null,
    allowOpenRsvp: doc.allowOpenRsvp ?? true,
    maxPartySize: doc.maxPartySize ?? 4,
  };
}

/**
 * The same invitation, addressed to the guest behind `token`, and stamped as
 * opened. A token that doesn't belong to this event resolves to `null` so the
 * route can 404 rather than silently degrading to the anonymous invitation —
 * a guest following a link from their own WhatsApp should never be greeted as
 * a stranger, and if they are, something is wrong and we want to know.
 */
export async function getInvitationForGuest(
  slug: string,
  token: string,
  viewerId?: string,
): Promise<InvitationData | null> {
  await connectToDatabase();

  const doc = await Event.findOne(visibilityFilter(slug, viewerId))
    .select("_id")
    .lean();
  if (!doc) return null;

  const eventId = doc._id.toString();
  const guest = await getGuestByToken(eventId, token);
  if (!guest) return null;

  const invitation = await getInvitationBySlug(slug, viewerId);
  if (!invitation) return null;

  await markGuestOpened(eventId, token);

  return {
    ...invitation,
    guest: {
      token,
      name: guest.name,
      seats: guest.seats,
      status: guest.status,
      partySize: guest.partySize,
      note: guest.note,
    },
  };
}

/** The RSVP endpoint is addressed by slug; the guest service works in ids. */
export async function getEventIdBySlug(slug: string): Promise<string | null> {
  await connectToDatabase();

  const doc = await Event.findOne({ slug: slug.toLowerCase() })
    .select("_id")
    .lean();

  return doc ? doc._id.toString() : null;
}
