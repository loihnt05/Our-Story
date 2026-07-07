"use client";

import React, { useState } from "react";
import TimelineMemoryReminder from "@/components/loved/timeline/TimelineMemoryReminder";
import { Sparkles, Calendar, BookHeart, Plus } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  image?: string;
}

const MOCK_MILESTONES: Milestone[] = [
  {
    id: "test-1",
    title: "First Met 🌸",
    date: "2024-11-15",
    description: "The moment our eyes met across the crowded room. Everything else just faded into the background.",
    icon: "✨"
  },
  {
    id: "test-2",
    title: "Romantic Dinner 🍷",
    date: "2025-02-14",
    description: "Our first Valentine's Day dinner. We talked about everything under the stars until the restaurant closed.",
    icon: "🍷",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "test-3",
    title: "Trip to Paris 🗼",
    date: "2025-06-20",
    description: "Walking down the Seine holding hands, eating warm croissants, and watching the Eiffel Tower sparkle.",
    icon: "🗼",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop"
  }
];

export default function TestPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [testJournal, setTestJournal] = useState<Array<{ emotion: string; content: string; date: string }>>([]);
  const [heartBursts, setHeartBursts] = useState<number>(0);

  // Mock loved context to pass to the memory reminder
  const mockLoved = {
    isMuted: true,
    synthRef: { current: null },
    activePartner: "A",
    personAName: "Romeo",
    personBName: "Juliet",
    handleAddJournalEntry: (emotion: string, content: string, date: string) => {
      setTestJournal(prev => [...prev, { emotion, content, date }]);
    },
    triggerHeartBurst: () => {
      setHeartBursts(prev => prev + 1);
      // Create a brief heart burst visual feedback on the test page
      setTimeout(() => {
        setHeartBursts(prev => Math.max(0, prev - 1));
      }, 2000);
    }
  };

  const handleSimulate = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-10 left-10 w-44 h-44 bg-rose-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-44 h-44 bg-pink-500 rounded-full blur-3xl" />
      </div>

      {/* Heart Burst Simulation Visual Feedback */}
      {heartBursts > 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 animate-fade-in">
          <div className="text-6xl animate-ping">💖</div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <BookHeart className="w-8 h-8 text-rose-500" />
          <div className="text-left">
            <h1 className="text-2xl font-bold font-cursive text-zinc-100">Timeline Memory Feature Sandbox</h1>
            <p className="text-xs text-zinc-400">Preview and test client interactions for the new "On This Day" reminder overlay.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-rose-400 flex items-center gap-1.5 text-left">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Select a Milestone to Simulate:</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_MILESTONES.map((m) => (
              <div 
                key={m.id} 
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/35 transition-all flex flex-col justify-between gap-4 group hover:scale-[1.02] text-left"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-3xl">{m.icon}</span>
                  <h3 className="font-bold text-zinc-200 group-hover:text-rose-400 transition-colors leading-tight">{m.title}</h3>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{m.date}</span>
                </div>
                
                <button
                  onClick={() => handleSimulate(m)}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-500 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Simulate Anniversary
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Sandbox Log Output */}
        <div className="flex flex-col gap-3 mt-4 border-t border-zinc-800 pt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 text-left">Simulated Action Log:</h2>
          {testJournal.length === 0 ? (
            <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 text-center text-xs text-zinc-500">
              No reflections recorded yet. Try simulating a milestone and typing a reflection note!
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {testJournal.map((entry, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs flex flex-col gap-1.5 text-left">
                  <div className="flex justify-between items-center text-[10px] text-rose-400 font-bold uppercase">
                    <span>Journal Event Triggered ({entry.emotion})</span>
                    <span>{entry.date}</span>
                  </div>
                  <p className="text-zinc-300 italic font-medium">"{entry.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render the Overlay Component */}
      {isOpen && selectedMilestone && (
        <TimelineMemoryReminder
          milestone={selectedMilestone}
          loved={mockLoved}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}