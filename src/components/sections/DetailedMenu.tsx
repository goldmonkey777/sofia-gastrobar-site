"use client";

import { Section } from "@/components/ui/Section";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FULL_MENU = [
    {
        category: "Tapas & Entradas",
        description: "Para compartilhar",
        items: [
            { name: "Coração Crocante do Brasil (Coxinha)", price: "€7.00", desc: "Croquetas doradas de pollo desmenuzado, al estilo brasileño. / Golden chicken croquettes, Brazilian-style." },
            { name: "Clásicas do Povo (Patatas Fritas)", price: "€8.00", desc: "Papas doradas, crujientes. / Golden crispy fries." },
            { name: "Batata do Sol (Boniato Frito)", price: "€9.00", desc: "Rodajas dulces y crujientes de boniato. / Fried Sweet Potato." },
            { name: "Bravas Ibicencas", price: "€9.00", desc: "Patatas caseras con salsa picante. / Homemade potatoes with spicy sauce." },
            { name: "Frango do Brasil", price: "€15.00", desc: "Pollo frito marinado con cúrcuma y jengibre. / Fried Brazilian Chicken with turmeric and ginger." },
            { name: "Nachos de Gaia (Vegetariano)", price: "€14.00", desc: "Cheddar, guacamole, pico de gallo y jalapeños." },
            { name: "Nachos del Toro (Beef)", price: "€15.00", desc: "Cheddar fundido, carne suculenta, pico de gallo e guacamole." },
            { name: "Nachos del Pecado (Bacon & Beef)", price: "€16.00", desc: "Carne, bacon crocante e cheddar." },
            { name: "Nachos del Caribe (Chicken)", price: "€15.00", desc: "Frango desfiado, cheddar, guacamole, pico de gallo." },
            { name: "Nachos del Crimen Perfecto", price: "€16.00", desc: "Frango, bacon e cheddar." },
            { name: "Carpaccio de Ternera", price: "€13.00", desc: "Con salsa de mostaza, parmesano y alcaparras." },
        ]
    },
    {
        category: "Gastroburgers",
        description: "Servidas sin patatas / Served without fries",
        items: [
            { name: "Playa Burger", price: "€15.00", desc: "200g buey, cheddar, tomate, cebolla morada, mayo." },
            { name: "Wild Egg", price: "€16.00", desc: "Huevo campero XL, cheddar, tomate, cebolla." },
            { name: "Suntrip", price: "€17.00", desc: "Doble cheddar, bacon crujiente, ketchup." },
            { name: "Midnight Lover", price: "€18.00", desc: "Buey, queso latino, aguacate, cebolla." },
            { name: "No Drama (Chicken)", price: "€15.00", desc: "Pollo crujiente, cheddar, tomate, mayo suave." },
            { name: "Crystal Flame (Spicy)", price: "€18.00", desc: "Jalapeños, cheddar, bacon, salsa brava." },
            { name: "Gaia Soul (Veggie)", price: "€17.00", desc: "Queso de cabra, tomate, cebolla morada." },
            { name: "Mystic Green", price: "€18.00", desc: "Buey, queso latino, aguacate." },
            { name: "Venus Trap", price: "€20.00", desc: "Pollo crujiente, cheddar doble, bacon, huevo." },
            { name: "Zen Beast (Veggie)", price: "€17.00", desc: "Cheddar, huevo campero, cebolla." },
            { name: "Ocean Vibe (Veggie)", price: "€16.00", desc: "Aguacate, ketchup, mayonesa." },
            { name: "Golden Mood", price: "€19.00", desc: "Picanha, cheddar doble, salsa miel y mostaza." },
            { name: "Ibiza Star", price: "€21.00", desc: "Buey, cheddar, bacon, huevo, salsa de la casa." },
            { name: "Jungle Pollo", price: "€18.00", desc: "Pollo crujiente, aguacate, queso latino." },
            { name: "Full Moon Veg", price: "€18.00", desc: "Burger veggie doble, cheddar, huevo." },
        ]
    },
    {
        category: "Pizzas Artesanas",
        description: "30 cm Italian Pizza",
        items: [
            { name: "Mar y Sol (Margherita)", price: "€14.50", desc: "Salsa de tomate, mozzarella." },
            { name: "Fuego Ibiza", price: "€16.00", desc: "Salami picante, pimientos, jalapeños." },
            { name: "Luna de Quesos", price: "€16.00", desc: "Mozzarella, edam, cheddar, queso de cabra." },
            { name: "Verde Vida", price: "€15.00", desc: "Verduras a la parrilla, mozzarella." },
            { name: "Ibiza Royale", price: "€16.00", desc: "Jamón york, champiñones." },
            { name: "Pollo Soul", price: "€15.50", desc: "Pollo asado, mozzarella." },
            { name: "Sol Latino", price: "€16.50", desc: "Jamón york, queso latino, pimientos." },
            { name: "Cheddar Lovers", price: "€15.50", desc: "Doble cheddar fundido." },
        ]
    },
    {
        category: "Platos Principales",
        items: [
            { name: "Salmón Boreal", price: "€26.00", desc: "Salmón salvaje a la plancha con patatas y ensalada." },
            { name: "Vaca Brava", price: "€24.00", desc: "Chuletón (300g) con pimientos y patatas rústicas." },
            { name: "Tentáculos del Mar", price: "€28.00", desc: "Pulpo a la plancha con ensalada." },
            { name: "Feijoada Negra del Sol", price: "€16.00", desc: "Frijoles negros, carne seca, costilla, chorizo, bacon, arroz, farofa." },
            { name: "Bobó de Camarão", price: "€16.00", desc: "Puré de yuca con gambas y arroz." },
        ]
    },
    {
        category: "Ensaladas",
        items: [
            { name: "Ensalada del Edén", price: "€16.00", desc: "Queso de cabra, frutos rojos, nueces." },
            { name: "Verde Vital", price: "€13.00", desc: "Mezclum, aguacate, manzana, frutos secos." },
            { name: "Atlántico Fresco (Atún)", price: "€14.00", desc: "Atún, nueces, salsa césar, pepino." },
            { name: "Salmón Zen", price: "€16.00", desc: "Salmón, aguacate, mostaza y miel." },
        ]
    },
    {
        category: "Sangrías & Cocteles",
        items: [
            { name: "Red Sunset (Sangría Tinto)", price: "€26.00", desc: "Vino tinto, frutas frescas, canela." },
            { name: "White Breeze (Sangría Blanca)", price: "€26.00", desc: "Vino blanco, frutas tropicales, menta." },
            { name: "Golden Bubbles (Cava)", price: "€29.00", desc: "Cava con frutas naturales." },
            { name: "Caipirinha Brasilera", price: "€11.00", desc: "Cachaça, lima, azúcar." },
            { name: "Piña Colada Tropical", price: "€11.00", desc: "Ron blanco, coco, piña." },
            { name: "Mojito Clásico", price: "€11.00", desc: "Ron blanco, hierbabuena, lima." },
            { name: "Aperol Spritz", price: "€9.00", desc: "Aperol, cava, soda." },
            { name: "Daiquiri de Frutas", price: "€11.00", desc: "Fresa, mango, plátano o frutos rojos." },
        ]
    },
    {
        category: "VIP Party Packs",
        description: "Ideal para grupos y villas",
        items: [
            { name: "Villa Overdose", price: "€115.00", desc: "Grey Goose, Ron Barceló, Mixers, Red Bull, Hielo." },
            { name: "Pack Absolut Energy", price: "€55.00", desc: "Vodka Absolut + 4 Red Bulls." },
            { name: "Pack Jack & Cola", price: "€58.00", desc: "Jack Daniel's + 4 Coca-Colas." },
            { name: "Pack Hendrick’s Tonic", price: "€57.00", desc: "Gin Hendrick’s + 4 Tónicas." },
        ]
    }
];

export function DetailedMenu() {
    const [activeCategory, setActiveCategory] = useState(FULL_MENU[0].category);

    return (
        <Section id="full-menu" className="bg-zinc-950 py-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Menu <span className="text-yellow-500">Completo</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                    Explore nossa seleção completa de sabores mediterrâneos e internacionais.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-6xl mx-auto px-4">
                {FULL_MENU.map((section) => (
                    <button
                        key={section.category}
                        onClick={() => setActiveCategory(section.category)}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                            activeCategory === section.category
                                ? "bg-yellow-500 text-black border-yellow-500"
                                : "bg-transparent text-white/70 border-white/10 hover:border-yellow-500/50 hover:text-white"
                        )}
                    >
                        {section.category}
                    </button>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-4 min-h-[600px]">
                <AnimatePresence mode="wait">
                    {FULL_MENU.map((section) => (
                        section.category === activeCategory && (
                            <motion.div
                                key={section.category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8 text-center">
                                    <h3 className="text-3xl font-bold text-white mb-2">{section.category}</h3>
                                    {section.description && <p className="text-yellow-500/80 italic">{section.description}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {section.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white/5 border border-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">{item.name}</h4>
                                                <span className="text-yellow-500 font-bold whitespace-nowrap ml-4">{item.price}</span>
                                            </div>
                                            <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </Section>
    );
}
