"use client";

import { useRouter } from "next/navigation";
import { Download, TriangleAlert, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GuestRecord, GuestStats } from "@/services/guests";
import { AddGuestsDialog } from "./add-guests-dialog";
import { GuestStatsRow } from "./guest-stats";
import { GuestTable } from "./guest-table";

interface GuestManagerProps {
  eventId: string;
  slug: string;
  brideName: string;
  groomName: string;
  isPublished: boolean;
  initialGuests: GuestRecord[];
  initialStats: GuestStats;
}

export function GuestManager({
  eventId,
  slug,
  brideName,
  groomName,
  isPublished,
  initialGuests,
  initialStats,
}: GuestManagerProps) {
  const router = useRouter();

  // The server component above is the source of truth for the list and the
  // headcount; a mutation just asks it to re-render rather than keeping a
  // second copy of the numbers in sync here.
  const refresh = () => router.refresh();

  return (
    <div className="flex flex-col gap-6">
      <GuestStatsRow stats={initialStats} />

      {!isPublished && initialGuests.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-medium text-amber-700">الدعوة غير منشورة</p>
            <p className="mt-0.5 text-muted-foreground">
              روابط الضيوف لن تعمل ولن يتمكّن أحد من تأكيد حضوره حتى تنشروا
              الدعوة.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {initialGuests.length === 0
            ? "لم تتم إضافة أي ضيف بعد"
            : `${initialGuests.length} ضيفًا في القائمة`}
        </p>

        <div className="flex gap-2">
          {initialGuests.length > 0 && (
            <Button
              nativeButton={false}
              variant="outline"
              render={
                <a href={`/api/events/${eventId}/guests/export`} download />
              }
            >
              <Download data-icon="inline-start" />
              تصدير CSV
            </Button>
          )}

          <AddGuestsDialog eventId={eventId} onAdded={refresh} />
        </div>
      </div>

      {initialGuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Users className="size-6" />
          </div>

          <div>
            <p className="font-heading text-lg">ابدأوا بإضافة ضيوفكم</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              كل ضيف يحصل على رابط دعوة يحمل اسمه وعدد مقاعده — وترون من فتح
              الدعوة ومن أكّد حضوره في هذه الصفحة.
            </p>
          </div>
        </div>
      ) : (
        <GuestTable
          eventId={eventId}
          slug={slug}
          brideName={brideName}
          groomName={groomName}
          guests={initialGuests}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
