export interface Task {
  id: string;
  name: string;
  deadline: string;
  completed?: boolean;
  completedAt?: string;
}

export interface UserProgress {
  level: number;
  exp: number;
  expToNextLevel: number;
  currentStreak: number;
  longestStreak: string;
  lastCompletedDate: string | null;
  totalTasksCompleted: number;
}