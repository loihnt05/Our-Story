"use client";

import React, { useState } from "react";
import { 
  Flame, 
  Sparkles, 
  BookOpen
} from "lucide-react";
import { JournalEntry } from "@/components/loved/core/types";
import JournalForm from "@/components/loved/journal/JournalForm";
import JournalEntryCard from "@/components/loved/journal/JournalEntryCard";

interface LoveBoardProps {
  journalEntries: JournalEntry[];
  activePartner: "A" | "B";
  setActivePartner: (partner: "A" | "B") => void;
  streakInfo: { count: number; isCompletedToday: boolean };
  onAddEntry: (date: string, emotion: string, content: string) => void;
  onAddComment: (entryId: string, content: string) => void;
  onRemoveEntry: (entryId: string) => void;
  onRemoveComment: (entryId: string, commentId: string) => void;
  onEditComment: (entryId: string, commentId: string, content: string) => void;
  personAName: string;
  personBName: string;
  personAAvatar?: string;
  personBAvatar?: string;
  cardBg: string;
  borderColor: string;
  triggerStreakCelebration: () => void;
  lastActiveStreak: number;
  recoveriesUsed: number;
  recoveredDates: string[];
  onRecoverStreak: () => void;
}

export default function LoveBoard({
  journalEntries,
  activePartner,
  setActivePartner,
  streakInfo,
  onAddEntry,
  onAddComment,
  onRemoveEntry,
  onRemoveComment,
  onEditComment,
  personAName,
  personBName,
  personAAvatar,
  personBAvatar,
  cardBg,
  borderColor,
  triggerStreakCelebration,
  lastActiveStreak,
  recoveriesUsed,
  recoveredDates,
  onRecoverStreak
}: LoveBoardProps) {
  const [activeTab, setActiveTab] = useState<"mine" | "partner">("mine");

  const getMaxRecoveries = (streakCount: number) => {
    if (streakCount >= 500) return 5;
    if (streakCount >= 100) return 3;
    return 1;
  };

  const getStreakStyle = (count: number, isCompleted: boolean) => {
    if (count === 0) {
      return {
        bgClass: "bg-zinc-200 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 opacity-60 cursor-not-allowed border border-transparent",
        flameClass: "text-zinc-400 dark:text-zinc-500",
        tierName: "No Streak"
      };
    }
    if (count >= 500) {
      return {
        bgClass: isCompleted
          ? "bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-amber-400 text-white animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.6)] border border-yellow-300 cursor-pointer hover:scale-105"
          : "bg-gradient-to-r from-indigo-500/60 via-purple-500/60 via-pink-500/60 to-amber-400/60 text-white/80 border border-purple-500/30 cursor-default",
        flameClass: "text-amber-300 fill-current animate-bounce",
        tierName: "Ultimate"
      };
    }
    if (count >= 100) {
      return {
        bgClass: isCompleted
          ? "bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)] cursor-pointer hover:scale-105"
          : "bg-gradient-to-r from-rose-500/60 via-pink-500/60 to-orange-500/60 text-white/80 border border-rose-550/30 cursor-default",
        flameClass: "text-orange-300 fill-current animate-pulse",
        tierName: "Prominent"
      };
    }
    return {
      bgClass: isCompleted
        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white cursor-pointer hover:scale-105"
        : "bg-gradient-to-r from-amber-500/60 to-orange-500/60 text-white/80 border border-amber-550/30 cursor-default",
      flameClass: "text-orange-200 fill-current",
      tierName: "Basic"
    };
  };

  const streakStyle = getStreakStyle(streakInfo.count, streakInfo.isCompletedToday);

  const currentUserCode = activePartner;
  const partnerUserCode = activePartner === "A" ? "B" : "A";
  
  const currentUserName = activePartner === "A" ? personAName : personBName;
  const partnerName = activePartner === "A" ? personBName : personAName;
  
  const currentUserAvatar = activePartner === "A" ? personAAvatar : personBAvatar;

  // Helper to format Date to YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();

  // Helper to format Date to YYYY-MM-DD for yesterday
  const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, "0");
    const day = String(yesterday.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const yesterdayStr = getYesterdayDateString();

  // Filter entries to only show today and yesterday
  const myEntries = journalEntries.filter(
    (e) => e.author === currentUserCode && (e.date === todayStr || e.date === yesterdayStr)
  );
  
  const partnerEntries = journalEntries.filter(
    (e) => e.author === partnerUserCode && (e.date === todayStr || e.date === yesterdayStr)
  );

  const todayEntry = myEntries.find((e) => e.date === todayStr);

  const handlePostEntry = (emotion: string, content: string) => {
    onAddEntry(todayStr, emotion, content);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (dateStr === todayStr) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    if (dateStr === yesterdayStr) return "Yesterday";

    try {
      const parsed = new Date(dateStr);
      return parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`flex-1 min-h-0 p-6 rounded-[24px] ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 `}>
      
      {/* Header section with Flame Streak and Title */}
      <div className="flex items-center justify-between border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50">
        <h2 className="text-xl font-extrabold font-cursive flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-500" />
          <span>Daily Journey</span>
        </h2>

        {/* Streak Counter Widget */}
        <div className="flex items-center gap-2">
          {streakInfo.count > 0 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-zinc-150 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm shrink-0">
              Recoveries: {getMaxRecoveries(lastActiveStreak) - recoveriesUsed} left
            </span>
          )}

          <button
            onClick={() => {
              if (streakInfo.isCompletedToday) {
                triggerStreakCelebration();
              }
            }}
            disabled={!streakInfo.isCompletedToday}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm select-none group relative ${streakStyle.bgClass}`}
            title={
              streakInfo.isCompletedToday
                ? `Active ${streakStyle.tierName} Streak: ${streakInfo.count} Days! Click to celebrate! ✨`
                : streakInfo.count > 0
                ? `Streak of ${streakInfo.count} ${streakInfo.count === 1 ? "day" : "days"} (${streakStyle.tierName}) pending today's check-in! Share daily and comment to activate!`
                : "No streak yet. Share daily and comment on each other's posts to build a streak!"
            }
          >
            <Flame className={`w-4 h-4 ${streakStyle.flameClass}`} />
            <span>{streakInfo.count} {streakInfo.count === 1 ? "day" : "days"}</span>
            {streakInfo.isCompletedToday && (
              <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 text-yellow-300 animate-spin transition-opacity duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="grid grid-cols-2 bg-zinc-100/50 dark:bg-zinc-800/20 p-0.5 rounded-xl border border-zinc-200/20">
        <button
          onClick={() => setActiveTab("mine")}
          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "mine"
              ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          My Feelings
        </button>
        <button
          onClick={() => setActiveTab("partner")}
          className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "partner"
              ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <span>{partnerName}'s Journal</span>
          {partnerEntries.some(e => e.date === todayStr) && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>

      {/* Editor Form (rendered outside of the scrollable container) */}
      <div className="flex-1 h-full min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-4">
        {/* Streak Recovery Card */}
        {streakInfo.count === 0 && lastActiveStreak > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border border-red-500/20 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-500 shrink-0">
                <Flame className="w-5 h-5 text-red-400 dark:text-red-500" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Streak Lost! 💔</h4>
                <p className="text-xs text-zinc-605 dark:text-zinc-305 mt-0.5">
                  You lost your <strong className="text-red-500">{lastActiveStreak}</strong> day streak.
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-0.5">
                  Recoveries remaining: <strong>{getMaxRecoveries(lastActiveStreak) - recoveriesUsed}</strong> of {getMaxRecoveries(lastActiveStreak)}
                </p>
              </div>
            </div>
            
            {getMaxRecoveries(lastActiveStreak) - recoveriesUsed > 0 ? (
              <button
                onClick={onRecoverStreak}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0 border-none"
              >
                Recover Streak ✨
              </button>
            ) : (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 italic shrink-0">No recoveries left</span>
            )}
          </div>
        )}

        {activeTab === "mine" && !todayEntry && (
          
          <JournalForm
            currentUserName={currentUserName}
            onSubmitEntry={handlePostEntry}
          />
        )}

        {/* Journal Content */}
        <div className="flex-1 h-full min-h-0 pr-1 flex flex-col gap-4 font-sans text-sm relative z-10">
          {activeTab === "mine" ? (
            <div className="flex-1 h-full min-h-0 pr-1 flex flex-col gap-4">
              {/* Today entry display */}
              {todayEntry && (
                <JournalEntryCard
                  entry={todayEntry}
                  currentUserCode={currentUserCode}
                  currentUserName={currentUserName}
                  partnerName={partnerName}
                  currentUserAvatar={currentUserAvatar}
                  isOwnEntry={true}
                  isTodayEntry={true}
                  formattedDate="Today"
                  onRemoveEntry={onRemoveEntry}
                  onRemoveComment={onRemoveComment}
                  onAddComment={onAddComment}
                  onEditComment={onEditComment}
                />  
              )}

              {/* Past feelings entries */}
              <div className="flex-1 h-full min-h-0 flex flex-col gap-2 mt-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
                  My Past Feelings ({myEntries.filter(e => e.date !== todayStr).length})
                </span>
                
                <div className="flex-1 h-full pr-1 flex flex-col gap-2">
                  {myEntries.filter(e => e.date !== todayStr).length === 0 ? (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 italic py-2 shrink-0">No past feelings shared.</p>
                  ) : (
                    myEntries
                      .filter((e) => e.date !== todayStr)
                      .map((entry) => (
                        <JournalEntryCard
                          key={entry.id}
                          entry={entry}
                          currentUserCode={currentUserCode}
                          currentUserName={currentUserName}
                          partnerName={partnerName}
                          currentUserAvatar={currentUserAvatar}
                          isOwnEntry={true}
                          isTodayEntry={false}
                          formattedDate={formatDisplayDate(entry.date)}
                          onRemoveEntry={onRemoveEntry}
                          onRemoveComment={onRemoveComment}
                          onAddComment={onAddComment}
                          onEditComment={onEditComment}
                        />
                      ))
                  )}
                </div>
              </div>
            </div>
        ) : (
          <div className="flex-1 h-full min-h-0 overflow-y-auto scrollbar-hide scroll-smooth pr-1 flex flex-col gap-4">
            {/* Partner's list of entries */}
            <div className="flex flex-col gap-4">
              {partnerEntries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  currentUserCode={currentUserCode}
                  currentUserName={currentUserName}
                  partnerName={partnerName}
                  currentUserAvatar={currentUserAvatar}
                  isOwnEntry={false}
                  isTodayEntry={entry.date === todayStr}
                  formattedDate={formatDisplayDate(entry.date)}
                  onRemoveEntry={onRemoveEntry}
                  onRemoveComment={onRemoveComment}
                  onAddComment={onAddComment}
                  onEditComment={onEditComment}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
