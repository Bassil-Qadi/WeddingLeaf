import { auth } from "@/lib/auth";
import { listGuests, type GuestRecord } from "@/services/guests";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const STATUS_LABEL: Record<GuestRecord["status"], string> = {
  pending: "لم يرد",
  attending: "سيحضر",
  declined: "اعتذر",
};

/** Wrap every cell: Arabic names carry commas, and notes carry newlines. */
function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * The guest list as a spreadsheet — the artifact that actually leaves the app.
 * It goes to the venue, so it leads with the columns a caterer counts: who is
 * coming and how many seats they claimed.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("غير مصرح", { status: 401 });
  }

  const { id } = await params;
  const guests = await listGuests(id, session.user.id);

  if (!guests) {
    return new Response("الدعوة غير موجودة", { status: 404 });
  }

  const header = [
    "الاسم",
    "الهاتف",
    "المقاعد المخصصة",
    "الحالة",
    "عدد الحضور",
    "ملاحظة",
    "فتح الدعوة",
  ];

  const rows = guests.map((guest) =>
    [
      csvCell(guest.name),
      csvCell(guest.phone),
      csvCell(guest.seats),
      csvCell(STATUS_LABEL[guest.status]),
      csvCell(guest.status === "attending" ? guest.partySize : 0),
      csvCell(guest.note),
      csvCell(guest.openedAt ? "نعم" : "لا"),
    ].join(","),
  );

  const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");

  return new Response(
    // Excel reads a UTF-8 CSV as the local codepage unless it finds a BOM,
    // which turns every Arabic name into mojibake for the one person who most
    // needs to read it.
    `﻿${csv}`,
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="guests-${id}.csv"`,
      },
    },
  );
}
