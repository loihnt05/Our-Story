import React from "react";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { Question } from "./types";

interface PolaroidCardProps {
  question: Question;
  isFlipped: boolean;
  isCorrect: boolean;
}

export default function PolaroidCard({
  question,
  isFlipped,
  isCorrect,
}: PolaroidCardProps) {
  const { memory } = question;

  return (
    <div className="polaroid-container w-full max-w-[340px]">
      <div className={`polaroid-card ${isFlipped ? "flipped" : ""}`}>
        
        {/* FRONT SIDE (Question state) */}
        <div className="polaroid-front bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl p-4.5 rounded-2xl flex flex-col justify-between">
          
          {/* Blurred Photo Frame */}
          <div className="relative w-full aspect-square rounded-xl bg-gradient-to-tr from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-800 border border-zinc-100/50 overflow-hidden flex items-center justify-center">
            
            {memory.image ? (
              <img
                src={memory.image}
                className="w-full h-full object-cover blur-md scale-[1.05]"
                alt="Blurred Memory"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 select-none">
                <span className="text-7xl blur-[3px] opacity-70">
                  {memory.icon}
                </span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
              <span className="bg-white/80 dark:bg-zinc-950/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-zinc-650 flex items-center gap-1.5 shadow-sm border border-white/20">
                <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Who remembers this?</span>
              </span>
            </div>
          </div>

          {/* Handwriting style label */}
          <div className="mt-4 pb-2 text-center flex flex-col items-center justify-center">
            <p className="text-md font-bold font-cursive text-zinc-700 dark:text-zinc-300">
              "{question.questionText}"
            </p>
          </div>

        </div>

        {/* BACK SIDE (Reveal state) */}
        <div className="polaroid-back bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl p-4.5 rounded-2xl flex flex-col justify-between">
          
          {/* Unblurred Photo Frame */}
          <div className="relative w-full aspect-square rounded-xl bg-gradient-to-tr from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-800 border border-zinc-100/50 overflow-hidden flex items-center justify-center">
            {memory.image ? (
              <img
                src={memory.image}
                className="w-full h-full object-cover animate-scale-up"
                alt="Unblurred Memory"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-6xl animate-bounce">
                  {memory.icon}
                </span>
              </div>
            )}
            
            {/* Success / Failure badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1.5 ${
                isCorrect ? "bg-emerald-500" : "bg-rose-500"
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-3 h-3 stroke-[3px]" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 stroke-[3px]" />
                    <span>Missed!</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Unveiled notes */}
          <div className="mt-4 pb-1 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500 leading-none">
              {memory.title}
            </p>
            <p className="text-[10px] font-bold text-zinc-400 mt-1">
              {new Date(memory.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium leading-tight mt-1.5 italic max-h-12 overflow-y-auto">
              "{memory.description || "No notes saved for this sweet memory."}"
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
