import React, { useState } from "react";
import { Check, Copy, Mail, Send, QrCode, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

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
  onCopyLink,
}: InvitePanelProps) {
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusInfo, setStatusInfo] = useState<{
    type: "success" | "error";
    message: string;
    token?: string;
    confirmUrl?: string;
    previewUrl?: string;
  } | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail || isSending) return;

    setIsSending(true);
    setStatusInfo(null);

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

      if (res.ok && data.success) {
        setStatusInfo({
          type: "success",
          message: data.message || `Automated invitation email sent to ${partnerEmail}! 📧`,
          token: data.token,
          confirmUrl: data.confirmUrl,
          previewUrl: data.previewUrl,
        });
        setPartnerEmail("");
      } else {
        setStatusInfo({
          type: "error",
          message: data.error || "Failed to send invitation email. Please try again.",
        });
      }
    } catch (err: any) {
      console.error("Failed to send invitation email:", err);
      setStatusInfo({
        type: "error",
        message: err.message || "An unexpected error occurred while sending email.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center py-2">
      <div className="flex flex-col items-center gap-1.5 max-w-sm">
        <span className="text-4xl animate-bounce">💌</span>
        <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white">
          Connect {personAName} &amp; Companion
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Send an automated invitation email with a secure single-use token and QR code to connect your shared couple space!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg items-stretch">
        {/* Method 1: QR Code */}
        <div className="p-4 bg-white dark:bg-zinc-950/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center gap-2 justify-center">
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
          <span className="text-[10px] text-zinc-400 font-medium">Scan to verify &amp; connect</span>
        </div>

        {/* Method 2: Send Automated Email (No mailto) */}
        <div className="p-4 bg-gradient-to-tr from-rose-500/5 to-purple-500/5 dark:bg-zinc-950/60 rounded-2xl border border-rose-500/15 flex flex-col gap-2.5 text-left justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Automated Email Invite</span>
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
              disabled={isSending || !partnerEmail}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              {isSending ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Invitation...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </form>

          {statusInfo && (
            <div
              className={`p-2.5 rounded-xl text-left text-xs flex flex-col gap-1 ${
                statusInfo.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {statusInfo.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                )}
                <span>{statusInfo.message}</span>
              </div>
              {statusInfo.type === "success" && (
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 flex flex-col gap-0.5">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Secure Single-Use Token (Expires in 24h)
                  </span>
                  {statusInfo.previewUrl && (
                    <a
                      href={statusInfo.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline font-bold mt-1 inline-block"
                    >
                      View Live Sent Email in Web Inbox 📩
                    </a>
                  )}
                  {statusInfo.confirmUrl && (
                    <a
                      href={statusInfo.confirmUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-500 hover:underline font-bold mt-0.5 inline-block"
                    >
                      Preview Verification Page 🔗
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-[9px] text-zinc-400 font-medium leading-relaxed">
            Sends an automated email directly without launching email clients. Includes a single-use token &amp; QR code.
          </p>
        </div>
      </div>

      {/* Link copying block */}
      <div className="w-full max-w-lg flex flex-col gap-2 text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Direct Verification Link
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
