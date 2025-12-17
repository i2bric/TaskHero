//assets/styles/history.styles.ts

import { StyleSheet } from "react-native";

export const createHistoryStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "900",
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: "500",
    },
    listContent: {
      paddingBottom: 20,
    },

    // Statistics Section
    statsSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    statsCard: {
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statsTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },
    statIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "900",
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "600",
      textAlign: "center",
    },

    // Difficulty Breakdown
    difficultyBreakdown: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
    },
    breakdownTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    breakdownRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    breakdownItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    breakdownEmoji: {
      fontSize: 16,
    },
    breakdownText: {
      fontSize: 14,
      fontWeight: "600",
    },

    // History Items
    historyItemWrapper: {
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    historyItem: {
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    difficultyBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 6,
    },
    difficultyEmoji: {
      fontSize: 14,
    },
    difficultyText: {
      color: "#fff",
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    xpBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 4,
    },
    xpText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "700",
    },
    taskText: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      lineHeight: 22,
    },

    // Time Information Styles
    timeInfoContainer: {
      backgroundColor: colors.background + "40",
      borderRadius: 10,
      padding: 12,
      marginTop: 8,
      gap: 8,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    timeLabel: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    timeDetails: {
      marginLeft: 22,
      gap: 2,
    },
    relativeTime: {
      fontSize: 16,
      fontWeight: "700",
    },
    fullDateTime: {
      fontSize: 13,
      fontWeight: "500",
      opacity: 0.8,
    },
    dateTime: {
      fontSize: 14,
      fontWeight: "600",
    },

    // Overdue indicator
    overdueContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    overdueText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#ef4444",
    },

    // Empty State
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
      paddingTop: 100,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyText: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 16,
      textAlign: "center",
      opacity: 0.8,
    },
  });