import { auth } from "@/lib/auth";
import {
  invitationOgImage,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/features/invitation/lib/og-card";
import { getInvitationForGuest } from "@/services/invitation";

export const alt = "بطاقة دعوة زفاف";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The link preview for a guest's personal invitation — addressed to them by
 * name, because that is what they will see sitting in their own WhatsApp thread.
 *
 * Note this deliberately reads without recording an open: the crawler that
 * fetches this card is not the guest. See `markInvitationOpened`.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}) {
  const { slug, token } = await params;
  const session = await auth();

  const invitation = await getInvitationForGuest(
    slug,
    token,
    session?.user?.id,
  );
  if (!invitation) {
    return new Response("Not found", { status: 404 });
  }

  return invitationOgImage(invitation, invitation.guest?.name);
}
