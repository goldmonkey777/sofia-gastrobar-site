"use client";

import Link from "next/link";

const buttons = [
  { 
    label: "🍽️ Ver Menu Completo", 
    href: "/cardapio", 
    primary: true,
    emoji: "🍽️"
  },
  { 
    label: "🌅 Sunset & Cocktails", 
    href: "#cocktails",
    emoji: "🌅"
  },
  { 
    label: "🍔 Hambúrgueres", 
    href: "#gastroburgers",
    emoji: "🍔"
  },
  { 
    label: "🥗 Opções Veganas", 
    href: "#vegan",
    emoji: "🥗"
  },
  { 
    label: "🥘 Paellas & Pratos de Casa", 
    href: "#pratos",
    emoji: "🥘"
  },
];

export function MenuQuickAccess() {
  return (
    <div className="w-full mt-8">
      <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto px-4">
        {buttons.map((btn) => (
          <Link
            key={btn.label}
            href={btn.href}
            className={[
              "px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300",
              "flex items-center gap-2",
              btn.primary
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/50 hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:scale-105"
                : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105",
            ].join(" ")}
          >
            <span className="text-lg">{btn.emoji}</span>
            <span>{btn.label.replace(btn.emoji + " ", "")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

