import { useState, useEffect } from "react";
import { JournalEntry, JournalComment } from "@/components/loved/core/types";
import { AmbientSynth } from "@/components/loved/core/AmbientSynth";

export function useJournalAndStreaks(
  mounted: boolean,
  activePartner: "A" | "B",
  isMuted: boolean,
  synthRef: React.MutableRefObject<AmbientSynth | null>
) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Streak Recovery States
  const [recoveredDates, setRecoveredDates] = useState<string[]>([]);
  const [recoveriesUsed, setRecoveriesUsed] = useState<number>(0);
  const [lastActiveStreak, setLastActiveStreak] = useState<number>(0);

  // Load from local storage
  useEffect(() => {
    if (!mounted) return;
    
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

    const savedRecoveredDates = localStorage.getItem("loved_recovered_dates");
    const savedRecoveriesUsed = localStorage.getItem("loved_recoveries_used");
    const savedLastActiveStreak = localStorage.getItem("loved_last_active_streak");

    if (savedRecoveredDates) setRecoveredDates(JSON.parse(savedRecoveredDates));
    if (savedRecoveriesUsed) setRecoveriesUsed(parseInt(savedRecoveriesUsed, 10));
    if (savedLastActiveStreak) setLastActiveStreak(parseInt(savedLastActiveStreak, 10));
  }, [mounted]);

  // Sync to local storage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("loved_recovered_dates", JSON.stringify(recoveredDates));
    localStorage.setItem("loved_recoveries_used", recoveriesUsed.toString());
    localStorage.setItem("loved_last_active_streak", lastActiveStreak.toString());
  }, [recoveredDates, recoveriesUsed, lastActiveStreak, mounted]);

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

  // Edit comment in entry
  const handleEditJournalComment = (entryId: string, commentId: string, content: string) => {
    if (!content.trim()) return;
    const updatedEntries = journalEntries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          comments: entry.comments.map((c) => 
            c.id === commentId 
              ? { ...c, content: content.trim(), createdAt: new Date().toISOString() } 
              : c
          )
        };
      }
      return entry;
    });
    saveJournalEntries(updatedEntries);
  };

  // Get local date string YYYY-MM-DD
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Max recoveries helper
  const getMaxRecoveries = (streakCount: number) => {
    if (streakCount >= 500) return 5;
    if (streakCount >= 100) return 3;
    return 1;
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

    const isDayCompletedOrRecovered = (dateStr: string) => {
      return isDayCompleted(dateStr) || recoveredDates.includes(dateStr);
    };

    const today = new Date();
    let streak = 0;
    const checkDate = new Date(today);

    const todayStr = getLocalDateString(checkDate);
    const todayCompleted = isDayCompletedOrRecovered(todayStr);

    if (todayCompleted) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dateStr = getLocalDateString(checkDate);
        if (isDayCompletedOrRecovered(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = getLocalDateString(checkDate);
      if (isDayCompletedOrRecovered(yesterdayStr)) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const dateStr = getLocalDateString(checkDate);
          if (isDayCompletedOrRecovered(dateStr)) {
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
          const noteFreqs = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
          noteFreqs.forEach((freq, idx) => {
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

  // Recover streak handler
  const handleRecoverStreak = () => {
    const isDayCompleted = (dateStr: string) => {
      const entryA = journalEntries.find(e => e.date === dateStr && e.author === "A");
      const entryB = journalEntries.find(e => e.date === dateStr && e.author === "B");
      if (!entryA || !entryB) return false;
      const aCommentedOnB = entryB.comments.some(c => c.author === "A");
      const bCommentedOnA = entryA.comments.some(c => c.author === "B");
      return aCommentedOnB && bCommentedOnA;
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const check = new Date(yesterday);
    let brokenDate = getLocalDateString(yesterday);

    for (let i = 0; i < 30; i++) {
      const dateStr = getLocalDateString(check);
      if (!isDayCompleted(dateStr) && !recoveredDates.includes(dateStr)) {
        brokenDate = dateStr;
        break;
      }
      check.setDate(check.getDate() - 1);
    }

    const maxRec = getMaxRecoveries(lastActiveStreak);
    if (recoveriesUsed >= maxRec) {
      alert("No recoveries remaining for this streak level!");
      return;
    }

    setRecoveredDates(prev => [...prev, brokenDate]);
    setRecoveriesUsed(prev => prev + 1);
    triggerStreakCelebration();
  };

  // Reset or update recovery usage when streak starts anew
  useEffect(() => {
    if (!mounted) return;

    const currentStreakCount = streakInfo.count;

    if (currentStreakCount > 0) {
      if (currentStreakCount > lastActiveStreak) {
        setLastActiveStreak(currentStreakCount);
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday);

      const isDayCompleted = (dateStr: string) => {
        const entryA = journalEntries.find(e => e.date === dateStr && e.author === "A");
        const entryB = journalEntries.find(e => e.date === dateStr && e.author === "B");
        if (!entryA || !entryB) return false;
        const aCommentedOnB = entryB.comments.some(c => c.author === "A");
        const bCommentedOnA = entryA.comments.some(c => c.author === "B");
        return aCommentedOnB && bCommentedOnA;
      };

      const yesterdayCompletedOrRecovered = isDayCompleted(yesterdayStr) || recoveredDates.includes(yesterdayStr);

      if (currentStreakCount === 1 && !yesterdayCompletedOrRecovered) {
        if (recoveredDates.length > 0 || recoveriesUsed > 0 || lastActiveStreak !== 1) {
          setRecoveredDates([]);
          setRecoveriesUsed(0);
          setLastActiveStreak(1);
        }
      }
    }
  }, [journalEntries, recoveredDates, mounted]);

  return {
    journalEntries,
    showCelebration,
    setShowCelebration,
    recoveredDates,
    recoveriesUsed,
    lastActiveStreak,
    streakInfo,
    handleAddJournalEntry,
    handleAddJournalComment,
    handleRemoveJournalEntry,
    handleRemoveJournalComment,
    handleEditJournalComment,
    triggerStreakCelebration,
    handleRecoverStreak
  };
}
