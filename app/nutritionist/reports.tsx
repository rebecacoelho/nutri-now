"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { getAppointments } from "../../api"

interface AppointmentStats {
  totalAppointments: number;
  appointmentsByDay: {
    day: string;
    count: number;
  }[];
  recentAppointments: {
    paciente_nome: string;
    data_consulta: string;
  }[];
}

interface PatientStats {
  totalPatients: number;
  patientGrowth: {
    month: string;
    count: number;
  }[];
}

interface BarChartProps {
  data: Array<{ month?: string; day?: string; count: number }>
  barColor?: string
  title: string
  subtitle?: string
}

const BarChart: React.FC<BarChartProps> = ({ data, barColor = "#4CAF50", title, subtitle }) => {
  const maxValue = Math.max(...data.map((item) => item.count))

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        {subtitle && <Text style={styles.chartSubtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.chartContent}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barLabel}>{item.month || item.day}</Text>
            </View>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(item.count / maxValue) * 100}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
              <Text style={styles.barValue}>{item.count}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  )
}

export default function Reports(): React.JSX.Element {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStats>({
    totalAppointments: 0,
    appointmentsByDay: [],
    recentAppointments: []
  })
  const [patientStats, setPatientStats] = useState<PatientStats>({
    totalPatients: 0,
    patientGrowth: []
  })
  const [loading, setLoading] = useState(true)

  const getPatientGrowthData = (appointments: any[]) => {
    const now = new Date()
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    
    const getUniquePatients = (startDate: Date, endDate: Date) => {
      const uniquePatients = new Set(
        appointments
          .filter(app => {
            const appDate = new Date(app.data_consulta)
            return appDate >= startDate && appDate <= endDate
          })
          .map(app => app.paciente_nome)
      )
      return uniquePatients.size
    }

    if (timeRange === "week") {
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const startOfDay = new Date(date.setHours(0, 0, 0, 0))
        const endOfDay = new Date(date.setHours(23, 59, 59, 999))
        days.push({
          month: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          count: getUniquePatients(startOfDay, endOfDay)
        })
      }
      return days
    } else if (timeRange === "month") {
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(now.getMonth() - i)
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        months.push({
          month: monthNames[startOfMonth.getMonth()],
          count: getUniquePatients(startOfMonth, endOfMonth)
        })
      }
      return months
    } else if (timeRange === "quarter") {
      const quarters = []
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(now.getMonth() - (i * 3))
        const startOfQuarter = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1)
        const endOfQuarter = new Date(startOfQuarter.getFullYear(), startOfQuarter.getMonth() + 3, 0)
        quarters.push({
          month: `${monthNames[startOfQuarter.getMonth()]}-${monthNames[endOfQuarter.getMonth()]}`,
          count: getUniquePatients(startOfQuarter, endOfQuarter)
        })
      }
      return quarters
    } else {
      const year = []
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(now.getMonth() - (i * 3))
        const startOfQuarter = new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1)
        const endOfQuarter = new Date(startOfQuarter.getFullYear(), startOfQuarter.getMonth() + 3, 0)
        year.push({
          month: `${monthNames[startOfQuarter.getMonth()]}-${monthNames[endOfQuarter.getMonth()]}`,
          count: getUniquePatients(startOfQuarter, endOfQuarter)
        })
      }
      return year
    }
  }

  const processAppointmentData = (appointments: any[]) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const appointmentsByDay = days.map(day => ({ day, count: 0 }))
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.data_consulta)
      const dayIndex = date.getDay()
      appointmentsByDay[dayIndex].count++
    })

    const recentAppointments = appointments
      .sort((a, b) => new Date(b.data_consulta).getTime() - new Date(a.data_consulta).getTime())
      .slice(0, 3)

    return {
      totalAppointments: appointments.length,
      appointmentsByDay,
      recentAppointments
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const appointments = await getAppointments()

      const stats = processAppointmentData(appointments)
      setAppointmentStats(stats)

      const growth = getPatientGrowthData(appointments)
      setPatientStats({
        totalPatients: new Set(appointments.map((app: any) => app.paciente_nome)).size,
        patientGrowth: growth
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [timeRange])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Carregando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Relatórios",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <View style={styles.timeRangeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "week" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("week")}
          >
            <Text style={[styles.timeRangeText, timeRange === "week" && styles.timeRangeTextActive]}>Esta Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "month" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("month")}
          >
            <Text style={[styles.timeRangeText, timeRange === "month" && styles.timeRangeTextActive]}>Este Mês</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "quarter" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("quarter")}
          >
            <Text style={[styles.timeRangeText, timeRange === "quarter" && styles.timeRangeTextActive]}>Este Trimestre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "year" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("year")}
          >
            <Text style={[styles.timeRangeText, timeRange === "year" && styles.timeRangeTextActive]}>Este Ano</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsContainer}>
          <StatCard 
            title="Total de Pacientes" 
            value={patientStats.totalPatients.toString()} 
            icon="people" 
            color="#4CAF50" 
          />
          <StatCard 
            title="Consultas" 
            value={appointmentStats.totalAppointments.toString()} 
            icon="calendar" 
            color="#2196F3" 
          />
        </View>

        <BarChart 
          data={patientStats.patientGrowth} 
          title="Crescimento de Pacientes" 
          subtitle="Pacientes únicos por período" 
          barColor="#4CAF50"
        />

        <BarChart 
          data={appointmentStats.appointmentsByDay} 
          title="Consultas Semanais" 
          barColor="#2196F3" 
        />
      </ScrollView>

      <NutritionistTabBar activeTab="relatorios" />
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
  timeRangeSelector: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  timeRangeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  timeRangeButtonActive: {
    backgroundColor: "#4CAF50",
  },
  timeRangeText: {
    fontSize: 14,
    color: "#666",
  },
  timeRangeTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: "48%",
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
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
  },
  chartContainer: {
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
  chartHeader: {
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  chartContent: {
    marginTop: 10,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  barLabelContainer: {
    width: 40,
    alignItems: "center",
  },
  barLabel: {
    fontSize: 12,
    color: "#666",
  },
  barWrapper: {
    flex: 1,
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    height: "100%",
    borderRadius: 10,
  },
  barValue: {
    position: "absolute",
    right: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: "#666",
  },
  section: {
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  patientProgressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  patientAvatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  patientGoal: {
    fontSize: 12,
    color: "#666",
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: 40,
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

