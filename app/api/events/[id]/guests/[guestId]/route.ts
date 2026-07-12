import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { updateGuestSchema } from "@/lib/validations/guest";
import { deleteGuest, updateGuest } from "@/services/guests";

interface RouteParams {
  params: Promise<{ id: string; guestId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id, guestId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = updateGuestSchema.safeParse(body);

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .at(0);

    return NextResponse.json(
      { error: first ?? "بيانات الضيف غير صالحة" },
      { status: 400 },
    );
  }

  const guest = await updateGuest(id, session.user.id, guestId, parsed.data);
  if (!guest) {
    return NextResponse.json({ error: "الضيف غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ guest });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id, guestId } = await params;

  const deleted = await deleteGuest(id, session.user.id, guestId);
  if (!deleted) {
    return NextResponse.json({ error: "الضيف غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
