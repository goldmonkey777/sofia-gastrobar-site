import { DetailedMenu } from "@/components/sections/DetailedMenu";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { MenuHighlights } from "@/components/sections/MenuHighlights";
import { SmartTable } from "@/components/sections/SmartTable";
import { Story } from "@/components/sections/Story";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero com menu em primeiro plano */}
      <Hero />
      
      {/* Menu primeiro - COMIDA NA CARA */}
      <MenuHighlights />
      <DetailedMenu />
      
      {/* História depois - desce um degrau */}
      <Story />
      
      {/* Resto */}
      <HowItWorks />
      <SmartTable />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
