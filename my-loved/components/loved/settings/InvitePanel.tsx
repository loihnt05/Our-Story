import React, { useState } from "react";
import { Check, Copy, Mail, Send, QrCode } from "lucide-react";

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
  const [partnerEmail, setPartnerEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail) return;

    const subject = encodeURIComponent(`Join ${personAName} on Our Story! 💖`);
    const body = encodeURIComponent(
      `Hi! ${personAName} has invited you to connect your anniversary space on Our Story! 💖\n\nClick the link below to join and connect our profiles:\n${inviteUrl}\n\nCan't wait to share our love story together! ✨`
    );

    window.open(`mailto:${partnerEmail}?subject=${subject}&body=${body}`, "_blank");
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center py-2">
      <div className="flex flex-col items-center gap-1.5 max-w-sm">
        <span className="text-4xl animate-bounce">💌</span>
        <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white">
          Connect {personAName} &amp; Companion
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Connect by scanning the QR code, sending an email invitation, or opening the direct link!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg items-center">
        {/* Method 1: QR Code */}
        <div className="p-4 bg-white dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </span>
          <div className="p-2 bg-white rounded-xl border border-zinc-200 shadow-inner">
            <img 
              src={qrImageUrl} 
              alt="Partner Connection QR Code"
              className="w-32 h-32 object-contain select-none"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">Scan with camera</span>
        </div>

        {/* Method 2: Send Email */}
        <div className="p-4 bg-gradient-to-tr from-rose-500/5 to-purple-500/5 dark:bg-zinc-950/60 rounded-2xl border border-rose-500/15 flex flex-col gap-2.5 text-left justify-center h-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Send Email Invite</span>
          </span>
          <form onSubmit={handleSendEmail} className="flex flex-col gap-2">
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
              className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{emailSent ? "Sent! 📧" : "Send Email"}</span>
            </button>
          </form>
          <p className="text-[9px] text-zinc-400 font-medium">
            Drafts an invitation email with your link.
          </p>
        </div>
      </div>

      {/* Link copying block */}
      <div className="w-full max-w-lg flex flex-col gap-2 text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Direct Invite Link
        </span>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 outline-none truncate font-mono"
          />
          <button
            onClick={onCopyLink}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0 border-none"
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
