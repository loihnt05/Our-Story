export interface DecisionOption {
  text: string;
  emoji: string;
}

export interface WheelCategory {
  id: string;
  name: string;
  icon: string;
  items: DecisionOption[];
  isCustom?: boolean;
}

export interface HistoryItem {
  id: string;
  text: string;
  emoji: string;
  categoryName: string;
  date: string;
  completed: boolean;
}

export interface DecisionWheelTabProps {
  loved: any;
  currentTheme: any;
  onBack?: () => void;
}
