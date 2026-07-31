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
import GamesTab from "@/components/loved/games/GamesTab";
import SurpriseTakeover from "@/components/loved/surprise/SurpriseTakeover";
import OnboardingWizard from "@/components/loved/core/OnboardingWizard";
import { X } from "lucide-react";
import TimelineMemoryReminder from "@/components/loved/timeline/TimelineMemoryReminder";
import InviteAcceptanceModal from "@/components/loved/core/InviteAcceptanceModal";
import StreakCelebrationOverlay from "@/components/loved/core/StreakCelebrationOverlay";

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
  const [connectedPartner, setConnectedPartner] = useState<string | null>(null);
  const [inviteErrorMessage, setInviteErrorMessage] = useState<string | null>(null);

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
    // Read invite & connection params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const inviteVal = params.get("invite");
      if (inviteVal) {
        setPartnerInviteName(inviteVal);
      }

      const isConn = params.get("connected") === "true";
      const partnerNameParam = params.get("partner");
      if (isConn && partnerNameParam) {
        setConnectedPartner(partnerNameParam);
      }

      const inviteErr = params.get("invite_error");
      if (inviteErr) {
        if (inviteErr === "token_expired") {
          setInviteErrorMessage("This invitation link has expired (invitation tokens are valid for 24 hours). Please ask your partner to send a new invitation email.");
        } else if (inviteErr === "token_already_used") {
          setInviteErrorMessage("This single-use invitation token has already been redeemed to connect profiles.");
        } else if (inviteErr === "invalid_token") {
          setInviteErrorMessage("The invitation verification token is invalid or unrecognized.");
        } else {
          setInviteErrorMessage("Failed to process invitation verification. Please try again.");
        }
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
          loved={loved}
          onTriggerMemoryReminder={(milestone) => {
            setActiveMemoryMilestone(milestone);
            setShowMemoryReminder(true);
          }}
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
          {(activeTabHref === "/games" || activeTabHref === "/quiz" || activeTabHref === "/decision-wheel" || activeTabHref === "/memory-guess") && (
            <GamesTab loved={loved} currentTheme={currentTheme} />
          )}
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
        <InviteAcceptanceModal
          partnerInviteName={partnerInviteName}
          onConnect={(name, desc, avatar) => {
            localStorage.setItem("loved_personB", name);
            localStorage.setItem("loved_personB_desc", desc);
            if (avatar) {
              localStorage.setItem("loved_personB_avatar", avatar);
            }
            
            loved.setPersonBName(name);
            loved.setPersonBDesc(desc);
            if (avatar) {
              loved.setPersonBAvatar(avatar);
            }
            
            setPartnerInviteName(null);
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        />
      )}

      {/* Connected Partner Celebration Modal */}
      {connectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-rose-200 dark:border-zinc-800 p-6 text-center flex flex-col items-center gap-4 animate-scale-up shadow-2xl">
            <span className="text-5xl animate-bounce">🎉💖</span>
            <h2 className="text-2xl font-serif font-extrabold text-zinc-900 dark:text-white">
              Connection Successful!
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
              You are now officially connected with <span className="font-bold text-rose-500">{connectedPartner}</span>! Your shared countdown, daily feelings journal, milestones, and games are now synced together.
            </p>
            <button
              onClick={() => {
                setConnectedPartner(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer border-none"
            >
              Explore Our Shared Space 🚀
            </button>
          </div>
        </div>
      )}

      {/* Invitation Error Alert Modal */}
      {inviteErrorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 p-6 text-center flex flex-col items-center gap-4 animate-scale-up shadow-2xl">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-xl font-serif font-extrabold text-zinc-900 dark:text-white">
              Invitation Status
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
              {inviteErrorMessage}
            </p>
            <button
              onClick={() => {
                setInviteErrorMessage(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-90 transition-all cursor-pointer border-none"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Streak Celebration Overlay */}
      {loved.showCelebration && (
        <StreakCelebrationOverlay
          streakCount={loved.streakInfo.count}
          onClose={() => loved.setShowCelebration(false)}
        />
      )}
    </div>
  );
}
