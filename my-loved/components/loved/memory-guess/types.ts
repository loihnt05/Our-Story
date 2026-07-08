export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
  image?: string;
}

export interface Question {
  memory: Milestone;
  type: "title" | "date" | "year" | "emoji" | "month";
  questionText: string;
  correctAnswer: string;
  options: string[];
}

export interface MemoryGuessTabProps {
  loved: any;
  currentTheme: any;
  onBack?: () => void;
}
