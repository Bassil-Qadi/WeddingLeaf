import type { Metadata } from "next";
import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { SAMPLE_INVITATION } from "@/features/invitation/data/sample-invitation";
import type { InvitationData } from "@/features/invitation/types";
import { getInvitationBySlug } from "@/services/invitation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Fall back to the sample so the experience is viewable before the DB is
 * seeded / for local design preview. A real published invitation always wins
 * over the sample.
 */
async function loadInvitation(slug: string): Promise<InvitationData> {
  return (await getInvitationBySlug(slug)) ?? SAMPLE_INVITATION;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await loadInvitation(slug);

  const title = `${invitation.groomName} و ${invitation.brideName} — دعوة زفاف`;
  const description =
    invitation.message ??
    `يسعدنا دعوتكم لحضور حفل زفاف ${invitation.groomName} و ${invitation.brideName}`;

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
  };
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const invitation = await loadInvitation(slug);

  return (
    <main className="flex-1">
      <InvitationExperience invitation={invitation} />
    </main>
  );
}
