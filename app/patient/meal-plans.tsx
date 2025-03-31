"use client"

import type React from "react"
import { useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import PatientTabBar from "../components/patient-tab-bar"

interface FoodItem {
  name: string
  amount: string
  calories: number
}

interface MealSectionProps {
  title: string
  time: string
  calories: string
  image: string
  foods: FoodItem[]
}

const MealSection: React.FC<MealSectionProps> = ({ title, time, calories, image, foods }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <View style={styles.mealSection}>
      <TouchableOpacity style={styles.mealHeader} onPress={() => setExpanded(!expanded)}>
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealTime}>{time}</Text>
          <Text style={styles.mealCalories}>{calories} calorias</Text>
        </View>
        <Image source={{ uri: image }} style={styles.mealImage} />
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#4CAF50" style={styles.expandIcon} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.mealDetails}>
          <Text style={styles.mealDetailsTitle}>Alimentos</Text>
          {foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodAmount}>{food.amount}</Text>
              <Text style={styles.foodCalories}>{food.calories} cal</Text>
            </View>
          ))}
          <View style={styles.mealActions}>
            <TouchableOpacity style={styles.mealActionButton}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.mealActionText}>Concluído</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealActionButton}>
              <Ionicons name="swap-horizontal-outline" size={20} color="#4CAF50" />
              <Text style={styles.mealActionText}>Substituir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

export default function PatientMealPlans(): React.JSX.Element {
  const router = useRouter()
  const [activeDay, setActiveDay] = useState<string>("Segunda-feira")

  const days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"]
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Planos de Refeições",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <View style={styles.daysContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, activeDay === day && styles.activeDayButton]}
              onPress={() => setActiveDay(day)}
            >
              <Text style={[styles.dayButtonText, activeDay === day && styles.activeDayButtonText]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.nutritionSummary}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>1.850</Text>
            <Text style={styles.nutritionLabel}>Calorias</Text>
          </View>
          <View style={styles.nutritionDivider} />
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>75g</Text>
            <Text style={styles.nutritionLabel}>Proteínas</Text>
          </View>
          <View style={styles.nutritionDivider} />
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>60g</Text>
            <Text style={styles.nutritionLabel}>Gorduras</Text>
          </View>
          <View style={styles.nutritionDivider} />
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>220g</Text>
            <Text style={styles.nutritionLabel}>Carboidratos</Text>
          </View>
        </View>

        <MealSection
          title="Café da Manhã"
          time="7:30 AM"
          calories="420"
          image="/placeholder.svg?height=150&width=150"
          foods={[
            { name: "Aveia com Frutas", amount: "1 xícara", calories: 250 },
            { name: "Iogurte Grego", amount: "1/2 xícara", calories: 100 },
            { name: "Mel", amount: "1 colher de sopa", calories: 70 },
          ]}
        />

        <MealSection
          title="Almoço"
          time="12:30 PM"
          calories="580"
          image="/placeholder.svg?height=150&width=150"
          foods={[
            { name: "Salada de Frango Grelhado", amount: "1 tigela", calories: 350 },
            { name: "Pão Integral", amount: "1 fatia", calories: 120 },
            { name: "Molho de Azeite", amount: "1 colher de sopa", calories: 110 },
          ]}
        />

        <MealSection
          title="Jantar"
          time="7:00 PM"
          calories="650"
          image="/placeholder.svg?height=150&width=150"
          foods={[
            { name: "Salmão Assado", amount: "5 oz", calories: 300 },
            { name: "Arroz Integral", amount: "1 xícara", calories: 200 },
            { name: "Legumes Cozidos", amount: "1 xícara", calories: 100 },
            { name: "Molho de Manteiga com Limão", amount: "1 colher de sopa", calories: 50 },
          ]}
        />

        <MealSection
          title="Lanches"
          time="Diversos"
          calories="200"
          image="/placeholder.svg?height=150&width=150"
          foods={[
            { name: "Maçã", amount: "1 média", calories: 80 },
            { name: "Amêndoas", amount: "1 oz", calories: 120 },
          ]}
        />
      </ScrollView>

      <PatientTabBar activeTab="refeicoes" /> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  daysContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeDayButton: {
    backgroundColor: "#4CAF50",
  },
  dayButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeDayButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  nutritionSummary: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nutritionItem: {
    flex: 1,
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nutritionLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  nutritionDivider: {
    width: 1,
    backgroundColor: "#eee",
    marginHorizontal: 10,
  },
  mealSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  mealHeader: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  mealTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  expandIcon: {
    marginLeft: "auto",
  },
  mealDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  mealDetailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  foodName: {
    flex: 2,
    fontSize: 14,
    color: "#333",
  },
  foodAmount: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  foodCalories: {
    flex: 1,
    fontSize: 14,
    color: "#4CAF50",
    textAlign: "right",
  },
  mealActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  mealActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8f0",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  mealActionText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
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

