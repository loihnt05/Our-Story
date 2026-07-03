import React from "react";
import { Calendar } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

interface MainCounterProps {
  timeLeft: TimeLeft;
  anniversaryDate: string;
  cardBg: string;
  borderColor: string;
}

export default function MainCounter({
  timeLeft,
  anniversaryDate,
  cardBg,
  borderColor
}: MainCounterProps) {
  const formatAnniversaryDate = () => {
    const d = new Date(anniversaryDate);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className={`p-8 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300 min-h-[380px]`}>
      {/* Soft decorative background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-rose-500/10 to-pink-500/0 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex items-center gap-2 mb-4 bg-white/40 dark:bg-zinc-800/40 border border-white/20 px-4.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
        <Calendar className="w-4 h-4 text-rose-500" />
        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 tracking-wide uppercase">
          Anniversary Date
        </span>
      </div>

      <h1 className="text-lg md:text-xl font-medium font-serif text-zinc-900 dark:text-white max-w-md mt-2">
        We have been loving each other for
      </h1>

      {/* Huge Day Display */}
      <div className="my-6 relative flex items-center justify-center">
        <span className="text-7xl md:text-8xl font-molle text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 select-none drop-shadow-sm filter tracking-tight animate-pulse">
          {timeLeft.totalDays.toLocaleString()}
        </span>
        <span className="absolute -bottom-5 text-sm font-bold uppercase tracking-widest text-rose-500/80 dark:text-rose-400/80 mt-1">
          Days
        </span>
      </div>

      {/* Detailed counter grid */}
      <div className="grid grid-cols-4 gap-4 md:gap-6 mt-12 w-full max-w-md">
        {[
          { label: "Days", val: timeLeft.days },
          { label: "Hours", val: timeLeft.hours },
          { label: "Minutes", val: timeLeft.minutes },
          { label: "Seconds", val: timeLeft.seconds, pulse: true }
        ].map((timeUnit, index) => (
          <div 
            key={index}
            className="flex flex-col items-center p-3 rounded-2xl bg-white/40 dark:bg-zinc-950/20 border border-white/30 dark:border-zinc-800/30 backdrop-blur-sm shadow-sm group/unit hover:scale-105 transition-transform"
          >
            <span className={`text-2xl md:text-3xl font-molle ${
              timeUnit.pulse ? "text-rose-500 dark:text-rose-400" : "text-zinc-900 dark:text-white"
            }`}>
              {String(timeUnit.val).padStart(2, "0")}
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1">
              {timeUnit.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm font-cursive text-zinc-500 dark:text-zinc-400 flex flex-col gap-1 items-center">
        <span>Together since</span>
        <span className="text-rose-500 dark:text-rose-400 font-serif font-bold text-base mt-0.5">
          {formatAnniversaryDate()}
        </span>
      </div>
    </div>
  );
}
