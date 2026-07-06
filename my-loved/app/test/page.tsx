"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MotionEnvelope() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen items-center justify-center min-h-[400px] bg-slate-900 p-8">
      {/* Container holding the envelope and triggering state */}
      <div 
        className="relative w-80 h-52 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 1. THE CARD (Inside the envelope) */}
        <motion.div 
          className="absolute inset-x-4 top-4 bg-white rounded-lg shadow-xl p-4 flex flex-col justify-between h-44 z-10 border border-slate-100"
          initial={{ y: 0 }}
          animate={{ y: isOpen ? -90 : 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15, 
            delay: isOpen ? 0.2 : 0 // Wait for flap to open when opening
          }}
        >
          <div>
            <div className="w-12 h-2 bg-indigo-600 rounded mb-3" />
            <h4 className="text-sm font-semibold text-slate-800">System Notification</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your request has been processed successfully. Click anywhere to close.
            </p>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-2 border-slate-100">
            <span>ID: #23520869</span>
            <span>Just now</span>
          </div>
        </motion.div>

        {/* 2. THE BACK & SIDES OF ENVELOPE */}
        <div className="absolute inset-0 bg-slate-700 rounded-b-xl shadow-2xl z-20 overflow-hidden">
          {/* Left Pocket Flap */}
          <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-slate-600/40 clip-left" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)' }} />
          {/* Right Pocket Flap */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-slate-600/30 clip-right" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }} />
          {/* Bottom Pocket Flap */}
          <div className="absolute bottom-0 inset-x-0 h-2/3 bg-slate-600/50" style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
        </div>

        {/* 3. THE TOP FLAP (Flipped up/down) */}
        <motion.div 
          className="absolute inset-x-0 top-0 h-24 origin-top z-30"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
          }}
        >
          {/* Static SVG Triangle for the flap */}
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
            <polygon points="0,0 50,30 100,0" className="fill-slate-700" />
            <polygon points="0,0 50,29 100,0" className="fill-slate-500" />
          </svg>
        </motion.div>
      </div>

      {/* Helper Label */}
      <p className="text-slate-400 text-sm mt-28 animate-pulse select-none">
        {isOpen ? "Click to close envelope" : "Click to open envelope"}
      </p>
    </div>
  );
}