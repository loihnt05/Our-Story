"use client";

import React from "react";
import { Calendar, QrCode } from "lucide-react";
import { THEMES } from "@/components/loved/core/constants";

interface SettingsFormProps {
  anniversaryDate: string;
  setAnniversaryDate: (val: string) => void;
  customTitle: string;
  setCustomTitle: (val: string) => void;
  themeId: string;
  setThemeId: (val: string) => void;
  personAName: string;
  personADesc?: string;
  personAAvatar: string;
  personBName: string;
  personBDesc?: string;
  personBAvatar: string;
  onOpenPartnerModal: () => void;
}

export default function SettingsForm({
  anniversaryDate,
  setAnniversaryDate,
  customTitle,
  setCustomTitle,
  themeId,
  setThemeId,
  personAName,
  personAAvatar,
  personBName,
  personBAvatar,
  onOpenPartnerModal,
}: SettingsFormProps) {
  const hasPartner = Boolean(personBName && personBName.trim().length > 0 && personBName.trim().toLowerCase() !== "partner");

  return (
    <>
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

      {/* Partner & Me Dedicated Launcher Card */}
      <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-5 flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
          <span>Partner &amp; Me Profiles</span>
          {hasPartner ? (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
              Connected 💖
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
              Pending Invite 💌
            </span>
          )}
        </label>

        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex -space-x-3 items-center">
              <div className="w-11 h-11 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden shadow-sm">
                {personAAvatar ? (
                  <img src={personAAvatar} alt={personAName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                    {personAName?.[0] || "A"}
                  </div>
                )}
              </div>
              <div className="w-11 h-11 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden shadow-sm">
                {personBAvatar ? (
                  <img src={personBAvatar} alt={personBName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-500 text-white font-bold flex items-center justify-center text-xs">
                    {personBName?.[0] || "B"}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col text-left">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                {personAName} &amp; {personBName || "Partner"}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                Names, descriptions, avatars &amp; invite link
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPartnerModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 border-none"
          >
            <QrCode className="w-4 h-4" />
            <span>Manage Profiles Popup 💖</span>
          </button>
        </div>
      </div>
    </>
  );
}
