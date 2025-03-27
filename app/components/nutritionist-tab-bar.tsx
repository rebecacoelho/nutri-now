"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface NutritionistTabBarProps {
  activeTab: "home" | "patients" | "messages" | "mealPlans" | "schedule"
}

export default function NutritionistTabBar({ activeTab }: NutritionistTabBarProps): React.JSX.Element {
  const router = useRouter()

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/dashboard")}>
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={24}
          color={activeTab === "home" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "home" && styles.tabLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/patients")}>
        <Ionicons
          name={activeTab === "patients" ? "people" : "people-outline"}
          size={24}
          color={activeTab === "patients" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "patients" && styles.tabLabelActive]}>Patients</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/messages")}>
        <Ionicons
          name={activeTab === "messages" ? "chatbubbles" : "chatbubbles-outline"}
          size={24}
          color={activeTab === "messages" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "messages" && styles.tabLabelActive]}>Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/meal-plans")}>
        <Ionicons
          name={activeTab === "mealPlans" ? "restaurant" : "restaurant-outline"}
          size={24}
          color={activeTab === "mealPlans" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "mealPlans" && styles.tabLabelActive]}>Meal Plans</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutricionist/schedule")}>
        <Ionicons
          name={activeTab === "schedule" ? "calendar" : "calendar-outline"}
          size={24}
          color={activeTab === "schedule" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "schedule" && styles.tabLabelActive]}>Schedule</Text>
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

