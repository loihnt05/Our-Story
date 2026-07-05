"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface MilestoneFormProps {
  cardBg: string;
  borderColor: string;
  onAddMilestone: (title: string, date: string, desc: string, icon: string, image: string) => void;
}

export default function MilestoneForm({
  cardBg,
  borderColor,
  onAddMilestone
}: MilestoneFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("💖");
  const [image, setImage] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddMilestone(title, date, desc, icon, image);
    
    // Reset form
    setTitle("");
    setDate("");
    setDesc("");
    setIcon("💖");
    setImage("");
  };

  return (
    <div className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-4 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 ease-in-out`}>
      <h2 className="text-lg font-bold font-cursive border-b pb-2.5 border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-2">
        <Plus className="w-4.5 h-4.5 text-rose-500" />
        Add Milestone
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-2">
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
              <img src={image} className="w-full h-full object-cover" alt="Upload Preview" />
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
            {["💖", "🌸", "☕", "✈️", "💍", "🏡", "🍿", "🍕", "✨", "🎉"].map((em) => (
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
  );
}
