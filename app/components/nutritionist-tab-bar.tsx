"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface NutritionistTabBarProps {
  activeTab: "inicio" | "pacientes" | "mensagens" | "planoAlimentar" | "agenda" | "relatorios"
}

export default function NutritionistTabBar({ activeTab }: NutritionistTabBarProps): React.JSX.Element {
  const router = useRouter()

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/dashboard")}>
        <Ionicons
          name={activeTab === "inicio" ? "home" : "home-outline"}
          size={24}
          color={activeTab === "inicio" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "inicio" && styles.tabLabelActive]}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/patients")}>
        <Ionicons
          name={activeTab === "pacientes" ? "people" : "people-outline"}
          size={24}
          color={activeTab === "pacientes" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "pacientes" && styles.tabLabelActive]}>Pacientes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/messages")}>
        <Ionicons
          name={activeTab === "mensagens" ? "chatbubbles" : "chatbubbles-outline"}
          size={24}
          color={activeTab === "mensagens" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "mensagens" && styles.tabLabelActive]}>Mensagens</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/reports")}>
        <Ionicons
          name={activeTab === "relatorios" ? "document-text" : "document-text-outline"}
          size={24}
          color={activeTab === "relatorios" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "relatorios" && styles.tabLabelActive]}>Relatórios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/create-meal-plan")}>
        <Ionicons
          name={activeTab === "planoAlimentar" ? "restaurant" : "restaurant-outline"}
          size={24}
          color={activeTab === "planoAlimentar" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "planoAlimentar" && styles.tabLabelActive]}>Novo plano</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/nutritionist/schedule")}>
        <Ionicons
          name={activeTab === "agenda" ? "calendar" : "calendar-outline"}
          size={24}
          color={activeTab === "agenda" ? "#4CAF50" : "#999"}
        />
        <Text style={[styles.tabLabel, activeTab === "agenda" && styles.tabLabelActive]}>Agenda</Text>
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
