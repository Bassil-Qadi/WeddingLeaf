"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  Copy,
  Eye,
  Leaf,
  Loader2,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
  const editUrl = `/dashboard/events/${event.id}`;

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
    <Card className="group overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      <Link
        href={editUrl}
        className="relative block h-36 w-full overflow-hidden bg-[radial-gradient(circle_at_top,#fdf6ea,transparent_70%)] dark:bg-[radial-gradient(circle_at_top,#26221a,transparent_70%)]"
      >
        {event.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40 transition-transform duration-500 group-hover:scale-110">
            <Leaf className="h-10 w-10" />
          </div>
        )}

        <Badge
          variant="outline"
          className={cn(
            "absolute top-3 end-3 gap-1.5 border-transparent bg-background/90 backdrop-blur-sm",
            event.isPublished ? "text-success" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              event.isPublished ? "bg-success" : "bg-warning"
            )}
          />
          {event.isPublished ? "منشورة" : "مسودة"}
        </Badge>
      </Link>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={editUrl}
              className="font-heading text-lg transition-colors hover:text-primary"
            >
              {event.brideName} &amp; {event.groomName}
            </Link>
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
              <DropdownMenuItem render={<Link href={editUrl} />}>
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
            <Calendar className="size-3.5 shrink-0 text-primary/70" />
            {event.dateDisplay}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-primary/70" />
            <span className="truncate">
              {event.venueName} — {event.city}
            </span>
          </p>
        </div>

        <div className="mt-1 flex gap-2">
          <Button
          nativeButton={false} 
            variant="outline"
            size="sm"
            className="flex-1"
            render={<Link href={editUrl} />}
          >
            <Pencil /> تعديل
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
