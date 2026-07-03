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
    particleColors: ["#f43f5e", "#ec4899", "#f472b6", "#fda4af"]
  },
  {
    id: "midnight-velvet",
    name: "Midnight Velvet",
    gradient: "from-slate-950 via-purple-950 to-zinc-950",
    textAccent: "text-purple-400",
    cardBg: "bg-slate-900/60",
    heartColor: "fill-purple-500 text-purple-500",
    borderColor: "border-purple-800/30",
    particleColors: ["#a855f7", "#c084fc", "#e879f9", "#ec4899"]
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    gradient: "from-amber-50 via-rose-50 to-orange-100 dark:from-zinc-950 dark:via-orange-950/10 dark:to-rose-950/20",
    textAccent: "text-amber-600 dark:text-amber-400",
    cardBg: "bg-white/60 dark:bg-zinc-900/50",
    heartColor: "fill-amber-500 text-amber-500",
    borderColor: "border-amber-200/40 dark:border-amber-900/20",
    particleColors: ["#f59e0b", "#f97316", "#ef4444", "#f472b6"]
  },
  {
    id: "sakura-bloom",
    name: "Sakura Blossom",
    gradient: "from-pink-50 via-red-50 to-pink-100 dark:from-zinc-950 dark:to-pink-950/20",
    textAccent: "text-pink-600 dark:text-pink-400",
    cardBg: "bg-white/80 dark:bg-zinc-900/60",
    heartColor: "fill-pink-500 text-pink-500",
    borderColor: "border-pink-200/50 dark:border-pink-900/30",
    particleColors: ["#ec4899", "#f472b6", "#fbcfe8", "#fda4af"]
  }
];
