// utils/notificationService.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ENABLED_KEY = '@notifications_enabled';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,     // Add this
    shouldShowList: true,       // Add this
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('task-reminders', {
        name: 'Task Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366f1',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleTaskNotification = async (
  todoId: string,
  taskText: string,
  deadline: number,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<string | null> => {
  try {
    // Check if notifications are enabled
    const enabled = await getNotificationsEnabled();
    if (!enabled) {
      return null;
    }

    // Calculate notification time (24 hours before deadline)
    const notificationTime = deadline - (24 * 60 * 60 * 1000);
    const now = Date.now();

    // Don't schedule if notification time has already passed
    if (notificationTime <= now) {
      console.log('Notification time has passed, skipping');
      return null;
    }

    const difficultyEmoji = {
      easy: '✅',
      medium: '⚠️',
      hard: '🔥',
    }[difficulty];

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${difficultyEmoji} Task Reminder`,
        body: `"${taskText}" is due in 24 hours!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { todoId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,  // Add this line
        date: new Date(notificationTime),
      },
    });

    console.log(`Scheduled notification ${notificationId} for task: ${taskText}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelTaskNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled notification: ${notificationId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all notifications');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`Found ${notifications.length} scheduled notifications`);
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Preferences management
export const setNotificationsEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(enabled));
    
    if (!enabled) {
      // Cancel all notifications when disabled
      await cancelAllNotifications();
    }
  } catch (error) {
    console.error('Error setting notifications preference:', error);
  }
};

export const getNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return value ? JSON.parse(value) : true; // Default to true
  } catch (error) {
    console.error('Error getting notifications preference:', error);
    return true;
  }
};