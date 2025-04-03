"use client"

import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import PatientTabBar from "../components/patient-tab-bar"
import PatientLayout from "../components/patient-layout"

interface MealCardProps {
  title: string
  time: string
  image: string
  calories: string
  completed: boolean
}

const MealCard: React.FC<MealCardProps> = ({ title, time, image, calories, completed }) => {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealImageContainer}>
        <Image source={{ uri: image }} style={styles.mealImage} />
        {completed && (
          <View style={styles.mealCompletedBadge}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.mealTitle}>{title}</Text>
      <Text style={styles.mealTime}>{time}</Text>
      <Text style={styles.mealCalories}>{calories} cal</Text>
    </View>
  )
}

export default function PatientDashboard(): React.JSX.Element {
  const router = useRouter()

  return (
    <PatientLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Stack.Screen
          options={{
            title: "Home",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerRight: () => (
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/patient/profile")}>
                <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
            ),
          }}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, Sarah</Text>
              <Text style={styles.date}>Segunda-feira, 13 de março</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1.850</Text>
                <Text style={styles.statLabel}>Calorias</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>75g</Text>
                <Text style={styles.statLabel}>Proteínas</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plano de Refeições de Hoje</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealsContainer}>
              <MealCard
                title="Café da Manhã"
                time="7:30 AM"
                image="/placeholder.svg?height=100&width=100"
                calories="420"
                completed={true}
              />
              <MealCard
                title="Almoço"
                time="12:30 PM"
                image="/placeholder.svg?height=100&width=100"
                calories="580"
                completed={false}
              />
              <MealCard
                title="Jantar"
                time="7:00 PM"
                image="/placeholder.svg?height=100&width=100"
                calories="650"
                completed={false}
              />
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Consultas</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                <Text style={styles.appointmentDate}>15 de março de 2025</Text>
                <Text style={styles.appointmentTime}>10:30 AM</Text>
              </View>
              <View style={styles.appointmentContent}>
                <Text style={styles.appointmentTitle}>Consulta de Nutrição</Text>
                <Text style={styles.appointmentDoctor}>Dra. Emily Johnson</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
                  <Text style={styles.appointmentButtonText}>Participar por Vídeo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.appointmentButton, styles.appointmentButtonOutline]}>
                  <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                  <Text style={styles.appointmentButtonTextOutline}>Reagendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acompanhamento de Progresso</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progresso de Peso</Text>
                <TouchableOpacity>
                  <Text style={styles.progressViewAll}>Ver Tudo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.progressChart}>
                <View style={styles.chartPlaceholder}>
                  <Text style={styles.chartPlaceholderText}>Gráfico de Peso</Text>
                </View>
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>165 kg</Text>
                  <Text style={styles.progressStatLabel}>Atual</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>-5 kg</Text>
                  <Text style={styles.progressStatLabel}>Este Mês</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>150 kg</Text>
                  <Text style={styles.progressStatLabel}>Meta</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

      <PatientTabBar activeTab="inicio" /> 
      </SafeAreaView>
    </PatientLayout>
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
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f8f0",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 15,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  mealsContainer: {
    marginLeft: -5,
  },
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  mealImage: {
    width: 110,
    height: 80,
    borderRadius: 8,
  },
  mealCompletedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  mealTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  mealCalories: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 5,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#666",
    marginLeft: "auto",
  },
  appointmentContent: {
    marginBottom: 15,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  appointmentDoctor: {
    fontSize: 14,
    color: "#666",
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  appointmentButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginRight: 0,
  },
  appointmentButtonText: {
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 5,
  },
  appointmentButtonTextOutline: {
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 5,
  },
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressViewAll: {
    fontSize: 14,
    color: "#4CAF50",
  },
  progressChart: {
    marginBottom: 15,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: "#f0f8f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chartPlaceholderText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStat: {
    alignItems: "center",
  },
  progressStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressStatLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
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
  tabLabelActive: {
    color: "#4CAF50",
  },
})

