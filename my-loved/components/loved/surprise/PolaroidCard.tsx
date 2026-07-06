"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PolaroidCardProps {
  url: string;
  caption: string;
  date: string;
  location: string;
  milestone: string;
  daysTogether: number;
  note: string;
  targetX: number;
  targetY: number;
  rotation: number;
  delay: number;
  depthFactor: number;
  zIndex: number;
  isAnyHovered: boolean;
  isMeHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export default function PolaroidCard({
  url,
  caption,
  date,
  location,
  milestone,
  daysTogether,
  note,
  targetX,
  targetY,
  rotation,
  delay,
  depthFactor,
  zIndex,
  isAnyHovered,
  isMeHovered,
  onHoverStart,
  onHoverEnd
}: PolaroidCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parallax tracking based on mouse movements (disabled when hovered to keep readability)
  useEffect(() => {
    if (isMeHovered) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMeHovered]);

  // Compute animated offset based on depthFactor and mouse position
  const parallaxX = isMeHovered ? 0 : mousePos.x * 24 * depthFactor;
  const parallaxY = isMeHovered ? 0 : mousePos.y * 24 * depthFactor;

  // Active shift: hovered photo pushes outward toward the viewport edges
  const activeShiftX = isMeHovered ? (targetX < 0 ? -60 : targetX > 0 ? 60 : 0) : 0;
  const activeShiftY = isMeHovered ? (targetY < 0 ? -30 : targetY > 0 ? 30 : 0) : 0;

  // Focus blur (spotlight): dim and blur others, sharpen the active card
  const blurAmount = isMeHovered 
    ? "blur(0px)" 
    : isAnyHovered 
    ? "blur(2px)" 
    : `blur(${0.4 * (1 - depthFactor)}px)`;

  // Determine slide direction for the details tag based on screen height placement
  const isSlideUp = targetY > 0;

  return (
    <motion.div
      transformTemplate={({ x, y, rotate, scale }) => 
        `translate(-50%, -50%) ${x ? `translateX(${x})` : ""} ${y ? `translateY(${y})` : ""} ${rotate ? `rotate(${rotate})` : ""} ${scale ? `scale(${scale})` : ""}`
      }
      initial={{ opacity: 0, scale: 0.1, rotate: 0, x: 0, y: 0, zIndex: zIndex }}
      animate={{ 
        opacity: isMeHovered ? 1 : isAnyHovered ? 0.35 : 1, 
        scale: isMeHovered ? 1.12 : 1, 
        rotate: isMeHovered ? 0 : rotation, 
        x: targetX + parallaxX + activeShiftX, 
        y: targetY + parallaxY + activeShiftY,
        zIndex: isMeHovered ? 100 : zIndex
      }}
      transition={{ 
        type: "spring", 
        stiffness: 45, 
        damping: 14, 
        mass: 1.1,
        delay: isMeHovered ? 0 : delay 
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="absolute top-1/2 left-1/2 p-4 pb-8 bg-[#faf9f6] dark:bg-zinc-850 border border-zinc-250/45 dark:border-zinc-700/60 rounded-xl w-72 sm:w-80 text-zinc-800 dark:text-zinc-200 cursor-grab active:cursor-grabbing transform pointer-events-auto transition-shadow"
      style={{
        boxShadow: isMeHovered 
          ? "0 30px 70px rgba(0,0,0,0.4), 0 15px 30px rgba(0,0,0,0.25)"
          : `0 12px 28px rgba(0,0,0,0.18), 0 5px 10px rgba(0,0,0,0.12)`,
        filter: blurAmount,
        borderImage: "radial-gradient(circle, #eae7db 0%, #faf9f6 100%) 1",
      }}
    >
      {/* Photo Container */}
      <div className="w-full h-52 sm:h-60 rounded-lg overflow-hidden border border-zinc-200/40 dark:border-zinc-700/40 bg-zinc-100 dark:bg-zinc-900 relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
        <img src={url} alt={caption} className="w-full h-full object-cover select-none pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Polaroid Caption */}
      <div className="px-1 mt-4 text-left font-serif select-none">
        <span className="text-sm font-semibold text-rose-500 dark:text-rose-400 block truncate">{caption}</span>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mt-0.5">{date}</span>
      </div>

      {/* Hand-written Memory Info Backing Card (Slides out from behind the photo) */}
      <AnimatePresence>
        {isMeHovered && (
          <motion.div
            initial={{ opacity: 0, y: isSlideUp ? 30 : -30, scale: 0.95 }}
            animate={{ opacity: 1, y: isSlideUp ? "-100%" : "100%", scale: 1 }}
            exit={{ opacity: 0, y: isSlideUp ? 30 : -30, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 70, 
              damping: 14,
              delay: 0.05 
            }}
            className={`absolute left-3 right-3 bg-[#fffdf5] dark:bg-zinc-900 border-amber-200/80 dark:border-zinc-700 shadow-2xl p-4 z-[-1] text-left select-none pointer-events-auto ${
              isSlideUp 
                ? "top-0 border-x border-t rounded-t-2xl pb-6 pt-4" 
                : "bottom-0 border-x border-b rounded-b-2xl pt-6 pb-4"
            }`}
            style={{
              backgroundImage: "linear-gradient(rgba(229, 231, 235, 0.4) 1px, transparent 1px)",
              backgroundSize: "100% 24px",
              lineHeight: "24px"
            }}
          >
            {/* Margins red line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-red-300 opacity-60 pointer-events-none" />
            
            <div className="pl-4.5 flex flex-col gap-2 font-sans">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                <span>✨ Milestone:</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold lowercase first-letter:uppercase truncate max-w-[150px]">{milestone}</span>
              </div>
              
              {location && (
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 dark:text-zinc-400">
                  <span>📍 Location:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[140px]">{location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 dark:text-zinc-400">
                <span>📅 Date:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{date}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 dark:text-zinc-400 border-b border-zinc-200/50 dark:border-zinc-800 pb-2">
                <span>💝 Timeline:</span>
                <span className="font-medium text-rose-500 font-serif">Day {daysTogether} of our story</span>
              </div>

              {/* Handwritten Note */}
              <div className="mt-2.5 font-cursive text-amber-950 dark:text-amber-100 text-sm leading-relaxed whitespace-normal pr-1 italic select-text">
                "{note}"
              </div>
            </div>
            
            {/* Cute sticker clip decoration */}
            <div className="absolute top-2 right-3 text-sm select-none rotate-12 opacity-80 pointer-events-none">📎❤️</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
