import { query, mutation } from "./_generated/server";

export const getHistory = query({
  handler: async (ctx) => {
    const history = await ctx.db
      .query("history")
      .order("desc")
      .take(50);
    
    return history;
  },
});

export const clearHistory = mutation({
  handler: async (ctx) => {
    const history = await ctx.db.query("history").collect();
    
    for (const item of history) {
      await ctx.db.delete(item._id);
    }
    
    return { deletedCount: history.length };
  },
});

export const getHistoryStats = query({
  handler: async (ctx) => {
    const history = await ctx.db.query("history").collect();
    
    const totalCompleted = history.length;
    const totalExpEarned = history.reduce((sum, item) => sum + item.expEarned, 0);
    const overdueCompleted = history.filter(item => item.wasOverdue).length;
    
    const difficultyBreakdown = {
      easy: history.filter(item => item.difficulty === "easy").length,
      medium: history.filter(item => item.difficulty === "medium").length,
      hard: history.filter(item => item.difficulty === "hard").length,
    };
    
    return {
      totalCompleted,
      totalExpEarned,
      overdueCompleted,
      difficultyBreakdown,
    };
  },
});