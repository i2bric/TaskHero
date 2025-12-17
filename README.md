# 🦸‍♂️ TaskHero

**TaskHero** adalah aplikasi _gamified to-do list_ berbasis **React Native** yang membantu pengguna mencatat, mengelola, dan menyelesaikan tugas sehari-hari dengan sistem leveling dan experience points (XP).

Aplikasi ini dibuat dengan antarmuka modern dan interaktif, menggunakan **Expo** dan **React Native** untuk pengalaman cross-platform yang mulus.

---

## 👥 Anggota Kelompok

- **Travy Apuila Jasa Said** (231402094)
- **Ilyas Rafif Hasian Munthe** (231402113)
- **Muhammad Abyan Khairi** (231402117)
- **Mohamad Rifa Algifari Mulia Sembiring** (231402121)
- **Aldi Zaki Aulia** (231402130)
- **Jaysha Anbiya Harris** (231402133)

---

## 📱 Deskripsi Project

Aplikasi ini dikembangkan menggunakan **React Native** dengan **Expo** framework dan **Convex** sebagai backend real-time.

**Jenis aplikasi:** Cross-platform Mobile App (Android & iOS)

- **Framework:** React Native dengan Expo
- **Backend:** Convex (Real-time database)
- **Routing:** Expo Router
- **Styling:** React Native StyleSheet dengan Linear Gradients
- **Notifications:** Expo Notifications

---

## 🌟 Fitur Utama

| Fitur                          | Deskripsi                                                          |
| ------------------------------ | ------------------------------------------------------------------ |
| 🎮 **Sistem Gamifikasi**       | Dapatkan XP dan level up setiap menyelesaikan tugas!               |
| ⚡ **3 Tingkat Kesulitan**     | Easy (30 XP), Medium (60 XP), Hard (100 XP)                        |
| 📊 **Profil & Progress**       | Lihat level, XP, total tasks completed, dan progress bar           |
| 🏆 **Sistem Title**            | Raih title eksklusif dari "Rookie Hero" hingga "Supreme Existence" |
| ⏰ **Deadline System**         | Set deadline untuk setiap task dengan date & time picker           |
| 🔔 **Smart Notifications**     | Notifikasi otomatis 24 jam sebelum deadline (opsional)             |
| 📜 **Task History**            | Lihat riwayat semua task yang telah diselesaikan                   |
| 🕐 **Completion Timestamps**   | Lihat kapan task diselesaikan dengan relative time & full datetime |
| ✏️ **Edit & Delete**           | Edit atau hapus task dengan mudah                                  |
| 🌓 **Dark Mode**               | Toggle antara light dan dark theme                                 |
| 🎨 **UI Modern**               | Gradient backgrounds, smooth animations, dan glassmorphism effects |
| 💾 **Real-time Sync**          | Data tersimpan secara real-time menggunakan Convex                 |
| 🔄 **Anti-Exploit System**     | Task otomatis terhapus saat completed (tidak bisa di-uncomplete)   |

---

## 🧱 Struktur Project
```
TaskHero/
├── .expo/                      # Expo configuration cache
├── .git/                       # Git version control
├── .vscode/                    # VSCode settings
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab navigator configuration
│   │   ├── index.tsx          # 🏠 Home screen (task list)
│   │   ├── history.tsx        # 📜 History screen (completed tasks)
│   │   └── settings.tsx       # ⚙️ Settings screen
│   ├── _layout.tsx            # Root layout with providers
│   └── index.tsx              # App entry point
├── assets/
│   ├── images/                # App icons, splash screen, logos
│   │   ├── icon.png
│   │   ├── splash-icon.png
│   │   ├── adaptive-icon.png
│   │   └── newsplash.png
│   └── styles/                # Global StyleSheet definitions
│       ├── home.styles.ts
│       ├── settings.styles.ts
│       └── history.styles.ts  # ✨ History page styles
├── components/
│   ├── Header.tsx             # App header dengan logo TaskHero
│   ├── ProfileBar.tsx         # Level, XP, title, progress bar display
│   ├── TodoInput.tsx          # Legacy simple task input
│   ├── Todoinputnew.tsx       # ✨ Enhanced task input with deadline & difficulty picker
│   ├── TodoCard.tsx           # Individual task card component
│   ├── EmptyState.tsx         # Empty state UI with clipboard icon
│   ├── LevelUpModal.tsx       # 🏆 Level-up celebration modal
│   ├── XPGainAnimation.tsx    # Floating XP gain animation
│   ├── LoadingSpinner.tsx     # Loading indicator
│   ├── SplashScreen.tsx       # Custom splash screen
│   ├── Preferences.tsx        # Dark mode & notification settings
│   ├── ProgressStats.tsx      # Statistics cards (total, completed, active)
│   └── DangerZone.tsx         # Reset progress/app data
├── convex/
│   ├── _generated/            # Auto-generated Convex types
│   ├── utils/                 # Convex utility functions
│   │   └── titleSystem.ts    # Title calculation logic
│   ├── schema.ts              # 📊 Database schema (todos, profile, history)
│   ├── todos.ts               # Todo CRUD operations + XP rewards
│   ├── profile.ts             # Profile management & leveling system
│   ├── history.ts             # Task history & statistics
│   └── tsconfig.json          # TypeScript config for Convex
├── hooks/
│   └── useTheme.tsx           # Dark mode theme context & hook
├── node_modules/              # NPM dependencies
├── utils/
│   └── notificationService.ts # 🔔 Notification scheduling & management
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (gitignored)
├── .gitignore                 # Git ignore rules
├── .eslintconfig.js           # ESLint configuration
├── app.json                   # Expo app configuration
├── expo-env.d.ts              # Expo TypeScript definitions
├── package.json               # NPM dependencies & scripts
├── package-lock.json          # Locked dependency versions
├── tsconfig.json              # TypeScript configuration
├── LEVEL_SYSTEM_README.md     # Detailed level system documentation
└── README.md                  # This file
```

---

## 🎯 Sistem Leveling

### Experience Points (XP)

- **Easy Task:** +30 XP
- **Medium Task:** +60 XP
- **Hard Task:** +100 XP

### Formula Level Up

XP requirement tumbuh secara eksponensial untuk memberikan challenge yang progressif:
```typescript
XP_Required = 100 × (1.5 ^ (level - 1))
```

**Contoh Progression:**

- Level 1 → 2: 100 XP (2 easy tasks / 1 hard task)
- Level 2 → 3: 150 XP (3 easy tasks)
- Level 3 → 4: 225 XP (4 easy tasks)
- Level 4 → 5: 337 XP (7 easy tasks)
- Level 5 → 6: 506 XP (10 easy tasks)
- Level 10 → 11: 3,834 XP
- Level 20 → 21: 437,893 XP

### Title Progression

| Level Range | Title              | Emoji |
| ----------- | ------------------ | ----- |
| 1-2         | Rookie Hero        | 🟢    |
| 3-4         | Novice Adventurer  | 🟢    |
| 5-9         | Elite Champion     | 🔵    |
| 10-50       | Veteran Warrior    | 🔵    |
| 51-100      | Master of Combat   | 🟡    |
| 101-200     | Hardened Fighter   | 🟠    |
| 201-350     | True Epic          | 🔴    |
| 351-500     | Living Legend      | 🟣    |
| 501-650     | Myth Incarnate     | ⚫    |
| 651-800     | Transcendent Being | 🔥    |
| 801-950     | Pseudo God         | 🌌    |
| 951+        | Supreme Existence  | 👑    |

---

## 🖼️ Tampilan Aplikasi

### 📍 Halaman Utama (Home)

- Header dengan logo TaskHero
- Profile bar (level, XP, title, progress)
- Input task dengan deadline & difficulty picker
- List of active tasks (sorted by deadline)
- Empty state jika belum ada task

### 📜 Halaman History

**Features:**
- **Statistics Dashboard:**
  - Total Completed Tasks
  - Total XP Earned
  - Overdue Completed Count
  - Breakdown by difficulty (Easy/Medium/Hard)
  
- **Completion Timestamps:**
  - Relative time untuk task baru-baru ini:
    - "Just now" - < 1 menit
    - "5m ago" - 5 menit lalu
    - "3h ago" - 3 jam lalu
    - "2d ago" - 2 hari lalu
  - Full date & time untuk semua task:
    - Date: "Dec 17, 2024"
    - Time: "2:30 PM"
  - Smart display: relative time (bold) + full datetime (detail)

- **Task Information:**
  - Task text
  - Difficulty badge dengan emoji
  - XP earned
  - Overdue indicator (jika diselesaikan terlambat)

### ⚙️ Halaman Settings

- **Preferences:**
  - Dark Mode toggle
  - Notifications toggle (24h before deadline)
- **Progress Stats:**
  - Total Todos
  - Completed Todos
  - Active Todos
- **Danger Zone:**
  - Reset Progress (level & XP only)
  - Reset Everything (all data)

---

## 🚀 Cara Menjalankan Project

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### Installation

1. **Clone repository**
```bash
git clone https://github.com/i2bric/TaskHero.git
cd TaskHero
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Convex**
```bash
npx convex dev
```

_Ikuti instruksi untuk login dan setup Convex project_

4. **Install native dependencies**
```bash
npx expo install expo-notifications @react-native-async-storage/async-storage @react-native-community/datetimepicker
```

5. **Run app**
```bash
npx expo start
```

Scan QR code dengan:

- **Android:** Expo Go app
- **iOS:** Camera app

---

## 🔧 Konfigurasi

### Environment Variables

Buat file `.env.local` (auto-generated oleh Convex):
```env
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Jangan commit `.env.local`** - sudah ada di `.gitignore`

### Notification Setup

File `app.json` sudah dikonfigurasi untuk notifikasi:
```json
{
  "expo": {
    "plugins": [
      ["expo-notifications", {
        "color": "#6366f1"
      }]
    ],
    "android": {
      "permissions": ["POST_NOTIFICATIONS"]
    },
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    }
  }
}
```

---

## 📦 Dependencies Utama

- `react-native` - Core framework
- `expo` - Development framework
- `expo-router` - File-based routing
- `convex` - Real-time backend
- `expo-linear-gradient` - Gradient backgrounds
- `expo-notifications` - Local notifications
- `@react-native-community/datetimepicker` - Date picker
- `@expo/vector-icons` - Icon library

---

## 🎨 Design System

### Colors

- **Primary:** `#6366f1` (Indigo)
- **Success:** `#10b981` (Green)
- **Warning:** `#f59e0b` (Amber)
- **Danger:** `#ef4444` (Red)

### Typography

- **Font Family:** System default
- **Weights:** 400 (Regular), 600 (Semibold), 700 (Bold), 900 (Black)

---

## 🔮 Future Improvements

- [ ] Edit deadline & difficulty untuk existing tasks
- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Daily streak system
- [ ] Achievement badges
- [ ] Leaderboard social features
- [ ] Export history to CSV/PDF
- [ ] Widget support
- [ ] Dark mode auto-schedule

---
