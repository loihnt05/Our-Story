import React, { useState, useEffect } from "react";
import { Calendar, Check } from "lucide-react";
import { DecisionOption } from "./types";

interface ResultCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  winningItem: DecisionOption | null;
  addedToTimeline: boolean;
  completedAdventure: boolean;
  handleAddToTimeline: () => void;
  handleMarkAsCompleted: () => void;
  handleSpin: () => void;
}

export default function ResultCelebrationModal({
  isOpen,
  onClose,
  winningItem,
  addedToTimeline,
  completedAdventure,
  handleAddToTimeline,
  handleMarkAsCompleted,
  handleSpin,
}: ResultCelebrationModalProps) {
  const [particles, setParticles] = useState<any[]>([]);

  // Generate particles for celebration when open
  useEffect(() => {
    if (isOpen) {
      const colors = ["#ff5a79", "#ff7a94", "#ffb4c4", "#a855f7", "#3b82f6", "#10b981", "#fbbf24"];
      const emojis = ["💖", "✨", "🌸", "💕", "🎉", "🍬"];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // % width
        y: -10 - Math.random() * 30, // vertical start offset
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 14 + 10,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 1.5,
        duration: Math.random() * 2.5 + 2.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isOpen]);

  if (!isOpen || !winningItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Confetti Particle Layer */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-fall-particle select-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}px`,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              color: p.color
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-md p-7 rounded-3xl bg-white/95 dark:bg-zinc-950/95 border-2 border-rose-500/30 dark:border-rose-900/30 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center gap-5 z-40 animate-scale-up">
        
        {/* Celebration Glow Header */}
        <div className="relative w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl animate-bounce">
          <span>{winningItem.emoji}</span>
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
          <span className="absolute -bottom-1 -left-1 text-xs">✨</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            Fate Has Decided! 🎡
          </span>
          <h2 className="text-lg font-bold text-zinc-500 dark:text-zinc-400 font-sans mt-1">
            Your next adventure is:
          </h2>
        </div>

        {/* Selected item details text block */}
        <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-zinc-900/60 dark:to-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 shadow-inner flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">{winningItem.emoji}</span>
          <span className="text-xl font-cursive font-bold text-rose-600 dark:text-rose-400">
            {winningItem.text}
          </span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold italic flex items-center gap-1.5 justify-center">
          <span>"Looks like your next adventure is: {winningItem.text} {winningItem.emoji}"</span>
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 w-full mt-2">
          
          <div className="grid grid-cols-2 gap-2">
            {/* Save and timeline actions */}
            <button
              onClick={handleAddToTimeline}
              disabled={addedToTimeline}
              className={`py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                addedToTimeline
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500 opacity-80"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:scale-98"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{addedToTimeline ? "Added ✅" : "Add to Timeline"}</span>
            </button>

            <button
              onClick={handleMarkAsCompleted}
              disabled={completedAdventure}
              className={`py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                completedAdventure
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 opacity-80"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:scale-98"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{completedAdventure ? "Completed! 🎉" : "Mark Done"}</span>
            </button>
          </div>

          <div className="w-[1px] h-2" />

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                handleSpin();
              }}
              className="flex-1 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
            >
              Spin Again 🔄
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Close & Done 💕
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
