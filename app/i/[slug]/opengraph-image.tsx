import { auth } from "@/lib/auth";
import {
  invitationOgImage,
  OG_CONTENT_TYPE,
  OG_SIZE,
} from "@/features/invitation/lib/og-card";
import { getInvitationBySlug } from "@/services/invitation";

export const alt = "بطاقة دعوة زفاف";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The link preview for a public invitation.
 *
 * Returning nothing when the slug doesn't resolve is deliberate: the page is
 * about to 404, and a preview card for a wedding that isn't there is worse than
 * no preview at all.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const invitation = await getInvitationBySlug(slug, session?.user?.id);
  if (!invitation) {
    return new Response("Not found", { status: 404 });
  }

  return invitationOgImage(invitation);
}
