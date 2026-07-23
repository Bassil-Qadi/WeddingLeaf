"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { PageContainer } from "@/components/common/page-container";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#features", label: "المميزات" },
  { href: "#templates", label: "القوالب" },
  { href: "#how", label: "كيف تعمل" },
];

/**
 * The landing header — a quiet wordmark that firms up into frosted glass once
 * the page scrolls, so it floats over the hero at the top and grounds itself
 * against content below.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-primary/10 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <PageContainer>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Link href="/" className="group flex items-center gap-3">
            <Monogram />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-xl text-foreground">
                WeddingLeaf
              </span>
              <span className="mt-1 text-[10px] tracking-[0.3em] text-muted-foreground">
                DIGITAL INVITATIONS
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1.5 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/auth/sign-in"
              className="hidden text-sm text-foreground/80 transition-colors hover:text-foreground sm:block"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(198,168,106,0.9)] transition-all hover:scale-[1.03] hover:shadow-[0_14px_36px_-10px_rgba(198,168,106,1)]"
            >
              ابدأ مجانًا
            </Link>
          </div>
        </div>
      </PageContainer>
    </motion.header>
  );
}

/** The gilded leaf mark — a gradient disc with a hairline ring. */
function Monogram() {
  return (
    <span className="relative grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#e7d3a1] via-[#c6a86a] to-[#9a7b3e] text-[#3a2c10] shadow-[0_6px_16px_-6px_rgba(120,90,30,0.7)]">
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
        <path
          d="M12 21c0-6 3-11 8-13-1 8-4 11-8 13Zm0 0C6 18 4 12 4 6c6 1 8 6 8 11Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    </span>
  );
}
