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
  Platform,
  ActivityIndicator
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import DateTimePicker from "@react-native-community/datetimepicker"
import { format } from "date-fns"
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
  date: Date
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const translateToEnglish = async (text: string) => {
    const options = {
      method: 'POST',
      url: 'https://rapid-translate.p.rapidapi.com/TranslateText',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_API_TRANSLATE_KEY,
        'X-RapidAPI-Host': 'rapid-translate.p.rapidapi.com'
      },
      data: {
        from: 'pt-br',
        text,
        to: 'en'
      }
    };
    
    try {
      const response = await axios.request(options);
      return response.data.result;
    } catch (error) {
      console.error(error);
      return text;
    }
  };

  const translateToPortuguese = async (text: string) => {
    const options = {
      method: 'POST',
      url: 'https://rapid-translate.p.rapidapi.com/TranslateText',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.EXPO_PUBLIC_API_TRANSLATE_KEY,
        'X-RapidAPI-Host': 'rapid-translate.p.rapidapi.com'
      },
      data: {
        from: 'en',
        text,
        to: 'pt-br'
      }
    };
    
    try {
      const response = await axios.request(options);
      return response.data.result;
    } catch (error) {
      console.error(error);
      return text;
    }
  };

  const getFoodDetails = async (foodName: string) => {
    try {
      const translatedFoodName = await translateToEnglish(foodName);
      const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${translatedFoodName}`, {
        headers: {
          'X-Api-Key': process.env.EXPO_PUBLIC_API_CALORIE_KEY
        }
      });

      
      if (response.data && response.data.items.length > 0) {
        return response.data.items.map((item: any, index: number) => ({
          id: `api-${Date.now()}-${index}`,
          name: foodName.charAt(0).toUpperCase() + foodName.slice(1).toLowerCase(),
          calories: item.calories,
          protein: item.protein_g || 0,
          carbs: item.carbohydrates_total_g || 0,
          fat: item.fat_total_g || 0,
          serving: item.serving_size_g ? `${item.serving_size_g}g` : "1 porção"
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching food details', error);
      return [];
    }
  };

  useEffect(() => {
    loadConsumedFoods();
  }, []);

  useEffect(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    const filteredFoods = consumedFoods.filter(food => {
      const foodDate = new Date(food.date);
      return foodDate.toDateString() === selectedDate.toDateString();
    });

    filteredFoods.forEach((food) => {
      calories += food.calories * food.quantity;
      protein += food.protein * food.quantity;
      carbs += food.carbs * food.quantity;
      fat += food.fat * food.quantity;
    });

    setTotalCalories(calories);
    setTotalProtein(protein);
    setTotalCarbs(carbs);
    setTotalFat(fat);
  }, [consumedFoods, selectedDate]);

  const loadConsumedFoods = async () => {
    try {
      setIsLoading(true);
      const savedFoods = await AsyncStorage.getItem('consumedFoods');
      if (savedFoods !== null) {
        const parsedFoods = JSON.parse(savedFoods);
        const foodsWithDates = parsedFoods.map((food: any) => ({
          ...food,
          date: new Date(food.date)
        }));
        setConsumedFoods(foodsWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de refeições', error);
      Alert.alert("Erro", "Não foi possível carregar seu histórico de refeições.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveConsumedFoods = async (foodsList: ConsumedFood[]) => {
    try {
      const foodsToSave = JSON.stringify(foodsList);
      await AsyncStorage.setItem('consumedFoods', foodsToSave);
    } catch (error) {
      console.error('Erro ao salvar histórico de refeições', error);
      Alert.alert("Erro", "Não foi possível salvar seu histórico de refeições.");
    }
  };

  const handleSearch = (query: string): void => {
    setSearchQuery(query)
  }
  
  const executeSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    
    try {
      const apiResults = await getFoodDetails(searchQuery)
      setSearchResults(apiResults)
    } catch (error) {
      console.error('Error searching for food:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddFood = async (food: FoodItem, mealType: "breakfast" | "lunch" | "dinner" | "snack"): Promise<void> => {
    try {
      let translatedName = food.name;
      if (food.id.startsWith('api-')) {
        translatedName = await translateToPortuguese(food.name);
      }

      const now = new Date();
      const timeAdded = format(now, "HH:mm");

      const consumedFood: ConsumedFood = {
        ...food,
        name: translatedName,
        quantity: 1,
        mealType,
        timeAdded,
        date: selectedDate
      };

      const updatedFoods = [...consumedFoods, consumedFood];
      setConsumedFoods(updatedFoods);
      await saveConsumedFoods(updatedFoods);
      
      setActiveTab("log");
      setSearchQuery("");
      setSearchResults([]);

      const mealTypeTranslation = 
        mealType === "breakfast" ? "café da manhã" : 
        mealType === "lunch" ? "almoço" : 
        mealType === "dinner" ? "jantar" : "lanche";
        
      Alert.alert("Alimento Adicionado", `${translatedName} adicionado ao seu registro de ${mealTypeTranslation}.`);
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      Alert.alert("Erro", "Não foi possível adicionar este alimento.");
    }
  };

  const handleRemoveFood = async (index: number): Promise<void> => {
    try {
      const newConsumedFoods = [...consumedFoods];
      newConsumedFoods.splice(index, 1);
      setConsumedFoods(newConsumedFoods);
      
      await saveConsumedFoods(newConsumedFoods);
      Alert.alert("Alimento Removido", "Alimento removido do seu registro com sucesso.");
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
      Alert.alert("Erro", "Não foi possível remover este alimento.");
    }
  };

  const handleUpdateFoodQuantity = async (food: ConsumedFood, newQuantity: number): Promise<void> => {
    try {
      if (newQuantity <= 0) {
        const index = consumedFoods.indexOf(food);
        if (index !== -1) {
          handleRemoveFood(index);
        }
        return;
      }

      const updatedFoods = consumedFoods.map(item => {
        if (item === food) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setConsumedFoods(updatedFoods);
      await saveConsumedFoods(updatedFoods);
    } catch (error) {
      console.error('Erro ao atualizar quantidade do alimento:', error);
      Alert.alert("Erro", "Não foi possível atualizar a quantidade deste alimento.");
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const groupedFoods = {
    breakfast: consumedFoods.filter((food) => 
      food.mealType === "breakfast" && 
      new Date(food.date).toDateString() === selectedDate.toDateString()
    ),
    lunch: consumedFoods.filter((food) => 
      food.mealType === "lunch" && 
      new Date(food.date).toDateString() === selectedDate.toDateString()
    ),
    dinner: consumedFoods.filter((food) => 
      food.mealType === "dinner" && 
      new Date(food.date).toDateString() === selectedDate.toDateString()
    ),
    snack: consumedFoods.filter((food) => 
      food.mealType === "snack" && 
      new Date(food.date).toDateString() === selectedDate.toDateString()
    ),
  };

  const caloriesRemaining = calorieGoal - totalCalories;
  const formattedDate = format(selectedDate, "dd/MM/yyyy");

  const renderFoodItem = ({ item }: { item: FoodItem }): React.JSX.Element => (
    <View style={styles.foodItem}>
      <View style={styles.foodItemInfo}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <Text style={styles.foodItemServing}>{item.serving}</Text>
        <View style={styles.foodItemNutrition}>
          <Text style={styles.foodItemCalories}>{item.calories} cal</Text>
          <Text style={styles.foodItemMacro}>P: {item.protein}g</Text>
          <Text style={styles.foodItemMacro}>C: {item.carbs}g</Text>
          <Text style={styles.foodItemMacro}>G: {item.fat}g</Text>
        </View>
      </View>
      <View style={styles.foodItemActions}>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "breakfast")}>
          <Text style={styles.addButtonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "lunch")}>
          <Text style={styles.addButtonText}>A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "dinner")}>
          <Text style={styles.addButtonText}>J</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(item, "snack")}>
          <Text style={styles.addButtonText}>L</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Contador de Calorias",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Carregando seu histórico de refeições...</Text>
        </View>
      ) : (
        <>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.dateButton} onPress={toggleDatePicker}>
              <Ionicons name="calendar" size={20} color="#4CAF50" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                locale="pt-BR"
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            )}
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "log" && styles.activeTab]}
              onPress={() => setActiveTab("log")}
            >
              <Text style={[styles.tabText, activeTab === "log" && styles.activeTabText]}>Registro de Alimentos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "search" && styles.activeTab]}
              onPress={() => setActiveTab("search")}
            >
              <Text style={[styles.tabText, activeTab === "search" && styles.activeTabText]}>Adicionar Alimento</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "log" ? (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.summaryCard}>
                <View style={styles.calorieCircle}>
                  <Text style={styles.calorieValue}>{Math.round(totalCalories)}</Text>
                  <Text style={styles.calorieLabel}>calorias</Text>
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalText}>Meta: {calorieGoal} calorias</Text>
                  <Text style={[styles.remainingText, caloriesRemaining < 0 ? styles.negativeCalories : {}]}>
                    {caloriesRemaining >= 0 ? `${Math.round(caloriesRemaining)} restantes` : `${Math.abs(Math.round(caloriesRemaining))} acima`}
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
                  <Text style={styles.macroLabel}>Proteína</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{totalCarbs.toFixed(1)}g</Text>
                  <Text style={styles.macroLabel}>Carboidratos</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>{totalFat.toFixed(1)}g</Text>
                  <Text style={styles.macroLabel}>Gordura</Text>
                </View>
              </View>

              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>Café da Manhã</Text>
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
                  <Text style={styles.emptyMealText}>Nenhum alimento registrado ainda</Text>
                ) : (
                  groupedFoods.breakfast.map((food, index) => (
                    <View key={`breakfast-${index}`} style={styles.loggedFoodItem}>
                      <View style={styles.loggedFoodInfo}>
                        <Text style={styles.loggedFoodName}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Text>
                        <View style={styles.servingContainer}>
                          <Text style={styles.loggedFoodServing}>
                            {food.serving} ×
                          </Text>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity - 0.5)}
                            >
                              <Ionicons name="remove" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{food.quantity}</Text>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity + 0.5)}
                            >
                              <Ionicons name="add" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={styles.loggedFoodNutrition}>
                        <Text style={styles.loggedFoodCalories}>{(food.calories * food.quantity).toFixed(1)} cal</Text>
                        <Text style={styles.loggedFoodTime}>{food.timeAdded}</Text>
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

              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>Almoço</Text>
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
                  <Text style={styles.emptyMealText}>Nenhum alimento registrado ainda</Text>
                ) : (
                  groupedFoods.lunch.map((food, index) => (
                    <View key={`lunch-${index}`} style={styles.loggedFoodItem}>
                      <View style={styles.loggedFoodInfo}>
                        <Text style={styles.loggedFoodName}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Text>
                        <View style={styles.servingContainer}>
                          <Text style={styles.loggedFoodServing}>
                            {food.serving} ×
                          </Text>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity - 0.5)}
                            >
                              <Ionicons name="remove" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{food.quantity}</Text>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity + 0.5)}
                            >
                              <Ionicons name="add" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={styles.loggedFoodNutrition}>
                        <Text style={styles.loggedFoodCalories}>{(food.calories * food.quantity).toFixed(1)} cal</Text>
                        <Text style={styles.loggedFoodTime}>{food.timeAdded}</Text>
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

              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>Jantar</Text>
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
                  <Text style={styles.emptyMealText}>Nenhum alimento registrado ainda</Text>
                ) : (
                  groupedFoods.dinner.map((food, index) => (
                    <View key={`dinner-${index}`} style={styles.loggedFoodItem}>
                      <View style={styles.loggedFoodInfo}>
                        <Text style={styles.loggedFoodName}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Text>
                        <View style={styles.servingContainer}>
                          <Text style={styles.loggedFoodServing}>
                            {food.serving} ×
                          </Text>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity - 0.5)}
                            >
                              <Ionicons name="remove" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{food.quantity}</Text>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity + 0.5)}
                            >
                              <Ionicons name="add" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={styles.loggedFoodNutrition}>
                        <Text style={styles.loggedFoodCalories}>{(food.calories * food.quantity).toFixed(1)} cal</Text>
                        <Text style={styles.loggedFoodTime}>{food.timeAdded}</Text>
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

              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>Lanches</Text>
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
                  <Text style={styles.emptyMealText}>Nenhum lanche registrado ainda</Text>
                ) : (
                  groupedFoods.snack.map((food, index) => (
                    <View key={`snack-${index}`} style={styles.loggedFoodItem}>
                      <View style={styles.loggedFoodInfo}>
                        <Text style={styles.loggedFoodName}>{food.name.charAt(0).toUpperCase() + food.name.slice(1)}</Text>
                        <View style={styles.servingContainer}>
                          <Text style={styles.loggedFoodServing}>
                            {food.serving} ×
                          </Text>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity - 0.5)}
                            >
                              <Ionicons name="remove" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{food.quantity}</Text>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleUpdateFoodQuantity(food, food.quantity + 0.5)}
                            >
                              <Ionicons name="add" size={14} color="#4CAF50" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={styles.loggedFoodNutrition}>
                        <Text style={styles.loggedFoodCalories}>{(food.calories * food.quantity).toFixed(1)} cal</Text>
                        <Text style={styles.loggedFoodTime}>{food.timeAdded}</Text>
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
                  placeholder="Buscar um alimento..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  onSubmitEditing={executeSearch}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <>
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={executeSearch}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <ActivityIndicator size="small" color="#4CAF50" />
                      ) : (
                        <Ionicons name="search-circle" size={24} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        setSearchQuery("")
                        setSearchResults([])
                      }}
                    >
                      <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {searchQuery.length > 0 && searchResults.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Ionicons name="search-outline" size={48} color="#ddd" />
                  <Text style={styles.noResultsText}>Nenhum alimento encontrado</Text>
                  <Text style={styles.noResultsSubtext}>Tente um termo de busca diferente</Text>
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

          <PatientTabBar activeTab="calorias" />
        </>
      )}
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
  servingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  quantityButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  quantityText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginHorizontal: 3,
    minWidth: 20,
    textAlign: 'center',
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
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8f0',
  },
  dateIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
  },
  loggedFoodTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    textAlign: 'right',
  },
  searchButton: {
    padding: 5,
    marginRight: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#4CAF50",
    marginTop: 10,
  },
})

