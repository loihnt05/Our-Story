"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CuteHighlightProps {
  children: React.ReactNode;
  className?: string;
  variant?: "marker" | "sparkle" | "wavy" | "heart";
  color?: "pink" | "gold" | "rose" | "purple";
}

export function CuteHighlight({
  children,
  className,
  variant = "marker",
  color = "pink",
}: CuteHighlightProps) {
  // Define colors
  const colorMap = {
    pink: "from-pink-100 to-rose-200 dark:from-pink-950/40 dark:to-rose-900/40 text-pink-700 dark:text-pink-300",
    gold: "from-amber-100 to-yellow-200 dark:from-amber-950/40 dark:to-yellow-900/40 text-amber-850 dark:text-amber-300",
    rose: "from-rose-100 to-pink-200 dark:from-rose-950/40 dark:to-pink-900/40 text-rose-700 dark:text-rose-300",
    purple: "from-purple-100 to-indigo-200 dark:from-purple-950/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-300",
  };

  const selectedColor = colorMap[color] || colorMap.pink;

  if (variant === "sparkle") {
    return (
      <span className={cn("relative inline-block group cursor-default font-semibold", className)}>
        {/* Sparkle 1 */}
        <motion.span
          className="absolute -top-3.5 -left-3.5 text-yellow-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-4 h-4 fill-yellow-300" />
        </motion.span>

        {/* Highlight span */}
        <span className="relative z-10 px-1.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-100/70 to-yellow-200/50 dark:from-amber-950/30 dark:to-yellow-900/30 text-amber-800 dark:text-amber-200">
          {children}
        </span>

        {/* Sparkle 2 */}
        <motion.span
          className="absolute -bottom-3.5 -right-3.5 text-yellow-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: 0.3,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3.5 h-3.5 fill-yellow-400" />
        </motion.span>
      </span>
    );
  }

  if (variant === "heart") {
    return (
      <span className={cn("relative inline-block group cursor-default font-semibold", className)}>
        {/* Heart 1 */}
        <motion.span
          className="absolute -top-4 right-1 text-rose-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
        </motion.span>

        {/* Highlight span */}
        <span className={cn("relative z-10 px-1.5 py-0.5 rounded-lg bg-gradient-to-r", selectedColor)}>
          {children}
        </span>

        {/* Heart 2 */}
        <motion.span
          className="absolute -bottom-3.5 -left-3 text-pink-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          animate={{
            y: [0, 3, 0],
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            delay: 0.2,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-3 h-3 fill-pink-400" />
        </motion.span>
      </span>
    );
  }

  // Wavy Underline variant
  if (variant === "wavy") {
    return (
      <span className={cn("relative inline-block cursor-default group", className)}>
        <span className="relative z-10 font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
          {children}
        </span>
        <svg
          className="absolute left-0 bottom-[-4px] w-full h-[6px] text-rose-400 dark:text-rose-500"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,5 Q10,1 20,5 T40,5 T60,5 T80,5 T100,5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
      </span>
    );
  }

  // Default "marker" (Brush stroke highlighter)
  return (
    <span className={cn("relative inline-block group cursor-default", className)}>
      {/* Animated Marker background */}
      <motion.span
        className={cn(
          "absolute inset-x-[-2px] bottom-[2px] h-[55%] -rotate-1 rounded-sm bg-gradient-to-r opacity-70 group-hover:opacity-85 transition-opacity pointer-events-none z-0",
          selectedColor
        )}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      />
      <span className="relative z-10 font-semibold px-1 text-zinc-900 dark:text-white">
        {children}
      </span>
    </span>
  );
}
