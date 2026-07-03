import { Theme } from "./types";

export const ROMANTIC_QUOTES = [
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine. — Maya Angelou",
  "If I know what love is, it is because of you. — Hermann Hesse",
  "I love you not only for what you are, but for what I am when I am with you. — Roy Croft",
  "You are my today and all of my tomorrows. — Leo Christopher",
  "The best thing to hold onto in life is each other. — Audrey Hepburn",
  "Whatever our souls are made of, his and mine are the same. — Emily Brontë",
  "In case you ever foolishly forget: I am never not thinking of you. — Virginia Woolf",
  "Grow old along with me! The best is yet to be. — Robert Browning"
];

export const THEMES: Theme[] = [
  {
    id: "rose-gold",
    name: "Rose Gold Romance",
    gradient: "from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-rose-950/20",
    textAccent: "text-rose-600 dark:text-rose-400",
    cardBg: "bg-white/70 dark:bg-zinc-900/60",
    heartColor: "fill-rose-500 text-rose-500",
    borderColor: "border-rose-200/50 dark:border-rose-900/30",
    particleColors: ["#f43f5e", "#ec4899", "#f472b6", "#fda4af"],
    bgType: "hearts"
  },
  {
    id: "lilac-dream",
    name: "Lilac Dream 🪻",
    gradient: "from-purple-50 via-indigo-50 to-purple-100 dark:from-zinc-950 dark:to-purple-950/20",
    textAccent: "text-purple-600 dark:text-purple-400",
    cardBg: "bg-white/70 dark:bg-zinc-900/60",
    heartColor: "fill-purple-500 text-purple-500",
    borderColor: "border-purple-200/50 dark:border-purple-900/30",
    particleColors: ["#a855f7", "#c084fc", "#e879f9", "#ec4899"],
    bgType: "hearts"
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    gradient: "from-amber-50 via-rose-50 to-orange-100 dark:from-zinc-950 dark:via-orange-950/10 dark:to-rose-950/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    cardBg: "bg-white/60 dark:bg-zinc-900/50",
    heartColor: "fill-amber-500 text-amber-500",
    borderColor: "border-amber-200/40 dark:border-amber-900/20",
    particleColors: ["#f59e0b", "#f97316", "#ef4444", "#f472b6"],
    bgType: "hearts"
  },
  {
    id: "sakura-bloom",
    name: "Sakura Blossom",
    gradient: "from-pink-50 via-red-50 to-pink-100 dark:from-zinc-950 dark:to-pink-950/20",
    textAccent: "text-pink-600 dark:text-pink-400",
    cardBg: "bg-white/80 dark:bg-zinc-900/60",
    heartColor: "fill-pink-500 text-pink-500",
    borderColor: "border-pink-200/50 dark:border-pink-900/30",
    particleColors: ["#ec4899", "#f472b6", "#fbcfe8", "#fda4af"],
    bgType: "hearts"
  },
  {
    id: "starry-galaxy",
    name: "Starry Galaxy 🌌",
    gradient: "from-zinc-950 via-slate-900 to-black",
    textAccent: "text-indigo-400",
    cardBg: "bg-slate-900/60 dark:bg-zinc-900/50",
    heartColor: "fill-indigo-500 text-indigo-500",
    borderColor: "border-slate-800/50 dark:border-zinc-800/50",
    particleColors: ["#818cf8", "#a78bfa", "#e0e7ff", "#ffffff"],
    bgType: "stars"
  },
  {
    id: "gravity-attraction",
    name: "Gravity Attraction 💫",
    gradient: "from-zinc-950 via-rose-950/20 to-black",
    textAccent: "text-rose-400",
    cardBg: "bg-zinc-900/60 dark:bg-zinc-900/50",
    heartColor: "fill-rose-500 text-rose-500",
    borderColor: "border-zinc-800/50 dark:border-zinc-800/50",
    particleColors: ["#fb7185", "#f43f5e", "#fda4af", "#ffffff"],
    bgType: "gravity"
  },
  {
    id: "fireworks-celebration",
    name: "Fireworks Celebration 🎆",
    gradient: "from-indigo-950 via-zinc-950 to-black",
    textAccent: "text-amber-400",
    cardBg: "bg-zinc-900/70 dark:bg-zinc-900/60",
    heartColor: "fill-amber-500 text-amber-500",
    borderColor: "border-zinc-800/50 dark:border-zinc-800/50",
    particleColors: ["#fbbf24", "#f97316", "#ef4444", "#38bdf8"],
    bgType: "fireworks"
  }
];
