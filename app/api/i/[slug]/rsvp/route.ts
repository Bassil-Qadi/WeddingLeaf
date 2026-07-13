import { NextResponse } from "next/server";

import { rateLimitByIp } from "@/lib/rate-limit";
import { rsvpSchema } from "@/lib/validations/guest";
import { submitRsvp } from "@/services/guests";
import { getEventIdBySlug } from "@/services/invitation";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

const REASON_MESSAGE: Record<string, string> = {
  closed: "أُغلق باب تأكيد الحضور",
  "not-found": "تعذّر العثور على هذه الدعوة",
  "over-capacity": "عدد الحضور يتجاوز المقاعد المخصّصة لكم",
  "open-limit": "اكتمل عدد الردود على هذه الدعوة",
};

/**
 * Generous on purpose. A household behind one router may hold several personal
 * invitations, and any of them may be answered, revised, and revised again — so
 * the limit has to clear a family's worth of honest fumbling. What it has to
 * stop is a script, and a script wants thousands, not fifteen. The bound that
 * actually protects the headcount is the per-event ceiling in `submitRsvp`;
 * this only makes reaching it slow and expensive.
 */
const RSVP_LIMIT = 15;
const RSVP_WINDOW_MS = 10 * 60 * 1000;

/**
 * The one public write in the app: a guest answering their invitation.
 *
 * There is no session here — the guest's token *is* their credential, and open
 * responders have none at all. So everything that matters is re-checked in
 * `submitRsvp` against the stored event: whether RSVP is on, whether the
 * deadline has passed, whether open responses are allowed, and whether the
 * party size fits the seats actually granted. The form's own limits are a
 * courtesy to the guest, not a control on the data.
 */
export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const limit = await rateLimitByIp(
    request,
    "rsvp",
    RSVP_LIMIT,
    RSVP_WINDOW_MS,
  );

  if (!limit.ok) {
    return NextResponse.json(
      { error: "محاولات كثيرة. يُرجى المحاولة بعد قليل" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .at(0);

    return NextResponse.json(
      { error: first ?? "البيانات غير صالحة" },
      { status: 400 },
    );
  }

  const eventId = await getEventIdBySlug(slug);
  if (!eventId) {
    return NextResponse.json(
      { error: REASON_MESSAGE["not-found"] },
      { status: 404 },
    );
  }

  const result = await submitRsvp(eventId, parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      { error: REASON_MESSAGE[result.reason] },
      { status: result.reason === "not-found" ? 404 : 409 },
    );
  }

  return NextResponse.json({
    guest: {
      // Handed back so an open-link responder can hold on to it and *revise*
      // their answer rather than filing a second one. It is their own row's
      // credential and nobody else's, so returning it discloses nothing.
      token: result.guest.token,
      status: result.guest.status,
      partySize: result.guest.partySize,
    },
  });
}
