import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from "react-native-paper";

export const unstable_settings = {
  anchor: "(tabs)",
};

// 🎨 Custom Color Scheme (Biru + Oranye)
const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#007AFF",
    secondary: "#FF9500",

    // 🔥 background oranye terang
    background: "#FFE5CC",
    surface: "#FFFFFF",

    outline: "#CED4DA",
    error: "#FF3B30",
  },
};

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#4D9BFF",
    secondary: "#FFB258",

    // 🔥 oranye gelap
    background: "#CC6A00",
    surface: "#1C1C1E",

    outline: "#3A3A3C",
    error: "#FF453A",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack
      
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: "white",
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {/* Tabs utama */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modal Add Task */}
        <Stack.Screen
          name="(modals)/add-task"
          options={{
            presentation: "formSheet", // Floating window iOS, modal Android
            title: "Tambah Tugas",
          }}
        />

        {/* Modal Task Detail */}
        <Stack.Screen
          name="(modals)/task-detail"
          options={{
            presentation: "formSheet",
            title: "Detail Tugas",
          }}
        />
      </Stack>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </PaperProvider>
  );
}
