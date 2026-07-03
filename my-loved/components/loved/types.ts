export interface Theme {
  id: string;
  name: string;
  gradient: string;
  textAccent: string;
  cardBg: string;
  heartColor: string;
  borderColor: string;
  particleColors: string[];
  bgType?: "stars" | "gravity" | "fireworks" | "hearts";
  isDark?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  image?: string;
}

export interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
  color: string;
}

export interface BurstHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  rotation: number;
}
