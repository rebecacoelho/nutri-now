"use client"

import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import PatientTabBar from "../components/patient-tab-bar"
import PatientLayout from "../components/patient-layout"
import { useEffect, useState } from "react"
import { usePatient } from "../contexts/PatientContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { refreshToken, getPatientData, getMealPlan } from "../../api"

interface MealCardProps {
  title: string
  time: string
  calories: string
  completed: boolean
}

interface MealCompletionState {
  [key: string]: boolean
}

interface MealPlanResponse {
  refeicoes: {
    nome: string
    horario: string
  }[]
}

function getMealImage(title: string) {
  if (title.includes("Almoço")) {
    return require("../../assets/images/lunch.png")
  }

  if (title.includes("Jantar")) {
    return require("../../assets/images/dinner.png")
  }

  if (title.includes("Lanche")) {
    return require("../../assets/images/meal.png")
  }

  if (title.includes("Ceia")) {
    return require("../../assets/images/dinner.png")
  }
  
  return require("../../assets/images/breakfast.png")
}

const MealCard: React.FC<MealCardProps> = ({ title, time, calories, completed }) => {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealImageContainer}>
        <Image source={getMealImage(title)} style={styles.mealImage} />
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
  const { patientData, appointments } = usePatient()
  const [mealCompletionState, setMealCompletionState] = useState<MealCompletionState>({})
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        if (patientData?.plano_alimentar) {
          const response = await getMealPlan(patientData.plano_alimentar);
          setMealPlan(response);
        }
      } catch (error) {
        console.error('Erro ao buscar plano alimentar:', error);
      }
    };

    fetchMealPlan();
  }, [patientData]);

  useEffect(() => {
    const loadMealCompletionState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('mealCompletionState');
        if (savedState) {
          setMealCompletionState(JSON.parse(savedState));
        }

      } catch (error) {
        console.error('Erro ao carregar estado das refeições:', error);
      }
    };

    loadMealCompletionState();
  }, []);

  const upcomingAppointments = appointments.filter(appointment => new Date(appointment.data_consulta) > new Date())

  if (!patientData) {
    const handleMissingData = async () => {
      try {
        await AsyncStorage.removeItem("accessToken");
        const response = await refreshToken();
        
        if (response.access) {
          await AsyncStorage.setItem("accessToken", response.access);
          const patientData = await getPatientData();
          if (!patientData) {
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
              <Text style={styles.greeting}>Olá, {patientData?.nome}</Text>
              <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
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
              {mealPlan?.refeicoes.map((refeicao, index) => (
                <MealCard
                  key={index}
                  title={refeicao.nome}
                  time={refeicao.horario}
                  calories="420"
                  completed={mealCompletionState[refeicao.nome] || false}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas Consultas</Text>

            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <View style={styles.appointmentCard} key={appointment.id}>
                   <View style={styles.appointmentHeader}>
                    <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                    <Text style={styles.appointmentDate}>
                      {new Date(appointment.data_consulta).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.appointmentTime}>{new Date(appointment.data_consulta).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</Text>
                  </View>
                  <View style={styles.appointmentContent}>
                <Text style={styles.appointmentTitle}>Consulta de Nutrição</Text>
                <Text style={styles.appointmentDoctor}>{appointment.nutricionista_nome}</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={[styles.appointmentButton, styles.appointmentButtonFilled]}
                  onPress={() => Linking.openURL(`https://wa.me/+559891931960`)}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
                  <Text style={styles.appointmentButtonTextFilled}>Dúvidas</Text>
                </TouchableOpacity>
              </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={40} color="#ddd" />
                <Text style={styles.emptyStateText}>Nenhuma consulta agendada</Text>
              </View>
            )}
            
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
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
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
  },
  appointmentButtonFilled: {
    backgroundColor: '#25D366',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentButtonTextFilled: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 5,
  },
  appointmentButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#f20505",
    marginRight: 0,
  },
  appointmentButtonText: {
    color: "#f20505",
    fontWeight: "600",
    marginLeft: 5,
  },
  appointmentButtonTextOutline: {
    color: "#f20505",
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
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    marginBottom: 15,
  },
})

