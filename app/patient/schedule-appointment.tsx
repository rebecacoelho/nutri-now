"use client"

import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import PatientTabBar from "../components/patient-tab-bar"

interface Nutritionist {
  id: string
  name: string
  specialty: string
  image: string
  availability: string[]
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export default function ScheduleAppointment(): React.JSX.Element {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [appointmentReason, setAppointmentReason] = useState<string>("")

  const nutritionists: Nutritionist[] = [
    {
      id: "1",
      name: "Dr. Emily Johnson",
      specialty: "Gerenciamento de Peso",
      image: "/placeholder.svg?height=60&width=60",
      availability: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
    },
    {
      id: "2",
      name: "Dr. Michael Smith",
      specialty: "Nutrição Esportiva",
      image: "/placeholder.svg?height=60&width=60",
      availability: ["Terça-feira", "Quinta-feira", "Sábado"],
    },
    {
      id: "3",
      name: "Dr. Sarah Williams",
      specialty: "Gerenciamento de Diabetes",
      image: "/placeholder.svg?height=60&width=60",
      availability: ["Segunda-feira", "Terça-feira", "Quinta-feira"],
    },
  ]

  const dates = [
    "Seg, Mar 15",
    "Ter, Mar 16",
    "Qua, Mar 17",
    "Qui, Mar 18",
    "Sex, Mar 19",
    "Sáb, Mar 20",
    "Dom, Mar 21",
];
  const timeSlots: TimeSlot[] = [
    { id: "1", time: "09:00", available: true },
    { id: "2", time: "10:00", available: true },
    { id: "3", time: "11:00", available: false },
    { id: "4", time: "13:00", available: true },
    { id: "5", time: "14:00", available: true },
    { id: "6", time: "15:00", available: false },
    { id: "7", time: "16:00", available: true },
  ];

  const handleScheduleAppointment = (): void => {
    if (!selectedDate || !selectedNutritionist || !selectedTimeSlot) {
      Alert.alert("Informações Faltando", "Por favor, selecione uma data, um nutricionista e um horário.");
      return;
    }

    // enviar dados para o backend
    Alert.alert(
      "Consulta Agendada",
      `Sua consulta com ${selectedNutritionist.name} em ${selectedDate} às ${selectedTimeSlot} foi agendada.`,
      [
        {
          text: "OK",
          onPress: () => router.push("/patient/dashboard"),
        },
      ],
    );
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Agendar Consulta",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione a Data</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateButtonText, selectedDate === date && styles.selectedDateButtonText]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o nutricionista</Text>
          {nutritionists.map((nutritionist) => (
            <TouchableOpacity
              key={nutritionist.id}
              style={[
                styles.nutritionistCard,
                selectedNutritionist?.id === nutritionist.id && styles.selectedNutritionistCard,
              ]}
              onPress={() => setSelectedNutritionist(nutritionist)}
            >
              <Image source={{ uri: nutritionist.image }} style={styles.nutritionistImage} />
              <View style={styles.nutritionistInfo}>
                <Text style={styles.nutritionistName}>{nutritionist.name}</Text>
                <Text style={styles.nutritionistSpecialty}>{nutritionist.specialty}</Text>
                <View style={styles.availabilityContainer}>
                  <Text style={styles.availabilityLabel}>Disponível: </Text>
                  <Text style={styles.availabilityDays}>{nutritionist.availability.join(", ")}</Text>
                </View>
              </View>
              {selectedNutritionist?.id === nutritionist.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.selectedIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Horário</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.unavailableTimeSlot,
                  selectedTimeSlot === slot.time && styles.selectedTimeSlot,
                ]}
                onPress={() => slot.available && setSelectedTimeSlot(slot.time)}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    !slot.available && styles.unavailableTimeSlotText,
                    selectedTimeSlot === slot.time && styles.selectedTimeSlotText,
                  ]}
                >
                  {slot.time}
                </Text>
                {!slot.available && <Text style={styles.unavailableText}>Indisponível</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivo da Consulta</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Descreva brevemente o motivo da sua consulta"
            value={appointmentReason}
            onChangeText={setAppointmentReason}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Resumo da Consulta</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Data:</Text>
            <Text style={styles.summaryValue}>{selectedDate || "Não selecionado"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>nutricionista:</Text>
            <Text style={styles.summaryValue}>{selectedNutritionist?.name || "Não selecionado"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horário:</Text>
            <Text style={styles.summaryValue}>{selectedTimeSlot || "Não selecionado"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleAppointment}>
          <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
        </TouchableOpacity>
      </ScrollView>

      <PatientTabBar activeTab="consultas" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  datesContainer: {
    marginLeft: -5,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedDateButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedDateButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  nutritionistCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedNutritionistCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8f0",
  },
  nutritionistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  nutritionistInfo: {
    flex: 1,
  },
  nutritionistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  nutritionistSpecialty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  availabilityLabel: {
    fontSize: 12,
    color: "#888",
  },
  availabilityDays: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  selectedIcon: {
    marginLeft: 10,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlot: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unavailableTimeSlot: {
    backgroundColor: "#f5f5f5",
    borderColor: "#eee",
  },
  selectedTimeSlot: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  unavailableTimeSlotText: {
    color: "#aaa",
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "600",
  },
  unavailableText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  reasonInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 100,
    textAlignVertical: "top",
  },
  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summarySectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  scheduleButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
})

