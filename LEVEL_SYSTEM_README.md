# Todo App with Level-Up & Experience System 🎮

This enhanced todo app now includes a **gamification system** with levels, experience points (XP), and progression tracking to make task completion more rewarding and engaging!

## 🆕 New Features

### 1. **Level & Experience System**
- Start at **Level 1** with 0 XP
- Earn **50 XP** every time you complete a task
- Level up when you reach the required XP threshold
- XP requirements increase exponentially with each level:
  - Level 1→2: 100 XP (2 tasks)
  - Level 2→3: 150 XP (3 tasks)
  - Level 3→4: 225 XP (5 tasks)
  - And so on...

### 2. **Profile Bar**
A beautiful profile card displays:
- Current level with a star badge
- Experience progress bar
- XP towards next level
- Total tasks completed
- Visual feedback on how close you are to leveling up

### 3. **Level-Up Animation**
When you reach a new level:
- 🏆 Trophy animation with sparkles
- Celebratory modal showing your new level
- Encouraging message to keep you motivated
- Smooth animations and transitions

### 4. **XP Gain Animation**
Every time you complete a task:
- "+50 XP" floats up with a golden glow
- Provides instant visual feedback
- Makes task completion satisfying

### 5. **Progress Tracking**
- View total tasks completed in your profile
- Track your level progression over time
- Reset progress option in settings (if you want to start over)

## 📂 New Files Added

### Frontend Components:
- `/components/ProfileBar.tsx` - Displays level, XP, and stats
- `/components/LevelUpModal.tsx` - Celebratory level-up screen
- `/components/XPGainAnimation.tsx` - Floating XP gain effect

### Backend (Convex):
- `/convex/profile.ts` - Profile management and XP calculations
- Updated `/convex/schema.ts` - Added profile table
- Updated `/convex/todos.ts` - Awards XP on task completion

### Updated Files:
- `/app/(tabs)/index.tsx` - Integrated level system
- `/components/DangerZone.tsx` - Added progress reset option

## 🎯 How It Works

### Completing Tasks
1. Mark a task as complete
2. Receive +50 XP
3. XP is added to your profile
4. If you have enough XP, level up automatically
5. See your progress in the profile bar

### Level Calculation
```typescript
// XP required for each level grows exponentially
XP_Required = 100 × (1.5 ^ (level - 1))

Examples:
Level 1: 100 XP
Level 2: 150 XP  
Level 3: 225 XP
Level 4: 337 XP
Level 5: 506 XP
```

### Profile Initialization
- Profile is automatically created when you first open the app
- Starts at Level 1 with 0 XP
- Tracks all completed tasks

## 🎨 UI/UX Enhancements

### Profile Bar Design:
- Gradient backgrounds matching app theme
- Star icon for level badge
- Smooth progress bar with gradient fill
- Info card explaining XP rewards
- Responsive layout

### Level-Up Modal:
- Full-screen overlay with backdrop
- Animated trophy icon
- Sparkle effects
- Smooth scale and rotation animations
- "Continue" button to dismiss

### XP Animation:
- Floats upward from center
- Fades out as it rises
- Golden color for premium feel
- Doesn't block UI interaction

## 🔧 Settings Options

### New Danger Zone Options:
1. **Reset Progress** (⚠️)
   - Resets level to 1
   - Clears all XP
   - Resets task completion count
   - Keeps your todos intact

2. **Reset App** (existing)
   - Deletes all todos
   - Keeps your profile/level

## 🚀 Getting Started

### Installation & Setup:
```bash
# Install dependencies (if not already done)
npm install

# Deploy Convex schema updates
npx convex dev

# Run the app
npm start
```

### First Launch:
- App will automatically initialize your profile
- Start at Level 1 with 0 XP
- Complete tasks to earn XP and level up!

## 💡 Tips for Users

1. **Complete tasks daily** to maintain momentum
2. **Set achievable goals** to earn consistent XP
3. **Watch your progress bar** fill up for motivation
4. **Celebrate level-ups** - you've earned them!
5. **Track your total tasks** to see long-term progress

## 🎮 Gamification Benefits

- **Motivation**: Visual progress makes task completion rewarding
- **Engagement**: Level system encourages consistent use
- **Achievement**: Clear milestones to work towards
- **Feedback**: Instant XP rewards for completing tasks
- **Competition**: Track your level as a personal high score

## 🛠️ Technical Details

### Database Schema:
```typescript
profile: {
  level: number,
  experience: number,
  totalTasksCompleted: number
}
```

### Key Functions:
- `getProfile()` - Fetches user profile with XP calculations
- `addExperience(amount)` - Adds XP and handles level-ups
- `resetProfile()` - Resets progress to Level 1
- `toggleTodo()` - Awards 50 XP when completing tasks

### State Management:
- React hooks for animation states
- Convex real-time queries for profile data
- Automatic profile initialization on mount

## 📱 Compatibility

- iOS ✅
- Android ✅
- Expo Go ✅
- Built with React Native & Expo

## 🎉 Enjoy Your Enhanced Todo App!

Now every completed task brings you closer to the next level. Turn your productivity into a game and watch yourself grow! 🚀

---

**Note**: The level system is designed to be progressively challenging but always achievable. Early levels come quickly to build momentum, while later levels require more dedication - just like a real RPG! 🎮
