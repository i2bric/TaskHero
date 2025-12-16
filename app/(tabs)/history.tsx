import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const history = useQuery(api.history.getHistory);
  const stats = useQuery(api.history.getHistoryStats);

  if (!history || !stats) return null;

  return (
    <LinearGradient colors={colors.gradients.background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={[styles.title, { color: colors.text }]}>Task History</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Completed
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalExpEarned}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Total XP
            </Text>
          </View>
        </View>

        {/* History List */}
        <FlatList
          data={history}
          renderItem={({ item }) => (
            <LinearGradient
              colors={colors.gradients.surface}
              style={styles.historyCard}
            >
              <Text style={[styles.taskText, { color: colors.text }]}>
                {item.text}
              </Text>
              <View style={styles.historyMeta}>
                <Text style={[styles.metaText, { color: colors.textMuted }]}>
                  +{item.expEarned} XP • {item.difficulty}
                </Text>
                {item.wasOverdue && (
                  <View style={styles.overdueTag}>
                    <Text style={styles.overdueText}>OVERDUE</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  historyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
  },
  overdueTag: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  overdueText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});