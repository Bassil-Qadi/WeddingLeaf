import type { Metadata } from "next";
import { EventForm } from "@/features/dashboard/components/event-form";

export const metadata: Metadata = {
  title: "دعوة جديدة",
};

export default function NewEventPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl">دعوة جديدة</h1>
        <p className="text-sm text-muted-foreground">
          أدخل تفاصيل الحفل — يمكنك إضافة الصور ونشر الدعوة لاحقًا
        </p>
      </div>

      <EventForm mode="create" />
    </div>
  );
}
