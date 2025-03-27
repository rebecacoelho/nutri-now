"use client"

import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

interface Patient {
  id: string
  name: string
  image: string
  condition: string
  age: number
  weight: string
  height: string
  goal: string
}

interface FoodItem {
  id: string
  name: string
  amount: string
  calories: string
}

interface MealEditorProps {
  title: string
  defaultTime: string
  onAddFood: (mealType: string) => void
  foods: FoodItem[]
  onRemoveFood: (mealType: string, index: number) => void
  onUpdateFood: (mealType: string, index: number, field: keyof FoodItem, value: string) => void
}

const MealEditor: React.FC<MealEditorProps> = ({
  title,
  defaultTime,
  onAddFood,
  foods,
  onRemoveFood,
  onUpdateFood,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.mealEditorHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TextInput style={styles.timeInput} defaultValue={defaultTime} />
      </View>

      <View style={styles.foodsContainer}>
        <View style={styles.foodHeader}>
          <Text style={[styles.foodHeaderText, { flex: 2 }]}>Food Item</Text>
          <Text style={[styles.foodHeaderText, { flex: 1 }]}>Amount</Text>
          <Text style={[styles.foodHeaderText, { flex: 1 }]}>Calories</Text>
          <Text style={[styles.foodHeaderText, { width: 40 }]}></Text>
        </View>

        {foods.map((food, index) => (
          <View key={food.id} style={styles.foodRow}>
            <TextInput
              style={[styles.foodInput, { flex: 2 }]}
              placeholder="e.g. Oatmeal"
              value={food.name}
              onChangeText={(value) => onUpdateFood(title, index, "name", value)}
            />
            <TextInput
              style={[styles.foodInput, { flex: 1 }]}
              placeholder="e.g. 1 cup"
              value={food.amount}
              onChangeText={(value) => onUpdateFood(title, index, "amount", value)}
            />
            <TextInput
              style={[styles.foodInput, { flex: 1 }]}
              placeholder="e.g. 150"
              keyboardType="number-pad"
              value={food.calories}
              onChangeText={(value) => onUpdateFood(title, index, "calories", value)}
            />
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveFood(title, index)}>
              <Ionicons name="close-circle" size={20} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addFoodButton} onPress={() => onAddFood(title)}>
          <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
          <Text style={styles.addFoodButtonText}>Add Food Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function CreatePatientMealPlan(): React.JSX.Element {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>("Monday")
  const [mealPlanName, setMealPlanName] = useState<string>("")
  const [mealPlanDescription, setMealPlanDescription] = useState<string>("")
  const [calorieGoal, setCalorieGoal] = useState<string>("2000")
  const [proteinGoal, setProteinGoal] = useState<string>("75")
  const [carbsGoal, setCarbsGoal] = useState<string>("220")
  const [fatGoal, setFatGoal] = useState<string>("60")

  // Meal foods state
  const [breakfastFoods, setBreakfastFoods] = useState<FoodItem[]>([{ id: "b1", name: "", amount: "", calories: "" }])
  const [lunchFoods, setLunchFoods] = useState<FoodItem[]>([{ id: "l1", name: "", amount: "", calories: "" }])
  const [dinnerFoods, setDinnerFoods] = useState<FoodItem[]>([{ id: "d1", name: "", amount: "", calories: "" }])
  const [snackFoods, setSnackFoods] = useState<FoodItem[]>([{ id: "s1", name: "", amount: "", calories: "" }])

  // Options
  const [sendNotification, setSendNotification] = useState<boolean>(true)
  const [allowSubstitutions, setAllowSubstitutions] = useState<boolean>(true)
  const [applyToWeek, setApplyToWeek] = useState<boolean>(false)

  // Sample data for patients
  const patients: Patient[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Weight Management",
      age: 32,
      weight: "165 lbs",
      height: "5'6\"",
      goal: "Lose 15 lbs",
    },
    {
      id: "2",
      name: "Michael Brown",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Diabetes Management",
      age: 45,
      weight: "180 lbs",
      height: "5'10\"",
      goal: "Stabilize blood sugar",
    },
    {
      id: "3",
      name: "Emily Davis",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Sports Nutrition",
      age: 28,
      weight: "140 lbs",
      height: "5'5\"",
      goal: "Improve performance",
    },
  ]

  const days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Handle adding food to a meal
  const handleAddFood = (mealType: string): void => {
    switch (mealType) {
      case "Breakfast":
        const newBreakfastId = `b${breakfastFoods.length + 1}`
        setBreakfastFoods([...breakfastFoods, { id: newBreakfastId, name: "", amount: "", calories: "" }])
        break
      case "Lunch":
        const newLunchId = `l${lunchFoods.length + 1}`
        setLunchFoods([...lunchFoods, { id: newLunchId, name: "", amount: "", calories: "" }])
        break
      case "Dinner":
        const newDinnerId = `d${dinnerFoods.length + 1}`
        setDinnerFoods([...dinnerFoods, { id: newDinnerId, name: "", amount: "", calories: "" }])
        break
      case "Snacks":
        const newSnackId = `s${snackFoods.length + 1}`
        setSnackFoods([...snackFoods, { id: newSnackId, name: "", amount: "", calories: "" }])
        break
    }
  }

  // Handle removing food from a meal
  const handleRemoveFood = (mealType: string, index: number): void => {
    switch (mealType) {
      case "Breakfast":
        const newBreakfastFoods = [...breakfastFoods]
        newBreakfastFoods.splice(index, 1)
        setBreakfastFoods(newBreakfastFoods)
        break
      case "Lunch":
        const newLunchFoods = [...lunchFoods]
        newLunchFoods.splice(index, 1)
        setLunchFoods(newLunchFoods)
        break
      case "Dinner":
        const newDinnerFoods = [...dinnerFoods]
        newDinnerFoods.splice(index, 1)
        setDinnerFoods(newDinnerFoods)
        break
      case "Snacks":
        const newSnackFoods = [...snackFoods]
        newSnackFoods.splice(index, 1)
        setSnackFoods(newSnackFoods)
        break
    }
  }

  // Handle updating food item fields
  const handleUpdateFood = (mealType: string, index: number, field: keyof FoodItem, value: string): void => {
    switch (mealType) {
      case "Breakfast":
        const newBreakfastFoods = [...breakfastFoods]
        newBreakfastFoods[index][field] = value
        setBreakfastFoods(newBreakfastFoods)
        break
      case "Lunch":
        const newLunchFoods = [...lunchFoods]
        newLunchFoods[index][field] = value
        setLunchFoods(newLunchFoods)
        break
      case "Dinner":
        const newDinnerFoods = [...dinnerFoods]
        newDinnerFoods[index][field] = value
        setDinnerFoods(newDinnerFoods)
        break
      case "Snacks":
        const newSnackFoods = [...snackFoods]
        newSnackFoods[index][field] = value
        setSnackFoods(newSnackFoods)
        break
    }
  }

  // Handle saving the meal plan
  const handleSaveMealPlan = (): void => {
    if (!selectedPatient) {
      Alert.alert("Missing Information", "Please select a patient.")
      return
    }

    if (!mealPlanName.trim()) {
      Alert.alert("Missing Information", "Please enter a meal plan name.")
      return
    }

    // In a real app, you would save this data to your backend
    Alert.alert("Meal Plan Created", `Meal plan "${mealPlanName}" has been created for ${selectedPatient.name}.`, [
      {
        text: "OK",
        onPress: () => router.push("/nutritionist/dashboard"),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Create Patient Meal Plan",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Plan Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Plan Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Weight Loss Plan"
              value={mealPlanName}
              onChangeText={setMealPlanName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textAreaInput]}
              placeholder="Brief description of the meal plan"
              value={mealPlanDescription}
              onChangeText={setMealPlanDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Patient</Text>
          {patients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={[styles.patientCard, selectedPatient?.id === patient.id && styles.selectedPatientCard]}
              onPress={() => setSelectedPatient(patient)}
            >
              <Image source={{ uri: patient.image }} style={styles.patientImage} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientCondition}>{patient.condition}</Text>
                <View style={styles.patientDetails}>
                  <Text style={styles.patientDetail}>Age: {patient.age}</Text>
                  <Text style={styles.patientDetail}>Weight: {patient.weight}</Text>
                  <Text style={styles.patientDetail}>Height: {patient.height}</Text>
                </View>
                <Text style={styles.patientGoal}>Goal: {patient.goal}</Text>
              </View>
              {selectedPatient?.id === patient.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.selectedIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Goals</Text>
          <View style={styles.nutritionGoalsContainer}>
            <View style={styles.nutritionGoalItem}>
              <Text style={styles.nutritionGoalLabel}>Calories</Text>
              <TextInput
                style={styles.nutritionGoalInput}
                placeholder="e.g. 1800"
                keyboardType="number-pad"
                value={calorieGoal}
                onChangeText={setCalorieGoal}
              />
            </View>
            <View style={styles.nutritionGoalItem}>
              <Text style={styles.nutritionGoalLabel}>Protein (g)</Text>
              <TextInput
                style={styles.nutritionGoalInput}
                placeholder="e.g. 75"
                keyboardType="number-pad"
                value={proteinGoal}
                onChangeText={setProteinGoal}
              />
            </View>
            <View style={styles.nutritionGoalItem}>
              <Text style={styles.nutritionGoalLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.nutritionGoalInput}
                placeholder="e.g. 200"
                keyboardType="number-pad"
                value={carbsGoal}
                onChangeText={setCarbsGoal}
              />
            </View>
            <View style={styles.nutritionGoalItem}>
              <Text style={styles.nutritionGoalLabel}>Fat (g)</Text>
              <TextInput
                style={styles.nutritionGoalInput}
                placeholder="e.g. 60"
                keyboardType="number-pad"
                value={fatGoal}
                onChangeText={setFatGoal}
              />
            </View>
          </View>
        </View>

        <MealEditor
          title="Breakfast"
          defaultTime="7:30 AM"
          onAddFood={handleAddFood}
          foods={breakfastFoods}
          onRemoveFood={handleRemoveFood}
          onUpdateFood={handleUpdateFood}
        />

        <MealEditor
          title="Lunch"
          defaultTime="12:30 PM"
          onAddFood={handleAddFood}
          foods={lunchFoods}
          onRemoveFood={handleRemoveFood}
          onUpdateFood={handleUpdateFood}
        />

        <MealEditor
          title="Dinner"
          defaultTime="7:00 PM"
          onAddFood={handleAddFood}
          foods={dinnerFoods}
          onRemoveFood={handleRemoveFood}
          onUpdateFood={handleUpdateFood}
        />

        <MealEditor
          title="Snacks"
          defaultTime="Various"
          onAddFood={handleAddFood}
          foods={snackFoods}
          onRemoveFood={handleRemoveFood}
          onUpdateFood={handleUpdateFood}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Options</Text>
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Send notification to patient</Text>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={sendNotification}
              onValueChange={setSendNotification}
            />
          </View>
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Allow meal substitutions</Text>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={allowSubstitutions}
              onValueChange={setAllowSubstitutions}
            />
          </View>
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Apply to entire week</Text>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={applyToWeek}
              onValueChange={setApplyToWeek}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveMealPlan}>
            <Text style={styles.saveButtonText}>Save Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionistTabBar activeTab="mealPlans" />
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
    paddingBottom: 100,
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
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: "top",
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedPatientCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8f0",
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  patientCondition: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  patientDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  patientDetail: {
    fontSize: 12,
    color: "#888",
    marginRight: 10,
  },
  patientGoal: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  selectedIcon: {
    marginLeft: 10,
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
  nutritionGoalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionGoalItem: {
    width: "48%",
    marginBottom: 15,
  },
  nutritionGoalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  nutritionGoalInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
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
    borderWidth: 1,
    borderColor: "#ddd",
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
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  foodInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
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
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
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
})

