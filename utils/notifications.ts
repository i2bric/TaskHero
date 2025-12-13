// utils/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Konfigurasi notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission
export async function registerForPushNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Izin notifikasi ditolak!");
    return false;
  }

  return true;
}

// Schedule notifikasi untuk deadline
export async function scheduleTaskNotification(
  taskId: string,
  taskName: string,
  deadline: Date
) {
  try {
    // Batalkan notif lama (jika ada)
    await cancelTaskNotification(taskId);

    // Hitung waktu notifikasi: 1 jam sebelum deadline
    const notificationTime = new Date(deadline.getTime() - 60 * 60 * 1000);
    
    // Jangan schedule jika waktu sudah lewat
    if (notificationTime.getTime() <= Date.now()) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Deadline Mendekat!",
        body: `"${taskName}" akan berakhir dalam 1 jam`,
        data: { taskId },
        sound: true,
      },
      trigger: notificationTime,
    });

    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

// Cancel notifikasi task tertentu
export async function cancelTaskNotification(taskId: string) {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notif of scheduledNotifications) {
      if (notif.content.data?.taskId === taskId) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}

// Send instant notification (untuk task selesai)
export async function sendInstantNotification(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // instant
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}