import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getEventForOwner } from "@/services/events";
import { listGuests, type GuestRecord } from "@/services/guests";
import { siteUrl } from "@/lib/site-url";
import { qrSvgDataUri } from "@/lib/qr";
import { SheetPrintButton } from "@/features/guests/components/sheet-print-button";

export const metadata: Metadata = {
  title: "ورقة الاستقبال",
};

const STATUS: Record<GuestRecord["status"], { label: string; className: string }> =
  {
    attending: {
      label: "سيحضر",
      className: "border-emerald-600/40 text-emerald-700",
    },
    declined: {
      label: "اعتذر",
      className: "border-red-600/40 text-red-700",
    },
    pending: {
      label: "لم يرد",
      className: "border-gray-400 text-gray-500",
    },
  };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DoorSheetPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const event = await getEventForOwner(id, session!.user.id);
  if (!event) notFound();

  const guests = await listGuests(id, session!.user.id);
  if (!guests) notFound();

  // Alphabetical by name — a door sheet is searched by a person's name, not by
  // when they were added. Arabic collation so ا/أ/آ sort where a reader expects.
  const sorted = [...guests].sort((a, b) =>
    a.name.localeCompare(b.name, "ar"),
  );

  // Pre-render every QR on the server. The link is built against the canonical
  // public origin (siteUrl), so a sheet printed from the deployed dashboard
  // carries a scannable absolute URL, not a localhost one.
  const base = siteUrl();
  const cards = await Promise.all(
    sorted.map(async (guest) => ({
      guest,
      qr: guest.token
        ? await qrSvgDataUri(
            new URL(`/i/${event.slug}/${guest.token}`, base).toString(),
          )
        : null,
    })),
  );

  const attending = guests.filter((g) => g.status === "attending");
  const confirmedSeats = attending.reduce((sum, g) => sum + g.partySize, 0);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Toolbar — screen only; stripped from the printout. */}
      <div
        data-print-hide
        className="mb-6 flex items-center justify-between gap-4"
      >
        <Link
          href={`/dashboard/events/${event.id}/guests`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          العودة إلى القائمة
        </Link>
        <SheetPrintButton />
      </div>

      {/* The sheet itself. `data-print-sheet` is the hook the print stylesheet
          keys off to hide the dashboard chrome around it. */}
      <div
        data-print-sheet
        className="rounded-xl border bg-white p-8 text-black [print-color-adjust:exact]"
      >
        <header className="mb-6 border-b pb-4 text-center">
          <h1 className="font-heading text-2xl">
            {event.groomName} و {event.brideName}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {event.dateDisplay}
            {event.venueName ? ` — ${event.venueName}` : ""}
          </p>
          <p className="mt-3 text-xs text-gray-500">
            {guests.length} مدعو · {attending.length} مؤكّد ·{" "}
            {confirmedSeats} مقعد محجوز
          </p>
        </header>

        {cards.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            لا يوجد ضيوف في القائمة بعد.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cards.map(({ guest, qr }) => (
              <div
                key={guest.id}
                className="flex break-inside-avoid items-center gap-3 rounded-lg border border-gray-300 p-3"
              >
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qr}
                    alt=""
                    className="size-16 shrink-0"
                    aria-hidden
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded border border-dashed border-gray-300 text-[10px] text-gray-400">
                    بدون رابط
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-medium leading-tight">
                      {guest.name}
                    </p>
                    {/* Manual arrival tick — the paper fallback when nobody is
                        scanning. */}
                    <span className="mt-0.5 size-4 shrink-0 rounded-sm border border-gray-400" />
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="text-gray-600">
                      {guest.seats} مقعد
                    </span>
                    <span
                      className={`rounded border px-1.5 py-px text-[10px] ${STATUS[guest.status].className}`}
                    >
                      {STATUS[guest.status].label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
