"use client";

import { useState, useEffect } from "react";

export function useSurpriseState(loved: any) {
  const [isMuted, setIsMuted] = useState(false);
  const [envelopeState, setEnvelopeState] = useState<"closed" | "seal-breaking" | "opening" | "letter-sliding" | "zoomed">("closed");
  const [activeLetterTab, setActiveLetterTab] = useState<"card" | "secret-note" | "write-note">("card");
  const [typedMessage, setTypedMessage] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [showPolaroids, setShowPolaroids] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const [daysTogether, setDaysTogether] = useState(0);
  const [monthsTogether, setMonthsTogether] = useState(0);
  const [yearsTogether, setYearsTogether] = useState(0);
  const [milestoneTitle, setMilestoneTitle] = useState("Happy Anniversary");

  // Load custom note from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("loved_custom_secret_note");
      if (existing) {
        setSavedNote(existing);
        setNoteContent(existing);
      } else {
        const defaultNote = `My dearest, thank you for being by my side. Every single day with you is a gift, and I cherish every second, every laugh, and every quiet Sunday we share together. Yours forever and always. ❤️`;
        setSavedNote(defaultNote);
        setNoteContent(defaultNote);
        localStorage.setItem("loved_custom_secret_note", defaultNote);
      }
      setIsMuted(loved.isMuted);
    }
  }, [loved.isMuted]);

  // Calculate actual relationship duration
  useEffect(() => {
    const anni = localStorage.getItem("loved_anniversary") || localStorage.getItem("loved_anniversaryDate") || "2025-01-01";
    try {
      const start = new Date(anni);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
      setDaysTogether(days);

      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      setYearsTogether(years);
      setMonthsTogether(months);

      // Determine today's milestone title based on timeline and current date
      const today = new Date();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();

      // Check default anniversary date
      if (start.getMonth() === todayMonth && start.getDate() === todayDay) {
        setMilestoneTitle(`${years > 0 ? `${years} Year` : "Happy"} Anniversary 💖`);
        return;
      }

      // Check standard milestones in timeline
      const milestonesStr = localStorage.getItem("loved_milestones");
      if (milestonesStr) {
        const milestones = JSON.parse(milestonesStr);
        for (const m of milestones) {
          if (m.date) {
            const mDate = new Date(m.date);
            if (mDate.getMonth() === todayMonth && mDate.getDate() === todayDay) {
              setMilestoneTitle(`Happy ${m.title} Anniversary 🎉`);
              return;
            }
          }
        }
      }

      // Check monthly milestones
      if (start.getDate() === todayDay) {
        setMilestoneTitle(`Monthly Milestone Day 🌸`);
        return;
      }

      setMilestoneTitle("Our Relationship Milestone ✨");
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Web Audio ambient sound effects helper
  const triggerAudioEffect = (type: "seal" | "unfold" | "confetti") => {
    if (isMuted || !loved.synthRef?.current) return;
    try {
      const audioCtx = (loved.synthRef.current as any).ctx;
      if (audioCtx && audioCtx.state !== "suspended") {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        if (type === "seal") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        } else if (type === "unfold") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(330, now);
          osc.frequency.linearRampToValueAtTime(660, now + 0.4);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        } else if (type === "confetti") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        }

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(now + 0.7);
      }
    } catch (e) {}
  };

  // Open envelope animation workflow
  const handleOpenEnvelope = () => {
    if (envelopeState !== "closed") return;

    if (loved.synthRef?.current && !loved.synthRef.current.isPlaying) {
      loved.synthRef.current.start();
    }

    setEnvelopeState("seal-breaking");
    triggerAudioEffect("seal");

    setTimeout(() => {
      setEnvelopeState("opening");
      
      setTimeout(() => {
        setEnvelopeState("letter-sliding");
        triggerAudioEffect("unfold");

        setTimeout(() => {
          setEnvelopeState("zoomed");
          setShowPolaroids(true);
          setTriggerConfetti(true);
          triggerAudioEffect("confetti");
        }, 1200);
      }, 1000);
    }, 800);
  };

  // Typewriter printing inside letter card
  useEffect(() => {
    if (envelopeState !== "zoomed") return;
    
    const message = `Every single step of our path together—the spontaneous road trips, the late night coffees, the shared playlists, and the silent handholding—has built something truly beautiful. Thank you for making my life feel like a fairy tale. Happy Milestone! 🌸💖`;
    
    let idx = 0;
    setTypedMessage("");
    const timer = setInterval(() => {
      setTypedMessage((prev) => prev + message.charAt(idx));
      idx++;
      if (idx >= message.length) {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [envelopeState]);

  const toggleMute = () => {
    if (loved.synthRef?.current) {
      if (isMuted) {
        loved.synthRef.current.start();
        setIsMuted(false);
      } else {
        loved.synthRef.current.stop();
        setIsMuted(true);
      }
    }
  };

  const handleSaveNote = () => {
    localStorage.setItem("loved_custom_secret_note", noteContent);
    setSavedNote(noteContent);
    setActiveLetterTab("secret-note");
  };

  return {
    isMuted,
    envelopeState,
    activeLetterTab,
    setActiveLetterTab,
    typedMessage,
    noteContent,
    setNoteContent,
    savedNote,
    showPolaroids,
    triggerConfetti,
    daysTogether,
    monthsTogether,
    yearsTogether,
    milestoneTitle,
    handleOpenEnvelope,
    toggleMute,
    handleSaveNote
  };
}
