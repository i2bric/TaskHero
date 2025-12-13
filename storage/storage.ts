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

export async function completeTask(taskId: string): Promise<void> {
  try {
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
  } catch (error) {
    console.error("Error completing task:", error);
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