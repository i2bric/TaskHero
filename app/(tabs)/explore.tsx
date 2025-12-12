// app/(tabs)/explore.tsx
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import { loadProgress, loadTasks } from "../../storage/storage";
import { Task, UserProgress } from "../../storage/types";

export default function ExploreScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTasks().then(setTasks);
      loadProgress().then(setProgress);
    }, [])
  );

  if (!progress) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onBackground }}>Loading...</Text>
      </View>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = activeTasks.filter((t) => {
    const deadline = parseDeadline(t.deadline);
    return deadline && deadline < new Date();
  });

  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>
        📊 Statistik & Info
      </Text>

      {/* Overview Card */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            📈 Overview
          </Text>

          <View style={styles.statGrid}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {tasks.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Total Tugas
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: "#4CAF50" }]}>
                {completedTasks.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Selesai
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: "#FF9800" }]}>
                {activeTasks.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Aktif
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: "#F44336" }]}>
                {overdueTasks.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Terlambat
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Completion Rate */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            ✅ Completion Rate
          </Text>
          <View style={styles.rateContainer}>
            <Text style={[styles.rateNumber, { color: theme.colors.primary }]}>
              {completionRate}%
            </Text>
            <Text style={[styles.rateText, { color: theme.colors.onSurfaceVariant }]}>
              dari total tugas
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Progress Info */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            🎯 Progress Hero
          </Text>

          <View style={styles.progressInfo}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>
                Level:
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                {progress.level}
              </Text>
            </View>

            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>
                Total EXP:
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                {progress.exp}
              </Text>
            </View>

            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>
                Current Streak:
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                {progress.currentStreak} hari
              </Text>
            </View>

            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.onSurfaceVariant }]}>
                Longest Streak:
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                {progress.longestStreak} hari
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Tips Card */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            💡 Tips Produktif
          </Text>
          <Text style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}>
            • Selesaikan tugas setiap hari untuk menjaga streak{"\n"}
            • Setiap task selesai = +50 EXP{"\n"}
            • Level up untuk unlock achievement{"\n"}
            • Set deadline realistis untuk produktivitas maksimal
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

// Helper function untuk parse deadline
function parseDeadline(deadlineStr: string): Date | null {
  try {
    // Format: "DD/MM/YYYY, HH:MM"
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  rateContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  rateNumber: {
    fontSize: 48,
    fontWeight: "bold",
  },
  rateText: {
    fontSize: 16,
    marginTop: 8,
  },
  progressInfo: {
    gap: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  progressLabel: {
    fontSize: 16,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
  },
});