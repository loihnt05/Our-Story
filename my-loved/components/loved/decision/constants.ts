import { WheelCategory } from "./types";

export const DEFAULT_CATEGORIES: WheelCategory[] = [
  {
    id: "date-ideas",
    name: "Date Ideas",
    icon: "☕",
    items: [
      { text: "Go to a new café", emoji: "☕" },
      { text: "Watch a movie", emoji: "🍿" },
      { text: "Cook together", emoji: "🍳" },
      { text: "Take a walk", emoji: "🚶‍♂️" },
      { text: "Visit a bookstore", emoji: "📚" },
      { text: "Have a picnic", emoji: "🧺" }
    ]
  },
  {
    id: "food-decisions",
    name: "Food Decisions",
    icon: "🍕",
    items: [
      { text: "Sushi", emoji: "🍣" },
      { text: "Pizza", emoji: "🍕" },
      { text: "Korean BBQ", emoji: "🥩" },
      { text: "Hotpot", emoji: "🍲" },
      { text: "Fast food", emoji: "🍔" },
      { text: "Street food", emoji: "🍢" }
    ]
  },
  {
    id: "fun-challenges",
    name: "Fun Challenges",
    icon: "⚡",
    items: [
      { text: "Take a selfie together", emoji: "📸" },
      { text: "Give 3 compliments", emoji: "💬" },
      { text: "Share a favorite memory", emoji: "💭" },
      { text: "Dance for 1 minute", emoji: "💃" },
      { text: "Write a short love note", emoji: "✉️" }
    ]
  }
];

export const POPULAR_EMOJIS = [
  "💖", "☕", "🍿", "🍳", "🚶‍♂️", "📚", "🧺", "🍣", "🍕", "🥩", "🍲", "🍔", 
  "📸", "💬", "💭", "💃", "✉️", "🥂", "🎡", "🚗", "🎁", "🎨", "🎵", "✈️"
];

export const WHEEL_COLORS = [
  "#FF9AA2", // Pastel Pink-Red
  "#FFB7B2", // Pastel Salmon
  "#FFDAC1", // Pastel Peach
  "#E2F0CB", // Pastel Mint Green
  "#B5EAD7", // Pastel Teal
  "#C7CEEA", // Pastel Lavender Blue
  "#E8C4EC", // Pastel Lavender Purple
  "#FBCFE8"  // Pastel Bubblegum Pink
];
