"use client"

import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking, Dimensions, ActivityIndicator } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import PatientTabBar from "../components/patient-tab-bar"
import PatientLayout from "../components/patient-layout"
import { useEffect, useState } from "react"
import { usePatient } from "../contexts/PatientContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { refreshToken, getPatientData, getMealPlan, AppointmentsResponse, getAppointments } from "../../api"

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

interface WeightProjection {
  date: string;
  weight: number;
}

interface ProjectionData {
  labels: string[];
  data: number[];
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

function calculateIdealWeight(height: number, gender: string): number {
  const idealIMC = 22.5;
  const heightInMeters = height / 100;

  return Number((idealIMC * (heightInMeters * heightInMeters)).toFixed(1));
}

function calculateDailyCalories(weight: number, height: number, age: number, gender: string): number {
  // Fórmula de Harris-Benedict
  let bmr;
  if (gender.toLowerCase() === "masculino") {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Fator de atividade moderada (1.55)
  return Math.round(bmr * 1.55);
}

function calculateWeightProjection(currentWeight: number, targetWeight: number): WeightProjection[] {
  const projection: WeightProjection[] = [];
  const today = new Date();
  
  // Perda ou ganho de peso seguro: 0.5kg por semana
  const weeklyWeightChange = 0.5;
  const weightDifference = targetWeight - currentWeight;
  const weeksNeeded = Math.ceil(Math.abs(weightDifference) / weeklyWeightChange);
  
  for (let week = 0; week <= weeksNeeded; week++) {
    const date = new Date(today);
    date.setDate(date.getDate() + week * 7);
    
    let projectedWeight;
    if (weightDifference > 0) {
      // Ganho de peso
      projectedWeight = Number((currentWeight + (weeklyWeightChange * week)).toFixed(1));
      projectedWeight = projectedWeight > targetWeight ? targetWeight : projectedWeight;
    } else {
      // Perda de peso
      projectedWeight = Number((currentWeight - (weeklyWeightChange * week)).toFixed(1));
      projectedWeight = projectedWeight < targetWeight ? targetWeight : projectedWeight;
    }
    
    projection.push({
      date: date.toISOString().split('T')[0],
      weight: projectedWeight
    });
  }
  
  return projection;
}

export default function PatientDashboard(): React.JSX.Element {
  const router = useRouter()
  const { patientData } = usePatient()
  const [mealCompletionState, setMealCompletionState] = useState<MealCompletionState>({})
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)
  const [weightProjection, setWeightProjection] = useState<WeightProjection[]>([])
  const [idealWeight, setIdealWeight] = useState(0)
  const [recommendedCalories, setRecommendedCalories] = useState(0)
  const [weeksToGoal, setWeeksToGoal] = useState(0)
  const [appointments, setAppointments] = useState<AppointmentsResponse[]>([])
  const [isLoadingMealPlan, setIsLoadingMealPlan] = useState(true)

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setIsLoadingMealPlan(true)
        if (patientData?.plano_alimentar) {
          const response = await getMealPlan(patientData.plano_alimentar)
          if (response) {
            setMealPlan(response)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar plano alimentar:', error)
      } finally {
        setIsLoadingMealPlan(false)
      }
    }

    if (patientData) {
      fetchMealPlan()
    }
  }, [patientData?.plano_alimentar])

  useEffect(() => {
    const fetchAppointmentsAndSet = async () => {
      const appointments = await getAppointments();
      setAppointments(appointments);
    };

    fetchAppointmentsAndSet();
  }, [appointments]);

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

  useEffect(() => {
    if (patientData) {
      const birthDate = new Date(patientData.data_nascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      const ideal = calculateIdealWeight(patientData.altura, patientData.genero);
      setIdealWeight(ideal);
      
      const projection = calculateWeightProjection(patientData.peso, ideal);
      setWeightProjection(projection);
      setWeeksToGoal(projection.length - 1);
      
      const calories = calculateDailyCalories(patientData.peso, patientData.altura, age, patientData.genero);

      // Déficit calórico de 500kcal para perda de 0.5kg por semana
      setRecommendedCalories(calories - 500);
    }
  }, [patientData]);

  const getProjectionData = (): ProjectionData => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const projectionLabels: string[] = [];
    const projectionData: number[] = [];
    
    const totalPoints = Math.min(8, weightProjection.length);
    const interval = Math.max(1, Math.floor((weightProjection.length - 1) / (totalPoints - 1)));
    
    weightProjection.forEach((point, index) => {
      if (index === 0 || index === weightProjection.length - 1 || index % interval === 0) {
        const date = new Date(point.date);
        const label = `${date.getDate()}/${months[date.getMonth()]}`;
        projectionLabels.push(label);
        projectionData.push(point.weight);
      }
    });

    if (weightProjection.length > 0 && projectionLabels.length < totalPoints) {
      const lastPoint = weightProjection[weightProjection.length - 1];
      const date = new Date(lastPoint.date);
      const label = `${date.getDate()}/${months[date.getMonth()]}`;
      projectionLabels.push(label);
      projectionData.push(lastPoint.weight);
    }

    return { labels: projectionLabels, data: projectionData };
  };

  const projectionResult = weightProjection.length > 0 
    ? getProjectionData() 
    : { labels: [] as string[], data: [] as number[] };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    formatYLabel: (value: string) => `${value}kg`,
    formatXLabel: (value: string) => value,
  };

  const weightData = {
    labels: projectionResult.labels,
    datasets: [
      {
        data: projectionResult.data,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

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
          }}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, {patientData?.nome}</Text>
              <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/patient/profile")}>
                <Ionicons name="person-circle-outline" size={32} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plano de Refeições de Hoje</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {isLoadingMealPlan ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.loadingText}>Carregando refeições...</Text>
                </View>
              ) : mealPlan?.refeicoes && mealPlan.refeicoes.length > 0 ? (
                mealPlan.refeicoes.map((refeicao, index) => (
                  <MealCard
                    key={index}
                    title={refeicao.nome}
                    time={refeicao.horario}
                    calories="420"
                    completed={mealCompletionState[refeicao.nome] || false}
                  />
                ))
              ) : (
                <View style={styles.emptyMealsContainer}>
                  <Text style={styles.emptyMealsText}>Nenhuma refeição encontrada</Text>
                </View>
              )}
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
                <Text style={styles.progressTitle}>Projeção de Peso</Text>
                <TouchableOpacity>
                  <Text style={styles.progressViewAll}>Ver Tudo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.progressChart}>
                <LineChart
                  data={weightData}
                  width={Dimensions.get("window").width - 70}
                  height={180}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 8
                  }}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withDots={true}
                  withShadow={false}
                  yAxisSuffix="kg"
                />
              </View>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>{patientData?.peso} kg</Text>
                  <Text style={styles.progressStatLabel}>Peso Atual</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>{idealWeight} kg</Text>
                  <Text style={styles.progressStatLabel}>Peso Ideal</Text>
                </View>
                <View style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>{weeksToGoal} sem</Text>
                  <Text style={styles.progressStatLabel}>Tempo Estimado</Text>
                </View>
              </View>
              <View style={styles.caloriesRecommendation}>
                <Text style={styles.recommendationText}>
                  Consumo recomendado: {recommendedCalories} kcal/dia
                </Text>
                <Text style={styles.recommendationSubtext}>
                  Para atingir o objetivo em {weeksToGoal} semanas
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <PatientTabBar activeTab="inicio" />
      </SafeAreaView>
    </PatientLayout>
  );
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
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
    alignItems: 'center'
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
  caloriesRecommendation: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f0f8f0",
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  recommendationSubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 10,
  },
  emptyMealsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMealsText: {
    fontSize: 14,
    color: "#999",
  },
})

