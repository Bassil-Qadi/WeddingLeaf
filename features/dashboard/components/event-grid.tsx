"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  Copy,
  Eye,
  Loader2,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import type { EventSummary } from "@/services/events";
import { STYLE_LABELS } from "@/lib/wedding-styles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EventGrid({ events }: { events: EventSummary[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventCard({ event }: { event: EventSummary }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const publicUrl = `/i/${event.slug}`;

  function copyLink() {
    const url = `${window.location.origin}${publicUrl}`;
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ رابط الدعوة");
  }

  async function handleDelete() {
    setIsDeleting(true);
    const response = await fetch(`/api/events/${event.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!response.ok) {
      toast.error("تعذّر حذف الدعوة");
      return;
    }

    toast.success("تم حذف الدعوة");
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-36 w-full bg-[radial-gradient(circle_at_top,#fdf6ea,transparent_70%)]">
        {event.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            🌿
          </div>
        )}

        <Badge
          variant={event.isPublished ? "default" : "outline"}
          className="absolute top-3 end-3 bg-background/90"
        >
          {event.isPublished ? "منشورة" : "مسودة"}
        </Badge>
      </div>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-heading text-lg">
              {event.brideName} &amp; {event.groomName}
            </p>
            <p className="text-xs text-muted-foreground">
              {STYLE_LABELS[event.style]}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={<Link href={`/dashboard/events/${event.id}`} />}
              >
                <Pencil /> تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href={publicUrl} target="_blank" />}
              >
                <Eye /> معاينة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>
                <Copy /> نسخ الرابط
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 /> حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {event.dateDisplay}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {event.venueName} — {event.city}
          </p>
        </div>

        <div className="mt-1 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            render={<Link href={`/dashboard/events/${event.id}`} />}
          >
            تعديل
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={copyLink}
          >
            <Copy /> نسخ الرابط
          </Button>
        </div>
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف الدعوة؟</DialogTitle>
            <DialogDescription>
              سيتم حذف دعوة {event.brideName} و{event.groomName} نهائيًا ولن
              يتمكن ضيوفك من الوصول إليها بعد الآن.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="animate-spin" />}
              حذف نهائيًا
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
