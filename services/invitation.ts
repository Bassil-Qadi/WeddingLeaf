import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/models/Event";
import type { InvitationData } from "@/features/invitation/types";

/**
 * Fetch an invitation by its public slug and map it into the plain,
 * serializable {@link InvitationData} DTO the client experience consumes.
 *
 * Unpublished events are only returned to their owner (`viewerId` matching
 * `ownerId`) — this powers the "preview as owner" link in the dashboard
 * without exposing draft invitations publicly.
 *
 * Returns `null` when no matching event is visible to this viewer — the
 * page turns that into a `notFound()`. Any connection error is swallowed to
 * `null` so a missing DB in local preview degrades gracefully (the page then
 * falls back to the sample invitation rather than crashing).
 */
export async function getInvitationBySlug(
  slug: string,
  viewerId?: string,
): Promise<InvitationData | null> {
  try {
    await connectToDatabase();

    const doc = await Event.findOne({
      slug: slug.toLowerCase(),
      $or: [{ isPublished: true }, ...(viewerId ? [{ ownerId: viewerId }] : [])],
    }).lean();

    if (!doc) return null;

    return {
      slug: doc.slug,
      style: doc.style,
      groomName: doc.groomName,
      brideName: doc.brideName,
      dateISO: new Date(doc.date).toISOString(),
      dateDisplay: doc.dateDisplay,
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
      message: doc.message ?? undefined,
    };
  } catch {
    // No DB connection (e.g. local design preview) — let the caller decide.
    return null;
  }
}
