import type { Metadata } from "next";

import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { SAMPLE_INVITATION } from "@/features/invitation/data/sample-invitation";
import { normalizeTemplate } from "@/lib/wedding-templates";

export const metadata: Metadata = {
  title: "نموذج دعوة — WeddingLeaf",
  description: "شاهدوا كيف تبدو دعوة الزفاف الرقمية قبل إنشاء دعوتكم",
};

/**
 * The sample invitation, on a route of its own.
 *
 * This used to be what /i/<any-unknown-slug> rendered, which meant a mistyped
 * link produced a complete and convincing wedding for a couple who do not
 * exist. It lives here now: a demo anyone can look at, and a design surface to
 * work against without a database.
 *
 * `?template=` previews any layout on the sample — the same normalisation the
 * real invitation uses, so an unknown value falls back to the thread layout
 * rather than erroring.
 */
export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string | string[] }>;
}) {
  const { template } = await searchParams;
  const picked = Array.isArray(template) ? template[0] : template;

  const invitation = picked
    ? { ...SAMPLE_INVITATION, template: normalizeTemplate(picked) }
    : SAMPLE_INVITATION;

  return (
    <main className="flex-1">
      <InvitationExperience invitation={invitation} />
    </main>
  );
}
