"use client";

import React from "react";
import { Flame } from "lucide-react";
import Header from "./loved/Header";
import CoupleCard from "./loved/CoupleCard";
import LoveBoard from "./loved/LoveBoard";
import MainCounter from "./loved/MainCounter";
import QuoteCard from "./loved/QuoteCard";
import TimelineCard from "./loved/TimelineCard";
import SettingsModal from "./loved/SettingsModal";
import { useLoveStory } from "./loved/useLoveStory";
import { THEMES, ROMANTIC_QUOTES } from "./loved/constants";
import { useAuth } from "@/components/loved/AuthProvider";
import AccessDenied from "./loved/AccessDenied";
import ThemeBackground from "./loved/ThemeBackground";
import { useTheme } from "next-themes";

export default function LoveCounter() {
  const loved = useLoveStory();
  const { isSignedIn } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  // Invite connection parameters state
  const [partnerInviteName, setPartnerInviteName] = React.useState<string | null>(null);
  const [partnerNameInput, setPartnerNameInput] = React.useState("Juliet");
  const [partnerDesc, setPartnerDesc] = React.useState("My Anchor ⚓");
  const [partnerAvatar, setPartnerAvatar] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const inviteVal = params.get("invite");
      if (inviteVal) {
        setPartnerInviteName(inviteVal);
      }
    }
  }, []);

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

  const prevThemeIdRef = React.useRef(loved.themeId);
  const prevResolvedThemeRef = React.useRef(resolvedTheme);

  const currentTheme = THEMES.find((t) => t.id === loved.themeId) || THEMES[0];

  // Keep next-themes and custom visual themes synced
  React.useEffect(() => {
    // 1. If visual theme (themeId) changed
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

    // 2. If next-themes (resolvedTheme) changed
    if (prevResolvedThemeRef.current !== resolvedTheme && resolvedTheme) {
      const currentThemeObj = THEMES.find((t) => t.id === loved.themeId);
      const isCurrentlyDark = currentThemeObj?.isDark ?? false;
      const expectedIsDark = resolvedTheme === "dark";

      if (isCurrentlyDark !== expectedIsDark) {
        const matchingTheme = expectedIsDark 
          ? "starry-galaxy"  // Default dark theme
          : "rose-gold";     // Default light theme
        
        loved.setThemeId(matchingTheme);
        prevThemeIdRef.current = matchingTheme;
      }
      prevResolvedThemeRef.current = resolvedTheme;
    }
  }, [loved.themeId, resolvedTheme, loved.setThemeId, setTheme]);

  if (!loved.mounted) return null;

  // Protect route if not logged in
  if (!isSignedIn) {
    return <AccessDenied gradient={currentTheme.gradient} />;
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
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 lg:mb-6 lg:min-h-0 items-stretch">
          
          <div className="flex flex-col gap-8 h-full lg:min-h-0">
            <CoupleCard
              personAName={loved.personAName}
              personADesc={loved.personADesc}
              personAAvatar={loved.personAAvatar}
              personBName={loved.personBName}
              personBDesc={loved.personBDesc}
              personBAvatar={loved.personBAvatar}
              heartColor={currentTheme.heartColor}
              borderColor={currentTheme.borderColor}
              cardBg={currentTheme.cardBg}
              burstHearts={loved.burstHearts}
              onHeartClick={loved.triggerHeartBurst}
            />

            <LoveBoard
              journalEntries={loved.journalEntries}
              activePartner={loved.activePartner}
              setActivePartner={loved.setActivePartner}
              streakInfo={loved.streakInfo}
              onAddEntry={loved.handleAddJournalEntry}
              onAddComment={loved.handleAddJournalComment}
              onRemoveEntry={loved.handleRemoveJournalEntry}
              onRemoveComment={loved.handleRemoveJournalComment}
              personAName={loved.personAName}
              personBName={loved.personBName}
              personAAvatar={loved.personAAvatar}
              personBAvatar={loved.personBAvatar}
              cardBg={currentTheme.cardBg}
              borderColor={currentTheme.borderColor}
              triggerStreakCelebration={loved.triggerStreakCelebration}
            />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-2 lg:h-full lg:min-h-0">
            <MainCounter
              timeLeft={loved.timeLeft}
              anniversaryDate={loved.anniversaryDate}
              cardBg={currentTheme.cardBg}
              borderColor={currentTheme.borderColor}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full lg:flex-1 lg:min-h-0">

              <QuoteCard
                quoteIndex={loved.quoteIndex}
                setQuoteIndex={loved.setQuoteIndex}
                cardBg={currentTheme.cardBg}
                borderColor={currentTheme.borderColor}
              />

              <TimelineCard
                milestones={loved.milestones}
                cardBg={currentTheme.cardBg}
                borderColor={currentTheme.borderColor}
              />
            </div>
          </div>
        </main>
      </div>

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
              <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-white">
                You're Invited!
              </h2>
              <p className="text-xs text-zinc-500 leading-normal max-w-xs mt-1">
                <strong>{partnerInviteName}</strong> has invited you to connect their anniversary space! Enter your profile details below to connect.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">My Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={partnerNameInput}
                  onChange={(e) => setPartnerNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. My Anchor ⚓"
                  value={partnerDesc}
                  onChange={(e) => setPartnerDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">My Avatar Image</label>
                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-bold text-zinc-400 cursor-pointer p-2.5 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-950 flex-1 text-center font-sans font-semibold">
                    {partnerAvatar ? "Change Photo Slot" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePartnerImageUpload}
                      className="hidden"
                    />
                  </label>
                  {partnerAvatar && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200">
                      <img src={partnerAvatar} alt="Partner avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleConnectPartner}
              disabled={!partnerNameInput}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 disabled:opacity-40 text-white font-semibold rounded-full shadow-md transition-all cursor-pointer text-sm font-sans flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Accept Invitation & Connect 💖</span>
            </button>
          </div>
        </div>
      )}

      {/* Streak Celebration Overlay */}
      {loved.showCelebration && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in pointer-events-none select-none">
          {/* Confetti raining hearts */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 2;
              const duration = Math.random() * 2 + 2;
              const size = Math.random() * 24 + 12;
              const colors = ["text-rose-500", "text-pink-500", "text-amber-500", "text-red-500", "text-yellow-400"];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              return (
                <svg
                  key={i}
                  className={`absolute ${randomColor} animate-float`}
                  style={{
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    bottom: `-50px`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                  }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              );
            })}
          </div>

          {/* Floating Sparkles and Flame Card */}
          <div className="flex flex-col items-center gap-4 text-center z-10 px-8 py-8 rounded-3xl bg-white/10 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-2xl backdrop-blur-xl animate-scale-up pointer-events-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-ping" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center border-4 border-amber-300 shadow-lg relative">
                <Flame className="w-12 h-12 text-white fill-current animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400 font-serif drop-shadow-md">
              Streak Activated! 🔥
            </h1>
            <p className="text-xl font-bold text-white max-w-sm">
              {loved.streakInfo.count} Days of Love & Sharing
            </p>
            <p className="text-xs text-zinc-300 dark:text-zinc-400 leading-normal max-w-xs mt-1">
              You and your partner are perfectly in sync today! Keep sharing your feelings and commenting every day. 💕
            </p>
            <button
              onClick={() => loved.setShowCelebration(false)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-110 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 cursor-pointer mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

