import type { Metadata } from "next";

import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { SAMPLE_INVITATION } from "@/features/invitation/data/sample-invitation";

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
 */
export default function DemoPage() {
  return (
    <main className="flex-1">
      <InvitationExperience invitation={SAMPLE_INVITATION} />
    </main>
  );
}
