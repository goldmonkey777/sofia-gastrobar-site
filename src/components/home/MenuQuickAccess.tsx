"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UtensilsCrossed, Wine, Salad, Flame, Sunrise } from "lucide-react";

const menuButtons = [
  {
    label: "🍽️ Menu Completo",
    href: "/cardapio",
    icon: UtensilsCrossed,
    primary: true
  },
  {
    label: "🌅 Sunset & Cocktails",
    href: "#sunset",
    icon: Sunrise,
  },
  {
    label: "🔥 Hambúrgueres",
    href: "#hamburgueres",
    icon: Flame,
  },
  {
    label: "🥗 Opções Veganas",
    href: "#vegan",
    icon: Salad,
  },
  {
    label: "🥘 Paellas & Pratos",
    href: "#pratos",
    icon: Wine,
  },
];

export function MenuQuickAccess() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Título da seção */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Explore Nosso Menu
        </h2>
        <p className="text-zinc-400 text-sm md:text-base">
          Escolha sua experiência gastronômica
        </p>
      </motion.div>

      {/* Grid de botões */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {menuButtons.map((btn, index) => {
          const Icon = btn.icon;

          return (
            <motion.div
              key={btn.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={btn.href}
                className={[
                  "group relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300",
                  "border backdrop-blur-sm h-full min-h-[120px]",
                  btn.primary
                    ? "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400 text-black shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50"
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/20"
                ].join(" ")}
              >
                {/* Ícone */}
                {Icon && (
                  <Icon
                    size={24}
                    className={[
                      "transition-transform duration-300 group-hover:scale-110",
                      btn.primary ? "text-black" : "text-yellow-500"
                    ].join(" ")}
                  />
                )}

                {/* Label */}
                <span className={[
                  "text-sm md:text-base font-semibold text-center leading-tight",
                  btn.primary ? "text-black" : "text-white"
                ].join(" ")}>
                  {btn.label}
                </span>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/10 group-hover:to-yellow-500/5 transition-all duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Badge "Menu Digital" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 flex justify-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-zinc-400">Menu Digital Interativo</span>
        </div>
      </motion.div>
    </div>
  );
}
