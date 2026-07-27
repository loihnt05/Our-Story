import React from "react";
import { X } from "lucide-react";

interface CreateWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  newWheelName: string;
  setNewWheelName: (val: string) => void;
  newWheelIcon: string;
  setNewWheelIcon: (val: string) => void;
  onCreate: () => void;
}

export default function CreateWheelModal({
  isOpen,
  onClose,
  newWheelName,
  setNewWheelName,
  newWheelIcon,
  setNewWheelIcon,
  onCreate,
}: CreateWheelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl backdrop-blur-xl flex flex-col gap-4">
        
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-md font-bold font-cursive text-rose-500 flex items-center gap-1.5">
            <span>🎡 Create Custom Wheel</span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Wheel Title</label>
            <input
              type="text"
              required
              value={newWheelName}
              onChange={(e) => setNewWheelName(e.target.value)}
              placeholder="Date Night Ideas, Chore Picker..."
              maxLength={25}
              className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Wheel Category Icon</label>
            <div className="grid grid-cols-5 gap-1.5">
              {["🎡", "🍽️", "☕", "🍿", "🍳", "🚶‍♂️", "📚", "🧺", "🥂", "✈️"].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setNewWheelIcon(em)}
                  className={`text-lg p-1.5 rounded-xl transition-all cursor-pointer ${
                    newWheelIcon === em 
                      ? "bg-rose-500/10 border-rose-500 border-2" 
                      : "bg-zinc-100/50 dark:bg-zinc-800/40 border border-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onCreate}
            disabled={!newWheelName.trim()}
            className="w-full mt-2 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            Create Custom Wheel ✨
          </button>
        </div>
      </div>
    </div>
  );
}
