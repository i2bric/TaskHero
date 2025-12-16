import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ProfileBar: React.FC = () => {
  const { colors } = useTheme();
  const profile = useQuery(api.profile.getProfile);

  if (!profile) return null;

  const progressPercentage =
    profile.experienceToNextLevel > 0
      ? (profile.experience / profile.experienceToNextLevel) * 100
      : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={styles.profileCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Title Badge */}
        <View style={[styles.titleBadge, { backgroundColor: profile.titleColor }]}>
          <Text style={styles.titleEmoji}>{profile.titleEmoji}</Text>
          <Text style={styles.titleText}>{profile.title}</Text>
        </View>

        <View style={styles.topRow}>
          <View style={styles.levelContainer}>
            <LinearGradient colors={colors.gradients.primary} style={styles.levelBadge}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.levelText}>Lvl {profile.level}</Text>
            </LinearGradient>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.gradients.success[0]} />
              <Text style={[styles.statText, { color: colors.text }]}>
                {profile.totalTasksCompleted} tasks
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Text style={[styles.xpLabel, { color: colors.textMuted }]}>Experience</Text>
            <Text style={[styles.xpNumbers, { color: colors.text }]}>
              {profile.experience} / {profile.experienceToNextLevel} XP
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
              <LinearGradient
                colors={["#6366f1", "#8b5cf6", "#d946ef"]}
                style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          <Text style={[styles.nextLevelText, { color: colors.textMuted }]}>
            {profile.experienceToNextLevel - profile.experience} XP to level {profile.level + 1}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.xpInfoCard}>
        <LinearGradient
          colors={colors.gradients.muted}
          style={styles.infoContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="information-circle" size={16} color={colors.text} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Easy: 30 XP • Medium: 60 XP • Hard: 100 XP
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  titleEmoji: {
    fontSize: 18,
  },
  titleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  levelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
  },
  xpContainer: {
    gap: 8,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  xpNumbers: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarBackground: {
    flex: 1,
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  nextLevelText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  xpInfoCard: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  infoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.8,
  },
});

export default ProfileBar;