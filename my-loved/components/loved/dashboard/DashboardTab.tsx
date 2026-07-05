"use client";

import React from "react";
import CoupleCard from "@/components/loved/dashboard/CoupleCard";
import LoveBoard from "@/components/loved/journal/LoveBoard";
import MainCounter from "@/components/loved/dashboard/MainCounter";
import QuoteCard from "@/components/loved/dashboard/QuoteCard";
import TimelineCard from "@/components/loved/dashboard/TimelineCard";

interface DashboardTabProps {
  loved: any;
  currentTheme: any;
}

export default function DashboardTab({ loved, currentTheme }: DashboardTabProps) {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 gap-8 mt-4 lg:mb-6 lg:min-h-0 items-stretch">
      <div className="flex flex-col gap-8 lg:h-full lg:min-h-0">
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
          onEditComment={loved.handleEditJournalComment}
          personAName={loved.personAName}
          personBName={loved.personBName}
          personAAvatar={loved.personAAvatar}
          personBAvatar={loved.personBAvatar}
          cardBg={currentTheme.cardBg}
          borderColor={currentTheme.borderColor}
          triggerStreakCelebration={loved.triggerStreakCelebration}
          lastActiveStreak={loved.lastActiveStreak}
          recoveriesUsed={loved.recoveriesUsed}
          recoveredDates={loved.recoveredDates}
          onRecoverStreak={loved.handleRecoverStreak}
        />
      </div>

      <div className="flex flex-col gap-8 lg:col-span-2 lg:h-full lg:min-h-0">
        <MainCounter
          timeLeft={loved.timeLeft}
          anniversaryDate={loved.anniversaryDate}
          cardBg={currentTheme.cardBg}
          borderColor={currentTheme.borderColor}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-rows-1 gap-8 w-full lg:flex-1 lg:min-h-0">
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
  );
}
