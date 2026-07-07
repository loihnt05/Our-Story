"use client";

import React, { useState } from "react";

interface InviteAcceptanceModalProps {
  partnerInviteName: string;
  onConnect: (name: string, desc: string, avatar: string) => void;
}

export default function InviteAcceptanceModal({
  partnerInviteName,
  onConnect,
}: InviteAcceptanceModalProps) {
  const [partnerNameInput, setPartnerNameInput] = useState("Juliet");
  const [partnerDesc, setPartnerDesc] = useState("My Anchor ⚓");
  const [partnerAvatar, setPartnerAvatar] = useState("");

  const handlePartnerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPartnerAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden animate-scale-up flex flex-col gap-5">
        <div className="text-center flex flex-col items-center gap-1.5 select-none">
          <span className="text-4xl animate-bounce">💖</span>
          <h2 className="text-xl font-serif text-zinc-900 dark:text-white">
            You&apos;re Invited!
          </h2>
          <p className="text-xs text-zinc-500 leading-normal max-w-xs mt-1 text-center font-sans">
            <strong>{partnerInviteName}</strong> has invited you to connect their anniversary space! Enter profile details below.
          </p>
        </div>

        <div className="flex flex-col gap-3.5 mt-2 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">My Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={partnerNameInput}
              onChange={(e) => setPartnerNameInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-55 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Short Description</label>
            <input
              type="text"
              placeholder="e.g. My Anchor ⚓"
              value={partnerDesc}
              onChange={(e) => setPartnerDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-55 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">My Avatar Image</label>
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold text-zinc-400 cursor-pointer p-2.5 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-955 flex-1 text-center font-sans">
                {partnerAvatar ? "Change Photo Slot" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePartnerImageUpload}
                  className="hidden"
                />
              </label>
              {partnerAvatar && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                  <img src={partnerAvatar} alt="Partner avatar" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onConnect(partnerNameInput, partnerDesc, partnerAvatar)}
          disabled={!partnerNameInput}
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 disabled:opacity-40 text-white font-semibold rounded-full shadow-md transition-all cursor-pointer text-sm font-sans flex items-center justify-center gap-1.5 mt-2 border-none"
        >
          Accept Invitation &amp; Connect 💖
        </button>
      </div>
    </div>
  );
}
