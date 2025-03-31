"use client"

import type React from "react"
import { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

const patientProgressData = [
  { month: "Jan", count: 12 },
  { month: "Fev", count: 15 },
  { month: "Mar", count: 18 },
  { month: "Abr", count: 22 },
  { month: "Mai", count: 25 },
  { month: "Jun", count: 28 },
]

const appointmentData = [
  { day: "Seg", count: 5 },
  { day: "Ter", count: 7 },
  { day: "Qua", count: 4 },
  { day: "Qui", count: 8 },
  { day: "Sex", count: 6 },
  { day: "Sáb", count: 3 },
  { day: "Dom", count: 0 },
]

const mealPlanComplianceData = {
  compliant: 68,
  partial: 22,
  nonCompliant: 10,
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
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")

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
          <StatCard title="Total de Pacientes" value="32" icon="people" color="#4CAF50" />
          <StatCard title="Consultas" value="18" icon="calendar" color="#2196F3" />
          <StatCard title="Planos Alimentares" value="24" icon="restaurant" color="#FF9800" />
        </View>

        <BarChart data={patientProgressData} title="Crescimento de Pacientes" subtitle="Número de pacientes ao longo do tempo" />

        <BarChart data={appointmentData} title="Consultas Semanais" barColor="#2196F3" />

        <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Ver Tudo</Text>
          </TouchableOpacity>
        </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="calendar" size={20} color="#2196F3" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nova Consulta</Text>
              <Text style={styles.activityDescription}>Sarah Johnson agendou para 18 de março, às 14:00</Text>
            </View>
            <Text style={styles.activityTime}>Há 2 horas</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="restaurant" size={20} color="#4CAF50" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Plano Alimentar Criado</Text>
              <Text style={styles.activityDescription}>Plano de Perda de Peso criado para Michael Brown</Text>
            </View>
            <Text style={styles.activityTime}>Há 5 horas</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="chatbubbles" size={20} color="#FF9800" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nova Mensagem</Text>
              <Text style={styles.activityDescription}>Emily Davis enviou uma mensagem para você</Text>
            </View>
            <Text style={styles.activityTime}>Há 1 dia</Text>
          </View>
        </View>
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
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activityDescription: {
    fontSize: 12,
    color: "#666",
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
})

