import React from "react";
import { Quote, Plus, X } from "lucide-react";
import { Note } from "./types";

interface LoveBoardProps {
  notes: Note[];
  newNoteText: string;
  setNewNoteText: (val: string) => void;
  newNoteAuthor: string;
  setNewNoteAuthor: (val: string) => void;
  newNoteColor: string;
  setNewNoteColor: (val: string) => void;
  onAddNote: (e: React.FormEvent) => void;
  onRemoveNote: (id: string) => void;
  cardBg: string;
  borderColor: string;
}

export default function LoveBoard({
  notes,
  newNoteText,
  setNewNoteText,
  newNoteAuthor,
  setNewNoteAuthor,
  newNoteColor,
  setNewNoteColor,
  onAddNote,
  onRemoveNote,
  cardBg,
  borderColor
}: LoveBoardProps) {
  return (
    <div className={`p-6 rounded-3xl ${cardBg} border ${borderColor} shadow-xl backdrop-blur-md flex flex-col gap-4 flex-1 hover:shadow-2xl transition-all duration-300`}>
      <h2 className="text-xl font-bold font-serif border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-purple-500 rotate-180" />
          Love Board
        </span>
        <span className="text-xs font-sans text-zinc-400 font-normal">{notes.length} notes</span>
      </h2>

      {/* Note submission */}
      <form onSubmit={onAddNote} className="flex flex-col gap-2 bg-white/50 dark:bg-zinc-900/30 p-3 rounded-2xl border border-zinc-200/30">
        <textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Write a sweet reminder..."
          maxLength={180}
          className="w-full text-sm bg-transparent border-none outline-none resize-none text-zinc-900 dark:text-white min-h-[50px] placeholder:text-zinc-400"
        />
        <div className="flex items-center justify-between border-t border-zinc-200/20 pt-2 gap-2">
          <input
            type="text"
            value={newNoteAuthor}
            onChange={(e) => setNewNoteAuthor(e.target.value)}
            placeholder="Your Name"
            maxLength={15}
            className="text-xs bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-200 font-medium placeholder:text-zinc-400 max-w-[90px]"
          />

          <div className="flex gap-1.5 items-center">
            {["rose", "purple", "amber"].map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => setNewNoteColor(col)}
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                  col === "rose" ? "bg-rose-400" : col === "purple" ? "bg-purple-400" : "bg-amber-400"
                } ${newNoteColor === col ? "scale-125 ring-2 ring-zinc-500/20" : "hover:scale-110"}`}
              />
            ))}
            
            <button
              type="submit"
              className="ml-1.5 flex items-center justify-center p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 flex flex-col gap-3">
        {notes.length === 0 ? (
          <div className="text-center text-zinc-400 dark:text-zinc-500 text-sm py-8 italic">
            No love notes yet. Write the first one!
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-3.5 rounded-2xl border text-sm flex flex-col gap-2 relative group/note shadow-sm hover:translate-y-[-1px] transition-all duration-200 ${
                note.color === "rose" 
                  ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30"
                  : note.color === "purple"
                  ? "bg-purple-50/60 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-900/30"
                  : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30"
              }`}
            >
              <button
                onClick={() => onRemoveNote(note.id)}
                className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-rose-500 opacity-0 group-hover/note:opacity-100 transition-opacity cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">{note.text}</p>
              <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/10 pt-1.5 font-medium mt-1">
                <span className="font-semibold">{note.author}</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
