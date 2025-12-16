//DangerZone.tsx

import { createSettingsStyles } from "@/assets/styles/settings.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { cancelTaskNotification } from "@/utils/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const DangerZone = () => {
  const { colors } = useTheme();

  const settingsStyles = createSettingsStyles(colors);

  const clearAllTodos = useMutation(api.todos.clearAllTodos);
  const resetProfile = useMutation(api.profile.resetProfile);
  const clearHistory = useMutation(api.history.clearHistory);

  const handleResetProgress = async () => {
    Alert.alert(
      "Reset Progress Only",
      "⚠️ This will:\n• Reset your level to 1\n• Reset your XP to 0\n• Your current todos will NOT be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Progress",
          style: "destructive",
          onPress: async () => {
            try {
              await resetProfile();
              Alert.alert(
                "✅ Progress Reset",
                `Reset to Level 1.`
              );
            } catch (error) {
              console.log("Error resetting progress", error);
              Alert.alert("Error", "Failed to reset progress");
            }
          },
        },
      ]
    );
  };

  const handleResetApp = async () => {
    Alert.alert(
      "Reset Everything",
      "⚠️ This will delete:\n• All todos\n• All history\n• Reset your level to 1\n• Reset your XP to 0\n• Cancel all scheduled notifications\n\nThis action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await clearAllTodos();
              
              // Cancel all notifications associated with deleted todos
              if (result.notificationIds && result.notificationIds.length > 0) {
                for (const notificationId of result.notificationIds) {
                  await cancelTaskNotification(notificationId);
                }
              }
              
              Alert.alert(
                "✅ App Reset Complete",
                `Successfully deleted:\n• ${result.deletedTodos} todo${result.deletedTodos === 1 ? "" : "s"}\n• ${result.deletedHistory} history item${result.deletedHistory === 1 ? "" : "s"}\n• Cancelled ${result.notificationIds.length} notification${result.notificationIds.length === 1 ? "" : "s"}\n• Reset to Level 1`
              );
            } catch (error) {
              console.log("Error resetting app", error);
              Alert.alert("Error", "Failed to reset app");
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
      <Text style={settingsStyles.sectionTitleDanger}>Danger Zone</Text>

      {/* Reset Progress Only */}
      <TouchableOpacity
        style={settingsStyles.actionButton}
        onPress={handleResetProgress}
        activeOpacity={0.7}
      >
        <View style={settingsStyles.actionLeft}>
          <LinearGradient colors={colors.gradients.warning} style={settingsStyles.actionIcon}>
            <Ionicons name="refresh" size={18} color="#ffffff" />
          </LinearGradient>
          <View>
            <Text style={settingsStyles.actionTextDanger}>Reset Progress</Text>
            <Text style={[settingsStyles.actionTextDanger, { fontSize: 12, opacity: 0.7 }]}>
              Level & EXP only
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Reset Everything */}
      <TouchableOpacity
        style={[settingsStyles.actionButton, { borderBottomWidth: 0 }]}
        onPress={handleResetApp}
        activeOpacity={0.7}
      >
        <View style={settingsStyles.actionLeft}>
          <LinearGradient colors={colors.gradients.danger} style={settingsStyles.actionIcon}>
            <Ionicons name="trash" size={18} color="#ffffff" />
          </LinearGradient>
          <View>
            <Text style={settingsStyles.actionTextDanger}>Reset Everything</Text>
            <Text style={[settingsStyles.actionTextDanger, { fontSize: 12, opacity: 0.7 }]}>
              All todos, history & progress
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default DangerZone;