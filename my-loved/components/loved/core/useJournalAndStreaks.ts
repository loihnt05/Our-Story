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

  // Load from Database & LocalStorage
  useEffect(() => {
    if (!mounted) return;
    
    // Fetch journal entries from DB
    fetch("/api/journal")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.journalEntries) && data.journalEntries.length > 0) {
          const formatted: JournalEntry[] = data.journalEntries.map((e: any) => ({
            id: e.id,
            date: e.date,
            author: e.author,
            emotion: e.emotion,
            content: e.content,
            createdAt: e.createdAt,
            comments: (e.comments || []).map((c: any) => ({
              id: c.id,
              author: c.author,
              content: c.content,
              createdAt: c.createdAt,
            })),
          }));
          setJournalEntries(formatted);
          localStorage.setItem("loved_journal_entries", JSON.stringify(formatted));
        } else {
          const savedJournal = localStorage.getItem("loved_journal_entries");
          if (savedJournal) {
            try {
              setJournalEntries(JSON.parse(savedJournal));
            } catch (err) {
              console.error("Failed to parse journal from localStorage", err);
            }
          }
        }
      })
      .catch((err) => console.error("Journal fetch error:", err));

    // Fetch couple streak & recovery data
    fetch("/api/couple")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.couple) {
          if (Array.isArray(data.couple.recoveredDates)) {
            setRecoveredDates(data.couple.recoveredDates);
          }
          if (typeof data.couple.recoveriesUsed === "number") {
            setRecoveriesUsed(data.couple.recoveriesUsed);
          }
          if (typeof data.couple.lastActiveStreak === "number") {
            setLastActiveStreak(data.couple.lastActiveStreak);
          }
        }
      })
      .catch((err) => console.error("Couple streak details fetch error:", err));
  }, [mounted]);

  const saveJournalEntries = (updatedList: JournalEntry[]) => {
    setJournalEntries(updatedList);
    localStorage.setItem("loved_journal_entries", JSON.stringify(updatedList));
  };

  // Add/Update daily journal entry
  const handleAddJournalEntry = async (date: string, emotion: string, content: string) => {
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

    // DB sync
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: activePartner, date, emotion, content }),
      });
      const data = await res.json();
      if (data.success && data.entry) {
        setJournalEntries((prev) =>
          prev.map((e) =>
            e.date === date && e.author === activePartner
              ? { ...e, id: data.entry.id }
              : e
          )
        );
      }
    } catch (err) {
      console.error("Failed to sync journal entry to DB:", err);
    }
  };

  // Add comment to journal entry
  const handleAddJournalComment = async (entryId: string, content: string) => {
    if (!content.trim()) return;

    const tempCommentId = `jc-${Date.now()}`;
    const updatedEntries = journalEntries.map((entry) => {
      if (entry.id === entryId) {
        const newComment: JournalComment = {
          id: tempCommentId,
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

    try {
      const res = await fetch("/api/journal/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalEntryId: entryId, author: activePartner, content }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setJournalEntries((prev) =>
          prev.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  comments: e.comments.map((c) =>
                    c.id === tempCommentId ? { ...c, id: data.comment.id } : c
                  ),
                }
              : e
          )
        );
      }
    } catch (err) {
      console.error("Failed to add comment to DB:", err);
    }
  };

  // Remove daily journal entry
  const handleRemoveJournalEntry = async (entryId: string) => {
    const updated = journalEntries.filter((entry) => entry.id !== entryId);
    saveJournalEntries(updated);

    try {
      await fetch(`/api/journal/${entryId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete journal entry from DB:", err);
    }
  };

  // Remove comment from entry
  const handleRemoveJournalComment = async (entryId: string, commentId: string) => {
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

    try {
      await fetch(`/api/journal/comments?id=${commentId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete comment from DB:", err);
    }
  };

  // Edit comment in entry
  const handleEditJournalComment = async (entryId: string, commentId: string, content: string) => {
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

    try {
      await fetch("/api/journal/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, content: content.trim() }),
      });
    } catch (err) {
      console.error("Failed to edit comment in DB:", err);
    }
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
          const noteFreqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
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
  const handleRecoverStreak = async () => {
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

    setRecoveredDates((prev) => [...prev, brokenDate]);
    setRecoveriesUsed((prev) => prev + 1);
    triggerStreakCelebration();

    try {
      await fetch("/api/journal/streak-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDate: brokenDate, author: activePartner }),
      });
    } catch (err) {
      console.error("Failed to save streak recovery to DB:", err);
    }
  };

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
