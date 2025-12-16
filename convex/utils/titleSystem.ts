// Title system helper functions
export type TitleInfo = {
  title: string;
  color: string;
  emoji: string;
  minLevel: number;
  maxLevel: number;
};

export const TITLE_TIERS: TitleInfo[] = [
  { title: "Rookie Hero", color: "#10b981", emoji: "🟢", minLevel: 1, maxLevel: 2 },
  { title: "Novice Adventurer", color: "#10b981", emoji: "🟢", minLevel: 3, maxLevel: 4 },
  { title: "Elite Champion", color: "#3b82f6", emoji: "🔵", minLevel: 5, maxLevel: 9 },
  { title: "Veteran Warrior", color: "#3b82f6", emoji: "🔵", minLevel: 10, maxLevel: 50 },
  { title: "Master of Combat", color: "#eab308", emoji: "🟡", minLevel: 51, maxLevel: 100 },
  { title: "Hardened Fighter", color: "#f97316", emoji: "🟠", minLevel: 101, maxLevel: 200 },
  { title: "True Epic", color: "#dc2626", emoji: "🔴", minLevel: 201, maxLevel: 350 },
  { title: "Living Legend", color: "#a855f7", emoji: "🟣", minLevel: 351, maxLevel: 500 },
  { title: "Myth Incarnate", color: "#1f2937", emoji: "⚫", minLevel: 501, maxLevel: 650 },
  { title: "Transcendent Being", color: "#ef4444", emoji: "🔥", minLevel: 651, maxLevel: 800 },
  { title: "Pseudo God", color: "#9333ea", emoji: "🌌", minLevel: 801, maxLevel: 950 },
  { title: "Supreme Existence", color: "#FFD700", emoji: "👑", minLevel: 951, maxLevel: 999 },
];

export const getTitleForLevel = (level: number): TitleInfo => {
  for (let i = TITLE_TIERS.length - 1; i >= 0; i--) {
    const tier = TITLE_TIERS[i];
    if (level >= tier.minLevel) {
      return tier;
    }
  }
  return TITLE_TIERS[0];
};

export const getNextTitleInfo = (currentLevel: number): TitleInfo | null => {
  const currentTier = getTitleForLevel(currentLevel);
  const currentIndex = TITLE_TIERS.findIndex((t) => t.title === currentTier.title);

  if (currentIndex < TITLE_TIERS.length - 1) {
    return TITLE_TIERS[currentIndex + 1];
  }

  return null; // Already at max title
};

export const didTitleChange = (oldLevel: number, newLevel: number): boolean => {
  const oldTitle = getTitleForLevel(oldLevel);
  const newTitle = getTitleForLevel(newLevel);
  return oldTitle.title !== newTitle.title;
};