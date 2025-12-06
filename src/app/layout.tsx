import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Using Google Fonts
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Using Outfit as primary font for that modern, slightly geometric look
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sofia Gastrobar Ibiza - Magia, Fogo e Sabor",
  description: "Um refúgio para quem procura sabor, beleza e presença. Onde o sagrado e o profano dançam juntos. Ibiza Domination Phase 1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="scroll-smooth">
      <body className={`${outfit.variable} ${inter.variable} antialiased bg-black text-white`}>
        <Navbar />
        {children}
        <AudioPlayer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
