import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { setSentSchema } from "@/lib/validations/guest";
import { setGuestsSent } from "@/services/guests";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Mark invitations sent (or un-mark them) — see setGuestsSent for why undo exists. */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json().catch(() => null);
  const parsed = setSentSchema.safeParse(body);

  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)
      .flat()
      .at(0);

    return NextResponse.json(
      { error: first ?? "طلب غير صالح" },
      { status: 400 },
    );
  }

  const updated = await setGuestsSent(
    id,
    session.user.id,
    parsed.data.guestIds,
    parsed.data.sent,
  );

  if (updated === null) {
    return NextResponse.json({ error: "الدعوة غير موجودة" }, { status: 404 });
  }

  return NextResponse.json({ updated });
}
