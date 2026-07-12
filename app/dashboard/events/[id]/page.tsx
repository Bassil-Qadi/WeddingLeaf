import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getEventForOwner } from "@/services/events";
import { STYLE_LABELS } from "@/lib/wedding-styles";
import { Badge } from "@/components/ui/badge";
import { PublishToggle } from "@/features/dashboard/components/publish-toggle";
import { EventImages } from "@/features/dashboard/components/event-images";
import { EventForm } from "@/features/dashboard/components/event-form";
import { DeleteEventCard } from "@/features/dashboard/components/delete-event-card";

export const metadata: Metadata = {
  title: "تعديل الدعوة",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const event = await getEventForOwner(id, session!.user.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-4" />
            العودة إلى دعواتي
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl">
              {event.brideName} &amp; {event.groomName}
            </h1>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              {STYLE_LABELS[event.style]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            آخر تحديث {new Date(event.updatedAt).toLocaleDateString("ar")}
          </p>
        </div>
      </div>

      <PublishToggle
        eventId={event.id}
        slug={event.slug}
        isPublished={event.isPublished}
      />

      <EventImages
        eventId={event.id}
        coverImageUrl={event.coverImageUrl}
        galleryImages={event.galleryImages}
      />

      <EventForm
        mode="edit"
        eventId={event.id}
        defaultValues={{
          slug: event.slug,
          style: event.style,
          groomName: event.groomName,
          brideName: event.brideName,
          date: event.date,
          dateDisplay: event.dateDisplay,
          city: event.city,
          venueName: event.venueName,
          venueAddress: event.venueAddress,
          mapUrl: event.mapUrl,
          dressCode: event.dressCode,
          schedule: event.schedule,
          message: event.message,
        }}
      />

      <DeleteEventCard eventId={event.id} />
    </div>
  );
}
