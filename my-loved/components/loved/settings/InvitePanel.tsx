"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

interface InvitePanelProps {
  personAName: string;
  inviteUrl: string;
  qrImageUrl: string;
  copied: boolean;
  onCopyLink: () => void;
}

export default function InvitePanel({
  personAName,
  inviteUrl,
  qrImageUrl,
  copied,
  onCopyLink
}: InvitePanelProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <div className="flex flex-col items-center gap-2 max-w-sm">
        <span className="text-4xl animate-bounce">💌</span>
        <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white">
          Connect {personAName} & Companion
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Have your partner scan the QR code below or open the invite link. Once they join and enter their profile, your spaces will connect automatically!
        </p>
      </div>

      {/* QR Code Container */}
      <div className="p-4 bg-white rounded-2xl border border-zinc-200/70 shadow-sm flex items-center justify-center">
        <img 
          src={qrImageUrl} 
          alt="Partner Connection QR Code"
          className="w-44 h-44 object-contain select-none"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Link copying block */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-left">
          Invite Link
        </span>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 outline-none truncate"
          />
          <button
            onClick={onCopyLink}
            className="px-4 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
