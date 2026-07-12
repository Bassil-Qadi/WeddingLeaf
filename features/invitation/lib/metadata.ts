import type { Metadata } from "next";
import type { InvitationData } from "../types";

/**
 * The share card. This is the first thing a guest sees — in practice the
 * invitation is met in a WhatsApp thread long before it is opened — so it is
 * built from the same data the invitation itself renders.
 *
 * A missing invitation gets deliberately empty metadata rather than a guess:
 * the page is about to 404, and a link preview promising a wedding that isn't
 * there is worse than no preview.
 */
export function invitationMetadata(
  invitation: InvitationData | null,
): Metadata {
  if (!invitation) {
    return { title: "الدعوة غير موجودة" };
  }

  const title = `${invitation.groomName} و ${invitation.brideName} — دعوة زفاف`;
  const description =
    invitation.message ??
    `يسعدنا دعوتكم لحضور حفل زفاف ${invitation.groomName} و ${invitation.brideName} — ${invitation.dateDisplay}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_JO",
      images: invitation.coverImageUrl ? [invitation.coverImageUrl] : undefined,
    },
    // A personal invitation link is not something to be indexed.
    robots: { index: false, follow: false },
  };
}
