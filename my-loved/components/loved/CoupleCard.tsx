import React from "react";
import { Sparkles, HeartHandshake, User, Heart } from "lucide-react";
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
    <div className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
      <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
        <HeartHandshake className="w-20 h-20 text-rose-400" />
      </div>

      <h2 className="text-xl font-bold font-serif border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
        The Couple
      </h2>

      <div className="flex items-center justify-between gap-4 mt-2">
        {/* Person A */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-20 h-20 rounded-full border-4 border-rose-300/40 dark:border-rose-700/30 overflow-hidden relative shadow-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {personAAvatar ? (
              <img src={personAAvatar} alt={personAName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
            )}
          </div>
          <h3 className="font-semibold text-lg mt-3 text-zinc-950 dark:text-white line-clamp-1">{personAName}</h3>
          <p className="text-xs text-rose-500 dark:text-rose-400 font-medium italic mt-1 line-clamp-2">{personADesc}</p>
        </div>

        {/* Pulsing Connective Heart */}
        <div className="flex flex-col items-center justify-center relative">
          <div 
            onClick={onHeartClick}
            className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shadow-lg border border-rose-200/50 dark:border-rose-900/30 hover:scale-110 cursor-pointer active:scale-95 transition-all z-20 group/heart"
          >
            <Heart className={`w-8 h-8 ${heartColor} animate-pulse group-hover/heart:scale-110 transition-transform`} />
          </div>
          
          {/* Connecting glowing dotted line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 border-t-2 border-dashed border-rose-300/40 dark:border-rose-700/20 -z-10" />

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

        {/* Person B */}
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-20 h-20 rounded-full border-4 border-rose-300/40 dark:border-rose-700/30 overflow-hidden relative shadow-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {personBAvatar ? (
              <img src={personBAvatar} alt={personBName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
            )}
          </div>
          <h3 className="font-semibold text-lg mt-3 text-zinc-950 dark:text-white line-clamp-1">{personBName}</h3>
          <p className="text-xs text-rose-500 dark:text-rose-400 font-medium italic mt-1 line-clamp-2">{personBDesc}</p>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-200/20">
        Click the center heart to shower your partner with love!
      </div>
    </div>
  );
}
