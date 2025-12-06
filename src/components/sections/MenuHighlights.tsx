"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import Image from "next/image";

const MENU_ITEMS = [
    {
        title: "Tapas Artesanais",
        description: "Pequenas porções, grandes histórias. Clássicos reinvetados.",
        image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Bowls Nutritivos",
        description: "Frescor da ilha em cada garfada. Equilíbrio e sabor.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop",
    },
    {
        title: "Cocktails Autorais",
        description: "Alquimia líquida inspirada nos elementos de Ibiza.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Fogo & Brasa",
        description: "Carnes e pescados nobres tocados pelo fogo sagrado.",
        image: "https://images.unsplash.com/photo-1594041680508-e38734207e6c?q=80&w=2072&auto=format&fit=crop",
    }
];

export function MenuHighlights() {
    return (
        <Section id="menu" className="bg-black py-24">
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
                        <div className="absolute inset-0">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
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
