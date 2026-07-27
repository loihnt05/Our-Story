import React from "react";

interface AnswerChoicesProps {
  options: string[];
  onAnswer: (choice: string) => void;
  selectedAnswer: string | null;
}

export default function AnswerChoices({
  options,
  onAnswer,
  selectedAnswer,
}: AnswerChoicesProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {options.map((choice, oIdx) => (
        <button
          key={oIdx}
          onClick={() => onAnswer(choice)}
          disabled={!!selectedAnswer}
          className="p-4.5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-rose-500/10 hover:border-rose-400 active:scale-98 text-xs font-bold text-zinc-800 dark:text-zinc-100 transition-all cursor-pointer flex items-center justify-between text-left disabled:cursor-not-allowed"
        >
          <span className="leading-snug pr-2">{choice}</span>
          <span className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
        </button>
      ))}
    </div>
  );
}
