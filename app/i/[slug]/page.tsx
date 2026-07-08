import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getInvitationBySlug } from "@/features/invitations/data/mock-invitations";
import { WarqaExperience } from "@/features/warqa/components/experience/warqa-experience";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = getInvitationBySlug(slug);

  if (!invitation) {
    return { title: "الدعوة غير موجودة" };
  }

  const title = `دعوة زفاف ${invitation.groomName} و${invitation.brideName}`;
  return {
    title,
    description: invitation.message ?? title,
    openGraph: { title, description: invitation.message ?? title },
  };
}

export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const invitation = getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  return (
    <main>
      <WarqaExperience invitation={invitation} />
    </main>
  );
}