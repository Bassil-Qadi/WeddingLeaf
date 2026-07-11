"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Eye } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PublishToggleProps {
  eventId: string;
  slug: string;
  isPublished: boolean;
}

export function PublishToggle({
  eventId,
  slug,
  isPublished,
}: PublishToggleProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const publicUrl = `/i/${slug}`;

  async function handleChange(checked: boolean) {
    setPending(true);
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: checked }),
    });
    setPending(false);

    if (!response.ok) {
      toast.error("تعذّر تحديث حالة النشر");
      return;
    }

    toast.success(checked ? "تم نشر الدعوة" : "تم إلغاء نشر الدعوة");
    router.refresh();
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}${publicUrl}`);
    toast.success("تم نسخ رابط الدعوة");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <Switch
          id="publish"
          checked={isPublished}
          onCheckedChange={handleChange}
          disabled={pending}
        />
        <div>
          <Label htmlFor="publish">
            {isPublished ? "الدعوة منشورة" : "الدعوة مسودة"}
          </Label>
          <p className="text-xs text-muted-foreground">
            {isPublished
              ? "يمكن لضيوفك الوصول إلى الدعوة عبر الرابط العام"
              : "الدعوة غير مرئية للضيوف حتى يتم نشرها"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          <Copy /> نسخ الرابط
        </Button>
        <Button
          variant="secondary"
          size="sm"
          render={<Link href={publicUrl} target="_blank" />}
        >
          <Eye /> معاينة
        </Button>
      </div>
    </div>
  );
}
