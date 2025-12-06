"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface MagicButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "ghost";
    className?: string;
    icon?: React.ReactNode;
    asChild?: boolean;
}

export function MagicButton({
    children,
    variant = "primary",
    className,
    icon,
    asChild = false,
    ...props
}: MagicButtonProps) {
    const variants = {
        primary:
            "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 border border-transparent",
        outline:
            "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-yellow-500/50",
        ghost: "bg-transparent text-white/80 hover:text-yellow-400 hover:bg-white/5",
    };

    const buttonClasses = cn(
        "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-full transition-all duration-300 cursor-pointer",
        variants[variant],
        className
    );

    if (asChild) {
        return (
            <span className={buttonClasses}>
                {icon && <span className="mr-2">{icon}</span>}
                <span className="relative z-10">{children}</span>
            </span>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClasses}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}
