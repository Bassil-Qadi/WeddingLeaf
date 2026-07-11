import Link from "next/link";
import type { Metadata } from "next";
import { Leaf, Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { listEventsByOwner } from "@/services/events";
import { Button } from "@/components/ui/button";
import { EventGrid } from "@/features/dashboard/components/event-grid";

export const metadata: Metadata = {
  title: "دعواتي",
};

export default async function DashboardPage() {
  const session = await auth();
  const events = await listEventsByOwner(session!.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl">دعواتي</h1>
          <p className="text-sm text-muted-foreground">
            أنشئ وأدر دعوات الزفاف الرقمية الخاصة بك
          </p>
        </div>

        {events.length > 0 && (
          <Button nativeButton={false} render={<Link href="/dashboard/events/new" />}>
            <Plus data-icon="inline-start" />
            دعوة جديدة
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="h-7 w-7" />
          </div>
          <div>
            <p className="font-heading text-lg">لا توجد لديك دعوات بعد</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ابدأ بإنشاء أول دعوة زفاف رقمية لك
            </p>
          </div>
          <Button nativeButton={false} size="lg" render={<Link href="/dashboard/events/new" />}>
            <Plus data-icon="inline-start" />
            إنشاء دعوة جديدة
          </Button>
        </div>
      ) : (
        <EventGrid events={events} />
      )}
    </div>
  );
}
