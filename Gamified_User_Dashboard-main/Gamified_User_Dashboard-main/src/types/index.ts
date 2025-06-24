export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  lastAction: string;
  lastActionDate: Date;
  joinDate: Date;
  totalActions: number;
}

export interface MoodEntry {
  id: string;
  emoji: string;
  mood: string;
  note?: string;
  date: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
}

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalJournalEntries: number;
  totalMoodCheckins: number;
  daysActive: number;
}