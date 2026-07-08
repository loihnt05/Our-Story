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
  Bell
} from "lucide-react";
import { UserButton } from "@/components/loved/core/AuthProvider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/animate-ui/components/animate/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/animate-ui/components/radix/popover";
import SidebarContent from "./SidebarContent";
import NotificationDropdown, { getNotifications } from "./NotificationDropdown";

interface HeaderProps {
  customTitle: string;
  isMuted: boolean;
  onTogglePlay: () => void;
  onOpenSettings: () => void;
  onTabChange?: (href: string) => void;
  activeTabHref?: string;
  loved?: any;
  onTriggerMemoryReminder?: (milestone: any) => void;
}

export default function Header({
  customTitle,
  isMuted,
  onTogglePlay,
  onOpenSettings,
  onTabChange,
  activeTabHref,
  loved,
  onTriggerMemoryReminder
}: HeaderProps) {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopNotifyOpen, setIsDesktopNotifyOpen] = useState(false);
  const [isMobileNotifyOpen, setIsMobileNotifyOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentPath = activeTabHref || pathname;
  const navItems = [
    { 
      name: "Dashboard", 
      href: "/number-loved", 
      icon: LayoutDashboard,
      isActive: currentPath === "/number-loved"
    },
    { 
      name: "Memory Lane", 
      href: "/timeline", 
      icon: Calendar,
      isActive: currentPath === "/timeline"
    },
    { 
      name: "Stats Dashboard", 
      href: "/relationship-dashboard", 
      icon: Heart,
      isActive: currentPath === "/relationship-dashboard"
    },
    { 
      name: "Love Quiz", 
      href: "/quiz", 
      icon: Heart, // Replaced Sparkles with Heart since Sparkles was unused
      isActive: currentPath === "/quiz"
    },
  ];

  if (!mounted) return null;

  const notifications = getNotifications(loved, onTabChange, onTriggerMemoryReminder);

  return (
    <>
      {/* STICKY TOP NAVIGATION BAR (Horizontal bar on both desktop & mobile) */}
      <header className="sticky top-0 w-full z-40 border-b border-white/10 dark:border-zinc-900/20 bg-white/20 dark:bg-zinc-950/20 backdrop-blur-md select-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Left: Branding */}
          <Link 
            href="/number-loved" 
            onClick={(e) => {
              if (onTabChange) {
                e.preventDefault();
                onTabChange("/number-loved");
              }
            }}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-rose-500/15 flex items-center justify-center animate-pulse shrink-0">
              <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
            </div>
            <span className="text-xl font-cursive font-bold text-zinc-955 dark:text-white truncate max-w-[160px] sm:max-w-none">
              {customTitle || "Our Story"}
            </span>
          </Link>

          {/* Middle: Horizontal Nav items for desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/30 dark:bg-zinc-900/20 p-1 rounded-full border border-zinc-200/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (onTabChange) {
                    e.preventDefault();
                    onTabChange(item.href);
                  }
                }}
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
              {/* Notification Center Popover */}
              <Popover open={isDesktopNotifyOpen} onOpenChange={setIsDesktopNotifyOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button
                        className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer relative"
                      >
                        <Bell className="w-4 h-4 text-rose-500" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white animate-pulse">
                            {notifications.length}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-80 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/50 dark:border-zinc-850/50 backdrop-blur-xl rounded-2xl shadow-xl p-4"
                >
                  <NotificationDropdown
                    loved={loved}
                    onTabChange={onTabChange}
                    onTriggerMemoryReminder={onTriggerMemoryReminder}
                    onClose={() => setIsDesktopNotifyOpen(false)}
                  />
                </PopoverContent>
              </Popover>

              {/* Music Player */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onTogglePlay}
                    className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
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
                </TooltipTrigger>
                <TooltipContent>
                  {isMuted ? "Play Ambient Music" : "Mute Music"}
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Toggle Theme</TooltipContent>
              </Tooltip>
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

          {/* Mobile hamburger menu toggle & Notification */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Bell button for mobile */}
            <Popover open={isMobileNotifyOpen} onOpenChange={setIsMobileNotifyOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer relative"
                    >
                      <Bell className="w-4.5 h-4.5 text-rose-500" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white animate-pulse">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/50 dark:border-zinc-850/50 backdrop-blur-xl rounded-2xl shadow-xl p-4"
              >
                <NotificationDropdown
                  loved={loved}
                  onTabChange={onTabChange}
                  onTriggerMemoryReminder={onTriggerMemoryReminder}
                  onClose={() => setIsMobileNotifyOpen(false)}
                />
              </PopoverContent>
            </Popover>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
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

            <SidebarContent
              customTitle={customTitle}
              navItems={navItems}
              onTabChange={onTabChange}
              onOpenSettings={onOpenSettings}
              onTogglePlay={onTogglePlay}
              isMuted={isMuted}
              theme={theme}
              toggleTheme={toggleTheme}
              setIsMobileOpen={setIsMobileOpen}
              isMobileView={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
