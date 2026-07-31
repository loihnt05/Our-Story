"use client";

import React, { useState, useEffect } from "react";
import { Users, X, QrCode, Copy, Check, Sparkles, Camera, Heart, Mail, Send } from "lucide-react";

interface PartnerSettingsModalProps {
  personAName: string;
  setPersonAName?: (val: string) => void;
  personADesc: string;
  setPersonADesc: (val: string) => void;
  personAAvatar: string;
  setPersonAAvatar: (val: string) => void;
  personBName: string;
  setPersonBName?: (val: string) => void;
  personBDesc: string;
  setPersonBDesc: (val: string) => void;
  personBAvatar: string;
  setPersonBAvatar: (val: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, person: "A" | "B") => void;
  onClose: () => void;
}

export default function PartnerSettingsModal({
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
  onImageUpload,
  onClose,
}: PartnerSettingsModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"profiles" | "invite">("profiles");
  const [inviteUrl, setInviteUrl] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteUrl(`${window.location.origin}/number-loved?invite=${encodeURIComponent(personAName)}`);
    }
  }, [personAName]);

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [testInviteUrl, setTestInviteUrl] = useState<string | null>(null);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail || isSendingEmail) return;

    setIsSendingEmail(true);

    let generatedUrl = inviteUrl;

    try {
      const res = await fetch("/api/invite/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerEmail,
          senderName: personAName,
        }),
      });
      const data = await res.json();
      if (data.success && data.confirmUrl) {
        generatedUrl = data.confirmUrl;
      }
    } catch (err) {
      console.error("Email send error:", err);
    } finally {
      setIsSendingEmail(false);
      setTestInviteUrl(generatedUrl);
      setEmailSent(true);

      // Open email client with prefilled email body and direct confirm URL
      const subject = encodeURIComponent(`You're invited to connect our anniversary space on Our Story! 💖`);
      const body = encodeURIComponent(
        `Hi! ${personAName} has invited you to connect your anniversary space on Our Story! 💖\n\nClick the link below to accept the invitation and connect our profiles:\n${generatedUrl}\n\nCan't wait to share our love story together! ✨`
      );
      window.open(`mailto:${partnerEmail}?subject=${subject}&body=${body}`, "_blank");
      setTimeout(() => setEmailSent(false), 4000);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(inviteUrl)}`;
  const hasPartner = Boolean(personBName && personBName.trim().length > 0 && personBName.trim().toLowerCase() !== "partner");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up text-left">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Partner &amp; Me Profiles</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Customize avatars, descriptions &amp; manage couple connection settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 pt-3 gap-3 bg-zinc-50/50 dark:bg-zinc-950/30">
          <button
            onClick={() => setActiveTab("profiles")}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "profiles"
                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Couple Profiles</span>
          </button>
          <button
            onClick={() => setActiveTab("invite")}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "invite"
                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Connection &amp; Invite Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {activeTab === "profiles" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PARTNER A (YOU) */}
              <div className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-zinc-200/40 dark:border-zinc-800/40">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                    <span>👑 Partner A (You)</span>
                  </span>
                  <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">
                    Host
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3 py-1">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-rose-400 shadow-md group">
                    {personAAvatar ? (
                      <img src={personAAvatar} alt={personAName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold font-serif">
                        {personAName?.[0] || "A"}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl cursor-pointer flex items-center gap-1 transition-all">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onImageUpload(e, "A")}
                        className="hidden"
                      />
                    </label>
                    {personAAvatar && (
                      <button
                        onClick={() => setPersonAAvatar("")}
                        className="px-2.5 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-rose-500 bg-zinc-200/40 dark:bg-zinc-800/40 rounded-xl cursor-pointer border-none"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Name</label>
                    <input
                      type="text"
                      value={personAName}
                      onChange={(e) => setPersonAName && setPersonAName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. My Universe 🌌"
                      value={personADesc}
                      onChange={(e) => setPersonADesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* PARTNER B (COMPANION) */}
              <div className="p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-zinc-200/40 dark:border-zinc-800/40">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-500 dark:text-purple-400 flex items-center gap-1.5">
                    <span>💖 Partner B</span>
                  </span>
                  {hasPartner ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                      Connected 💖
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                      Pending Invite 💌
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3 py-1">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-400 shadow-md group">
                    {personBAvatar ? (
                      <img src={personBAvatar} alt={personBName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold font-serif">
                        {personBName?.[0] || "B"}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl cursor-pointer flex items-center gap-1 transition-all">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onImageUpload(e, "B")}
                        className="hidden"
                      />
                    </label>
                    {personBAvatar && setPersonBAvatar && (
                      <button
                        onClick={() => setPersonBAvatar("")}
                        className="px-2.5 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-rose-500 bg-zinc-200/40 dark:bg-zinc-800/40 rounded-xl cursor-pointer border-none"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Partner Name</label>
                    <input
                      type="text"
                      value={personBName}
                      onChange={(e) => setPersonBName && setPersonBName(e.target.value)}
                      placeholder="e.g. Juliet"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Status / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. My Anchor ⚓"
                      value={personBDesc || ""}
                      onChange={(e) => setPersonBDesc && setPersonBDesc(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "invite" && (
            <div className="flex flex-col items-center text-center gap-6 p-2">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4 text-rose-500" />
                  <span>Connect Your Partner's Space</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mt-1 leading-relaxed">
                  Your partner can connect by scanning the QR code, receiving an email invitation, or clicking your direct invite link!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl items-center">
                {/* Method 1: QR Code */}
                <div className="p-4 bg-white dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Method 1: Scan QR Code</span>
                  <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-inner">
                    <img src={qrImageUrl} alt="QR Code Link" className="w-36 h-36 object-contain" />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">Scan with camera app</span>
                </div>

                {/* Method 2: Email Invitation */}
                <div className="p-4 bg-gradient-to-tr from-rose-500/5 to-purple-500/5 dark:bg-zinc-950/60 rounded-2xl border border-rose-500/15 flex flex-col gap-3 text-left justify-center h-full">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                    <Mail className="w-4 h-4" />
                    <span>Method 2: Send to Partner Email</span>
                  </div>
                  <form onSubmit={handleSendEmailInvite} className="flex flex-col gap-2">
                    <input
                      type="email"
                      required
                      placeholder="partner@example.com"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isSendingEmail}
                      className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingEmail ? "Sending..." : emailSent ? "Email Client Opened! 📧" : "Send Email Invite 📧"}</span>
                    </button>
                  </form>

                  {testInviteUrl && (
                    <div className="mt-1 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left flex flex-col gap-1.5 animate-fade-in">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Generated Email Connection Token! 💖
                      </span>
                      <a
                        href={testInviteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <span>Test Invitation Confirmation Link 🚀</span>
                      </a>
                    </div>
                  )}

                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                    Clicking send opens your email app pre-filled with the invitation &amp; direct confirmation link.
                  </p>
                </div>
              </div>

              {/* Method 3: Direct Link Copy */}
              <div className="w-full max-w-xl flex flex-col gap-2 text-left bg-zinc-50/70 dark:bg-zinc-950/30 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                  Method 3: Direct Link (Click or Copy)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-600 dark:text-zinc-300 font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border-none shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center">
          <button
            onClick={() => setActiveTab(activeTab === "profiles" ? "invite" : "profiles")}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
          >
            {activeTab === "profiles" ? (
              <>
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR Code &amp; Link</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Edit Partner Profiles</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer border-none"
          >
            Save &amp; Close 💖
          </button>
        </div>

      </div>
    </div>
  );
}
