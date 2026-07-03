import React, { useEffect, useState } from "react";
import { Heart, VolumeX, Volume2, Music, Settings, Sun, Moon } from "lucide-react";
import { UserButton } from "./AuthProvider";
import { useTheme } from "next-themes";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="relative w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center animate-pulse">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        </div>
        <span className="text-2xl font-cursive font-bold text-zinc-950 dark:text-white bg-clip-text bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300">
          {customTitle || "Our Story"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Audio toggle button */}
        <button
          onClick={onTogglePlay}
          className="p-3 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
          title={isMuted ? "Play Ambient Music" : "Mute Music"}
        >
          {isMuted ? (
            <div className="relative">
              <VolumeX className="w-5 h-5 text-rose-500" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>
          ) : (
            <div className="relative">
              <Volume2 className="w-5 h-5 text-rose-500 animate-pulse" />
              <Music className="w-3 h-3 text-rose-500 absolute -top-1 -right-1.5 animate-bounce" />
            </div>
          )}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
          title="Configuration"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile / Logout Button */}
        <div className="flex items-center justify-center p-1 bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm rounded-full">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
