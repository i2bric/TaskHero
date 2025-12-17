import { createHomeStyles } from "@/assets/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { scheduleTaskNotification } from "@/utils/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Difficulty = "easy" | "medium" | "hard";

const TodoInput = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addTodo = useMutation(api.todos.addTodo);

  const handleAddClick = () => {
    if (text.trim()) {
      setShowModal(true);
    } else {
      Alert.alert("Error", "Please enter a task");
    }
  };

  const handleConfirmAdd = async () => {
    if (text.trim()) {
      try {
        // Schedule notification FIRST (24 hours before deadline)
        const notificationId = await scheduleTaskNotification(
          "", // We'll get the real todoId after creation
          text.trim(),
          deadline.getTime(),
          difficulty
        );

        // Add todo to database with notification ID
        await addTodo({
          text: text.trim(),
          difficulty,
          deadline: deadline.getTime(),
          notificationId: notificationId || undefined,
        });

        setText("");
        setDifficulty("medium");
        setDeadline(new Date(Date.now() + 86400000));
        setShowModal(false);
      } catch (error) {
        console.log("Error adding todo", error);
        Alert.alert("Error", "Failed to add todo");
      }
    }
  };

  const getDifficultyColor = (diff: Difficulty): string[] => {
    switch (diff) {
      case "easy":
        return ["#10b981", "#059669"];
      case "medium":
        return ["#f59e0b", "#d97706"];
      case "hard":
        return ["#ef4444", "#dc2626"];
    }
  };

  const getDifficultyExp = (diff: Difficulty): number => {
    switch (diff) {
      case "easy":
        return 30;
      case "medium":
        return 60;
      case "hard":
        return 100;
    }
  };

  return (
    <>
      <View style={homeStyles.inputSection}>
        <View style={homeStyles.inputWrapper}>
          <TextInput
            style={homeStyles.input}
            placeholder="What needs to be done?"
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAddClick}
          />
          <TouchableOpacity
            onPress={handleAddClick}
            activeOpacity={0.8}
            disabled={!text.trim()}
          >
            <LinearGradient
              colors={text.trim() ? colors.gradients.primary : colors.gradients.muted}
              style={[homeStyles.addButton, !text.trim() && homeStyles.addButtonDisabled]}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={colors.gradients.surface}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Task Details</Text>

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                Difficulty
              </Text>
              <View style={styles.difficultyContainer}>
                {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                  <TouchableOpacity
                    key={diff}
                    onPress={() => setDifficulty(diff)}
                    activeOpacity={0.8}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={
                        difficulty === diff
                          ? getDifficultyColor(diff)
                          : colors.gradients.muted
                      }
                      style={styles.difficultyButton}
                    >
                      <Text style={styles.difficultyText}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </Text>
                      <Text style={styles.difficultyExp}>
                        +{getDifficultyExp(diff)} XP
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                Deadline
              </Text>

              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
                >
                  <Ionicons name="calendar" size={20} color={colors.text} />
                  <Text style={[styles.dateTimeText, { color: colors.text }]}>
                    {deadline.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={[styles.dateTimeButton, { backgroundColor: colors.background }]}
                >
                  <Ionicons name="time" size={20} color={colors.text} />
                  <Text style={[styles.dateTimeText, { color: colors.text }]}>
                    {deadline.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={colors.gradients.muted}
                  style={styles.modalButtonInner}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmAdd}
                style={styles.modalButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={styles.modalButtonInner}
                >
                  <Text style={styles.modalButtonText}>Add Task</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                const newDeadline = new Date(deadline);
                newDeadline.setFullYear(selectedDate.getFullYear());
                newDeadline.setMonth(selectedDate.getMonth());
                newDeadline.setDate(selectedDate.getDate());
                setDeadline(newDeadline);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={deadline}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowTimePicker(Platform.OS === "ios");
              if (selectedDate) {
                const newDeadline = new Date(deadline);
                newDeadline.setHours(selectedDate.getHours());
                newDeadline.setMinutes(selectedDate.getMinutes());
                setDeadline(newDeadline);
              }
            }}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 10,
  },
  difficultyButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  difficultyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  difficultyExp: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
  },
  modalButtonInner: {
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

export default TodoInput;