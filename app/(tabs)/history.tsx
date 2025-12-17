//app/(tabs)/history.tsx

import { createHistoryStyles } from "@/assets/styles/history.styles";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HistoryItem = Doc<"history">;

export default function History() {
  const { colors } = useTheme();
  const historyStyles = createHistoryStyles(colors);

  const history = useQuery(api.history.getHistory);
  const stats = useQuery(api.history.getHistoryStats);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    
    // Format date: "Dec 17, 2024"
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format time: "2:30 PM"
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return { date: dateStr, time: timeStr };
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return null; // Return null for older dates, will show full date instead
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return colors.gradients.success;
      case "medium":
        return colors.gradients.warning;
      case "hard":
        return colors.gradients.danger;
      default:
        return colors.gradients.muted;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "✅";
      case "medium":
        return "⚠️";
      case "hard":
        return "🔥";
      default:
        return "📝";
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const { date, time } = formatDateTime(item.completedAt);
    const relativeTime = formatRelativeTime(item.completedAt);
    
    return (
      <View style={historyStyles.historyItemWrapper}>
        <LinearGradient
          colors={colors.gradients.surface}
          style={historyStyles.historyItem}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Difficulty Badge */}
          <View style={historyStyles.topRow}>
            <LinearGradient
              colors={getDifficultyColor(item.difficulty)}
              style={historyStyles.difficultyBadge}
            >
              <Text style={historyStyles.difficultyEmoji}>
                {getDifficultyIcon(item.difficulty)}
              </Text>
              <Text style={historyStyles.difficultyText}>
                {item.difficulty.toUpperCase()}
              </Text>
            </LinearGradient>

            {/* XP Badge */}
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              style={historyStyles.xpBadge}
            >
              <Ionicons name="star" size={14} color="#fff" />
              <Text style={historyStyles.xpText}>+{item.expEarned} XP</Text>
            </LinearGradient>
          </View>

          {/* Task Text */}
          <Text style={[historyStyles.taskText, { color: colors.text }]}>
            {item.text}
          </Text>

          {/* Completion Time Info */}
          <View style={historyStyles.timeInfoContainer}>
            <View style={historyStyles.timeRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.gradients.success[0]} />
              <Text style={[historyStyles.timeLabel, { color: colors.textMuted }]}>
                Completed:
              </Text>
            </View>
            
            {/* Show relative time if recent, otherwise show full date */}
            {relativeTime ? (
              <View style={historyStyles.timeDetails}>
                <Text style={[historyStyles.relativeTime, { color: colors.text }]}>
                  {relativeTime}
                </Text>
                <Text style={[historyStyles.fullDateTime, { color: colors.textMuted }]}>
                  {date} at {time}
                </Text>
              </View>
            ) : (
              <View style={historyStyles.timeDetails}>
                <Text style={[historyStyles.dateTime, { color: colors.text }]}>
                  {date}
                </Text>
                <Text style={[historyStyles.dateTime, { color: colors.text }]}>
                  {time}
                </Text>
              </View>
            )}
          </View>

          {/* Overdue Indicator */}
          {item.wasOverdue && (
            <View style={historyStyles.overdueContainer}>
              <Ionicons name="alert-circle" size={14} color="#ef4444" />
              <Text style={historyStyles.overdueText}>Completed after deadline</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  const renderStats = () => (
    <View style={historyStyles.statsSection}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={historyStyles.statsCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[historyStyles.statsTitle, { color: colors.text }]}>
          📊 Your Statistics
        </Text>

        <View style={historyStyles.statsGrid}>
          {/* Total Completed */}
          <View style={historyStyles.statItem}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={historyStyles.statIconContainer}
            >
              <Ionicons name="checkmark-done" size={20} color="#fff" />
            </LinearGradient>
            <Text style={[historyStyles.statNumber, { color: colors.text }]}>
              {stats?.totalCompleted || 0}
            </Text>
            <Text style={[historyStyles.statLabel, { color: colors.textMuted }]}>
              Total Completed
            </Text>
          </View>

          {/* Total XP Earned */}
          <View style={historyStyles.statItem}>
            <LinearGradient colors={["#FFD700", "#FFA500"]} style={historyStyles.statIconContainer}>
              <Ionicons name="star" size={20} color="#fff" />
            </LinearGradient>
            <Text style={[historyStyles.statNumber, { color: colors.text }]}>
              {stats?.totalExpEarned || 0}
            </Text>
            <Text style={[historyStyles.statLabel, { color: colors.textMuted }]}>Total XP Earned</Text>
          </View>

          {/* Overdue Completed */}
          <View style={historyStyles.statItem}>
            <LinearGradient colors={colors.gradients.warning} style={historyStyles.statIconContainer}>
              <Ionicons name="time" size={20} color="#fff" />
            </LinearGradient>
            <Text style={[historyStyles.statNumber, { color: colors.text }]}>
              {stats?.overdueCompleted || 0}
            </Text>
            <Text style={[historyStyles.statLabel, { color: colors.textMuted }]}>
              Overdue Tasks
            </Text>
          </View>
        </View>

        {/* Difficulty Breakdown */}
        <View style={historyStyles.difficultyBreakdown}>
          <Text style={[historyStyles.breakdownTitle, { color: colors.text }]}>
            Task Breakdown
          </Text>
          <View style={historyStyles.breakdownRow}>
            <View style={historyStyles.breakdownItem}>
              <Text style={historyStyles.breakdownEmoji}>✅</Text>
              <Text style={[historyStyles.breakdownText, { color: colors.text }]}>
                Easy: {stats?.difficultyBreakdown?.easy || 0}
              </Text>
            </View>
            <View style={historyStyles.breakdownItem}>
              <Text style={historyStyles.breakdownEmoji}>⚠️</Text>
              <Text style={[historyStyles.breakdownText, { color: colors.text }]}>
                Medium: {stats?.difficultyBreakdown?.medium || 0}
              </Text>
            </View>
            <View style={historyStyles.breakdownItem}>
              <Text style={historyStyles.breakdownEmoji}>🔥</Text>
              <Text style={[historyStyles.breakdownText, { color: colors.text }]}>
                Hard: {stats?.difficultyBreakdown?.hard || 0}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmpty = () => (
    <View style={historyStyles.emptyContainer}>
      <LinearGradient colors={colors.gradients.empty} style={historyStyles.emptyIconContainer}>
        <Ionicons name="time-outline" size={60} color={colors.textMuted} />
      </LinearGradient>
      <Text style={[historyStyles.emptyText, { color: colors.text }]}>No history yet!</Text>
      <Text style={[historyStyles.emptySubtext, { color: colors.textMuted }]}>
        Complete tasks to see them here
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={historyStyles.container}>
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={historyStyles.safeArea}>
        <View style={historyStyles.header}>
          <Text style={[historyStyles.headerTitle, { color: colors.text }]}>📜 History</Text>
          <Text style={[historyStyles.headerSubtitle, { color: colors.textMuted }]}>
            Your completed tasks
          </Text>
        </View>

        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={stats && stats.totalCompleted > 0 ? renderStats : null}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={historyStyles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}