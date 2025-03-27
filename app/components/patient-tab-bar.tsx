"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface PatientTabBarProps {
  activeTab: "home" | "meals" | "messages" | "progress" | "calories" | "appointments"
}

export default function PatientTabBar({ activeTab }: PatientTabBarProps): React.JSX.Element {
  const router = useRouter()

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/dashboard")}>
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={24}
          color={activeTab === "home" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/meal-plans")}>
        <Ionicons
          name={activeTab === "meals" ? "restaurant" : "restaurant-outline"}
          size={24}
          color={activeTab === "meals" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "meals" && styles.tabLabelActive]}>Meals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/messages")}>
        <Ionicons
          name={activeTab === "messages" ? "chatbubbles" : "chatbubbles-outline"}
          size={24}
          color={activeTab === "messages" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "messages" && styles.tabLabelActive]}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/calorie-counter")}>
        <Ionicons
          name={activeTab === "calories" ? "calculator" : "calculator-outline"}
          size={24}
          color={activeTab === "calories" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "calories" && styles.tabLabelActive]}>Calories</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/schedule-appointment")}>
        <Ionicons
          name={activeTab === "appointments" ? "calendar" : "calendar-outline"}
          size={24}
          color={activeTab === "appointments" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "appointments" && styles.tabLabelActive]}>Appointments</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
  tabLabelActive: {
    color: "#4CAF50",
  },
})

