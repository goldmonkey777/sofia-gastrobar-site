"use client";

import { Instagram, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer id="location" className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Contato</h3>
                    <ul className="space-y-4 text-white/60">
                        <li className="flex items-start space-x-3">
                            <MapPin size={20} className="text-yellow-500 shrink-0 mt-1" />
                            <span>Carrer del Progrés, 109<br />Sant Antoni de Portmany, Ibiza</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Phone size={20} className="text-yellow-500 shrink-0" />
                            <span>611-487-773</span>
                        </li>
                    </ul>
                </div>

                {/* Hours */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Horários</h3>
                    <ul className="space-y-2 text-white/60">
                        <li className="flex justify-between">
                            <span>1º Maio - 1º Out</span>
                            <span className="text-white">08h - 01h</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Março, Out, Nov</span>
                            <span className="text-white">12h - 01h</span>
                        </li>
                    </ul>
                </div>

                {/* Social / Brand */}
                <div className="flex flex-col items-start md:items-end">
                    <h3 className="text-2xl font-bold text-white mb-4">SOFIA</h3>
                    <p className="text-white/40 text-sm text-right mb-6 max-w-xs">
                        Um ponto de encontro entre cozinha mediterrânea,
                        tecnologia intuitiva e design emocional.
                    </p>
                    <a
                        href="#"
                        className="flex items-center space-x-2 text-yellow-500 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Instagram size={20} />
                        <span>@sofiagastrobar</span>
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
                <p>© {new Date().getFullYear()} Sofia Gastrobar Ibiza. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <span>Designed by Goldmonkey</span>
                </div>
            </div>
        </footer>
    );
}
