"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Flame, 
  Mail, 
  Image as ImageIcon, 
  Camera, 
  Gift, 
  BookOpen, 
  X,
  HeartHandshake
} from "lucide-react";

interface StatsTabProps {
  loved: any;
  currentTheme: any;
}

interface CustomPartnerQuestion {
  id: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
}

export default function StatsTab({ loved, currentTheme }: StatsTabProps) {
  // Modal / Drawer States
  const [activeStatsModal, setActiveStatsModal] = useState<"letters" | "photos" | "memories" | null>(null);
  const [selectedStatsLetter, setSelectedStatsLetter] = useState<number | null>(null);

  // Love Chemistry Quiz states
  const [customPartnerQuestions, setCustomPartnerQuestions] = useState<CustomPartnerQuestion[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");
  const [newWrongAns1, setNewWrongAns1] = useState("");
  const [newWrongAns2, setNewWrongAns2] = useState("");
  const [newWrongAns3, setNewWrongAns3] = useState("");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [guessedAnswer, setGuessedAnswer] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<{ correct: boolean; revealed: boolean } | null>(null);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [calculatingChemistry, setCalculatingChemistry] = useState(false);

  // Load questions from local storage
  useEffect(() => {
    const savedPartnerQ = localStorage.getItem("loved_custom_partner_questions");
    if (savedPartnerQ) {
      const parsed = JSON.parse(savedPartnerQ);
      setCustomPartnerQuestions(parsed);
      if (parsed.length > 0) {
        setSelectedQuestionIndex(Math.floor(Math.random() * parsed.length));
      }
    }
  }, []);

  const handleCreatePartnerQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newCorrectAnswer || !newWrongAns1) return;

    const rawOptions = [newCorrectAnswer, newWrongAns1];
    if (newWrongAns2) rawOptions.push(newWrongAns2);
    if (newWrongAns3) rawOptions.push(newWrongAns3);

    const shuffled = [...rawOptions].sort(() => Math.random() - 0.5);

    const newQ = {
      id: Date.now().toString(),
      questionText: newQuestionText,
      correctAnswer: newCorrectAnswer,
      options: shuffled
    };

    const updated = [...customPartnerQuestions, newQ];
    setCustomPartnerQuestions(updated);
    localStorage.setItem("loved_custom_partner_questions", JSON.stringify(updated));

    setNewQuestionText("");
    setNewCorrectAnswer("");
    setNewWrongAns1("");
    setNewWrongAns2("");
    setNewWrongAns3("");
    setIsCreatingQuestion(false);

    setSelectedQuestionIndex(updated.length - 1);
    setGuessedAnswer(null);
    setQuizResults(null);
  };

  const handleGuessAnswer = (option: string) => {
    if (selectedQuestionIndex === null) return;
    setCalculatingChemistry(true);
    setGuessedAnswer(option);

    setTimeout(() => {
      const currentQ = customPartnerQuestions[selectedQuestionIndex];
      const isCorrect = option === currentQ.correctAnswer;
      setQuizResults({
        correct: isCorrect,
        revealed: true
      });
      setCalculatingChemistry(false);
    }, 800);
  };

  const handleNextQuestion = () => {
    if (customPartnerQuestions.length === 0) return;
    let nextIdx = Math.floor(Math.random() * customPartnerQuestions.length);
    if (customPartnerQuestions.length > 1 && nextIdx === selectedQuestionIndex) {
      nextIdx = (nextIdx + 1) % customPartnerQuestions.length;
    }
    setSelectedQuestionIndex(nextIdx);
    setGuessedAnswer(null);
    setQuizResults(null);
  };

  // Mock static details
  const mockLetters = [
    {
      id: 1,
      title: "Our First Day 🌸",
      excerpt: "I still remember the exact outfit you wore. My heart skipped...",
      content: `My dearest,

I still remember the exact outfit you wore the day we first met. My heart skipped a beat, and in that single moment, I knew my life was about to change forever. Your laugh was the sweetest sound I had ever heard, and it remains my absolute favorite melody to this day. 

Thank you for being the highlight of my universe.

Forever yours,
Romeo`,
      date: "2024-11-15"
    },
    {
      id: 2,
      title: "First Travel Capsule 🌊",
      excerpt: "Exploring new cities with you is my favorite adventure. Holding...",
      content: `My love,

Exploring new cities, catching flights, and getting lost in crowded streets with you is my favorite adventure. Holding your hand makes anywhere in the world feel like home. I cherish every single photo we took on the beach, watching the sunset paint the sky in rose-gold hues.

I can't wait for our next trip together.

With all my love,
Juliet`,
      date: "2025-05-18"
    },
    {
      id: 3,
      title: "The Quiet Sundays ☕",
      excerpt: "Waking up next to you, drinking coffee, and doing nothing at...",
      content: `My anchor,

My favorite moments aren't just the big celebrations, but the quiet Sundays. Waking up next to you, brewing coffee, listening to the rain tap against the glass, and doing absolutely nothing at all. You make the ordinary feel extraordinary.

I love you more with every passing day.

Always,
Romeo`,
      date: "2026-03-22"
    }
  ];

  const mockPhotos = [
    { title: "First Coffee Date ☕", gradient: "from-amber-400 to-rose-400", desc: "Talking for 4 hours straight about everything and nothing." },
    { title: "Summer Seaside 🌊", gradient: "from-teal-400 to-blue-500", desc: "Sunset beach walk, sandy feet, and sweet kisses." },
    { title: "Cozy Movie Night 🍿", gradient: "from-purple-500 to-indigo-500", desc: "Wrapped in blankets sharing a giant bowl of popcorn." },
    { title: "Milestone Celebration 🥂", gradient: "from-pink-500 to-orange-400", desc: "Fancy outfits, candlelight, and celebrating another beautiful year." }
  ];

  const mockMemories = [
    { category: "Travel Adventures ✈️", count: 85, color: "bg-teal-500" },
    { category: "Coffee & Food Dates ☕", count: 120, color: "bg-amber-500" },
    { category: "Cozy Movie Nights 🍿", count: 50, color: "bg-indigo-500" },
    { category: "Late-night Talks 📞", count: 157, color: "bg-rose-500" }
  ];

  // Dynamic Real Data Computations from loved state
  const totalDaysTogether = loved.timeLeft?.totalDays ?? loved.timeLeft?.days ?? 0;
  
  const currentStreak = loved.streakInfo?.count ?? 0;
  const longestStreak = Math.max(
    currentStreak,
    loved.lastActiveStreak || 0,
    loved.coupleData?.longestStreak || 0,
    loved.coupleData?.streakCount || 0
  );

  // Next Anniversary Calculation
  const calculateNextAnniversary = (anniversaryDateStr?: string) => {
    if (!anniversaryDateStr) return { days: 0, dateFormatted: "Soon" };
    const parts = anniversaryDateStr.split("-");
    const now = new Date();
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let year = now.getFullYear();
    let month = parts.length === 3 ? parseInt(parts[1], 10) - 1 : now.getMonth();
    let day = parts.length === 3 ? parseInt(parts[2], 10) : now.getDate();
    
    let nextAnni = new Date(year, month, day);
    if (nextAnni.getTime() < todayZero.getTime()) {
      nextAnni = new Date(year + 1, month, day);
    }
    
    const diffMs = nextAnni.getTime() - todayZero.getTime();
    const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const dateFormatted = nextAnni.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return { days, dateFormatted };
  };

  const nextAnniInfo = calculateNextAnniversary(loved.anniversaryDate);

  // Real Notes / Letters Shared
  const realNotes = loved.notes || [];
  const displayLetters = realNotes.length > 0 ? realNotes.map((n: any, idx: number) => ({
    id: n.id || idx + 1,
    title: `Sticky Note from ${n.author || loved.personAName}`,
    excerpt: n.text ? (n.text.length > 55 ? n.text.substring(0, 55) + "..." : n.text) : "",
    content: n.text || "",
    date: n.date || "Recent",
    color: n.color || "rose"
  })) : mockLetters;

  const lettersCount = realNotes.length > 0 ? realNotes.length : mockLetters.length;

  // Real Milestone Photos Captured
  const milestonePhotos = (loved.milestones || [])
    .filter((m: any) => m.image)
    .map((m: any, idx: number) => ({
      id: m.id || idx + 1,
      title: m.title || "Milestone Moment 📸",
      gradient: "from-rose-400 to-pink-500",
      desc: m.description || "A special memory saved in your story timeline.",
      image: m.image,
      date: m.date ? new Date(m.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""
    }));

  const displayPhotos = milestonePhotos.length > 0 ? milestonePhotos : mockPhotos;
  const photosCount = milestonePhotos.length > 0 ? milestonePhotos.length : mockPhotos.length;

  // Shared Memories breakdown
  const journalCount = loved.journalEntries?.length || 0;
  const milestoneCount = loved.milestones?.length || 0;
  const notesCount = realNotes.length;
  const totalSharedMemoriesCount = journalCount + milestoneCount + notesCount;

  const realMemoriesBreakdown = [
    { category: "Daily Journal Entries 📓", count: journalCount, color: "bg-rose-500" },
    { category: "Timeline Milestones 🏆", count: milestoneCount, color: "bg-teal-500" },
    { category: "Love Letters & Notes ✉️", count: notesCount, color: "bg-amber-500" },
    { category: "Streak Days Logged 🔥", count: currentStreak, color: "bg-indigo-500" }
  ];

  return (
    <main className="relative w-full max-w-4xl mx-auto px-6 pb-12 flex flex-col gap-8 mt-4 items-center">
      {/* Profile display summary */}
      <div className="w-full p-6 rounded-[32px] bg-white/35 dark:bg-zinc-900/35 border border-white/20 dark:border-zinc-800/20 shadow-xl backdrop-blur-md flex items-center justify-between gap-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white font-serif">
              {loved.personAName} &amp; {loved.personBName}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Loving, sharing, and connecting one day at a time.
            </p>
          </div>
        </div>

        {/* Intimacy & Relationship Health metrics summary */}
        <div className="hidden sm:flex items-center gap-4 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Intimacy Score</span>
            <span className="text-sm font-extrabold text-rose-500">{loved.coupleData?.intimacyScore ?? 85}%</span>
          </div>
          <div className="flex flex-col items-end border-l border-zinc-200/40 dark:border-zinc-800/40 pl-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Understanding</span>
            <span className="text-sm font-extrabold text-pink-500">{loved.coupleData?.understandingScore ?? 90}%</span>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
        {/* TOGETHER FOR */}
        <div className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5 fill-current animate-pulse text-rose-500" />
          </div>
          <div className="text-left mt-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Together For</span>
            <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-450 mt-1 font-serif" style={{ fontFamily: "var(--font-molle)" }}>
              {totalDaysTogether.toLocaleString()} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-sans">days</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              {totalDaysTogether.toLocaleString()} days of laughter, support, and endless memories. 💕
            </p>
          </div>
        </div>

        {/* LONGEST STREAK */}
        <div className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
            <Flame className="w-5 h-5 fill-current text-amber-500 animate-bounce" />
          </div>
          <div className="text-left mt-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Longest Streak</span>
            <h3 className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1 font-serif" style={{ fontFamily: "var(--font-molle)" }}>
              {longestStreak} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-sans">days</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              Current active streak: {currentStreak} days! Logged &amp; shared consistently. 👑
            </p>
          </div>
        </div>

        {/* NEXT ANNIVERSARY */}
        <div className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-500">
            <Gift className="w-5 h-5 text-purple-500 fill-purple-500/10" />
          </div>
          <div className="text-left mt-2">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Next Anniversary</span>
            <h3 className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 font-serif" style={{ fontFamily: "var(--font-molle)" }}>
              {nextAnniInfo.days} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-sans">days</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              Upcoming on {nextAnniInfo.dateFormatted}! Write down something special for the big day! 🎉
            </p>
          </div>
        </div>

        {/* LETTERS CARD */}
        <div 
          onClick={() => setActiveStatsModal("letters")}
          className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-500">
            <Mail className="w-5 h-5 text-pink-500 fill-pink-500/10" />
          </div>
          <div className="text-left mt-2 flex-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest">Letters Shared</span>
            <h3 className="text-3xl font-extrabold text-pink-600 dark:text-pink-400 mt-1 font-serif" style={{ fontFamily: "var(--font-molle)" }}>
              {lettersCount} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-sans">letters</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              Beautiful love letters and short notes. Click to open &amp; read. ✉️
            </p>
          </div>
        </div>

        {/* PHOTOS CARD */}
        <div 
          onClick={() => setActiveStatsModal("photos")}
          className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500">
            <Camera className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-left mt-2 flex-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest">Photos Captured</span>
            <h3 className="text-3xl font-extrabold text-indigo-650 dark:text-indigo-400 mt-1 font-serif" style={{ fontFamily: "var(--font-molle)" }}>
              {photosCount} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-sans">photos</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              Polaroids and snapshots of adventures. Click to view album. 📸
            </p>
          </div>
        </div>

        {/* SHARED MEMORIES CARD */}
        <div 
          onClick={() => setActiveStatsModal("memories")}
          className="p-6 rounded-[28px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/20 shadow-lg backdrop-blur-md flex flex-col gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-500">
            <BookOpen className="w-5 h-5 text-teal-500" />
          </div>
          <div className="text-left mt-2 flex-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest">Shared Memories</span>
            <h3 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1 font-serif" style={{ fontFamily: "var(--font-molle)" }}>
              {totalSharedMemoriesCount} <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-sans">capsules</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
              Logged dates, travels, and notes. Click to see categories. 📝
            </p>
          </div>
        </div>
      </div>

      {/* Love Chemistry Game Section */}
      <div className="w-full p-6 rounded-[32px] bg-white/45 dark:bg-zinc-900/45 border border-white/20 dark:border-zinc-800/20 shadow-xl backdrop-blur-md flex flex-col items-center gap-5 mt-2">
        {((customPartnerQuestions.length === 0) || isCreatingQuestion) ? (
          <div className="w-full flex flex-col gap-4 text-center max-w-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Love Chemistry Meter ✍️</span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-serif mt-1">Create a Question for {loved.personBName}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal text-center">
                You haven&apos;t created any trivia questions for your partner yet. Create one now to test your chemistry!
              </p>
            </div>

            <form onSubmit={handleCreatePartnerQuestion} className="flex flex-col gap-3.5 mt-2 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Question Text</label>
                <input
                  type="text"
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. What is my favorite comfort food?"
                  className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-rose-500 font-semibold">Correct Answer</label>
                <input
                  type="text"
                  required
                  value={newCorrectAnswer}
                  onChange={(e) => setNewCorrectAnswer(e.target.value)}
                  placeholder="e.g. Pepperoni Pizza 🍕"
                  className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-rose-200/30 dark:border-rose-900/30 text-xs outline-none text-zinc-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Wrong Option 1</label>
                  <input
                    type="text"
                    required
                    value={newWrongAns1}
                    onChange={(e) => setNewWrongAns1(e.target.value)}
                    placeholder="Sushi 🍣"
                    className="w-full p-2 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Wrong Option 2</label>
                  <input
                    type="text"
                    value={newWrongAns2}
                    onChange={(e) => setNewWrongAns2(e.target.value)}
                    placeholder="Tacos 🌮"
                    className="w-full p-2 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Wrong Option 3</label>
                  <input
                    type="text"
                    value={newWrongAns3}
                    onChange={(e) => setNewWrongAns3(e.target.value)}
                    placeholder="Burgers 🍔"
                    className="w-full p-2 rounded-xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer border-none"
                >
                  Save &amp; Play ⚡
                </button>
                {customPartnerQuestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingQuestion(false)}
                    className="px-4 py-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer border-none"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          (() => {
            const currentQ = customPartnerQuestions[selectedQuestionIndex ?? 0];
            if (!currentQ) return null;

            return (
              <div className="w-full max-w-md flex flex-col items-center gap-5 text-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Love Chemistry Quiz ⚡</span>
                  <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mt-1 text-center">
                    Guess {loved.personBName}&apos;s favorite:
                  </h3>
                  <h4 className="text-base font-extrabold text-zinc-800 dark:text-zinc-100 mt-2 font-serif px-4 py-3 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                    {currentQ.questionText}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-1">
                  {currentQ.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      disabled={quizResults !== null || calculatingChemistry}
                      onClick={() => handleGuessAnswer(option)}
                      className={`p-3 rounded-xl text-xs font-bold transition-all text-left shadow-sm border ${
                        guessedAnswer === option
                          ? option === currentQ.correctAnswer
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-450 font-semibold"
                            : "bg-red-500/10 border-red-500 text-red-600 dark:text-red-450 font-semibold"
                          : quizResults !== null && option === currentQ.correctAnswer
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-450 animate-pulse font-semibold"
                          : "bg-white/70 dark:bg-zinc-950/40 border-zinc-200/50 dark:border-zinc-800/40 text-zinc-700 dark:text-zinc-200 hover:bg-rose-500/10 hover:border-rose-500/20"
                      } cursor-pointer disabled:cursor-default`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {calculatingChemistry && (
                  <div className="text-xs font-bold text-rose-500 animate-pulse mt-2 flex items-center gap-1.5 justify-center">
                    <Heart className="w-3.5 h-3.5 fill-current animate-bounce" />
                    <span>Checking Chemistry...</span>
                  </div>
                )}

                {quizResults && (
                  <div className="w-full p-4.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center flex flex-col items-center gap-1.5 animate-scale-up mt-2">
                    <span 
                      className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 font-serif"
                      style={{ fontFamily: "var(--font-molle)" }}
                    >
                      {quizResults.correct ? "100%" : "0%"} Chemistry
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1 justify-center">
                      {quizResults.correct ? (
                        <span className="text-emerald-500">Perfect Match! 💞</span>
                      ) : (
                        <span className="text-red-500">Mismatch! 💔</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal max-w-xs mt-0.5 text-center">
                      {quizResults.correct 
                        ? "You guessed correctly! You know your partner inside out." 
                        : `Your partner's correct answer was: ${currentQ.correctAnswer}.`}
                    </p>

                    <div className="flex gap-2.5 w-full mt-3 border-t pt-3.5 border-zinc-200/20">
                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all hover:scale-102 cursor-pointer border-none animate-pulse"
                      >
                        Next Question 🔁
                      </button>
                      <button
                        onClick={() => setIsCreatingQuestion(true)}
                        className="px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs transition-colors cursor-pointer border-none"
                      >
                        Add More Questions ➕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </div>

      {/* Letters Modal */}
      {activeStatsModal === "letters" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-zinc-800 dark:text-zinc-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden animate-scale-up flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
              <h2 className="text-lg font-bold font-cursive flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-500 fill-rose-500/10" />
                <span>Our Love Letters ({lettersCount})</span>
              </h2>
              <button 
                onClick={() => {
                  setActiveStatsModal(null);
                  setSelectedStatsLetter(null);
                }}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 py-4 flex flex-col gap-4">
              {selectedStatsLetter === null ? (
                <div className="flex flex-col gap-3">
                  {displayLetters.map((letter: any) => (
                    <div
                      key={letter.id}
                      onClick={() => setSelectedStatsLetter(letter.id)}
                      className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/30 dark:border-zinc-800/30 hover:border-rose-300 hover:bg-rose-50/10 cursor-pointer transition-all text-left flex flex-col gap-1 hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{letter.title}</h4>
                        <span className="text-[9px] font-bold text-zinc-400">{letter.date}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-normal">
                        {letter.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-left animate-fade-in relative">
                  <button 
                    onClick={() => setSelectedStatsLetter(null)}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer flex items-center gap-1 shrink-0 border-none bg-transparent"
                  >
                    ← Back to letters
                  </button>

                  {(() => {
                    const lObj = displayLetters.find((l: any) => l.id === selectedStatsLetter) || displayLetters[0];
                    return (
                      <div className="p-6 rounded-2xl bg-amber-50/20 dark:bg-zinc-950/30 border border-amber-200/30 dark:border-zinc-800/30 font-serif text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-red-400/20" />
                        <div className="pl-6 whitespace-pre-line font-cursive text-base">
                          {lObj.content}
                        </div>
                        <div className="text-right text-[10px] text-zinc-400 mt-6 pl-6">
                          Written on {lObj.date}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photos Modal */}
      {activeStatsModal === "photos" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-zinc-800 dark:text-zinc-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden animate-scale-up flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
              <h2 className="text-lg font-bold font-cursive flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-500" />
                <span>Our Snapshot Album ({photosCount})</span>
              </h2>
              <button 
                onClick={() => setActiveStatsModal(null)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayPhotos.map((photo: any, idx: number) => (
                <div 
                  key={photo.id || idx}
                  className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/55 dark:border-zinc-800/55 rounded-2xl flex flex-col items-center gap-3 shadow-md hover:shadow-lg hover:rotate-1 hover:scale-105 transition-all duration-300 select-none cursor-default"
                >
                  <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${photo.gradient || "from-rose-400 to-pink-500"} flex items-center justify-center relative overflow-hidden border border-zinc-200/10`}>
                    {photo.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-white/50" />
                    )}
                  </div>
                  <div className="text-left w-full">
                    <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{photo.title}</h4>
                    <p className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {photo.desc}
                    </p>
                    {photo.date && (
                      <span className="text-[8px] font-semibold text-zinc-400 mt-1 block">
                        {photo.date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Memories Modal */}
      {activeStatsModal === "memories" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-zinc-800 dark:text-zinc-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden animate-scale-up flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
              <h2 className="text-lg font-bold font-cursive flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-500" />
                <span>Memory Capsules</span>
              </h2>
              <button 
                onClick={() => setActiveStatsModal(null)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-6 text-left">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal text-center">
                Here is a summary of all the beautiful moments you and your partner have recorded in your story:
              </p>
              
              <div className="flex flex-col gap-3">
                {realMemoriesBreakdown.map((mem, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      <span>{mem.category}</span>
                      <span>{mem.count} logged</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${mem.color} rounded-full`} style={{ width: `${Math.min(100, Math.max(10, (mem.count / Math.max(1, totalSharedMemoriesCount)) * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
