import { PageContainer } from "@/components/common/page-container";
import { Section } from "@/components/common/section";

export default function HomePage() {
  return (
    <main>
      <Section>
        <PageContainer>
          <div className="space-y-6 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">
              WeddingLeaf
            </p>

            <h1 className="font-heading text-6xl leading-tight">
              تجربة دعوات زفاف
              <br />
              لا تُنسى
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground">
              أنشئ دعوات زفاف رقمية فاخرة مع تجربة تفاعلية مميزة
              تبدأ منذ لحظة فتح الظرف وحتى تأكيد الحضور.
            </p>
          </div>
        </PageContainer>
      </Section>
    </main>
  );
}