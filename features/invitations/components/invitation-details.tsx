import { MapPin, Calendar, Shirt } from "lucide-react";
import type { Invitation } from "@/types/invitation";

export function InvitationDetails({
  invitation,
}: {
  invitation: Invitation;
}) {
  return (
    <section
      id="invitation-details"
      className="mx-auto w-full max-w-lg px-6 py-16"
    >
      {invitation.message && (
        <p className="mb-12 text-center font-heading text-lg leading-loose text-foreground">
          {invitation.message}
        </p>
      )}

      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
          <Calendar className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-foreground">
              {invitation.dateDisplay}
            </p>
            <p className="text-sm text-muted-foreground">موعد الحفل</p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
          <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {invitation.venueName}
            </p>
            <p className="text-sm text-muted-foreground">
              {invitation.venueAddress}
            </p>
            <a
              href={invitation.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary underline underline-offset-4"
            >
              افتح في خرائط جوجل
            </a>
          </div>
        </div>

        {invitation.dressCode && (
          <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
            <Shirt className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-medium text-foreground">
                {invitation.dressCode}
              </p>
              <p className="text-sm text-muted-foreground">قواعد اللباس</p>
            </div>
          </div>
        )}
      </div>

      {invitation.schedule.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-center font-heading text-xl text-foreground">
            برنامج الحفل
          </h2>
          <ol className="space-y-3">
            {invitation.schedule.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm"
              >
                <span className="text-foreground">{item.title}</span>
                <span className="text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}