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

  // Sample data for nutritionists
  const nutritionists: Nutritionist[] = [
    {
      id: "1",
      name: "Dr. Emily Johnson",
      specialty: "Weight Management",
      image: "/placeholder.svg?height=60&width=60",
      availability: ["Monday", "Wednesday", "Friday"],
    },
    {
      id: "2",
      name: "Dr. Michael Smith",
      specialty: "Sports Nutrition",
      image: "/placeholder.svg?height=60&width=60",
      availability: ["Tuesday", "Thursday", "Saturday"],
    },
    {
      id: "3",
      name: "Dr. Sarah Williams",
      specialty: "Diabetes Management",
      image: "/placeholder.svg?height=60&width=60",
      availability: ["Monday", "Tuesday", "Thursday"],
    },
  ]

  // Sample data for dates
  const dates = [
    "Mon, Mar 15",
    "Tue, Mar 16",
    "Wed, Mar 17",
    "Thu, Mar 18",
    "Fri, Mar 19",
    "Sat, Mar 20",
    "Sun, Mar 21",
  ]

  // Sample data for time slots
  const timeSlots: TimeSlot[] = [
    { id: "1", time: "9:00 AM", available: true },
    { id: "2", time: "10:00 AM", available: true },
    { id: "3", time: "11:00 AM", available: false },
    { id: "4", time: "1:00 PM", available: true },
    { id: "5", time: "2:00 PM", available: true },
    { id: "6", time: "3:00 PM", available: false },
    { id: "7", time: "4:00 PM", available: true },
  ]

  const handleScheduleAppointment = (): void => {
    if (!selectedDate || !selectedNutritionist || !selectedTimeSlot) {
      Alert.alert("Missing Information", "Please select a date, nutritionist, and time slot.")
      return
    }

    // In a real app, you would send this data to your backend
    Alert.alert(
      "Appointment Scheduled",
      `Your appointment with ${selectedNutritionist.name} on ${selectedDate} at ${selectedTimeSlot} has been scheduled.`,
      [
        {
          text: "OK",
          onPress: () => router.push("/patient/dashboard"),
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Schedule Appointment",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
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
          <Text style={styles.sectionTitle}>Select Nutritionist</Text>
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
                  <Text style={styles.availabilityLabel}>Available: </Text>
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
          <Text style={styles.sectionTitle}>Select Time</Text>
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
                {!slot.available && <Text style={styles.unavailableText}>Unavailable</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Reason</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Briefly describe the reason for your appointment"
            value={appointmentReason}
            onChangeText={setAppointmentReason}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Appointment Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{selectedDate || "Not selected"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nutritionist:</Text>
            <Text style={styles.summaryValue}>{selectedNutritionist?.name || "Not selected"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{selectedTimeSlot || "Not selected"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleAppointment}>
          <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
        </TouchableOpacity>
      </ScrollView>

      <PatientTabBar activeTab="appointments" />
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

