"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Heart, 
  Save, 
  Check, 
  FolderHeart, 
  History,
  Info,
  Calendar,
  X,
  Volume2,
  VolumeX,
  RotateCcw
} from "lucide-react";

interface DecisionOption {
  text: string;
  emoji: string;
}

interface WheelCategory {
  id: string;
  name: string;
  icon: string;
  items: DecisionOption[];
  isCustom?: boolean;
}

interface HistoryItem {
  id: string;
  text: string;
  emoji: string;
  categoryName: string;
  date: string;
  completed: boolean;
}

interface DecisionWheelTabProps {
  loved: any;
  currentTheme: any;
  onBack?: () => void;
}

const DEFAULT_CATEGORIES: WheelCategory[] = [
  {
    id: "date-ideas",
    name: "Date Ideas",
    icon: "☕",
    items: [
      { text: "Go to a new café", emoji: "☕" },
      { text: "Watch a movie", emoji: "🍿" },
      { text: "Cook together", emoji: "🍳" },
      { text: "Take a walk", emoji: "🚶‍♂️" },
      { text: "Visit a bookstore", emoji: "📚" },
      { text: "Have a picnic", emoji: "🧺" }
    ]
  },
  {
    id: "food-decisions",
    name: "Food Decisions",
    icon: "🍕",
    items: [
      { text: "Sushi", emoji: "🍣" },
      { text: "Pizza", emoji: "🍕" },
      { text: "Korean BBQ", emoji: "🥩" },
      { text: "Hotpot", emoji: "🍲" },
      { text: "Fast food", emoji: "🍔" },
      { text: "Street food", emoji: "🍢" }
    ]
  },
  {
    id: "fun-challenges",
    name: "Fun Challenges",
    icon: "⚡",
    items: [
      { text: "Take a selfie together", emoji: "📸" },
      { text: "Give 3 compliments", emoji: "💬" },
      { text: "Share a favorite memory", emoji: "💭" },
      { text: "Dance for 1 minute", emoji: "💃" },
      { text: "Write a short love note", emoji: "✉️" }
    ]
  }
];

const POPULAR_EMOJIS = [
  "💖", "☕", "🍿", "🍳", "🚶‍♂️", "📚", "🧺", "🍣", "🍕", "🥩", "🍲", "🍔", 
  "📸", "💬", "💭", "💃", "✉️", "🥂", "🎡", "🚗", "🎁", "🎨", "🎵", "✈️"
];

const WHEEL_COLORS = [
  "#FF9AA2", // Pastel Pink-Red
  "#FFB7B2", // Pastel Salmon
  "#FFDAC1", // Pastel Peach
  "#E2F0CB", // Pastel Mint Green
  "#B5EAD7", // Pastel Teal
  "#C7CEEA", // Pastel Lavender Blue
  "#E8C4EC", // Pastel Lavender Purple
  "#FBCFE8"  // Pastel Bubblegum Pink
];

// Lazily initialized audio context
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

export default function DecisionWheelTab({ loved, currentTheme, onBack }: DecisionWheelTabProps) {
  // Category states
  const [categories, setCategories] = useState<WheelCategory[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("date-ideas");
  const [items, setItems] = useState<DecisionOption[]>([]);
  
  // Custom wheels modal & forms
  const [showSaveWheelModal, setShowSaveWheelModal] = useState(false);
  const [newWheelName, setNewWheelName] = useState("");
  const [newWheelIcon, setNewWheelIcon] = useState("🎡");
  
  // Options Editing state
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionEmoji, setNewOptionEmoji] = useState("💖");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingEmoji, setEditingEmoji] = useState("");
  
  // Wheel Spinning states
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [winningItem, setWinningItem] = useState<DecisionOption | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [addedToTimeline, setAddedToTimeline] = useState<boolean>(false);
  const [completedAdventure, setCompletedAdventure] = useState<boolean>(false);

  // History log state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Ref for the SVG wheel element to rotate directly (prevents React lag)
  const wheelRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  const lastSliceIndexRef = useRef<number>(-1);

  // Particle background for result modal
  const [particles, setParticles] = useState<any[]>([]);

  // Load custom wheels & history on mount
  useEffect(() => {
    // Load custom wheels
    const savedCustom = localStorage.getItem("loved_custom_wheels");
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        setCategories([...DEFAULT_CATEGORIES, ...parsed]);
      } catch (e) {
        console.error("Failed to parse custom wheels", e);
      }
    }

    // Load history
    const savedHistory = localStorage.getItem("loved_decision_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Cleanup spin animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update items when active category changes
  useEffect(() => {
    const activeCat = categories.find(c => c.id === activeCategoryId);
    if (activeCat) {
      setItems([...activeCat.items]);
    }
  }, [activeCategoryId, categories]);

  // Audio synthesize click sound
  const playTickSound = () => {
    try {
      const ctx = initAudio();
      if (!ctx || loved?.isMuted) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Browser audio context permission not allowed yet
    }
  };

  // Audio synthesize celebration sound
  const playChimeSound = () => {
    try {
      const ctx = initAudio();
      if (!ctx || loved?.isMuted) return;
      
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        
        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch (e) {
      // Audio context error
    }
  };

  // Generate particles for modal celebration
  useEffect(() => {
    if (showResultModal) {
      const colors = ["#ff5a79", "#ff7a94", "#ffb4c4", "#a855f7", "#3b82f6", "#10b981", "#fbbf24"];
      const emojis = ["💖", "✨", "🌸", "💕", "🎉", "🍬"];
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // % width
        y: -10 - Math.random() * 30, // vertical start offset
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 14 + 10,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 1.5,
        duration: Math.random() * 2.5 + 2.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [showResultModal]);

  // Spin the wheel using requestAnimationFrame
  const handleSpin = () => {
    if (isSpinning || items.length < 2) return;
    
    setIsSpinning(true);
    setShowResultModal(false);
    setAddedToTimeline(false);
    setCompletedAdventure(false);
    
    // Ensure Audio Context is active on user action
    initAudio();

    const N = items.length;
    const sliceAngle = 360 / N;
    const spins = 6 + Math.floor(Math.random() * 4); // 6 to 9 full spins
    const targetWinIndex = Math.floor(Math.random() * N);
    
    setWinningIndex(targetWinIndex);
    
    const startAngle = rotationRef.current;
    
    // Calculate ending angle: align segment middle to the top pointer (270 degrees)
    // Formula: angleOffset - (winningIndex * sliceAngle + sliceAngle / 2)
    const normalizedStart = startAngle % 360;
    const targetDiff = (270 - (targetWinIndex * sliceAngle + sliceAngle / 2)) - normalizedStart;
    
    // Ensure rotation goes clockwise
    const rotationAddition = targetDiff >= 0 ? targetDiff : targetDiff + 360;
    const finalAngle = startAngle + (spins * 360) + rotationAddition;
    
    const duration = 4800 + Math.random() * 800; // 4.8s to 5.6s
    const startTime = performance.now();
    lastSliceIndexRef.current = -1;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quintic ease out (spins fast initially, slows down very gently at the end)
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
      const eased = easeOut(progress);
      
      const currentAngle = startAngle + (finalAngle - startAngle) * eased;
      rotationRef.current = currentAngle;
      
      // Update DOM style directly for maximum frame rate
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }
      
      // Tick sound crossing sector boundary logic
      // Segment currently at the pointer (270 degrees top)
      const relativeAngle = (270 - currentAngle) % 360;
      const positiveAngle = relativeAngle < 0 ? relativeAngle + 360 : relativeAngle;
      const activeSlice = Math.floor(positiveAngle / sliceAngle) % N;
      
      if (activeSlice !== lastSliceIndexRef.current) {
        lastSliceIndexRef.current = activeSlice;
        playTickSound();
      }
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setRotation(finalAngle);
        setWinningItem(items[targetWinIndex]);
        setShowResultModal(true);
        playChimeSound();
        
        // Auto save to history
        const activeCat = categories.find(c => c.id === activeCategoryId);
        saveToHistory(items[targetWinIndex], activeCat?.name || "Quick Decision");
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Add Item to active wheel list
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;
    
    const newItem: DecisionOption = {
      text: newOptionText.trim(),
      emoji: newOptionEmoji
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    
    // Save back to category configuration
    const updatedCategories = categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveCustomWheelsToLocalStorage(updatedCategories);
    
    // Reset Form
    setNewOptionText("");
    setNewOptionEmoji("💖");
  };

  // Remove Item from active wheel list
  const handleRemoveItem = (index: number) => {
    if (items.length <= 2) {
      alert("A wheel needs at least 2 choices to spin! 🎡");
      return;
    }
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveCustomWheelsToLocalStorage(updatedCategories);
  };

  // Move item position Up (reordering)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setItems(updated);
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, items: updated };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveCustomWheelsToLocalStorage(updatedCategories);
  };

  // Move item position Down (reordering)
  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setItems(updated);
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, items: updated };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveCustomWheelsToLocalStorage(updatedCategories);
  };

  // Trigger inline Edit Mode
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(items[index].text);
    setEditingEmoji(items[index].emoji);
  };

  // Save inline editing
  const saveEditing = (index: number) => {
    if (!editingText.trim()) return;
    const updated = [...items];
    updated[index] = {
      text: editingText.trim(),
      emoji: editingEmoji
    };
    setItems(updated);
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, items: updated };
      }
      return cat;
    });
    setCategories(updatedCategories);
    saveCustomWheelsToLocalStorage(updatedCategories);
    setEditingIndex(null);
  };

  // Save Custom wheels list helper
  const saveCustomWheelsToLocalStorage = (allCats: WheelCategory[]) => {
    const customOnly = allCats.filter(c => c.isCustom);
    localStorage.setItem("loved_custom_wheels", JSON.stringify(customOnly));
  };

  // Create new Custom category/wheel
  const handleCreateCustomWheel = () => {
    if (!newWheelName.trim()) return;
    
    const newId = `custom-${Date.now()}`;
    const newCat: WheelCategory = {
      id: newId,
      name: newWheelName.trim(),
      icon: newWheelIcon,
      items: [
        { text: "Adventure Option 1", emoji: "🌸" },
        { text: "Adventure Option 2", emoji: "🍿" }
      ],
      isCustom: true
    };
    
    const updated = [...categories, newCat];
    setCategories(updated);
    saveCustomWheelsToLocalStorage(updated);
    
    // Switch to new wheel
    setActiveCategoryId(newId);
    setNewWheelName("");
    setShowSaveWheelModal(false);
  };

  // Delete entire Custom Wheel category
  const handleDeleteCustomWheel = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this custom wheel? 🎡")) {
      const updated = categories.filter(c => c.id !== catId);
      setCategories(updated);
      saveCustomWheelsToLocalStorage(updated);
      
      // Fallback active category
      if (activeCategoryId === catId) {
        setActiveCategoryId("date-ideas");
      }
    }
  };

  // Add selected option directly to Relationship Timeline (Memory Lane)
  const handleAddToTimeline = () => {
    if (!winningItem) return;
    
    const todayStr = new Date().toISOString().split("T")[0];
    const milestoneTitle = `Wheel Choice: ${winningItem.text} ${winningItem.emoji}`;
    const milestoneDesc = `We spun the Loved Story Decision Wheel to resolve decision fatigue, and fate chose: "${winningItem.text}"! We had an amazing, spontaneous adventure together.`;
    
    loved.handleAddMilestone(
      milestoneTitle,
      todayStr,
      milestoneDesc,
      winningItem.emoji || "🎡"
    );
    
    setAddedToTimeline(true);
    
    // Add heart burst animation
    loved.triggerHeartBurst({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
      currentTarget: document.body
    } as any);
  };

  // Save selection directly to history list
  const saveToHistory = (item: DecisionOption, categoryName: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text: item.text,
      emoji: item.emoji,
      categoryName,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      completed: false
    };
    
    const updated = [newItem, ...history].slice(0, 30); // limit to 30 items
    setHistory(updated);
    localStorage.setItem("loved_decision_history", JSON.stringify(updated));
  };

  // Toggle adventure completion state
  const toggleHistoryCompleted = (historyId: string) => {
    const updated = history.map(h => {
      if (h.id === historyId) {
        const nextState = !h.completed;
        if (nextState) {
          // Trigger cute audio chime when completed!
          playChimeSound();
        }
        return { ...h, completed: nextState };
      }
      return h;
    });
    setHistory(updated);
    localStorage.setItem("loved_decision_history", JSON.stringify(updated));
  };

  // Complete adventure from modal
  const handleMarkAsCompleted = () => {
    if (history.length > 0) {
      toggleHistoryCompleted(history[0].id);
      setCompletedAdventure(true);
    }
  };

  // Reset history
  const handleResetHistory = () => {
    if (confirm("Clear all decision wheel history? 🕰️")) {
      setHistory([]);
      localStorage.removeItem("loved_decision_history");
    }
  };

  // SVG geometry constants
  const viewBoxSize = 300;
  const radius = 138;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const sliceAngle = 360 / Math.max(1, items.length);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-1 sm:px-4 py-2 animate-scale-up select-none">
      {/* Inline styles for custom modal falling animations */}
      <style>{`
        @keyframes fall-particle {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(-15px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) rotate(360deg) translateX(15px);
            opacity: 0;
          }
        }
        .animate-fall-particle {
          animation: fall-particle linear forwards;
        }
      `}</style>

      {/* Hero Header */}
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/40 dark:bg-zinc-955/20 border border-white/20 backdrop-blur-md">
        <div>
          {onBack && (
            <button
              onClick={() => {
                if (!isSpinning) onBack();
              }}
              disabled={isSpinning}
              className={`mb-2 flex items-center gap-1 text-xs font-bold transition-all ${
                isSpinning
                  ? "text-zinc-300 dark:text-zinc-750 cursor-not-allowed opacity-50"
                  : "text-zinc-405 hover:text-rose-500 cursor-pointer"
              }`}
            >
              <span>⬅️ Back to Game Center</span>
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-cursive font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center md:justify-start gap-2">
            <span>🎡 Decision Wheel</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Can't agree on what to do next? Let fate choose your next adventure! 💖
          </p>
        </div>
        <button
          onClick={() => setShowSaveWheelModal(true)}
          className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer self-center"
        >
          <FolderHeart className="w-4 h-4" />
          <span>Create New Wheel</span>
        </button>
      </div>

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Categories and entries manager (Col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto scrollbar-hide pr-0 lg:pr-1">
          
          {/* Wheel Selector Board */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-rose-100/40 dark:border-rose-950/20 backdrop-blur-md flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-rose-500" />
              <span>Select Category</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (!isSpinning) setActiveCategoryId(cat.id);
                    }}
                    className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 items-start ${
                      isActive
                        ? "bg-rose-500/10 border-rose-400 shadow-sm"
                        : "bg-white/40 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white/60 dark:hover:bg-zinc-950/30"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className={`text-xs font-bold leading-tight truncate w-full ${isActive ? "text-rose-600 dark:text-rose-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {cat.name}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400">
                      {cat.items.length} options
                    </span>
                    {cat.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustomWheel(cat.id, e)}
                        className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                        title="Delete this wheel"
                        disabled={isSpinning}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options List / CRUD manager */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-rose-100/40 dark:border-rose-950/20 backdrop-blur-md flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-2 border-zinc-200/30">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Customize Choices</span>
              </h2>
              <span className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full">
                {items.length} options
              </span>
            </div>

            {/* List scroll container */}
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const isEditing = editingIndex === idx;
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-white/40 dark:bg-zinc-955/20 p-2.5 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 hover:scale-[1.01] transition-transform duration-200"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-full">
                        {/* Inline edit inputs */}
                        <select
                          value={editingEmoji}
                          onChange={(e) => setEditingEmoji(e.target.value)}
                          className="p-1 rounded bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-sm outline-none"
                        >
                          {POPULAR_EMOJIS.map(em => (
                            <option key={em} value={em}>{em}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-2 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-350 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white outline-none"
                          maxLength={35}
                          required
                        />
                        <button
                          onClick={() => saveEditing(idx)}
                          className="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-lg bg-zinc-200/20 dark:bg-zinc-850/40 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                          {item.emoji}
                        </span>
                        <span 
                          onClick={() => !isSpinning && startEditing(idx)}
                          className="flex-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate cursor-pointer hover:underline"
                          title="Click to edit"
                        >
                          {item.text}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0 || isSpinning}
                            className="p-1 text-zinc-400 hover:text-rose-500 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === items.length - 1 || isSpinning}
                            className="p-1 text-zinc-400 hover:text-rose-500 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            disabled={isSpinning}
                            className="p-1 text-zinc-400 hover:text-rose-500 rounded disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick add form */}
            <form onSubmit={handleAddItem} className="flex gap-2 mt-2 pt-2 border-t border-zinc-200/30">
              <select
                value={newOptionEmoji}
                onChange={(e) => setNewOptionEmoji(e.target.value)}
                disabled={isSpinning}
                className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-955/40 border border-zinc-200/50 dark:border-zinc-800/40 text-sm outline-none cursor-pointer"
              >
                {POPULAR_EMOJIS.map(em => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Add customized choice..."
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                disabled={isSpinning}
                maxLength={30}
                required
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-zinc-955/40 border border-zinc-200/50 dark:border-zinc-800/40 text-zinc-900 dark:text-white outline-none"
              />
              <button
                type="submit"
                disabled={isSpinning}
                className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Center / Right Side: Spinning Wheel Showcase (Col-span-7) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center gap-6 p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md">
          
          {/* Wheel Frame */}
          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
            
            {/* Top Pointer Indicator */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 21L3 6C3 6 8.5 7 12 7C15.5 7 21 6 21 6L12 21Z" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                <circle cx="12" cy="5" r="3" fill="#fda4af" />
              </svg>
            </div>

            {/* Glowing Ring around wheel */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 to-pink-500/20 blur-md scale-[1.03] animate-pulse pointer-events-none" />

            {/* SVG Wheel element */}
            <svg
              ref={wheelRef}
              width="300"
              height="300"
              viewBox="0 0 300 300"
              className="w-full h-full filter drop-shadow-xl z-10 transition-transform duration-75 select-none"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <defs>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
                </filter>
              </defs>
              
              {/* Slices drawing */}
              <g filter="url(#shadow)">
                {items.map((item, idx) => {
                  const startAngleDeg = idx * sliceAngle;
                  const endAngleDeg = (idx + 1) * sliceAngle;
                  const startAngleRad = (startAngleDeg * Math.PI) / 180;
                  const endAngleRad = (endAngleDeg * Math.PI) / 180;

                  // Slice path drawing coordinates
                  const x1 = cx + radius * Math.cos(startAngleRad);
                  const y1 = cy + radius * Math.sin(startAngleRad);
                  const x2 = cx + radius * Math.cos(endAngleRad);
                  const y2 = cy + radius * Math.sin(endAngleRad);

                  // Flag for angle > 180 degrees
                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                  // SVG Arc command
                  const dPath = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  // Bisector angle for placing labels pointing outward
                  const bisectorAngleDeg = startAngleDeg + sliceAngle / 2;

                  return (
                    <g key={idx}>
                      <path
                        d={dPath}
                        fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="dark:stroke-zinc-900 transition-colors"
                      />
                      
                      {/* Segment text group */}
                      <g transform={`translate(${cx}, ${cy}) rotate(${bisectorAngleDeg})`}>
                        <text
                          x="55"
                          y="4"
                          textAnchor="start"
                          className="text-[10px] font-extrabold font-sans fill-zinc-800 select-none tracking-wide"
                        >
                          {item.emoji} {item.text.length > 13 ? item.text.substring(0, 11) + "..." : item.text}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Outside border circle */}
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f43f5e" strokeWidth="4" />
              <circle cx={cx} cy={cy} r={radius + 4} fill="none" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="4" />
            </svg>

            {/* Static Spin Button in Center */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 border-4 border-white dark:border-zinc-900 shadow-xl hover:scale-105 active:scale-95 transition-all z-20 flex flex-col items-center justify-center cursor-pointer group disabled:cursor-not-allowed"
              title="Click to Spin"
            >
              <Heart className={`w-6 h-6 text-white fill-white ${isSpinning ? "animate-pulse" : "group-hover:animate-bounce"}`} />
              <span className="text-[8px] font-extrabold text-white tracking-wider leading-none uppercase mt-0.5">
                {isSpinning ? "SPINNING" : "SPIN"}
              </span>
            </button>
          </div>

          {/* Interactive instruction & details */}
          <div className="text-center max-w-sm flex flex-col gap-2">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">
              Active Category
            </h3>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5 bg-rose-500/5 px-4 py-1.5 rounded-full border border-rose-500/10">
              <span>{categories.find(c => c.id === activeCategoryId)?.icon}</span>
              <span>{categories.find(c => c.id === activeCategoryId)?.name}</span>
            </p>
            <div className="flex gap-2 mt-2 justify-center">
              <button
                onClick={handleSpin}
                disabled={isSpinning || items.length < 2}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Spin Decision Wheel!</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Log (Lower section) */}
      <div className="p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md flex flex-col gap-4">
        <div className="flex justify-between items-center border-b pb-3 border-zinc-200/30">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <History className="w-4 h-4 text-rose-500" />
            <span>Couple Decision History & Logs</span>
          </h2>
          {history.length > 0 && (
            <button
              onClick={handleResetHistory}
              className="text-[10px] font-bold text-zinc-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-3xl text-zinc-300">🕰️</span>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">No history recorded yet</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Spin the wheel above to make decisions and they will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((hist) => (
              <div 
                key={hist.id} 
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  hist.completed
                    ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/20"
                    : "bg-white/40 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0 bg-white/60 dark:bg-zinc-950/40 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                    {hist.emoji}
                  </span>
                  <div className="min-w-0 flex flex-col">
                    <span className={`text-xs font-extrabold truncate ${hist.completed ? "line-through text-zinc-400" : "text-zinc-850 dark:text-zinc-150"}`}>
                      {hist.text}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      <span>{hist.categoryName}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                      <span>{hist.date}</span>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleHistoryCompleted(hist.id)}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    hist.completed
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-emerald-500/50 text-zinc-400 hover:text-emerald-500"
                  }`}
                  title={hist.completed ? "Mark as Incomplete" : "Mark as Completed"}
                >
                  <Check className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE NEW WHEEL MODAL */}
      {showSaveWheelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white/95 dark:bg-zinc-950/95 border border-zinc-200/50 dark:border-zinc-850/50 shadow-2xl backdrop-blur-xl flex flex-col gap-4">
            
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-md font-bold font-cursive text-rose-500 flex items-center gap-1.5">
                <span>🎡 Create Custom Wheel</span>
              </h3>
              <button 
                onClick={() => setShowSaveWheelModal(false)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Wheel Title</label>
                <input
                  type="text"
                  required
                  value={newWheelName}
                  onChange={(e) => setNewWheelName(e.target.value)}
                  placeholder="Date Night Ideas, Chore Picker..."
                  maxLength={25}
                  className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 text-xs outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Wheel Category Icon</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["🎡", "🍽️", "☕", "🍿", "🍳", "🚶‍♂️", "📚", "🧺", "🥂", "✈️"].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewWheelIcon(em)}
                      className={`text-lg p-1.5 rounded-xl transition-all cursor-pointer ${
                        newWheelIcon === em 
                          ? "bg-rose-500/10 border-rose-500 border-2" 
                          : "bg-zinc-100/50 dark:bg-zinc-850/40 border border-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateCustomWheel}
                disabled={!newWheelName.trim()}
                className="w-full mt-2 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                Create Custom Wheel ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPINNING RESULT CELEBRATION MODAL */}
      {showResultModal && winningItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          
          {/* Confetti Particle Layer */}
          <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute animate-fall-particle select-none"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}px`,
                  fontSize: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  color: p.color
                }}
              >
                {p.emoji}
              </div>
            ))}
          </div>

          <div className="relative w-full max-w-md p-7 rounded-3xl bg-white/95 dark:bg-zinc-950/95 border-2 border-rose-500/30 dark:border-rose-900/30 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center gap-5 z-40 animate-scale-up">
            
            {/* Celebration Glow Header */}
            <div className="relative w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl animate-bounce">
              <span>{winningItem.emoji}</span>
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
              <span className="absolute -bottom-1 -left-1 text-xs">✨</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                Fate Has Decided! 🎡
              </span>
              <h2 className="text-lg font-bold text-zinc-500 dark:text-zinc-400 font-sans mt-1">
                Your next adventure is:
              </h2>
            </div>

            {/* Selected item details text block */}
            <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-zinc-900/60 dark:to-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 shadow-inner flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">{winningItem.emoji}</span>
              <span className="text-xl font-cursive font-bold text-rose-600 dark:text-rose-400">
                {winningItem.text}
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold italic flex items-center gap-1.5 justify-center">
              <span>"Looks like your next adventure is: {winningItem.text} {winningItem.emoji}"</span>
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full mt-2">
              
              <div className="grid grid-cols-2 gap-2">
                {/* Save and timeline actions */}
                <button
                  onClick={handleAddToTimeline}
                  disabled={addedToTimeline}
                  className={`py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                    addedToTimeline
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-500 opacity-80"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:scale-98"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{addedToTimeline ? "Added ✅" : "Add to Timeline"}</span>
                </button>

                <button
                  onClick={handleMarkAsCompleted}
                  disabled={completedAdventure}
                  className={`py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                    completedAdventure
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 opacity-80"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 active:scale-98"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{completedAdventure ? "Completed! 🎉" : "Mark Done"}</span>
                </button>
              </div>

              <div className="w-[1px] h-2" />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    handleSpin();
                  }}
                  className="flex-1 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Spin Again 🔄
                </button>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="flex-1 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Close & Done 💕
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
