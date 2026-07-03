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
    </div>
  );
}
