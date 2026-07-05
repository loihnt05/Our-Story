"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { THEMES } from "@/components/loved/core/constants";
import { Milestone } from "@/components/loved/core/types";
import { useAuth } from "@/components/loved/core/AuthProvider";
import AccessDenied from "@/components/loved/core/AccessDenied";
import ThemeBackground from "@/components/loved/core/ThemeBackground";
import { useTheme } from "next-themes";
import MilestoneForm from "@/components/loved/timeline/MilestoneForm";
import MilestoneCard from "@/components/loved/timeline/MilestoneCard";

export default function TimelinePage() {
  const { isSignedIn } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [themeId, setThemeId] = useState("rose-gold");
  const [personA, setPersonA] = useState("Romeo");
  const [personB, setPersonB] = useState("Juliet");

  // Floating background hearts
  const [bgHearts, setBgHearts] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number }>>([]);

  const prevThemeIdRef = React.useRef(themeId);
  const prevResolvedThemeRef = React.useRef(resolvedTheme);

  // Sync next-themes and visual theme
  React.useEffect(() => {
    // 1. If visual theme (themeId) changed
    if (prevThemeIdRef.current !== themeId) {
      const newThemeObj = THEMES.find((t) => t.id === themeId);
      if (newThemeObj) {
        const expectedNextTheme = newThemeObj.isDark ? "dark" : "light";
        if (resolvedTheme !== expectedNextTheme) {
          setTheme(expectedNextTheme);
          prevResolvedThemeRef.current = expectedNextTheme;
        }
      }
      prevThemeIdRef.current = themeId;
    }

    // 2. If next-themes (resolvedTheme) changed
    if (prevResolvedThemeRef.current !== resolvedTheme && resolvedTheme) {
      const currentThemeObj = THEMES.find((t) => t.id === themeId);
      const isCurrentlyDark = currentThemeObj?.isDark ?? false;
      const expectedIsDark = resolvedTheme === "dark";

      if (isCurrentlyDark !== expectedIsDark) {
        const matchingTheme = expectedIsDark 
          ? "starry-galaxy" 
          : "rose-gold";
        
        setThemeId(matchingTheme);
        localStorage.setItem("loved_theme", matchingTheme);
        prevThemeIdRef.current = matchingTheme;
      }
      prevResolvedThemeRef.current = resolvedTheme;
    }
  }, [themeId, resolvedTheme, setTheme]);

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

    // Generate random background floating hearts (more hearts, faster speed)
    const hearts = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 8 + 6, // 6s to 14s (faster!)
      delay: Math.random() * -10
    }));
    setBgHearts(hearts);
  }, []);

  // Save changes
  const saveMilestones = (updatedList: Milestone[]) => {
    setMilestones(updatedList);
    localStorage.setItem("loved_milestones", JSON.stringify(updatedList));
  };

  // Add Milestone
  const handleAddMilestone = (title: string, date: string, desc: string, icon: string, image: string) => {
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
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-zinc-800 dark:text-zinc-100 transition-colors duration-500 relative overflow-x-clip pb-20`}>
      
      {/* Theme Animated Background */}
      <ThemeBackground 
        bgType={currentTheme.bgType} 
        floatingHearts={bgHearts} 
        particleColors={currentTheme.particleColors} 
      />

      <div className="relative z-10 flex flex-col w-full">
        {/* Floating Header */}
        <header className="relative w-full max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
          <div className="md:col-span-4 flex justify-start">
            <Link
              href="/number-loved"
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-white/40 dark:bg-zinc-800/40 border border-white/20 backdrop-blur-md shadow-sm text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
              <span>Go Back Home</span>
            </Link>
          </div>

          <div className="md:col-span-8 flex justify-end max-w-lg md:ml-6 md:pl-8 w-full">
            <span className="text-xl font-bold font-cursive flex items-center gap-1.5 text-zinc-900 dark:text-white bg-white/40 dark:bg-zinc-800/40 px-4 py-2 border border-white/20 rounded-full shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              Our Memory Lane
            </span>
          </div>
        </header>

        <main className="relative w-full max-w-6xl mx-auto px-6 flex flex-col gap-10 mt-6 items-center">
          {/* Two Column Layout: Add Form on Left, Timeline List on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
            
            {/* Add Milestone Sticky Card */}
            <div className="md:col-span-4 md:sticky md:top-[calc(max(24px,50vh-280px))] top-4 transition-all duration-500 ease-in-out">
              <MilestoneForm
                cardBg={currentTheme.cardBg}
                borderColor={currentTheme.borderColor}
                onAddMilestone={handleAddMilestone}
              />
            </div>

            {/* Timeline Scrollable Card */}
            <div className="md:col-span-8 flex flex-col w-full">
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
                  {sortedMilestones.map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      onRemoveMilestone={handleRemoveMilestone}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
