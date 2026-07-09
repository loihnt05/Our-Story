import { Milestone } from "./types";

export const FALLBACK_MEMORIES: Milestone[] = [
  { id: "f1", title: "First Café Date ☕", date: "2024-11-20", description: "Shared a warm cappuccino and talked for three hours straight.", icon: "☕" },
  { id: "f2", title: "Watched the Sunset 🌅", date: "2024-12-15", description: "Sat on the hilltop wrapped in a single blanket as the sun dipped below the trees.", icon: "🌅" },
  { id: "f3", title: "Cooked Sushi Together 🍣", date: "2025-01-20", description: "Rice went everywhere, but the rolls turned out surprisingly delicious!", icon: "🍣" },
  { id: "f4", title: "Weekend Road Trip 🚗", date: "2025-03-12", description: "Drove out to the countryside with a custom playlist on repeat.", icon: "🚗" },
  { id: "f5", title: "First Anniversary 🥂", date: "2025-05-15", description: "Dressed up for a candlelight dinner and exchanged hand-written love letters.", icon: "🥂" },
  { id: "f6", title: "Bookstore Rainy Day 📚", date: "2025-06-08", description: "Spent the entire rainy afternoon reading in the cozy corner of our favorite bookshop.", icon: "📚" }
];

export const BADGES = [
  { name: "Nostalgia Novice 🌸", minScore: 0, desc: "Taking your first steps down memory lane." },
  { name: "Memory Explorer 🗺️", minScore: 100, desc: "Remembering details of multiple sweet journeys." },
  { name: "Milestone Keeper 💍", minScore: 250, desc: "Recalling key romantic memories with high accuracy." },
  { name: "Memory Master 🏆", minScore: 500, desc: "Unmatched synchronization of your relationship journey!" }
];
