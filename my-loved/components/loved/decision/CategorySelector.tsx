import React from "react";
import { FolderHeart, Trash2 } from "lucide-react";
import { WheelCategory } from "./types";

interface CategorySelectorProps {
  categories: WheelCategory[];
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  isSpinning: boolean;
  onDeleteCustomWheel: (id: string, e: React.MouseEvent) => void;
}

export default function CategorySelector({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  isSpinning,
  onDeleteCustomWheel,
}: CategorySelectorProps) {
  return (
    <div className="p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-rose-100/40 dark:border-rose-950/20 backdrop-blur-md flex flex-col gap-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
        <FolderHeart className="w-4 h-4 text-rose-500" />
        <span>Select Category</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => {
                if (!isSpinning) setActiveCategoryId(cat.id);
              }}
              className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 items-start ${
                isActive
                  ? "bg-rose-500/10 border-rose-400 shadow-sm"
                  : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className={`text-xs font-bold leading-tight truncate w-full ${isActive ? "text-rose-600 dark:text-rose-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                {cat.name}
              </span>
              <span className="text-[9px] font-bold text-zinc-400">
                {cat.items.length} options
              </span>
              {cat.isCustom && (
                <button
                  onClick={(e) => onDeleteCustomWheel(cat.id, e)}
                  className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                  title="Delete this wheel"
                  disabled={isSpinning}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
