"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Music, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
            <audio
                ref={audioRef}
                loop
                src="https://goldmonkey-assets.s3.amazonaws.com/ibiza-sunset-loop.mp3" // Placeholder or need a real URL
            />

            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="glass-panel p-4 rounded-2xl flex items-center space-x-4 mb-2 max-w-[250px]"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 flex items-center justify-center"
                            >
                                <Music size={16} className="text-white" />
                            </motion.div>
                        </div>
                        <div>
                            <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Modo DJ Ativo</p>
                            <p className="text-sm text-white font-medium">Ibiza Sunset Vibes</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center space-x-2">
                {isPlaying && (
                    <button
                        onClick={toggleMute}
                        className="w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                )}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center shadow-xl border border-white/10 transition-all",
                        isPlaying ? "bg-yellow-500 text-black animate-pulse" : "bg-black/50 backdrop-blur text-yellow-500 hover:bg-black/70"
                    )}
                >
                    <Disc size={28} className={isPlaying ? "animate-spin-slow" : ""} />
                </motion.button>
            </div>
        </div>
    );
}
