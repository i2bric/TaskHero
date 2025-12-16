import { createSettingsStyles } from "@/assets/styles/settings.styles";
import useTheme from "@/hooks/useTheme";
import { 
  getNotificationsEnabled, 
  setNotificationsEnabled 
} from "@/utils/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Switch, Text, View, Alert } from "react-native";

const Preferences = () => {
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabledState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const settingsStyles = createSettingsStyles(colors);

  // Load notification preference on mount
  useEffect(() => {
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      const enabled = await getNotificationsEnabled();
      setIsNotificationsEnabledState(enabled);
    } catch (error) {
      console.error("Error loading notification preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    try {
      setIsNotificationsEnabledState(value);
      await setNotificationsEnabled(value);
      
      if (value) {
        Alert.alert(
          "Notifications Enabled ✅",
          "You'll receive reminders 24 hours before task deadlines."
        );
      } else {
        Alert.alert(
          "Notifications Disabled",
          "All scheduled reminders have been cancelled."
        );
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      // Revert on error
      setIsNotificationsEnabledState(!value);
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
      <Text style={settingsStyles.sectionTitle}>Preferences</Text>

      {/* DARK MODE */}
      <View style={settingsStyles.settingItem}>
        <View style={settingsStyles.settingLeft}>
          <LinearGradient colors={colors.gradients.primary} style={settingsStyles.settingIcon}>
            <Ionicons name="moon" size={18} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={settingsStyles.settingText}>Dark Mode</Text>
            <Text style={[settingsStyles.settingText, { fontSize: 12, opacity: 0.6 }]}>
              Switch between light and dark theme
            </Text>
          </View>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={"#fff"}
          trackColor={{ false: colors.border, true: colors.primary }}
          ios_backgroundColor={colors.border}
        />
      </View>

      {/* NOTIFICATIONS */}
      <View style={settingsStyles.settingItem}>
        <View style={settingsStyles.settingLeft}>
          <LinearGradient colors={colors.gradients.warning} style={settingsStyles.settingIcon}>
            <Ionicons name="notifications" size={18} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={settingsStyles.settingText}>Notifications</Text>
            <Text style={[settingsStyles.settingText, { fontSize: 12, opacity: 0.6 }]}>
              Reminders 24h before deadlines
            </Text>
          </View>
        </View>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={handleToggleNotifications}
          thumbColor={"#fff"}
          trackColor={{ false: colors.border, true: colors.warning }}
          ios_backgroundColor={colors.border}
        />
      </View>

      
    </LinearGradient>
  );
};

export default Preferences;