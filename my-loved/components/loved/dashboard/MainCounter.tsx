import React from "react";
import { Calendar, Heart } from "lucide-react";

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
    <div className={`p-8 lg:py-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300 min-h-[340px] md:min-h-[380px] lg:min-h-0 lg:flex-[1.2] shrink-0`}>
      
      {/* Cute Bouncy and Floating Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cute-float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes cute-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes item-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.1); }
        }
        @keyframes sparkle-glow {
          0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.6; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        }
        .cute-floating {
          animation: cute-float 4.5s ease-in-out infinite;
        }
        .cute-pulsing {
          animation: cute-pulse 2s ease-in-out infinite;
        }
        .item-floating {
          animation: item-float 3s ease-in-out infinite;
        }
        .sparkle-glowing {
          animation: sparkle-glow 3.5s ease-in-out infinite;
        }
      `}} />

      {/* Decorative cute icons in corners */}
      <span className="absolute top-6 left-6 text-xl sparkle-glowing select-none">✨</span>
      <span className="absolute top-10 right-8 text-lg item-floating select-none" style={{ animationDelay: "0.5s" }}>💖</span>
      <span className="absolute bottom-10 left-8 text-lg item-floating select-none" style={{ animationDelay: "1s" }}>🌸</span>
      <span className="absolute bottom-6 right-6 text-xl sparkle-glowing select-none" style={{ animationDelay: "1.5s" }}>✨</span>

      {/* Soft decorative background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-rose-500/10 to-pink-500/0 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex items-center gap-2 mb-4 bg-white/40 dark:bg-zinc-800/40 border border-white/20 px-4.5 py-1.5 rounded-full backdrop-blur-md shadow-sm select-none">
        <Calendar className="w-4 h-4 text-rose-500" />
        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 tracking-wide uppercase">
          Anniversary Date
        </span>
      </div>

      <h1 className="text-lg md:text-xl font-medium font-serif text-zinc-900 dark:text-white max-w-md mt-2 select-none">
        We have been loving each other for
      </h1>

      {/* Huge Day Display with bouncing decorations */}
      <div className="my-6 relative flex items-center justify-center gap-4 cute-floating select-none">
        <span className="text-3xl animate-bounce select-none" style={{ animationDuration: "1.2s", animationDelay: "0.1s" }}>🐰</span>
        <div className="relative flex flex-col items-center">
          <span className="text-7xl md:text-8xl p-1 font-molle text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 select-none drop-shadow-[0_4px_8px_rgba(244,63,94,0.15)] filter tracking-tight">
            {timeLeft.totalDays.toLocaleString()}
          </span>
          <span className="absolute -bottom-5 text-sm font-bold uppercase tracking-widest text-rose-500/80 dark:text-rose-400/80 mt-1">
            Days
          </span>
        </div>
        <span className="text-3xl animate-bounce select-none" style={{ animationDuration: "1.2s", animationDelay: "0.5s" }}>🐻</span>
      </div>

      {/* Detailed counter grid with cute rounded cards and bouncy update effects */}
      <div className="grid grid-cols-4 gap-3.5 md:gap-5 mt-12 w-full max-w-md">
        {[
          { 
            label: "Days", 
            val: timeLeft.days, 
            colorClass: "text-rose-500 dark:text-rose-400", 
            borderClass: "border-rose-200/50 dark:border-rose-900/30", 
            bgClass: "bg-rose-50/40 dark:bg-rose-950/15" 
          },
          { 
            label: "Hours", 
            val: timeLeft.hours, 
            colorClass: "text-purple-500 dark:text-purple-400", 
            borderClass: "border-purple-200/50 dark:border-purple-900/30", 
            bgClass: "bg-purple-50/40 dark:bg-purple-950/15" 
          },
          { 
            label: "Min", 
            val: timeLeft.minutes, 
            colorClass: "text-sky-500 dark:text-sky-400", 
            borderClass: "border-sky-200/50 dark:border-sky-900/30", 
            bgClass: "bg-sky-50/40 dark:bg-sky-950/15" 
          },
          { 
            label: "Sec", 
            val: timeLeft.seconds, 
            colorClass: "text-amber-500 dark:text-amber-400", 
            borderClass: "border-amber-200/50 dark:border-amber-900/30", 
            bgClass: "bg-amber-50/40 dark:bg-amber-950/15", 
            pulse: true 
          }
        ].map((timeUnit, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center p-3 rounded-[24px] border ${timeUnit.borderClass} ${timeUnit.bgClass} backdrop-blur-sm shadow-sm hover:scale-108 hover:-translate-y-0.5 transition-all duration-300 group/unit`}
          >
            <span className={`text-2xl md:text-3xl font-molle select-all ${timeUnit.colorClass} ${timeUnit.pulse ? "cute-pulsing inline-block" : ""}`}>
              {String(timeUnit.val).padStart(2, "0")}
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-1 select-none">
              {timeUnit.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm font-cursive text-zinc-500 dark:text-zinc-400 flex flex-col gap-1 items-center select-none">
        <span>Together since</span>
        <span className="text-rose-500 dark:text-rose-400 font-serif font-bold text-base mt-0.5 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-rose-500" />
          {formatAnniversaryDate()}
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-rose-500" />
        </span>
      </div>
    </div>
  );
}
