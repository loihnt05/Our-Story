import { useState, useEffect, useRef } from "react";
import { AmbientSynth } from "./AmbientSynth";
import { ROMANTIC_QUOTES } from "./constants";
import { Milestone, Note, BurstHeart } from "./types";

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

    // Cycle quotes
    setQuoteIndex(Math.floor(Math.random() * ROMANTIC_QUOTES.length));

    // Generate random background floating hearts
    const bgHearts = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 24 + 12, // 12px to 36px
      duration: Math.random() * 20 + 15, // 15s to 35s
      delay: Math.random() * -20 // start immediately at random offsets
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
    handleRemoveNote
  };
}
