import React from "react";
import { Settings, X, Calendar } from "lucide-react";
import { THEMES } from "./constants";

interface SettingsModalProps {
  anniversaryDate: string;
  setAnniversaryDate: (val: string) => void;
  customTitle: string;
  setCustomTitle: (val: string) => void;
  themeId: string;
  setThemeId: (val: string) => void;
  personAName: string;
  setPersonAName: (val: string) => void;
  personADesc: string;
  setPersonADesc: (val: string) => void;
  personAAvatar: string;
  setPersonAAvatar: (val: string) => void;
  personBName: string;
  setPersonBName: (val: string) => void;
  personBDesc: string;
  setPersonBDesc: (val: string) => void;
  personBAvatar: string;
  setPersonBAvatar: (val: string) => void;
  onClose: () => void;
}

export default function SettingsModal({
  anniversaryDate,
  setAnniversaryDate,
  customTitle,
  setCustomTitle,
  themeId,
  setThemeId,
  personAName,
  setPersonAName,
  personADesc,
  setPersonADesc,
  personAAvatar,
  setPersonAAvatar,
  personBName,
  setPersonBName,
  personBDesc,
  setPersonBDesc,
  personBAvatar,
  setPersonBAvatar,
  onClose
}: SettingsModalProps) {
  // Image Upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, person: "A" | "B") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (person === "A") {
          setPersonAAvatar(reader.result as string);
        } else {
          setPersonBAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-500" />
            Customize Our Space
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* Day X Config */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Day X (Anniversary Start Date)
            </label>
            <input
              type="date"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none text-zinc-900 dark:text-white"
            />
          </div>

          {/* Title Config */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Dashboard Title
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Our Love Story"
              className="w-full p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none text-zinc-900 dark:text-white"
            />
          </div>

          {/* Theme Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Select Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setThemeId(th.id)}
                  className={`p-3.5 rounded-2xl text-left border flex flex-col gap-1 hover:-translate-y-[1px] transition-all cursor-pointer ${
                    themeId === th.id 
                      ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10 dark:bg-rose-950/10" 
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent"
                  }`}
                >
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{th.name}</span>
                  <div className="flex gap-1.5 mt-1.5">
                    {th.particleColors.map((col, ci) => (
                      <div 
                        key={ci} 
                        className="w-3.5 h-3.5 rounded-full border border-white/20" 
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Couple Info Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-5">
            {/* Person A config */}
            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Partner A (Left Side)
              </span>
              
              <div className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Name"
                  value={personAName}
                  onChange={(e) => setPersonAName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={personADesc}
                  onChange={(e) => setPersonADesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                />
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-zinc-400 cursor-pointer p-2 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 flex-1 text-center">
                    Upload Avatar Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "A")}
                      className="hidden"
                    />
                  </label>
                  {personAAvatar && (
                    <button
                      onClick={() => setPersonAAvatar("")}
                      className="p-2 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-lg hover:bg-rose-100 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Person B config */}
            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Partner B (Right Side)
              </span>
              
              <div className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Name"
                  value={personBName}
                  onChange={(e) => setPersonBName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={personBDesc}
                  onChange={(e) => setPersonBDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                />
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-zinc-400 cursor-pointer p-2 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 flex-1 text-center">
                    Upload Avatar Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "B")}
                      className="hidden"
                    />
                  </label>
                  {personBAvatar && (
                    <button
                      onClick={() => setPersonBAvatar("")}
                      className="p-2 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-lg hover:bg-rose-100 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-sm transition-colors text-sm cursor-pointer"
          >
            Close & Save Space
          </button>
        </div>
      </div>
    </div>
  );
}
