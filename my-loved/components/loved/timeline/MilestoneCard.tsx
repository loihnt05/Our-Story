"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Milestone } from "@/components/loved/core/types";

interface MilestoneCardProps {
  milestone: Milestone;
  onRemoveMilestone: (id: string) => void;
}

export default function MilestoneCard({
  milestone,
  onRemoveMilestone
}: MilestoneCardProps) {
  // Format Date
  const mDate = new Date(milestone.date);
  const formattedDay = mDate.getDate();
  const formattedMonthYear = mDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="relative animate-scale-up">
      {/* Timeline dot heart */}
      <span className="absolute -left-[50px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border-2 border-rose-300 dark:border-rose-800 shadow-md text-xs select-none hover:scale-110 transition-transform">
        ❤️
      </span>

      {/* Polaroid Style Card */}
      <div className="relative bg-white dark:bg-zinc-950 p-5 pt-7 pb-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/70 shadow-lg hover:shadow-xl hover:rotate-1 hover:scale-[1.01] transition-all duration-300 group max-w-lg">
        
        {/* Washi Tape / Tape sticker at top */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-rose-200/40 dark:bg-rose-900/20 backdrop-blur-sm border-x border-dashed border-rose-300/30 dark:border-rose-700/10 rotate-[-2deg] select-none" />

        {/* Floating Emoji Icon */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center text-lg z-10">
          {milestone.icon}
        </div>

        {/* Polaroid Photo */}
        {milestone.image && (
          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900 mb-4 shadow-sm group-hover:scale-[1.01] transition-transform duration-300 select-none">
            <img
              src={milestone.image}
              alt={milestone.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-1">
          {/* Cute high-contrast date */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-serif text-rose-500 leading-none">
              {formattedDay}
            </span>
            <span className="text-xs font-bold text-zinc-400 font-serif uppercase tracking-wider">
              {formattedMonthYear}
            </span>
          </div>

          <h3 className="font-extrabold font-cursive text-lg text-zinc-900 dark:text-white leading-snug mt-2 select-all">
            {milestone.title}
          </h3>

          {milestone.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic font-serif mt-3 border-l-2 border-rose-200/30 dark:border-rose-800/20 pl-3.5 bg-zinc-50/50 dark:bg-zinc-950/40 py-2.5 rounded-r-xl">
              &ldquo;{milestone.description}&rdquo;
            </p>
          )}
        </div>

        {/* Floating actions */}
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-100/50 dark:border-zinc-900/50">
          <button
            onClick={() => onRemoveMilestone(milestone.id)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500 font-semibold p-1 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-lg transition-colors cursor-pointer"
            title="Delete memory"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
