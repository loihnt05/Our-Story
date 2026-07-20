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

export interface JournalComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface JournalReaction {
  id: string;
  author: string;
  emoji: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  author: string;
  emotion: string;
  content: string;
  createdAt: string;
  comments: JournalComment[];
  reactions?: JournalReaction[];
}

