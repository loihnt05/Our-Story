"use client";

import React, { useState } from "react";
import { 
  Flame, 
  Sparkles, 
  BookOpen
} from "lucide-react";
import { JournalEntry } from "./types";
import JournalForm from "./JournalForm";
import JournalEntryCard from "./JournalEntryCard";

interface LoveBoardProps {
  journalEntries: JournalEntry[];
  activePartner: "A" | "B";
  setActivePartner: (partner: "A" | "B") => void;
  streakInfo: { count: number; isCompletedToday: boolean };
  onAddEntry: (date: string, emotion: string, content: string) => void;
  onAddComment: (entryId: string, content: string) => void;
  onRemoveEntry: (entryId: string) => void;
  onRemoveComment: (entryId: string, commentId: string) => void;
  personAName: string;
  personBName: string;
  personAAvatar?: string;
  personBAvatar?: string;
  cardBg: string;
  borderColor: string;
  triggerStreakCelebration: () => void;
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
  personAName,
  personBName,
  personAAvatar,
  personBAvatar,
  cardBg,
  borderColor,
  triggerStreakCelebration
}: LoveBoardProps) {
  const [activeTab, setActiveTab] = useState<"mine" | "partner">("mine");

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

  // Filter entries
  const myEntries = journalEntries.filter(
    (e) => e.author === currentUserCode
  );
  
  const partnerEntries = journalEntries.filter(
    (e) => e.author === partnerUserCode
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
          <button
            onClick={() => {
              if (streakInfo.isCompletedToday) {
                triggerStreakCelebration();
              }
            }}
            disabled={!streakInfo.isCompletedToday}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm select-none group relative ${
              streakInfo.isCompletedToday
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white animate-pulse hover:scale-110 cursor-pointer"
                : "bg-zinc-200 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 opacity-60 cursor-not-allowed"
            }`}
            title={
              streakInfo.isCompletedToday
                ? `Active Streak: ${streakInfo.count} Days! Click to celebrate! ✨`
                : streakInfo.count > 0
                ? `Streak of ${streakInfo.count} ${streakInfo.count === 1 ? "day" : "days"} pending today's check-in! Share daily and comment to activate!`
                : "No streak yet. Share daily and comment on each other's posts to build a streak!"
            }
          >
            <Flame className={`w-4 h-4 ${streakInfo.isCompletedToday ? "fill-current animate-bounce text-amber-300" : "text-zinc-400 dark:text-zinc-500"}`} />
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
      <div className="flex-1 h-full min-h-0 overflow-y-auto flex flex-col gap-4">
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
                        />
                      ))
                  )}
                </div>
              </div>
            </div>
        ) : (
          <div className="flex-1 h-full min-h-0 overflow-y-auto pr-1 flex flex-col gap-4">
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
