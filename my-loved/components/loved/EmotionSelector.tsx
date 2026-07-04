"use client";

import React, { useState } from "react";
import { Smile } from "lucide-react";

export const EMOTIONS = [
  "Loved 💖",
  "Happy 😊",
  "Excited 🎉",
  "Peaceful 🍃",
  "Tired 😴",
  "Missing You 🥺",
  "Cozy 🧸",
  "Playful 😜"
];

interface EmotionSelectorProps {
  selectedEmotion: string;
  onSelectEmotion: (emotion: string) => void;
}

export default function EmotionSelector({
  selectedEmotion,
  onSelectEmotion
}: EmotionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
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
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-3 pointer-events-auto">
          <div className="grid grid-cols-4 gap-1.5">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => {
                  onSelectEmotion(emotion);
                  setIsOpen(false);
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
  );
}
