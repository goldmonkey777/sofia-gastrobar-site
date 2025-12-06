"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MagicButton } from "@/components/ui/MagicButton";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section id="manifesto" className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />
                <Image
                    src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070&auto=format&fit=crop"
                    alt="Sofia Gastrobar Ibiza - Ambiente acolhedor"
                    fill
                    className="object-cover opacity-60 pointer-events-none"
                    priority
                    quality={85}
                    sizes="100vw"
                />
            </div>

            <div className="relative z-30 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-yellow-400 text-sm font-medium tracking-wider mb-6">
                        IBIZA DOMINATION PHASE 1™
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6">
                        <span className="text-yellow-500">Magia</span>, Fogo<br className="hidden md:block" /> e Sabor.
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Um refúgio para quem procura presença.
                        Onde cada prato é uma oração e cada noite é uma história escrita entre a brisa do mar e o calor da noite balear.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                href="/reservas" 
                                className="relative z-30 inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-full transition-all duration-300 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 border border-transparent"
                            >
                                <Sparkles size={18} className="mr-2" />
                                Reservar Mesa
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                href="/delivery" 
                                className="relative z-30 inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-full transition-all duration-300 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-yellow-500/50"
                            >
                                <ArrowRight size={18} className="mr-2" />
                                Pedir Delivery
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                href="#menu" 
                                className="relative z-30 inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-full transition-all duration-300 bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-yellow-500/50"
                            >
                                <ArrowRight size={18} className="mr-2" />
                                Ver Menu
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-white/50 rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
