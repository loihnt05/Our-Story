import { useState, useEffect } from "react";
import { Milestone } from "@/components/loved/core/types";

export function useMilestones(mounted: boolean) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneIcon, setNewMilestoneIcon] = useState("💖");

  // Load from local storage
  useEffect(() => {
    if (!mounted) return;
    const savedMilestones = localStorage.getItem("loved_milestones");
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
  }, [mounted]);

  // Sync to local storage
  const saveMilestones = (updatedList: Milestone[]) => {
    setMilestones(updatedList);
    localStorage.setItem("loved_milestones", JSON.stringify(updatedList));
  };

  // Add Milestone
  const handleAddMilestone = (title: string, date: string, desc: string, icon: string, image?: string) => {
    if (!title || !date) return;
    
    const newM: Milestone = {
      id: Date.now().toString(),
      title,
      date,
      description: desc,
      icon,
      image
    };

    const updated = [...milestones, newM].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    saveMilestones(updated);
  };

  // Remove Milestone
  const handleRemoveMilestone = (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    saveMilestones(updated);
  };

  return {
    milestones,
    newMilestoneTitle,
    setNewMilestoneTitle,
    newMilestoneDate,
    setNewMilestoneDate,
    newMilestoneDesc,
    setNewMilestoneDesc,
    newMilestoneIcon,
    setNewMilestoneIcon,
    handleAddMilestone,
    handleRemoveMilestone
  };
}
