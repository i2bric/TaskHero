import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "./types";

const TASKS_KEY = "tasks_list_v2";

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
