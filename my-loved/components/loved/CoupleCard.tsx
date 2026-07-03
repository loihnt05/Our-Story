import React from "react";
import { Sparkles, User, Heart } from "lucide-react";
import { BurstHeart } from "./types";

interface CoupleCardProps {
  personAName: string;
  personADesc: string;
  personAAvatar: string;
  personBName: string;
  personBDesc: string;
  personBAvatar: string;
  heartColor: string;
  borderColor: string;
  cardBg: string;
  burstHearts: BurstHeart[];
  onHeartClick: (e: React.MouseEvent) => void;
}

export default function CoupleCard({
  personAName,
  personADesc,
  personAAvatar,
  personBName,
  personBDesc,
  personBAvatar,
  heartColor,
  borderColor,
  cardBg,
  burstHearts,
  onHeartClick
}: CoupleCardProps) {
  return (
    <div 
      className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500`}
      style={{
        backgroundImage: "radial-gradient(rgba(244, 63, 94, 0.05) 1.5px, transparent 1.5px)",
        backgroundSize: "16px 16px"
      }}
    >
      {/* Decorative top-right graphic sparkles */}
      <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none select-none text-rose-500">
        <Sparkles className="w-16 h-16 rotate-12" />
      </div>

      {/* Spotlight blur behind center heart */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-rose-500/8 via-pink-500/5 to-amber-500/8 rounded-full blur-2xl pointer-events-none -z-10 animate-pulse" />

      {/* Header */}
      <h2 className="text-base font-bold font-serif border-b pb-2.5 border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-1.5 z-10 text-zinc-900 dark:text-white">
        <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500/10" />
        The Couple
      </h2>

      {/* Polaroid & Connective Heart Container */}
      <div className="flex items-center justify-between gap-2 mt-4 z-10 select-none">
        
        {/* Person A Polaroid */}
        <div className="flex flex-col items-center flex-1 relative">
          
          {/* Polaroid Frame */}
          <div className="p-2.5 pb-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-md hover:shadow-lg transform hover:-rotate-[4deg] hover:scale-105 rotate-[-2deg] transition-all duration-300 max-w-[120px] w-full flex flex-col items-center relative">
            
            {/* Washi Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-rose-200/30 dark:bg-rose-900/20 border-x border-dashed border-rose-300/20 rotate-[-3deg] shadow-sm" />

            {/* Photo slot */}
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-900 bg-rose-50/20 dark:bg-zinc-900/30 flex items-center justify-center relative">
              {personAAvatar ? (
                <img src={personAAvatar} alt={personAName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-50/30 dark:bg-rose-950/20 text-rose-400 relative">
                  <User className="w-6 h-6 opacity-60" />
                  <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400 absolute bottom-2 right-2 opacity-80 animate-pulse" />
                </div>
              )}
            </div>

            {/* Label */}
            <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 mt-2.5 line-clamp-1 text-center w-full font-serif">
              {personAName}
            </span>
          </div>

          <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold italic mt-3.5 line-clamp-1 max-w-[100px] text-center">
            {personADesc}
          </p>
        </div>

        {/* Pulsing Connective Heart */}
        <div className="flex flex-col items-center justify-center relative">
          <div 
            onClick={onHeartClick}
            className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shadow-lg border border-rose-200/50 dark:border-rose-900/30 hover:scale-110 cursor-pointer active:scale-95 transition-all z-20 group/heart"
          >
            <Heart className={`w-7 h-7 ${heartColor} animate-pulse group-hover/heart:scale-110 transition-transform`} />
          </div>
          
          {/* Connecting glowing dotted line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 border-t-2 border-dashed border-rose-300/30 dark:border-rose-700/10 -z-10" />

          {/* Flying burst hearts */}
          {burstHearts.map((heart) => (
            <svg
              key={heart.id}
              className="absolute text-rose-500 fill-rose-500 pointer-events-none animate-heart-burst"
              style={{
                left: `${heart.x}px`,
                top: `${heart.y}px`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                "--rot": `${heart.rotation}deg`,
                animationDelay: `${heart.delay}s`,
              } as React.CSSProperties}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ))}
        </div>

        {/* Person B Polaroid */}
        <div className="flex flex-col items-center flex-1 relative">
          
          {/* Polaroid Frame */}
          <div className="p-2.5 pb-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-md hover:shadow-lg transform hover:rotate-[4deg] hover:scale-105 rotate-[2deg] transition-all duration-300 max-w-[120px] w-full flex flex-col items-center relative">
            
            {/* Washi Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-rose-200/30 dark:bg-rose-900/20 border-x border-dashed border-rose-300/20 rotate-[3deg] shadow-sm" />

            {/* Photo slot */}
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-900 bg-rose-50/20 dark:bg-zinc-900/30 flex items-center justify-center relative">
              {personBAvatar ? (
                <img src={personBAvatar} alt={personBName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rose-50/30 dark:bg-rose-950/20 text-rose-400 relative">
                  <User className="w-6 h-6 opacity-60" />
                  <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400 absolute bottom-2 right-2 opacity-80 animate-pulse" />
                </div>
              )}
            </div>

            {/* Label */}
            <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 mt-2.5 line-clamp-1 text-center w-full font-serif">
              {personBName}
            </span>
          </div>

          <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold italic mt-3.5 line-clamp-1 max-w-[100px] text-center">
            {personBDesc}
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-200/10 z-10 mt-1 select-none">
        Click the center heart to shower your partner with love!
      </div>
    </div>
  );
}
