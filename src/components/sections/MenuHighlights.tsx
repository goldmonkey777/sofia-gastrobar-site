"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import Image from "next/image";

const MENU_ITEMS = [
    {
        title: "Tapas & Entradas",
        description: "Para compartilhar: Croquetas, Calamares, Patatas Bravas e o melhor do mar.",
        image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Signature Burgers",
        description: "Blend especial, queijos nobres e o toque secreto da Sofia.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop",
    },
    {
        title: "Bowls & Saladas",
        description: "Frescor mediterrâneo com ingredientes locais e nutritivos.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop",
    },
    {
        title: "Cocktails & Vinhos",
        description: "Uma seleção curada para acompanhar o pôr do sol de Ibiza.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070&auto=format&fit=crop",
    }
];

export function MenuHighlights() {
    return (
        <Section id="menu" className="bg-black py-24 relative z-0 scroll-mt-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Cozinha de <span className="text-yellow-500">Alma Livre</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                    A Sofia respeita a tradição, mas dança com a inovação.
                    Pratos criados com ingredientes frescos e amor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MENU_ITEMS.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative h-[400px] overflow-hidden rounded-2xl cursor-pointer"
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
