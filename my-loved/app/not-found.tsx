import React from "react";
import { Heart, Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 p-6 text-center select-none font-sans">
      {/* Dynamic blurred background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 w-40 h-40 bg-pink-300 dark:bg-pink-900/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-rose-300 dark:bg-rose-900/30 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-2xl flex flex-col items-center gap-6">
        {/* Animated Compass & Heart Icon */}
        <div className="relative w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 animate-bounce">
          <Compass className="w-12 h-12 animate-spin-slow" />
          <Heart className="w-5 h-5 fill-rose-500 absolute scale-75" />
        </div>

        <h1 className="text-4xl font-cursive font-bold text-zinc-900 dark:text-white leading-tight">
          Love Lost in Space
        </h1>

        <p className="text-zinc-650 dark:text-zinc-350 text-sm md:text-base">
          Oh no! The page you are looking for has drifted away. It might have been deleted, moved, or never existed in our love story.
        </p>

        <div className="flex flex-col gap-2 items-center bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 rounded-2xl p-4 w-full text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">
          <span>Error Code: 404</span>
          <span>Status: Page Not Found</span>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-base hover:brightness-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Our Story</span>
        </Link>
      </div>
    </div>
  );
}
