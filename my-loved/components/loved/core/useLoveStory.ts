import { useState, useEffect, useRef } from "react";
import { AmbientSynth } from "@/components/loved/core/AmbientSynth";
import { ROMANTIC_QUOTES } from "@/components/loved/core/constants";
import { useAnniversaryTimer } from "./useAnniversaryTimer";
import { useLoveAnimations } from "./useLoveAnimations";
import { useMilestones } from "./useMilestones";
import { useRomanticNotes } from "./useRomanticNotes";
import { useJournalAndStreaks } from "./useJournalAndStreaks";

export function useLoveStory() {
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [themeId, setThemeIdState] = useState("rose-gold");
  
  // Customisable names & descriptions
  const [personAName, setPersonANameState] = useState("Romeo");
  const [personBName, setPersonBNameState] = useState("Juliet");
  const [personADesc, setPersonADescState] = useState("My Universe 🌌");
  const [personBDesc, setPersonBDescState] = useState("My Anchor ⚓");
  const [personAAvatar, setPersonAAvatarState] = useState("");
  const [personBAvatar, setPersonBAvatarState] = useState("");
  
  // Audio state & Synth
  const [isMuted, setIsMuted] = useState(true);
  const synthRef = useRef<AmbientSynth | null>(null);

  // Miscellaneous States
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activePartner, setActivePartner] = useState<"A" | "B">("A");

  // Load basic configurations from DB and local storage
  useEffect(() => {
    setMounted(true);

    fetch("/api/couple")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.couple) {
          const c = data.couple;
          if (c.personAName) setPersonANameState(c.personAName);
          if (c.personBName) setPersonBNameState(c.personBName);
          if (c.personADesc) setPersonADescState(c.personADesc);
          if (c.personBDesc) setPersonBDescState(c.personBDesc);
          if (c.personAAvatar) setPersonAAvatarState(c.personAAvatar);
          if (c.personBAvatar) setPersonBAvatarState(c.personBAvatar);
          if (c.themeId) setThemeIdState(c.themeId);
        }
      })
      .catch((err) => console.error("Failed to load couple configurations from DB:", err));

    const savedPersonA = localStorage.getItem("loved_personA");
    const savedPersonB = localStorage.getItem("loved_personB");
    const savedPersonADesc = localStorage.getItem("loved_personA_desc");
    const savedPersonBDesc = localStorage.getItem("loved_personB_desc");
    const savedPersonAAvatar = localStorage.getItem("loved_personA_avatar");
    const savedPersonBAvatar = localStorage.getItem("loved_personB_avatar");
    const savedTheme = localStorage.getItem("loved_theme");

    if (savedPersonA) setPersonANameState(savedPersonA);
    if (savedPersonB) setPersonBNameState(savedPersonB);
    if (savedPersonADesc) setPersonADescState(savedPersonADesc);
    if (savedPersonBDesc) setPersonBDescState(savedPersonBDesc);
    if (savedPersonAAvatar) setPersonAAvatarState(savedPersonAAvatar);
    if (savedPersonBAvatar) setPersonBAvatarState(savedPersonBAvatar);
    if (savedTheme) setThemeIdState(savedTheme);

    setQuoteIndex(Math.floor(Math.random() * ROMANTIC_QUOTES.length));
    synthRef.current = new AmbientSynth();

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Sync state helpers that update DB + localStorage
  const syncCoupleField = (fields: Record<string, any>) => {
    fetch("/api/couple", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }).catch((err) => console.error("Failed to sync couple field to DB:", err));
  };

  const setPersonAName = (val: string) => {
    setPersonANameState(val);
    localStorage.setItem("loved_personA", val);
    syncCoupleField({ personAName: val });
    window.dispatchEvent(new Event("loved_names_updated"));
  };

  const setPersonBName = (val: string) => {
    setPersonBNameState(val);
    localStorage.setItem("loved_personB", val);
    syncCoupleField({ personBName: val });
    window.dispatchEvent(new Event("loved_names_updated"));
  };

  const setPersonADesc = (val: string) => {
    setPersonADescState(val);
    localStorage.setItem("loved_personA_desc", val);
    syncCoupleField({ personADesc: val });
  };

  const setPersonBDesc = (val: string) => {
    setPersonBDescState(val);
    localStorage.setItem("loved_personB_desc", val);
    syncCoupleField({ personBDesc: val });
  };

  const setPersonAAvatar = (val: string) => {
    setPersonAAvatarState(val);
    localStorage.setItem("loved_personA_avatar", val);
    syncCoupleField({ personAAvatar: val });
  };

  const setPersonBAvatar = (val: string) => {
    setPersonBAvatarState(val);
    localStorage.setItem("loved_personB_avatar", val);
    syncCoupleField({ personBAvatar: val });
  };

  const setThemeId = (val: string) => {
    setThemeIdState(val);
    localStorage.setItem("loved_theme", val);
    syncCoupleField({ themeId: val });
  };

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

  // Sub-hooks delegation
  const timer = useAnniversaryTimer(mounted);
  const animations = useLoveAnimations(mounted, isMuted, synthRef);
  const milestones = useMilestones(mounted);
  const romanticNotes = useRomanticNotes(mounted, personAName, personBName);
  const journalAndStreaks = useJournalAndStreaks(
    mounted,
    activePartner,
    isMuted,
    synthRef
  );

  return {
    mounted,
    showIntro,
    setShowIntro,
    showSettings,
    setShowSettings,
    themeId,
    setThemeId,
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
    isMuted,
    setIsMuted,
    synthRef,
    quoteIndex,
    setQuoteIndex,
    togglePlay,

    // Timer delegation
    anniversaryDate: timer.anniversaryDate,
    setAnniversaryDate: timer.setAnniversaryDate,
    customTitle: timer.customTitle,
    setCustomTitle: timer.setCustomTitle,
    timeLeft: timer.timeLeft,

    // Animations delegation
    burstHearts: animations.burstHearts,
    floatingBgHearts: animations.floatingBgHearts,
    triggerHeartBurst: animations.triggerHeartBurst,

    // Milestones delegation
    milestones: milestones.milestones,
    newMilestoneTitle: milestones.newMilestoneTitle,
    setNewMilestoneTitle: milestones.setNewMilestoneTitle,
    newMilestoneDate: milestones.newMilestoneDate,
    setNewMilestoneDate: milestones.setNewMilestoneDate,
    newMilestoneDesc: milestones.newMilestoneDesc,
    setNewMilestoneDesc: milestones.setNewMilestoneDesc,
    newMilestoneIcon: milestones.newMilestoneIcon,
    setNewMilestoneIcon: milestones.setNewMilestoneIcon,
    handleAddMilestone: milestones.handleAddMilestone,
    handleRemoveMilestone: milestones.handleRemoveMilestone,

    // Notes delegation
    notes: romanticNotes.notes,
    newNoteText: romanticNotes.newNoteText,
    setNewNoteText: romanticNotes.setNewNoteText,
    newNoteAuthor: romanticNotes.newNoteAuthor,
    setNewNoteAuthor: romanticNotes.setNewNoteAuthor,
    newNoteColor: romanticNotes.newNoteColor,
    setNewNoteColor: romanticNotes.setNewNoteColor,
    handleAddNote: romanticNotes.handleAddNote,
    handleRemoveNote: romanticNotes.handleRemoveNote,

    // Journal & Streaks delegation
    journalEntries: journalAndStreaks.journalEntries,
    activePartner,
    setActivePartner,
    showCelebration: journalAndStreaks.showCelebration,
    setShowCelebration: journalAndStreaks.setShowCelebration,
    streakInfo: journalAndStreaks.streakInfo,
    handleAddJournalEntry: journalAndStreaks.handleAddJournalEntry,
    handleAddJournalComment: journalAndStreaks.handleAddJournalComment,
    handleRemoveJournalEntry: journalAndStreaks.handleRemoveJournalEntry,
    handleRemoveJournalComment: journalAndStreaks.handleRemoveJournalComment,
    handleEditJournalComment: journalAndStreaks.handleEditJournalComment,
    triggerStreakCelebration: journalAndStreaks.triggerStreakCelebration,
    
    // Streak Recovery delegation
    recoveredDates: journalAndStreaks.recoveredDates,
    recoveriesUsed: journalAndStreaks.recoveriesUsed,
    lastActiveStreak: journalAndStreaks.lastActiveStreak,
    handleRecoverStreak: journalAndStreaks.handleRecoverStreak
  };
}
