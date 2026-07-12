import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { EventForm } from "@/features/dashboard/components/event-form";

export const metadata: Metadata = {
  title: "دعوة جديدة",
};

export default function NewEventPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          العودة إلى دعواتي
        </Link>
        <h1 className="font-heading text-2xl">دعوة جديدة</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          أدخل تفاصيل الحفل — يمكنك إضافة الصور ونشر الدعوة لاحقًا
        </p>
      </div>

      <EventForm mode="create" />
    </div>
  );
}
