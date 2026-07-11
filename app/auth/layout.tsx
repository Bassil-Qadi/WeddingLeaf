import Link from "next/link";
import { Leaf } from "lucide-react";
import { BackgroundGradient } from "@/components/common/background-gradient";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <BackgroundGradient />

      <Link
        href="/"
        className="mb-10 flex items-center gap-3"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Leaf className="h-6 w-6" />
        </div>

        <div className="text-start">
          <p className="font-heading text-xl">WeddingLeaf</p>
          <p className="text-xs text-muted-foreground">Digital Invitations</p>
        </div>
      </Link>

      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
