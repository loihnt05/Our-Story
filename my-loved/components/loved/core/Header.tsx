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
  Sparkles,
  Bell,
  BookHeart,
  MessageCircle,
  Flame
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
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
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
      icon: Sparkles,
      isActive: currentPath === "/quiz"
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

  // Notification items calculation
  const notifications: Array<{
    id: string;
    type: "memory" | "anniversary" | "streak" | "notes" | "quiz";
    title: string;
    description: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onClick?: () => void;
  }> = [];

  const today = new Date();

  if (loved?.milestones) {
    // 1. Check for active memory reminder (On This Day)
    const activeMemory = loved.milestones.find((m: any) => {
      if (!m.date) return false;
      const mDate = new Date(m.date);
      return (
        mDate.getMonth() === today.getMonth() &&
        mDate.getDate() === today.getDate() &&
        today.getFullYear() > mDate.getFullYear()
      );
    });

    if (activeMemory) {
      const yearsAgo = today.getFullYear() - new Date(activeMemory.date).getFullYear();
      notifications.push({
        id: "memory-today",
        type: "memory",
        title: "On This Day Memory! ⏳",
        description: `Relive "${activeMemory.title}" from ${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago today.`,
        actionLabel: "Relive",
        onClick: () => {
          if (onTriggerMemoryReminder) {
            onTriggerMemoryReminder(activeMemory);
          }
        }
      });
    }

    // 2. Check for upcoming milestone anniversaries (in the next 7 days)
    loved.milestones.forEach((m: any) => {
      if (!m.date) return;
      const mDate = new Date(m.date);
      
      const nextAnni = new Date(today.getFullYear(), mDate.getMonth(), mDate.getDate());
      if (nextAnni < today) {
        nextAnni.setFullYear(today.getFullYear() + 1);
      }
      
      const diffTime = nextAnni.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && diffDays <= 7) {
        notifications.push({
          id: `upcoming-${m.id}`,
          type: "anniversary",
          title: "Upcoming Anniversary 📅",
          description: `"${m.title}" is in ${diffDays} ${diffDays === 1 ? "day" : "days"} (${mDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}).`,
          actionLabel: "View Timeline",
          onClick: () => {
            if (onTabChange) onTabChange("/timeline");
          }
        });
      }
    });
  }

  // 3. Streak notifications
  if (loved?.streakInfo?.currentStreak > 0) {
    notifications.push({
      id: "streak-active",
      type: "streak",
      title: "Love Streak Active! 🔥",
      description: `You are on a ${loved.streakInfo.currentStreak}-day journal streak. Keep it going!`,
      actionLabel: "Open Journal",
      onClick: () => {
        if (onTabChange) onTabChange("/number-loved");
      }
    });
  }

  // 4. Notes notifications
  if (loved?.notes?.length > 0) {
    notifications.push({
      id: "notes-alert",
      type: "notes",
      title: "Memory Notes Capsule 💌",
      description: `You have ${loved.notes.length} romantic notes stored in your memory lane.`,
      actionLabel: "Read Notes",
      onClick: () => {
        if (onTabChange) onTabChange("/timeline");
      }
    });
  }

  // 5. Quiz Reminder
  notifications.push({
    id: "quiz-challenge",
    type: "quiz",
    title: "Partner Quiz Challenge 🧩",
    description: "Take today's quiz to test your compatibility and learn more about each other.",
    actionLabel: "Play Quiz",
    onClick: () => {
      if (onTabChange) onTabChange("/quiz");
    }
  });

  const NotificationDropdown = () => (
    <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/50 dark:border-zinc-850/50 backdrop-blur-xl rounded-2xl shadow-xl p-4 z-50 flex flex-col gap-3.5 select-none text-zinc-800 dark:text-zinc-100 animate-scale-up max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-850/50 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Notifications</span>
        <span className="text-[10px] bg-rose-500/10 text-rose-500 font-bold px-2 py-0.5 rounded-full">
          {notifications.length} Active
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {notifications.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">✨</span>
            <p className="text-xs text-zinc-400 font-medium">All caught up! Keep sharing the love 💖</p>
          </div>
        ) : (
          notifications.map((n) => {
            let itemIcon = <Sparkles className="w-4 h-4 text-purple-500" />;
            if (n.type === "memory") itemIcon = <BookHeart className="w-4 h-4 text-rose-500" />;
            if (n.type === "anniversary") itemIcon = <Calendar className="w-4 h-4 text-blue-500" />;
            if (n.type === "streak") itemIcon = <Flame className="w-4 h-4 text-orange-500 animate-pulse" />;
            if (n.type === "notes") itemIcon = <MessageCircle className="w-4 h-4 text-amber-500" />;

            return (
              <div 
                key={n.id} 
                onClick={() => {
                  if (n.onClick) n.onClick();
                  setIsNotifyOpen(false);
                }}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-850/35 border border-transparent hover:border-zinc-200/30 dark:hover:border-zinc-800/20 cursor-pointer transition-all text-left"
              >
                <div className="mt-0.5 shrink-0">{itemIcon}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold leading-tight truncate">{n.title}</h5>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">{n.description}</p>
                  {n.actionLabel && (
                    <span className="text-[9px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest mt-1.5 inline-block hover:underline">
                      {n.actionLabel} &rarr;
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

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
              <div className="relative">
                <button
                  onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                  className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-rose-500" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {isNotifyOpen && <NotificationDropdown />}
              </div>

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

          {/* Mobile hamburger menu toggle & Notification */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Bell button for mobile */}
            <div className="relative">
              <button
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer relative"
              >
                <Bell className="w-4.5 h-4.5 text-rose-500" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isNotifyOpen && <NotificationDropdown />}
            </div>

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

            <SidebarContent isMobileView={true} />
          </div>
        </div>
      )}
    </>
  );
}
