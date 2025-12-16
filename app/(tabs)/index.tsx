import { createHomeStyles } from "@/assets/styles/home.styles";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileBar from "@/components/ProfileBar";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { getTitleForLevel } from "@/utils/titleSystem";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = Doc<"todos">;
type Difficulty = "easy" | "medium" | "hard";

export default function Index() {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  // Add task state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("medium");
  const [newDeadline, setNewDeadline] = useState(new Date(Date.now() + 86400000));
  const [showAddDatePicker, setShowAddDatePicker] = useState(false);
  const [showAddTimePicker, setShowAddTimePicker] = useState(false);

  // Edit task state
  const [editingId, setEditingId] = useState<Id<"todos"> | null>(null);
  const [editText, setEditText] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<Difficulty>("medium");
  const [editDeadline, setEditDeadline] = useState(new Date());
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);

  const todos = useQuery(api.todos.getTodos);
  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const initializeProfile = useMutation(api.profile.initializeProfile);

  useEffect(() => {
    initializeProfile();
  }, []);

  // Update countdown timers
  useEffect(() => {
    if (!todos) return;

    const updateTimers = () => {
      const newTimeLeft: { [key: string]: string } = {};
      todos.forEach((todo) => {
        const now = Date.now();
        const diff = todo.deadline - now;

        if (diff < 0) {
          const overdueDiff = Math.abs(diff);
          const hours = Math.floor(overdueDiff / (1000 * 60 * 60));
          const minutes = Math.floor((overdueDiff % (1000 * 60 * 60)) / (1000 * 60));
          newTimeLeft[todo._id] = `Overdue ${hours}h ${minutes}m`;
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          if (days > 0) {
            newTimeLeft[todo._id] = `${days}d ${hours}h`;
          } else if (hours > 0) {
            newTimeLeft[todo._id] = `${hours}h ${minutes}m`;
          } else {
            newTimeLeft[todo._id] = `${minutes}m`;
          }
        }
      });
      setTimeLeft(newTimeLeft);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 60000);
    return () => clearInterval(interval);
  }, [todos]);

  const isLoading = todos === undefined;

  if (isLoading) return <LoadingSpinner />;

  const handleOpenAddModal = () => {
    setNewTask("");
    setNewDifficulty("medium");
    setNewDeadline(new Date(Date.now() + 86400000));
    setShowAddModal(true);
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        await addTodo({
          text: newTask.trim(),
          difficulty: newDifficulty,
          deadline: newDeadline.getTime(),
        });
        setShowAddModal(false);
        setNewTask("");
      } catch (error) {
        console.log("Error adding todo", error);
        Alert.alert("Error", "Failed to add task");
      }
    }
  };

  const handleComplete = async (todo: Todo) => {
    try {
      const result = await toggleTodo({ id: todo._id });
      if (result && result.leveledUp) {
        Alert.alert("🎉 Level Up!", `You reached level ${result.newLevel}!`, [
          { text: "Awesome!", style: "default" },
        ]);
      } else if (result && result.expEarned) {
        Alert.alert(
          "✅ Task Complete!",
          `You earned ${result.expEarned} XP!${result.wasOverdue ? " (Task was overdue)" : ""}`,
          [{ text: "Nice!", style: "default" }]
        );
      }
    } catch (error) {
      console.error("Error completing todo:", error);
      Alert.alert("Error", "Failed to complete task");
    }
  };

  const handleDelete = (todo: Todo) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodo({ id: todo._id }),
      },
    ]);
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
    setEditDifficulty(todo.difficulty);
    setEditDeadline(new Date(todo.deadline));
  };

  const handleSaveEdit = async () => {
    if (editingId && editText.trim()) {
      try {
        await updateTodo({
          id: editingId,
          text: editText.trim(),
          difficulty: editDifficulty,
          deadline: editDeadline.getTime(),
        });
        setEditingId(null);
        setEditText("");
      } catch (error) {
        console.log("Error updating todo", error);
        Alert.alert("Error", "Failed to update task");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const getDifficultyColor = (difficulty: Difficulty): string[] => {
    switch (difficulty) {
      case "easy":
        return ["#10b981", "#059669"];
      case "medium":
        return ["#f59e0b", "#d97706"];
      case "hard":
        return ["#ef4444", "#dc2626"];
    }
  };

  const getDifficultyExp = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case "easy":
        return 30;
      case "medium":
        return 60;
      case "hard":
        return 100;
    }
  };

  const renderTodoItem = (item: Todo) => {
    const isOverdue = Date.now() > item.deadline;
    const isEditing = editingId === item._id;

    return (
      <View key={item._id} style={styles.cardWrapper}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={[styles.card, isOverdue && styles.overdueCard]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Overdue Badge */}
          {isOverdue && (
            <View style={styles.overdueBadge}>
              <Ionicons name="alert-circle" size={14} color="#fff" />
              <Text style={styles.overdueText}>OVERDUE</Text>
            </View>
          )}

          {isEditing ? (
            /* EDIT MODE */
            <>
              <TextInput
                style={[styles.editInput, { color: colors.text, borderColor: colors.border }]}
                value={editText}
                onChangeText={setEditText}
                placeholder="Task name..."
                placeholderTextColor={colors.textMuted}
                autoFocus
              />

              {/* Edit Difficulty */}
              <View style={styles.difficultySelector}>
                {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    onPress={() => setEditDifficulty(diff)}
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={
                        editDifficulty === diff
                          ? getDifficultyColor(diff)
                          : colors.gradients.muted
                      }
                      style={styles.difficultyBtn}
                    >
                      <Text style={styles.difficultyBtnText}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Edit Deadline */}
              <TouchableOpacity
                onPress={() => setShowEditDatePicker(true)}
                style={[styles.dateButton, { backgroundColor: colors.background }]}
              >
                <Ionicons name="calendar" size={16} color={colors.text} />
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {editDeadline.toLocaleString()}
                </Text>
              </TouchableOpacity>

              {/* Edit Actions */}
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8} style={{ flex: 1 }}>
                  <LinearGradient colors={colors.gradients.success} style={styles.editButton}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.editButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8} style={{ flex: 1 }}>
                  <LinearGradient colors={colors.gradients.muted} style={styles.editButton}>
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={styles.editButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* VIEW MODE */
            <>
              {/* Difficulty Badge */}
              <LinearGradient
                colors={getDifficultyColor(item.difficulty)}
                style={styles.difficultyBadge}
              >
                <Text style={styles.difficultyText}>{item.difficulty.toUpperCase()}</Text>
                <Text style={styles.expText}>+{getDifficultyExp(item.difficulty)} XP</Text>
              </LinearGradient>

              {/* Task Text */}
              <Text style={[styles.taskText, { color: colors.text }]}>{item.text}</Text>

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
                    { color: isOverdue ? "#ef4444" : colors.textMuted },
                  ]}
                >
                  {timeLeft[item._id] || "Calculating..."}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => handleComplete(item)}
                  activeOpacity={0.8}
                  style={{ flex: 1 }}
                >
                  <LinearGradient colors={colors.gradients.success} style={styles.actionButton}>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.actionText}>Complete</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleEdit(item)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.warning} style={styles.actionButton}>
                    <Ionicons name="pencil" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item)} activeOpacity={0.8}>
                  <LinearGradient colors={colors.gradients.danger} style={styles.actionButton}>
                    <Ionicons name="trash" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
        <StatusBar barStyle={colors.statusBarStyle} />
        <SafeAreaView style={{ flex: 1 }}>
          {/* EVERYTHING SCROLLABLE */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Header />
            <ProfileBar />

            {/* Simple Add Button */}
            <TouchableOpacity
              onPress={handleOpenAddModal}
              activeOpacity={0.8}
              style={styles.addTaskButton}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.addTaskGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.addTaskText}>Add New Task</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Task List */}
            {todos && todos.length > 0 ? (
              todos.map((todo) => renderTodoItem(todo))
            ) : (
              <EmptyState />
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* ADD TASK MODAL */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={colors.gradients.surface}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Task</Text>

            <TextInput
              style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.textMuted}
              value={newTask}
              onChangeText={setNewTask}
              autoFocus
            />

            {/* Difficulty */}
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Difficulty</Text>
            <View style={styles.difficultySelector}>
              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <TouchableOpacity
                  key={diff}
                  onPress={() => setNewDifficulty(diff)}
                  activeOpacity={0.8}
                  style={{ flex: 1 }}
                >
                  <LinearGradient
                    colors={
                      newDifficulty === diff ? getDifficultyColor(diff) : colors.gradients.muted
                    }
                    style={styles.modalDifficultyBtn}
                  >
                    <Text style={styles.modalDifficultyText}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </Text>
                    <Text style={styles.modalDifficultyExp}>+{getDifficultyExp(diff)} XP</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {/* Deadline */}
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Deadline</Text>
            <View style={styles.dateTimeRow}>
              <TouchableOpacity
                onPress={() => setShowAddDatePicker(true)}
                style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
              >
                <Ionicons name="calendar" size={20} color={colors.text} />
                <Text style={[styles.dateTimeText, { color: colors.text }]}>
                  {newDeadline.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowAddTimePicker(true)}
                style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
              >
                <Ionicons name="time" size={20} color={colors.text} />
                <Text style={[styles.dateTimeText, { color: colors.text }]}>
                  {newDeadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={{ flex: 1 }}
                activeOpacity={0.8}
              >
                <LinearGradient colors={colors.gradients.muted} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddTask}
                style={{ flex: 1 }}
                activeOpacity={0.8}
                disabled={!newTask.trim()}
              >
                <LinearGradient
                  colors={newTask.trim() ? colors.gradients.primary : colors.gradients.muted}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Add Task</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Add Date Picker */}
        {showAddDatePicker && (
          <DateTimePicker
            value={newDeadline}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowAddDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                const updated = new Date(newDeadline);
                updated.setFullYear(selectedDate.getFullYear());
                updated.setMonth(selectedDate.getMonth());
                updated.setDate(selectedDate.getDate());
                setNewDeadline(updated);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        {/* Add Time Picker */}
        {showAddTimePicker && (
          <DateTimePicker
            value={newDeadline}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowAddTimePicker(Platform.OS === "ios");
              if (selectedDate) {
                const updated = new Date(newDeadline);
                updated.setHours(selectedDate.getHours());
                updated.setMinutes(selectedDate.getMinutes());
                setNewDeadline(updated);
              }
            }}
          />
        )}
      </Modal>

      {/* Edit Date/Time Pickers */}
      {showEditDatePicker && (
        <DateTimePicker
          value={editDeadline}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEditDatePicker(Platform.OS === "ios");
            if (selectedDate) {
              const updated = new Date(editDeadline);
              updated.setFullYear(selectedDate.getFullYear());
              updated.setMonth(selectedDate.getMonth());
              updated.setDate(selectedDate.getDate());
              setEditDeadline(updated);
              if (Platform.OS !== "ios") {
                setTimeout(() => setShowEditTimePicker(true), 100);
              }
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {showEditTimePicker && (
        <DateTimePicker
          value={editDeadline}
          mode="time"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEditTimePicker(Platform.OS === "ios");
            if (selectedDate) {
              const updated = new Date(editDeadline);
              updated.setHours(selectedDate.getHours());
              updated.setMinutes(selectedDate.getMinutes());
              setEditDeadline(updated);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addTaskButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addTaskGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addTaskText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
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
  overdueCard: {
    borderWidth: 2,
    borderColor: "#ef4444",
  },
  overdueBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  overdueText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
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
    justifyContent: "center",
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
  editInput: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
  },
  difficultySelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  difficultyBtn: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  difficultyBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 12,
    borderRadius: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  modalInput: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDifficultyBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalDifficultyText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalDifficultyExp: {
    color: "#fff",
    fontSize: 11,
    opacity: 0.9,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});