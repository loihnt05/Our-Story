"use client";

import React, { useState, useEffect } from "react";
import { Heart, Calendar, BookHeart, Sparkles, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  image?: string;
}

interface TimelineMemoryReminderProps {
  milestone: Milestone;
  loved: any;
  onClose: () => void;
}

const SENTIMENTAL_MESSAGES = [
  "Time changes many things, but it only makes my love for you grow stronger. 💖",
  "Looking back at this moment, my heart still skips a beat just like it did back then. ✨",
  "This day started a chapter of my life that I never want to end. 📖",
  "Of all the paths I've taken in life, the ones that led me to you are my absolute favorite. 🌸",
  "Reliving this day reminds me how lucky I am to walk through life holding your hand. 🤝",
  "Some moments are golden, others are precious, but this one with you is timeless. ⏳"
];

export default function TimelineMemoryReminder({
  milestone,
  loved,
  onClose
}: TimelineMemoryReminderProps) {
  const [reflection, setReflection] = useState("");
  const [sentimentQuote, setSentimentQuote] = useState("");
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  useEffect(() => {
    // Select a random sentimental message on mount
    const randomIndex = Math.floor(Math.random() * SENTIMENTAL_MESSAGES.length);
    setSentimentQuote(SENTIMENTAL_MESSAGES[randomIndex]);

    // Play a gentle ambient music chime if unmuted
    if (loved && !loved.isMuted && loved.synthRef?.current) {
      try {
        loved.synthRef.current.resume?.();
      } catch (err) {
        console.error("Failed to resume ambient synth", err);
      }
    }
  }, [loved]);

  // Calculate years elapsed since the milestone
  const today = new Date();
  const milestoneDate = new Date(milestone.date);
  const yearsAgo = today.getFullYear() - milestoneDate.getFullYear();

  // Format milestone date beautifully (e.g., November 15, 2024)
  const formattedOriginalDate = milestoneDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const handleSaveReflection = () => {
    const todayDate = new Date();
    const dateStr = todayDate.toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Add to journal if user typed something
    if (reflection.trim()) {
      const activePartnerName = loved.activePartner === "A" ? loved.personAName : loved.personBName;
      loved.handleAddJournalEntry(
        "💖 romantic",
        `Reflecting on our memory "${milestone.title}" (${milestone.date}): "${reflection.trim()}"`,
        dateStr
      );
      // Trigger a beautiful floating heart burst celebration on screen
      if (loved.triggerHeartBurst) {
        loved.triggerHeartBurst();
      }
    }

    // Save the reminder-viewed flag in localStorage so it doesn't pop up again today
    localStorage.setItem(
      `loved_memory_reminded_${milestone.id}_${todayDate.getFullYear()}`,
      "true"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-4 md:p-6 bg-zinc-950/80 backdrop-blur-xl select-none font-sans overflow-hidden">
      
      {/* Background Hearts/Sparkles particles */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="absolute top-10 left-10 w-24 h-24 bg-rose-400 dark:bg-rose-900/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-400 dark:bg-pink-900/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/30 shadow-2xl flex flex-col gap-6 z-10 animate-scale-up text-white max-h-[90vh] overflow-y-auto scrollbar-hide">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-rose-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-300">On This Day Memory</span>
          </div>
          <button
            onClick={handleSaveReflection}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Dismiss Memory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Years Ago Anniversary Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-cursive font-bold text-rose-100 drop-shadow-sm">
            {yearsAgo > 0 ? `${yearsAgo} ${yearsAgo === 1 ? 'Year' : 'Years'} Ago Today...` : "Remembering this moment..."}
          </h2>
          <p className="text-rose-200/80 text-xs font-serif italic mt-1.5">{formattedOriginalDate}</p>
        </div>

        {/* Polaroid Memory Photo / Fallback Frame */}
        <div className="w-full p-4 pb-8 bg-[#faf7f0] border border-[#eadecc]/60 rounded-2xl shadow-xl flex flex-col gap-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
          
          {milestone.image ? (
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 relative shadow-inner">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            // Exquisite fallback placeholder when no photo exists
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-rose-100 bg-gradient-to-tr from-rose-400/20 to-pink-500/10 flex flex-col items-center justify-center relative shadow-inner p-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center animate-pulse">
                <span className="text-4xl">{milestone.icon || "💖"}</span>
              </div>
              <span className="text-[10px] text-rose-500/60 uppercase tracking-widest font-bold font-sans mt-3">
                A Beautiful Chapter In Our Story
              </span>
            </div>
          )}

          {/* Polaroid Handwritten Caption */}
          <div className="px-1 text-left select-text">
            <h3 className="font-serif font-bold text-lg text-rose-600 leading-snug flex items-center gap-1.5">
              <span>{milestone.icon || "💖"}</span>
              <span className="truncate">{milestone.title}</span>
            </h3>
            <p className="text-zinc-700 text-xs md:text-sm font-sans mt-2 leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </div>

        {/* Nostalgic Sentimental Quote */}
        {sentimentQuote && (
          <div className="p-4 bg-white/5 dark:bg-black/15 border border-white/10 rounded-2xl flex items-start gap-3 select-text">
            <Sparkles className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-zinc-200 text-xs md:text-sm italic leading-relaxed">
              "{sentimentQuote}"
            </p>
          </div>
        )}

        {/* Reflection Note Input Area */}
        <div className="w-full flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {!showReflectionInput ? (
              <button
                onClick={() => setShowReflectionInput(true)}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Write a reflection on this memory ✍️</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden flex flex-col gap-2.5"
              >
                <label className="text-[10px] font-bold uppercase tracking-wider text-rose-300 text-left">
                  Your Reflection Note
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How do you feel looking back at this memory today?..."
                  maxLength={180}
                  className="w-full p-3 rounded-xl bg-zinc-950/50 border border-white/10 text-xs md:text-sm outline-none text-white h-20 resize-none placeholder:text-zinc-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <button
            onClick={handleSaveReflection}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-semibold rounded-full shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{reflection.trim() ? "Save Reflection & Dismiss" : "Keep in My Heart 💖"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
