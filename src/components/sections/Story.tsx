"use client";

import Image from "next/image";
import { Section } from "@/components/ui/Section";

export function Story() {
    return (
        <Section id="lenda" className="bg-gradient-to-b from-black to-zinc-900 py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        A Lenda de <span className="text-yellow-500">Sofia</span>
                    </h2>
                    <div className="space-y-6 text-lg text-white/80 leading-relaxed font-light">
                        <p>
                            Diz a lenda que Sofia, uma viajante do tempo e do espírito, chegou à
                            ilha guiada por Tânit. Adormeceu entre estrelas e acordou com um propósito:
                        </p>
                        <p className="italic text-yellow-400 border-l-4 border-yellow-500 pl-4 py-2 bg-white/5 rounded-r-lg">
                            “Criar um lugar onde todos pudessem celebrar a vida.”
                        </p>
                        <p>
                            O gastrobar nasceu desse encontro: um templo leve, onde o prazer e a sabedoria se abraçam.
                            Onde as mesas servem de altar e a música é reza.
                        </p>
                    </div>
                </div>

                <div className="relative h-[500px] w-full rounded-full overflow-hidden border-4 border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
                    <Image
                        src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1887&auto=format&fit=crop"
                        alt="A lenda de Sofia - Ambiente místico"
                        fill
                        className="object-cover"
                        quality={85}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-purple-900/30 mix-blend-overlay pointer-events-none" />
                </div>
            </div>
        </Section>
    );
}
