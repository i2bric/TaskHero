import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    deadline: v.number(),
    createdAt: v.number(),
    notificationId: v.optional(v.string()), // Add this field for notification tracking
  })
    .index("by_deadline", ["deadline"])
    .index("by_completed", ["isCompleted"]),
  
  profile: defineTable({
    level: v.number(),
    experience: v.number(),
    totalTasksCompleted: v.number(),
  }),
  
  history: defineTable({
    text: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    expEarned: v.number(),
    completedAt: v.number(),
    deadline: v.number(),
    wasOverdue: v.boolean(),
  })
    .index("by_completed_at", ["completedAt"]),
});