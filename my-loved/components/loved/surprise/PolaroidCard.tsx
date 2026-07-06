"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface PolaroidCardProps {
  url: string;
  caption: string;
  date: string;
  targetX: number;
  targetY: number;
  rotation: number;
  delay: number;
  depthFactor: number;
  zIndex: number;
}

export default function PolaroidCard({
  url,
  caption,
  date,
  targetX,
  targetY,
  rotation,
  delay,
  depthFactor,
  zIndex
}: PolaroidCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax tracking based on mouse movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Compute animated offset based on depthFactor and mouse position
  const parallaxX = mousePos.x * 24 * depthFactor;
  const parallaxY = mousePos.y * 24 * depthFactor;

  // Depth of field blur setting (background cards are slightly blurred unless hovered)
  const blurAmount = isHovered ? "blur(0px)" : `blur(${0.4 * (1 - depthFactor)}px)`;

  return (
    <motion.div
      transformTemplate={({ x, y, rotate, scale }) => 
        `translate(-50%, -50%) ${x ? `translateX(${x})` : ""} ${y ? `translateY(${y})` : ""} ${rotate ? `rotate(${rotate})` : ""} ${scale ? `scale(${scale})` : ""}`
      }
      initial={{ opacity: 0, scale: 0.1, rotate: 0, x: 0, y: 0, zIndex: zIndex }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: isHovered ? rotation / 3 : rotation, 
        x: targetX + parallaxX, 
        y: targetY + parallaxY,
        zIndex: isHovered ? 100 : zIndex
      }}
      transition={{ 
        type: "spring", 
        stiffness: 45, 
        damping: 14, 
        mass: 1.1,
        delay: delay 
      }}
      whileHover={{ scale: 1.12 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="absolute top-1/2 left-1/2 p-4 pb-8 bg-[#faf9f6] dark:bg-zinc-800 border border-zinc-250/30 dark:border-zinc-700/50 rounded-xl w-72 sm:w-80 text-zinc-800 dark:text-zinc-200 cursor-grab active:cursor-grabbing transform pointer-events-auto transition-shadow"
      style={{
        // Realistic layered shadows & depth of field
        boxShadow: isHovered 
          ? "0 30px 60px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.2)"
          : `0 12px 28px rgba(0,0,0,0.18), 0 5px 10px rgba(0,0,0,0.12)`,
        filter: blurAmount,
        // Edge wear effect
        borderImage: "radial-gradient(circle, #eae7db 0%, #faf9f6 100%) 1",
      }}
    >
      {/* Photo Container */}
      <div className="w-full h-52 sm:h-60 rounded-lg overflow-hidden border border-zinc-200/40 dark:border-zinc-700/40 bg-zinc-100 dark:bg-zinc-900 relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
        <img src={url} alt={caption} className="w-full h-full object-cover select-none pointer-events-none" />
        <div className="absolute top-10 left-0 right-0 inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Polaroid Caption */}
      <div className="px-1 mt-4 text-left font-serif select-none">
        <span className="text-sm font-semibold text-rose-500 dark:text-rose-400 block truncate">{caption}</span>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mt-0.5">{date}</span>
      </div>
    </motion.div>
  );
}
