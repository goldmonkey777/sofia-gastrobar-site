"use client";

import { Section } from "@/components/ui/Section";

const DETAILED_MENU = [
    {
        category: "Tapas & Starters",
        items: [
            { name: "Patatas Bravas Sofia", price: "€8.50", desc: "Batatas crocantes com nossa salsa brava secreta." },
            { name: "Calamares a la Andaluza", price: "€12.00", desc: "Lulas frescas empanadas com aioli de limão." },
            { name: "Croquetas de Jamón", price: "€9.00", desc: "Cremosas e artesanais, feitas diariamente." },
        ]
    },
    {
        category: "Burgers",
        items: [
            { name: "Sofia Classic", price: "€14.50", desc: "Black Angus, queijo cheddar, bacon e cebola caramelizada." },
            { name: "Ibiza Truffle", price: "€16.00", desc: "Angus, maionese de trufas, rúcula e parmesão." },
        ]
    }
];

export function DetailedMenu() {
    return (
        <Section className="bg-zinc-950 py-16">
            <div className="max-w-4xl mx-auto">
                {DETAILED_MENU.map((section) => (
                    <div key={section.category} className="mb-12">
                        <h3 className="text-2xl font-bold text-yellow-500 mb-6 border-b border-white/10 pb-2">{section.category}</h3>
                        <div className="grid gap-6">
                            {section.items.map((item) => (
                                <div key={item.name} className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-medium text-white">{item.name}</h4>
                                        <p className="text-white/60 text-sm">{item.desc}</p>
                                    </div>
                                    <span className="text-yellow-400 font-bold">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
