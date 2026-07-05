import React, { useEffect, useState } from "react";
import { Sparkles, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { ROMANTIC_QUOTES } from "@/components/loved/core/constants";

interface QuoteCardProps {
  quoteIndex: number;
  setQuoteIndex: React.Dispatch<React.SetStateAction<number>>;
  cardBg: string;
  borderColor: string;
}

export default function QuoteCard({
  quoteIndex,
  setQuoteIndex,
  cardBg,
  borderColor
}: QuoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play timer (slides quotes every 8s, unless hovered)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [isHovered, setQuoteIndex]);

  const fullQuote = ROMANTIC_QUOTES[quoteIndex] || "";
  // Em-dash splitting
  const parts = fullQuote.split("—");
  const quoteText = parts[0]?.trim() || "";
  const quoteAuthor = parts[1]?.trim() || "";

  const handlePrev = () => {
    setQuoteIndex((prev) => (prev - 1 + ROMANTIC_QUOTES.length) % ROMANTIC_QUOTES.length);
  };

  const handleNext = () => {
    setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
  };

  const handleRandom = () => {
    if (ROMANTIC_QUOTES.length <= 1) return;
    let newIndex = quoteIndex;
    while (newIndex === quoteIndex) {
      newIndex = Math.floor(Math.random() * ROMANTIC_QUOTES.length);
    }
    setQuoteIndex(newIndex);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-500 min-h-[260px] h-full lg:min-h-0`}
    >
      {/* Delicate layout background quote marks */}
      <div className="absolute -top-4 -left-4 opacity-5 dark:opacity-10 text-rose-500 pointer-events-none select-none">
        <Quote className="w-24 h-24 rotate-180" />
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-5 dark:opacity-10 text-rose-500 pointer-events-none select-none">
        <Quote className="w-24 h-24" />
      </div>

      {/* Card Header */}
      <h2 className="text-2xl font-extrabold font-cursive border-b pb-2.5 border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between z-10">
        <span className="flex items-center gap-1.5 text-zinc-900 dark:text-white">
          <Quote className="w-5 h-5 text-amber-500  animate-pulse" />
          Words of Love
        </span>
        {isHovered && (
          <span className="text-[10px] font-sans font-medium text-rose-500/80 animate-fade-in">
            Auto-play paused
          </span>
        )}
      </h2>

      {/* Main Quote Content with Key-retrigger fade-in */}
      <div 
        key={quoteIndex}
        className="flex-1 flex flex-col justify-center items-center py-4 text-center z-10 animate-fade-in overflow-y-auto scrollbar-hide pr-1"
      >
        <p className="text-zinc-800 dark:text-zinc-100 text-base md:text-lg leading-relaxed italic font-serif px-4 select-all">
          &ldquo;{quoteText}&rdquo;
        </p>

        {/* Cursive divider line */}
        <div className="flex items-center justify-center gap-2 mt-4 select-none opacity-50">
          <div className="w-5 h-[1px] bg-gradient-to-r from-transparent to-zinc-400 dark:to-zinc-600" />
          <span className="text-[10px]">❤️</span>
          <div className="w-5 h-[1px] bg-gradient-to-l from-transparent to-zinc-400 dark:to-zinc-600" />
        </div>

        {quoteAuthor && (
          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400 mt-2 font-sans select-all">
            {quoteAuthor}
          </h4>
        )}
      </div>

      {/* Interactive navigation panel */}
      <div className="flex items-center justify-between border-t border-zinc-200/20 pt-3.5 z-10 select-none">
        
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
          title="Previous quote"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Random Words Button */}
        <button
          onClick={handleRandom}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-200/50 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          title="Pick a random quote"
        >
          <span>Random Words 🎲</span>
        </button>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
          title="Next quote"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
