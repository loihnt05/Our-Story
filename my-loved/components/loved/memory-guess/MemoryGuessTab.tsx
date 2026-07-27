"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Flame, Calendar, ArrowRight } from "lucide-react";
import { Milestone, Question, MemoryGuessTabProps } from "./types";
import { FALLBACK_MEMORIES } from "./constants";
import { useMemoryAudio } from "./useMemoryAudio";
import GameConfigurator from "./GameConfigurator";
import PolaroidCard from "./PolaroidCard";
import AnswerChoices from "./AnswerChoices";
import SummaryDashboard from "./SummaryDashboard";
import BadgesTab from "./BadgesTab";
import LeaderboardTab from "./LeaderboardTab";

export default function MemoryGuessTab({ loved, currentTheme, onBack }: MemoryGuessTabProps) {
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

  // Audio helper hook
  const { playCorrectSound, playIncorrectSound, initAudio } = useMemoryAudio(loved?.isMuted);

  // Load scores and gamification states on mount
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.coupleStats) {
          if (data.coupleStats.memoryGuessScoreA !== undefined || data.coupleStats.memoryGuessScoreB !== undefined) {
            setScores({
              A: data.coupleStats.memoryGuessScoreA ?? 0,
              B: data.coupleStats.memoryGuessScoreB ?? 0,
            });
          }
          if (data.coupleStats.memoryGuessStreak !== undefined) {
            setStreak(data.coupleStats.memoryGuessStreak);
          }
        }
      })
      .catch((err) => console.error("Failed to load Memory Guess stats from API:", err));

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

    const lastPlayed = localStorage.getItem("loved_memory_guess_last_played");
    const todayStr = new Date().toISOString().split("T")[0];
    if (lastPlayed === todayStr) {
      setDailyCompleted(true);
    }
  }, []);

  // Helper to save scores and streaks
  const saveScores = (newScores: { A: number; B: number }) => {
    setScores(newScores);
    localStorage.setItem("loved_memory_guess_scores", JSON.stringify(newScores));
    fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_MEMORY_GUESS_SCORES",
        payload: { scoreA: newScores.A, scoreB: newScores.B, streak },
      }),
    }).catch((err) => console.error("Failed to update Memory Guess scores on backend:", err));
  };

  const saveStreak = (newStreak: number) => {
    setStreak(newStreak);
    localStorage.setItem("loved_memory_guess_streak", newStreak.toString());
    fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_MEMORY_GUESS_SCORES",
        payload: { scoreA: scores.A, scoreB: scores.B, streak: newStreak },
      }),
    }).catch((err) => console.error("Failed to update Memory Guess streak on backend:", err));
  };

  // Generate unique multiple choices
  const generateMultipleChoices = (correct: string, pool: string[], count = 4): string[] => {
    const choices = new Set<string>();
    choices.add(correct);
    
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    for (const item of shuffledPool) {
      if (choices.size >= count) break;
      if (item !== correct && item.trim()) {
        choices.add(item);
      }
    }
    
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
    setActiveTab("game"); // Ensure we show the game board

    const userMilestones: Milestone[] = loved.milestones || [];
    let pool = [...userMilestones];
    if (pool.length < 3) {
      pool = [...pool, ...FALLBACK_MEMORIES];
    }

    if (activeCategory === "trips") {
      pool = pool.filter(m => 
        m.icon === "✈️" || m.icon === "🚗" || m.icon === "🏡" || 
        m.title.toLowerCase().includes("trip") || m.title.toLowerCase().includes("visit") ||
        m.description.toLowerCase().includes("trip") || m.description.toLowerCase().includes("visit")
      );
      if (pool.length < 2) {
        pool = [...userMilestones, ...FALLBACK_MEMORIES];
      }
    } else if (activeCategory === "milestones") {
      pool = pool.filter(m => m.icon === "💍" || m.icon === "💖" || m.icon === "✨");
      if (pool.length < 2) {
        pool = [...userMilestones, ...FALLBACK_MEMORIES];
      }
    }

    const shuffledPool = pool.sort(() => Math.random() - 0.5);
    const gameLength = Math.min(5, shuffledPool.length);
    const selectedMemories = shuffledPool.slice(0, gameLength);

    const allTitles = pool.map(m => m.title);
    const allEmojis = pool.map(m => m.icon);

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

      return { memory, type, questionText, correctAnswer, options };
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
    if (selectedAnswer) return;
    
    setSelectedAnswer(choice);
    const q = questions[currentIdx];
    const correct = choice === q.correctAnswer;
    setIsCorrect(correct);

    let earned = 0;
    if (correct) {
      if (difficulty === "easy") earned = 10;
      else if (difficulty === "medium") earned = 20;
      else earned = 35;

      if (streak >= 2) {
        earned += 5;
      }

      setPointsEarnedThisRound(prev => prev + earned);

      const updatedScores = { ...scores };
      if (currentPlayer === "A") updatedScores.A += earned;
      else if (currentPlayer === "B") updatedScores.B += earned;
      else {
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

    setIsFlipped(true);
    setGameState("reveal");
  };

  // Progress to next question
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
        setSelectedAnswer(null);
        setGameState("playing");
      }, 300);
    } else {
      setGameState("summary");
      
      const todayStr = new Date().toISOString().split("T")[0];
      localStorage.setItem("loved_memory_guess_last_played", todayStr);
      setDailyCompleted(true);
      
      loved.triggerHeartBurst({
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
        currentTarget: document.body
      } as any);
    }
  };

  // Direct tab to timeline Memory Lane
  const handleViewInTimeline = (milestoneId: string) => {
    loved.setThemeId(loved.themeId);
    window.location.hash = `milestone-${milestoneId}`;
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/timeline");
    }
  };

  const getPartnerName = (playerKey: "A" | "B" | "both") => {
    if (playerKey === "A") return loved.personAName;
    if (playerKey === "B") return loved.personBName;
    return "Both (Co-op)";
  };

  const handleResetScores = () => {
    if (confirm("Reset leaderboard scores? 🕰️")) {
      saveScores({ A: 0, B: 0 });
      saveStreak(0);
    }
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
          {onBack && (
            <button
              onClick={onBack}
              className="mb-2 flex items-center gap-1 text-xs font-bold text-zinc-455 hover:text-rose-500 cursor-pointer"
            >
              <span>⬅️ Back to Game Center</span>
            </button>
          )}
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
              : "bg-zinc-100/40 border-zinc-200/50 text-zinc-450 dark:text-zinc-500"
          }`}>
            <Flame className="w-3.5 h-3.5" />
            <span>Streak: {streak}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation - Visible in Idle game state */}
      {gameState === "idle" && (
        <div className="flex border-b border-zinc-200/30 dark:border-zinc-800/30 pb-1 gap-2 justify-center max-w-md mx-auto w-full">
          {(["game", "badges", "stats"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              game: "🎮 Play Game",
              badges: "🏆 Badges",
              stats: "📈 Leaderboard",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? "border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-500/5"
                    : "border-transparent text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: GAME CHANNELS */}
      {activeTab === "game" && (
        <div className="w-full flex flex-col items-center justify-center">
          
          {/* Game control / Idle configurations card */}
          {gameState === "idle" && (
            <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
              <GameConfigurator
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                dailyCompleted={dailyCompleted}
                onStartGame={handleStartGame}
                getPartnerName={getPartnerName}
              />
            </div>
          )}

          {/* Active Question Display */}
          {(gameState === "playing" || gameState === "reveal") && questions.length > 0 && (
            <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6">
              
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

              <PolaroidCard
                question={questions[currentIdx]}
                isFlipped={isFlipped}
                isCorrect={isCorrect}
              />

              {gameState === "playing" && (
                <AnswerChoices
                  options={questions[currentIdx].options}
                  onAnswer={handleAnswer}
                  selectedAnswer={selectedAnswer}
                />
              )}

              {/* REVEAL REVIEW STATE CONTROLS */}
              {gameState === "reveal" && (
                <div className="w-full flex flex-col gap-4 items-center mt-2 animate-fade-in">
                  <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-500/5 to-pink-500/5 border border-rose-500/15 flex gap-3 text-left">
                    <span className="text-2xl shrink-0">💌</span>
                    <p className="text-xs text-zinc-650 dark:text-zinc-350 font-medium leading-relaxed">
                      This photo/milestone was recorded for <span className="font-bold underline">"{questions[currentIdx].memory.title}"</span> on {new Date(questions[currentIdx].memory.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}. It remains one of your most-loved memories together!
                    </p>
                  </div>

                  <div className="flex gap-2.5 w-full">
                    <button
                      onClick={() => handleViewInTimeline(questions[currentIdx].memory.id)}
                      className="flex-1 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 hover:bg-white/60 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
            <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center">
              <SummaryDashboard
                currentPlayer={currentPlayer}
                getPartnerName={getPartnerName}
                pointsEarnedThisRound={pointsEarnedThisRound}
                streak={streak}
                onConfigureGame={() => setGameState("idle")}
                onPlayAgain={handleStartGame}
              />
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: BADGES & LEVELS */}
      {gameState === "idle" && activeTab === "badges" && (
        <div className="w-full max-w-4xl mx-auto">
          <BadgesTab
            loved={loved}
            scores={scores}
          />
        </div>
      )}

      {/* TAB CONTENT: STATS & LEADERBOARD */}
      {gameState === "idle" && activeTab === "stats" && (
        <div className="w-full max-w-2xl mx-auto">
          <LeaderboardTab
            loved={loved}
            scores={scores}
            onResetScores={handleResetScores}
          />
        </div>
      )}

    </div>
  );
}
