import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = null;

  if (!invitation) {
    return { title: "الدعوة غير موجودة" };
  }

  const title = `دعوة زفاف`;
  return {
    title,
    description: title,
    openGraph: { title, description: title },
  };
}

export default async function InvitationPage({ params }: PageProps) {
  // const { slug } = await params;
  // const invitation = getInvitationBySlug(slug);

  // if (!invitation) {
  //   notFound();
  // }

  return (
    <main>
      <h1>test</h1>
    </main>
  );
}