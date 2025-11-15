import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { Task } from '../../storage/types';
import { loadTasks, saveTasks } from '../../storage/storage';

export default function MainScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks().then(setTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function goToAdd() {
    router.push("/(tabs)/add-task");
  }

  function goToDetail(task: Task) {
    router.push({
      pathname: "/(tabs)/task-detail",
      params: {
        id: task.id,
        name: task.name,
        deadline: task.deadline,
  },
});
  }

  function deleteTask(task: Task) {
    setTasks(tasks.filter((t) => t.id !== task.id));
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 16 }}>
        🦸‍♂️ TaskHero
      </Text>

      {tasks.length === 0 && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>
            Belum ada tugas.{"\n"}Silakan tekan tombol "+" untuk menambah.
          </Text>
        </View>
      )}

      {tasks.length > 0 && (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => goToDetail(item)}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                <Text style={{ color: "gray" }}>
                  Deadline: {item.deadline}
                </Text>
              </View>

              <IconButton
                icon="delete"
                iconColor="red"
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
        style={{ position: "absolute", bottom: 20, right: 20 }}
      />
    </View>
  );
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
