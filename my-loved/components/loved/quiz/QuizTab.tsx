"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Trophy, 
  Lock, 
  Heart, 
  Sparkles, 
  Plus, 
  Camera, 
  BookOpen, 
  Award,
  HelpCircle,
  Flame,
  X
} from "lucide-react";

interface QuizTabProps {
  loved: any;
  currentTheme: any;
  onBack?: () => void;
}

export default function QuizTab({ loved, currentTheme, onBack }: QuizTabProps) {
  // Local States
  const [quizActiveTab, setQuizActiveTab] = useState<"quiz" | "capsules">("quiz");
  const [quizGameState, setQuizGameState] = useState<"idle" | "playing" | "reveal">("idle");
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizAnswersA, setQuizAnswersA] = useState<string[]>([]);
  const [quizAnswersB, setQuizAnswersB] = useState<string[]>([]);
  
  // Time capsule states
  const [capsuleMessage, setCapsuleMessage] = useState("");
  const [capsuleDuration, setCapsuleDuration] = useState("1");
  const [sealedCapsules, setSealedCapsules] = useState<any[]>([]);

  // Custom quiz packs
  const [customPacks, setCustomPacks] = useState<any[]>([]);
  const [newPackName, setNewPackName] = useState("");
  const [newPackDesc, setNewPackDesc] = useState("");
  const [newPackCover, setNewPackCover] = useState("💖");

  // Saved quiz memories
  const [savedQuizMemories, setSavedQuizMemories] = useState<any[]>([]);

  // Weekly couple quest tasks list
  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
  const [scores, setScores] = useState({
    intimacy: 75,
    understanding: 82,
    completedWeeks: 3
  });

  // Predefined Trivia questions
  const quizQuestions = [
    {
      id: 1,
      type: "choice",
      question: "What is my absolute favorite way to spend a rainy Sunday afternoon? 🌧️",
      options: [
        "Sipping hot coffee & reading a novel ☕",
        "Playing video games under cozy blankets 🎮",
        "Binge-watching romantic movies 🍿",
        "Taking a long cozy nap 💤"
      ]
    },
    {
      id: 2,
      type: "choice",
      question: "Where is my dream vacation destination that we haven't visited yet? ✈️",
      options: [
        "Kyoto, Japan during cherry blossom season 🇯🇵",
        "Amalfi Coast, Italy in summer 🇮🇹",
        "Glass igloo stargazing in Finland 🌌",
        "Overwater villa in Bora Bora 🌊"
      ]
    },
    {
      id: 3,
      type: "rating",
      question: "Rate how much you enjoy our late-night spontaneous drives together: 🚗💫",
      options: [
        "⭐ 1 - Not really a fan",
        "⭐⭐ 2 - It's okay occasionally",
        "⭐⭐⭐ 3 - I love it!",
        "⭐⭐⭐⭐ 4 - My absolute favorite thing to do!"
      ]
    }
  ];

  const gameModes = [
    { name: "Guess My Answer", desc: "One partner answers, the other guesses! Reveal animations show correct / wrong matches.", icon: HelpCircle, color: "text-rose-500 bg-rose-500/10" },
    { name: "Both Answer", desc: "Both answer privately in secret, then reveal simultaneously to celebrate matched hearts.", icon: Heart, color: "text-purple-500 bg-purple-500/10" },
    { name: "Multiple Choice Challenge", desc: "Classic multiple-choice tests with instant scoring and fun competitive badges.", icon: Trophy, color: "text-amber-500 bg-amber-500/10" },
    { name: "Deep Talk Questions", desc: "Cozy relationship prompts that encourage open talks and long-form memory logs.", icon: BookOpen, color: "text-teal-500 bg-teal-500/10" },
    { name: "Daily Love Challenge", desc: "New questions released every day to build your streak and earn unlockables.", icon: Sparkles, color: "text-pink-500 bg-pink-500/10" }
  ];

  const questionCategories = [
    { name: "Love & Romance ❤️", count: 24, progress: 80, date: "Today" },
    { name: "Personality 🌸", count: 18, progress: 50, date: "Yesterday" },
    { name: "Favorites & Interests 🎵", count: 30, progress: 100, date: "June 28" },
    { name: "Memories 📸", count: 15, progress: 20, date: "June 25" },
    { name: "Future Plans ✈️", count: 20, progress: 40, date: "Never" },
    { name: "Lifestyle 🏡", count: 22, progress: 60, date: "June 20" },
    { name: "Dreams & Goals 💭", count: 16, progress: 10, date: "Never" },
    { name: "Fun & Silly 😂", count: 25, progress: 90, date: "Today" }
  ];

  const achievements = [
    { name: "First Date Expert", desc: "Correctly matched all questions in Favorites & Interests.", icon: "☕", unlocked: true },
    { name: "Soulmate", desc: "Scored a perfect 100% match on a 10-question pack.", icon: "💍", unlocked: true },
    { name: "Memory Keeper", desc: "Saved 20 or more quiz summaries into your Memory Collection.", icon: "📸", unlocked: false },
    { name: "Deep Talk Master", desc: "Completed 5 question packs in the Deep Talk Category.", icon: "💭", unlocked: true },
    { name: "Future Planner", desc: "Finished all Future Plans questions.", icon: "✈️", unlocked: false },
    { name: "Perfect Match", desc: "Achieve three perfect match scores in a row.", icon: "✨", unlocked: true },
    { name: "30 Day Streak", desc: "Maintained a daily quiz streak for 30 consecutive days.", icon: "🔥", unlocked: false },
    { name: "100 Completed", desc: "Answered 100 questions in total.", icon: "💯", unlocked: true }
  ];

  // Load from local storage
  useEffect(() => {
    const savedCapsules = localStorage.getItem("loved_sealed_capsules");
    if (savedCapsules) setSealedCapsules(JSON.parse(savedCapsules));

    const savedPacks = localStorage.getItem("loved_custom_quiz_packs");
    if (savedPacks) setCustomPacks(JSON.parse(savedPacks));

    const savedMemories = localStorage.getItem("loved_quiz_memories");
    if (savedMemories) setSavedQuizMemories(JSON.parse(savedMemories));

    // Load weekly quests
    const savedQuests = localStorage.getItem("loved_weekly_quests");
    if (savedQuests) {
      setWeeklyTasks(JSON.parse(savedQuests));
    } else {
      const defaultTasks = [
        { id: "1", text: "Taking photos together 📸", completed: false, points: 10, icon: "📸" },
        { id: "2", text: "Watching a movie together 🍿", completed: false, points: 15, icon: "🍿" },
        { id: "3", text: "Trying a new dish 🍳", completed: false, points: 12, icon: "🍳" },
        { id: "4", text: "Making a 30-minute phone call 📞", completed: false, points: 10, icon: "📞" }
      ];
      setWeeklyTasks(defaultTasks);
      localStorage.setItem("loved_weekly_quests", JSON.stringify(defaultTasks));
    }

    const savedScores = localStorage.getItem("loved_relationship_scores");
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    } else {
      const defaultScores = {
        intimacy: 75,
        understanding: 82,
        completedWeeks: 3
      };
      setScores(defaultScores);
      localStorage.setItem("loved_relationship_scores", JSON.stringify(defaultScores));
    }
  }, []);

  const handleSelectQuizAnswer = (option: string) => {
    if (quizCurrentIndex === 0) {
      setQuizAnswersA([...quizAnswersA, option]);
      setQuizAnswersB([...quizAnswersB, option]);
    } else if (quizCurrentIndex === 1) {
      setQuizAnswersA([...quizAnswersA, option]);
      setQuizAnswersB([...quizAnswersB, "Glass igloo stargazing in Finland 🌌"]);
    } else {
      setQuizAnswersA([...quizAnswersA, option]);
      setQuizAnswersB([...quizAnswersB, option]);
    }

    if (quizCurrentIndex < quizQuestions.length - 1) {
      setQuizCurrentIndex(prev => prev + 1);
    } else {
      setQuizGameState("reveal");
    }
  };

  const getQuizMatchPercentage = () => {
    let m = 0;
    for (let i = 0; i < quizAnswersA.length; i++) {
      if (quizAnswersA[i] === quizAnswersB[i]) m++;
    }
    return Math.round((m / quizAnswersA.length) * 100);
  };

  const resetQuizGame = () => {
    setQuizCurrentIndex(0);
    setQuizAnswersA([]);
    setQuizAnswersB([]);
    setQuizGameState("idle");
  };

  const handleSaveQuizToMemories = () => {
    const updated = [
      ...savedQuizMemories,
      {
        id: Date.now().toString(),
        question: "Rainy Sunday Preference 🌧️",
        ansA: quizAnswersA[0] || "No answer",
        ansB: quizAnswersB[0] || "No answer",
        match: quizAnswersA[0] === quizAnswersB[0],
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      },
      {
        id: (Date.now() + 1).toString(),
        question: "Dream Destination ✈️",
        ansA: quizAnswersA[1] || "No answer",
        ansB: quizAnswersB[1] || "No answer",
        match: quizAnswersA[1] === quizAnswersB[1],
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      }
    ];

    setSavedQuizMemories(updated);
    localStorage.setItem("loved_quiz_memories", JSON.stringify(updated));
    alert("Saved to Memory Collection! 💖");
    resetQuizGame();
  };

  const handleCreatePack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackName) return;

    const updated = [
      ...customPacks,
      {
        id: Date.now().toString(),
        name: newPackName,
        desc: newPackDesc || "Custom question pack",
        count: 5,
        cover: newPackCover
      }
    ];

    setCustomPacks(updated);
    localStorage.setItem("loved_custom_quiz_packs", JSON.stringify(updated));
    setNewPackName("");
    setNewPackDesc("");
    setNewPackCover("💖");
    alert("Question Pack Created! 📝");
  };

  const handleSealCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleMessage) return;

    const today = new Date();
    const open = new Date();
    open.setMonth(today.getMonth() + parseInt(capsuleDuration, 10));

    const updated = [
      ...sealedCapsules,
      {
        id: Date.now().toString(),
        message: capsuleMessage,
        date: today.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        openDate: open.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        duration: capsuleDuration
      }
    ];

    setSealedCapsules(updated);
    localStorage.setItem("loved_sealed_capsules", JSON.stringify(updated));
    setCapsuleMessage("");
    alert("Capsule Sealed with Love! 🔒💖");
  };

  const handleToggleTask = (id: string) => {
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
    const originalScores = localStorage.getItem("loved_relationship_scores");
    const parsedOriginal = originalScores ? JSON.parse(originalScores) : { intimacy: 75, understanding: 82, completedWeeks: 3 };
    
    const newIntimacy = Math.min(100, parsedOriginal.intimacy + (completedCount * 5));
    const newUnderstanding = Math.min(100, parsedOriginal.understanding + (completedCount * 4));
    
    let nextWeeksCompleted = parsedOriginal.completedWeeks;
    const isAllDone = completedCount === 4;
    const wasAllDone = weeklyTasks.filter(t => t.completed).length === 4;
    if (isAllDone && !wasAllDone) {
      nextWeeksCompleted += 1;
      alert("Intimacy Unlocked! You've completed this week's Couple Quest! 🏆💖");
    } else if (!isAllDone && wasAllDone) {
      nextWeeksCompleted = Math.max(0, nextWeeksCompleted - 1);
    }

    const nextScores = {
      intimacy: newIntimacy,
      understanding: newUnderstanding,
      completedWeeks: nextWeeksCompleted
    };
    setScores(nextScores);
    localStorage.setItem("loved_relationship_scores", JSON.stringify(nextScores));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pb-12 flex flex-col gap-6 text-left">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/40 text-xs font-bold text-zinc-500 hover:text-rose-500 hover:scale-[1.01] transition-all cursor-pointer w-fit self-start"
        >
          <span>⬅️ Back to Game Center</span>
        </button>
      )}
      {/* Sub tabs quiz section */}
      <div className="max-w-md mx-auto w-full flex items-center justify-center shrink-0">
        <div className="flex bg-white/20 dark:bg-zinc-950/20 p-1 rounded-2xl border border-white/20 dark:border-zinc-800/10 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setQuizActiveTab("quiz")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              quizActiveTab === "quiz" ? "bg-white dark:bg-zinc-800 text-rose-500 shadow-sm" : "text-zinc-550 dark:text-zinc-300"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Quiz &amp; Play</span>
          </button>
          <button
            onClick={() => setQuizActiveTab("capsules")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              quizActiveTab === "capsules" ? "bg-white dark:bg-zinc-800 text-rose-500 shadow-sm" : "text-zinc-550 dark:text-zinc-300"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Time Capsules</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        {quizActiveTab === "quiz" && (
          <div className="flex flex-col gap-8">
            {quizGameState === "playing" && (
              <div className="w-full max-w-lg mx-auto p-6 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-xl backdrop-blur-md flex flex-col gap-6 animate-scale-up">
                <div className="flex items-center justify-between border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Question {quizCurrentIndex + 1} of {quizQuestions.length}
                  </span>
                  <button onClick={resetQuizGame} className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer border-none bg-transparent">
                    Exit Game
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-tr from-rose-500/5 to-purple-500/5 border border-rose-500/10 text-center">
                  <h3 className="text-base font-extrabold leading-relaxed text-zinc-800 dark:text-zinc-100">
                    {quizQuestions[quizCurrentIndex].question}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {quizQuestions[quizCurrentIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizAnswer(option)}
                      className="w-full p-4 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 text-left transition-all duration-205 cursor-pointer shadow-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quizGameState === "reveal" && (
              <div className="w-full max-w-md mx-auto p-6 rounded-[32px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-xl backdrop-blur-md flex flex-col items-center gap-6 animate-scale-up">
                <div className="relative mt-2">
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center border-4 border-rose-300 shadow-md">
                    <Heart className="w-10 h-10 text-white fill-current animate-bounce" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-serif mt-1 animate-pulse" style={{ fontFamily: "var(--font-molle)" }}>
                    {getQuizMatchPercentage()}% Match!
                  </h3>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest mt-1">Perfect Harmony</h4>
                </div>

                <div className="flex flex-col gap-3.5 w-full mt-2">
                  <div className="p-4.5 rounded-2xl bg-zinc-55 dark:bg-zinc-950/40 border border-zinc-200/55 dark:border-zinc-800/40 text-left">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Question 1: Sunday Prefs 🌧️</h5>
                    <div className="grid grid-cols-2 gap-4 mt-2 border-t pt-2 border-zinc-205/20">
                      <div>
                        <span className="text-[9px] font-bold text-rose-500 block uppercase">{loved.personAName}</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{quizAnswersA[0]}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-pink-500 block uppercase">{loved.personBName}</span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{quizAnswersB[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full mt-2">
                  <button onClick={handleSaveQuizToMemories} className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md transition-all hover:scale-102 cursor-pointer border-none">
                    Save to Memory 📸
                  </button>
                  <button onClick={resetQuizGame} className="flex-1 py-3 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold text-xs transition-all hover:scale-102 cursor-pointer border-none">
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {quizGameState === "idle" && (
              <>
                <div className="w-full p-6 sm:p-8 rounded-[32px] bg-white/35 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/20 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-1.5 bg-rose-500/10 text-rose-500 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-rose-500/20 shadow-sm w-max">
                      <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                      <span>15 Day Daily Streak</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-cursive leading-tight">
                        How Well Do You Know Me?
                      </h2>
                      <p className="text-xs font-cursive text-zinc-550 dark:text-zinc-400 mt-1 max-w-sm leading-normal">
                        Test your relationship chemistry, guess secrets, and write down cute memory capsules together!
                      </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto mt-2">
                      <button onClick={() => setQuizGameState("playing")} className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all hover:scale-105 cursor-pointer border-none">
                        Start Today&apos;s Quiz 🚀
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 min-w-[140px] shadow-sm select-none">
                    <Heart className="w-8 h-8 fill-current text-rose-500 animate-pulse" />
                    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-serif mt-1" style={{ fontFamily: "var(--font-molle)" }}>
                      94%
                    </span>
                    <span className="text-[9px] font-bold text-zinc-455 uppercase tracking-widest">Match Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full items-stretch">
                  {[
                    { label: "Match Score", value: "94%", detail: "Perfect sync", icon: Heart, color: "text-rose-500" },
                    { label: "Answered", value: "152", detail: "Out of 200", icon: HelpCircle, color: "text-indigo-500" },
                    { label: "Streak", value: "15 days", detail: "Longest: 328", icon: Flame, color: "text-amber-500" },
                    { label: "Memories", value: "48 caps", detail: "Saved timelines", icon: Camera, color: "text-teal-500" },
                    { label: "Shared Topics", value: "Romance", detail: "Favorite area", icon: BookOpen, color: "text-purple-500" }
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-md backdrop-blur-md flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-300">
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                      <div className="text-left mt-4">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{card.label}</span>
                        <h4 className="text-xl font-bold mt-1 text-zinc-850 dark:text-zinc-100" style={{ fontFamily: "var(--font-molle)" }}>
                          {card.value}
                        </h4>
                        <span className="text-[9px] font-medium text-zinc-400 mt-0.5 block">{card.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weekly Love Quest Section */}
                <div className="w-full p-6 sm:p-8 rounded-[32px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-xl backdrop-blur-md flex flex-col md:flex-row gap-8 items-stretch hover:shadow-2xl transition-all duration-300">
                  {/* Left: Tasks List */}
                  <div className="flex-1 flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">Weekly Mission 📅</span>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-cursive mt-1">Couple Quests</h3>
                      <p className="text-xs font-cursive text-zinc-550 dark:text-zinc-400 mt-0.5 max-w-sm leading-normal">
                        Complete weekly tasks together to level up intimacy and understanding.
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-2">
                      {weeklyTasks.map((task) => (
                        <label 
                          key={task.id} 
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all duration-200 hover:scale-[1.01] ${
                            task.completed 
                              ? "bg-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-455" 
                              : "bg-white/40 dark:bg-zinc-955/20 border-zinc-200/50 dark:border-zinc-800/20 hover:bg-white/60 dark:hover:bg-zinc-955/30 text-zinc-700 dark:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => handleToggleTask(task.id)}
                              className="w-4.5 h-4.5 rounded border-zinc-300 dark:border-zinc-750 text-rose-500 focus:ring-rose-500 cursor-pointer accent-rose-500"
                            />
                            <span className={`text-xs font-bold leading-normal ${task.completed ? "line-through opacity-75" : ""}`}>
                              {task.text}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded text-rose-500 select-none">
                            +{task.points} Intimacy
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Divider on desktop */}
                  <div className="hidden md:block w-[1px] bg-zinc-250/50 dark:bg-zinc-800/30 self-stretch" />

                  {/* Right: Intimacy / Understanding progress metrics */}
                  <div className="w-full md:w-80 flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-4 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Connection Meter</h4>
                      
                      {/* Intimacy level */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          <span className="flex items-center gap-1.5 select-none">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                            <span>Intimacy Level</span>
                          </span>
                          <span style={{ fontFamily: "var(--font-molle)" }} className="text-rose-500 text-sm">{scores.intimacy}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-zinc-150 dark:bg-zinc-950/50 overflow-hidden relative border border-zinc-200/10 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${scores.intimacy}%` }}
                          />
                        </div>
                      </div>

                      {/* Understanding level */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          <span className="flex items-center gap-1.5 select-none">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span>Understanding Level</span>
                          </span>
                          <span style={{ fontFamily: "var(--font-molle)" }} className="text-amber-500 text-sm">{scores.understanding}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-zinc-150 dark:bg-zinc-955/50 overflow-hidden relative border border-zinc-200/10 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${scores.understanding}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quest success indicator */}
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between gap-3 text-left">
                      <div className="flex-1">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Completed Quests</span>
                        <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-0.5 leading-normal">
                          {weeklyTasks.filter(t => t.completed).length === 4 ? "Weekly Challenge Completed! 🎉" : `${weeklyTasks.filter(t => t.completed).length} of 4 Completed`}
                        </h5>
                        <p className="text-[10px] text-zinc-500 mt-1 font-medium">
                          {weeklyTasks.filter(t => t.completed).length === 4 
                            ? `Completed: ${scores.completedWeeks} weeks 🏆` 
                            : `Current record: ${scores.completedWeeks} weeks`}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 text-xl font-bold shrink-0 shadow-inner select-none border border-rose-500/10">
                        🏆
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-extrabold text-left font-cursive text-zinc-900 dark:text-white flex items-center gap-1.5 pl-1">
                    <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500/10 " />
                    <span>Select Game Mode</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full items-stretch text-left">
                    {gameModes.map((mode, idx) => (
                      <div key={idx} onClick={() => setQuizGameState("playing")} className="p-5 rounded-[24px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-md backdrop-blur-md flex flex-col gap-3.5 hover:shadow-lg hover:border-rose-500/20 hover:scale-[1.02] cursor-pointer transition-all duration-300 group">
                        <div className={`w-9 h-9 rounded-full ${mode.color} flex items-center justify-center group-hover:scale-115 transition-transform`}>
                          <Heart className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">{mode.name}</h4>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-455 leading-relaxed font-medium">
                          {mode.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-extrabold text-left font-cursive text-zinc-900 dark:text-white flex items-center gap-1.5 pl-1">
                    <BookOpen className="w-4 h-4 text-rose-500" />
                    <span>Play by Categories</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full items-stretch text-left">
                    {questionCategories.map((cat, idx) => (
                      <div key={idx} onClick={() => setQuizGameState("playing")} className="p-4.5 rounded-[24px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-md backdrop-blur-md flex flex-col gap-3 hover:scale-102 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[110px]">{cat.name}</h4>
                          <span className="text-[9px] font-bold text-zinc-455">{cat.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-850 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${cat.progress}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400">
                          <span>{cat.count} questions</span>
                          <span>Played: {cat.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {quizActiveTab === "capsules" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full text-left">
            <div className="md:col-span-7 flex flex-col gap-8">
              <div className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md">
                <h3 className="text-base font-extrabold font-cursive text-zinc-955 dark:text-white border-b pb-2.5 border-zinc-200/55 dark:border-zinc-800/55 flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5 text-rose-500" />
                  <span>Create Question Pack</span>
                </h3>

                <form onSubmit={handleCreatePack} className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Pack Title</label>
                    <input
                      type="text" required
                      value={newPackName} onChange={(e) => setNewPackName(e.target.value)}
                      placeholder="e.g. Inside Jokes, Childhood memories..."
                      className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white font-medium"
                    />
                  </div>
                  <button type="submit" className="w-full mt-2 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer border-none">
                    Save Private Pack 📝
                  </button>
                </form>
              </div>

              <div className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-base font-extrabold font-cursive text-zinc-955 dark:text-white border-b pb-2.5 border-zinc-200/55 dark:border-zinc-800/55 flex items-center gap-1.5">
                  <Camera className="w-4.5 h-4.5 text-rose-500" />
                  <span>Saved Quiz Memories</span>
                </h3>

                {savedQuizMemories.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic py-4">No quiz answers saved yet.</p>
                ) : (
                  <div className="flex flex-col gap-4 pl-4 border-l border-dashed border-rose-350 mt-1">
                    {savedQuizMemories.map((mem) => (
                      <div key={mem.id} className="p-4 rounded-2xl bg-zinc-55 dark:bg-zinc-955/40 border border-zinc-200/50 dark:border-zinc-800/30 text-left flex flex-col gap-1.5 relative">
                        <div className="absolute -left-6 top-5 w-4 h-4 rounded-full bg-rose-450 border-4 border-white dark:border-zinc-900" />
                        <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-250">{mem.question}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <span className="text-[8px] font-bold text-rose-500 uppercase block">{loved.personAName}</span>
                            <span className="text-xs text-zinc-500">{mem.ansA}</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-pink-500 uppercase block">{loved.personBName}</span>
                            <span className="text-xs text-zinc-500">{mem.ansB}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-8">
              <div className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-base font-extrabold font-cursive  text-zinc-955 dark:text-white border-b pb-2.5 border-zinc-200/55 dark:border-zinc-800/55 flex items-center gap-1.5">
                  <Lock className="w-4.5 h-4.5 text-rose-500" />
                  <span>Time Capsule</span>
                </h3>

                <form onSubmit={handleSealCapsule} className="flex flex-col gap-4 mt-2">
                  <textarea
                    required value={capsuleMessage} onChange={(e) => setCapsuleMessage(e.target.value)}
                    placeholder="Write a cute message to open later..."
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white h-20 resize-none font-medium"
                  />
                  <button type="submit" className="w-full mt-2 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer border-none rounded-full">
                    Seal with Lock &amp; Key 🔒
                  </button>
                </form>

                {sealedCapsules.length > 0 && (
                  <div className="flex flex-col gap-3 mt-6 border-t pt-5 border-zinc-250">
                    {sealedCapsules.map((capsule) => (
                      <div key={capsule.id} className="p-4 rounded-2xl bg-zinc-55 dark:bg-zinc-950 border border-zinc-200 flex items-center justify-between gap-4">
                        <Lock className="w-4 h-4 text-rose-500" />
                        <div className="flex-1 text-left">
                          <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">Sealed Capsule</h5>
                          <span className="text-[9px] text-zinc-450 block">Open: {capsule.openDate}</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase">Sealed</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
