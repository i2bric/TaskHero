//TodoCard.tsx

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Todo = Doc<"todos">;

interface TodoCardProps {
  todo: Todo;
  onLevelUp?: (level: number) => void;
  onExpGain?: (exp: number) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onLevelUp, onExpGain }) => {
  const { colors } = useTheme();
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const [timeLeft, setTimeLeft] = useState("");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = todo.deadline - now;

      if (diff < 0) {
        setIsOverdue(true);
        const overdueDiff = Math.abs(diff);
        const hours = Math.floor(overdueDiff / (1000 * 60 * 60));
        const minutes = Math.floor((overdueDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`Overdue ${hours}h ${minutes}m`);
      } else {
        setIsOverdue(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [todo.deadline]);

  const handleComplete = async () => {
    try {
      const result = await toggleTodo({ id: todo._id });
      if (result && result.expEarned) {
        onExpGain?.(result.expEarned);
        if (result.leveledUp) {
          onLevelUp?.(result.newLevel);
        }
      }
    } catch (error) {
      console.error("Error completing todo:", error);
      Alert.alert("Error", "Failed to complete task");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodo({ id: todo._id }),
      },
    ]);
  };

  const getDifficultyColor = (): string[] => {
    switch (todo.difficulty) {
      case "easy":
        return ["#10b981", "#059669"];
      case "medium":
        return ["#f59e0b", "#d97706"];
      case "hard":
        return ["#ef4444", "#dc2626"];
    }
  };

  const getDifficultyExp = (): number => {
    switch (todo.difficulty) {
      case "easy":
        return 30;
      case "medium":
        return 60;
      case "hard":
        return 100;
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Difficulty Badge */}
        <LinearGradient colors={getDifficultyColor()} style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {todo.difficulty.toUpperCase()}
          </Text>
          <Text style={styles.expText}>+{getDifficultyExp()} XP</Text>
        </LinearGradient>

        {/* Task Text */}
        <Text style={[styles.taskText, { color: colors.text }]}>{todo.text}</Text>

        {/* Deadline Info */}
        <View style={styles.deadlineRow}>
          <Ionicons
            name={isOverdue ? "alert-circle" : "time-outline"}
            size={16}
            color={isOverdue ? "#ef4444" : colors.textMuted}
          />
          <Text
            style={[
              styles.deadlineText,
              {
                color: isOverdue ? "#ef4444" : colors.textMuted,
              },
            ]}
          >
            {timeLeft}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleComplete} activeOpacity={0.8}>
            <LinearGradient colors={colors.gradients.success} style={styles.actionButton}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.actionText}>Complete</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
            <LinearGradient colors={colors.gradients.danger} style={styles.actionButton}>
              <Ionicons name="trash" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  expText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.9,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    lineHeight: 22,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  deadlineText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default TodoCard;