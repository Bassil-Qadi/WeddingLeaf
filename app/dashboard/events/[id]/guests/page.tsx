import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getEventForOwner } from "@/services/events";
import { getGuestStats, listGuests } from "@/services/guests";
import { GuestManager } from "@/features/guests/components/guest-manager";

export const metadata: Metadata = {
  title: "قائمة الضيوف",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const event = await getEventForOwner(id, session!.user.id);
  if (!event) {
    notFound();
  }

  const [guests, stats] = await Promise.all([
    listGuests(id, session!.user.id),
    getGuestStats(id, session!.user.id),
  ]);

  if (!guests || !stats) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link
          href={`/dashboard/events/${event.id}`}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          العودة إلى الدعوة
        </Link>

        <h1 className="font-heading text-2xl">قائمة الضيوف</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.brideName} و {event.groomName} — {event.dateDisplay}
        </p>
      </div>

      <GuestManager
        eventId={event.id}
        slug={event.slug}
        brideName={event.brideName}
        groomName={event.groomName}
        isPublished={event.isPublished}
        initialGuests={guests}
        initialStats={stats}
      />
    </div>
  );
}
