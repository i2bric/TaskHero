import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Button } from "react-native";
import { loadTasks, saveTasks } from "../../storage/storage";

export default function TaskDetailModal() {
  const { id, name, deadline } = useLocalSearchParams();

  async function deleteTask() {
    const tasks = await loadTasks();
    const updated = tasks.filter((t) => t.id !== id);
    await saveTasks(updated);
    router.back();
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>{name}</Text>
      <Text style={{ marginVertical: 10 }}>Deadline: {deadline}</Text>

      <Button title="Hapus Tugas" color="red" onPress={deleteTask} />
      <View style={{ height: 12 }} />
      <Button title="Tutup" onPress={() => router.back()} />
    </View>
  );
}
