"use client"

import type React from "react"
import { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { useNutritionist } from "../contexts/NutritionistContext"

interface TimeSlot {
  id: string
  time: string
  available: boolean
  booked: boolean
  patientName?: string
}

interface DaySchedule {
  date: string
  displayDate: string
  dayOfWeek: string
  timeSlots: TimeSlot[]
}

export default function NutritionistSchedule(): React.JSX.Element {
  const router = useRouter()
  const [workingHoursEnabled, setWorkingHoursEnabled] = useState<boolean>(true)
  const { nutritionistData, appointments } = useNutritionist();

  const [workingHours, setWorkingHours] = useState<{
    start: string;
    end: string;
  }>({
    start: nutritionistData?.horarios_disponiveis?.[0] || "09:00",
    end:
      nutritionistData?.horarios_disponiveis?.[
        nutritionistData.horarios_disponiveis.length - 1
      ] || "17:00",
  });

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }));

  const generateWeekDates = () => {
    const dates: { display: string; full: string }[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        display: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        full: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
      });
    }
    
    return dates;
  };

  const weekDates = generateWeekDates();
  const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const scheduleData: DaySchedule[] = weekDates.map((dateObj, index) => {
    const slots: TimeSlot[] = [];
    const currentDate = new Date(dateObj.full.split("/").reverse().join("-"));
    const dayOfWeek = weekDays[currentDate.getDay()];

    const isAvailableDay = true; // TODO: Implementar lógica de dias disponíveis

    nutritionistData?.horarios_disponiveis?.forEach((time) => {
      const [hour] = time.split(":");
      const formattedTime = `${parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour)}:00 ${parseInt(hour) >= 12 ? "PM" : "AM"}`;
      
      const appointment = appointments?.find(
        (apt) => apt.data_consulta.split("T")[0] === dateObj.full.split("/").reverse().join("-")
      );

      slots.push({
        id: `${dateObj.full}-${time}`,
        time: formattedTime,
        available: isAvailableDay,
        booked: !!appointment,
        patientName: appointment?.paciente_nome,
      });
    });

    return {
      date: dateObj.full,
      displayDate: dateObj.display,
      dayOfWeek,
      timeSlots: slots,
    };
  });

  const selectedDaySchedule = scheduleData.find((day) => day.date === selectedDate);

  const toggleAvailability = (slotId: string): void => {
    // TODO: Implementar lógica real de atualização de disponibilidade
    Alert.alert("Disponibilidade Atualizada", "Sua disponibilidade foi atualizada para este horário.", [{ text: "OK" }]);
  };

  // Configurar horário de trabalho
  const handleSetWorkingHours = (): void => {
    // TODO: Implementar lógica real de configuração de horário de trabalho
    Alert.alert("Configurar Horário de Trabalho", "Isso abriria um modal para configurar seu horário de trabalho padrão.", [{ text: "OK" }]);
  };

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
                day.dayOfWeek === "Sábado" && styles.unavailableDateButton,
              ]}
              onPress={() => setSelectedDate(day.date)}
              disabled={day.dayOfWeek === "Domingo" || day.dayOfWeek === "Sábado"}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  selectedDate === day.date && styles.selectedDayOfWeekText,
                  day.dayOfWeek === "Domingo" && styles.unavailableDayText,
                  day.dayOfWeek === "Sábado" && styles.unavailableDayText,
                ]}
              >
                {day.dayOfWeek.substring(0, 3)}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day.date && styles.selectedDateText,
                  day.dayOfWeek === "Domingo" && styles.unavailableDayText,
                  day.dayOfWeek === "Sábado" && styles.unavailableDayText,
                ]}
              >
                {day.displayDate}
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

