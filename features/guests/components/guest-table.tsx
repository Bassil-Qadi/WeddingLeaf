"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GuestRecord } from "@/services/guests";

const STATUS: Record<
  GuestRecord["status"],
  { label: string; className: string }
> = {
  attending: {
    label: "سيحضر",
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600",
  },
  declined: {
    label: "اعتذر",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  pending: {
    label: "لم يرد",
    className: "border-muted-foreground/20 bg-muted text-muted-foreground",
  },
};

/** The link that actually gets sent — a guest's invitation, not the couple's. */
function guestLink(slug: string, token: string): string {
  return `${window.location.origin}/i/${slug}/${token}`;
}

/**
 * A pre-written Arabic message with the guest's own link in it. Sending an
 * invitation in this market means sending it on WhatsApp, one person at a
 * time, so the couple should never have to compose it 300 times.
 */
function whatsappLink(
  slug: string,
  guest: GuestRecord,
  brideName: string,
  groomName: string,
): string {
  const message = [
    `عزيزنا ${guest.name}،`,
    "",
    `يسعدنا دعوتكم لحضور حفل زفاف ${brideName} و ${groomName}.`,
    "تجدون بطاقتكم الخاصة هنا:",
    guestLink(slug, guest.token!),
  ].join("\n");

  const phone = guest.phone?.replace(/[^0-9]/g, "") ?? "";

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

interface GuestTableProps {
  eventId: string;
  slug: string;
  brideName: string;
  groomName: string;
  guests: GuestRecord[];
  onChanged: () => void;
}

export function GuestTable({
  eventId,
  slug,
  brideName,
  groomName,
  guests,
  onChanged,
}: GuestTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function copyLink(guest: GuestRecord) {
    if (!guest.token) return;

    await navigator.clipboard.writeText(guestLink(slug, guest.token));
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 1600);
  }

  async function remove(guest: GuestRecord) {
    setBusyId(guest.id);

    try {
      const response = await fetch(
        `/api/events/${eventId}/guests/${guest.id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        toast.error("تعذّر حذف الضيف");
        return;
      }

      toast.success(`تم حذف ${guest.name}`);
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-start text-xs text-muted-foreground">
            <Th>الضيف</Th>
            <Th>المقاعد</Th>
            <Th>الحالة</Th>
            <Th>الحضور</Th>
            <Th>فتح</Th>
            <Th className="text-end">إجراءات</Th>
          </tr>
        </thead>

        <tbody>
          {guests.map((guest) => (
            <tr
              key={guest.id}
              className="border-b transition-colors last:border-0 hover:bg-muted/30"
            >
              <Td>
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium">
                    {guest.name}
                    {guest.source === "open" && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/25 bg-amber-500/10 text-[10px] text-amber-600"
                      >
                        ردّ عام
                      </Badge>
                    )}
                  </span>
                  {guest.phone && (
                    <span dir="ltr" className="text-xs text-muted-foreground">
                      {guest.phone}
                    </span>
                  )}
                  {guest.note && (
                    <span className="mt-0.5 text-xs italic text-muted-foreground/80">
                      «{guest.note}»
                    </span>
                  )}
                </div>
              </Td>

              <Td className="text-muted-foreground">{guest.seats}</Td>

              <Td>
                <Badge
                  variant="outline"
                  className={cn("text-[11px]", STATUS[guest.status].className)}
                >
                  {STATUS[guest.status].label}
                </Badge>
              </Td>

              <Td>
                {guest.status === "attending" ? (
                  <span className="font-medium">{guest.partySize}</span>
                ) : (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </Td>

              <Td>
                {guest.openedAt ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <X className="size-4 text-muted-foreground/40" />
                )}
              </Td>

              <Td className="text-end">
                <div className="flex items-center justify-end gap-1">
                  {guest.token && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="نسخ رابط الدعوة"
                        onClick={() => copyLink(guest)}
                      >
                        {copiedId === guest.id ? (
                          <Check className="text-emerald-600" />
                        ) : (
                          <Copy />
                        )}
                      </Button>

                      {guest.phone && (
                        <Button
                          nativeButton={false}
                          variant="ghost"
                          size="icon-sm"
                          aria-label="إرسال عبر واتساب"
                          render={
                            <a
                              href={whatsappLink(
                                slug,
                                guest,
                                brideName,
                                groomName,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          <MessageCircle />
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="حذف الضيف"
                    disabled={busyId === guest.id}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => remove(guest)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-2.5 text-start font-medium", className)}>
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}
