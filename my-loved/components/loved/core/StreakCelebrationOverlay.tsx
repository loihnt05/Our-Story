"use client";

import React, { useState, useEffect } from "react";

interface StreakCelebrationOverlayProps {
  streakCount: number;
  onClose: () => void;
}

export default function StreakCelebrationOverlay({
  streakCount,
  onClose,
}: StreakCelebrationOverlayProps) {
  const [celebrationHearts, setCelebrationHearts] = useState<
    Array<{
      id: number;
      left: number;
      size: number;
      duration: number;
      delay: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const colors = [
      "text-rose-500",
      "text-pink-500",
      "text-amber-500",
      "text-red-500",
      "text-yellow-400",
    ];
    const hearts = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 24 + 12,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setCelebrationHearts(hearts);
  }, []);

  const getCelebrationStyle = (count: number) => {
    if (count >= 500) {
      return {
        title: "Ultimate Streak Activated! 👑✨",
        gradient: "from-indigo-450 via-fuchsia-400 to-amber-300",
        flameBg: "from-indigo-600 via-purple-600 to-amber-500",
        borderColor: "border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.65)]",
        description:
          "You two are legendary! Over 500 days of pure devotion and beautiful memories. Absolute couple goals! 🌟💖",
      };
    }
    if (count >= 100) {
      return {
        title: "Epic Streak Activated! 💖🔥",
        gradient: "from-rose-450 via-pink-400 to-orange-400",
        flameBg: "from-rose-500 via-pink-500 to-orange-500",
        borderColor: "border-pink-350 shadow-[0_0_15px_rgba(244,63,94,0.55)]",
        description:
          "Incredible milestone! Over 100 days of connecting, sharing, and loving each other every single day. Keep burning bright! ✨",
      };
    }
    return {
      title: "Streak Activated! 🔥",
      gradient: "from-yellow-300 via-amber-400 to-rose-400",
      flameBg: "from-amber-500 to-rose-500",
      borderColor: "border-amber-300",
      description:
        "You and your partner are perfectly in sync today! Keep sharing your feelings and commenting every day. 💕",
    };
  };

  const celebStyle = getCelebrationStyle(streakCount);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in pointer-events-none select-none">
      <div className="absolute inset-0 overflow-hidden">
        {celebrationHearts.map((heart) => (
          <svg
            key={heart.id}
            className={`absolute ${heart.color} animate-float`}
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

      <div className="flex flex-col items-center gap-4 text-center z-10 px-8 py-8 rounded-3xl bg-white/10 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-2xl backdrop-blur-xl animate-scale-up pointer-events-auto">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-ping" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center border-4 border-amber-300 shadow-lg relative">
            <span className="text-4xl animate-bounce">🔥</span>
          </div>
        </div>
        <h1
          className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${celebStyle.gradient} font-serif drop-shadow-md`}
        >
          {celebStyle.title}
        </h1>
        <p className="text-xl font-bold text-white max-w-sm animate-pulse">
          {streakCount} {streakCount === 1 ? "Day" : "Days"} of Love &amp; Sharing
        </p>
        <p className="text-xs text-zinc-300 max-w-xs leading-normal font-sans">
          {celebStyle.description}
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 rounded-full bg-white hover:bg-zinc-100 text-rose-500 font-bold text-xs shadow-md transition-colors cursor-pointer border-none"
        >
          Awesome! 💖
        </button>
      </div>
    </div>
  );
}
