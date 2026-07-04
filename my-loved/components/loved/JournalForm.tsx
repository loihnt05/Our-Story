"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import EmotionSelector from "./EmotionSelector";

interface JournalFormProps {
  currentUserName: string;
  onSubmitEntry: (emotion: string, content: string) => void;
}

export default function JournalForm({
  currentUserName,
  onSubmitEntry
}: JournalFormProps) {
  const [entryContent, setEntryContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("Loved 💖");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryContent.trim()) return;
    onSubmitEntry(selectedEmotion, entryContent.trim());
    setEntryContent("");
  };

  return (
    <form onSubmit={handleSubmit} className=" flex flex-col gap-3 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/30 border border-zinc-200/30 relative z-30">
      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
        How are you feeling today, {currentUserName}?
      </span>

      <EmotionSelector
        selectedEmotion={selectedEmotion}
        onSelectEmotion={setSelectedEmotion}
      />

      <div className="flex flex-col gap-1">
        <textarea
          value={entryContent}
          onChange={(e) => setEntryContent(e.target.value)}
          placeholder="Tell your partner about your day, experiences or feelings..."
          maxLength={250}
          className="w-full text-xs p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 outline-none resize-none text-zinc-900 dark:text-white min-h-[70px] placeholder:text-zinc-400"
        />
        <div className="text-[10px] text-zinc-400 self-end">
          {entryContent.length}/250
        </div>
      </div>

      <button
        type="submit"
        disabled={!entryContent.trim()}
        className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Share Daily Feeling</span>
      </button>
    </form>
  );
}
