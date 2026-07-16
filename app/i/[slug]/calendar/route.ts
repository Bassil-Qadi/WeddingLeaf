import { getInvitationBySlug } from "@/services/invitation";
import { buildEventIcs } from "@/lib/ics";
import { siteUrl } from "@/lib/site-url";

/** Weddings run long; block out a generous default so it doesn't butt against
 *  whatever else is on the guest's evening. */
const DURATION_HOURS = 4;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * The "add to calendar" file for an invitation, addressed by slug.
 *
 * Public and unauthenticated, exactly like the invitation page — but only for a
 * *published* event (no `viewerId` is passed, so a draft resolves to null and
 * 404s). No token: the calendar entry is the same wedding for every guest, so
 * there is nothing guest-specific to protect here.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;

  const invitation = await getInvitationBySlug(slug);
  if (!invitation) {
    return new Response("Not found", { status: 404 });
  }

  const location = [invitation.venueName, invitation.venueAddress, invitation.city]
    .filter(Boolean)
    .join("، ");

  const url = new URL(`/i/${invitation.slug}`, siteUrl()).toString();

  const ics = buildEventIcs({
    uid: `${invitation.slug}@weddingleaf`,
    title: `زفاف ${invitation.groomName} و ${invitation.brideName}`,
    start: new Date(invitation.dateISO),
    durationHours: DURATION_HOURS,
    location,
    description: invitation.message ?? "ندعوكم لمشاركتنا فرحتنا. تجدون التفاصيل هنا:",
    url,
  });

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // `attachment` with an .ics name is what makes a phone hand the file to
      // its calendar app rather than rendering it as text.
      "Content-Disposition": `attachment; filename="${invitation.slug}.ics"`,
      // The event details rarely change; let clients cache briefly.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
