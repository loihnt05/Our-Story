"use client";

import React, { useState, useEffect } from "react";
import { Settings, X, ArrowLeft } from "lucide-react";
import InvitePanel from "@/components/loved/settings/InvitePanel";
import SettingsForm from "@/components/loved/settings/SettingsForm";

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
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteUrl(`${window.location.origin}/number-loved?invite=${encodeURIComponent(personAName)}`);
    }
  }, [personAName]);

  // Image Upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, person: "A" | "B") => {
    const file = e.target.files?.[0];
    if (file) {
      const windowReader = new FileReader();
      windowReader.onloadend = () => {
        if (person === "A") {
          setPersonAAvatar(windowReader.result as string);
        } else {
          setPersonBAvatar(windowReader.result as string);
        }
      };
      windowReader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(inviteUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
            {showInvitePanel ? (
              <button 
                onClick={() => setShowInvitePanel(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-rose-500" />
              </button>
            ) : (
              <Settings className="w-5 h-5 text-rose-500" />
            )}
            {showInvitePanel ? "Invite Your Partner" : "Customize Our Space"}
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
          {showInvitePanel ? (
            <InvitePanel
              personAName={personAName}
              inviteUrl={inviteUrl}
              qrImageUrl={qrImageUrl}
              copied={copied}
              onCopyLink={handleCopyLink}
            />
          ) : (
            <SettingsForm
              anniversaryDate={anniversaryDate}
              setAnniversaryDate={setAnniversaryDate}
              customTitle={customTitle}
              setCustomTitle={setCustomTitle}
              themeId={themeId}
              setThemeId={setThemeId}
              personAName={personAName}
              personADesc={personADesc}
              setPersonADesc={setPersonADesc}
              personAAvatar={personAAvatar}
              setPersonAAvatar={setPersonAAvatar}
              personBName={personBName}
              setPersonBName={setPersonBName}
              personBDesc={personBDesc}
              setPersonBDesc={setPersonBDesc}
              personBAvatar={personBAvatar}
              setPersonBAvatar={setPersonBAvatar}
              onImageUpload={handleImageUpload}
              onShowInvite={() => setShowInvitePanel(true)}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-sm transition-colors text-sm cursor-pointer"
          >
            {showInvitePanel ? "Back to Settings" : "Close & Save Space"}
          </button>
        </div>
      </div>
    </div>
  );
}
