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
  const [selectedDate, setSelectedDate] = useState<string>("Mar 15, 2025")
  const [workingHoursEnabled, setWorkingHoursEnabled] = useState<boolean>(true)

  // Sample data for the schedule
  const weekDates: string[] = [
    "Mar 15, 2025",
    "Mar 16, 2025",
    "Mar 17, 2025",
    "Mar 18, 2025",
    "Mar 19, 2025",
    "Mar 20, 2025",
    "Mar 21, 2025",
  ]

  const weekDays: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Generate schedule data
  const scheduleData: DaySchedule[] = weekDates.map((date, index) => {
    // Generate time slots for each day
    const slots: TimeSlot[] = []
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`

      // Randomly determine if a slot is booked
      const isBooked = Math.random() > 0.7
      const patientNames = ["Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson"]

      slots.push({
        id: `${date}-${hour}`,
        time,
        available: weekDays[index] !== "Sunday", // Not available on Sundays
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

  // Find the selected day's schedule
  const selectedDaySchedule = scheduleData.find((day) => day.date === selectedDate)

  // Toggle availability for a time slot
  const toggleAvailability = (slotId: string): void => {
    // In a real app, you would update this in your state or backend
    Alert.alert("Availability Updated", "Your availability has been updated for this time slot.", [{ text: "OK" }])
  }

  // Handle setting working hours
  const handleSetWorkingHours = (): void => {
    // In a real app, you would open a modal to set working hours
    Alert.alert("Set Working Hours", "This would open a modal to set your standard working hours.", [{ text: "OK" }])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "My Schedule",
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
                day.dayOfWeek === "Sunday" && styles.unavailableDateButton,
              ]}
              onPress={() => setSelectedDate(day.date)}
              disabled={day.dayOfWeek === "Sunday"}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  selectedDate === day.date && styles.selectedDayOfWeekText,
                  day.dayOfWeek === "Sunday" && styles.unavailableDayText,
                ]}
              >
                {day.dayOfWeek.substring(0, 3)}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  selectedDate === day.date && styles.selectedDateText,
                  day.dayOfWeek === "Sunday" && styles.unavailableDayText,
                ]}
              >
                {day.date.split(", ")[0].split(" ")[1]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.workingHoursToggle}>
        <Text style={styles.workingHoursText}>Working Hours</Text>
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
                <Text style={styles.availabilityToggleText}>{slot.available ? "Available" : "Unavailable"}</Text>
              </TouchableOpacity>
            )}

            {slot.booked && (
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentAction}>
                  <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.appointmentAction}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.appointmentAction}>
                  <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {selectedDaySchedule?.dayOfWeek === "Sunday" && (
          <View style={styles.dayOffMessage}>
            <Ionicons name="information-circle-outline" size={24} color="#999" />
            <Text style={styles.dayOffText}>You are not working on Sundays</Text>
          </View>
        )}
      </ScrollView>

      <NutritionistTabBar activeTab="schedule" />
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

