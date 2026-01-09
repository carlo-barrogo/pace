export interface Run {
  id: string;
  date: string;
  distance: number; // in km
  duration: number; // in minutes
  pace: number; // minutes per km
  calories?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  totalRuns: number;
  totalDistance: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  totalDistance: number;
  weeklyDistance: number;
  streak: number;
}

export interface DailyActivity {
  date: string;
  hasRun: boolean;
  distance?: number;
}
