import { useState, useEffect } from "react";
import { Note } from "@/components/loved/core/types";

export function useRomanticNotes(mounted: boolean, personAName: string, personBName: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteAuthor, setNewNoteAuthor] = useState("");
  const [newNoteColor, setNewNoteColor] = useState("rose");

  // Load from local storage
  useEffect(() => {
    if (!mounted) return;
    const savedNotes = localStorage.getItem("loved_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      const defaultNotes = [
        { id: "1", text: "You make my heart smile in ways nobody else can.", author: personAName || "Romeo", date: "Today", color: "pink" },
        { id: "2", text: "Forever is a long time, but I wouldn't mind spending it with you.", author: personBName || "Juliet", date: "Yesterday", color: "purple" }
      ];
      setNotes(defaultNotes);
      localStorage.setItem("loved_notes", JSON.stringify(defaultNotes));
    }
  }, [mounted, personAName, personBName]);

  // Sync to local storage
  const saveNotes = (updatedList: Note[]) => {
    setNotes(updatedList);
    localStorage.setItem("loved_notes", JSON.stringify(updatedList));
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
    notes,
    newNoteText,
    setNewNoteText,
    newNoteAuthor,
    setNewNoteAuthor,
    newNoteColor,
    setNewNoteColor,
    handleAddNote,
    handleRemoveNote
  };
}
