import { Navbar } from "@/features/home/components/navbar";
import { Hero } from "@/features/home/components/hero";
import { Stats } from "@/features/home/components/stats";
import { Features } from "@/features/home/components/features";
import { TemplatesShowcase } from "@/features/home/components/templates-showcase";
import { HowItWorks } from "@/features/home/components/how-it-works";
import { CallToAction } from "@/features/home/components/cta";
import { Footer } from "@/features/home/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <TemplatesShowcase />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
