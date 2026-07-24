import { useState, useEffect } from "react";
import { Note } from "@/components/loved/core/types";

export function useRomanticNotes(mounted: boolean, personAName: string, personBName: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteAuthor, setNewNoteAuthor] = useState("");
  const [newNoteColor, setNewNoteColor] = useState("rose");

  // Load from Database & LocalStorage
  useEffect(() => {
    if (!mounted) return;

    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          const formatted = data.notes.map((n: any) => ({
            id: n.id,
            text: n.text,
            author: n.author,
            date: new Date(n.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
            color: n.color || "rose",
          }));
          setNotes(formatted);
          localStorage.setItem("loved_notes", JSON.stringify(formatted));
        } else {
          const savedNotes = localStorage.getItem("loved_notes");
          if (savedNotes) {
            try {
              setNotes(JSON.parse(savedNotes));
            } catch (err) {
              console.error("Failed to parse notes from localStorage", err);
            }
          }
        }
      })
      .catch((err) => console.error("Notes fetch error:", err));
  }, [mounted]);

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const tempId = Date.now().toString();
    const newN: Note = {
      id: tempId,
      text: newNoteText,
      author: newNoteAuthor || personAName || "Anonymous",
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      color: newNoteColor
    };

    const updated = [newN, ...notes];
    setNotes(updated);
    localStorage.setItem("loved_notes", JSON.stringify(updated));

    const textToSave = newNoteText;
    const authorToSave = newNoteAuthor || personAName || "Anonymous";
    const colorToSave = newNoteColor;

    setNewNoteText("");
    setNewNoteAuthor("");
    setNewNoteColor("rose");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSave, author: authorToSave, color: colorToSave }),
      });
      const data = await res.json();
      if (data.success && data.note) {
        setNotes((prev) =>
          prev.map((n) => (n.id === tempId ? { ...n, id: data.note.id } : n))
        );
      }
    } catch (err) {
      console.error("Failed to save note to DB:", err);
    }
  };

  // Remove Note
  const handleRemoveNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem("loved_notes", JSON.stringify(updated));

    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete note from DB:", err);
    }
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
