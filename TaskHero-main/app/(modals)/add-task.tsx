// app/(modals)/add-task.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import uuid from "react-native-uuid";
import { loadTasks, saveTasks } from "../../storage/storage";

export default function AddTaskModal() {
  const theme = useTheme();
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const saveTask = async () => {
    if (!taskName || !deadline) return;

    const newTask = {
      id: uuid.v4().toString(),
      name: taskName,
      deadline: deadline.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const tasks = await loadTasks();
    await saveTasks([...tasks, newTask]);

    router.back();
  };

  const formatDeadline = (d: Date) =>
    d.toLocaleString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Tambah Tugas
      </Text>

      <TextInput
        placeholder="Nama Tugas"
        placeholderTextColor={theme.colors.outline}
        value={taskName}
        onChangeText={setTaskName}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.onSurface,
            borderColor: theme.colors.outline,
          },
        ]}
      />

      <Button
        mode="outlined"
        onPress={() => setOpenDatePicker(true)}
        style={styles.dateButton}
      >
        {deadline ? formatDeadline(deadline) : "Pilih tanggal & waktu"}
      </Button>

      {/* Date Picker */}
      <DatePickerModal
        locale="id"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={tempDate || new Date()}
        validRange={{ startDate: new Date() }}
        onConfirm={(params) => {
          setOpenDatePicker(false);
          if (params.date) {
            setTempDate(params.date);
            setOpenTimePicker(true);
          }
        }}
      />

      {/* Time Picker */}
      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        hours={tempDate?.getHours() ?? 12}
        minutes={tempDate?.getMinutes() ?? 0}
        onConfirm={(params) => {
          setOpenTimePicker(false);
          if (params.hours != null && params.minutes != null && tempDate) {
            const updated = new Date(tempDate);
            updated.setHours(params.hours);
            updated.setMinutes(params.minutes);
            setDeadline(updated);
          }
        }}
      />

      <View style={{ height: 16 }} />

      <Button
        mode="contained"
        onPress={saveTask}
        disabled={!taskName || !deadline}
        style={styles.saveButton}
      >
        Simpan
      </Button>

      <View style={{ height: 12 }} />
      
      <Button
        mode="outlined"
        onPress={() => router.back()}
        textColor={theme.colors.error}
      >
        Batal
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  saveButton: {
    paddingVertical: 6,
  },
});