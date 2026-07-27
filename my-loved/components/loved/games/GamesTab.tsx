"use client";

import React, { useState, useEffect } from "react";
import { 
  Gamepad2, 
  HelpCircle, 
  Camera, 
  Sparkles, 
  Heart, 
  Trophy, 
  ArrowRight,
  Sparkle,
  Award,
  Flame,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  Info
} from "lucide-react";
import QuizTab from "@/components/loved/quiz/QuizTab";
import MemoryGuessTab from "@/components/loved/memory-guess/MemoryGuessTab";
import DecisionWheelTab from "@/components/loved/decision/DecisionWheelTab";

interface GamesTabProps {
  loved: any;
  currentTheme: any;
}

const MEMORY_BADGES = [
  { name: "Nostalgia Novice 🌸", minScore: 0, desc: "Unlocked by default. Start guessing milestones." },
  { name: "Memory Explorer 🗺️", minScore: 100, desc: "Accumulate 100 points in Memory Guessing." },
  { name: "Milestone Keeper 💍", minScore: 250, desc: "Accumulate 250 points in Memory Guessing." },
  { name: "Memory Master 🏆", minScore: 500, desc: "Accumulate 500 points in Memory Guessing." }
];

const QUIZ_ACHIEVEMENTS = [
  { name: "First Date Expert ☕", icon: "☕", minScore: 80, desc: "Unlocked at 80 Intimacy Level points." },
  { name: "Soulmate Connection 💍", icon: "💍", minScore: 90, desc: "Unlocked at 90 Intimacy Level points." },
  { name: "Deep Talk Master 💭", icon: "💭", minScore: 85, desc: "Unlocked at 85 Understanding Level points." },
  { name: "Perfect Match ✨", icon: "✨", minScore: 95, desc: "Unlocked at 95 Intimacy & Understanding points." }
];

export default function GamesTab({ loved, currentTheme }: GamesTabProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"games" | "insights">("games");
  const [activeGame, setActiveGame] = useState<"menu" | "quiz" | "guess" | "wheel">("menu");

  // Consolidating statistics
  const [quizScores, setQuizScores] = useState({ intimacy: 75, understanding: 82, completedWeeks: 3 });
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
  
  const [guessScores, setGuessScores] = useState({ A: 0, B: 0 });
  const [guessStreak, setGuessStreak] = useState(0);

  // Load from local storage
  useEffect(() => {
    // 1. Load Quiz scores
    const savedQuizScores = localStorage.getItem("loved_relationship_scores");
    if (savedQuizScores) setQuizScores(JSON.parse(savedQuizScores));

    // 2. Load Quiz weekly quests
    const savedQuests = localStorage.getItem("loved_weekly_quests");
    if (savedQuests) {
      setWeeklyTasks(JSON.parse(savedQuests));
    } else {
      const defaultTasks = [
        { id: "1", text: "Taking photos together 📸", completed: false, points: 10, icon: "📸" },
        { id: "2", text: "Watching a movie together 🍿", completed: false, points: 15, icon: "🍿" },
        { id: "3", text: "Trying a new dish 🍳", completed: false, points: 12, icon: "🍳" },
        { id: "4", text: "Write a short love letter ✉️", completed: false, points: 14, icon: "✉️" }
      ];
      setWeeklyTasks(defaultTasks);
      localStorage.setItem("loved_weekly_quests", JSON.stringify(defaultTasks));
    }

    // 3. Load Memory Guess scores
    const savedGuessScores = localStorage.getItem("loved_memory_guess_scores");
    if (savedGuessScores) setGuessScores(JSON.parse(savedGuessScores));

    // 4. Load Memory Guess streak
    const savedStreak = localStorage.getItem("loved_memory_guess_streak");
    if (savedStreak) setGuessStreak(parseInt(savedStreak, 10));
  }, [activeTab, activeGame]); // Sync whenever user changes tabs

  // Couple Quest toggle checklist handler
  const handleToggleQuest = (id: string) => {
    const updatedTasks = weeklyTasks.map(t => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setWeeklyTasks(updatedTasks);
    localStorage.setItem("loved_weekly_quests", JSON.stringify(updatedTasks));

    // Calculate new intimacy/understanding scores
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const newIntimacy = Math.min(100, 75 + (completedCount * 5));
    const newUnderstanding = Math.min(100, 82 + (completedCount * 4));
    
    let nextWeeksCompleted = quizScores.completedWeeks;
    const isAllDone = completedCount === 4;
    const wasAllDone = weeklyTasks.filter(t => t.completed).length === 4;
    
    if (isAllDone && !wasAllDone) {
      nextWeeksCompleted += 1;
    } else if (!isAllDone && wasAllDone) {
      nextWeeksCompleted = Math.max(0, nextWeeksCompleted - 1);
    }

    const nextScores = {
      intimacy: newIntimacy,
      understanding: newUnderstanding,
      completedWeeks: nextWeeksCompleted
    };
    
    setQuizScores(nextScores);
    localStorage.setItem("loved_relationship_scores", JSON.stringify(nextScores));
  };

  const gameSelections = [
    {
      id: "quiz",
      name: "Love Quiz 🧩",
      desc: "Discover how well you know your partner's secrets, daily preferences, and thoughts in a cute compatibility match game.",
      longDesc: "Take turns answering daily questions, match rating scales, or seal time capsules to reveal in the future together.",
      icon: HelpCircle,
      gradient: "from-rose-500 to-pink-500",
      bgHover: "hover:shadow-rose-500/10",
      badge: "Intimacy 💖"
    },
    {
      id: "guess",
      name: "Memory Guess 📸",
      desc: "An interactive polaroid game where you guess dates, locations, and details of past trips and relationship milestones.",
      longDesc: "Flips 3D polaroid photo frames to reveal correct timeline entries, earn score streaks, and unlock relationship mastery badges.",
      icon: Camera,
      gradient: "from-purple-500 to-indigo-500",
      bgHover: "hover:shadow-indigo-500/10",
      badge: "Nostalgia 🗺️"
    },
    {
      id: "wheel",
      name: "Decision Wheel 🎡",
      desc: "Can't agree on what to do next? Spin the customized wheel of dates, dinners, or fun couple challenges to decide!",
      longDesc: "Add your own wheel categories, save favorite pickers, play tick sound effects, and log results directly to your timeline.",
      icon: Sparkles,
      gradient: "from-amber-500 to-orange-500",
      bgHover: "hover:shadow-amber-500/10",
      badge: "Spontaneity ⚡"
    }
  ] as const;

  // Active game sub-renderings
  if (activeGame === "quiz") {
    return <QuizTab loved={loved} currentTheme={currentTheme} onBack={() => setActiveGame("menu")} />;
  }

  if (activeGame === "guess") {
    return <MemoryGuessTab loved={loved} currentTheme={currentTheme} onBack={() => setActiveGame("menu")} />;
  }

  if (activeGame === "wheel") {
    return <DecisionWheelTab loved={loved} currentTheme={currentTheme} onBack={() => setActiveGame("menu")} />;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-1 sm:px-4 py-2 animate-scale-up select-none">
      
      {/* Game Center Header Banner */}
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/25 border border-white/20 backdrop-blur-md">
        <div>
          <h1 className="text-2xl md:text-3xl font-cursive font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center md:justify-start gap-2">
            <Gamepad2 className="w-6.5 h-6.5 text-rose-500" />
            <span>Couple Game Center</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Overcome decision fatigue, relive sweet memories, and test compatibility together! 🎮💖
          </p>
        </div>
      </div>

      {/* Primary Tab Selectors */}
      <div className="flex gap-1.5 p-1 bg-zinc-200/30 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/10 w-fit self-center md:self-start">
        <button
          onClick={() => setActiveTab("games")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "games"
              ? "bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-sm border border-zinc-200/10"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Game Zone</span>
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "insights"
              ? "bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-sm border border-zinc-200/10"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Insights &amp; Badges</span>
        </button>
      </div>

      {/* GAME ZONE SUB-TAB */}
      {activeTab === "games" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {gameSelections.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`group flex flex-col justify-between p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/40 backdrop-blur-md shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer ${game.bgHover}`}
              >
                <div className="flex flex-col gap-4">
                  
                  {/* Card Icon & Badge */}
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center shadow-md shadow-pink-500/10 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/10 flex items-center gap-1">
                      <Sparkle className="w-2.5 h-2.5 animate-spin-slow" />
                      <span>{game.badge}</span>
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="text-left flex flex-col gap-1.5 mt-2">
                    <h3 className="text-md font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                      <span>{game.name}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                      {game.desc}
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal border-t border-zinc-200/20 pt-2 mt-1">
                      {game.longDesc}
                    </p>
                  </div>

                </div>

                {/* Action Button */}
                <div className="mt-6 flex items-center justify-between text-xs font-bold text-rose-500 group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>Play Game Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INSIGHTS & BADGES SUB-TAB */}
      {activeTab === "insights" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-2 text-left">
          
          {/* LEFT COLUMN: Connection Meters & Weekly Mission (Col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Connection Meters (Intimacy / Understanding) */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md flex flex-col gap-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-500" />
                <span>Relationship Connection Meters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Intimacy level */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                      <span>Intimacy Level</span>
                    </span>
                    <span className="text-rose-500 font-extrabold text-sm">{quizScores.intimacy}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-zinc-200/50 dark:bg-zinc-950/50 overflow-hidden relative border border-zinc-200/10 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${quizScores.intimacy}%` }}
                    />
                  </div>
                </div>

                {/* Understanding level */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>Understanding Level</span>
                    </span>
                    <span className="text-amber-500 font-extrabold text-sm">{quizScores.understanding}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-zinc-200/50 dark:bg-zinc-950/50 overflow-hidden relative border border-zinc-200/10 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${quizScores.understanding}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Quests Section */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md flex flex-col gap-4">
              <div>
                <span className="text-[9px] font-extrabold text-rose-500 uppercase tracking-widest">Weekly Mission 📅</span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-cursive">Couple Quests</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Complete these weekly tasks together to raise connection meters.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {weeklyTasks.map((task) => (
                  <label 
                    key={task.id} 
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200 hover:scale-[1.01] ${
                      task.completed 
                        ? "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-455" 
                        : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/20 hover:bg-white/60 dark:hover:bg-zinc-950/30 text-zinc-700 dark:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => handleToggleQuest(task.id)}
                        className="w-4.5 h-4.5 rounded border-zinc-300 text-rose-500 focus:ring-rose-500 cursor-pointer accent-rose-500"
                      />
                      <span className={`text-xs font-bold ${task.completed ? "line-through opacity-75" : ""}`}>
                        {task.text}
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 px-2.5 py-0.5 rounded text-rose-500">
                      +{task.points} Pts
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Scores Leaderboard & Badges Board (Col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Gamification Stats Board */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" />
                <span>Memory Guess Leaderboard</span>
              </h2>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/40">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <span>🥇</span>
                  <span>{loved.personAName}</span>
                </span>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">{guessScores.A} pts</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/40">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <span>🥈</span>
                  <span>{loved.personBName}</span>
                </span>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">{guessScores.B} pts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 animate-bounce fill-amber-500/15" />
                <span>Current correct memory guess streak: {guessStreak} days</span>
              </div>
            </div>

            {/* Badges Panel */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-rose-500" />
                <span>Couple Mastery Badges</span>
              </h2>

              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                {/* Memory Badges */}
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block pl-1">Memory Guess Levels</span>
                {MEMORY_BADGES.map((badge, idx) => {
                  const unlocked = (guessScores.A + guessScores.B) >= badge.minScore;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border flex gap-3 items-center transition-all ${
                        unlocked 
                          ? "bg-purple-500/5 border-purple-500/20" 
                          : "opacity-45 border-transparent bg-zinc-200/20 dark:bg-zinc-950/20"
                      }`}
                    >
                      <span className="text-2xl">{unlocked ? "🏆" : "🔒"}</span>
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-extrabold ${unlocked ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>
                          {badge.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 mt-0.5 leading-tight">
                          {badge.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="w-[1px] h-3" />

                {/* Quiz Achievements */}
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block pl-1">Quiz Achievements</span>
                {QUIZ_ACHIEVEMENTS.map((ach, idx) => {
                  const scoreToCheck = ach.name.includes("Talk") ? quizScores.understanding : quizScores.intimacy;
                  const unlocked = scoreToCheck >= ach.minScore;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border flex gap-3 items-center transition-all ${
                        unlocked 
                          ? "bg-rose-500/5 border-rose-500/20" 
                          : "opacity-45 border-transparent bg-zinc-200/20 dark:bg-zinc-950/20"
                      }`}
                    >
                      <span className="text-2xl">{unlocked ? ach.icon : "🔒"}</span>
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-extrabold ${unlocked ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>
                          {ach.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 mt-0.5 leading-tight">
                          {ach.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
