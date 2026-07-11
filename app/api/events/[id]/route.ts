import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateEventSchema } from "@/lib/validations/event";
import {
  deleteEvent,
  getEventForOwner,
  isSlugTaken,
  updateEvent,
} from "@/services/events";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const event = await getEventForOwner(id, session.user.id);
  if (!event) {
    return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (
    parsed.data.slug &&
    (await isSlugTaken(parsed.data.slug, id))
  ) {
    return NextResponse.json(
      { error: { slug: ["هذا الرابط مستخدم بالفعل، جرّب رابطًا آخر"] } },
      { status: 409 },
    );
  }

  const event = await updateEvent(id, session.user.id, parsed.data);
  if (!event) {
    return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteEvent(id, session.user.id);
  if (!deleted) {
    return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
