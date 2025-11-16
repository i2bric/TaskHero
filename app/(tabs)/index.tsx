import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { Task } from "../../storage/types";
import { loadTasks, saveTasks } from "../../storage/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "react-native-paper";

export default function MainScreen() {
  const theme = useTheme(); // ⭐ ambil warna tema
  const [tasks, setTasks] = useState<Task[]>([]);

  // auto refresh saat kembali dari modal
  useFocusEffect(
    useCallback(() => {
      loadTasks().then(setTasks);
    }, [])
  );

  function goToAdd() {
    router.push("/(modals)/add-task");
  }

  function goToDetail(task: Task) {
    router.push({
      pathname: "/(modals)/task-detail",
      params: task,
    });
  }

  async function deleteTask(task: Task) {
    const updated = tasks.filter((t) => t.id !== task.id);
    setTasks(updated);
    await saveTasks(updated);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 16 }}>
        🦸‍♂️ TaskHero
      </Text>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Belum ada tugas.{"\n"}Silakan tekan tombol "+" untuk menambah.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => goToDetail(item)}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.outline,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                <Text style={{ color: theme.colors.outline }}>
                  Deadline: {item.deadline}
                </Text>
              </View>

              <IconButton
                icon="delete"
                iconColor={theme.colors.error}
                size={24}
                onPress={() => deleteTask(item)}
              />
            </TouchableOpacity>
          )}
        />
      )}

      <FAB
        icon="plus"
        onPress={goToAdd}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: theme.colors.primary,
        }}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
  },
});
