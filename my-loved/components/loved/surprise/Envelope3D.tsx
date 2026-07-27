"use client";

import React from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface Envelope3DProps {
  envelopeState: "closed" | "seal-breaking" | "opening" | "letter-sliding" | "zoomed";
  milestoneTitle: string;
  handleOpenEnvelope: () => void;
}

export default function Envelope3D({
  envelopeState,
  milestoneTitle,
  handleOpenEnvelope
}: Envelope3DProps) {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-lg">
      
      {envelopeState === "closed" && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mb-8 flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-full bg-[#ff85a2]/15 flex items-center justify-center text-[#ff477e] border border-[#ff85a2]/30 animate-pulse">
            <span className="text-3xl">💝</span>
          </div>
          <h1 className="text-3xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#ff477e] via-[#ff6b8b] to-[#ffb3c1]">
            {milestoneTitle}
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs leading-normal font-sans">
            A physical greeting letter is waiting. Click the wax seal below to break it open.
          </p>
        </motion.div>
      )}

      {/* 3D Envelope Wrapper */}
      <div 
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        className="relative w-80 h-52 sm:w-96 sm:h-60 scale-90 sm:scale-100 mt-2"
      >
        
        {/* Inside Layer / Card sliding up (Three-stage connected timeline) */}
        <motion.div
          animate={
            envelopeState === "letter-sliding"
              ? { y: -160, scale: 0.9, zIndex: 25, boxShadow: "0 25px 50px rgba(255,107,139,0.15)" }
              : envelopeState === "opening"
              ? { y: -25, scale: 0.88, zIndex: 10, boxShadow: "0 8px 16px rgba(255,107,139,0.08)" }
              : { y: 0, scale: 0.85, zIndex: 10, boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)" }
          }
          transition={
            envelopeState === "letter-sliding"
              ? { type: "spring", stiffness: 60, damping: 14, delay: 0.35 }
              : { type: "spring", stiffness: 70, damping: 15 }
          }
          className="absolute inset-x-5 top-5 bottom-5 bg-gradient-to-b from-white to-pink-50/20 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-pink-100 p-5 flex flex-col items-center justify-center"
        >
          <div className="w-full h-full border-2 border-pink-200/40 rounded-xl flex flex-col items-center justify-center text-pink-700 dark:text-pink-200 font-serif relative">
            <div className="absolute top-2 left-2 text-xs opacity-40">❦</div>
            <div className="absolute bottom-2 right-2 text-xs opacity-40">❦</div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b8b] font-sans">Our Memory Vault</span>
            <span className="text-3xl mt-1.5 animate-bounce">💝</span>
          </div>
        </motion.div>
 
        {/* Envelope Back Body (Using exact shapes from test section, styled in pink) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b8b] via-[#ff85a2] to-[#ffb3c1] dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-900 rounded-b-xl shadow-[0_15px_35px_rgba(255,107,139,0.35)] z-20 overflow-hidden border-b border-x border-[#ffccd5]/50">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(0,0,0,0)_60%)]" />
          
          <div className="absolute inset-2.5 rounded-[0.8rem] border border-dashed border-white/20 pointer-events-none" />

          {/* Left Pocket Flap */}
          <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-[#ff477e]/25 backdrop-blur-[1px]" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }} />
          
          {/* Right Pocket Flap */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[#ffccd5]/20 backdrop-blur-[1px]" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }} />
          
          {/* Bottom Pocket Flap */}
          <div className="absolute bottom-0 inset-x-0 h-2/3 bg-[#ffb3c1]/35 backdrop-blur-[1px]" style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />

          {/* Stamp sticker */}
          <div className="absolute top-4 right-4 w-11 h-13 bg-white border border-dashed border-[#ffb3c1] rounded shadow-sm rotate-6 z-25 flex flex-col items-center justify-center p-1 select-none font-serif text-[7px] text-[#ff6b8b]">
            <span className="text-base select-none">💖</span>
            <span className="font-sans font-bold text-[6px] tracking-wider text-[#ff477e]">SLAY</span>
          </div>

          <div className="absolute left-6 bottom-6 z-25 font-cursive text-white/90 text-sm select-none drop-shadow-[0_2px_4px_rgba(255,107,139,0.15)]">
            To my favorite person... ✨
          </div>
        </div>

        {/* Top Flap (Using exact shape and flip animation from test page, styled in pink) */}
        <motion.div 
          className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#ff6b8b] to-[#ff85a2] dark:from-zinc-800 dark:to-zinc-800 z-30 origin-top shadow-[0_8px_16px_rgba(255,107,139,0.2)] border-t border-[#ffccd5]/50"
          style={{ 
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            transformStyle: "preserve-3d"
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: (envelopeState === "opening" || envelopeState === "letter-sliding" || envelopeState === "zoomed") ? 180 : 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15, 
            delay: (envelopeState === "opening" || envelopeState === "letter-sliding" || envelopeState === "zoomed") ? 0 : 0.2
          }}
        />

        {/* Wax Seal Ribbons (Only shown when closed) */}
        {envelopeState !== "opening" && envelopeState !== "letter-sliding" && envelopeState !== "zoomed" && (
          <>
            <motion.div
              animate={envelopeState === "seal-breaking" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[52%] left-[45%] z-35 w-3 h-14 bg-gradient-to-b from-[#ff477e] to-[#ff85a2] rounded shadow-md origin-top -rotate-12 border-x border-[#ffccd5]/50 pointer-events-none"
            />
            <motion.div
              animate={envelopeState === "seal-breaking" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[52%] left-[52%] z-35 w-3 h-14 bg-gradient-to-b from-[#ff477e] to-[#ff85a2] rounded shadow-md origin-top rotate-12 border-x border-[#ffccd5]/50 pointer-events-none"
            />
          </>
        )}

        {/* Wax Seal (Only shown when closed) */}
        {envelopeState !== "opening" && envelopeState !== "letter-sliding" && envelopeState !== "zoomed" && (
          <motion.div
            animate={
              envelopeState === "seal-breaking"
                ? { rotate: [0, -12, 12, -12, 0], scale: 0, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenEnvelope}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-15 h-15 rounded-full bg-gradient-to-tr from-[#ff0055] via-[#ff477e] to-[#ff85a2] shadow-[0_5px_20px_rgba(255,71,126,0.6)] border-2 border-white flex items-center justify-center cursor-pointer text-white animate-pulse"
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-white/80 flex items-center justify-center bg-white/10">
              <Heart className="w-6.5 h-6.5 fill-white drop-shadow-md text-white animate-pulse" />
            </div>
          </motion.div>
        )}

      </div>

      {envelopeState === "opening" && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.6 }}
          className="absolute w-40 h-40 rounded-full bg-yellow-300/40 blur-3xl z-10 pointer-events-none"
        />
      )}

    </div>
  );
}
