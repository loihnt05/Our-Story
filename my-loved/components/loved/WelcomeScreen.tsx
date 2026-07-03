import React from "react";
import { Heart, HeartHandshake } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: () => void;
  gradient: string;
  floatingHearts: Array<{
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
  }>;
  customTitle: string;
}

export default function WelcomeScreen({
  onEnter,
  gradient,
  floatingHearts,
  customTitle
}: WelcomeScreenProps) {
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${gradient} transition-all duration-1000 p-6`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingHearts.map((heart) => (
          <svg
            key={heart.id}
            className="absolute text-rose-300/20 dark:text-rose-500/10 animate-float"
            style={{
              left: `${heart.left}%`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              bottom: `-50px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      <div className="relative text-center max-w-lg p-8 rounded-3xl bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center gap-6 animate-scale-up">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center animate-pulse">
          <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-cursive text-zinc-900 dark:text-white font-bold leading-tight">
          {customTitle || "Our Story"}
        </h1>
        
        <p className="text-zinc-600 dark:text-zinc-300 text-lg">
          Welcome to our special place. Relive our milestones, count the moments, and build our timeline.
        </p>

        <button
          onClick={onEnter}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-lg hover:brightness-105"
        >
          <HeartHandshake className="w-6 h-6 animate-bounce" />
          Enter Our Kingdom
        </button>
      </div>
    </div>
  );
}
