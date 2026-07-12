import { CheckCircle2, Eye, MailQuestion, Users, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GuestStats } from "@/services/guests";

/**
 * The headline is `confirmedSeats`, not the number of people who replied:
 * the venue charges per chair, and a guest bringing three others is one reply
 * and four seats. It is the only number on this page that costs money.
 */
export function GuestStatsRow({ stats }: { stats: GuestStats }) {
  const awaiting = stats.pending;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        icon={CheckCircle2}
        label="مقاعد مؤكّدة"
        value={stats.confirmedSeats}
        hint={`${stats.attending} ردّ بالحضور`}
        emphasis
      />
      <Stat
        icon={Users}
        label="مدعوّون"
        value={stats.invited}
        hint={`${stats.seatsAllocated} مقعدًا مخصّصًا`}
      />
      <Stat
        icon={MailQuestion}
        label="بانتظار الرد"
        value={awaiting}
        hint={`${stats.opened} فتحوا الدعوة`}
      />
      <Stat
        icon={XCircle}
        label="اعتذروا"
        value={stats.declined}
        hint={stats.declined > 0 ? "شكرًا لإعلامهم" : "لا اعتذارات بعد"}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  emphasis,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  hint: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border p-4",
        emphasis && "border-primary/25 bg-primary/[0.06]",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 text-xs text-muted-foreground",
          emphasis && "text-primary",
        )}
      >
        <Icon className="size-3.5" />
        {label}
      </span>

      <span
        className={cn(
          "font-heading text-3xl leading-none",
          emphasis && "text-primary",
        )}
      >
        {value.toLocaleString("ar")}
      </span>

      <span className="text-xs text-muted-foreground/80">{hint}</span>
    </div>
  );
}
