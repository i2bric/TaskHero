import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// EXP berdasarkan difficulty
const getExpForDifficulty = (difficulty: "easy" | "medium" | "hard"): number => {
  switch (difficulty) {
    case "easy":
      return 30;
    case "medium":
      return 60;
    case "hard":
      return 100;
    default:
      return 30;
  }
};

// Calculate XP needed for level
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const getTodos = query({
  handler: async (ctx) => {
    // Get only incomplete todos, sorted by deadline (closest first)
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
    
    // Sort by deadline (ascending - soonest first)
    const sortedTodos = todos.sort((a, b) => a.deadline - b.deadline);
    
    return sortedTodos;
  },
});

export const addTodo = mutation({
  args: { 
    text: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    deadline: v.number(),
    notificationId: v.optional(v.string()), // Add notification ID support
  },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      difficulty: args.difficulty,
      deadline: args.deadline,
      createdAt: Date.now(),
      notificationId: args.notificationId,
    });

    return todoId;
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError("Todo not found");

    const wasCompleted = todo.isCompleted;
    const nowCompleted = !todo.isCompleted;

    if (!wasCompleted && nowCompleted) {
      // CARD SYSTEM: Task completed, move to history and DELETE the card
      const expEarned = getExpForDifficulty(todo.difficulty);
      const wasOverdue = Date.now() > todo.deadline;
      
      // Add to history
      await ctx.db.insert("history", {
        text: todo.text,
        difficulty: todo.difficulty,
        expEarned,
        completedAt: Date.now(),
        deadline: todo.deadline,
        wasOverdue,
      });
      
      // DELETE the todo card (anti-exploit)
      await ctx.db.delete(args.id);
      
      // Award XP to profile
      const profiles = await ctx.db.query("profile").collect();
      let profile = profiles[0];
      
      // Initialize profile if it doesn't exist
      if (!profile) {
        const profileId = await ctx.db.insert("profile", {
          level: 1,
          experience: 0,
          totalTasksCompleted: 0,
        });
        const newProfile = await ctx.db.get(profileId);
        if (!newProfile) throw new ConvexError("Failed to create profile");
        profile = newProfile;
      }

      let newExperience = profile.experience + expEarned;
      let newLevel = profile.level;
      let leveledUp = false;
      
      // Check for level ups
      let xpNeeded = calculateXPForLevel(newLevel);
      while (newExperience >= xpNeeded) {
        newExperience -= xpNeeded;
        newLevel += 1;
        leveledUp = true;
        xpNeeded = calculateXPForLevel(newLevel);
      }
      
      await ctx.db.patch(profile._id, {
        level: newLevel,
        experience: newExperience,
        totalTasksCompleted: profile.totalTasksCompleted + 1,
      });

      return {
        leveledUp,
        newLevel,
        previousLevel: profile.level,
        expEarned,
        wasOverdue,
        notificationId: todo.notificationId, // Return notification ID to cancel it
      };
    }

    // If unchecking (shouldn't happen with card system, but just in case)
    return {
      leveledUp: false,
      expEarned: 0,
    };
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);
    
    // Return notification ID so it can be cancelled
    return {
      notificationId: todo?.notificationId,
    };
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    deadline: v.number(),
    notificationId: v.optional(v.string()), // Support updating notification ID
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    
    await ctx.db.patch(args.id, {
      text: args.text,
      difficulty: args.difficulty,
      deadline: args.deadline,
      notificationId: args.notificationId,
    });
    
    // Return old notification ID so it can be cancelled
    return {
      oldNotificationId: todo?.notificationId,
    };
  },
});

export const clearAllTodos = mutation({
  handler: async (ctx) => {
    // Get all todos to return their notification IDs
    const todos = await ctx.db.query("todos").collect();
    const notificationIds = todos
      .map(todo => todo.notificationId)
      .filter((id): id is string => id !== undefined);
    
    // Delete all todos
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }

    // Delete all history
    const history = await ctx.db.query("history").collect();
    for (const item of history) {
      await ctx.db.delete(item._id);
    }

    // Reset profile to level 1
    const profiles = await ctx.db.query("profile").collect();
    for (const profile of profiles) {
      await ctx.db.patch(profile._id, {
        level: 1,
        experience: 0,
        totalTasksCompleted: 0,
      });
    }

    return { 
      deletedTodos: todos.length,
      deletedHistory: history.length,
      notificationIds, // Return notification IDs to cancel them
    };
  },
});

// Get overdue todos count
export const getOverdueCount = query({
  handler: async (ctx) => {
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
    
    const now = Date.now();
    const overdueCount = todos.filter(todo => todo.deadline < now).length;
    
    return overdueCount;
  },
});