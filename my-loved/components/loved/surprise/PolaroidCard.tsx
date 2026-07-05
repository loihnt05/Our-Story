"use client";

import React from "react";
import { motion } from "motion/react";

interface PolaroidCardProps {
  url: string;
  caption: string;
  date: string;
  rotation: number;
  top: string;
  left: string;
  delay: number;
}

export default function PolaroidCard({
  url,
  caption,
  date,
  rotation,
  top,
  left,
  delay
}: PolaroidCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: 0, x: rotation < 0 ? -200 : 200 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation, x: 0 }}
      transition={{ type: "spring", stiffness: 40, damping: 12, delay }}
      whileHover={{ scale: 1.1, rotate: rotation / 2, zIndex: 50 }}
      className="absolute p-3 pb-6 bg-white border border-zinc-200 shadow-2xl rounded-xl w-60 text-zinc-800 flex flex-col gap-3.5 cursor-grab active:cursor-grabbing transform"
      style={{ top, left }}
    >
      <div className="w-full h-44 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50 relative">
        <img src={url} alt={caption} className="w-full h-full object-cover select-none pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="px-1 text-left font-serif select-none">
        <span className="text-xs font-bold text-rose-600 block">{caption}</span>
        <span className="text-[9px] text-zinc-400 uppercase tracking-widest">{date}</span>
      </div>
    </motion.div>
  );
}
