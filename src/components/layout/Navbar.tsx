"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Manifesto", href: "#manifesto" },
        { name: "Menu", href: "#menu" },
        { name: "A Lenda", href: "#lenda" },
        { name: "Experiência", href: "#experiencia" },
        { name: "Reservas", href: "/reservas" },
        { name: "Delivery", href: "/delivery" },
        { name: "Localização", href: "#location" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "bg-black/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="relative w-12 h-12 md:w-16 md:h-16">
                    <img src="/logo.png" alt="Sofia Gastrobar" className="w-full h-full object-contain" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-white/80 hover:text-yellow-400 transition-colors uppercase tracking-widest"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white hover:text-yellow-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-white hover:text-yellow-500 text-center"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
