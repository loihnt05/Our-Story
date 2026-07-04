"use client";

import React, { useEffect, useState } from "react";
import { 
  Heart, 
  VolumeX, 
  Volume2, 
  Music, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LayoutDashboard, 
  Calendar, 
  Sparkles 
} from "lucide-react";
import { UserButton } from "@/components/loved/core/AuthProvider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  customTitle: string;
  isMuted: boolean;
  onTogglePlay: () => void;
  onOpenSettings: () => void;
}

export default function Header({
  customTitle,
  isMuted,
  onTogglePlay,
  onOpenSettings
}: HeaderProps) {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { 
      name: "Dashboard", 
      href: "/number-loved", 
      icon: LayoutDashboard,
      isActive: pathname === "/number-loved"
    },
    { 
      name: "Memory Lane", 
      href: "/timeline", 
      icon: Calendar,
      isActive: pathname === "/timeline"
    },
  ];

  if (!mounted) return null;

  // SidebarContent is used exclusively inside the mobile drawer slide-over panel
  const SidebarContent = ({ isMobileView = false }: { isMobileView?: boolean }) => (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex flex-col gap-8">
        {/* Brand header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center animate-pulse shrink-0">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <span className="text-2xl font-cursive font-bold text-zinc-950 dark:text-white bg-clip-text bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300">
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
              onClick={() => isMobileView && setIsMobileOpen(false)}
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

          {/* Action Trigger for Settings Modal */}
          <button
            onClick={() => {
              if (isMobileView) setIsMobileOpen(false);
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all border border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer text-left font-sans"
          >
            <Settings className="w-4 h-4" />
            <span>Customize Space</span>
          </button>
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
            {/* Music Player */}
            <button
              onClick={onTogglePlay}
              className="p-2.5 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
              title={isMuted ? "Play Ambient Music" : "Mute Music"}
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

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500/20" />
              )}
            </button>
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

  return (
    <>
      {/* STICKY TOP NAVIGATION BAR (Horizontal bar on both desktop & mobile) */}
      <header className="sticky top-0 w-full z-40 border-b border-white/10 dark:border-zinc-900/20 bg-white/20 dark:bg-zinc-950/20 backdrop-blur-md select-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Left: Branding */}
          <Link href="/number-loved" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-rose-500/15 flex items-center justify-center animate-pulse shrink-0">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
            </div>
            <span className="text-xl font-cursive font-bold text-zinc-950 dark:text-white truncate max-w-[160px] sm:max-w-none">
              {customTitle || "Our Story"}
            </span>
          </Link>

          {/* Middle: Horizontal Nav items for desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/30 dark:bg-zinc-900/20 p-1 rounded-full border border-zinc-200/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  item.isActive
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-rose-600 dark:text-rose-400 border-zinc-200/10"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${item.isActive ? "text-rose-500" : ""}`} />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Customize space trigger */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </nav>

          {/* Right: Desktop Controls & Profile */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Music Player */}
              <button
                onClick={onTogglePlay}
                className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
                title={isMuted ? "Play Ambient Music" : "Mute Music"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <div className="relative">
                    <Volume2 className="w-4 h-4 text-rose-500" />
                    <Music className="w-2.5 h-2.5 text-rose-500 absolute -top-0.5 -right-0.5 animate-bounce" />
                  </div>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
                title="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                )}
              </button>
            </div>

            <div className="w-[1px] h-6 bg-zinc-200/20 dark:bg-zinc-800/20" />

            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  Connected
                </span>
                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                  Together
                </span>
              </div>
              <div className="shrink-0">
                <UserButton />
              </div>
            </div>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* Overlay backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white/90 dark:bg-zinc-950/95 border-r border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl p-6 flex flex-col justify-between z-10 transition-transform duration-300 animate-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <SidebarContent isMobileView={true} />
          </div>
        </div>
      )}
    </>
  );
}
