"use client"

import React, { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import PatientTabBar from "../components/patient-tab-bar"

interface ProgressData {
  date: string
  value: number
}

interface ProgressMetric {
  id: string
  name: string
  unit: string
  data: ProgressData[]
  goal?: number
  color: string
}

export default function ProgressScreen(): React.JSX.Element {
  const router = useRouter()
  const [activeMetric, setActiveMetric] = useState<string>("weight")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")
  const [newEntryValue, setNewEntryValue] = useState<string>("")

  const progressMetrics: ProgressMetric[] = [
    {
      id: "weight",
      name: "Peso",
      unit: "lbs",
      color: "#4CAF50",
      goal: 150,
      data: [
        { date: "1 Jan", value: 170 },
        { date: "8 Jan", value: 168 },
        { date: "15 Jan", value: 167 },
        { date: "22 Jan", value: 165 },
        { date: "29 Jan", value: 164 },
        { date: "5 Fev", value: 163 },
        { date: "12 Fev", value: 162 },
        { date: "19 Fev", value: 160 },
        { date: "26 Fev", value: 159 },
        { date: "5 Mar", value: 158 },
        { date: "12 Mar", value: 157 },
      ],
    },
    {
      id: "bmi",
      name: "IMC",
      unit: "",
      color: "#FF9800",
      goal: 24,
      data: [
        { date: "1 Jan", value: 29.2 },
        { date: "15 Jan", value: 28.8 },
        { date: "1 Fev", value: 28.1 },
        { date: "15 Fev", value: 27.5 },
        { date: "1 Mar", value: 27.0 },
        { date: "15 Mar", value: 26.5 },
      ],
    },
    {
      id: "waist",
      name: "Cintura",
      unit: "in",
      color: "#2196F3",
      goal: 32,
      data: [
        { date: "1 Jan", value: 38 },
        { date: "15 Jan", value: 37.5 },
        { date: "1 Fev", value: 36.8 },
        { date: "15 Fev", value: 36 },
        { date: "1 Mar", value: 35.2 },
        { date: "15 Mar", value: 34.5 },
      ],
    },
    {
      id: "bodyFat",
      name: "Gordura Corporal",
      unit: "%",
      color: "#9C27B0",
      goal: 20,
      data: [
        { date: "1 Jan", value: 28 },
        { date: "15 Jan", value: 27.5 },
        { date: "1 Fev", value: 26.8 },
        { date: "15 Fev", value: 26 },
        { date: "1 Mar", value: 25.2 },
        { date: "15 Mar", value: 24.5 },
      ],
    },
    {
      id: "water",
      name: "Ingestão de Água",
      unit: "oz",
      color: "#03A9F4",
      goal: 64,
      data: [
        { date: "6 Mar", value: 48 },
        { date: "7 Mar", value: 56 },
        { date: "8 Mar", value: 40 },
        { date: "9 Mar", value: 64 },
        { date: "10 Mar", value: 56 },
        { date: "11 Mar", value: 48 },
        { date: "12 Mar", value: 60 },
      ],
    },
  ]

  const currentMetric = progressMetrics.find((metric) => metric.id === activeMetric) || progressMetrics[0]

  const getFilteredData = (): ProgressData[] => {
    const now = new Date()
    const filteredData = [...currentMetric.data]

    if (timeRange === "week") {
      return filteredData.slice(-7)
    } else if (timeRange === "month") {
      return filteredData.slice(-30)
    }

    return filteredData
  }

  const filteredData = getFilteredData()

  const values = filteredData.map((item) => item.value)
  const minValue = Math.min(...values) * 0.95
  const maxValue = Math.max(...values) * 1.05
  const valueRange = maxValue - minValue

  const screenWidth = Dimensions.get("window").width
  const chartWidth = screenWidth - 40
  const chartHeight = 200

  const latestValue = filteredData.length > 0 ? filteredData[filteredData.length - 1].value : 0
  const previousValue = filteredData.length > 1 ? filteredData[filteredData.length - 2].value : latestValue
  const change = latestValue - previousValue
  const percentChange = previousValue !== 0 ? (change / previousValue) * 100 : 0

  const goalProgress = currentMetric.goal
    ? ((currentMetric.goal - latestValue) / (currentMetric.goal - values[0])) * 100
    : 0

  const handleAddEntry = (): void => {
    if (!newEntryValue.trim()) {
      Alert.alert("Erro", "Por favor, insira um valor")
      return
    }

    const numValue = Number.parseFloat(newEntryValue)
    if (isNaN(numValue)) {
      Alert.alert("Erro", "Por favor, insira um número válido")
      return
    }

    Alert.alert("Entrada Adicionada", `Nova entrada de ${currentMetric.name}: ${numValue} ${currentMetric.unit}`, [
      {
        text: "OK",
        onPress: () => setNewEntryValue(""),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Acompanhamento de Progresso",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.metricsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {progressMetrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={[
                  styles.metricButton,
                  activeMetric === metric.id && styles.activeMetricButton,
                  { borderColor: metric.color },
                ]}
                onPress={() => setActiveMetric(metric.id)}
              >
                <Text
                  style={[
                    styles.metricButtonText,
                    activeMetric === metric.id && styles.activeMetricButtonText,
                    activeMetric === metric.id && { color: metric.color },
                  ]}
                >
                  {metric.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.timeRangeContainer}>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "week" && styles.activeTimeRangeButton]}
            onPress={() => setTimeRange("week")}
          >
            <Text style={[styles.timeRangeButtonText, timeRange === "week" && styles.activeTimeRangeButtonText]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "month" && styles.activeTimeRangeButton]}
            onPress={() => setTimeRange("month")}
          >
            <Text style={[styles.timeRangeButtonText, timeRange === "month" && styles.activeTimeRangeButtonText]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "year" && styles.activeTimeRangeButton]}
            onPress={() => setTimeRange("year")}
          >
            <Text style={[styles.timeRangeButtonText, timeRange === "year" && styles.activeTimeRangeButtonText]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>{currentMetric.name}</Text>
            <View style={[styles.currentValueBadge, { backgroundColor: currentMetric.color }]}>
              <Text style={styles.currentValueText}>
                {latestValue} {currentMetric.unit}
              </Text>
            </View>
          </View>

          <View style={styles.changeContainer}>
            <Text style={styles.changeLabel}>Change:</Text>
            <Text
              style={[styles.changeValue, change < 0 ? styles.positiveChange : change > 0 ? styles.negativeChange : {}]}
            >
              {change < 0 ? "↓" : change > 0 ? "↑" : ""}
              {Math.abs(change).toFixed(1)} {currentMetric.unit} ({Math.abs(percentChange).toFixed(1)}%)
            </Text>
          </View>

          {currentMetric.goal && (
            <View style={styles.goalContainer}>
              <Text style={styles.goalLabel}>
                Goal: {currentMetric.goal} {currentMetric.unit}
              </Text>
              <View style={styles.goalProgressBar}>
                <View
                  style={[
                    styles.goalProgressFill,
                    { width: `${Math.min(100, Math.max(0, goalProgress))}%`, backgroundColor: currentMetric.color },
                  ]}
                />
              </View>
              <Text style={styles.goalProgressText}>
                {Math.abs(latestValue - currentMetric.goal).toFixed(1)} {currentMetric.unit} to go
              </Text>
            </View>
          )}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{currentMetric.name} History</Text>

          <View style={styles.chartContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxisLabels}>
              <Text style={styles.axisLabel}>{maxValue.toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{(minValue + valueRange * 0.75).toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{(minValue + valueRange * 0.5).toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{(minValue + valueRange * 0.25).toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{minValue.toFixed(1)}</Text>
            </View>

            {/* Chart area */}
            <View style={styles.chart}>
              {/* Horizontal grid lines */}
              <View style={[styles.gridLine, { top: 0 }]} />
              <View style={[styles.gridLine, { top: chartHeight * 0.25 }]} />
              <View style={[styles.gridLine, { top: chartHeight * 0.5 }]} />
              <View style={[styles.gridLine, { top: chartHeight * 0.75 }]} />
              <View style={[styles.gridLine, { top: chartHeight }]} />

              {/* Goal line if applicable */}
              {currentMetric.goal && (
                <View
                  style={[
                    styles.goalLine,
                    {
                      top: chartHeight - ((currentMetric.goal - minValue) / valueRange) * chartHeight,
                      backgroundColor: currentMetric.color,
                    },
                  ]}
                />
              )}

              {/* Data points and lines */}
              {filteredData.map((dataPoint, index) => {
                const x = (index / (filteredData.length - 1)) * chartWidth
                const y = chartHeight - ((dataPoint.value - minValue) / valueRange) * chartHeight

                // Draw line to next point
                const nextPoint = index < filteredData.length - 1 ? filteredData[index + 1] : null
                let lineTo = null

                if (nextPoint) {
                  const nextX = ((index + 1) / (filteredData.length - 1)) * chartWidth
                  const nextY = chartHeight - ((nextPoint.value - minValue) / valueRange) * chartHeight

                  lineTo = (
                    <View
                      style={[
                        styles.chartLine,
                        {
                          left: x,
                          top: y,
                          width: nextX - x,
                          height: 2,
                          transform: [
                            { translateY: -1 },
                            { rotate: `${Math.atan2(nextY - y, nextX - x) * (180 / Math.PI)}deg` },
                            { translateY: 1 },
                          ],
                          backgroundColor: currentMetric.color,
                        },
                      ]}
                    />
                  )
                }

                return (
                  <React.Fragment key={index}>
                    {lineTo}
                    <View
                      style={[
                        styles.dataPoint,
                        {
                          left: x - 4, // Center the 8px dot
                          top: y - 4,
                          backgroundColor: currentMetric.color,
                        },
                      ]}
                    />
                    {index % Math.ceil(filteredData.length / 5) === 0 && (
                      <Text
                        style={[
                          styles.xAxisLabel,
                          {
                            left: x - 20,
                            top: chartHeight + 5,
                          },
                        ]}
                      >
                        {dataPoint.date}
                      </Text>
                    )}
                  </React.Fragment>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Recent Entries</Text>

          {filteredData
            .slice()
            .reverse()
            .slice(0, 5)
            .map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>{entry.date}</Text>
                <Text style={styles.historyValue}>
                  {entry.value} {currentMetric.unit}
                </Text>
              </View>
            ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Entries</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addEntryCard}>
          <Text style={styles.addEntryTitle}>Add New Entry</Text>

          <View style={styles.addEntryForm}>
            <View style={styles.addEntryInputContainer}>
              <TextInput
                style={styles.addEntryInput}
                placeholder={`${currentMetric.name.toLowerCase()}`}
                value={newEntryValue}
                onChangeText={setNewEntryValue}
                keyboardType="numeric"
              />
              <Text style={styles.addEntryUnit}>{currentMetric.unit}</Text>
            </View>

            <TouchableOpacity style={styles.addEntryButton} onPress={handleAddEntry}>
              <Text style={styles.addEntryButtonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <PatientTabBar activeTab="progresso" />   
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 80,
  },
  metricsContainer: {
    marginBottom: 15,
  },
  metricButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeMetricButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  metricButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeMetricButtonText: {
    fontWeight: "600",
  },
  timeRangeContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTimeRangeButton: {
    backgroundColor: "#4CAF50",
  },
  timeRangeButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeTimeRangeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  currentValueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  currentValueText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  changeLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  positiveChange: {
    color: "#4CAF50",
  },
  negativeChange: {
    color: "#F44336",
  },
  goalContainer: {
    marginTop: 5,
  },
  goalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 5,
    overflow: "hidden",
  },
  goalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  chartCard: {
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
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: "row",
    height: 250,
    marginBottom: 10,
  },
  yAxisLabels: {
    width: 40,
    height: 200,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: "#999",
  },
  chart: {
    flex: 1,
    height: 200,
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#4CAF50",
    borderStyle: "dashed",
  },
  dataPoint: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  chartLine: {
    position: "absolute",
    height: 2,
    backgroundColor: "#4CAF50",
    zIndex: -1,
  },
  xAxisLabel: {
    position: "absolute",
    fontSize: 10,
    color: "#999",
    width: 40,
    textAlign: "center",
  },
  historyCard: {
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
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  historyDate: {
    fontSize: 14,
    color: "#666",
  },
  historyValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 5,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  addEntryCard: {
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
  addEntryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  addEntryForm: {
    flexDirection: "row",
    alignItems: "center",
  },
  addEntryInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addEntryInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  addEntryUnit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  addEntryButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  addEntryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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

