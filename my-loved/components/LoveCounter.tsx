"use client";

import React from "react";
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
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${currentTheme.gradient} text-zinc-800 dark:text-zinc-100 transition-colors duration-500 relative overflow-x-hidden pb-16`}>
      {/* Theme Animated Background */}
      <ThemeBackground 
        bgType={currentTheme.bgType} 
        floatingHearts={loved.floatingBgHearts} 
        particleColors={currentTheme.particleColors} 
      />

      <div className="relative z-10 flex flex-col w-full flex-1">
        <Header
          customTitle={loved.customTitle}
          isMuted={loved.isMuted}
          onTogglePlay={loved.togglePlay}
          onOpenSettings={() => loved.setShowSettings(true)}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 items-start">
          <div className="flex flex-col gap-8 h-full">
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
              notes={loved.notes}
              newNoteText={loved.newNoteText}
              setNewNoteText={loved.setNewNoteText}
              newNoteAuthor={loved.newNoteAuthor}
              setNewNoteAuthor={loved.setNewNoteAuthor}
              newNoteColor={loved.newNoteColor}
              setNewNoteColor={loved.setNewNoteColor}
              onAddNote={loved.handleAddNote}
              onRemoveNote={loved.handleRemoveNote}
              cardBg={currentTheme.cardBg}
              borderColor={currentTheme.borderColor}
            />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-2">
            <MainCounter
              timeLeft={loved.timeLeft}
              anniversaryDate={loved.anniversaryDate}
              cardBg={currentTheme.cardBg}
              borderColor={currentTheme.borderColor}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
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
    </div>
  );
}
