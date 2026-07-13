import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import {
  getInvitationForGuest,
  markInvitationOpened,
} from "@/services/invitation";
import { invitationMetadata } from "@/features/invitation/lib/metadata";
import { auth } from "@/lib/auth";
import { isCrawler } from "@/lib/crawler";

interface PageProps {
  params: Promise<{ slug: string; token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, token } = await params;
  const invitation = await getInvitationForGuest(slug, token);

  return invitationMetadata(invitation);
}

/**
 * A guest's own invitation. The link that actually gets sent — it knows who it
 * was addressed to, so the veil greets them by name, the RSVP is capped at the
 * seats they were given, and opening it is recorded against their row.
 *
 * A token that doesn't resolve is a 404 rather than a quiet fall-back to the
 * open invitation: if a guest following their own link is greeted as a
 * stranger, something is wrong, and hiding it would just mean the couple
 * never finds out.
 */
export default async function GuestInvitationPage({ params }: PageProps) {
  const { slug, token } = await params;
  const session = await auth();
  const invitation = await getInvitationForGuest(slug, token, session?.user?.id);

  if (!invitation) {
    notFound();
  }

  // Only a human opening the invitation counts as an open. WhatsApp fetches this
  // very page to build its preview card the moment the link is *sent*, and the
  // couple previewing a guest's link isn't that guest.
  const userAgent = (await headers()).get("user-agent");
  if (!isCrawler(userAgent)) {
    await markInvitationOpened(slug, token, session?.user?.id);
  }

  return (
    <main className="flex-1">
      <InvitationExperience invitation={invitation} />
    </main>
  );
}
