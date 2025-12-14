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
  longestStreak: number; // ✅ Ubah dari string ke number
  lastCompletedDate: string | null;
  totalTasksCompleted: number;
}