<<<<<<< HEAD
import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  // Gunakan tema global yang sudah kita buat (PaperProvider)
  const theme = useTheme();
=======
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
>>>>>>> d452de2 (Initial commit)

  return (
    <Tabs
      screenOptions={{
<<<<<<< HEAD
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: theme.colors.primary,  // Biru
        tabBarInactiveTintColor: theme.colors.outline, // Abu lembut
        tabBarStyle: {
          backgroundColor: theme.colors.surface, // Surface sesuai tema
          borderTopColor: theme.colors.outline,  // Border halus
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />

      {/* Tambahkan task pages tanpa muncul di tab bar */}
      <Tabs.Screen
        name="add-task"
        options={{
          href: null, // tidak tampil di tab
        }}
      />

      <Tabs.Screen
        name="task-detail"
        options={{
          href: null, // tidak tampil di tab
=======
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
>>>>>>> d452de2 (Initial commit)
        }}
      />
    </Tabs>
  );
}
