import React from "react";
import { Award } from "lucide-react";
import { BADGES } from "./constants";

interface BadgesTabProps {
  loved: any;
  scores: { A: number; B: number };
}

export default function BadgesTab({
  loved,
  scores,
}: BadgesTabProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md flex flex-col gap-6">
      <div className="border-b pb-3 border-zinc-200/30">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Award className="w-4 h-4 text-rose-500" />
          <span>Unlocked Memory Badges</span>
        </h2>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
          Unlock romantic badges as you guess correct timeline details and level up.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Player A badges board */}
        <div className="p-4 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-white/10 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-2 border-zinc-250/20">
            <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1.5">
              <span>🌸</span>
              <span>{loved.personAName}'s Journey</span>
            </span>
            <span className="text-xs font-bold text-zinc-400">{scores.A} pts</span>
          </div>
          <div className="flex flex-col gap-3">
            {BADGES.map((badge, idx) => {
              const unlocked = scores.A >= badge.minScore;
              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex gap-3.5 items-center transition-all ${
                    unlocked
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "opacity-45 border-transparent bg-zinc-200/20 dark:bg-zinc-950/20"
                  }`}
                >
                  <span className="text-3xl shrink-0">{unlocked ? "🌟" : "🔒"}</span>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-extrabold ${unlocked ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>
                      {badge.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                      {badge.desc} (Need {badge.minScore} pts)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player B badges board */}
        <div className="p-4 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-white/10 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-2 border-zinc-250/20">
            <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1.5">
              <span>🌸</span>
              <span>{loved.personBName}'s Journey</span>
            </span>
            <span className="text-xs font-bold text-zinc-400">{scores.B} pts</span>
          </div>
          <div className="flex flex-col gap-3">
            {BADGES.map((badge, idx) => {
              const unlocked = scores.B >= badge.minScore;
              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex gap-3.5 items-center transition-all ${
                    unlocked
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "opacity-45 border-transparent bg-zinc-200/20 dark:bg-zinc-950/20"
                  }`}
                >
                  <span className="text-3xl shrink-0">{unlocked ? "🌟" : "🔒"}</span>
                  <div className="flex flex-col text-left">
                    <span className={`text-xs font-extrabold ${unlocked ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>
                      {badge.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                      {badge.desc} (Need {badge.minScore} pts)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
