"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  Heart, 
  Flame, 
  Award, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  BookOpen,
  Calendar,
  RotateCcw,
  Star,
  Users
} from "lucide-react";

interface DecisionOption {
  text: string;
  emoji: string;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  image?: string;
}

interface Question {
  memory: Milestone;
  type: "title" | "date" | "year" | "emoji" | "month";
  questionText: string;
  correctAnswer: string;
  options: string[];
}

interface MemoryGuessTabProps {
  loved: any;
  currentTheme: any;
}

const FALLBACK_MEMORIES: Milestone[] = [
  { id: "f1", title: "First Café Date ☕", date: "2024-11-20", description: "Shared a warm cappuccino and talked for three hours straight.", icon: "☕" },
  { id: "f2", title: "Watched the Sunset 🌅", date: "2024-12-15", description: "Sat on the hilltop wrapped in a single blanket as the sun dipped below the trees.", icon: "🌅" },
  { id: "f3", title: "Cooked Sushi Together 🍣", date: "2025-01-20", description: "Rice went everywhere, but the rolls turned out surprisingly delicious!", icon: "🍣" },
  { id: "f4", title: "Weekend Road Trip 🚗", date: "2025-03-12", description: "Drove out to the countryside with a custom playlist on repeat.", icon: "🚗" },
  { id: "f5", title: "First Anniversary 🥂", date: "2025-05-15", description: "Dressed up for a candlelight dinner and exchanged hand-written love letters.", icon: "🥂" },
  { id: "f6", title: "Bookstore Rainy Day 📚", date: "2025-06-08", description: "Spent the entire rainy afternoon reading in the cozy corner of our favorite bookshop.", icon: "📚" }
];

const BADGES = [
  { name: "Nostalgia Novice 🌸", minScore: 0, desc: "Taking your first steps down memory lane." },
  { name: "Memory Explorer 🗺️", minScore: 100, desc: "Remembering details of multiple sweet journeys." },
  { name: "Milestone Keeper 💍", minScore: 250, desc: "Recalling key romantic memories with high accuracy." },
  { name: "Memory Master 🏆", minScore: 500, desc: "Unmatched synchronization of your relationship journey!" }
];

// Lazily initialized audio context helper
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export default function MemoryGuessTab({ loved, currentTheme }: MemoryGuessTabProps) {
  // Game state: idle, playing, reveal, summary
  const [gameState, setGameState] = useState<"idle" | "playing" | "reveal" | "summary">("idle");
  const [activeTab, setActiveTab] = useState<"game" | "badges" | "stats">("game");
  
  // Game configurations
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [currentPlayer, setCurrentPlayer] = useState<"A" | "B" | "both">("A");
  const [activeCategory, setActiveCategory] = useState<"all" | "trips" | "milestones">("all");

  // Questions and indexes
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [pointsEarnedThisRound, setPointsEarnedThisRound] = useState<number>(0);

  // Scores tracked in local storage
  const [scores, setScores] = useState<{ A: number; B: number }>({ A: 0, B: 0 });
  const [streak, setStreak] = useState<number>(0);
  const [dailyCompleted, setDailyCompleted] = useState<boolean>(false);

  // Polaroid card flip trigger state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Sound effects synthesizers
  const playCorrectSound = () => {
    try {
      const ctx = initAudio();
      if (!ctx || loved?.isMuted) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch (e) {}
  };

  const playIncorrectSound = () => {
    try {
      const ctx = initAudio();
      if (!ctx || loved?.isMuted) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  };

  // Load scores and gamification states on mount
  useEffect(() => {
    const savedScores = localStorage.getItem("loved_memory_guess_scores");
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (e) {}
    }

    const savedStreak = localStorage.getItem("loved_memory_guess_streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }

    // Check daily challenge status
    const lastPlayed = localStorage.getItem("loved_memory_guess_last_played");
    const todayStr = new Date().toISOString().split("T")[0];
    if (lastPlayed === todayStr) {
      setDailyCompleted(true);
    }
  }, []);

  // Helper to save scores
  const saveScores = (newScores: { A: number; B: number }) => {
    setScores(newScores);
    localStorage.setItem("loved_memory_guess_scores", JSON.stringify(newScores));
  };

  const saveStreak = (newStreak: number) => {
    setStreak(newStreak);
    localStorage.setItem("loved_memory_guess_streak", newStreak.toString());
  };

  // Generate unique multiple choices
  const generateMultipleChoices = (correct: string, pool: string[], count = 4): string[] => {
    let choices = new Set<string>();
    choices.add(correct);
    
    // Shuffle pool to add random incorrect options
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    for (const item of shuffledPool) {
      if (choices.size >= count) break;
      if (item !== correct && item.trim()) {
        choices.add(item);
      }
    }
    
    // Fill up options if pool is too small
    const backups = ["Coffee at morning", "Walk in the park", "Dinner at candlelight", "Shared a kiss", "Movie Marathon"];
    while (choices.size < count) {
      const backup = backups[Math.floor(Math.random() * backups.length)];
      choices.add(backup);
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  // Generate dates choices
  const generateDateChoices = (correctDateStr: string, difficulty: string): string[] => {
    const correctDate = new Date(correctDateStr);
    const count = difficulty === "hard" ? 6 : 4;
    const choices = new Set<string>();
    
    const format = (d: Date) => d.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    choices.add(format(correctDate));

    const dayOffsets = [30, -30, 90, -90, 180, -180, 365, -365];
    dayOffsets.sort(() => Math.random() - 0.5);

    for (const offset of dayOffsets) {
      if (choices.size >= count) break;
      const d = new Date(correctDate);
      d.setDate(d.getDate() + offset);
      choices.add(format(d));
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  // Build the game questions array
  const handleStartGame = () => {
    initAudio();

    // 1. Gather all memories (real + fallback)
    const userMilestones: Milestone[] = loved.milestones || [];
    let pool = [...userMilestones];
    if (pool.length < 3) {
      // Merge fallback memories so the game is always fun and playable
      pool = [...pool, ...FALLBACK_MEMORIES];
    }

    // 2. Filter by Category
    if (activeCategory === "trips") {
      pool = pool.filter(m => 
        m.icon === "✈️" || m.icon === "🚗" || m.icon === "🏡" || 
        m.title.toLowerCase().includes("trip") || m.title.toLowerCase().includes("visit") ||
        m.description.toLowerCase().includes("trip") || m.description.toLowerCase().includes("visit")
      );
      if (pool.length < 2) {
        // Reset pool if category yields no memories
        pool = [...userMilestones, ...FALLBACK_MEMORIES];
      }
    } else if (activeCategory === "milestones") {
      pool = pool.filter(m => m.icon === "💍" || m.icon === "💖" || m.icon === "✨");
      if (pool.length < 2) {
        pool = [...userMilestones, ...FALLBACK_MEMORIES];
      }
    }

    // 3. Shuffle pool
    const shuffledPool = pool.sort(() => Math.random() - 0.5);
    const gameLength = Math.min(5, shuffledPool.length);
    const selectedMemories = shuffledPool.slice(0, gameLength);

    // Get pools of titles, emojis for distraction options
    const allTitles = pool.map(m => m.title);
    const allEmojis = pool.map(m => m.icon);

    // 4. Generate Questions based on difficulty
    const newQuestions: Question[] = selectedMemories.map((memory) => {
      const typesEasy: Array<"year" | "emoji" | "month"> = ["year", "emoji", "month"];
      const typesMedium: Array<"title" | "emoji"> = ["title", "emoji"];
      const typesHard: Array<"date" | "title"> = ["date", "title"];
      
      let type: "title" | "date" | "year" | "emoji" | "month" = "title";
      if (difficulty === "easy") {
        type = typesEasy[Math.floor(Math.random() * typesEasy.length)];
      } else if (difficulty === "medium") {
        type = typesMedium[Math.floor(Math.random() * typesMedium.length)];
      } else {
        type = typesHard[Math.floor(Math.random() * typesHard.length)];
      }

      let questionText = "";
      let correctAnswer = "";
      let options: string[] = [];

      const parsedDate = new Date(memory.date);

      if (type === "title") {
        questionText = "What event happened on this day?";
        correctAnswer = memory.title;
        options = generateMultipleChoices(correctAnswer, allTitles, difficulty === "hard" ? 6 : 4);
      } else if (type === "emoji") {
        questionText = "Which emoji icon did we record for this memory?";
        correctAnswer = memory.icon;
        options = generateMultipleChoices(correctAnswer, allEmojis, 4);
      } else if (type === "year") {
        questionText = "In what year did this memory take place?";
        correctAnswer = parsedDate.getFullYear().toString();
        const y = parsedDate.getFullYear();
        options = [y.toString(), (y - 1).toString(), (y + 1).toString(), (y - 2).toString()].sort(() => Math.random() - 0.5);
      } else if (type === "month") {
        questionText = "In what month did we share this beautiful moment?";
        correctAnswer = parsedDate.toLocaleDateString("en-US", { month: "long" });
        const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        options = generateMultipleChoices(correctAnswer, allMonths, 4);
      } else if (type === "date") {
        questionText = "On what exact date did this memory occur?";
        correctAnswer = parsedDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        options = generateDateChoices(memory.date, difficulty);
      }

      return {
        memory,
        type,
        questionText,
        correctAnswer,
        options
      };
    });

    setQuestions(newQuestions);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setIsFlipped(false);
    setPointsEarnedThisRound(0);
    setGameState("playing");
  };

  // Handle answering
  const handleAnswer = (choice: string) => {
    if (selectedAnswer) return; // prevent multiple answers
    
    setSelectedAnswer(choice);
    const q = questions[currentIdx];
    const correct = choice === q.correctAnswer;
    setIsCorrect(correct);

    // Points logic
    let earned = 0;
    if (correct) {
      if (difficulty === "easy") earned = 10;
      else if (difficulty === "medium") earned = 20;
      else earned = 35;

      // Add streak bonus if streak >= 2
      if (streak >= 2) {
        earned += 5;
      }

      setPointsEarnedThisRound(prev => prev + earned);

      // Save global scores
      const updatedScores = { ...scores };
      if (currentPlayer === "A") updatedScores.A += earned;
      else if (currentPlayer === "B") updatedScores.B += earned;
      else {
        // Co-op split
        updatedScores.A += Math.ceil(earned / 2);
        updatedScores.B += Math.floor(earned / 2);
      }
      saveScores(updatedScores);
      saveStreak(streak + 1);
      playCorrectSound();
    } else {
      saveStreak(0);
      playIncorrectSound();
    }

    // Trigger Polaroid Flip animation
    setIsFlipped(true);
    setGameState("reveal");
  };

  // Progress to next question
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setIsFlipped(false);
      // Wait for card flip rotation back before rendering next question
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
        setSelectedAnswer(null);
        setGameState("playing");
      }, 300);
    } else {
      // Completed game!
      setGameState("summary");
      
      // Update Daily Completed flag
      const todayStr = new Date().toISOString().split("T")[0];
      localStorage.setItem("loved_memory_guess_last_played", todayStr);
      setDailyCompleted(true);
      
      // Trigger romantic chime synth celebration
      loved.triggerHeartBurst({
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
        currentTarget: document.body
      } as any);
    }
  };

  // Direct tab to timeline Memory Lane
  const handleViewInTimeline = (milestoneId: string) => {
    loved.setThemeId(loved.themeId); // trigger effect sync
    window.location.hash = `milestone-${milestoneId}`;
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/timeline");
    }
  };

  // Determine current badge levels
  const totalScoreA = scores.A;
  const totalScoreB = scores.B;
  const currentBadgeA = BADGES.reduce((prev, curr) => totalScoreA >= curr.minScore ? curr : prev, BADGES[0]);
  const currentBadgeB = BADGES.reduce((prev, curr) => totalScoreB >= curr.minScore ? curr : prev, BADGES[0]);

  // Lead partner text
  const getLeaderText = () => {
    if (scores.A === scores.B) return "You are perfectly tied! 🤝";
    const lead = scores.A > scores.B ? loved.personAName : loved.personBName;
    const diff = Math.abs(scores.A - scores.B);
    return `${lead} is leading by ${diff} points! 👑`;
  };

  const getPartnerName = (playerKey: "A" | "B" | "both") => {
    if (playerKey === "A") return loved.personAName;
    if (playerKey === "B") return loved.personBName;
    return "Both (Co-op)";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-1 sm:px-4 py-2 animate-scale-up select-none">
      
      {/* Dynamic 3D Card Flip CSS Style Injection */}
      <style>{`
        .polaroid-container {
          perspective: 1200px;
        }
        .polaroid-card {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.25);
          width: 100%;
          min-height: 380px;
        }
        .polaroid-card.flipped {
          transform: rotateY(180deg);
        }
        .polaroid-front, .polaroid-back {
          position: absolute;
          backface-visibility: hidden;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .polaroid-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header Banner */}
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md">
        <div>
          <h1 className="text-2xl md:text-3xl font-cursive font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center md:justify-start gap-2">
            <span>📸 Memory Guess</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Test how well you remember your shared milestones and journeys! 🌸
          </p>
        </div>

        {/* Top Mini Stats bar */}
        <div className="flex justify-center items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/15 text-xs font-bold shadow-sm">
            <Trophy className="w-3.5 h-3.5" />
            <span>Score: {scores.A + scores.B}</span>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm ${
            streak > 0 
              ? "bg-rose-500/15 border-rose-500/25 text-rose-600 dark:text-rose-400 animate-pulse" 
              : "bg-zinc-150/40 border-zinc-200/50 text-zinc-450 dark:text-zinc-550"
          }`}>
            <Flame className="w-3.5 h-3.5" />
            <span>Streak: {streak}</span>
          </div>
        </div>
      </div>



      {/* TAB CONTENT: GAME CHANNELS */}
      {activeTab === "game" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Game control / Idle configurations card */}
          {gameState === "idle" && (
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Challenge Mode Setup */}
              <div className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-rose-100/40 dark:border-rose-950/20 backdrop-blur-md flex flex-col gap-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Star className="w-4 h-4 text-rose-500" />
                  <span>Configure Challenge</span>
                </h2>

                {/* Daily Bonus Reminder */}
                {!dailyCompleted && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2.5 animate-bounce">
                    <span>🌟</span>
                    <span>Daily Challenge Available! Complete this round to earn bonus points.</span>
                  </div>
                )}

                {/* Difficulty */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["easy", "medium", "hard"] as const).map(diff => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                          difficulty === diff
                            ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 shadow-sm"
                            : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Player selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Guesser</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["A", "B", "both"] as const).map(player => (
                      <button
                        key={player}
                        onClick={() => setCurrentPlayer(player)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          currentPlayer === player
                            ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 shadow-sm"
                            : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
                        }`}
                      >
                        {getPartnerName(player)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Scope */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Memory Scope</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["all", "trips", "milestones"] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                          activeCategory === cat
                            ? "bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400 shadow-sm"
                            : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Memory Guessing Round</span>
                </button>
              </div>

            </div>
          )}

          {/* RIGHT: Active Question Display (Col-span-7) */}
          {(gameState === "playing" || gameState === "reveal") && questions.length > 0 && (
            <div className="lg:col-span-7 flex flex-col items-center gap-6">
              
              {/* Question Index Progress tracker */}
              <div className="w-full flex justify-between items-center bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                <span className="text-xs font-extrabold text-zinc-400">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentIdx
                          ? "bg-rose-500 w-6"
                          : idx < currentIdx
                          ? "bg-rose-500/40"
                          : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Polaroid 3D Rotating Card Container */}
              <div className="polaroid-container w-full max-w-[340px]">
                <div className={`polaroid-card ${isFlipped ? "flipped" : ""}`}>
                  
                  {/* FRONT SIDE (Question state) */}
                  <div className="polaroid-front bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850/50 shadow-2xl p-4.5 rounded-2xl flex flex-col justify-between">
                    
                    {/* Blurred Photo Frame */}
                    <div className="relative w-full aspect-square rounded-xl bg-gradient-to-tr from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-800 border border-zinc-150/50 overflow-hidden flex items-center justify-center">
                      
                      {questions[currentIdx].memory.image ? (
                        <img
                          src={questions[currentIdx].memory.image}
                          className="w-full h-full object-cover blur-md scale-[1.05]"
                          alt="Blurred Memory"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 select-none">
                          <span className="text-7xl blur-[3px] opacity-70">
                            {questions[currentIdx].memory.icon}
                          </span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                        <span className="bg-white/80 dark:bg-zinc-950/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-zinc-650 flex items-center gap-1.5 shadow-sm border border-white/20">
                          <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Who remembers this?</span>
                        </span>
                      </div>
                    </div>

                    {/* Handwriting style label */}
                    <div className="mt-4 pb-2 text-center flex flex-col items-center justify-center">
                      <p className="text-md font-bold font-cursive text-zinc-700 dark:text-zinc-300">
                        "{questions[currentIdx].questionText}"
                      </p>
                    </div>

                  </div>

                  {/* BACK SIDE (Reveal state) */}
                  <div className="polaroid-back bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-850/50 shadow-2xl p-4.5 rounded-2xl flex flex-col justify-between">
                    
                    {/* Unblurred Photo Frame */}
                    <div className="relative w-full aspect-square rounded-xl bg-gradient-to-tr from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-800 border border-zinc-150/50 overflow-hidden flex items-center justify-center">
                      {questions[currentIdx].memory.image ? (
                        <img
                          src={questions[currentIdx].memory.image}
                          className="w-full h-full object-cover animate-scale-up"
                          alt="Unblurred Memory"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-6xl animate-bounce">
                            {questions[currentIdx].memory.icon}
                          </span>
                        </div>
                      )}
                      
                      {/* Success / Failure badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1.5 ${
                          isCorrect ? "bg-emerald-500" : "bg-rose-500"
                        }`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-3 h-3 stroke-[3px]" />
                              <span>Correct!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 stroke-[3px]" />
                              <span>Missed!</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Unveiled notes */}
                    <div className="mt-4 pb-1 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500 leading-none">
                        {questions[currentIdx].memory.title}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 mt-1">
                        {new Date(questions[currentIdx].memory.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium leading-tight mt-1.5 italic max-h-12 overflow-y-auto">
                        "{questions[currentIdx].memory.description || "No notes saved for this sweet memory."}"
                      </p>
                    </div>

                  </div>

                </div>
              </div>

              {/* ANSWER CHOICES SELECTOR BOARD */}
              {gameState === "playing" && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {questions[currentIdx].options.map((choice, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(choice)}
                      className="p-4.5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-rose-500/10 hover:border-rose-400 active:scale-98 text-xs font-bold text-zinc-850 dark:text-zinc-150 transition-all cursor-pointer flex items-center justify-between text-left"
                    >
                      <span className="leading-snug pr-2">{choice}</span>
                      <span className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* REVEAL REVIEW STATE CONTROLS */}
              {gameState === "reveal" && (
                <div className="w-full flex flex-col gap-4 items-center mt-2 animate-fade-in">
                  
                  {/* Nostalgic Encourage Alert */}
                  <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-500/5 to-pink-500/5 border border-rose-500/15 flex gap-3 text-left">
                    <span className="text-2xl shrink-0">💌</span>
                    <p className="text-xs text-zinc-650 dark:text-zinc-300 font-medium leading-relaxed">
                      This photo/milestone was recorded for <span className="font-bold underline">"{questions[currentIdx].memory.title}"</span> on {new Date(questions[currentIdx].memory.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}. It remains one of your most-loved memories together!
                    </p>
                  </div>

                  <div className="flex gap-2.5 w-full">
                    <button
                      onClick={() => handleViewInTimeline(questions[currentIdx].memory.id)}
                      className="flex-1 py-3 rounded-full border border-zinc-250 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 hover:bg-white/60 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>View in Timeline</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{currentIdx < questions.length - 1 ? "Next Question" : "View Results"}</span>
                      <ArrowRight className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SUMMARY DASHBOARD (End of game round) */}
          {gameState === "summary" && (
            <div className="lg:col-span-12 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md max-w-xl mx-auto gap-5 animate-scale-up">
              
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-4xl shadow-lg animate-pulse">
                <span>🏆</span>
                <span className="absolute -top-1.5 -right-1.5 text-lg">✨</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">
                  Round Completed! 🌸
                </span>
                <h2 className="text-xl font-bold font-cursive text-zinc-800 dark:text-white mt-1">
                  Nostalgic Journey Complete!
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mt-1">
                  You successfully navigated through your timeline milestones. Here is the points tally:
                </p>
              </div>

              {/* Point Card */}
              <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-zinc-900/60 dark:to-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 shadow-inner flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold border-b pb-2 border-zinc-200/30">
                  <span className="text-zinc-500">Active Guesser:</span>
                  <span className="text-rose-600 dark:text-rose-400">{getPartnerName(currentPlayer)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500">Points Earned:</span>
                  <span className="text-xl font-extrabold text-emerald-500 animate-scale-up">+{pointsEarnedThisRound} pts</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-500">Active Streak:</span>
                  <span className="text-amber-500 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500/10" />
                    <span>{streak} correct streak</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 w-full">
                <button
                  onClick={() => setGameState("idle")}
                  className="flex-1 py-3 rounded-full border border-zinc-250 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Configure Game 🔄
                </button>
                <button
                  onClick={handleStartGame}
                  className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  Spin/Play Again 📸
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: BADGES & LEVELS */}
      {activeTab === "badges" && (
        <div className="p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md flex flex-col gap-6">
          <div className="border-b pb-3 border-zinc-200/30">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-500" />
              <span>Unlocked Memory Badges</span>
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              Unlock romantic badges as you guess correct timeline details and level up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Player A badges board */}
            <div className="p-4 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-white/10 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2 border-zinc-250/20">
                <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1.5">
                  <span>🌸</span>
                  <span>{loved.personAName}'s Journey</span>
                </span>
                <span className="text-xs font-bold text-zinc-400">{scores.A} pts</span>
              </div>
              <div className="flex flex-col gap-3">
                {BADGES.map((badge, idx) => {
                  const unlocked = scores.A >= badge.minScore;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex gap-3.5 items-center transition-all ${
                        unlocked
                          ? "bg-amber-500/5 border-amber-500/20"
                          : "opacity-45 border-transparent bg-zinc-200/20 dark:bg-zinc-950/20"
                      }`}
                    >
                      <span className="text-3xl shrink-0">{unlocked ? "🌟" : "🔒"}</span>
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-extrabold ${unlocked ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>
                          {badge.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                          {badge.desc} (Need {badge.minScore} pts)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Player B badges board */}
            <div className="p-4 rounded-2xl bg-white/30 dark:bg-zinc-900/30 border border-white/10 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-2 border-zinc-250/20">
                <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1.5">
                  <span>🌸</span>
                  <span>{loved.personBName}'s Journey</span>
                </span>
                <span className="text-xs font-bold text-zinc-400">{scores.B} pts</span>
              </div>
              <div className="flex flex-col gap-3">
                {BADGES.map((badge, idx) => {
                  const unlocked = scores.B >= badge.minScore;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex gap-3.5 items-center transition-all ${
                        unlocked
                          ? "bg-amber-500/5 border-amber-500/20"
                          : "opacity-45 border-transparent bg-zinc-200/20 dark:bg-zinc-950/20"
                      }`}
                    >
                      <span className="text-3xl shrink-0">{unlocked ? "🌟" : "🔒"}</span>
                      <div className="flex flex-col text-left">
                        <span className={`text-xs font-extrabold ${unlocked ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>
                          {badge.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                          {badge.desc} (Need {badge.minScore} pts)
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

      {/* TAB CONTENT: STATS & LEADERBOARD */}
      {activeTab === "stats" && (
        <div className="p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md flex flex-col gap-6">
          <div className="border-b pb-3 border-zinc-200/30 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-rose-500" />
              <span>Partner Leaderboard</span>
            </h2>
            <button
              onClick={() => {
                if (confirm("Reset leaderboard scores? 🕰️")) {
                  saveScores({ A: 0, B: 0 });
                  saveStreak(0);
                }
              }}
              className="text-[10px] font-bold text-zinc-400 hover:text-rose-500 cursor-pointer"
            >
              Reset Scores
            </button>
          </div>

          <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
            
            {/* Friendly crown leader banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {getLeaderText()}
            </div>

            {/* A score row */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">🥇</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                    {loved.personAName}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    Badge Level: {currentBadgeA.name}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">{scores.A} pts</span>
            </div>

            {/* B score row */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">🥈</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                    {loved.personBName}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    Badge Level: {currentBadgeB.name}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">{scores.B} pts</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
