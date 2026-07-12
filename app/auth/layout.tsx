import Link from "next/link";
import { Leaf } from "lucide-react";
import { BackgroundGradient } from "@/components/common/background-gradient";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 font-dashboard">
      <BackgroundGradient />

      <Link
        href="/"
        className="group mb-10 flex animate-in items-center gap-3 duration-700 fade-in slide-in-from-bottom-2"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/30 transition-transform duration-300 group-hover:scale-105">
          <Leaf className="h-6 w-6" />
        </div>

        <div className="text-start">
          <p className="font-heading text-xl">WeddingLeaf</p>
          <p className="text-xs text-muted-foreground">Digital Invitations</p>
        </div>
      </Link>

      <div className="w-full max-w-md animate-in duration-700 fade-in slide-in-from-bottom-4">
        {children}
      </div>

      <p className="mt-8 animate-in text-xs text-muted-foreground/70 duration-1000 fade-in">
        دعوات زفاف رقمية أنيقة تليق بيومكم الكبير
      </p>
    </main>
  );
}
