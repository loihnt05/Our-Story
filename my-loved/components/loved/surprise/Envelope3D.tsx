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
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/30 animate-pulse">
            <span className="text-3xl">💌</span>
          </div>
          <h1 className="text-3xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300">
            {milestoneTitle}
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs leading-normal font-sans">
            A physical greeting letter is waiting. Click the wax seal below to break it open.
          </p>
        </motion.div>
      )}

      {/* 3D Envelope Wrapper */}
      <div className="relative w-80 h-52 sm:w-96 sm:h-60 perspective-[1000px] preserve-3d scale-90 sm:scale-100 mt-2">
        
        {/* Inside Layer / Card sliding up */}
        <motion.div
          animate={
            envelopeState === "letter-sliding"
              ? { y: -160, scale: 0.9, zIndex: 12 }
              : { y: 0, scale: 0.85, zIndex: 8 }
          }
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          className="absolute inset-x-5 top-5 bottom-5 bg-gradient-to-b from-[#fdfbf7] to-[#f5f0e6] dark:from-zinc-800 dark:to-zinc-900 rounded-2xl shadow-[inset_0_0_15px_rgba(0,0,0,0.1),0_10px_20px_rgba(0,0,0,0.15)] border border-amber-200/60 p-5 flex flex-col items-center justify-center"
        >
          <div className="w-full h-full border-2 border-amber-300/40 rounded-xl flex flex-col items-center justify-center text-amber-800 dark:text-amber-200 font-serif relative">
            <div className="absolute top-2 left-2 text-xs opacity-40">❦</div>
            <div className="absolute bottom-2 right-2 text-xs opacity-40">❦</div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600/80 font-sans">Our Memory Vault</span>
            <span className="text-3xl mt-1.5 animate-bounce">💝</span>
          </div>
        </motion.div>

        {/* Envelope Back Body */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-700 via-rose-800 to-rose-900 rounded-3xl shadow-[0_20px_45px_rgba(0,0,0,0.4)] border border-rose-650 z-10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(253,224,71,0.06)_0%,rgba(0,0,0,0)_60%)]" />
          
          <div className="absolute inset-2.5 rounded-[1.4rem] border border-dashed border-amber-400/20 pointer-events-none" />

          <div className="absolute top-4 right-4 w-11 h-13 bg-white border border-dashed border-zinc-300 rounded shadow-sm rotate-6 z-25 flex flex-col items-center justify-center p-1 select-none font-serif text-[7px] text-zinc-400">
            <span className="text-base select-none">🕊️</span>
            <span className="font-sans font-bold text-[6px] tracking-wider text-rose-500">LOVE</span>
          </div>

          <div className="absolute top-5 right-11 w-9 h-9 rounded-full border border-dashed border-rose-300/40 rotate-12 z-25 flex items-center justify-center text-[5px] text-rose-300/40 font-mono tracking-tighter select-none">
            ANNIVERSARY
          </div>

          <div className="absolute left-6 bottom-6 z-25 font-cursive text-amber-100/90 text-sm select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            To my dearest partner... 💖
          </div>

          <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-rose-900/60 shadow-md origin-left [clip-path:polygon(0%_0%,100%_50%,0%_100%)] border-r border-white/5" />
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-rose-900/60 shadow-md origin-right [clip-path:polygon(100%_0%,0%_50%,100%_100%)] border-l border-white/5" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-rose-850/80 shadow-[0_-5px_15px_rgba(0,0,0,0.15)] [clip-path:polygon(0%_100%,50%_0%,100%_100%)] border-t border-white/5" />
        </div>

        {/* Top opening Flap */}
        <motion.div
          style={{
            transformOrigin: "top",
            clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)"
          }}
          animate={
            envelopeState !== "closed" && envelopeState !== "seal-breaking"
              ? { rotateX: 180, zIndex: 5, y: -1 }
              : { rotateX: 0, zIndex: 15, y: 0 }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-rose-800 to-rose-700 border-b border-rose-650 shadow-md flex items-center justify-center"
        >
          <div className="absolute inset-1 border-b border-amber-300/40 opacity-70 pointer-events-none" style={{ clipPath: "polygon(0% 0%, 50% 95%, 100% 0%)" }} />
        </motion.div>

        {/* Wax Seal Ribbons */}
        {envelopeState !== "opening" && envelopeState !== "letter-sliding" && (
          <>
            <motion.div
              animate={envelopeState === "seal-breaking" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[52%] left-[45%] z-20 w-3 h-14 bg-amber-400/90 rounded shadow-md origin-top -rotate-12 border-x border-amber-300 pointer-events-none"
            />
            <motion.div
              animate={envelopeState === "seal-breaking" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[52%] left-[52%] z-20 w-3 h-14 bg-amber-400/90 rounded shadow-md origin-top rotate-12 border-x border-amber-300 pointer-events-none"
            />
          </>
        )}

        {/* Golden Wax Seal */}
        {envelopeState !== "opening" && envelopeState !== "letter-sliding" && (
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-15 h-15 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-2 border-amber-250 flex items-center justify-center cursor-pointer text-white animate-pulse"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/60 flex items-center justify-center bg-yellow-500/10">
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
