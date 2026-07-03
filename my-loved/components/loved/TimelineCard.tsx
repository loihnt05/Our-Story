import React from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Milestone } from "./types";

interface TimelineCardProps {
  milestones: Milestone[];
  newMilestoneTitle: string;
  setNewMilestoneTitle: (val: string) => void;
  newMilestoneDate: string;
  setNewMilestoneDate: (val: string) => void;
  newMilestoneDesc: string;
  setNewMilestoneDesc: (val: string) => void;
  newMilestoneIcon: string;
  setNewMilestoneIcon: (val: string) => void;
  onAddMilestone: (e: React.FormEvent) => void;
  onRemoveMilestone: (id: string) => void;
  cardBg: string;
  borderColor: string;
}

export default function TimelineCard({
  milestones,
  newMilestoneTitle,
  setNewMilestoneTitle,
  newMilestoneDate,
  setNewMilestoneDate,
  newMilestoneDesc,
  setNewMilestoneDesc,
  newMilestoneIcon,
  setNewMilestoneIcon,
  onAddMilestone,
  onRemoveMilestone,
  cardBg,
  borderColor
}: TimelineCardProps) {
  return (
    <div className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-4 hover:shadow-2xl transition-all duration-300 min-h-[300px]`}>
      <h2 className="text-xl font-bold font-serif border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          Our Timeline
        </span>
        <span className="text-xs font-sans text-zinc-400 font-normal">{milestones.length} events</span>
      </h2>

      {/* Add Milestone Inline Form */}
      <form onSubmit={onAddMilestone} className="flex flex-col gap-2.5 bg-white/50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-zinc-200/30">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            required
            value={newMilestoneTitle}
            onChange={(e) => setNewMilestoneTitle(e.target.value)}
            placeholder="Milestone Title"
            className="text-xs p-2 rounded-lg bg-white/80 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40 outline-none text-zinc-900 dark:text-white"
          />
          <input
            type="date"
            required
            value={newMilestoneDate}
            onChange={(e) => setNewMilestoneDate(e.target.value)}
            className="text-xs p-2 rounded-lg bg-white/80 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40 outline-none text-zinc-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMilestoneDesc}
            onChange={(e) => setNewMilestoneDesc(e.target.value)}
            placeholder="Brief description..."
            className="text-xs p-2 rounded-lg bg-white/80 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40 outline-none text-zinc-900 dark:text-white flex-1"
          />
          
          <select
            value={newMilestoneIcon}
            onChange={(e) => setNewMilestoneIcon(e.target.value)}
            className="text-xs p-2 rounded-lg bg-white/80 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/40 outline-none text-zinc-900 dark:text-white max-w-[55px] text-center"
          >
            {["💖", "🌸", "☕", "✈️", "💍", "🏡", "🍿", "🍕", "✨"].map(em => (
              <option key={em} value={em}>{em}</option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center justify-center p-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Vertical Timeline container */}
      <div className="flex-1 overflow-y-auto max-h-[180px] pr-1 mt-2">
        {milestones.length === 0 ? (
          <div className="text-center text-zinc-400 dark:text-zinc-500 text-sm py-8 italic">
            No memories recorded. Add a milestone!
          </div>
        ) : (
          <div className="relative border-l border-zinc-200/50 dark:border-zinc-800/50 ml-3.5 pl-5.5 flex flex-col gap-5 py-2">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="relative group/ms">
                {/* Bullet Icon */}
                <div className="absolute -left-[30px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center text-xs z-10 select-none">
                  {milestone.icon}
                </div>
                
                {/* Card */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 font-serif">
                      {new Date(milestone.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-white leading-snug">{milestone.title}</h4>
                    {milestone.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal mt-0.5 max-w-[210px] break-words">
                        {milestone.description}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onRemoveMilestone(milestone.id)}
                    className="text-zinc-400 hover:text-rose-500 opacity-0 group-hover/ms:opacity-100 transition-opacity cursor-pointer p-1"
                    title="Delete Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
