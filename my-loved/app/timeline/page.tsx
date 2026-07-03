"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calendar, Sparkles, Heart, X } from "lucide-react";
import { THEMES } from "../../components/loved/constants";
import { Milestone } from "../../components/loved/types";
import { useAuth } from "@/components/loved/AuthProvider";
import AccessDenied from "../../components/loved/AccessDenied";

export default function TimelinePage() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [themeId, setThemeId] = useState("rose-gold");
  const [personA, setPersonA] = useState("Romeo");
  const [personB, setPersonB] = useState("Juliet");

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("💖");
  const [image, setImage] = useState("");

  // Floating background hearts
  const [bgHearts, setBgHearts] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Load config
    const savedTheme = localStorage.getItem("loved_theme");
    const savedMilestones = localStorage.getItem("loved_milestones");
    const savedPersonA = localStorage.getItem("loved_personA");
    const savedPersonB = localStorage.getItem("loved_personB");

    if (savedTheme) setThemeId(savedTheme);
    if (savedPersonA) setPersonA(savedPersonA);
    if (savedPersonB) setPersonB(savedPersonB);

    if (savedMilestones) {
      setMilestones(JSON.parse(savedMilestones));
    } else {
      const defaultMilestones = [
        { id: "1", title: "First Met 🌸", date: "2024-11-15", description: "The spark that started everything.", icon: "✨" },
        { id: "2", title: "First Date ☕", date: "2024-12-05", description: "Coffee, laughs, and talking for hours.", icon: "☕" },
        { id: "3", title: "Officially Together 💕", date: "2025-01-01", description: "Holding hands and starting our journey.", icon: "💖" }
      ];
      setMilestones(defaultMilestones);
      localStorage.setItem("loved_milestones", JSON.stringify(defaultMilestones));
    }

    // Generate random background floating hearts
    const hearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 18 + 12,
      delay: Math.random() * -15
    }));
    setBgHearts(hearts);
  }, []);

  // Save changes
  const saveMilestones = (updatedList: Milestone[]) => {
    setMilestones(updatedList);
    localStorage.setItem("loved_milestones", JSON.stringify(updatedList));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newM: Milestone = {
      id: Date.now().toString(),
      title,
      date,
      description: desc,
      icon,
      image
    };

    const updated = [...milestones, newM];
    saveMilestones(updated);

    // Reset Form
    setTitle("");
    setDate("");
    setDesc("");
    setIcon("💖");
    setImage("");
  };

  // Remove Milestone
  const handleRemoveMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    saveMilestones(updated);
  };

  if (!mounted) return null;

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  if (!isSignedIn) {
    return <AccessDenied gradient={currentTheme.gradient} />;
  }

  // Sort milestones: FROM NOW TO BEFORE IN THE PAST (Newest/Latest to Oldest)
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-zinc-800 dark:text-zinc-100 transition-colors duration-500 relative overflow-x-hidden pb-20`}>
      
      {/* Background drifting hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {bgHearts.map((heart) => (
          <svg
            key={heart.id}
            className="absolute text-rose-400/15 dark:text-rose-500/8 animate-float"
            style={{
              left: `${heart.left}%`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              bottom: `-50px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      {/* Floating Header */}
      <header className="relative w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-sm font-semibold hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Story
        </Link>

        <div className="flex items-center gap-2 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-xs font-bold font-serif text-rose-600 dark:text-rose-400">
            {personA} & {personB}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 z-10 relative flex flex-col gap-10">
        
        {/* Title Block */}
        <div className="text-center flex flex-col items-center gap-2 mt-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-rose-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-cursive bg-clip-text text-zinc-950 dark:text-white">
            Our Love Timeline
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-md mt-1">
            Every step, smile, and shared adventure. From the present moment back to the spark that started it all.
          </p>
        </div>

        {/* Two Column Layout: Add Form on Left, Timeline List on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Add Milestone Sticky Card */}
          <div className="md:col-span-4 sticky top-6">
            <div className={`p-6 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.borderColor} shadow-xl backdrop-blur-md flex flex-col gap-4`}>
              <h2 className="text-lg font-bold font-serif border-b pb-2.5 border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-rose-500" />
                Add Milestone
              </h2>

              <form onSubmit={handleAddMilestone} className="flex flex-col gap-3.5 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="First Kiss, Trip to beach..."
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-sm outline-none text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-sm outline-none text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Memory Notes</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Tell our story..."
                    maxLength={200}
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-sm outline-none text-zinc-900 dark:text-white h-20 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Photo Memory</label>
                  {!image ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 cursor-pointer transition-colors text-xs text-zinc-400 font-medium">
                      <span>Click to upload photo 📸</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 aspect-video">
                      <img src={image} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-black/85 text-white transition-colors cursor-pointer animate-scale-up"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Event Emoji Icon</label>
                  <div className="grid grid-cols-5 gap-1.5 mt-1">
                    {["💖", "🌸", "☕", "✈️", "💍", "🏡", "🍿", "🍕", "✨", "🍿"].slice(0, 9).concat(["🎉"]).map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setIcon(em)}
                        className={`text-lg p-1.5 rounded-xl transition-all cursor-pointer ${
                          icon === em 
                            ? "bg-rose-500/10 border-rose-500 border-2" 
                            : "bg-white/40 dark:bg-zinc-800/40 border border-transparent hover:bg-white/60 dark:hover:bg-zinc-800/60"
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Record Memory 📝
                </button>
              </form>
            </div>
          </div>

          {/* Timeline Scrollable Card */}
          <div className="md:col-span-8 flex flex-col">
            {sortedMilestones.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-white/20 dark:bg-black/20 border border-white/10 backdrop-blur-md flex flex-col items-center gap-3">
                <Calendar className="w-12 h-12 opacity-30 text-rose-500" />
                <h3 className="font-bold text-lg">No Milestones Recorded</h3>
                <p className="text-sm text-zinc-400 max-w-xs">
                  Fill in the form on the left to write down your first memory capsule!
                </p>
              </div>
            ) : (
              <div className="relative border-l-2 border-dashed border-rose-300/40 dark:border-rose-700/20 ml-6 pl-8 flex flex-col gap-10">
                {sortedMilestones.map((milestone, idx) => {
                  // Format Date
                  const mDate = new Date(milestone.date);
                  const formattedDay = mDate.getDate();
                  const formattedMonthYear = mDate.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric"
                  });

                  return (
                    <div 
                      key={milestone.id} 
                      className="relative animate-scale-up"
                    >
                      {/* Timeline dot heart */}
                      <span className="absolute -left-[45px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border-2 border-rose-300 dark:border-rose-800 shadow-md text-xs select-none hover:scale-110 transition-transform">
                        ❤️
                      </span>

                      {/* Polaroid Style Card */}
                      <div className="relative bg-white dark:bg-zinc-950 p-5 pt-7 pb-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/70 shadow-lg hover:shadow-xl hover:rotate-1 hover:scale-[1.01] transition-all duration-300 group max-w-lg">
                        
                        {/* Washi Tape / Tape sticker at top */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-rose-200/40 dark:bg-rose-900/20 backdrop-blur-sm border-x border-dashed border-rose-300/30 dark:border-rose-700/10 rotate-[-2deg] select-none" />

                        {/* Floating Emoji Icon */}
                        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center text-lg z-10">
                          {milestone.icon}
                        </div>

                        {/* Polaroid Photo */}
                        {milestone.image && (
                          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900 mb-4 shadow-sm group-hover:scale-[1.01] transition-transform duration-300 select-none">
                            <img
                              src={milestone.image}
                              alt={milestone.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-col gap-1">
                          {/* Cute high-contrast date */}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black font-serif text-rose-500 leading-none">
                              {formattedDay}
                            </span>
                            <span className="text-xs font-bold text-zinc-400 font-serif uppercase tracking-wider">
                              {formattedMonthYear}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white leading-snug mt-2 select-all">
                            {milestone.title}
                          </h3>

                          {milestone.description && (
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic font-serif mt-3 border-l-2 border-rose-200/30 dark:border-rose-800/20 pl-3.5 bg-zinc-50/50 dark:bg-zinc-950/40 py-2.5 rounded-r-xl">
                              &ldquo;{milestone.description}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Floating actions */}
                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-100/50 dark:border-zinc-900/50">
                          <button
                            onClick={() => handleRemoveMilestone(milestone.id)}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-500 font-semibold p-1 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete memory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}
