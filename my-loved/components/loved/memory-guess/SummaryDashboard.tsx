import React from "react";
import { Flame } from "lucide-react";

interface SummaryDashboardProps {
  currentPlayer: "A" | "B" | "both";
  getPartnerName: (playerKey: "A" | "B" | "both") => string;
  pointsEarnedThisRound: number;
  streak: number;
  onConfigureGame: () => void;
  onPlayAgain: () => void;
}

export default function SummaryDashboard({
  currentPlayer,
  getPartnerName,
  pointsEarnedThisRound,
  streak,
  onConfigureGame,
  onPlayAgain,
}: SummaryDashboardProps) {
  return (
    <div className="lg:col-span-12 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white/40 dark:bg-zinc-955/20 border border-white/20 backdrop-blur-md max-w-xl mx-auto gap-5 animate-scale-up w-full">
      
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-4xl shadow-lg animate-pulse">
        <span>🏆</span>
        <span className="absolute -top-1.5 -right-1.5 text-lg">✨</span>
      </div>

      <div>
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">
          Round Completed! 🌸
        </span>
        <h2 className="text-xl font-bold font-cursive text-zinc-800 dark:text-white mt-1">
          Nostalgic Journey Complete!
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mt-1">
          You successfully navigated through your timeline milestones. Here is the points tally:
        </p>
      </div>

      {/* Point Card */}
      <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-zinc-900/60 dark:to-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 shadow-inner flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs font-bold border-b pb-2 border-zinc-200/30">
          <span className="text-zinc-500">Active Guesser:</span>
          <span className="text-rose-600 dark:text-rose-400">{getPartnerName(currentPlayer)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-zinc-500">Points Earned:</span>
          <span className="text-xl font-extrabold text-emerald-500 animate-scale-up">+{pointsEarnedThisRound} pts</span>
        </div>
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-500">Active Streak:</span>
          <span className="text-amber-500 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-500/10" />
            <span>{streak} correct streak</span>
          </span>
        </div>
      </div>

      <div className="flex gap-2.5 w-full">
        <button
          onClick={onConfigureGame}
          className="flex-1 py-3 rounded-full border border-zinc-250 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-all cursor-pointer hover:bg-white/60 dark:hover:bg-zinc-950/30"
        >
          Configure Game 🔄
        </button>
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
        >
          Play Again 📸
        </button>
      </div>
    </div>
  );
}
