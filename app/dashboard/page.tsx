import Link from "next/link";
import type { Metadata } from "next";
import { Leaf, Plus, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { listEventsByOwner } from "@/services/events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventGrid } from "@/features/dashboard/components/event-grid";

export const metadata: Metadata = {
  title: "دعواتي",
};

export default async function DashboardPage() {
  const session = await auth();
  const events = await listEventsByOwner(session!.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl">دعواتي</h1>
            {events.length > 0 && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {events.length}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
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
        <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-dashed bg-card/50 px-6 py-24 text-center">
          <div className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-primary/25 to-primary/5 text-primary ring-1 ring-primary/25">
              <Leaf className="h-7 w-7" />
            </div>
          </div>

          <div>
            <p className="font-heading text-xl">لا توجد لديك دعوات بعد</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              ابدأ بإنشاء أول دعوة زفاف رقمية لك — أدخل التفاصيل، ارفع الصور،
              وشارك الرابط مع ضيوفك خلال دقائق
            </p>
          </div>

          <Button nativeButton={false} size="lg" render={<Link href="/dashboard/events/new" />}>
            <Sparkles data-icon="inline-start" />
            إنشاء أول دعوة
          </Button>
        </div>
      ) : (
        <EventGrid events={events} />
      )}
    </div>
  );
}
