"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import PatientTabBar from "../components/patient-tab-bar"
import { usePatient } from "../contexts/PatientContext"
import { getMealPlan } from "@/api"
import { SubstitutionModal } from "../components/substituion-modal"

interface FoodItem {
  name: string
  calories: number
  grupo: string
  substituicoes: Array<{
    descricao: string
    itens: Array<{
      descricao: string
      kcal: number
      grupo: string
    }>
  }>
}

interface MealSectionProps {
  title: string
  time: string
  calories: number
  image: string
  foods: FoodItem[]
  defaultExpanded?: boolean
}


const MealSection: React.FC<MealSectionProps> = ({ title, time, calories, image, foods, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleOpenSubstitutions = (food: FoodItem) => {
    setSelectedFood(food)
    setIsModalVisible(true)
  }

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
            <View 
              key={index} 
              style={[
                styles.foodItem,
                index === foods.length - 1 && styles.lastFoodItem
              ]}
            >
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodCalories}>{food.calories} cal</Text>
              </View>
              {food.substituicoes && food.substituicoes.length > 0 && (
                <TouchableOpacity 
                  style={styles.substitutionButton}
                  onPress={() => handleOpenSubstitutions(food)}
                >
                  <Ionicons name="swap-horizontal" size={20} color="#4CAF50" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {selectedFood && (
        <SubstitutionModal
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false)
            setSelectedFood(null)
          }}
          substitutions={selectedFood.substituicoes}
          foodName={selectedFood.name}
        />
      )}
    </View>
  )
}

interface MealItem {
  descricao: string
  kcal: number
  grupo: string
  substituicoes: Array<{
    descricao: string
    itens: Array<{
      descricao: string
      kcal: number
      grupo: string
    }>
  }>
}

interface Meal {
  nome: string
  horario: string
  itens: MealItem[]
}

interface MealPlanResponse {
  refeicoes: Meal[]
}

interface NutrientTotals {
  calories: number
  proteins: number
  fats: number
  carbs: number
}

export default function PatientMealPlans(): React.JSX.Element {
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)
  const { patientData } = usePatient()
  const [totalNutrients, setTotalNutrients] = useState<NutrientTotals>({
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0
  })


  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await getMealPlan(patientData?.plano_alimentar ?? '')
        setMealPlan(response)
        
        if (response?.refeicoes) {
          const totals = response.refeicoes.reduce((acc: NutrientTotals, meal: Meal) => {
            const mealCalories = meal.itens.reduce((sum: number, item: MealItem) => sum + item.kcal, 0)
            return {
              calories: acc.calories + mealCalories,
              proteins: acc.proteins + 0, // Adicionar quando a API fornecer esses dados
              fats: acc.fats + 0, // Adicionar quando a API fornecer esses dados
              carbs: acc.carbs + 0 // Adicionar quando a API fornecer esses dados
            }
          }, { calories: 0, proteins: 0, fats: 0, carbs: 0 })
          
          setTotalNutrients(totals)
        }
      } catch (error) {
        console.error('Erro ao buscar plano alimentar:', error)
      }
    }
    
    fetchMealPlan()
  }, [patientData])
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Plano Alimentar",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.nutritionSummary}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{totalNutrients.calories}</Text>
            <Text style={styles.nutritionLabel}>Calorias</Text>
          </View>
         {totalNutrients.proteins > 0 && (
           <>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{totalNutrients.proteins}g</Text>
              <Text style={styles.nutritionLabel}>Proteínas</Text>
            </View>
           </>
         )}
         {totalNutrients.fats > 0 && (
           <>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{totalNutrients.fats}g</Text>
              <Text style={styles.nutritionLabel}>Gorduras</Text>
            </View>
          </>
         )}
         {totalNutrients.carbs > 0 && (
          <>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{totalNutrients.carbs}g</Text>
              <Text style={styles.nutritionLabel}>Carboidratos</Text>
            </View>
          </>
         )}
        </View>

        {mealPlan?.refeicoes?.map((meal: Meal, index: number) => {
          const totalCalories = meal.itens.reduce((sum: number, item: MealItem) => sum + item.kcal, 0)
          const foods: FoodItem[] = meal.itens.map(item => ({
            name: item.descricao,
            calories: item.kcal,
            grupo: item.grupo,
            substituicoes: item.substituicoes
          }))

          return (
            <MealSection
              key={index}
              title={meal.nome}
              time={meal.horario}
              calories={totalCalories}
              image="/placeholder.svg?height=150&width=150"
              foods={foods}
              defaultExpanded={index === 0}
            />
          )
        })}
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  nutritionLabel: {
    fontSize: 14,
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
  lastFoodItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  foodInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  substitutionButton: {
    padding: 8,
    marginLeft: 8,
  }
})

