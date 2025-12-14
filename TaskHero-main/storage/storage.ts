import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, UserProgress } from "./types";

const TASKS_KEY = "tasks_list_v2";
const PROGRESS_KEY = "user_progress_v1";

// Tasks
export async function loadTasks(): Promise<Task[]> {
  try {
    const json = await AsyncStorage.getItem(TASKS_KEY);
    if (!json) return [];
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {}
}

export async function completeTask(taskId: string): Promise<UserProgress> {
  try {
    // Update task
    const tasks = await loadTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: true,
            completedAt: new Date().toISOString(),
          }
        : task
    );
    await saveTasks(updatedTasks);

    // Update progress
    const progress = await loadProgress();
    const today = new Date().toDateString();
    const lastCompleted = progress.lastCompletedDate
      ? new Date(progress.lastCompletedDate).toDateString()
      : null;

    // Calculate streak
    let newStreak = progress.currentStreak;
    if (!lastCompleted) {
      newStreak = 1;
    } else if (lastCompleted !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastCompleted === yesterday.toDateString()) {
        newStreak = progress.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }

    // Add EXP
    const newExp = progress.exp + 50;
    let newLevel = progress.level;
    let expToNext = progress.expToNextLevel;

    // Level up logic
    if (newExp >= expToNext) {
      newLevel += 1;
      expToNext = newLevel * 100;
    }

    const updatedProgress: UserProgress = {
      level: newLevel,
      exp: newExp,
      expToNextLevel: expToNext,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      lastCompletedDate: new Date().toISOString(),
      totalTasksCompleted: progress.totalTasksCompleted + 1,
    };

    await saveProgress(updatedProgress);
    return updatedProgress;
  } catch (error) {
    console.error("Error completing task:", error);
    return await loadProgress(); // Return current progress on error
  }
}

// Progress
export async function loadProgress(): Promise<UserProgress> {
  try {
    const json = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!json) {
      return {
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        totalTasksCompleted: 0,
      };
    }
    return JSON.parse(json);
  } catch {
    return {
      level: 1,
      exp: 0,
      expToNextLevel: 100,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalTasksCompleted: 0,
    };
  }
}

export async function saveProgress(progress: UserProgress) {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}