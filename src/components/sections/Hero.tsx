"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChefHat, ShoppingBag, Sparkles, Wine } from "lucide-react";

/**
 * HERO PERFEITO - Ordem Psicológica Ideal
 *
 * 1. Logo (espiritual)
 * 2. Micro-ações (Reservar | Fazer Pedido) - pequenos
 * 3. COMIDA (Grid 2x2 - GRANDES)
 * 4. Scroll → Fotos + Menu
 * 5. Scroll → Lenda/História
 */

const foodCategories = [
  {
    label: "Tapas",
    emoji: "🍢",
    href: "#tapas",
    gradient: "from-orange-500 to-red-500",
    icon: ChefHat,
  },
  {
    label: "Burgers",
    emoji: "🍔",
    href: "#burgers",
    gradient: "from-yellow-500 to-orange-500",
    icon: ChefHat,
  },
  {
    label: "Saladas & Bowls",
    emoji: "🥗",
    href: "#saladas",
    gradient: "from-green-500 to-emerald-500",
    icon: Wine,
  },
  {
    label: "Coquetéis & Bebidas",
    emoji: "🍹",
    href: "#drinks",
    gradient: "from-pink-500 to-purple-500",
    icon: Wine,
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 px-4">
      {/* Background elegante */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-10" />
        <Image
          src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070&auto=format&fit=crop"
          alt="Sofia Gastrobar Ibiza"
          fill
          className="object-cover opacity-30"
          priority
          quality={85}
          sizes="100vw"
        />
      </div>

      {/* Container Principal */}
      <div className="relative z-30 w-full max-w-4xl mx-auto">

        {/* 1️⃣ LOGO - Espiritual, Limpo, Centrado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="mb-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="Sofia Gastrobar Ibiza"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Sofia Gastrobar
          </h1>
          <p className="text-sm md:text-base text-yellow-500 tracking-widest uppercase">
            Sant Antoni · Ibiza
          </p>
        </motion.div>

        {/* 2️⃣ MICRO-AÇÕES - Pequenos, Não Competem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-sm"
          >
            <Sparkles size={16} />
            Reservar Mesa
          </Link>
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-sm"
          >
            <ShoppingBag size={16} />
            Fazer Pedido
          </Link>
        </motion.div>

        {/* 3️⃣ COMIDA - Grid 2x2 GRANDES E VISUAIS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            O Que Você Quer Comer?
          </h2>

          {/* Grid 2x2 - BOTÕES GRANDES */}
          <div className="grid grid-cols-2 gap-4">
            {foodCategories.map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={category.href}
                    className="group relative block"
                  >
                    {/* Card Grande com Gradiente */}
                    <div className={`
                      relative overflow-hidden rounded-2xl p-6 h-40 md:h-48
                      bg-gradient-to-br ${category.gradient}
                      shadow-2xl shadow-black/50
                      transition-all duration-300
                      hover:shadow-3xl
                    `}>
                      {/* Efeito de brilho no hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Conteúdo */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
                        {/* Emoji Grande */}
                        <div className="text-5xl md:text-6xl transform group-hover:scale-110 transition-transform duration-300">
                          {category.emoji}
                        </div>

                        {/* Label */}
                        <div className="text-center">
                          <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                            {category.label}
                          </h3>
                        </div>

                        {/* Ícone no canto */}
                        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <Icon size={32} className="text-white" />
                        </div>
                      </div>

                      {/* Borda brilhante no hover */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Botão "Ver Menu Completo" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <Link
            href="/cardapio"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-105"
          >
            Ver Menu Completo
          </Link>
        </motion.div>

        {/* Badge "Menu Digital" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-400">Menu Digital · Google Pay & Apple Pay</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/20"
      >
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/20 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
