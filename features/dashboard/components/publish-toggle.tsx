"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Eye, Globe, PencilLine } from "lucide-react";

import { cn } from "@/lib/utils";
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
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors",
        isPublished && "border-success/30 bg-success/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
            isPublished
              ? "bg-success/15 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isPublished ? (
            <Globe className="size-5" />
          ) : (
            <PencilLine className="size-5" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <Label htmlFor="publish">
              {isPublished ? "الدعوة منشورة" : "الدعوة مسودة"}
            </Label>
            <Switch
              id="publish"
              checked={isPublished}
              onCheckedChange={handleChange}
              disabled={pending}
            />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isPublished ? (
              <>
                متاحة لضيوفك على{" "}
                <code dir="ltr" className="rounded bg-muted px-1 py-0.5 text-[11px]">
                  {publicUrl}
                </code>
              </>
            ) : (
              "الدعوة غير مرئية للضيوف حتى يتم نشرها"
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          <Copy /> نسخ الرابط
        </Button>
        <Button
          nativeButton={false}
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
