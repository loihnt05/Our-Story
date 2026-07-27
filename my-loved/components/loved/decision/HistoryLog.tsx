import React from "react";
import { History, RotateCcw, Check } from "lucide-react";
import { HistoryItem } from "./types";

interface HistoryLogProps {
  history: HistoryItem[];
  onResetHistory: () => void;
  onToggleCompleted: (id: string) => void;
}

export default function HistoryLog({
  history,
  onResetHistory,
  onToggleCompleted,
}: HistoryLogProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md flex flex-col gap-4">
      <div className="flex justify-between items-center border-b pb-3 border-zinc-200/30">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <History className="w-4 h-4 text-rose-500" />
          <span>Couple Decision History & Logs</span>
        </h2>
        {history.length > 0 && (
          <button
            onClick={onResetHistory}
            className="text-[10px] font-bold text-zinc-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-3xl text-zinc-300">🕰️</span>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">No history recorded yet</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Spin the wheel above to make decisions and they will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {history.map((hist) => (
            <div 
              key={hist.id} 
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                hist.completed
                  ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/20"
                  : "bg-white/40 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0 bg-white/60 dark:bg-zinc-950/40 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                  {hist.emoji}
                </span>
                <div className="min-w-0 flex flex-col">
                  <span className={`text-xs font-extrabold truncate ${hist.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-100"}`}>
                    {hist.text}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400 mt-0.5 flex items-center gap-1.5">
                    <span>{hist.categoryName}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                    <span>{hist.date}</span>
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => onToggleCompleted(hist.id)}
                className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  hist.completed
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                    : "border-zinc-300 dark:border-zinc-700 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-500"
                }`}
                title={hist.completed ? "Mark as Incomplete" : "Mark as Completed"}
              >
                <Check className="w-4 h-4 stroke-[3px]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
