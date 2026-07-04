"use client";

import React, { useState } from "react";
import { 
  Flame, 
  Sparkles, 
  Smile, 
  MessageCircle, 
  Send, 
  Trash2, 
  Heart, 
  BookOpen,
  Plus
} from "lucide-react";
import { JournalEntry } from "./types";


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

const EMOTIONS = [
  "Loved 💖",
  "Happy 😊",
  "Excited 🎉",
  "Peaceful 🍃",
  "Tired 😴",
  "Missing You 🥺",
  "Cozy 🧸",
  "Playful 😜"
];

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
  const [entryContent, setEntryContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("💖");

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showEmotionDropdown, setShowEmotionDropdown] = useState(false);

  const currentUserCode = activePartner;
  const partnerUserCode = activePartner === "A" ? "B" : "A";
  
  const currentUserName = activePartner === "A" ? personAName : personBName;
  const partnerName = activePartner === "A" ? personBName : personAName;
  
  const currentUserAvatar = activePartner === "A" ? personAAvatar : personBAvatar;
  const partnerAvatar = activePartner === "A" ? personBAvatar : personAAvatar;

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

  const handlePostEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryContent.trim()) return;
    onAddEntry(todayStr, selectedEmotion, entryContent);
    setEntryContent("");
  };

  const handlePostComment = (entryId: string) => {
    const text = commentInputs[entryId];
    if (!text || !text.trim()) return;
    onAddComment(entryId, text);
    setCommentInputs({ ...commentInputs, [entryId]: "" });
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
    <div className={`w-full p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 min-h-[300px]`}>
      
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
      {activeTab === "mine" && !todayEntry && (
        <form onSubmit={handlePostEntry} className="flex flex-col gap-3 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/30 border border-zinc-200/30 relative z-30">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            How are you feeling today, {currentUserName}?
          </span>

          {/* Emotion Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmotionDropdown(!showEmotionDropdown)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs font-semibold flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Emotion:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                {selectedEmotion}
              </span>
            </button>
            {showEmotionDropdown && (
              <div className="absolute left-0 top-full mt-2 z-50 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-3 pointer-events-auto">
                <div className="grid grid-cols-4 gap-1.5">
                  {EMOTIONS.map((emotion) => (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => {
                        setSelectedEmotion(emotion);
                        setShowEmotionDropdown(false);
                      }}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center leading-tight ${
                        selectedEmotion === emotion
                          ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400/50"
                          : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:scale-105"
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              placeholder="Tell your partner about your day, experiences or feelings..."
              maxLength={250}
              className="w-full text-xs p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none resize-none text-zinc-900 dark:text-white min-h-[70px] placeholder:text-zinc-400"
            />
            <div className="text-[10px] text-zinc-400 self-end">
              {entryContent.length}/250
            </div>
          </div>

          <button
            type="submit"
            disabled={!entryContent.trim()}
            className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Share Daily Feeling</span>
          </button>
        </form>
      )}

      {/* Journal Content */}
      <div className="flex-1 overflow-hidden pr-1 flex flex-col gap-4 font-sans text-sm relative z-10">
        {activeTab === "mine" ? (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            {/* Today entry display */}
            {todayEntry ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-200/30 dark:border-rose-900/30 flex flex-col gap-2 relative shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold">
                      {todayEntry.emotion}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">Today</span>
                  </div>
                  <button
                    onClick={() => onRemoveEntry(todayEntry.id)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium py-1">
                  "{todayEntry.content}"
                </p>

                {/* Partner Comments Section */}
                <div className="mt-2 border-t border-zinc-200/20 pt-2 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>Comments from {partnerName}</span>
                  </span>
                  
                  {todayEntry.comments.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No comments yet. Switch to {partnerName} to leave a comment!</p>
                  ) : (
                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[100px] pr-1">
                      {todayEntry.comments.map((comment) => (
                        <div 
                          key={comment.id} 
                          className="bg-white/40 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-200/10 text-xs flex justify-between gap-2 shrink-0"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">
                              {comment.author === currentUserCode ? currentUserName : partnerName}
                            </span>
                            <p className="text-zinc-600 dark:text-zinc-300">{comment.content}</p>
                          </div>
                          {comment.author === currentUserCode && (
                            <button
                              onClick={() => onRemoveComment(todayEntry.id, comment.id)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors self-start cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Past feelings entries */}
            <div className="flex-1 flex flex-col gap-2 mt-2 overflow-hidden">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
                My Past Feelings ({myEntries.filter(e => e.date !== todayStr).length})
              </span>
              
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
                {myEntries.filter(e => e.date !== todayStr).length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic py-2 shrink-0">No past feelings shared.</p>
                ) : (
                  myEntries
                    .filter((e) => e.date !== todayStr)
                    .map((entry) => (
                      <div 
                        key={entry.id} 
                        className="p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200/20 flex flex-col gap-2 relative shrink-0"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
                              {entry.emotion}
                            </span>
                            <span className="text-[10px] text-zinc-400">{formatDisplayDate(entry.date)}</span>
                          </div>
                          <button
                            onClick={() => onRemoveEntry(entry.id)}
                            className="text-zinc-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 text-xs italic">
                          "{entry.content}"
                        </p>

                        {/* Comments list */}
                        {entry.comments.length > 0 && (
                          <div className="mt-1 border-t border-zinc-200/10 pt-1.5 flex flex-col gap-1.5">
                            {entry.comments.map((comment) => (
                              <div key={comment.id} className="bg-white/20 dark:bg-black/20 p-2 rounded-xl text-[10px] flex justify-between gap-2 shrink-0">
                                <div>
                                  <span className="font-bold text-zinc-600 dark:text-zinc-400">
                                    {comment.author === currentUserCode ? currentUserName : partnerName}:
                                  </span>{" "}
                                  <span className="text-zinc-500 dark:text-zinc-300">{comment.content}</span>
                                </div>
                                {comment.author === currentUserCode && (
                                  <button
                                    onClick={() => onRemoveComment(entry.id, comment.id)}
                                    className="text-zinc-400 hover:text-rose-500 transition-colors self-start cursor-pointer"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
            {/* Partner's list of entries */}
            {partnerEntries.length === 0 ? (
              <div className="text-center py-10 text-zinc-400 dark:text-zinc-500 italic">
                {partnerName} hasn't shared any feelings yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {partnerEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className={`p-4 rounded-2xl border flex flex-col gap-2 relative bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200/30 dark:border-zinc-800/30 ${
                      entry.date === todayStr ? "ring-2 ring-pink-500/20 shadow-md" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/10">
                          {entry.emotion}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {formatDisplayDate(entry.date)}
                        </span>
                      </div>
                    </div>

                    <p className="text-zinc-800 dark:text-zinc-200 font-medium my-1">
                      "{entry.content}"
                    </p>

                    {/* Comments on partner's entry */}
                    <div className="mt-2 border-t border-zinc-200/20 pt-2.5 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>Discussion ({entry.comments.length})</span>
                      </span>

                      {entry.comments.map((comment) => (
                        <div 
                          key={comment.id} 
                          className="bg-white/40 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-200/10 text-xs flex justify-between gap-2"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">
                              {comment.author === currentUserCode ? currentUserName : partnerName}
                            </span>
                            <p className="text-zinc-600 dark:text-zinc-300">{comment.content}</p>
                          </div>
                          {comment.author === currentUserCode && (
                            <button
                              onClick={() => onRemoveComment(entry.id, comment.id)}
                              className="text-zinc-400 hover:text-rose-500 transition-colors self-start cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Post a comment form */}
                      <div className="flex gap-2 items-center mt-1">
                        {currentUserAvatar ? (
                          <img src={currentUserAvatar} className="w-6 h-6 rounded-full object-cover border border-zinc-200" />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-600 dark:text-rose-200 text-[10px] flex items-center justify-center font-bold font-sans">
                            {currentUserCode}
                          </span>
                        )}
                        <input
                          type="text"
                          placeholder="Type a loving comment..."
                          value={commentInputs[entry.id] || ""}
                          onChange={(e) => 
                            setCommentInputs({ ...commentInputs, [entry.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handlePostComment(entry.id);
                          }}
                          className="flex-1 text-xs p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
                        />
                        <button
                          onClick={() => handlePostComment(entry.id)}
                          className="p-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
