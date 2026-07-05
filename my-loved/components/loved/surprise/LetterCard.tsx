"use client";

import React from "react";
import { motion } from "motion/react";
import { Heart, Lock, PenTool, Check, ChevronRight } from "lucide-react";

interface LetterCardProps {
  activeLetterTab: "card" | "secret-note" | "write-note";
  setActiveLetterTab: (tab: "card" | "secret-note" | "write-note") => void;
  milestoneTitle: string;
  daysTogether: number;
  monthsTogether: number;
  yearsTogether: number;
  typedMessage: string;
  savedNote: string;
  noteContent: string;
  setNoteContent: (val: string) => void;
  handleSaveNote: () => void;
  handleCompleteSurprise: (nextTab?: string) => void;
}

export default function LetterCard({
  activeLetterTab,
  setActiveLetterTab,
  milestoneTitle,
  daysTogether,
  monthsTogether,
  yearsTogether,
  typedMessage,
  savedNote,
  noteContent,
  setNoteContent,
  handleSaveNote,
  handleCompleteSurprise
}: LetterCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 14 }}
      className="w-full max-w-xl bg-gradient-to-b from-amber-50 to-amber-100/90 dark:from-zinc-900 dark:to-zinc-950 text-zinc-850 dark:text-zinc-100 rounded-[2.5rem] shadow-[0_0_60px_rgba(244,63,94,0.3)] border border-amber-200/50 dark:border-zinc-850 p-6 sm:p-10 flex flex-col gap-6 relative z-20 min-h-[500px]"
    >
      <div className="absolute inset-4 rounded-[2rem] border border-amber-300/40 dark:border-zinc-800/40 pointer-events-none" />
      <div className="absolute inset-5 rounded-[1.8rem] border border-amber-300/20 dark:border-zinc-800/20 pointer-events-none" />

      {/* Navigation Tabs */}
      <div className="flex justify-center border-b border-amber-350/30 dark:border-zinc-850 pb-4.5 mb-1 z-10 shrink-0 gap-2 sm:gap-4 select-none">
        <button
          onClick={() => setActiveLetterTab("card")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLetterTab === "card"
              ? "bg-rose-500 text-white shadow-sm"
              : "bg-amber-200/40 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-amber-200/60 dark:hover:bg-zinc-850"
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          Milestone Card
        </button>
        <button
          onClick={() => setActiveLetterTab("secret-note")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLetterTab === "secret-note"
              ? "bg-rose-500 text-white shadow-sm"
              : "bg-amber-200/40 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-amber-200/60 dark:hover:bg-zinc-850"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Secret Love Note
        </button>
        <button
          onClick={() => setActiveLetterTab("write-note")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold font-serif transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeLetterTab === "write-note"
              ? "bg-rose-500 text-white shadow-sm"
              : "bg-amber-200/40 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-amber-200/60 dark:hover:bg-zinc-850"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          Edit Message
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin z-10 flex flex-col justify-center animate-fade-in">
        
        {activeLetterTab === "card" && (
          <div className="flex flex-col gap-6 text-center py-2 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto animate-pulse">
              <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-sans">Celebrate Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white font-serif tracking-tight drop-shadow-sm">
                {milestoneTitle}
              </h2>
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 font-serif mt-1.5 block">
                {daysTogether} Beautiful Days Together
              </span>
              <span className="text-xs text-zinc-555 dark:text-zinc-400 uppercase tracking-widest block font-bold font-sans">
                ({yearsTogether > 0 ? `${yearsTogether} Year${yearsTogether > 1 ? "s" : ""}, ` : ""}{monthsTogether} Month${monthsTogether !== 1 ? "s" : ""} of Shared Devotion)
              </span>
            </div>

            <div className="p-4 sm:p-6 rounded-3xl bg-amber-50/70 dark:bg-zinc-955/40 border border-amber-350/20 dark:border-zinc-850 font-serif text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 italic min-h-[120px] flex items-center justify-center">
              <p className="max-w-md select-text">
                {typedMessage || "Loading our memories..."}
                {typedMessage.length < 230 && (
                  <span className="animate-pulse font-sans font-bold text-rose-500 ml-0.5">|</span>
                )}
              </p>
            </div>
          </div>
        )}

        {activeLetterTab === "secret-note" && (
          <div className="flex flex-col gap-5 text-center py-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-serif">Partner&apos;s Private Note</h3>
              <p className="text-[10px] text-zinc-400 font-sans tracking-wide uppercase mt-1">Locked note decrypted successfully</p>
            </div>

            <div className="p-5 sm:p-7 rounded-3xl bg-rose-500/5 dark:bg-rose-555/5 border border-rose-300/20 dark:border-rose-950/30 font-serif text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 select-text italic min-h-[140px] flex items-center justify-center text-left whitespace-pre-wrap">
              &ldquo;{savedNote}&rdquo;
            </div>

            <span className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest font-sans">
              With love, forever and always.
            </span>
          </div>
        )}

        {activeLetterTab === "write-note" && (
          <div className="flex flex-col gap-4 animate-fade-in text-left">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-serif">Customize Your Secret Message</h3>
              <p className="text-xs text-zinc-555 dark:text-zinc-400 mt-1">Write a private letter for your partner. This will be encrypted and saved in the memory vault.</p>
            </div>

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your heartfelt letter here..."
              className="w-full h-40 p-4.5 rounded-2xl bg-white dark:bg-zinc-955 border border-amber-300/40 dark:border-zinc-850 text-sm outline-none focus:border-rose-400 font-serif text-zinc-900 dark:text-white shadow-inner resize-none"
            />

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setActiveLetterTab("secret-note")}
                className="px-5 py-2 rounded-full border border-zinc-300 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer border-none flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Save Secret Note
              </button>
            </div>
          </div>
        )}

      </div>

      {activeLetterTab !== "write-note" && (
        <div className="mt-4 pt-5 border-t border-amber-300/30 dark:border-zinc-850 flex flex-col sm:flex-row gap-3 select-none z-10 shrink-0">
          <button
            onClick={() => {
              if (activeLetterTab === "card") {
                setActiveLetterTab("secret-note");
              } else {
                setActiveLetterTab("card");
              }
            }}
            className="flex-1 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 border border-amber-350/40 dark:border-zinc-800 text-rose-500 font-bold rounded-full transition-all cursor-pointer text-xs font-sans flex items-center justify-center gap-1.5"
          >
            {activeLetterTab === "card" ? (
              <>
                <span>Read Private Note</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Milestone Card</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleCompleteSurprise()}
            className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-xs font-sans flex items-center justify-center gap-1.5 border-none"
          >
            <span>Open Memory Book 📸</span>
          </button>
        </div>
      )}

    </motion.div>
  );
}
