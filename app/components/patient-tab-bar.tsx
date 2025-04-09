"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface PatientTabBarProps {
  activeTab: "inicio" | "refeicoes" | "mensagens" | "progresso" | "calorias" | "consultas"
}

export default function PatientTabBar({ activeTab }: PatientTabBarProps): React.JSX.Element {
  const router = useRouter()

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/dashboard")}>
        <Ionicons
          name={activeTab === "inicio" ? "home" : "home-outline"}
          size={24}
          color={activeTab === "inicio" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "inicio" && styles.tabLabelActive]}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/meal-plans")}>
        <Ionicons
          name={activeTab === "refeicoes" ? "restaurant" : "restaurant-outline"}
          size={24}
          color={activeTab === "refeicoes" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "refeicoes" && styles.tabLabelActive]}>Refeições</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/calorie-counter")}>
        <Ionicons
          name={activeTab === "calorias" ? "calculator" : "calculator-outline"}
          size={24}
          color={activeTab === "calorias" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "calorias" && styles.tabLabelActive]}>Calorias</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/schedule-appointment")}>
        <Ionicons
          name={activeTab === "consultas" ? "calendar" : "calendar-outline"}
          size={24}
          color={activeTab === "consultas" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "consultas" && styles.tabLabelActive]}>Consultas</Text>
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
