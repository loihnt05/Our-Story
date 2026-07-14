"use client";

import React from "react";
import {
  Heart,
  Settings,
  Sparkles,
  VolumeX,
  Volume2,
  Music,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@/components/loved/core/AuthProvider";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/animate-ui/components/animate/tooltip";

interface SidebarContentProps {
  customTitle: string;
  navItems: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
  }>;
  onTabChange?: (href: string) => void;
  onOpenSettings: () => void;
  onTogglePlay: () => void;
  isMuted: boolean;
  theme: string | undefined;
  toggleTheme: () => void;
  setIsMobileOpen: (open: boolean) => void;
  isMobileView?: boolean;
}

export default function SidebarContent({
  customTitle,
  navItems,
  onTabChange,
  onOpenSettings,
  onTogglePlay,
  isMuted,
  theme,
  toggleTheme,
  setIsMobileOpen,
  isMobileView = false,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex flex-col gap-8">
        {/* Brand header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center animate-pulse shrink-0">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <span className="text-2xl font-cursive font-bold text-zinc-955 dark:text-white bg-clip-text bg-gradient-to-r from-zinc-955 to-zinc-700 dark:from-white dark:to-zinc-300">
              {customTitle || "Our Story"}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase mt-1 pl-1">
            Anniversary & Journey
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-2 mb-1">
            Navigation
          </span>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (onTabChange) {
                  e.preventDefault();
                  onTabChange(item.href);
                }
                if (isMobileView) setIsMobileOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                item.isActive
                  ? "bg-gradient-to-r from-rose-500/10 to-pink-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <item.icon className={`w-4 h-4 ${item.isActive ? "text-rose-500" : ""}`} />
              <span>{item.name}</span>
            </Link>
          ))}

        </nav>

        {/* Cute Sparkly Card */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-rose-500/5 via-pink-500/0 to-amber-500/5 border border-rose-200/10 dark:border-rose-900/10 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-1 right-1 w-10 h-10 opacity-10 text-rose-500 pointer-events-none rotate-12">
            <Sparkles className="w-full h-full" />
          </div>
          <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <span>Daily Spark</span>
            <span>💖</span>
          </span>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            "We are matched in our hearts, sharing emotions everyday. Keep updating your logs!"
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-6 border-t border-zinc-200/10 dark:border-zinc-800/10">
        {/* Quick controls (Theme & Music) */}
        <div className="flex items-center gap-3 justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
            Quick Actions
          </span>
          <div className="flex items-center gap-2">
            {/* Customize Space */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    if (isMobileView) setIsMobileOpen(false);
                    onOpenSettings();
                  }}
                  className="p-2.5 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
                >
                  <Settings className="w-4.5 h-4.5 text-rose-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Customize Space</TooltipContent>
            </Tooltip>

            {/* Music Player */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onTogglePlay}
                  className="p-2.5 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4.5 h-4.5 text-rose-500" />
                  ) : (
                    <div className="relative">
                      <Volume2 className="w-4.5 h-4.5 text-rose-500" />
                      <Music className="w-2.5 h-2.5 text-rose-500 absolute -top-1 -right-1 animate-bounce" />
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isMuted ? "Play Ambient Music" : "Mute Music"}
              </TooltipContent>
            </Tooltip>

            {/* Dark Mode */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500/20" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Profile Details and custom Logout button */}
        <div className="p-3 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              My Profile
            </span>
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">
              Signed in
            </span>
          </div>
          <div className="shrink-0">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
