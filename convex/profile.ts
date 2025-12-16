import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// XP required for each level (exponential growth)
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Get title based on level
const getTitleForLevel = (level: number): { title: string; color: string; emoji: string } => {
  if (level >= 951) return { title: "Supreme Existence", color: "#FFD700", emoji: "👑" };
  if (level >= 801) return { title: "Pseudo God", color: "#9333ea", emoji: "🌌" };
  if (level >= 651) return { title: "Transcendent Being", color: "#ef4444", emoji: "🔥" };
  if (level >= 501) return { title: "Myth Incarnate", color: "#1f2937", emoji: "⚫" };
  if (level >= 351) return { title: "Living Legend", color: "#a855f7", emoji: "🟣" };
  if (level >= 201) return { title: "True Epic", color: "#dc2626", emoji: "🔴" };
  if (level >= 101) return { title: "Hardened Fighter", color: "#f97316", emoji: "🟠" };
  if (level >= 51) return { title: "Master of Combat", color: "#eab308", emoji: "🟡" };
  if (level >= 10) return { title: "Veteran Warrior", color: "#3b82f6", emoji: "🔵" };
  if (level >= 5) return { title: "Elite Champion", color: "#3b82f6", emoji: "🔵" };
  if (level >= 3) return { title: "Novice Adventurer", color: "#10b981", emoji: "🟢" };
  return { title: "Rookie Hero", color: "#10b981", emoji: "🟢" };
};

export const getProfile = query({
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profile").collect();
    
    // If no profile exists, return default
    if (profiles.length === 0) {
      const titleInfo = getTitleForLevel(1);
      return {
        level: 1,
        experience: 0,
        totalTasksCompleted: 0,
        experienceToNextLevel: calculateXPForLevel(1),
        title: titleInfo.title,
        titleColor: titleInfo.color,
        titleEmoji: titleInfo.emoji,
      };
    }
    
    const profile = profiles[0];
    const experienceToNextLevel = calculateXPForLevel(profile.level);
    const titleInfo = getTitleForLevel(profile.level);
    
    return {
      ...profile,
      experienceToNextLevel,
      title: titleInfo.title,
      titleColor: titleInfo.color,
      titleEmoji: titleInfo.emoji,
    };
  },
});

export const initializeProfile = mutation({
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profile").collect();
    
    if (profiles.length === 0) {
      await ctx.db.insert("profile", {
        level: 1,
        experience: 0,
        totalTasksCompleted: 0,
      });
    }
  },
});

export const resetProfile = mutation({
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profile").collect();
    
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
    }
    
    await ctx.db.insert("profile", {
      level: 1,
      experience: 0,
      totalTasksCompleted: 0,
    });
  },
});