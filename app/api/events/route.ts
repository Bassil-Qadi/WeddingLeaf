import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createEventSchema } from "@/lib/validations/event";
import { createEvent, isSlugTaken, listEventsByOwner } from "@/services/events";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const events = await listEventsByOwner(session.user.id);
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (await isSlugTaken(parsed.data.slug)) {
    return NextResponse.json(
      { error: { slug: ["هذا الرابط مستخدم بالفعل، جرّب رابطًا آخر"] } },
      { status: 409 },
    );
  }

  const event = await createEvent(session.user.id, parsed.data);
  return NextResponse.json({ event }, { status: 201 });
}
