import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { getInvitationBySlug } from "@/services/invitation";
import { invitationMetadata } from "@/features/invitation/lib/metadata";
import { auth } from "@/lib/auth";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  return invitationMetadata(invitation);
}

/**
 * The open invitation — the link a couple shares in a family group. Guests who
 * arrive here are greeted as guests rather than by name; the named version
 * lives at /i/[slug]/[token].
 *
 * A slug that resolves to nothing is a 404. It deliberately does *not* fall
 * back to a sample invitation: a stranger typing a URL, or a guest following a
 * link to an event that was unpublished or deleted, must not be shown a
 * complete and convincing wedding that isn't real.
 */
export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const invitation = await getInvitationBySlug(slug, session?.user?.id);

  if (!invitation) {
    notFound();
  }

  return (
    <main className="flex-1">
      <InvitationExperience invitation={invitation} />
    </main>
  );
}
