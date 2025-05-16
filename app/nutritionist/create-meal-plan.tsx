"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { createMealPlan, MealPlanData, Meal, MealItem, getAppointments } from "../../api"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Patient {
  id: string
  name: string
}

interface FoodItem {
  id: string
  name: string
  amount: string
  calories: string
  group: string
}

interface MealEditorProps {
  title: string
  defaultTime: string
  onMealChange: (meal: Meal) => void
}

const MealEditor: React.FC<MealEditorProps> = ({ title, defaultTime, onMealChange }) => {
  const [foods, setFoods] = useState<FoodItem[]>([{ id: "1", name: "", amount: "", calories: "", group: "Outros" }])
  const [time, setTime] = useState(defaultTime)

  const addFood = (): void => {
    const newId = (Number.parseInt(foods[foods.length - 1].id) + 1).toString()
    setFoods([...foods, { id: newId, name: "", amount: "", calories: "", group: "Outros" }])
  }

  const updateMeal = (newFoods: FoodItem[], newTime: string) => {
    const mealItems: MealItem[] = newFoods.map(food => ({
      descricao: `${food.name} - ${food.amount}`,
      kcal: parseInt(food.calories) || 0,
      grupo: food.group,
      substituicoes: []
    }))

    const meal: Meal = {
      horario: newTime,
      nome: title,
      items: mealItems
    }

    onMealChange(meal)
  }

  useEffect(() => {
    updateMeal(foods, time)
  }, [foods, time])

  return (
    <View style={styles.section}>
      <View style={styles.mealEditorHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TextInput 
          style={styles.timeInput} 
          value={time}
          onChangeText={(newTime) => {
            setTime(newTime)
            updateMeal(foods, newTime)
          }}
        />
      </View>

      <View style={styles.foodsContainer}>
        {foods.map((food, index) => (
          <View key={food.id} style={styles.foodRow}>
            <View style={styles.foodInputContainer}>
              <Text style={styles.foodInputLabel}>Alimento</Text>
              <TextInput 
                style={styles.foodInput}
                placeholder="ex: Aveia"
                value={food.name}
                onChangeText={(text) => {
                  const newFoods = [...foods]
                  newFoods[index].name = text
                  setFoods(newFoods)
                }}
              />
            </View>

            <View style={styles.foodInputContainer}>
              <Text style={styles.foodInputLabel}>Quantidade</Text>
              <TextInput 
                style={styles.foodInput}
                placeholder="ex: 1 xícara"
                value={food.amount}
                onChangeText={(text) => {
                  const newFoods = [...foods]
                  newFoods[index].amount = text
                  setFoods(newFoods)
                }}
              />
            </View>

            <View style={styles.foodInputContainer}>
              <Text style={styles.foodInputLabel}>Calorias</Text>
              <TextInput 
                style={styles.foodInput}
                placeholder="ex: 150" 
                keyboardType="number-pad"
                value={food.calories}
                onChangeText={(text) => {
                  const newFoods = [...foods]
                  newFoods[index].calories = text
                  setFoods(newFoods)
                }}
              />
            </View>

            <View style={styles.foodInputContainer}>
              <Text style={styles.foodInputLabel}>Grupo</Text>
              <TextInput 
                style={styles.foodInput}
                placeholder="ex: Carboidratos" 
                value={food.group}
                onChangeText={(text) => {
                  const newFoods = [...foods]
                  newFoods[index].group = text
                  setFoods(newFoods)
                }}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addFoodButton} onPress={addFood}>
          <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
          <Text style={styles.addFoodButtonText}>Adicionar Alimento</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function CreateMealPlan(): React.JSX.Element {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [totalCalories, setTotalCalories] = useState(0)

  useEffect(() => {
    const newTotalCalories = meals.reduce((total, meal) => {
      return total + meal.items.reduce((mealTotal, item) => mealTotal + item.kcal, 0)
    }, 0)
    setTotalCalories(newTotalCalories)
  }, [meals])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAppointments();
        
        const uniquePatients = response.reduce((acc: Patient[], appointment: any) => {
          const patientExists = acc.some(patient => patient.name === appointment.paciente_nome);
          
          if (!patientExists) {
            acc.push({
              id: String(appointment.paciente_id),
              name: appointment.paciente_nome
            });
          }
          
          return acc;
        }, []);

        setPatients(uniquePatients);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    };
    fetchPatients()
  }, [])

  const handleMealChange = (updatedMeal: Meal) => {
    setMeals(currentMeals => {
      const mealIndex = currentMeals.findIndex(meal => meal.nome === updatedMeal.nome)
      if (mealIndex >= 0) {
        const newMeals = [...currentMeals]
        newMeals[mealIndex] = updatedMeal
        return newMeals
      }
      return [...currentMeals, updatedMeal]
    })
  }

  const handleSaveMealPlan = async () => {
    if (!selectedPatient) {
      Alert.alert("Erro", "Por favor, selecione um paciente")
      return
    }

    try {
      setIsLoading(true)
      const nutritionistId = await AsyncStorage.getItem("@nutricionista/userId")

      if (!nutritionistId) {
        Alert.alert("Erro", "ID do nutricionista não encontrado")
        return
      }

      const mealPlanData: MealPlanData = {
        paciente: parseInt(selectedPatient.id),
        id_nutricionista: parseInt(nutritionistId),
        dados_json: {
          refeicoes: meals.map(meal => ({
            ...meal,
            items: meal.items
          }))
        }
      }

      await createMealPlan(mealPlanData)
      Alert.alert("Sucesso", "Plano alimentar criado com sucesso!")
      router.back()
    } catch (error) {
      console.error("Erro ao salvar plano alimentar:", error)
      Alert.alert("Erro", "Não foi possível salvar o plano alimentar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Criar Plano Alimentar",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Paciente</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientsContainer}>
            {patients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={[styles.patientButton, selectedPatient?.id === patient.id && styles.selectedPatientButton]}
                onPress={() => setSelectedPatient(patient)}
              >
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientAvatarText}>{patient.name.charAt(0)}</Text>
                </View>
                <Text style={[styles.patientName, selectedPatient?.id === patient.id && styles.selectedPatientName]}>
                  {patient.name}
                </Text>
              </TouchableOpacity>
            ))}
            {patients.length === 0 && (
              <Text style={styles.noPatientText}>Nenhum paciente encontrado</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total de Calorias</Text>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesText}>{totalCalories} kcal</Text>
          </View>
        </View>

        <MealEditor title="Café da Manhã" defaultTime="07:30" onMealChange={handleMealChange} />
        <MealEditor title="Lanche da Manhã" defaultTime="10:30" onMealChange={handleMealChange} />
        <MealEditor title="Almoço" defaultTime="13:00" onMealChange={handleMealChange} />
        <MealEditor title="Lanche da Tarde" defaultTime="16:00" onMealChange={handleMealChange} />
        <MealEditor title="Jantar" defaultTime="19:00" onMealChange={handleMealChange} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.disabledButton]} 
            onPress={handleSaveMealPlan}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Salvando..." : "Salvar Plano Alimentar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionistTabBar activeTab="planoAlimentar"/>
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
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  patientsContainer: {
    marginLeft: -5,
  },
  patientButton: {
    alignItems: "center",
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPatientButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8f0",
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  patientAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  patientName: {
    fontSize: 14,
    color: "#666",
  },
  selectedPatientName: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  daysContainer: {
    marginLeft: -5,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedDayButton: {
    backgroundColor: "#4CAF50",
  },
  dayButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedDayButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  caloriesContainer: {
    backgroundColor: "#f0f8f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center"
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50"
  },
  mealEditorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  timeInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    width: 100,
    textAlign: "center",
  },
  foodsContainer: {
    marginBottom: 10,
  },
  foodHeader: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  foodHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  foodRow: {
    flexDirection: "column",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  foodInputContainer: {
    marginBottom: 12,
  },
  foodInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  foodInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addFoodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 5,
  },
  addFoodButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: "#999"
  },
  noPatientText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingLeft: 50,
  }
})

