import React from "react";
import { Star, Camera } from "lucide-react";

interface GameConfiguratorProps {
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (val: "easy" | "medium" | "hard") => void;
  currentPlayer: "A" | "B" | "both";
  setCurrentPlayer: (val: "A" | "B" | "both") => void;
  activeCategory: "all" | "trips" | "milestones";
  setActiveCategory: (val: "all" | "trips" | "milestones") => void;
  dailyCompleted: boolean;
  onStartGame: () => void;
  getPartnerName: (playerKey: "A" | "B" | "both") => string;
}

export default function GameConfigurator({
  difficulty,
  setDifficulty,
  currentPlayer,
  setCurrentPlayer,
  activeCategory,
  setActiveCategory,
  dailyCompleted,
  onStartGame,
  getPartnerName,
}: GameConfiguratorProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-rose-100/40 dark:border-rose-950/20 backdrop-blur-md flex flex-col gap-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
        <Star className="w-4 h-4 text-rose-500" />
        <span>Configure Challenge</span>
      </h2>

      {/* Daily Bonus Reminder */}
      {!dailyCompleted && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2.5 animate-bounce">
          <span>🌟</span>
          <span>Daily Challenge Available! Complete this round to earn bonus points.</span>
        </div>
      )}

      {/* Difficulty */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Difficulty</label>
        <div className="grid grid-cols-3 gap-2">
          {(["easy", "medium", "hard"] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                difficulty === diff
                  ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Active Guesser selection */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Guesser</label>
        <div className="grid grid-cols-3 gap-2">
          {(["A", "B", "both"] as const).map(player => (
            <button
              key={player}
              onClick={() => setCurrentPlayer(player)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentPlayer === player
                  ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
              }`}
            >
              {getPartnerName(player)}
            </button>
          ))}
        </div>
      </div>

      {/* Category Scope */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Memory Scope</label>
        <div className="grid grid-cols-3 gap-2">
          {(["all", "trips", "milestones"] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onStartGame}
        className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Camera className="w-4 h-4" />
        <span>Start Memory Guessing Round</span>
      </button>
    </div>
  );
}
