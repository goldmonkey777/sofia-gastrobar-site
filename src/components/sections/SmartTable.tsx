"use client";

import { Section } from "@/components/ui/Section";
import { Smartphone, QrCode, Bell, Gamepad2 } from "lucide-react";

const FEATURES = [
    {
        icon: <QrCode size={32} />,
        title: "QR Inteligente",
        description: "Menu animado, fluido e interativo com um scan."
    },
    {
        icon: <Bell size={32} />,
        title: "Chamar Garçom",
        description: "Um toque para solicitar atendimento ou a conta."
    },
    {
        icon: <Gamepad2 size={32} />,
        title: "Mini-Games",
        description: "Mergulhe na Ilha Mágica de Sofia e ganhe prêmios."
    },
    {
        icon: <Smartphone size={32} />,
        title: "Assistente Sofia",
        description: "Integração total com WhatsApp e pedidos rápidos."
    }
];

export function SmartTable() {
    return (
        <Section id="experiencia" className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    O Futuro é <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Mágico</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                    O primeiro restaurante de Ibiza com um sistema elegante, invisível e eficiente.
                    Tecnologia a serviço do cuidado — não da pressa.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {FEATURES.map((feature, idx) => (
                    <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group"
                    >
                        <div className="mb-6 text-yellow-500 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
}
