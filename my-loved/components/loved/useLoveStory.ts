import { useState, useEffect, useRef } from "react";
import { AmbientSynth } from "./AmbientSynth";
import { ROMANTIC_QUOTES } from "./constants";
import { Milestone, Note, BurstHeart, JournalEntry, JournalComment } from "./types";

export function useLoveStory() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [themeId, setThemeId] = useState("rose-gold");
  
  // Customisable names & dates
  const [anniversaryDate, setAnniversaryDate] = useState("2026-01-27");
  const [personAName, setPersonAName] = useState("Romeo");
  const [personBName, setPersonBName] = useState("Juliet");
  const [personADesc, setPersonADesc] = useState("My Universe 🌌");
  const [personBDesc, setPersonBDesc] = useState("My Anchor ⚓");
  const [personAAvatar, setPersonAAvatar] = useState("");
  const [personBAvatar, setPersonBAvatar] = useState("");
  const [customTitle, setCustomTitle] = useState("Our Story");
  
  // Audio
  const [isMuted, setIsMuted] = useState(true);
  const synthRef = useRef<AmbientSynth | null>(null);

  // Lists
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activePartner, setActivePartner] = useState<"A" | "B">("A");
  const [showCelebration, setShowCelebration] = useState(false);

  // Form states
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneIcon, setNewMilestoneIcon] = useState("💖");

  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteAuthor, setNewNoteAuthor] = useState("");
  const [newNoteColor, setNewNoteColor] = useState("rose");

  // Dynamic counter state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  // Animation states
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);
  const [floatingBgHearts, setFloatingBgHearts] = useState<{id: number, left: number, size: number, duration: number, delay: number}[]>([]);

  // Load from local storage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Load config
    const savedAnniversary = localStorage.getItem("loved_anniversary");
    const savedPersonA = localStorage.getItem("loved_personA");
    const savedPersonB = localStorage.getItem("loved_personB");
    const savedPersonADesc = localStorage.getItem("loved_personA_desc");
    const savedPersonBDesc = localStorage.getItem("loved_personB_desc");
    const savedPersonAAvatar = localStorage.getItem("loved_personA_avatar");
    const savedPersonBAvatar = localStorage.getItem("loved_personB_avatar");
    const savedTheme = localStorage.getItem("loved_theme");
    const savedTitle = localStorage.getItem("loved_title");
    const savedMilestones = localStorage.getItem("loved_milestones");
    const savedNotes = localStorage.getItem("loved_notes");

    if (savedAnniversary) setAnniversaryDate(savedAnniversary);
    if (savedPersonA) setPersonAName(savedPersonA);
    if (savedPersonB) setPersonBName(savedPersonB);
    if (savedPersonADesc) setPersonADesc(savedPersonADesc);
    if (savedPersonBDesc) setPersonBDesc(savedPersonBDesc);
    if (savedPersonAAvatar) setPersonAAvatar(savedPersonAAvatar);
    if (savedPersonBAvatar) setPersonBAvatar(savedPersonBAvatar);
    if (savedTheme) setThemeId(savedTheme);
    if (savedTitle) setCustomTitle(savedTitle);

    // Initial Milestones fallback
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

    // Initial Notes fallback
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      const defaultNotes = [
        { id: "1", text: "You make my heart smile in ways nobody else can.", author: personAName, date: "Today", color: "pink" },
        { id: "2", text: "Forever is a long time, but I wouldn't mind spending it with you.", author: personBName, date: "Yesterday", color: "purple" }
      ];
      setNotes(defaultNotes);
      localStorage.setItem("loved_notes", JSON.stringify(defaultNotes));
    }

    // Initial Journal fallback
    const savedJournal = localStorage.getItem("loved_journal_entries");
    if (savedJournal) {
      setJournalEntries(JSON.parse(savedJournal));
    } else {
      const defaultJournal: JournalEntry[] = [
        {
          id: "j-1",
          date: "2026-07-03",
          author: "A",
          emotion: "Loved 💖",
          content: "Loved our late-night call yesterday. It felt like time stood still.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          comments: [
            {
              id: "jc-1",
              author: "B",
              content: "Me too, Romeo! I didn't want to hang up at all. 🥰",
              createdAt: new Date(Date.now() - 86400000 + 1800000).toISOString()
            }
          ]
        },
        {
          id: "j-2",
          date: "2026-07-03",
          author: "B",
          emotion: "Happy 😊",
          content: "Had a busy day at work, but received your sweet morning message and it made my day!",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          comments: [
            {
              id: "jc-2",
              author: "A",
              content: "Always here to brighten your day, my love!",
              createdAt: new Date(Date.now() - 86400000 + 3600000).toISOString()
            }
          ]
        }
      ];
      setJournalEntries(defaultJournal);
      localStorage.setItem("loved_journal_entries", JSON.stringify(defaultJournal));
    }

    // Cycle quotes
    setQuoteIndex(Math.floor(Math.random() * ROMANTIC_QUOTES.length));

    // Generate random background floating hearts (more hearts, faster speed)
    const bgHearts = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 20 + 10, // 10px to 30px
      duration: Math.random() * 8 + 6, // 6s to 14s (faster!)
      delay: Math.random() * -10 // start immediately at random offsets
    }));
    setFloatingBgHearts(bgHearts);

    // Initialize audio synth
    synthRef.current = new AmbientSynth();

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Sync state to local storage when changed
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("loved_anniversary", anniversaryDate);
    localStorage.setItem("loved_personA", personAName);
    localStorage.setItem("loved_personB", personBName);
    localStorage.setItem("loved_personA_desc", personADesc);
    localStorage.setItem("loved_personB_desc", personBDesc);
    localStorage.setItem("loved_personA_avatar", personAAvatar);
    localStorage.setItem("loved_personB_avatar", personBAvatar);
    localStorage.setItem("loved_theme", themeId);
    localStorage.setItem("loved_title", customTitle);
  }, [anniversaryDate, personAName, personBName, personADesc, personBDesc, personAAvatar, personBAvatar, themeId, customTitle, mounted]);

  // Save milestones
  const saveMilestones = (updatedList: Milestone[]) => {
    setMilestones(updatedList);
    localStorage.setItem("loved_milestones", JSON.stringify(updatedList));
  };

  // Save notes
  const saveNotes = (updatedList: Note[]) => {
    setNotes(updatedList);
    localStorage.setItem("loved_notes", JSON.stringify(updatedList));
  };

  // Live Timer logic
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate);
      const now = new Date();
      
      let difference = now.getTime() - start.getTime();
      
      if (difference < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
        return;
      }

      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      difference -= days * (1000 * 60 * 60 * 24);
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      difference -= hours * (1000 * 60 * 60);
      
      const minutes = Math.floor(difference / (1000 * 60));
      difference -= minutes * (1000 * 60);
      
      const seconds = Math.floor(difference / 1000);

      setTimeLeft({ days, hours, minutes, seconds, totalDays });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  // Audio Toggle
  const togglePlay = () => {
    if (!synthRef.current) return;
    if (isMuted) {
      synthRef.current.start();
      setIsMuted(false);
    } else {
      synthRef.current.stop();
      setIsMuted(true);
    }
  };

  // Handle clicking the central heart (Explosion of hearts)
  const triggerHeartBurst = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const count = 16;
    const newHearts: BurstHeart[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      size: Math.random() * 20 + 14,
      delay: Math.random() * 0.1,
      rotation: Math.random() * 360
    }));

    setBurstHearts((prev) => [...prev, ...newHearts]);

    // Clean up burst hearts
    setTimeout(() => {
      setBurstHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1500);

    // Audio chime cue on click
    if (!isMuted && synthRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioCtx = (synthRef.current as any).ctx;
        if (audioCtx && audioCtx.state !== "suspended") {
          const now = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(now + 0.3);
        }
      } catch (err) {}
    }
  };

  // Add Milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle || !newMilestoneDate) return;
    
    const newM: Milestone = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      date: newMilestoneDate,
      description: newMilestoneDesc,
      icon: newMilestoneIcon
    };

    const updated = [...milestones, newM].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    saveMilestones(updated);
    
    setNewMilestoneTitle("");
    setNewMilestoneDate("");
    setNewMilestoneDesc("");
    setNewMilestoneIcon("💖");
  };

  // Remove Milestone
  const handleRemoveMilestone = (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    saveMilestones(updated);
  };

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText) return;

    const newN: Note = {
      id: Date.now().toString(),
      text: newNoteText,
      author: newNoteAuthor || "Anonymous",
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      color: newNoteColor
    };

    const updated = [newN, ...notes];
    saveNotes(updated);

    setNewNoteText("");
    setNewNoteAuthor("");
    setNewNoteColor("rose");
  };

  // Remove Note
  const handleRemoveNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  // Save journal entries
  const saveJournalEntries = (updatedList: JournalEntry[]) => {
    setJournalEntries(updatedList);
    localStorage.setItem("loved_journal_entries", JSON.stringify(updatedList));
  };

  // Add/Update daily journal entry
  const handleAddJournalEntry = (date: string, emotion: string, content: string) => {
    if (!content.trim()) return;
    const existingIndex = journalEntries.findIndex(
      (entry) => entry.date === date && entry.author === activePartner
    );
    let updatedEntries = [...journalEntries];
    if (existingIndex > -1) {
      updatedEntries[existingIndex] = {
        ...updatedEntries[existingIndex],
        emotion,
        content,
        createdAt: new Date().toISOString()
      };
    } else {
      const newEntry: JournalEntry = {
        id: `j-${Date.now()}`,
        date,
        author: activePartner,
        emotion,
        content,
        createdAt: new Date().toISOString(),
        comments: []
      };
      updatedEntries = [newEntry, ...updatedEntries];
    }
    saveJournalEntries(updatedEntries);
  };

  // Add comment to journal entry
  const handleAddJournalComment = (entryId: string, content: string) => {
    if (!content.trim()) return;
    const updatedEntries = journalEntries.map((entry) => {
      if (entry.id === entryId) {
        const newComment: JournalComment = {
          id: `jc-${Date.now()}`,
          author: activePartner,
          content,
          createdAt: new Date().toISOString()
        };
        return {
          ...entry,
          comments: [...entry.comments, newComment]
        };
      }
      return entry;
    });
    saveJournalEntries(updatedEntries);
  };

  // Remove daily journal entry
  const handleRemoveJournalEntry = (entryId: string) => {
    const updated = journalEntries.filter((entry) => entry.id !== entryId);
    saveJournalEntries(updated);
  };

  // Remove comment from entry
  const handleRemoveJournalComment = (entryId: string, commentId: string) => {
    const updated = journalEntries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          comments: entry.comments.filter((c) => c.id !== commentId)
        };
      }
      return entry;
    });
    saveJournalEntries(updated);
  };

  // Get local date string YYYY-MM-DD
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Compute current streak and today's completeness
  const getStreakInfo = () => {
    const isDayCompleted = (dateStr: string) => {
      const entryA = journalEntries.find(e => e.date === dateStr && e.author === "A");
      const entryB = journalEntries.find(e => e.date === dateStr && e.author === "B");
      if (!entryA || !entryB) return false;
      const aCommentedOnB = entryB.comments.some(c => c.author === "A");
      const bCommentedOnA = entryA.comments.some(c => c.author === "B");
      return aCommentedOnB && bCommentedOnA;
    };

    const today = new Date();
    let streak = 0;
    const checkDate = new Date(today);

    const todayStr = getLocalDateString(checkDate);
    const todayCompleted = isDayCompleted(todayStr);

    if (todayCompleted) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dateStr = getLocalDateString(checkDate);
        if (isDayCompleted(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = getLocalDateString(checkDate);
      if (isDayCompleted(yesterdayStr)) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dateStr = getLocalDateString(checkDate);
          if (isDayCompleted(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return {
      count: streak,
      isCompletedToday: todayCompleted
    };
  };

  const streakInfo = getStreakInfo();

  // Streak celebration trigger
  const triggerStreakCelebration = () => {
    setShowCelebration(true);
    if (!isMuted && synthRef.current) {
      try {
        const audioCtx = (synthRef.current as any).ctx;
        if (audioCtx && audioCtx.state !== "suspended") {
          const now = audioCtx.currentTime;
          const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
          notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0, now + idx * 0.12);
            gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.12 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.5);
          });
        }
      } catch (err) {
        console.error("Synth play error:", err);
      }
    }
    setTimeout(() => {
      setShowCelebration(false);
    }, 5000);
  };

  return {
    mounted,
    showIntro,
    setShowIntro,
    showSettings,
    setShowSettings,
    themeId,
    setThemeId,
    anniversaryDate,
    setAnniversaryDate,
    personAName,
    setPersonAName,
    personBName,
    setPersonBName,
    personADesc,
    setPersonADesc,
    personBDesc,
    setPersonBDesc,
    personAAvatar,
    setPersonAAvatar,
    personBAvatar,
    setPersonBAvatar,
    customTitle,
    setCustomTitle,
    isMuted,
    setIsMuted,
    synthRef,
    milestones,
    notes,
    quoteIndex,
    setQuoteIndex,
    newMilestoneTitle,
    setNewMilestoneTitle,
    newMilestoneDate,
    setNewMilestoneDate,
    newMilestoneDesc,
    setNewMilestoneDesc,
    newMilestoneIcon,
    setNewMilestoneIcon,
    newNoteText,
    setNewNoteText,
    newNoteAuthor,
    setNewNoteAuthor,
    newNoteColor,
    setNewNoteColor,
    timeLeft,
    burstHearts,
    floatingBgHearts,
    togglePlay,
    triggerHeartBurst,
    handleAddMilestone,
    handleRemoveMilestone,
    handleAddNote,
    handleRemoveNote,
    // Daily Journal exports
    journalEntries,
    activePartner,
    setActivePartner,
    showCelebration,
    setShowCelebration,
    streakInfo,
    handleAddJournalEntry,
    handleAddJournalComment,
    handleRemoveJournalEntry,
    handleRemoveJournalComment,
    triggerStreakCelebration
  };
}

