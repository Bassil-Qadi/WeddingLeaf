"use client";

import { useState } from "react";
import { Check, Copy, PhoneOff, Send, SkipForward } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GuestRecord } from "@/services/guests";
import {
  invitationUrl,
  whatsappSendUrl,
  type MessageContext,
} from "../lib/whatsapp";

interface SendQueueProps extends MessageContext {
  eventId: string;
  isPublished: boolean;
  guests: GuestRecord[];
  onChanged: () => void;
}

/**
 * The send queue.
 *
 * There is no bulk send here and there cannot be one: WhatsApp has no API a
 * couple could authorise, so every invitation is a human tapping send in the
 * WhatsApp UI. Three hundred guests is three hundred taps no matter what we
 * build. What we *can* remove is the part that actually defeats people —
 * scrolling a table to work out who they had reached before they were
 * interrupted. So the queue hands them one guest at a time and remembers.
 *
 * Open-link responders are excluded. They invited themselves; sending them an
 * invitation is a non-sequitur.
 */
export function SendQueue({
  eventId,
  isPublished,
  guests,
  onChanged,
  ...context
}: SendQueueProps) {
  const [open, setOpen] = useState(false);
  // Optimistic, and reset every time the dialog opens. `sent` mirrors a write we
  // have already made; `skipped` is a "not now" that lives only for this sitting.
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const invited = [...guests]
    .filter((guest) => guest.source === "list" && guest.token)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const isSent = (guest: GuestRecord) =>
    Boolean(guest.sentAt) || sentIds.has(guest.id);

  const sentCount = invited.filter(isSent).length;
  const queue = invited.filter(
    (guest) => !isSent(guest) && !skippedIds.has(guest.id),
  );
  const current = queue[0];

  const percent = invited.length
    ? Math.round((sentCount / invited.length) * 100)
    : 0;

  function openQueue() {
    setSentIds(new Set());
    setSkippedIds(new Set());
    setCopied(false);
    setOpen(true);
  }

  async function markSent(guest: GuestRecord) {
    // Optimistic on purpose: this runs inside the click that opens WhatsApp, and
    // the couple's attention has already left for another tab. Waiting on the
    // round-trip to advance the card would just leave a stale guest on screen.
    setSentIds((previous) => new Set(previous).add(guest.id));
    setCopied(false);
    setBusy(true);

    try {
      const response = await fetch(`/api/events/${eventId}/guests/sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestIds: [guest.id], sent: true }),
      });

      if (!response.ok) {
        setSentIds((previous) => {
          const next = new Set(previous);
          next.delete(guest.id);
          return next;
        });
        toast.error("تعذّر تسجيل الإرسال");
        return;
      }

      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function markAllSent() {
    const ids = queue.map((guest) => guest.id);
    if (ids.length === 0) return;

    setBusy(true);

    try {
      const response = await fetch(`/api/events/${eventId}/guests/sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestIds: ids, sent: true }),
      });

      if (!response.ok) {
        toast.error("تعذّر تسجيل الإرسال");
        return;
      }

      setSentIds((previous) => new Set([...previous, ...ids]));
      toast.success(`تم تعليم ${ids.length.toLocaleString("ar")} دعوة كمُرسلة`);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function copyLink(guest: GuestRecord) {
    await navigator.clipboard.writeText(invitationUrl(context.slug, guest.token!));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function skip(guest: GuestRecord) {
    setSkippedIds((previous) => new Set(previous).add(guest.id));
    setCopied(false);
  }

  const sendUrl = current ? whatsappSendUrl(current, context) : null;

  return (
    <>
      <Button
        variant="outline"
        onClick={openQueue}
        // Guest links 404 until the invitation is published. Sending three
        // hundred people a dead link is the worst thing this page could do, and
        // it is the kind of mistake nobody makes twice — because there is no
        // second first impression.
        disabled={!isPublished || invited.length === 0}
        title={
          !isPublished
            ? "انشروا الدعوة أولًا — روابط الضيوف لن تعمل قبل ذلك"
            : undefined
        }
      >
        <Send data-icon="inline-start" />
        إرسال الدعوات
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إرسال الدعوات</DialogTitle>
            <DialogDescription>
              يفتح واتساب برسالة جاهزة لكل ضيف — تضغطون إرسال، ونحن نتذكّر أين
              وصلتم.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {sentCount.toLocaleString("ar")} من{" "}
                {invited.length.toLocaleString("ar")} أُرسلت
              </span>
              <span>{percent.toLocaleString("ar")}٪</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {current ? (
            <div className="flex flex-col gap-4 rounded-xl border bg-card/50 p-4">
              <div className="flex flex-col gap-0.5">
                <span className="font-heading text-lg">{current.name}</span>

                {current.phone ? (
                  <span dir="ltr" className="text-sm text-muted-foreground">
                    {current.phone}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-amber-600">
                    <PhoneOff className="size-3.5" />
                    لا يوجد رقم — انسخوا الرابط وأرسلوه بأنفسكم
                  </span>
                )}

                <span className="mt-0.5 text-xs text-muted-foreground/80">
                  بطاقة لـ {current.seats.toLocaleString("ar")}{" "}
                  {current.seats > 1 ? "أشخاص" : "شخص"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {sendUrl ? (
                  <Button
                    nativeButton={false}
                    className="flex-1"
                    disabled={busy}
                    render={
                      <a
                        href={sendUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markSent(current)}
                      />
                    }
                  >
                    <Send data-icon="inline-start" />
                    فتح واتساب
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    disabled={busy}
                    onClick={() => markSent(current)}
                  >
                    <Check data-icon="inline-start" />
                    تعليمها كمُرسلة
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  aria-label="نسخ رابط الدعوة"
                  onClick={() => copyLink(current)}
                >
                  {copied ? <Check className="text-emerald-600" /> : <Copy />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="تخطّي هذا الضيف"
                  onClick={() => skip(current)}
                >
                  <SkipForward />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground/70">
                بقي {queue.length.toLocaleString("ar")} في هذه الجلسة. يمكنكم
                التراجع عن أي إرسال من عمود «أُرسلت» في الجدول.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card/50 px-6 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                <Check className="size-6" />
              </div>

              <div>
                <p className="font-heading">
                  {sentCount === invited.length
                    ? "أُرسلت كل الدعوات"
                    : "انتهت القائمة"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sentCount === invited.length
                    ? "تابعوا من فتح دعوته ومن أكّد حضوره من الجدول."
                    : "الضيوف الذين تخطّيتموهم سيعودون عند فتح القائمة مرة أخرى."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {queue.length > 1 && (
              <Button
                variant="ghost"
                disabled={busy}
                onClick={markAllSent}
                className="text-muted-foreground"
              >
                تعليم الباقي كمُرسلة
              </Button>
            )}

            <Button variant="outline" onClick={() => setOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
