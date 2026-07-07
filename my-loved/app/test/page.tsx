"use client";

import React, { useState } from "react";
import TimelineMemoryReminder from "@/components/loved/timeline/TimelineMemoryReminder";
import { generateNotificationEmailHtml } from "@/components/loved/email/NotificationEmailTemplate";
import { Sparkles, BookHeart, Mail, Smartphone, Monitor, Code } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"overlay" | "email">("overlay");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [testJournal, setTestJournal] = useState<Array<{ emotion: string; content: string; date: string }>>([]);
  const [heartBursts, setHeartBursts] = useState<number>(0);
  const [emailViewport, setEmailViewport] = useState<"desktop" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(false);

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
      setTimeout(() => {
        setHeartBursts(prev => Math.max(0, prev - 1));
      }, 2000);
    }
  };

  const handleSimulate = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsOpen(true);
  };

  // Generate Email HTML string
  const selectedEmailMilestone = selectedMilestone || MOCK_MILESTONES[1];
  const emailHtml = generateNotificationEmailHtml({
    badgeText: "On This Day Memory",
    title: `On This Day: ${selectedEmailMilestone.title}`,
    description: `Relive this precious moment: ${selectedEmailMilestone.description}`,
    actionUrl: "https://your-story-space.com/timeline",
    ctaText: "Relive Our Memory",
    quote: "Time changes many things, but it only makes my love for you grow stronger. 💖"
  });

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

      <div className="w-full max-w-3xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <BookHeart className="w-8 h-8 text-rose-500" />
            <div className="text-left">
              <h1 className="text-2xl font-bold font-cursive text-zinc-100">Sandbox Preview Dashboard</h1>
              <p className="text-xs text-zinc-400">Interact with overlay popups and HTML email templates.</p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 gap-6">
          <button
            onClick={() => setActiveTab("overlay")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "overlay" ? "border-rose-500 text-rose-500" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Overlay Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "email" ? "border-rose-500 text-rose-500" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>HTML Email Template</span>
          </button>
        </div>

        {/* TAB 1: OVERLAY SANDBOX */}
        {activeTab === "overlay" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-rose-400 flex items-center gap-1.5 text-left">
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

            {/* Simulated Action Log */}
            <div className="flex flex-col gap-3 mt-2 border-t border-zinc-800 pt-6">
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
        )}

        {/* TAB 2: EMAIL PREVIEW */}
        {activeTab === "email" && (
          <div className="flex flex-col gap-5 text-left">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 font-medium">Currently Previews Template for:</span>
                <span className="text-sm font-bold text-zinc-200">{selectedEmailMilestone.title}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
                  title="Toggle Code View"
                >
                  <Code className="w-4 h-4" />
                  <span>{showCode ? "View Visual" : "View Source"}</span>
                </button>

                <div className="flex items-center gap-1 bg-zinc-800 p-1 rounded-xl">
                  <button
                    onClick={() => setEmailViewport("desktop")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      emailViewport === "desktop" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-250"
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEmailViewport("mobile")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      emailViewport === "mobile" ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-250"
                    }`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex justify-center bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 relative overflow-hidden min-h-[500px]">
              {showCode ? (
                <textarea
                  readOnly
                  value={emailHtml}
                  className="w-full h-[500px] bg-zinc-950 text-zinc-300 font-mono text-xs p-4 rounded-xl border border-zinc-800 outline-none select-text"
                />
              ) : (
                <iframe
                  srcDoc={emailHtml}
                  className={`border border-zinc-800 rounded-xl bg-[#faf6f6] transition-all duration-300 ${
                    emailViewport === "desktop" ? "w-full h-[500px]" : "w-[360px] h-[500px]"
                  }`}
                  title="Email Template Sandbox View"
                />
              )}
            </div>

            <div className="p-3 bg-zinc-950/30 border border-zinc-800 rounded-xl text-xs text-zinc-400">
              💡 <strong>Tip:</strong> Click the <strong>Overlay Sandbox</strong> tab, simulate a different anniversary, and switch back here to see this email template update with the selected memory details dynamically!
            </div>
          </div>
        )}
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