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
  const [useDelay, setUseDelay] = useState(true);

  // Disable stagger delay after initial load (so hover interactions are instant)
  useEffect(() => {
    const timer = setTimeout(() => setUseDelay(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  // Align slightly to the left (-160px) when active to make space for details panel on the right
  const animateX = isMeHovered ? -160 : targetX + parallaxX;
  const animateY = isMeHovered ? 0 : targetY + parallaxY;

  // Focus blur (spotlight): dim and blur others heavily, sharpen the active card
  const blurAmount = isMeHovered 
    ? "blur(0px)" 
    : isAnyHovered 
    ? "blur(4px)" 
    : `blur(${0.4 * (1 - depthFactor)}px)`;

  return (
    <motion.div
      transformTemplate={({ x, y, rotate, scale }) => 
        `translate(-50%, -50%) ${x ? `translateX(${x})` : ""} ${y ? `translateY(${y})` : ""} ${rotate ? `rotate(${rotate})` : ""} ${scale ? `scale(${scale})` : ""}`
      }
      initial={{ opacity: 0, scale: 0.9, rotate: 0, x: 0, y: 0, zIndex: zIndex }}
      animate={{ 
        opacity: isMeHovered ? 1 : isAnyHovered ? 0.1 : 1, 
        scale: isMeHovered ? 1.12 : 1, 
        rotate: isMeHovered ? 0 : rotation, 
        x: animateX, 
        y: animateY,
        zIndex: isMeHovered ? 100 : zIndex
      }}
      transition={{ 
        type: "spring", 
        stiffness: isMeHovered ? 75 : (useDelay ? 45 : 140), // Snappier when unhovering
        damping: isMeHovered ? 15 : (useDelay ? 9 : 22),    // Lower damping (9) for initial entry gives a beautiful physical overshoot and gravity settle!
        mass: 1.0,
        delay: useDelay ? delay : 0 // No delay after initial mount fanning
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="absolute top-1/2 left-1/2 p-4 pb-8 bg-[#faf7f0] dark:bg-zinc-850 border border-[#eadecc]/60 dark:border-zinc-700/60 rounded-xl w-72 sm:w-80 text-zinc-800 dark:text-zinc-200 cursor-grab active:cursor-grabbing transform pointer-events-auto transition-shadow"
      style={{
        boxShadow: isMeHovered 
          ? "0 40px 80px -15px rgba(0,0,0,0.4), 0 20px 45px -10px rgba(0,0,0,0.3)"
          : `0 20px 40px -15px rgba(0,0,0,0.25), 0 15px 25px -10px rgba(0,0,0,0.15), 0 5px 10px -5px rgba(0,0,0,0.1)`,
        filter: blurAmount,
        borderImage: "radial-gradient(circle, #eae7db 0%, #faf7f0 100%) 1",
      }}
    >
      {/* Expanded forgiving hover boundary overlay */}
      {isMeHovered && (
        <div className="absolute inset-[-40px] z-[-2] bg-transparent pointer-events-auto cursor-default" />
      )}

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

      {/* Hand-written Memory Info Backing Card (Slides out to the right side of the photo) */}
      <AnimatePresence>
        {isMeHovered && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 75, 
              damping: 15,
              delay: 0.05 
            }}
            className="absolute left-full top-0 bottom-0 w-[280px] sm:w-[320px] bg-[#fffdf5] dark:bg-zinc-900 border-y border-r border-amber-200/80 dark:border-zinc-700 shadow-2xl p-5 z-[-1] text-left select-none pointer-events-auto rounded-r-2xl flex flex-col justify-center gap-3 border-l-0"
            style={{
              backgroundImage: "linear-gradient(rgba(229, 231, 235, 0.4) 1px, transparent 1px)",
              backgroundSize: "100% 24px",
              lineHeight: "24px"
            }}
          >
            {/* Margins red line */}
            <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-red-300 opacity-60 pointer-events-none" />
            
            <div className="pl-4 flex flex-col gap-2.5 font-sans">
              <div className="flex flex-col gap-0.5 border-b border-zinc-200/50 dark:border-zinc-800 pb-2">
                <h3 className="font-serif font-bold text-base text-rose-500 leading-tight truncate max-w-[220px]">{caption}</h3>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{date}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                <span>✨ Milestone:</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold lowercase first-letter:uppercase truncate max-w-[150px]">{milestone}</span>
              </div>
              
              {location && (
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 dark:text-zinc-400">
                  <span>📍 Location:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[160px]">{location}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[9px] text-zinc-550 dark:text-zinc-400">
                <span>💝 Timeline:</span>
                <span className="font-medium text-rose-500 font-serif">Day {daysTogether} of our story</span>
              </div>

              {/* Handwritten Note */}
              <div className="mt-2.5 font-cursive text-amber-950 dark:text-amber-100 text-sm leading-relaxed whitespace-normal pr-1 italic select-text">
                "{note}"
              </div>
            </div>
            
            {/* Cute sticker clip decoration */}
            <div className="absolute top-3 right-3 text-base select-none rotate-12 opacity-80 pointer-events-none">📎❤️</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
