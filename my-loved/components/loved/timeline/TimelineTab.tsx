"use client";

import React from "react";
import { Calendar } from "lucide-react";
import MilestoneForm from "@/components/loved/timeline/MilestoneForm";
import MilestoneCard from "@/components/loved/timeline/MilestoneCard";

interface TimelineTabProps {
  loved: any;
  currentTheme: any;
  offsetY: number;
  isDesktop: boolean;
}

export default function TimelineTab({ loved, currentTheme, offsetY, isDesktop }: TimelineTabProps) {
  const sorted = [...loved.milestones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="relative w-full max-w-6xl mx-auto px-6 pb-12 flex flex-col gap-10 mt-6 items-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
        {/* Sticky Form */}
        <div 
          className="md:col-span-4 md:sticky md:top-1/2 top-4 "
          style={{ 
            transform: isDesktop ? `translateY(calc(-50% + ${offsetY}px))` : "none", 
            willChange: "transform" 
          }}
        >
          <MilestoneForm
            cardBg={currentTheme.cardBg}
            borderColor={currentTheme.borderColor}
            onAddMilestone={loved.handleAddMilestone}
          />
        </div>

        {/* Timeline Cards */}
        <div className="md:col-span-8 flex flex-col w-full text-left">
          {sorted.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-white/20 dark:bg-black/20 border border-white/10 backdrop-blur-md flex flex-col items-center gap-3">
              <Calendar className="w-12 h-12 opacity-30 text-rose-500" />
              <h3 className="font-bold text-lg">No Milestones Recorded</h3>
              <p className="text-sm text-zinc-400 max-w-xs text-center">
                Fill in the form on the left to write down your first memory capsule!
              </p>
            </div>
          ) : (
            <div className="relative border-l-2 border-dashed border-rose-300/40 dark:border-rose-700/20 ml-6 pl-8 flex flex-col gap-10">
              {sorted.map((milestone: any) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onRemoveMilestone={loved.handleRemoveMilestone}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
