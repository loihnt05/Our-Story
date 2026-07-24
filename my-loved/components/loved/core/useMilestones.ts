import { useState, useEffect } from "react";
import { Milestone } from "@/components/loved/core/types";

export function useMilestones(mounted: boolean) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneIcon, setNewMilestoneIcon] = useState("💖");

  // Load from Database & LocalStorage
  useEffect(() => {
    if (!mounted) return;

    fetch("/api/milestones")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.milestones) && data.milestones.length > 0) {
          const formatted = data.milestones.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: new Date(m.date).toISOString().split("T")[0],
            description: m.description,
            icon: m.icon || "💖",
            image: m.image,
          }));
          setMilestones(formatted);
          localStorage.setItem("loved_milestones", JSON.stringify(formatted));
        } else {
          // Fallback local storage
          const savedMilestones = localStorage.getItem("loved_milestones");
          if (savedMilestones) {
            try {
              setMilestones(JSON.parse(savedMilestones));
            } catch (err) {
              console.error("Failed to parse milestones from localStorage", err);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Milestones fetch failed:", err);
      });
  }, [mounted]);

  // Add Milestone
  const handleAddMilestone = async (title: string, date: string, desc: string, icon: string, image?: string) => {
    if (!title || !date) return;
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    const newM: Milestone = {
      id: tempId,
      title,
      date,
      description: desc,
      icon,
      image
    };

    const updated = [...milestones, newM].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setMilestones(updated);
    localStorage.setItem("loved_milestones", JSON.stringify(updated));

    // Database Sync
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, description: desc, icon, image }),
      });
      const data = await res.json();
      if (data.success && data.milestone) {
        setMilestones((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: data.milestone.id } : m))
        );
      }
    } catch (err) {
      console.error("Failed to save milestone to database:", err);
    }
  };

  // Remove Milestone
  const handleRemoveMilestone = async (id: string) => {
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    localStorage.setItem("loved_milestones", JSON.stringify(updated));

    try {
      await fetch(`/api/milestones/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete milestone from database:", err);
    }
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
