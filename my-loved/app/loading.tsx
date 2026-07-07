import React from "react";
import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 p-6">
      {/* Background Hearts floating skeleton */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-24 h-24 bg-rose-300 dark:bg-rose-900/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 dark:bg-pink-900/30 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Main card skeleton */}
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-2xl flex flex-col items-center gap-6">
        {/* Pulsing loading heart icon */}
        <div className="relative w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center animate-bounce">
          <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        {/* Text loading placeholders */}
        <div className="w-3/4 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="w-5/6 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="w-1/2 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />

        {/* Dashboard-like grid skeleton placeholders */}
        <div className="w-full grid grid-cols-2 gap-4 mt-4">
          <div className="h-24 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-2xl animate-pulse" />
          <div className="h-24 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-2xl animate-pulse" />
        </div>

        <span className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-wider animate-pulse mt-2">
          Gathering our love story...
        </span>
      </div>
    </div>
  );
}
