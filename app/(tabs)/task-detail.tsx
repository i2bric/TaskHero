// task-detail.tsx
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Button, Alert } from "react-native";
import { loadTasks, saveTasks } from "../../storage/storage";

export default function TaskDetailScreen() {
  const { id, name, deadline } = useLocalSearchParams();

  async function deleteTask() {
    if (!id) return;

    // Ambil semua task
    const tasks = await loadTasks();

    // Filter task berdasarkan id
    const filtered = tasks.filter((t) => t.id !== id.toString());

    // Jika task ditemukan dan dihapus
    if (filtered.length === tasks.length) {
      Alert.alert("Gagal", "Task tidak ditemukan atau sudah dihapus.");
      return;
    }

    // Simpan ulang task yang tersisa
    await saveTasks(filtered);

    // Kembali ke halaman sebelumnya
    router.back();
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>{name}</Text>
      <Text style={{ marginTop: 10, marginBottom: 30 }}>
        Deadline: {deadline}
      </Text>

      <Button
        title="HAPUS TUGAS"
        color="red"
        onPress={() =>
          Alert.alert(
            "Konfirmasi Hapus",
            "Apakah Anda yakin ingin menghapus tugas ini?",
            [
              { text: "Batal", style: "cancel" },
              { text: "Hapus", style: "destructive", onPress: deleteTask },
            ]
          )
        }
      />
    </View>
  );
}
