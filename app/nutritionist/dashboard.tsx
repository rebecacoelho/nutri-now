"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { useNutritionist } from "../contexts/NutritionistContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppointmentsResponse, getNutritionistData, refreshToken, getAppointments } from "@/api"

export default function NutritionistDashboard(): React.JSX.Element {
  const router = useRouter()
  const { nutritionistData } = useNutritionist();
  const [appointments, setAppointments] = useState<AppointmentsResponse[]>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{
    type: 'appointment' | 'meal_plan';
    data: any;
    date: Date;
  }>>([]);

  useEffect(() => {
    const fetchAndSetAppointments = async () => {
      const appointments = await getAppointments();
      setAppointments(appointments);

      const activities = appointments.map((appointment: AppointmentsResponse) => ({
        type: 'appointment' as const,
        data: appointment,
        date: new Date(appointment.data_consulta)
      }));

      activities.sort((a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime());
      setRecentActivities(activities);
    };
    fetchAndSetAppointments();
  }, []);

  if (!nutritionistData) {
    const handleMissingData = async () => {
      try {
        await AsyncStorage.removeItem("accessToken");
        const response = await refreshToken();
        
        if (response.access) {
          await AsyncStorage.setItem("accessToken", response.access);
          const nutritionistData = await getNutritionistData();
          if (!nutritionistData) {
            router.replace("/");
          }
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error('Erro ao atualizar token:', error);
        router.replace("/");
      }
    };

    handleMissingData();
    return <View />;
  }

  const today = new Date();
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.data_consulta);
    return appointmentDate.toDateString() === today.toDateString();
  });

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
            <Text style={styles.greeting}>Olá, {nutritionistData?.nome ? nutritionistData.nome.charAt(0).toUpperCase() + nutritionistData.nome.slice(1) : ""}</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pacientes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{appointments.length}</Text>
              <Text style={styles.statLabel}>Consulta(s)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultas de Hoje</Text>
          {todayAppointments.map((appointment) => (
            <View style={styles.appointmentCard} key={appointment.id}>
              <View style={styles.appointmentTime}>
                <Text style={styles.appointmentTimeText}>{new Date(appointment.data_consulta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentPatient}>
                  <View>
                    <Text style={styles.patientName}>{appointment.paciente_nome}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          {todayAppointments.length === 0 && (
            <View style={styles.noAppointments}>
              <Text style={styles.noAppointmentsText}>Você não possui nenhuma consulta agendada para hoje!</Text>
            </View>
          )   }
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades Recentes com Pacientes</Text>
          {recentActivities.slice(0, 3).map((activity, index) => (
            <View key={`activity-${index}`} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityPatientImage}>
                  <Text style={styles.patientInitial}>
                    {activity.type === 'appointment' 
                      ? activity.data.paciente_nome.charAt(0)
                      : activity.data.paciente_nome.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.activityPatientName}>
                    {activity.type === 'appointment' 
                      ? activity.data.paciente_nome
                      : activity.data.paciente_nome}
                  </Text>
                  <Text style={styles.activityTime}>
                    {activity.date.toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {activity.type === 'appointment'
                    ? (activity.data.realizada ? "Consulta Realizada" : "Consulta Agendada")
                    : "Plano Alimentar Criado"}
                </Text>
                <Text style={styles.activityDescription}>
                  {activity.type === 'appointment'
                    ? activity.date.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : `${activity.data.total_calorias} kcal/dia`}
                </Text>
              </View>
            </View>
          ))}

          {recentActivities.length === 0 && (
            <View style={styles.noActivities}>
              <Text style={styles.noActivitiesText}>Nenhuma atividade recente para exibir</Text>
            </View>
          )}
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

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutritionist/add-patient")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="person-add-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Adicionar Paciente</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    marginVertical: 10,
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
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  patientInitial: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
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
  noAppointments: {
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
  },
  noAppointmentsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  noActivities: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 15,
  },
  noActivitiesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})

