// app/(modals)/add-task.tsx
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import { loadTasks, saveTasks } from "../../storage/storage";

export default function AddTaskModal() {
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

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
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Tugas</Text>

      <TextInput
        placeholder="Nama Tugas"
        value={taskName}
        onChangeText={setTaskName}
        style={styles.input}
      />

      <Button
        title={deadline ? formatDeadline(deadline) : "Pilih tanggal & waktu"}
        onPress={() => setOpenDatePicker(true)}
      />

      {/* Date Picker */}
      <DatePickerModal
        locale="id"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={deadline || new Date()}
        validRange={{ startDate: new Date() }} // Tidak bisa pilih tanggal lewat
        onConfirm={(params) => {
          setOpenDatePicker(false);
          if (params.date) {
            setDeadline(params.date);
            setOpenTimePicker(true); // lanjut pilih waktu
          }
        }}
      />

      {/* Time Picker */}
      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        hours={deadline?.getHours() ?? 12}
        minutes={deadline?.getMinutes() ?? 0}
        onConfirm={(params) => {
          setOpenTimePicker(false);
          if (params.hours != null && params.minutes != null && deadline) {
            const updated = new Date(deadline);
            updated.setHours(params.hours);
            updated.setMinutes(params.minutes);
            setDeadline(updated);
          }
        }}
      />

      <View style={{ height: 16 }} />

      <Button
        title="Simpan"
        onPress={saveTask}
        disabled={!taskName || !deadline}
      />

      <View style={{ height: 12 }} />
      <Button title="Batal" color="red" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  marginBottom: 20,

  // 🔥 Tambahan ini membuat text input terlihat
  backgroundColor: "white",
  color: "black",
  borderColor: "#888",
}

});
