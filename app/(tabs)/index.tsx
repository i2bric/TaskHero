// app/(tabs)/index.tsx
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import {
  Card,
  Checkbox,
  Chip,
  FAB,
  IconButton,
  Menu,
  useTheme
} from "react-native-paper";
import { completeTask, loadTasks, saveTasks } from "../../storage/storage";
import { Task } from "../../storage/types";

type SortType = "deadline" | "name" | "created";
type FilterType = "all" | "active" | "completed";

export default function MainScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("deadline");
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [menuVisible, setMenuVisible] = useState(false);

  // Auto refresh saat kembali dari modal
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

  async function handleCompleteTask(task: Task) {
    if (task.completed) return;

    const updatedProgress = await completeTask(task.id);

    Alert.alert(
      "🎉 Tugas Selesai!",
      `+50 EXP\nLevel ${updatedProgress.level} | Streak ${updatedProgress.currentStreak} hari`,
      [{ text: "OK" }]
    );

    // Refresh task list
    const updatedTasks = await loadTasks();
    setTasks(updatedTasks);
  }

  async function deleteTask(task: Task) {
    Alert.alert("Hapus Tugas", `Yakin ingin menghapus "${task.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          const updated = tasks.filter((t) => t.id !== task.id);
          setTasks(updated);
          await saveTasks(updated);
        },
      },
    ]);
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterBy === "active") return !task.completed;
    if (filterBy === "completed") return task.completed;
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "deadline") {
      const dateA = parseDeadline(a.deadline);
      const dateB = parseDeadline(b.deadline);
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    }
    return 0; // created order (default)
  });

  const activeTasks = sortedTasks.filter((t) => !t.completed);
  const completedTasks = sortedTasks.filter((t) => t.completed);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.colors.onBackground }]}>
          🦸‍♂️ TaskHero
        </Text>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              size={24}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setSortBy("deadline");
              setMenuVisible(false);
            }}
            title="Sort by Deadline"
            leadingIcon={sortBy === "deadline" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSortBy("name");
              setMenuVisible(false);
            }}
            title="Sort by Name"
            leadingIcon={sortBy === "name" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => {
              setSortBy("created");
              setMenuVisible(false);
            }}
            title="Sort by Created"
            leadingIcon={sortBy === "created" ? "check" : undefined}
          />
        </Menu>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={filterBy === "all"}
          onPress={() => setFilterBy("all")}
          style={styles.chip}
        >
          Semua ({tasks.length})
        </Chip>
        <Chip
          selected={filterBy === "active"}
          onPress={() => setFilterBy("active")}
          style={styles.chip}
        >
          Aktif ({tasks.filter((t) => !t.completed).length})
        </Chip>
        <Chip
          selected={filterBy === "completed"}
          onPress={() => setFilterBy("completed")}
          style={styles.chip}
        >
          Selesai ({tasks.filter((t) => t.completed).length})
        </Chip>
      </View>

      {sortedTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyEmoji, { color: theme.colors.onBackground }]}>
            {filterBy === "completed" ? "🎯" : "📝"}
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            {filterBy === "completed"
              ? "Belum ada tugas yang selesai"
              : "Belum ada tugas.\nTekan tombol + untuk menambah tugas baru"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isCompleted = item.completed;
            const deadline = parseDeadline(item.deadline);
            const isOverdue = deadline && deadline < new Date() && !isCompleted;

            return (
              <Card
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: isCompleted
                      ? theme.colors.surfaceVariant
                      : theme.colors.surface,
                    opacity: isCompleted ? 0.7 : 1,
                    borderLeftWidth: isOverdue ? 4 : 0,
                    borderLeftColor: theme.colors.error,
                  },
                ]}
                onPress={() => goToDetail(item)}
              >
                <Card.Content style={styles.cardContent}>
                  <Checkbox
                    status={isCompleted ? "checked" : "unchecked"}
                    onPress={() => handleCompleteTask(item)}
                    color={theme.colors.primary}
                    disabled={isCompleted}
                  />

                  <View style={styles.taskInfo}>
                    <Text
                      style={[
                        styles.taskName,
                        {
                          color: theme.colors.onSurface,
                          textDecorationLine: isCompleted
                            ? "line-through"
                            : "none",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.taskDeadline,
                        {
                          color: isOverdue
                            ? theme.colors.error
                            : theme.colors.outline,
                        },
                      ]}
                    >
                      {isOverdue ? "⚠️ " : "⏰ "}
                      {item.deadline}
                    </Text>
                    {isCompleted && item.completedAt && (
                      <Text
                        style={[
                          styles.completedText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        ✓ Selesai{" "}
                        {new Date(item.completedAt).toLocaleDateString("id-ID")}
                      </Text>
                    )}
                  </View>

                  <IconButton
                    icon="delete"
                    iconColor={theme.colors.error}
                    size={24}
                    onPress={(e) => {
                      e?.stopPropagation();
                      deleteTask(item);
                    }}
                  />
                </Card.Content>
              </Card>
            );
          }}
        />
      )}

      <FAB
        icon="plus"
        onPress={goToAdd}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
      />
    </View>
  );
}

// Helper function untuk parse deadline
function parseDeadline(deadlineStr: string): Date | null {
  try {
    const [datePart, timePart] = deadlineStr.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    height: 32,
  },
  listContent: {
    paddingBottom: 80,
  },
  taskCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  taskInfo: {
    flex: 1,
    gap: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "600",
  },
  taskDeadline: {
    fontSize: 14,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
});