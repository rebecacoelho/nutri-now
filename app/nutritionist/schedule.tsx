"use client"

import type React from "react"
import { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

interface TimeSlot {
  id: string
  time: string
  available: boolean
  booked: boolean
  patientName?: string
}

interface DaySchedule {
  date: string
  dayOfWeek: string
  timeSlots: TimeSlot[]
}

export default function NutritionistSchedule(): React.JSX.Element {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("15 de Mar, 2025")
  const [workingHoursEnabled, setWorkingHoursEnabled] = useState<boolean>(true)

  // Dados de exemplo para o cronograma
  const weekDates: string[] = [
    "15 de Mar, 2025",
    "16 de Mar, 2025",
    "17 de Mar, 2025",
    "18 de Mar, 2025",
    "19 de Mar, 2025",
    "20 de Mar, 2025",
    "21 de Mar, 2025",
  ]

  const weekDays: string[] = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

  // Gerar dados do cronograma
  const scheduleData: DaySchedule[] = weekDates.map((date, index) => {
    // Gerar horários para cada dia
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`

      // Determinar aleatoriamente se um horário está reservado
      const isBooked = Math.random() > 0.7
      const patientNames = ["Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson"]

      slots.push({
        id: `${date}-${hour}`,
        time,
        available: weekDays[index] !== "Domingo", // Não disponível aos domingos
        booked: isBooked,
        patientName: isBooked ? patientNames[Math.floor(Math.random() * patientNames.length)] : undefined,
      })
    }

    return {
      date,
      dayOfWeek: weekDays[index],
      timeSlots: slots,
    }
  })

  // Encontrar o cronograma do dia selecionado
  const selectedDaySchedule = scheduleData.find((day) => day.date === selectedDate)

  // Alterar a disponibilidade de um horário
  const toggleAvailability = (slotId: string): void => {
    //atualizar isso no seu estado ou backend
    Alert.alert("Disponibilidade Atualizada", "Sua disponibilidade foi atualizada para este horário.", [{ text: "OK" }])
  }

  // Configurar horário de trabalho
  const handleSetWorkingHours = (): void => {
    // abriri um modal para configurar o horário de trabalho
    Alert.alert("Configurar Horário de Trabalho", "Isso abriria um modal para configurar seu horário de trabalho padrão.", [{ text: "OK" }])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Agenda",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={handleSetWorkingHours}>
              <Ionicons name="settings-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.calendarHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {scheduleData.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dateButton,
                selectedDate === day.date && styles.selectedDateButton,
                day.dayOfWeek === "Domingo" && styles.unavailableDateButton,
              ]}
              onPress={() => setSelectedDate(day.date)}
              disabled={day.dayOfWeek === "Domingo"}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  selectedDate === day.date && styles.selectedDayOfWeekText,
                  day.dayOfWeek === "Domingo" && styles.unavailableDayText,
                ]}
              >
                {day.dayOfWeek.substring(0, 3)}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day.date && styles.selectedDateText,
                  day.dayOfWeek === "Domingo" && styles.unavailableDayText,
                ]}
              >
                {day.date.split(", ")[0].split(" ")[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.workingHoursToggle}>
        <Text style={styles.workingHoursText}>Horário de Trabalho</Text>
        <Switch
          trackColor={{ false: "#ddd", true: "#a5d6a7" }}
          thumbColor={"#4CAF50"}
          value={workingHoursEnabled}
          onValueChange={setWorkingHoursEnabled}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleDate}>{selectedDate}</Text>
          <Text style={styles.scheduleDayOfWeek}>{selectedDaySchedule?.dayOfWeek}</Text>
        </View>

        {selectedDaySchedule?.timeSlots.map((slot) => (
          <View
            key={slot.id}
            style={[
              styles.timeSlot,
              !slot.available && styles.unavailableTimeSlot,
              slot.booked && styles.bookedTimeSlot,
            ]}
          >
            <View style={styles.timeSlotInfo}>
              <Text style={styles.timeSlotTime}>{slot.time}</Text>
              {slot.booked && (
                <View style={styles.bookedInfo}>
                  <Ionicons name="person" size={16} color="#4CAF50" />
                  <Text style={styles.patientName}>{slot.patientName}</Text>
                </View>
              )}
            </View>

            {!slot.booked && (
              <TouchableOpacity
                style={[styles.availabilityToggle, slot.available ? styles.availableToggle : styles.unavailableToggle]}
                onPress={() => toggleAvailability(slot.id)}
              >
                <Text style={styles.availabilityToggleText}>{slot.booked ? "Disponível" : "Indisponível"}</Text>
              </TouchableOpacity>
            )}

            {slot.booked && (
              <View style={styles.appointmentActions}>
                <Text style={styles.availabilityToggleText}>Agendado</Text>
              </View>
            )}
          </View>
        ))}

        {selectedDaySchedule?.dayOfWeek === "Domingo" && (
          <View style={styles.dayOffMessage}>
            <Ionicons name="information-circle-outline" size={24} color="#999" />
            <Text style={styles.dayOffText}>Você não está trabalhando aos domingos</Text>
          </View>
        )}
      </ScrollView>

      <NutritionistTabBar activeTab="agenda" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerButton: {
    marginRight: 15,
  },
  calendarHeader: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dateButton: {
    width: 60,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  selectedDateButton: {
    backgroundColor: "#4CAF50",
  },
  unavailableDateButton: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  dayOfWeekText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 5,
  },
  selectedDayOfWeekText: {
    color: "#fff",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDateText: {
    color: "#fff",
  },
  unavailableDayText: {
    color: "#999",
  },
  workingHoursToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  workingHoursText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  scheduleHeader: {
    marginBottom: 20,
  },
  scheduleDate: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scheduleDayOfWeek: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  timeSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  unavailableTimeSlot: {
    backgroundColor: "#f5f5f5",
    borderColor: "#eee",
  },
  bookedTimeSlot: {
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  timeSlotInfo: {
    flex: 1,
  },
  timeSlotTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  bookedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  patientName: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 5,
  },
  availabilityToggle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  availableToggle: {
    backgroundColor: "#e8f5e9",
  },
  unavailableToggle: {
    backgroundColor: "#f5f5f5",
  },
  availabilityToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  appointmentActions: {
    flexDirection: "row",
  },
  appointmentAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  dayOffMessage: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  dayOffText: {
    fontSize: 16,
    color: "#999",
    marginLeft: 10,
  },
})

