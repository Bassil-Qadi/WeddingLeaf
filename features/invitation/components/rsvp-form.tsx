"use client";

import { useState } from "react";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { toArabicDigits } from "../lib/arabic";
import type { InvitationGuest, RsvpStatus } from "../types";

interface RsvpFormProps {
  slug: string;
  /** Present when opened through a personal link — prefills and caps the form. */
  guest?: InvitationGuest;
  /** Ceiling for an open-link responder, who has no seat allowance of their own. */
  maxPartySize: number;
  /** False once the deadline has passed: the answer shows, but can't be changed. */
  open: boolean;
  /** Whether a visitor without a token may answer at all. */
  allowOpenRsvp: boolean;
}

type Answer = Exclude<RsvpStatus, "pending">;

/**
 * The token an open-link responder was issued, remembered on their own device.
 *
 * A named guest needs none of this — their token is in the URL they arrived on.
 * An open responder has no such handle, so without something to hold, every
 * reload-and-answer-again would take the *create* branch on the server and
 * append a second row, quietly inflating the confirmed headcount.
 */
interface StoredRsvp {
  token: string;
  name: string;
}

const STORAGE_PREFIX = "weddingleaf:rsvp:";

/**
 * The stored token, but only if the person at the keyboard is the one it was
 * issued to.
 *
 * The name is an open responder's only identity, so it is what we check. This
 * is what keeps a phone passed around a family honest: when أحمد answers and
 * then hands the phone to سارة, she types her own name, it doesn't match, and
 * she gets a row of her own instead of silently overwriting his.
 */
function reusableToken(slug: string, typedName: string): string | undefined {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (!raw) return undefined;

    const stored = JSON.parse(raw) as StoredRsvp;
    return stored?.name === typedName ? stored.token : undefined;
  } catch {
    // Private browsing throws on access, and a malformed blob isn't worth a
    // crash. A duplicate row is survivable; a broken invitation is not.
    return undefined;
  }
}

function writeStored(slug: string, value: StoredRsvp): void {
  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${slug}`,
      JSON.stringify(value),
    );
  } catch {
    // As above — best effort.
  }
}

/**
 * The RSVP form itself — the one piece of the invitation that writes back.
 *
 * Deliberately template-agnostic: it renders no chapter chrome, no heading, no
 * thread node, only the intro line and the form. Each layout wraps it in its
 * own frame (the thread's `<Chapter>`, the card's panel), so the submit path,
 * the token-reuse rule, and the seat cap are written once and shared. Styling
 * is all theme variables, so it recolours with whatever palette is active.
 *
 * A named guest's row already exists, so the form updates it in place and can
 * be re-submitted as plans change. A visitor on the open link introduces
 * themselves first, and the couple sees them tagged as an open response rather
 * than as someone they invited by name.
 */
export function RsvpForm({
  slug,
  guest,
  maxPartySize,
  open,
  allowOpenRsvp,
}: RsvpFormProps) {
  const seatCap = guest ? guest.seats : maxPartySize;

  const [answer, setAnswer] = useState<Answer | null>(
    guest && guest.status !== "pending" ? guest.status : null,
  );
  const [partySize, setPartySize] = useState(
    guest?.partySize && guest.partySize > 0 ? guest.partySize : seatCap,
  );
  const [name, setName] = useState(guest?.name ?? "");
  const [note, setNote] = useState(guest?.note ?? "");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(
    Boolean(guest && guest.status !== "pending"),
  );
  const [error, setError] = useState<string | null>(null);

  /** Issued to an open responder on their first answer, within this session. */
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  async function submit() {
    if (!answer) {
      setError("اختر الحضور أو الاعتذار");
      return;
    }

    const typed = name.trim();

    if (!guest && typed.length < 2) {
      setError("الرجاء كتابة الاسم");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const claimed = answer === "attending" ? partySize : 0;
      const token = guest?.token ?? sessionToken ?? reusableToken(slug, typed);

      const response = await fetch(`/api/i/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: guest ? undefined : typed,
          status: answer,
          partySize: claimed,
          note: note.trim() || undefined,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setError(body?.error ?? "تعذّر إرسال التأكيد، حاولوا مرة أخرى");
        return;
      }

      // Hold on to the token an open responder was just issued, so a later
      // visit revises this answer instead of filing another one.
      if (!guest && body?.guest?.token) {
        setSessionToken(body.guest.token);
        writeStored(slug, { token: body.guest.token, name: typed });
      }

      setSubmitted(true);
    } catch {
      setError("تعذّر الاتصال، تحقّقوا من الشبكة وحاولوا مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  // Nothing to offer and nothing to show: a stranger on a closed open-link.
  if (!guest && !allowOpenRsvp) return null;

  return (
    <>
      {guest ? (
        <p className="mb-7 text-[15px] font-light leading-[1.9] text-gt-ink/60">
          دعوة خاصة لـ{" "}
          <span className="text-gt-ink">{guest.name}</span> — تتّسع لـ{" "}
          <span className="text-gt-gold">{toArabicDigits(guest.seats)}</span>{" "}
          {guest.seats === 1 ? "شخص" : "أشخاص"}
        </p>
      ) : (
        <p className="mb-7 text-[15px] font-light leading-[1.9] text-gt-ink/60">
          يسعدنا أن نعرف إن كنتم ستشاركوننا الفرح
        </p>
      )}

      {submitted ? (
        <Submitted
          answer={answer}
          partySize={partySize}
          editable={open}
          onEdit={() => setSubmitted(false)}
        />
      ) : !open ? (
        <p className="rounded-2xl border border-gt-gold/25 px-5 py-6 text-center text-[14px] font-light text-gt-ink/55">
          أُغلق باب تأكيد الحضور
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {!guest && (
            <Field label="الاسم">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمكم الكريم"
                className="w-full rounded-xl border border-gt-gold/30 bg-transparent px-4 py-3 text-[15px] text-gt-ink outline-none transition-colors placeholder:text-gt-ink/30 focus:border-gt-gold/70"
              />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <AnswerButton
              selected={answer === "attending"}
              onClick={() => setAnswer("attending")}
              icon={<Check className="size-4" strokeWidth={1.5} />}
              label="سأحضر"
            />
            <AnswerButton
              selected={answer === "declined"}
              onClick={() => setAnswer("declined")}
              icon={<X className="size-4" strokeWidth={1.5} />}
              label="أعتذر"
            />
          </div>

          {answer === "attending" && seatCap > 1 && (
            <Field label="عدد الحضور">
              <Stepper value={partySize} max={seatCap} onChange={setPartySize} />
            </Field>
          )}

          <Field label="كلمة للعروسين (اختياري)">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="بارك الله لكما…"
              className="w-full resize-none rounded-xl border border-gt-gold/30 bg-transparent px-4 py-3 text-[15px] font-light text-gt-ink outline-none transition-colors placeholder:text-gt-ink/30 focus:border-gt-gold/70"
            />
          </Field>

          {error && (
            <p role="alert" className="text-[13px] text-red-400/90">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2.5 rounded-full border border-gt-gold/45 px-[26px] py-[14px] text-sm [word-spacing:0.06em] text-gt-gold-btn transition-colors duration-400 hover:border-gt-gold/75 hover:bg-gt-gold/10 disabled:opacity-50"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            إرسال التأكيد
          </button>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] tracking-[0.08em] text-gt-ink/45">
        {label}
      </span>
      {children}
    </label>
  );
}

function AnswerButton({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-[15px] transition-colors duration-300",
        selected
          ? "border-gt-gold/70 bg-gt-gold/10 text-gt-gold-btn"
          : "border-gt-gold/25 text-gt-ink/60 hover:border-gt-gold/45 hover:text-gt-ink",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

/** Capped at the guest's seat allowance — you cannot claim chairs you weren't given. */
function Stepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gt-gold/30 px-2 py-2">
      <StepperButton
        label="إنقاص"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="size-4" strokeWidth={1.5} />
      </StepperButton>

      <span className="font-serif text-[22px] text-gt-ink">
        {toArabicDigits(value)}
      </span>

      <StepperButton
        label="زيادة"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="size-4" strokeWidth={1.5} />
      </StepperButton>
    </div>
  );
}

function StepperButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-lg text-gt-gold-btn transition-colors hover:bg-gt-gold/10 disabled:opacity-25 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function Submitted({
  answer,
  partySize,
  editable,
  onEdit,
}: {
  answer: Answer | null;
  partySize: number;
  editable: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-gt-gold/30 px-5 py-8 text-center">
      <div className="flex size-11 items-center justify-center rounded-full border border-gt-gold/45 text-gt-gold">
        {answer === "attending" ? (
          <Check className="size-5" strokeWidth={1.5} />
        ) : (
          <X className="size-5" strokeWidth={1.5} />
        )}
      </div>

      <p className="text-[17px] font-light text-gt-ink">
        {answer === "attending"
          ? "بانتظاركم — بحضوركم تكتمل فرحتنا"
          : "سنفتقدكم، وشكرًا لإعلامنا"}
      </p>

      {answer === "attending" && partySize > 1 && (
        <p className="text-[13px] text-gt-ink/55">
          تم تأكيد {toArabicDigits(partySize)} مقاعد
        </p>
      )}

      {editable && (
        <button
          type="button"
          onClick={onEdit}
          className="mt-1 text-[13px] text-gt-gold/90 underline-offset-4 transition-colors hover:text-gt-gold hover:underline"
        >
          تعديل الرد
        </button>
      )}
    </div>
  );
}
