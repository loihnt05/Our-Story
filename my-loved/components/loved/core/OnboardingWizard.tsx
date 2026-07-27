"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, Camera, Calendar, Sparkles, ArrowRight, 
  ArrowLeft, Mail, User, CheckCircle, Copy, QrCode
} from "lucide-react";
import { useUser } from "./AuthProvider";
import { THEMES } from "./constants";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const PRESET_AVATARS = [
  { name: "💖 Rose Heart", value: "💝" },
  { name: "✨ Star Magic", value: "⭐" },
  { name: "🧸 Teddy Love", value: "🧸" },
  { name: "🐱 Cute Kitten", value: "🐱" },
  { name: "🐶 Playful Pup", value: "🐶" },
  { name: "🌸 Cherry Bloom", value: "🌸" },
  { name: "🕊️ Love Birds", value: "🕊️" },
  { name: "💍 Golden Ring", value: "💍" }
];

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [avatarType, setAvatarType] = useState<"preset" | "upload">("preset");
  const [avatarPreset, setAvatarPreset] = useState("💝");
  const [avatarFileUrl, setAvatarFileUrl] = useState("");

  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [customTitle, setCustomTitle] = useState("Our Story");
  const [themeId, setThemeId] = useState("rose-gold");

  // Milestones
  const [hasProposal, setHasProposal] = useState(false);
  const [proposalDate, setProposalDate] = useState("");
  const [hasEngagement, setHasEngagement] = useState(false);
  const [engagementDate, setEngagementDate] = useState("");
  const [hasWedding, setHasWedding] = useState(false);
  const [weddingDate, setWeddingDate] = useState("");

  const [hasCustomMilestone, setHasCustomMilestone] = useState(false);
  const [customMilestoneTitle, setCustomMilestoneTitle] = useState("");
  const [customMilestoneDate, setCustomMilestoneDate] = useState("");

  // Partner Details
  const [partnerNickname, setPartnerNickname] = useState("");
  const [partnerDesc, setPartnerDesc] = useState("My Anchor ⚓");
  const [partnerAvatarType, setPartnerAvatarType] = useState<"preset" | "upload">("preset");
  const [partnerAvatarPreset, setPartnerAvatarPreset] = useState("💖");
  const [partnerAvatarFileUrl, setPartnerAvatarFileUrl] = useState("");

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Prefill details from authenticated User (Clerk/Google Sign-In)
  useEffect(() => {
    if (isLoaded && user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.firstName) setNickname(user.firstName);
      if (user.primaryEmailAddress?.emailAddress) {
        setEmail(user.primaryEmailAddress.emailAddress);
      }
      if (user.imageUrl) {
        setAvatarType("upload");
        setAvatarFileUrl(user.imageUrl);
      }
    }
  }, [user, isLoaded]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "me" | "partner") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === "me") {
          setAvatarFileUrl(reader.result as string);
        } else {
          setPartnerAvatarFileUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const inviteUrl = `${window.location.origin}/number-loved?invite=${encodeURIComponent(nickname || "Partner")}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/number-loved?invite=${encodeURIComponent(nickname || "Partner")}`
    : "";

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(inviteUrl)}`;

  const validateStep = () => {
    if (step === 1) {
      return fullName.trim() !== "" && nickname.trim() !== "" && dob !== "" && email.trim() !== "";
    }
    if (step === 2) {
      return anniversaryDate !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleComplete = () => {
    // Compile and save onboarding data
    localStorage.setItem("loved_onboarding_completed", "true");
    localStorage.setItem("loved_user_fullname", fullName);
    localStorage.setItem("loved_user_dob", dob);
    localStorage.setItem("loved_user_email", email);

    // Profile details (Person A is me)
    localStorage.setItem("loved_personA", nickname);
    const myAvatar = avatarType === "preset" ? avatarPreset : avatarFileUrl;
    localStorage.setItem("loved_personA_avatar", myAvatar);
    localStorage.setItem("loved_personA_desc", "My Universe 🌌");

    // Anniversary
    localStorage.setItem("loved_anniversary", anniversaryDate);
    localStorage.setItem("loved_title", customTitle);
    localStorage.setItem("loved_theme", themeId);

    // Partner Details (Person B)
    const finalPartnerName = partnerNickname.trim() || "Juliet";
    localStorage.setItem("loved_personB", finalPartnerName);
    localStorage.setItem("loved_personB_desc", partnerDesc);
    const partnerAvatar = partnerAvatarType === "preset" ? partnerAvatarPreset : partnerAvatarFileUrl;
    localStorage.setItem("loved_personB_avatar", partnerAvatar || "💖");

    // Construct Milestones list
    const initialMilestones = [
      {
        id: "anni_together",
        title: "Officially Together 💕",
        date: anniversaryDate,
        description: "The beautiful day our journey officially began.",
        icon: "💖"
      }
    ];

    if (hasProposal && proposalDate) {
      initialMilestones.push({
        id: "proposal_day",
        title: "Proposal Day 💍",
        date: proposalDate,
        description: "The day we promised to be forever.",
        icon: "💍"
      });
    }

    if (hasEngagement && engagementDate) {
      initialMilestones.push({
        id: "engagement_day",
        title: "Engagement Day 💎",
        date: engagementDate,
        description: "Bound by a ring, united by love.",
        icon: "💎"
      });
    }

    if (hasWedding && weddingDate) {
      initialMilestones.push({
        id: "wedding_day",
        title: "Wedding Day ⛪",
        date: weddingDate,
        description: "Our happily ever after begins.",
        icon: "⛪"
      });
    }

    if (hasCustomMilestone && customMilestoneTitle && customMilestoneDate) {
      initialMilestones.push({
        id: "custom_anni_" + Date.now(),
        title: customMilestoneTitle,
        date: customMilestoneDate,
        description: "A special milestone in our hearts.",
        icon: "🌟"
      });
    }

    // Sort milestones chronologically
    initialMilestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem("loved_milestones", JSON.stringify(initialMilestones));

    // Call onComplete callback
    onComplete();
  };

  const currentThemeObj = THEMES.find((t) => t.id === themeId) || THEMES[0];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${currentThemeObj.gradient} text-zinc-800 dark:text-zinc-100 transition-colors duration-500`}>
      <div className="relative w-full max-w-2xl bg-white/75 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Floating background shape for theme preview */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-rose-500/10 dark:bg-rose-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-3xl pointer-events-none" />

        {/* Wizard Header / Progress Indicator */}
        <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-5 mb-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif leading-none">Complete Registration</h1>
              <p className="text-[10px] text-zinc-400 font-sans tracking-wide uppercase mt-1">Step {step} of 4</p>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                onClick={() => {
                  if (s < step || (s > step && validateStep())) {
                    setStep(s);
                  }
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  s === step
                    ? "w-8 bg-gradient-to-r from-rose-500 to-pink-500"
                    : s < step
                    ? "w-2.5 bg-rose-500/50 dark:bg-rose-500/30"
                    : "w-2.5 bg-zinc-200 dark:bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Form Area (Scrollable content) */}
        <div className="flex-1 overflow-y-auto pr-1 select-none flex flex-col gap-6 py-1 scrollbar-thin">
          
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-5 h-5 text-rose-500" />
                  Your Profile Details
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Please provide your personal details to initialize your profile.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Nickname */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nickname / Display Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Romeo"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date of Birth <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 pl-9 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Choose Your Profile Avatar</label>
                <div className="flex gap-4 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 bg-zinc-50/30 dark:bg-zinc-950/20">
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAvatarType("preset")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        avatarType === "preset"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarType("upload")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        avatarType === "upload"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      Upload
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center min-h-[70px]">
                    {avatarType === "preset" ? (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.value}
                            type="button"
                            onClick={() => setAvatarPreset(av.value)}
                            title={av.name}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all border cursor-pointer ${
                              avatarPreset === av.value
                                ? "bg-rose-100 dark:bg-rose-950/40 border-rose-500 scale-110 shadow-sm"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/60"
                            }`}
                          >
                            {av.value}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-950/45 cursor-pointer text-xs font-sans text-zinc-500">
                          <Camera className="w-4 h-4 text-rose-500" />
                          Upload Picture
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "me")}
                            className="hidden"
                          />
                        </label>
                        {avatarFileUrl && (
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-800 shadow-inner">
                            <img src={avatarFileUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ANNIVERSARY & THEME */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  Our Start Date &amp; Theme
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Specify your anniversary day and personalize the atmosphere of your space.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Anniversary Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Anniversary Together Start <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Custom Space Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Custom Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Our Kingdom, Our Story"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Theme Picker */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Initial Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setThemeId(th.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all relative overflow-hidden cursor-pointer ${
                        themeId === th.id
                          ? "border-rose-500 bg-rose-500/10 dark:bg-rose-950/20 scale-[1.02] shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 hover:bg-white/60 dark:hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${th.gradient} border border-zinc-200/50`} />
                      <span className="text-xs font-semibold font-serif truncate mt-1 text-zinc-900 dark:text-white">{th.name}</span>
                      <span className="text-[9px] text-zinc-400 lowercase italic">{th.bgType || "hearts"} style</span>
                      
                      {themeId === th.id && (
                        <div className="absolute right-2 top-2 text-rose-500">
                          <CheckCircle className="w-3.5 h-3.5 fill-rose-500 text-white dark:text-zinc-900" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COMMITMENT MILESTONES */}
          {step === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  Commitment Milestones (Optional)
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Celebrate your love story milestones. Enable and set dates below if you have them.</p>
              </div>

              {/* Proposal Day */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/25 dark:bg-zinc-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💍</span>
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-serif">Proposal Day</span>
                      <p className="text-[9px] text-zinc-400">The day one of you asked, and the other said YES!</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasProposal}
                    onChange={(e) => setHasProposal(e.target.checked)}
                    className="w-4.5 h-4.5 accent-rose-500 rounded border-zinc-350 cursor-pointer"
                  />
                </div>
                {hasProposal && (
                  <input
                    type="date"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white animate-fade-in"
                  />
                )}
              </div>

              {/* Engagement Day */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/25 dark:bg-zinc-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💎</span>
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-serif">Engagement Day</span>
                      <p className="text-[9px] text-zinc-400">Exchanging rings and officially announcing your promise.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasEngagement}
                    onChange={(e) => setHasEngagement(e.target.checked)}
                    className="w-4.5 h-4.5 accent-rose-500 rounded border-zinc-350 cursor-pointer"
                  />
                </div>
                {hasEngagement && (
                  <input
                    type="date"
                    value={engagementDate}
                    onChange={(e) => setEngagementDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white animate-fade-in"
                  />
                )}
              </div>

              {/* Wedding Day */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/25 dark:bg-zinc-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⛪</span>
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-serif">Wedding Day</span>
                      <p className="text-[9px] text-zinc-400">The sacred union, walks down the aisle, and wedding bells.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasWedding}
                    onChange={(e) => setHasWedding(e.target.checked)}
                    className="w-4.5 h-4.5 accent-rose-500 rounded border-zinc-350 cursor-pointer"
                  />
                </div>
                {hasWedding && (
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white animate-fade-in"
                  />
                )}
              </div>

              {/* Custom Anniversary */}
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/25 dark:bg-zinc-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌟</span>
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-serif">Custom Anniversary Milestone</span>
                      <p className="text-[9px] text-zinc-400">First kiss, first trip together, or other special milestones.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasCustomMilestone}
                    onChange={(e) => setHasCustomMilestone(e.target.checked)}
                    className="w-4.5 h-4.5 accent-rose-500 rounded border-zinc-350 cursor-pointer"
                  />
                </div>
                {hasCustomMilestone && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-fade-in">
                    <input
                      type="text"
                      placeholder="Milestone Title (e.g. First Trip ✈️)"
                      value={customMilestoneTitle}
                      onChange={(e) => setCustomMilestoneTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={customMilestoneDate}
                      onChange={(e) => setCustomMilestoneDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none text-zinc-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: PARTNER INVITE & INITIALIZATION */}
          {step === 4 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold font-serif text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  Connect With Partner (Optional)
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Pre-configure your partner&apos;s default details and generate an invite link for them.</p>
              </div>

              {/* Partner Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Partner&apos;s Name / Nickname</label>
                  <input
                    type="text"
                    placeholder="e.g. Juliet"
                    value={partnerNickname}
                    onChange={(e) => setPartnerNickname(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Partner description tag</label>
                  <input
                    type="text"
                    placeholder="e.g. My Anchor ⚓"
                    value={partnerDesc}
                    onChange={(e) => setPartnerDesc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm outline-none focus:border-rose-400 dark:focus:border-rose-500 transition-colors text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Partner Avatar */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Partner Avatar</label>
                <div className="flex gap-4 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-950/20">
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPartnerAvatarType("preset")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        partnerAvatarType === "preset"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerAvatarType("upload")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        partnerAvatarType === "upload"
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      Upload
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center min-h-[70px]">
                    {partnerAvatarType === "preset" ? (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.value}
                            type="button"
                            onClick={() => setPartnerAvatarPreset(av.value)}
                            title={av.name}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all border cursor-pointer ${
                              partnerAvatarPreset === av.value
                                ? "bg-rose-100 dark:bg-rose-950/40 border-rose-500 scale-110 shadow-sm"
                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950/60"
                            }`}
                          >
                            {av.value}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-950/45 cursor-pointer text-xs font-sans text-zinc-500">
                          <Camera className="w-4 h-4 text-rose-500" />
                          Partner Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "partner")}
                            className="hidden"
                          />
                        </label>
                        {partnerAvatarFileUrl && (
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-800 shadow-inner">
                            <img src={partnerAvatarFileUrl} alt="Partner avatar preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invite URL Panel */}
              <div className="p-4.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex flex-col gap-3 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Invite Code &amp; Link</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1 text-[10px] font-bold border-none bg-transparent cursor-pointer font-sans"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                    <button
                      onClick={() => setShowQR((prev) => !prev)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1 text-[10px] font-bold border-none bg-transparent cursor-pointer font-sans"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      {showQR ? "Hide QR" : "Show QR"}
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/65 dark:border-zinc-800 text-[10px] outline-none text-zinc-500 font-mono truncate"
                />

                {showQR && (
                  <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-scale-up w-fit mx-auto mt-1">
                    <img src={qrImageUrl} alt="QR Code Link to invite" className="w-36 h-36 object-contain" />
                    <span className="text-[9px] text-zinc-400 font-sans">Scan to accept invitation on another device</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation Actions */}
        <div className="mt-6 pt-5 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep()}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all cursor-pointer border-none"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-7 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white text-xs font-bold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition-all cursor-pointer border-none"
            >
              <CheckCircle className="w-4.5 h-4.5" />
              Launch Our Kingdom 💖
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
