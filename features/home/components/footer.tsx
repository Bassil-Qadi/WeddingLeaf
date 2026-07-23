import Link from "next/link";

import { PageContainer } from "@/components/common/page-container";

const GROUPS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "المنتج",
    links: [
      { href: "#features", label: "المميزات" },
      { href: "#templates", label: "القوالب" },
      { href: "#how", label: "كيف تعمل" },
      { href: "/demo", label: "نموذج حيّ" },
    ],
  },
  {
    heading: "ابدأ",
    links: [
      { href: "/auth/sign-up", label: "إنشاء حساب" },
      { href: "/auth/sign-in", label: "تسجيل الدخول" },
    ],
  },
];

/** The page's quiet close — brand, a couple of link columns, and a hairline. */
export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-white/50 py-16">
      <PageContainer>
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#e7d3a1] via-[#c6a86a] to-[#9a7b3e] text-[#3a2c10]">
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 21c0-6 3-11 8-13-1 8-4 11-8 13Zm0 0C6 18 4 12 4 6c6 1 8 6 8 11Z" />
                </svg>
              </span>
              <span className="font-heading text-lg text-foreground">
                WeddingLeaf
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              منصة عربية لصناعة دعوات زفاف رقمية فاخرة، ومشاركتها بسهولة، وتتبّع
              الحضور في مكان واحد.
            </p>
          </div>

          {GROUPS.map((group) => (
            <nav key={group.heading} className="flex flex-col gap-3">
              <p className="text-xs tracking-[0.24em] text-primary">
                {group.heading}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} WeddingLeaf — جميع الحقوق محفوظة</p>
          <p className="flex items-center gap-1.5">
            صُنع بحبّ في الأردن
            <span className="text-primary">◆</span>
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
