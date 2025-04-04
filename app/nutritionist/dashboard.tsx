"use client"

import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

export default function NutritionistDashboard(): React.JSX.Element {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Painel de Controle",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/nutritionist/profile")}>
              <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Dr. Johnson</Text>
            <Text style={styles.date}>Segunda-feira, 13 de Março</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pacientes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Consultas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Mensagens</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultas de Hoje</Text>
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentTime}>
              <Text style={styles.appointmentTimeText}>10:30 AM</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentPatient}>
                <Image source={{ uri: "/placeholder.svg?height=50&width=50" }} style={styles.patientImage} />
                <View>
                  <Text style={styles.patientName}>Sarah Johnson</Text>
                  <Text style={styles.appointmentType}>Controle de Peso</Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.appointmentCard}>
            <View style={styles.appointmentTime}>
              <Text style={styles.appointmentTimeText}>2:00 PM</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentPatient}>
                <Image source={{ uri: "/placeholder.svg?height=50&width=50" }} style={styles.patientImage} />
                <View>
                  <Text style={styles.patientName}>Michael Brown</Text>
                  <Text style={styles.appointmentType}>Controle de Diabetes</Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Ver Todas as Consultas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente dos Pacientes</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} style={styles.activityPatientImage} />
              <View>
                <Text style={styles.activityPatientName}>Sarah Johnson</Text>
                <Text style={styles.activityTime}>2 horas atrás</Text>
              </View>
              <TouchableOpacity style={styles.activityButton}>
                <Text style={styles.activityButtonText}>Ver</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Adesão ao Plano Alimentar</Text>
              <Text style={styles.activityDescription}>Completou 2/3 refeições hoje. Pulou o jantar.</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} style={styles.activityPatientImage} />
              <View>
                <Text style={styles.activityPatientName}>Robert Davis</Text>
                <Text style={styles.activityTime}>Ontem</Text>
              </View>
              <TouchableOpacity style={styles.activityButton}>
                <Text style={styles.activityButtonText}>Ver</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Atualização de Peso</Text>
              <Text style={styles.activityDescription}>Registrou novo peso: 78 kg (-1 kg esta semana)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>Ver Todas as Atividades</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push("/nutritionist/create-meal-plan")}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Criar Plano Alimentar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutritionist/dashboard")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="person-add-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Adicionar Paciente</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutritionist/schedule")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutritionist/reports")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="analytics-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Relatórios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

     <NutritionistTabBar activeTab="inicio"/>
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
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
  },
  appointmentTime: {
    backgroundColor: "#f0f8f0",
    padding: 15,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  appointmentTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  appointmentDetails: {
    flex: 1,
    padding: 15,
  },
  appointmentPatient: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  appointmentType: {
    fontSize: 14,
    color: "#666",
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  appointmentButton: {
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  viewAllButton: {
    alignItems: "center",
    padding: 10,
  },
  viewAllButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityPatientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  activityPatientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
  },
  activityButton: {
    marginLeft: "auto",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  activityButtonText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  activityContent: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    backgroundColor: "#e8f5e9",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center"
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

