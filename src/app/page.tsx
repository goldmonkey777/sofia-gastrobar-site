import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { MenuHighlights } from "@/components/sections/MenuHighlights";
import { SmartTable } from "@/components/sections/SmartTable";
import { Story } from "@/components/sections/Story";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Story />
      <MenuHighlights />
      <SmartTable />
      <Footer />
    </main>
  );
}
