import { PageContainer } from "@/components/common/page-container";
import { Section } from "@/components/common/section";
import { Hero } from "@/features/home/components/hero";
import { Navbar } from "@/features/home/components/navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
    </main>
  );
}