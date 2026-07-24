import React from "react";
import Link from "next/link";
import { Lock, Heart, UserCheck } from "lucide-react";
import { SignInButton } from "@/components/loved/core/AuthProvider";

interface AccessDeniedProps {
  gradient: string;
}

export default function AccessDenied({ gradient }: AccessDeniedProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${gradient} p-6 relative overflow-hidden text-center`}>
      {/* Background Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-20">
        <div className="absolute top-10 left-10 text-rose-300 animate-bounce" style={{ animationDuration: "3s" }}>
          <Heart className="w-8 h-8 fill-rose-300" />
        </div>
        <div className="absolute bottom-20 right-20 text-rose-300 animate-bounce" style={{ animationDuration: "5s" }}>
          <Heart className="w-6 h-6 fill-rose-300" />
        </div>
      </div>

      <div className="relative max-w-md w-full p-8 rounded-3xl bg-white/40 dark:bg-black/35 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center gap-6 animate-scale-up">
        {/* Glowing lock badge */}
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 animate-pulse relative">
          <Lock className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
          </span>
        </div>

        <h1 className="text-3xl font-bold font-serif text-zinc-950 dark:text-white">
          Choose Account to Enter 🔒
        </h1>

        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-sans">
          Select a test partner account to sign in and enter your shared relationship space:
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
          {/* Sign in as Romeo */}
          <SignInButton account="romeo">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer text-sm flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>Sign In as Romeo 🤵‍♂️ (romeo@verona.it)</span>
            </button>
          </SignInButton>

          {/* Sign in as Juliet */}
          <SignInButton account="juliet">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-105 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer text-sm flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>Sign In as Juliet 👰‍♀️ (juliet@verona.it)</span>
            </button>
          </SignInButton>

          <Link
            href="/"
            className="w-full py-2.5 bg-white/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/70 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 font-medium rounded-full text-xs transition-colors cursor-pointer mt-1"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
