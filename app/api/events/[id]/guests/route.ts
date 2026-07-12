import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createGuestsSchema } from "@/lib/validations/guest";
import { addGuests, getGuestStats, listGuests } from "@/services/guests";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;

  const [guests, stats] = await Promise.all([
    listGuests(id, session.user.id),
    getGuestStats(id, session.user.id),
  ]);

  // `null` means the event isn't this owner's — indistinguishable from missing,
  // on purpose: a stranger probing ids learns nothing either way.
  if (!guests || !stats) {
    return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ guests, stats });
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json().catch(() => null);
  const parsed = createGuestsSchema.safeParse(body);

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .at(0);

    return NextResponse.json(
      { error: first ?? "بيانات الضيوف غير صالحة" },
      { status: 400 },
    );
  }

  const guests = await addGuests(id, session.user.id, parsed.data.guests);
  if (!guests) {
    return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ guests }, { status: 201 });
}
