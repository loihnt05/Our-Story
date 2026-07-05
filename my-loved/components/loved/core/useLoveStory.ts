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
  const [themeId, setThemeId] = useState("rose-gold");
  
  // Customisable names & descriptions
  const [personAName, setPersonAName] = useState("Romeo");
  const [personBName, setPersonBName] = useState("Juliet");
  const [personADesc, setPersonADesc] = useState("My Universe 🌌");
  const [personBDesc, setPersonBDesc] = useState("My Anchor ⚓");
  const [personAAvatar, setPersonAAvatar] = useState("");
  const [personBAvatar, setPersonBAvatar] = useState("");
  
  // Audio state & Synth
  const [isMuted, setIsMuted] = useState(true);
  const synthRef = useRef<AmbientSynth | null>(null);

  // Miscellaneous States
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activePartner, setActivePartner] = useState<"A" | "B">("A");

  // Load basic configurations from local storage
  useEffect(() => {
    setMounted(true);
    const savedPersonA = localStorage.getItem("loved_personA");
    const savedPersonB = localStorage.getItem("loved_personB");
    const savedPersonADesc = localStorage.getItem("loved_personA_desc");
    const savedPersonBDesc = localStorage.getItem("loved_personB_desc");
    const savedPersonAAvatar = localStorage.getItem("loved_personA_avatar");
    const savedPersonBAvatar = localStorage.getItem("loved_personB_avatar");
    const savedTheme = localStorage.getItem("loved_theme");

    if (savedPersonA) setPersonAName(savedPersonA);
    if (savedPersonB) setPersonBName(savedPersonB);
    if (savedPersonADesc) setPersonADesc(savedPersonADesc);
    if (savedPersonBDesc) setPersonBDesc(savedPersonBDesc);
    if (savedPersonAAvatar) setPersonAAvatar(savedPersonAAvatar);
    if (savedPersonBAvatar) setPersonBAvatar(savedPersonBAvatar);
    if (savedTheme) setThemeId(savedTheme);

    setQuoteIndex(Math.floor(Math.random() * ROMANTIC_QUOTES.length));
    synthRef.current = new AmbientSynth();

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Sync basic configurations to local storage when changed
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("loved_personA", personAName);
    localStorage.setItem("loved_personB", personBName);
    localStorage.setItem("loved_personA_desc", personADesc);
    localStorage.setItem("loved_personB_desc", personBDesc);
    localStorage.setItem("loved_personA_avatar", personAAvatar);
    localStorage.setItem("loved_personB_avatar", personBAvatar);
    localStorage.setItem("loved_theme", themeId);
  }, [personAName, personBName, personADesc, personBDesc, personAAvatar, personBAvatar, themeId, mounted]);

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
