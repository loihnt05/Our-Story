import React, { useState } from "react";
import { Sparkles, Trash2, ArrowUp, ArrowDown, Check, Plus } from "lucide-react";
import { DecisionOption } from "./types";
import { POPULAR_EMOJIS } from "./constants";

interface OptionsManagerProps {
  items: DecisionOption[];
  isSpinning: boolean;
  onUpdateItems: (items: DecisionOption[]) => void;
}

export default function OptionsManager({
  items,
  isSpinning,
  onUpdateItems,
}: OptionsManagerProps) {
  // Option additions state
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionEmoji, setNewOptionEmoji] = useState("💖");

  // Option inline editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingEmoji, setEditingEmoji] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;
    
    const newItem: DecisionOption = {
      text: newOptionText.trim(),
      emoji: newOptionEmoji
    };
    
    onUpdateItems([...items, newItem]);
    setNewOptionText("");
    setNewOptionEmoji("💖");
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 2) {
      alert("A wheel needs at least 2 choices to spin! 🎡");
      return;
    }
    onUpdateItems(items.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onUpdateItems(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onUpdateItems(updated);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(items[index].text);
    setEditingEmoji(items[index].emoji);
  };

  const saveEditing = (index: number) => {
    if (!editingText.trim()) return;
    const updated = [...items];
    updated[index] = {
      text: editingText.trim(),
      emoji: editingEmoji
    };
    onUpdateItems(updated);
    setEditingIndex(null);
  };

  return (
    <div className="p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-rose-100/40 dark:border-rose-950/20 backdrop-blur-md flex flex-col gap-4">
      <div className="flex justify-between items-center border-b pb-2 border-zinc-200/30">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Customize Choices</span>
        </h2>
        <span className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full">
          {items.length} options
        </span>
      </div>

      {/* List scroll container */}
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {items.map((item, idx) => {
          const isEditing = editingIndex === idx;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-2 bg-white/40 dark:bg-zinc-955/20 p-2.5 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 hover:scale-[1.01] transition-transform duration-200"
            >
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <select
                    value={editingEmoji}
                    onChange={(e) => setEditingEmoji(e.target.value)}
                    className="p-1 rounded bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-sm outline-none"
                  >
                    {POPULAR_EMOJIS.map(em => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 px-2 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-350 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none"
                    maxLength={35}
                    required
                  />
                  <button
                    onClick={() => saveEditing(idx)}
                    className="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-lg bg-zinc-200/20 dark:bg-zinc-850/40 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                    {item.emoji}
                  </span>
                  <span 
                    onClick={() => !isSpinning && startEditing(idx)}
                    className="flex-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate cursor-pointer hover:underline"
                    title="Click to edit"
                  >
                    {item.text}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0 || isSpinning}
                      className="p-1 text-zinc-400 hover:text-rose-500 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === items.length - 1 || isSpinning}
                      className="p-1 text-zinc-400 hover:text-rose-500 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      disabled={isSpinning}
                      className="p-1 text-zinc-400 hover:text-rose-500 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick add form */}
      <form onSubmit={handleAddItem} className="flex gap-2 mt-2 pt-2 border-t border-zinc-200/30">
        <select
          value={newOptionEmoji}
          onChange={(e) => setNewOptionEmoji(e.target.value)}
          disabled={isSpinning}
          className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-955/40 border border-zinc-200/50 dark:border-zinc-800/40 text-sm outline-none cursor-pointer"
        >
          {POPULAR_EMOJIS.map(em => (
            <option key={em} value={em}>{em}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Add customized choice..."
          value={newOptionText}
          onChange={(e) => setNewOptionText(e.target.value)}
          disabled={isSpinning}
          maxLength={30}
          required
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-zinc-955/40 border border-zinc-200/50 dark:border-zinc-800/40 text-zinc-900 dark:text-white outline-none"
        />
        <button
          type="submit"
          disabled={isSpinning}
          className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
