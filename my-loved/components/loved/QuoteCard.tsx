import React from "react";
import { Sparkles, Quote } from "lucide-react";
import { ROMANTIC_QUOTES } from "./constants";

interface QuoteCardProps {
  quoteIndex: number;
  onNextQuote: () => void;
  cardBg: string;
  borderColor: string;
}

export default function QuoteCard({
  quoteIndex,
  onNextQuote,
  cardBg,
  borderColor
}: QuoteCardProps) {
  return (
    <div className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-300 min-h-[250px]`}>
      <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
        <Quote className="w-20 h-20 text-rose-500 rotate-180" />
      </div>

      <h2 className="text-lg font-bold font-serif border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        Inspiration of Love
      </h2>

      <div className="flex-1 flex flex-col justify-center my-4">
        <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed italic font-serif text-center px-2">
          &ldquo;{ROMANTIC_QUOTES[quoteIndex]}&rdquo;
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNextQuote}
          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-200/50 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          Next Quote ✨
        </button>
      </div>
    </div>
  );
}
