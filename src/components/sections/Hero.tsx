"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MenuQuickAccess } from "@/components/home/MenuQuickAccess";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section id="manifesto" className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-black pt-16 pb-10">
            {/* Background Image / Overlay - mais sutil */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50 z-10 pointer-events-none" />
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

            <div className="relative z-30 max-w-6xl mx-auto px-6 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Logo */}
                    <div className="mb-4 flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="Sofia Gastrobar Ibiza"
                            width={100}
                            height={100}
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Título compacto */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-2">
                        <span className="text-yellow-500">Magia</span>, Fogo e Sabor.
                    </h1>

                    {/* Subtexto curto */}
                    <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto mb-6">
                        Um gastrobar de alma livre em Sant Antoni, Ibiza.
                    </p>

                    {/* 👉 BOTÕES DO MENU EM PRIMEIRO PLANO - DESTAQUE MÁXIMO */}
                    <div className="w-full max-w-4xl">
                        <MenuQuickAccess />
                    </div>

                    {/* Botões secundários (Reservar, Delivery) */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                href="/reservas" 
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-yellow-500/50 text-sm md:text-base"
                            >
                                <Sparkles size={16} className="mr-2" />
                                Reservar Mesa
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                href="/delivery" 
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-yellow-500/50 text-sm md:text-base"
                            >
                                <ArrowRight size={16} className="mr-2" />
                                Pedir Delivery
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
