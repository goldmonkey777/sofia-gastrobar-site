"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { MenuQuickAccess } from "@/components/home/MenuQuickAccess";

export function Hero() {
    return (
        <section id="manifesto" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black z-10 pointer-events-none" />
                <Image
                    src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070&auto=format&fit=crop"
                    alt="Sofia Gastrobar Ibiza - Ambiente acolhedor"
                    fill
                    className="object-cover opacity-40 pointer-events-none"
                    priority
                    quality={85}
                    sizes="100vw"
                />
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6">

                {/* Header Compacto: Logo + Título */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    {/* Logo */}
                    <div className="mb-6 flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="Sofia Gastrobar Ibiza"
                            width={100}
                            height={100}
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Título Principal - COMPACTO */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4">
                        <span className="text-yellow-500">Magia</span>, Fogo e Sabor.
                    </h1>

                    {/* Subtítulo Curto */}
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
                        Sant Antoni, Ibiza · Gastronomia de alma livre
                    </p>
                </motion.div>

                {/* 🍽️ MENU EM PRIMEIRO PLANO - HERO PRINCIPAL */}
                <div className="mb-12">
                    <MenuQuickAccess />
                </div>

                {/* Ações Secundárias (Reserva & Delivery) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/reservas"
                            className="relative z-30 inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 border border-transparent min-w-[200px]"
                        >
                            <Sparkles size={20} className="mr-2" />
                            Reservar Mesa
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/delivery"
                            className="relative z-30 inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-yellow-500/50 min-w-[200px]"
                        >
                            <ArrowRight size={20} className="mr-2" />
                            Pedir Delivery
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Badge "Pagamento Digital" */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-zinc-400"
                >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-green-500">✓</span>
                        Google Pay & Apple Pay
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-green-500">✓</span>
                        Reservas com Pagamento
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="text-green-500">✓</span>
                        Mesa Digital (QR Code)
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator - mais sutil */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/30"
            >
                <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
                    <div className="w-1 h-2 bg-white/30 rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
