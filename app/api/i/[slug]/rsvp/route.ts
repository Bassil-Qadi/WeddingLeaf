import { NextResponse } from "next/server";

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
};

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
      status: result.guest.status,
      partySize: result.guest.partySize,
    },
  });
}
