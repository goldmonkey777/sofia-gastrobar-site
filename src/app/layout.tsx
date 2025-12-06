import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Using Google Fonts
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { StructuredData } from "@/components/StructuredData";

// Using Outfit as primary font for that modern, slightly geometric look
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://sofiagastrobaribiza.com'),
  title: {
    default: "Sofia Gastrobar Ibiza - Magia, Fogo e Sabor",
    template: "%s | Sofia Gastrobar Ibiza",
  },
  description: "Um refúgio para quem procura sabor, beleza e presença. Onde o sagrado e o profano dançam juntos. Ibiza Domination Phase 1.",
  keywords: ['Sofia Gastrobar', 'Ibiza', 'Restaurante Ibiza', 'Gastrobar', 'Tapas', 'Cocktails', 'Ibiza Restaurante'],
  authors: [{ name: 'Sofia Gastrobar Ibiza' }],
  creator: 'Goldmonkey Studio',
  publisher: 'Sofia Gastrobar Ibiza',
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://sofiagastrobaribiza.com',
    siteName: 'Sofia Gastrobar Ibiza',
    title: 'Sofia Gastrobar Ibiza - Magia, Fogo e Sabor',
    description: 'Um refúgio para quem procura sabor, beleza e presença. Onde o sagrado e o profano dançam juntos.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sofia Gastrobar Ibiza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sofia Gastrobar Ibiza - Magia, Fogo e Sabor',
    description: 'Um refúgio para quem procura sabor, beleza e presença.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Adicione aqui quando tiver Google Search Console
    // google: 'seu-codigo-verificacao',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="scroll-smooth">
      <body className={`${outfit.variable} ${inter.variable} antialiased bg-black text-white`}>
        <StructuredData />
        <Navbar />
        {children}
        <AudioPlayer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
