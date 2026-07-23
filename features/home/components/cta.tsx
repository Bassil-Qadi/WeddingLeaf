"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/common/page-container";
import { Ornament, Reveal } from "./primitives";

/** The closing invitation — a gilded panel that asks for the click. */
export function CallToAction() {
  return (
    <section className="py-24 lg:py-32">
      <PageContainer>
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-primary/25 bg-gradient-to-br from-[#fbf6ec] via-background to-[#f6efe1] px-8 py-20 text-center shadow-[0_40px_100px_-50px_rgba(120,90,30,0.5)]">
            {/* glows */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/20 blur-[110px]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-accent/20 blur-[110px]"
            />
            {/* inset hairline frame */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 rounded-[28px] border border-primary/15"
            />

            <div className="relative">
              <Ornament />
              <h2 className="mt-6 font-heading text-4xl leading-tight text-foreground sm:text-5xl">
                دعوتك الأولى تبعد عنك نقرة واحدة
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
                أنشئ حسابك مجانًا، وابدأ بتصميم دعوة تليق بيومكما — دون بطاقة ائتمان.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-[0_16px_40px_-14px_rgba(198,168,106,1)] transition-all hover:scale-[1.03]"
                >
                  ابدأ الآن مجانًا
                  <ArrowLeft
                    className="size-4 transition-transform group-hover:-translate-x-1"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  href="/demo?template=gem"
                  className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-background/60 px-8 py-4 text-base text-foreground transition-colors hover:border-primary/60 hover:bg-primary/5"
                >
                  تصفّح التصاميم
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
