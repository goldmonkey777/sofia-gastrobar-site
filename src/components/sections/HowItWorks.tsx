"use client";

import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Crown, Zap } from "lucide-react";
import Link from "next/link";

const STEPS = [
    {
        icon: <QrCode size={40} />,
        title: "No Restaurante",
        description: "Escaneie o QR code da sua mesa para acessar menu digital, chamar garçom e pedir a conta.",
        link: "/mesa/01",
        linkText: "Ver exemplo",
    },
    {
        icon: <Smartphone size={40} />,
        title: "Em Casa",
        description: "Peça delivery para toda a ilha. Entregamos com rapidez e cuidado, direto na sua porta.",
        link: "/delivery",
        linkText: "Pedir agora",
    },
    {
        icon: <Crown size={40} />,
        title: "Cliente VIP",
        description: "Junte-se ao Clube Sofia e ganhe acesso a promoções exclusivas, eventos secretos e benefícios especiais.",
        link: "/clube-sofia",
        linkText: "Entrar no clube",
    },
];

export function HowItWorks() {
    return (
        <Section id="como-funciona" className="bg-gradient-to-b from-zinc-950 to-black py-24">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Como Funciona o <span className="text-yellow-500">Sofia Digital</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Três formas de viver a experiência Sofia: no restaurante, em casa ou como membro VIP.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {STEPS.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group"
                    >
                        <div className="mb-6 text-yellow-500 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            {step.description}
                        </p>
                        <Link
                            href={step.link}
                            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
                        >
                            {step.linkText}
                            <Zap className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-16 text-center"
            >
                <p className="text-white/60 mb-6">
                    Primeiro restaurante de Ibiza com sistema elegante, invisível e eficiente.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/reservas"
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20"
                    >
                        Reservar Mesa
                    </Link>
                    <Link
                        href="/delivery"
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                    >
                        Pedir Delivery
                    </Link>
                </div>
            </motion.div>
        </Section>
    );
}

