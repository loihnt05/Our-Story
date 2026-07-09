import React from "react";
import { Trophy } from "lucide-react";
import { BADGES } from "./constants";

interface LeaderboardTabProps {
  loved: any;
  scores: { A: number; B: number };
  onResetScores: () => void;
}

export default function LeaderboardTab({
  loved,
  scores,
  onResetScores,
}: LeaderboardTabProps) {
  // Determine current badge levels
  const totalScoreA = scores.A;
  const totalScoreB = scores.B;
  const currentBadgeA = BADGES.reduce((prev, curr) => totalScoreA >= curr.minScore ? curr : prev, BADGES[0]);
  const currentBadgeB = BADGES.reduce((prev, curr) => totalScoreB >= curr.minScore ? curr : prev, BADGES[0]);

  // Lead partner text
  const getLeaderText = () => {
    if (scores.A === scores.B) return "You are perfectly tied! 🤝";
    const lead = scores.A > scores.B ? loved.personAName : loved.personBName;
    const diff = Math.abs(scores.A - scores.B);
    return `${lead} is leading by ${diff} points! 👑`;
  };

  return (
    <div className="p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md flex flex-col gap-6">
      <div className="border-b pb-3 border-zinc-200/30 flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-rose-500" />
          <span>Partner Leaderboard</span>
        </h2>
        <button
          onClick={onResetScores}
          className="text-[10px] font-bold text-zinc-400 hover:text-rose-500 cursor-pointer"
        >
          Reset Scores
        </button>
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
        
        {/* Friendly crown leader banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 text-xs font-bold text-zinc-800 dark:text-zinc-200">
          {getLeaderText()}
        </div>

        {/* A score row */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3.5">
            <span className="text-2xl">🥇</span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                {loved.personAName}
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                Badge Level: {currentBadgeA.name}
              </span>
            </div>
          </div>
          <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">{scores.A} pts</span>
        </div>

        {/* B score row */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3.5">
            <span className="text-2xl">🥈</span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                {loved.personBName}
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                Badge Level: {currentBadgeB.name}
              </span>
            </div>
          </div>
          <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">{scores.B} pts</span>
        </div>

      </div>
    </div>
  );
}
