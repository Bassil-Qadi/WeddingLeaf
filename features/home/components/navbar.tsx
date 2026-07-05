import Link from "next/link";
import { PageContainer } from "@/components/common/page-container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/80 backdrop-blur-xl">
      <PageContainer>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl">
              🌿
            </div>

            <div>
              <p className="font-heading text-xl">
                WeddingLeaf
              </p>

              <p className="text-xs text-muted-foreground">
                Digital Invitations
              </p>
            </div>

          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-8 md:flex">

            <Link href="#">
              المميزات
            </Link>

            <Link href="#">
              الأسعار
            </Link>

            <Link href="#">
              القوالب
            </Link>

          </nav>

          {/* Buttons */}

          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="text-sm"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition hover:opacity-90"
            >
              ابدأ مجانًا
            </Link>

          </div>

        </div>
      </PageContainer>
    </header>
  );
}