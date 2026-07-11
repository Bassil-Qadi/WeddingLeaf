import { auth } from "@/lib/auth";
import { Topbar } from "@/features/dashboard/components/topbar";
import { PageContainer } from "@/components/common/page-container";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col font-dashboard">
      <Topbar
        userName={session?.user?.name ?? ""}
        userEmail={session?.user?.email ?? ""}
      />

      <main className="flex-1 py-10">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}
