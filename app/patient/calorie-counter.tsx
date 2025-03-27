"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import PatientTabBar from "../components/patient-tab-bar"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
}

interface ConsumedFood extends FoodItem {
  quantity: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  timeAdded: string
}

export default function CalorieCounter(): React.JSX.Element {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [consumedFoods, setConsumedFoods] = useState<ConsumedFood[]>([])
  const [totalCalories, setTotalCalories] = useState<number>(0)
  const [totalProtein, setTotalProtein] = useState<number>(0)
  const [totalCarbs, setTotalCarbs] = useState<number>(0)
  const [totalFat, setTotalFat] = useState<number>(0)
  const [calorieGoal] = useState<number>(2000)
  const [activeTab, setActiveTab] = useState<"log" | "search">("log")

  const foodDatabase: FoodItem[] = [
    {
      id: "1",
      name: "Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      serving: "1 medium (182g)",
    },
    {
      id: "2",
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving: "100g",
    },
    {
      id: "3",
      name: "Brown Rice",
      calories: 215,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      serving: "1 cup cooked (195g)",
    },
    {
      id: "4",
      name: "Salmon",
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 13,
      serving: "100g",
    },
    {
      id: "5",
      name: "Broccoli",
      calories: 55,
      protein: 3.7,
      carbs: 11.2,
      fat: 0.6,
      serving: "1 cup (91g)",
    },
    {
      id: "6",
      name: "Greek Yogurt",
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.4,
      serving: "170g",
    },
    {
      id: "7",
      name: "Banana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      serving: "1 medium (118g)",
    },
    {
      id: "8",
      name: "Egg",
      calories: 72,
      protein: 6.3,
      carbs: 0.4,
      fat: 5,
      serving: "1 large (50g)",
    },
  ]

  useEffect(() => {
    let calories = 0
    let protein = 0
    let carbs = 0
    let fat = 0

    consumedFoods.forEach((food) => {
      calories += food.calories * food.quantity
      protein += food.protein * food.quantity
      carbs += food.carbs * food.quantity
      fat += food.fat * food.quantity
    })

    setTotalCalories(calories)
    setTotalProtein(protein)
    setTotalCarbs(carbs)
    setTotalFat(fat)
  }, [consumedFoods])

  const handleSearch = (query: string): void => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    const results = foodDatabase.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))

    setSearchResults(results)
  }

  const handleAddFood = (food: FoodItem, mealType: "breakfast" | "lunch" | "dinner" | "snack"): void => {
    const now = new Date()
    const timeAdded = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const consumedFood: ConsumedFood = {
      ...food,
      quantity: 1,
      mealType,
      timeAdded,
    }

    setConsumedFoods([...consumedFoods, consumedFood])
    setActiveTab("log")
    setSearchQuery("")
    setSearchResults([])

    Alert.alert("Food Added", `${food.name} added to your ${mealType} log.`)
  }

  const handleRemoveFood = (index: number): void => {
    const newConsumedFoods = [...consumedFoods]
    newConsumedFoods.splice(index, 1)
    setConsumedFoods(newConsumedFoods)
  }

  const renderFoodItem = ({ item }: { item: FoodItem }): React.JSX.Element => (
    <View style={styles.foodItem}>
      <View style={styles.foodItemInfo}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <Text style={styles.foodItemServing}>{item.serving}</Text>
        <View style={styles.foodItemNutrition}>
          <Text style={styles.foodItemCalories}>{item.calories} cal</Text>
          <Text style={styles.foodItemMacro}>P: {item.protein}g</Text>
          <Text style={styles.foodItemMacro}>C: {item.carbs}g</Text>
          <Text style={styles.foodItemMacro}>F: {item.fat}g</Text>
        </View>
      </View>
      <View style={styles.foodItemActions}>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "breakfast")}>
          <Text style={styles.addButtonText}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "lunch")}>
          <Text style={styles.addButtonText}>L</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "dinner")}>
          <Text style={styles.addButtonText}>D</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "snack")}>
          <Text style={styles.addButtonText}>S</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  // Group consumed foods by meal type
  const groupedFoods = {
    breakfast: consumedFoods.filter((food) => food.mealType === "breakfast"),
    lunch: consumedFoods.filter((food) => food.mealType === "lunch"),
    dinner: consumedFoods.filter((food) => food.mealType === "dinner"),
    snack: consumedFoods.filter((food) => food.mealType === "snack"),
  }

  // Calculate calories remaining
  const caloriesRemaining = calorieGoal - totalCalories

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Calorie Counter",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "log" && styles.activeTab]}
          onPress={() => setActiveTab("log")}
        >
          <Text style={[styles.tabText, activeTab === "log" && styles.activeTabText]}>Food Log</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "search" && styles.activeTab]}
          onPress={() => setActiveTab("search")}
        >
          <Text style={[styles.tabText, activeTab === "search" && styles.activeTabText]}>Add Food</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "log" ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.summaryCard}>
            <View style={styles.calorieCircle}>
              <Text style={styles.calorieValue}>{totalCalories}</Text>
              <Text style={styles.calorieLabel}>calories</Text>
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalText}>Goal: {calorieGoal} calories</Text>
              <Text style={[styles.remainingText, caloriesRemaining < 0 ? styles.negativeCalories : {}]}>
                {caloriesRemaining >= 0 ? `${caloriesRemaining} remaining` : `${Math.abs(caloriesRemaining)} over`}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, (totalCalories / calorieGoal) * 100)}%` },
                    caloriesRemaining < 0 ? styles.progressOverage : {},
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.macrosCard}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalProtein.toFixed(1)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalCarbs.toFixed(1)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalFat.toFixed(1)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>

          {/* Breakfast Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>Breakfast</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() => {
                  setActiveTab("search")
                }}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {groupedFoods.breakfast.length === 0 ? (
              <Text style={styles.emptyMealText}>No breakfast foods logged yet</Text>
            ) : (
              groupedFoods.breakfast.map((food, index) => (
                <View key={`breakfast-${index}`} style={styles.loggedFoodItem}>
                  <View style={styles.loggedFoodInfo}>
                    <Text style={styles.loggedFoodName}>{food.name}</Text>
                    <Text style={styles.loggedFoodServing}>
                      {food.serving} × {food.quantity}
                    </Text>
                  </View>
                  <View style={styles.loggedFoodNutrition}>
                    <Text style={styles.loggedFoodCalories}>{food.calories * food.quantity} cal</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFood(consumedFoods.indexOf(food))}
                  >
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Lunch Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>Lunch</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() => {
                  setActiveTab("search")
                }}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {groupedFoods.lunch.length === 0 ? (
              <Text style={styles.emptyMealText}>No lunch foods logged yet</Text>
            ) : (
              groupedFoods.lunch.map((food, index) => (
                <View key={`lunch-${index}`} style={styles.loggedFoodItem}>
                  <View style={styles.loggedFoodInfo}>
                    <Text style={styles.loggedFoodName}>{food.name}</Text>
                    <Text style={styles.loggedFoodServing}>
                      {food.serving} × {food.quantity}
                    </Text>
                  </View>
                  <View style={styles.loggedFoodNutrition}>
                    <Text style={styles.loggedFoodCalories}>{food.calories * food.quantity} cal</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFood(consumedFoods.indexOf(food))}
                  >
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Dinner Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>Dinner</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() => {
                  setActiveTab("search")
                }}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {groupedFoods.dinner.length === 0 ? (
              <Text style={styles.emptyMealText}>No dinner foods logged yet</Text>
            ) : (
              groupedFoods.dinner.map((food, index) => (
                <View key={`dinner-${index}`} style={styles.loggedFoodItem}>
                  <View style={styles.loggedFoodInfo}>
                    <Text style={styles.loggedFoodName}>{food.name}</Text>
                    <Text style={styles.loggedFoodServing}>
                      {food.serving} × {food.quantity}
                    </Text>
                  </View>
                  <View style={styles.loggedFoodNutrition}>
                    <Text style={styles.loggedFoodCalories}>{food.calories * food.quantity} cal</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFood(consumedFoods.indexOf(food))}
                  >
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Snacks Section */}
          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>Snacks</Text>
              <TouchableOpacity
                style={styles.addMealButton}
                onPress={() => {
                  setActiveTab("search")
                }}
              >
                <Ionicons name="add" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {groupedFoods.snack.length === 0 ? (
              <Text style={styles.emptyMealText}>No snacks logged yet</Text>
            ) : (
              groupedFoods.snack.map((food, index) => (
                <View key={`snack-${index}`} style={styles.loggedFoodItem}>
                  <View style={styles.loggedFoodInfo}>
                    <Text style={styles.loggedFoodName}>{food.name}</Text>
                    <Text style={styles.loggedFoodServing}>
                      {food.serving} × {food.quantity}
                    </Text>
                  </View>
                  <View style={styles.loggedFoodNutrition}>
                    <Text style={styles.loggedFoodCalories}>{food.calories * food.quantity} cal</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFood(consumedFoods.indexOf(food))}
                  >
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a food..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {searchQuery.length > 0 && searchResults.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.noResultsText}>No foods found</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.searchResults}
            />
          )}
        </View>
      )}

      <PatientTabBar activeTab="calories" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 80,
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
    flexDirection: "row",
    alignItems: "center",
  },
  calorieCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f8f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  calorieValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  calorieLabel: {
    fontSize: 12,
    color: "#666",
  },
  goalInfo: {
    flex: 1,
  },
  goalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 8,
  },
  negativeCalories: {
    color: "#f44336",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  progressOverage: {
    backgroundColor: "#f44336",
  },
  macrosCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  macroLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  macroDivider: {
    width: 1,
    backgroundColor: "#eee",
    marginHorizontal: 15,
  },
  mealSection: {
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
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addMealButton: {
    padding: 5,
  },
  emptyMealText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    padding: 10,
  },
  loggedFoodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  loggedFoodInfo: {
    flex: 1,
  },
  loggedFoodName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  loggedFoodServing: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  loggedFoodNutrition: {
    marginRight: 10,
  },
  loggedFoodCalories: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  removeButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    padding: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  searchResults: {
    paddingBottom: 80,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  noResultsText: {
    fontSize: 18,
    color: "#999",
    marginTop: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  foodItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  foodItemInfo: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  foodItemServing: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  foodItemNutrition: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodItemCalories: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginRight: 10,
  },
  foodItemMacro: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  foodItemActions: {
    flexDirection: "row",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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

