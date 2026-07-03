"use client";

import React from "react";
import WelcomeScreen from "./loved/WelcomeScreen";
import Header from "./loved/Header";
import CoupleCard from "./loved/CoupleCard";
import LoveBoard from "./loved/LoveBoard";
import MainCounter from "./loved/MainCounter";
import QuoteCard from "./loved/QuoteCard";
import TimelineCard from "./loved/TimelineCard";
import SettingsModal from "./loved/SettingsModal";
import { useLoveStory } from "./loved/useLoveStory";
import { THEMES, ROMANTIC_QUOTES } from "./loved/constants";

export default function LoveCounter() {
  const loved = useLoveStory();

  if (!loved.mounted) return null;

  const currentTheme = THEMES.find((t) => t.id === loved.themeId) || THEMES[0];

  if (loved.showIntro) {
    return (
      <WelcomeScreen
        onEnter={() => {
          loved.setShowIntro(false);
          if (loved.synthRef.current) {
            loved.synthRef.current.start();
            loved.setIsMuted(false);
          }
        }}
        gradient={currentTheme.gradient}
        floatingHearts={loved.floatingBgHearts}
        customTitle={loved.customTitle}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${currentTheme.gradient} text-zinc-800 dark:text-zinc-100 transition-colors duration-500 relative overflow-x-hidden pb-16`}>
      {/* Background drifting hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {loved.floatingBgHearts.map((heart) => (
          <svg
            key={heart.id}
            className="absolute text-rose-400/15 dark:text-rose-500/8 animate-float"
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

      <Header
        customTitle={loved.customTitle}
        isMuted={loved.isMuted}
        onTogglePlay={loved.togglePlay}
        onOpenSettings={() => loved.setShowSettings(true)}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 mt-4 items-start">
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
