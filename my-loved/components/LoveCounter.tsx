"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/loved/core/Header";
import SettingsModal from "@/components/loved/settings/SettingsModal";
import { useLoveStory } from "@/components/loved/core/useLoveStory";
import { THEMES } from "@/components/loved/core/constants";
import { useAuth } from "@/components/loved/core/AuthProvider";
import AccessDenied from "@/components/loved/core/AccessDenied";
import ThemeBackground from "@/components/loved/core/ThemeBackground";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

// Import modular tab components
import DashboardTab from "@/components/loved/dashboard/DashboardTab";
import TimelineTab from "@/components/loved/timeline/TimelineTab";
import StatsTab from "@/components/loved/stats/StatsTab";
import QuizTab from "@/components/loved/quiz/QuizTab";
import SurpriseTakeover from "@/components/loved/surprise/SurpriseTakeover";
import OnboardingWizard from "@/components/loved/core/OnboardingWizard";
import { X, BookHeart } from "lucide-react";
import TimelineMemoryReminder from "@/components/loved/timeline/TimelineMemoryReminder";

interface LoveCounterProps {
  initialTabHref?: string;
}

export default function LoveCounter({ initialTabHref }: LoveCounterProps) {
  const loved = useLoveStory();
  const { isSignedIn } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  // Active SPA Tab state
  const [activeTabHref, setActiveTabHref] = useState(pathname || initialTabHref || "/number-loved");

  // Memory reminder states
  const [activeMemoryMilestone, setActiveMemoryMilestone] = useState<any | null>(null);
  const [showMemoryReminder, setShowMemoryReminder] = useState(false);

  // Sync state with next/navigation URL changes
  useEffect(() => {
    if (pathname) {
      setActiveTabHref(pathname);
    }
  }, [pathname]);

  // Invite parameters state
  const [partnerInviteName, setPartnerInviteName] = useState<string | null>(null);
  const [partnerNameInput, setPartnerNameInput] = useState("Juliet");
  const [partnerDesc, setPartnerDesc] = useState("My Anchor ⚓");
  const [partnerAvatar, setPartnerAvatar] = useState("");

  // Celebration hearts
  const [celebrationHearts, setCelebrationHearts] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number; color: string }>>([]);

  // Onboarding state
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  // Check onboarding status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("loved_onboarding_completed") === "true";
      setOnboardingCompleted(completed);
    }
  }, []);

  // LERP Scroll position state (for timeline tab)
  const [offsetY, setOffsetY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  // Load configuration and data on mount
  useEffect(() => {
    // Read invite params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const inviteVal = params.get("invite");
      if (inviteVal) {
        setPartnerInviteName(inviteVal);
      }

      // 1. First-time ever load trigger check
      const viewedGeneral = localStorage.getItem("loved_anniversary_surprise_viewed") === "true";
      if (!viewedGeneral) {
        setShowSurprise(true);
      } else {
        // 2. Check if today is a dynamic milestone (years of relationship or multiple of 100 days)
        const anni = localStorage.getItem("loved_anniversary") || localStorage.getItem("loved_anniversaryDate") || "2025-01-01";
        try {
          const start = new Date(anni);
          const now = new Date();
          const diff = now.getTime() - start.getTime();
          const days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));

          const isMultipleOf100 = days % 100 === 0;
          const isYearAnniversary = days % 365 === 0;

          if (isMultipleOf100 || isYearAnniversary) {
            const milestoneKey = "days_" + days;
            const viewedMilestonesStr = localStorage.getItem("loved_surprise_milestones_viewed") || "[]";
            const viewedMilestones = JSON.parse(viewedMilestonesStr);
            
            if (!viewedMilestones.includes(milestoneKey)) {
              setShowSurprise(true);
              localStorage.setItem("loved_current_surprise_milestone", milestoneKey);
            }
          }

          // 3. Check if today is the anniversary of any milestone in the timeline (Proposal, Engagement, Wedding, Custom)
          const today = new Date();
          const milestonesStr = localStorage.getItem("loved_milestones");
          if (milestonesStr) {
            const milestones = JSON.parse(milestonesStr);
            const matchingMilestone = milestones.find((m: any) => {
              if (!m.date) return false;
              const mDate = new Date(m.date);
              return (
                mDate.getMonth() === today.getMonth() &&
                mDate.getDate() === today.getDate() &&
                today.getFullYear() > mDate.getFullYear()
              );
            });

            if (matchingMilestone) {
              const reminderKey = `loved_memory_reminded_${matchingMilestone.id}_${today.getFullYear()}`;
              const alreadyViewed = localStorage.getItem(reminderKey) === "true";
              
              setActiveMemoryMilestone(matchingMilestone);
              if (!alreadyViewed) {
                setShowMemoryReminder(true);
              }
            }
          }
        } catch (err) {
          console.error("Anniversary milestone check error:", err);
        }
      }
    }
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll LERP loop for Timeline sticky column
  useEffect(() => {
    let currentY = 0;
    let targetY = 0;
    let rAFId: number;

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        targetY = scrollContainerRef.current.scrollTop;
      }
    };

    const updatePosition = () => {
      currentY += (targetY - currentY) * 0.035;
      const diff = targetY - currentY;
      const clampedDiff = Math.max(-120, Math.min(120, diff));
      
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        setOffsetY(clampedDiff);
      } else {
        setOffsetY(0);
      }
      
      rAFId = requestAnimationFrame(updatePosition);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    rAFId = requestAnimationFrame(updatePosition);

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      cancelAnimationFrame(rAFId);
    };
  }, [activeTabHref]);

  // Handle window resizing to toggle desktop view state
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Handle streak celebration heart bursts
  useEffect(() => {
    if (loved.showCelebration) {
      const colors = ["text-rose-500", "text-pink-500", "text-amber-500", "text-red-500", "text-yellow-400"];
      const hearts = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 24 + 12,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setCelebrationHearts(hearts);
    }
  }, [loved.showCelebration]);

  const handlePartnerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPartnerAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConnectPartner = () => {
    localStorage.setItem("loved_personB", partnerNameInput);
    localStorage.setItem("loved_personB_desc", partnerDesc);
    if (partnerAvatar) {
      localStorage.setItem("loved_personB_avatar", partnerAvatar);
    }
    
    loved.setPersonBName(partnerNameInput);
    loved.setPersonBDesc(partnerDesc);
    if (partnerAvatar) {
      loved.setPersonBAvatar(partnerAvatar);
    }
    
    setPartnerInviteName(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // Sync theme
  const prevThemeIdRef = useRef(loved.themeId);
  const prevResolvedThemeRef = useRef(resolvedTheme);
  const currentTheme = THEMES.find((t) => t.id === loved.themeId) || THEMES[0];

  useEffect(() => {
    if (prevThemeIdRef.current !== loved.themeId) {
      const newThemeObj = THEMES.find((t) => t.id === loved.themeId);
      if (newThemeObj) {
        const expectedNextTheme = newThemeObj.isDark ? "dark" : "light";
        if (resolvedTheme !== expectedNextTheme) {
          setTheme(expectedNextTheme);
          prevResolvedThemeRef.current = expectedNextTheme;
        }
      }
      prevThemeIdRef.current = loved.themeId;
    }

    if (prevResolvedThemeRef.current !== resolvedTheme && resolvedTheme) {
      const currentThemeObj = THEMES.find((t) => t.id === loved.themeId);
      const isCurrentlyDark = currentThemeObj?.isDark ?? false;
      const expectedIsDark = resolvedTheme === "dark";

      if (isCurrentlyDark !== expectedIsDark) {
        const matchingTheme = expectedIsDark ? "starry-galaxy" : "rose-gold";
        loved.setThemeId(matchingTheme);
        prevThemeIdRef.current = matchingTheme;
      }
      prevResolvedThemeRef.current = resolvedTheme;
    }
  }, [loved.themeId, resolvedTheme, loved.setThemeId, setTheme]);

  // Tab switching handler with browser URL sync
  const handleTabChange = (href: string) => {
    setActiveTabHref(href);
    window.history.pushState(null, "", href);
  };

  if (!loved.mounted) return null;

  if (!isSignedIn) {
    return <AccessDenied gradient={currentTheme.gradient} />;
  }

  if (!onboardingCompleted) {
    return (
      <OnboardingWizard
        onComplete={() => {
          setOnboardingCompleted(true);
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-gradient-to-br ${currentTheme.gradient} text-zinc-800 dark:text-zinc-100 transition-colors duration-500 relative overflow-x-hidden lg:overflow-y-hidden pb-16 lg:pb-0`}>
      {/* Theme Animated Background */}
      <ThemeBackground 
        bgType={currentTheme.bgType} 
        floatingHearts={loved.floatingBgHearts} 
        particleColors={currentTheme.particleColors} 
      />

      <div className="relative z-10 flex flex-col w-full flex-1 lg:h-full lg:min-h-0">
        <Header
          customTitle={loved.customTitle}
          isMuted={loved.isMuted}
          onTogglePlay={loved.togglePlay}
          onOpenSettings={() => loved.setShowSettings(true)}
          onTabChange={handleTabChange}
          activeTabHref={activeTabHref}
        />

        {/* Timeline Memory Reminder Toast Banner */}
        {activeMemoryMilestone && (
          <div className="mx-6 md:mx-8 mt-2.5 animate-bounce z-40">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-500/80 to-pink-500/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg text-white">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowMemoryReminder(true)}>
                <span className="text-2xl">{activeMemoryMilestone.icon || "💖"}</span>
                <div className="text-left">
                  <h4 className="text-xs md:text-sm font-bold tracking-wide flex items-center gap-1.5">
                    <span>On This Day Memory! ⏳</span>
                  </h4>
                  <p className="text-[10px] md:text-xs text-white/90">
                    Today is the anniversary of <span className="font-semibold underline">"{activeMemoryMilestone.title}"</span>. Click to relive this memory.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const todayDate = new Date();
                  localStorage.setItem(`loved_memory_reminded_${activeMemoryMilestone.id}_${todayDate.getFullYear()}`, "true");
                  setActiveMemoryMilestone(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Unified Tab Area with Smooth Animation */}
        <div key={activeTabHref} ref={scrollContainerRef} className="animate-fade-in flex-1 overflow-y-auto lg:min-h-0 py-4 px-4 sm:px-6 md:px-8 scrollbar-hide">
          {activeTabHref === "/number-loved" && <DashboardTab loved={loved} currentTheme={currentTheme} />}
          {activeTabHref === "/timeline" && <TimelineTab loved={loved} currentTheme={currentTheme} offsetY={offsetY} isDesktop={isDesktop} />}
          {activeTabHref === "/relationship-dashboard" && <StatsTab loved={loved} currentTheme={currentTheme} />}
          {activeTabHref === "/quiz" && <QuizTab loved={loved} currentTheme={currentTheme} />}
        </div>
      </div>

      {/* Floating Surprise relive button */}
      {activeTabHref === "/number-loved" && (
        <button
          onClick={() => setShowSurprise(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-rose-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center animate-bounce group"
          title="Relive Anniversary Surprise 🎁"
        >
          <span className="text-xl">🎁</span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold font-sans whitespace-nowrap pl-0 group-hover:pl-2">
            Anniversary Surprise
          </span>
        </button>
      )}

      {/* Anniversary Takeover Surprise overlay */}
      {showSurprise && (
        <SurpriseTakeover
          loved={loved}
          currentTheme={currentTheme}
          onClose={() => setShowSurprise(false)}
          onNavigateToTab={(href) => handleTabChange(href)}
        />
      )}

      {/* Timeline Memory Reminder Overlay */}
      {showMemoryReminder && activeMemoryMilestone && (
        <TimelineMemoryReminder
          milestone={activeMemoryMilestone}
          loved={loved}
          onClose={() => setShowMemoryReminder(false)}
        />
      )}

      {loved.showSettings && (
        <SettingsModal
          anniversaryDate={loved.anniversaryDate}
          setAnniversaryDate={loved.setAnniversaryDate}
          customTitle={loved.customTitle}
          setCustomTitle={loved.setCustomTitle}
          themeId={loved.themeId}
          setThemeId={loved.setThemeId}
          personAName={loved.personAName}
          setPersonAName={loved.setPersonAName}
          personADesc={loved.personADesc}
          setPersonADesc={loved.setPersonADesc}
          personAAvatar={loved.personAAvatar}
          setPersonAAvatar={loved.setPersonAAvatar}
          personBName={loved.personBName}
          setPersonBName={loved.setPersonBName}
          personBDesc={loved.personBDesc}
          setPersonBDesc={loved.setPersonBDesc}
          personBAvatar={loved.personBAvatar}
          setPersonBAvatar={loved.setPersonBAvatar}
          onClose={() => loved.setShowSettings(false)}
        />
      )}

      {/* Invite Acceptance Modal */}
      {partnerInviteName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden animate-scale-up flex flex-col gap-5">
            <div className="text-center flex flex-col items-center gap-1.5 select-none">
              <span className="text-4xl animate-bounce">💖</span>
              <h2 className="text-xl font-serif text-zinc-900 dark:text-white">
                You&apos;re Invited!
              </h2>
              <p className="text-xs text-zinc-500 leading-normal max-w-xs mt-1 text-center font-sans">
                <strong>{partnerInviteName}</strong> has invited you to connect their anniversary space! Enter profile details below.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">My Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={partnerNameInput}
                  onChange={(e) => setPartnerNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-55 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. My Anchor ⚓"
                  value={partnerDesc}
                  onChange={(e) => setPartnerDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-55 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">My Avatar Image</label>
                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-bold text-zinc-400 cursor-pointer p-2.5 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-955 flex-1 text-center font-sans">
                    {partnerAvatar ? "Change Photo Slot" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePartnerImageUpload}
                      className="hidden"
                    />
                  </label>
                  {partnerAvatar && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                      <img src={partnerAvatar} alt="Partner avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleConnectPartner}
              disabled={!partnerNameInput}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 disabled:opacity-40 text-white font-semibold rounded-full shadow-md transition-all cursor-pointer text-sm font-sans flex items-center justify-center gap-1.5 mt-2 border-none"
            >
              Accept Invitation &amp; Connect 💖
            </button>
          </div>
        </div>
      )}

      {/* Streak Celebration Overlay */}
      {loved.showCelebration && (() => {
        const getCelebrationStyle = (count: number) => {
          if (count >= 500) {
            return {
              title: "Ultimate Streak Activated! 👑✨",
              gradient: "from-indigo-450 via-fuchsia-400 to-amber-300",
              flameBg: "from-indigo-600 via-purple-600 to-amber-500",
              borderColor: "border-amber-350 shadow-[0_0_20px_rgba(245,158,11,0.65)]",
              description: "You two are legendary! Over 500 days of pure devotion and beautiful memories. Absolute couple goals! 🌟💖"
            };
          }
          if (count >= 100) {
            return {
              title: "Epic Streak Activated! 💖🔥",
              gradient: "from-rose-450 via-pink-400 to-orange-400",
              flameBg: "from-rose-500 via-pink-500 to-orange-500",
              borderColor: "border-pink-350 shadow-[0_0_15px_rgba(244,63,94,0.55)]",
              description: "Incredible milestone! Over 100 days of connecting, sharing, and loving each other every single day. Keep burning bright! ✨"
            };
          }
          return {
            title: "Streak Activated! 🔥",
            gradient: "from-yellow-300 via-amber-400 to-rose-400",
            flameBg: "from-amber-500 to-rose-500",
            borderColor: "border-amber-300",
            description: "You and your partner are perfectly in sync today! Keep sharing your feelings and commenting every day. 💕"
          };
        };

        const celebStyle = getCelebrationStyle(loved.streakInfo.count);

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
              <h1 className={`text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${celebStyle.gradient} font-serif drop-shadow-md`}>
                {celebStyle.title}
              </h1>
              <p className="text-xl font-bold text-white max-w-sm animate-pulse">
                {loved.streakInfo.count} {loved.streakInfo.count === 1 ? "Day" : "Days"} of Love &amp; Sharing
              </p>
              <p className="text-xs text-zinc-355 max-w-xs leading-normal font-sans">
                {celebStyle.description}
              </p>
              <button
                onClick={() => loved.setShowCelebration(false)}
                className="mt-2 px-6 py-2 rounded-full bg-white hover:bg-zinc-100 text-rose-500 font-bold text-xs shadow-md transition-colors cursor-pointer border-none"
              >
                Awesome! 💖
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
