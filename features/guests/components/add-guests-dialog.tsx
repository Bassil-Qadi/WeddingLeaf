"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { parseGuestList, type GuestInput } from "@/lib/validations/guest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Tab = "single" | "bulk";

export function AddGuestsDialog({
  eventId,
  onAdded,
}: {
  eventId: string;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("single");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState(1);
  const [raw, setRaw] = useState("");

  // Parsed as they type, so the count they see is the count that gets saved.
  const parsed = tab === "bulk" ? parseGuestList(raw) : [];

  async function submit() {
    const guests: GuestInput[] =
      tab === "single"
        ? [{ name: name.trim(), phone: phone.trim() || null, seats }]
        : parsed;

    if (guests.length === 0 || guests.some((g) => g.name.length < 2)) {
      toast.error("أدخل اسم ضيف واحد على الأقل");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/events/${eventId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.error ?? "تعذّرت إضافة الضيوف");
        return;
      }

      toast.success(
        guests.length === 1
          ? "تمت إضافة الضيف"
          : `تمت إضافة ${guests.length} ضيفًا`,
      );

      setName("");
      setPhone("");
      setSeats(1);
      setRaw("");
      setOpen(false);
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        إضافة ضيوف
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة ضيوف</DialogTitle>
          <DialogDescription>
            لكل ضيف رابط دعوة خاص يحمل اسمه وعدد مقاعده
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <TabButton
            active={tab === "single"}
            onClick={() => setTab("single")}
            label="ضيف واحد"
          />
          <TabButton
            active={tab === "bulk"}
            onClick={() => setTab("bulk")}
            label="قائمة كاملة"
          />
        </div>

        {tab === "single" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="guest-name">اسم الضيف</Label>
              <Input
                id="guest-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أبو محمد الخطيب"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="guest-phone">الهاتف (اختياري)</Label>
                <Input
                  id="guest-phone"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962790000000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="guest-seats">عدد المقاعد</Label>
                <Input
                  id="guest-seats"
                  type="number"
                  min={1}
                  max={20}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="guest-bulk">
              سطر لكل ضيف: الاسم، الهاتف، عدد المقاعد
            </Label>
            <Textarea
              id="guest-bulk"
              dir="rtl"
              rows={7}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={"أبو محمد الخطيب, 0790000000, 2\nليلى عبد الله, 0791111111, 1\nعائلة النجار, , 4"}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              الاسم وحده يكفي — الهاتف اختياري، والمقاعد تساوي ١ إن لم تُذكر.
              {parsed.length > 0 && (
                <span className="text-primary">
                  {" "}
                  تم التعرّف على {parsed.length} ضيفًا.
                </span>
              )}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            إلغاء
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            إضافة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "flex-1 rounded-md px-3 py-1.5 text-sm transition-colors " +
        (active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      {label}
    </button>
  );
}
