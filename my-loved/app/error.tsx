"use client";

import React, { useEffect } from "react";
import { HeartCrack, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error boundary caught: ", error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 p-6 text-center select-none font-sans">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-red-400 dark:bg-red-900/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-rose-400 dark:bg-rose-900/30 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 shadow-2xl flex flex-col items-center gap-6">
        {/* Broken Heart Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 animate-pulse">
          <HeartCrack className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-cursive font-bold text-zinc-900 dark:text-white leading-tight">
          A Little Hiccup in Our Story
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base">
          Oops! Something went wrong while loading this page. Don't worry, our memories are safe, but the stars flickered for a moment.
        </p>

        {error.message && (
          <div className="w-full p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 rounded-xl text-left max-h-24 overflow-y-auto">
            <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 leading-normal block break-all">
              Error detail: {error.message}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          {/* Reset button to attempt recovery */}
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4 animate-spin-slow" />
            <span>Try Again</span>
          </button>

          {/* Go Home button */}
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-200/80 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-medium rounded-full border border-zinc-300/30 transition-all text-sm cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
