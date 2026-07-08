"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, FolderHeart } from "lucide-react";
import { DecisionOption, WheelCategory, HistoryItem, DecisionWheelTabProps } from "./types";
import { DEFAULT_CATEGORIES } from "./constants";
import { useDecisionAudio } from "./useDecisionAudio";
import CategorySelector from "./CategorySelector";
import OptionsManager from "./OptionsManager";
import DecisionWheelSVG from "./DecisionWheelSVG";
import CreateWheelModal from "./CreateWheelModal";
import ResultCelebrationModal from "./ResultCelebrationModal";
import HistoryLog from "./HistoryLog";

export default function DecisionWheelTab({ loved, currentTheme, onBack }: DecisionWheelTabProps) {
  // Category states
  const [categories, setCategories] = useState<WheelCategory[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("date-ideas");
  const [items, setItems] = useState<DecisionOption[]>([]);
  
  // Custom wheels modal & forms
  const [showSaveWheelModal, setShowSaveWheelModal] = useState(false);
  const [newWheelName, setNewWheelName] = useState("");
  const [newWheelIcon, setNewWheelIcon] = useState("🎡");
  
  // Wheel Spinning states
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningItem, setWinningItem] = useState<DecisionOption | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [addedToTimeline, setAddedToTimeline] = useState<boolean>(false);
  const [completedAdventure, setCompletedAdventure] = useState<boolean>(false);

  // History log state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Ref for the SVG wheel element to rotate directly (prevents React lag)
  const wheelRef = useRef<SVGSVGElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  const lastSliceIndexRef = useRef<number>(-1);

  // Audio effects hook
  const { playTickSound, playChimeSound, initAudio } = useDecisionAudio(loved?.isMuted);

  // Load custom wheels & history on mount
  useEffect(() => {
    const savedCustom = localStorage.getItem("loved_custom_wheels");
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        setCategories([...DEFAULT_CATEGORIES, ...parsed]);
      } catch (e) {
        console.error("Failed to parse custom wheels", e);
      }
    }

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

  // Helper for saving custom wheels to localStorage
  const saveCustomWheelsToLocalStorage = (allCats: WheelCategory[]) => {
    const customOnly = allCats.filter(c => c.isCustom);
    localStorage.setItem("loved_custom_wheels", JSON.stringify(customOnly));
  };

  // Spin the wheel using requestAnimationFrame
  const handleSpin = () => {
    if (isSpinning || items.length < 2) return;
    
    setIsSpinning(true);
    setShowResultModal(false);
    setAddedToTimeline(false);
    setCompletedAdventure(false);
    
    initAudio();

    const N = items.length;
    const sliceAngle = 360 / N;
    const spins = 6 + Math.floor(Math.random() * 4); // 6 to 9 full spins
    const targetWinIndex = Math.floor(Math.random() * N);
    
    const startAngle = rotationRef.current;
    const normalizedStart = startAngle % 360;
    const targetDiff = (270 - (targetWinIndex * sliceAngle + sliceAngle / 2)) - normalizedStart;
    
    const rotationAddition = targetDiff >= 0 ? targetDiff : targetDiff + 360;
    const finalAngle = startAngle + (spins * 360) + rotationAddition;
    
    const duration = 4800 + Math.random() * 800; // 4.8s to 5.6s
    const startTime = performance.now();
    lastSliceIndexRef.current = -1;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
      const eased = easeOut(progress);
      
      const currentAngle = startAngle + (finalAngle - startAngle) * eased;
      rotationRef.current = currentAngle;
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }
      
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
        
        const activeCat = categories.find(c => c.id === activeCategoryId);
        saveToHistory(items[targetWinIndex], activeCat?.name || "Quick Decision");
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Callback to update active category items (used by OptionsManager)
  const handleUpdateItems = (updatedItems: DecisionOption[]) => {
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
    
    const updated = [newItem, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem("loved_decision_history", JSON.stringify(updated));
  };

  // Toggle adventure completion state
  const toggleHistoryCompleted = (historyId: string) => {
    const updated = history.map(h => {
      if (h.id === historyId) {
        const nextState = !h.completed;
        if (nextState) {
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
          
          <CategorySelector
            categories={categories}
            activeCategoryId={activeCategoryId}
            setActiveCategoryId={setActiveCategoryId}
            isSpinning={isSpinning}
            onDeleteCustomWheel={handleDeleteCustomWheel}
          />

          <OptionsManager
            items={items}
            isSpinning={isSpinning}
            onUpdateItems={handleUpdateItems}
          />
        </div>

        {/* Center / Right Side: Spinning Wheel Showcase (Col-span-7) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center gap-6 p-6 rounded-3xl bg-white/40 dark:bg-zinc-950/20 border border-white/20 backdrop-blur-md">
          
          <DecisionWheelSVG
            items={items}
            rotation={rotation}
            wheelRef={wheelRef}
            isSpinning={isSpinning}
            handleSpin={handleSpin}
          />

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

      <HistoryLog
        history={history}
        onResetHistory={handleResetHistory}
        onToggleCompleted={toggleHistoryCompleted}
      />

      <CreateWheelModal
        isOpen={showSaveWheelModal}
        onClose={() => setShowSaveWheelModal(false)}
        newWheelName={newWheelName}
        setNewWheelName={setNewWheelName}
        newWheelIcon={newWheelIcon}
        setNewWheelIcon={setNewWheelIcon}
        onCreate={handleCreateCustomWheel}
      />

      <ResultCelebrationModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        winningItem={winningItem}
        addedToTimeline={addedToTimeline}
        completedAdventure={completedAdventure}
        handleAddToTimeline={handleAddToTimeline}
        handleMarkAsCompleted={handleMarkAsCompleted}
        handleSpin={handleSpin}
      />

    </div>
  );
}
