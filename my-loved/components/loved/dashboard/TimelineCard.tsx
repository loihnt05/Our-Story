import React, { useState, useEffect } from "react";
import { Calendar, HelpCircle, Shuffle, ChevronRight } from "lucide-react";
import { Milestone } from "@/components/loved/core/types";
import Link from "next/link";

interface TimelineCardProps {
  milestones: Milestone[];
  cardBg: string;
  borderColor: string;
}

export default function TimelineCard({
  milestones,
  cardBg,
  borderColor
}: TimelineCardProps) {
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  // Initialize and select a random milestone
  useEffect(() => {
    if (milestones.length > 0) {
      // Pick a random one if not set, or if the index is out of bounds
      if (randomIndex === null || randomIndex >= milestones.length) {
        setRandomIndex(Math.floor(Math.random() * milestones.length));
      }
    } else {
      setRandomIndex(null);
    }
  }, [milestones, randomIndex]);

  // Handle shuffling to another random memory
  const handleShuffle = () => {
    if (milestones.length <= 1) return;
    let newIndex = randomIndex;
    // ensure we pick a different one if possible
    while (newIndex === randomIndex) {
      newIndex = Math.floor(Math.random() * milestones.length);
    }
    setRandomIndex(newIndex);
  };

  const selectedMilestone = randomIndex !== null ? milestones[randomIndex] : null;

  return (
    <div className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col justify-between hover:shadow-2xl transition-all duration-300 min-h-[300px] h-full lg:min-h-0`}>
      <div className="flex flex-col gap-4 flex-1 ">
        <h2 className="text-2xl font-extrabold font-cursive border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            Memory Capsule
          </span>
          <span className="text-xs font-sans text-zinc-400 font-normal">
            {milestones.length} total
          </span>
        </h2>

        {/* Display one random milestone */}
        {!selectedMilestone ? (
          <div className="text-center text-zinc-400 dark:text-zinc-500 text-sm py-12 italic flex flex-col items-center gap-2 flex-1 overflow-y-auto scrollbar-hide">
            <HelpCircle className="w-8 h-8 opacity-40 text-rose-400" />
            <span>No memories recorded yet. Go to our timeline to add some!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-scale-up py-2 flex-1 overflow-y-auto pr-1">
            <div className="text-xs text-rose-500 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>A Random Memory</span>
              <button 
                onClick={handleShuffle}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Shuffle memory"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cute Polaroid frame style */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-base">
                {selectedMilestone.icon}
              </div>

              {selectedMilestone.image && (
                <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50 dark:bg-zinc-900 mb-1 select-none">
                  <img src={selectedMilestone.image} alt={selectedMilestone.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 font-serif">
                  {(() => {
                    const parts = selectedMilestone.date.split("-");
                    let d: Date;
                    if (parts.length === 3) {
                      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    } else {
                      d = new Date(selectedMilestone.date);
                    }
                    return isNaN(d.getTime())
                      ? ""
                      : d.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        });
                  })()}
                </span>
                <h4 className="font-bold text-base text-zinc-900 dark:text-white leading-snug mt-0.5">
                  {selectedMilestone.title}
                </h4>
                {selectedMilestone.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 italic font-serif">
                    &ldquo;{selectedMilestone.description}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-200/10 flex justify-center">
        <Link
          href="/timeline"
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-sm hover:shadow-md transition-all cursor-pointer text-sm"
        >
          Explore Our Timeline
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
