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
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Calendar, LocaleConfig } from 'react-native-calendars'
import PatientTabBar from "../components/patient-tab-bar"
import { getAllNutritionists, makeAppointment } from "../../api"

interface Nutritionist {
  id: number;
  nome: string;
  email: string;
  horarios_disponiveis: Record<string, any>;
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export default function ScheduleAppointment(): React.JSX.Element {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedFormattedDate, setSelectedFormattedDate] = useState<string>("")
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([])
  const [sortedNutritionists, setSortedNutritionists] = useState<Nutritionist[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({})
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

  const nutritionistsPerPage = 3;
  const totalPages = Math.ceil(sortedNutritionists.length / nutritionistsPerPage);
  
  const currentNutritionists = sortedNutritionists.slice(
    currentPage * nutritionistsPerPage, 
    (currentPage + 1) * nutritionistsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const defaultTimeSlots: TimeSlot[] = [
    { id: "1", time: "09:00", available: true },
    { id: "2", time: "10:00", available: true },
    { id: "3", time: "11:00", available: true },
    { id: "4", time: "13:00", available: true },
    { id: "5", time: "14:00", available: true },
    { id: "6", time: "15:00", available: true },
    { id: "7", time: "16:00", available: true },
    { id: "8", time: "17:00", available: true },
  ];

  LocaleConfig.locales['pt-br'] = {
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
  };

  LocaleConfig.defaultLocale = 'pt-br';

  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString + 'T12:00:00');
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const generateMarkedDates = () => {
      const today = new Date();
      const markedDatesObj: Record<string, any> = {};
      
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        const dayOfWeek = date.getDay();
        const dateString = date.toISOString().split('T')[0]
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          markedDatesObj[dateString] = { disabled: true, disableTouchEvent: true };
        } else {
          markedDatesObj[dateString] = { 
            disabled: false,
            ...(dateString === selectedDate ? {
              selected: true,
              selectedColor: '#4CAF50'
            } : {})
          };
        }
      }
      
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      markedDatesObj.minDate = today.toISOString().split('T')[0];
      
      setMarkedDates(markedDatesObj);
    };
    
    generateMarkedDates();
  }, [selectedDate]);

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        setLoading(true);
        const data = await getAllNutritionists();
        setNutritionists(data);
        
        const sorted = [...data].sort((a, b) => {
          const aHasSlots = Array.isArray(a.horarios_disponiveis) && a.horarios_disponiveis.length > 0;
          const bHasSlots = Array.isArray(b.horarios_disponiveis) && b.horarios_disponiveis.length > 0;
          
          if (aHasSlots && !bHasSlots) return -1;
          if (!aHasSlots && bHasSlots) return 1;
          return 0;
        });
        
        setSortedNutritionists(sorted);
      } catch (error) {
        console.error("Erro ao buscar nutricionistas:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de nutricionistas.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNutritionists();
  }, []);

  useEffect(() => {
    if (selectedNutritionist) {
      setSelectedTimeSlot("");
      
      if (Array.isArray(selectedNutritionist.horarios_disponiveis) && 
          selectedNutritionist.horarios_disponiveis.length > 0) {
        
        const slots = selectedNutritionist.horarios_disponiveis.map((time, index) => ({
          id: String(index + 1),
          time,
          available: true
        }));
        
        setAvailableTimeSlots(slots);
      } else {
        setAvailableTimeSlots(defaultTimeSlots.map(slot => ({...slot, available: false})));
      }
    } else {
      setAvailableTimeSlots(defaultTimeSlots);
    }
  }, [selectedNutritionist]);

  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setSelectedFormattedDate(formatDisplayDate(date.dateString));
    
    const updatedMarkedDates = { ...markedDates };
    
    Object.keys(updatedMarkedDates).forEach(key => {
      if (updatedMarkedDates[key] && updatedMarkedDates[key].selected) {
        updatedMarkedDates[key] = {
          ...updatedMarkedDates[key],
          selected: false
        };
      }
    });
    
    updatedMarkedDates[date.dateString] = {
      ...updatedMarkedDates[date.dateString],
      selected: true,
      selectedColor: '#4CAF50'
    };
    
    setMarkedDates(updatedMarkedDates);
  };

  const handleScheduleAppointment = async (): Promise<void> => {
    if (!selectedDate || !selectedNutritionist || !selectedTimeSlot) {
      Alert.alert("Informações Faltando", "Por favor, selecione uma data, um nutricionista e um horário.");
      return;
    }

    try {
      const appointmentDateTime = `${selectedDate}T${selectedTimeSlot}:00-03:00`;
      
      await makeAppointment({
        nutricionista: String(selectedNutritionist.id),
        data_consulta: appointmentDateTime
      });
      
      Alert.alert(
        "Consulta Agendada",
        `Sua consulta com ${selectedNutritionist.nome} em ${selectedFormattedDate} às ${selectedTimeSlot} foi agendada com sucesso.`,
        [
          {
            text: "OK",
            onPress: () => router.push("/patient/dashboard"),
          },
        ],
      );
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      Alert.alert("Erro", "Não foi possível agendar a consulta. Por favor, tente novamente.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Agendar Consulta",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione a Data</Text>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDateSelect}
            minDate={new Date().toISOString().split('T')[0]}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}
            firstDay={0} 
            disableAllTouchEventsForDisabledDays={true}
            theme={{
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#4CAF50',
              todayTextColor: '#4CAF50',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: '#4CAF50',
              selectedDayTextColor: '#ffffff',
              arrowColor: '#4CAF50',
              monthTextColor: '#333333',
              indicatorColor: '#4CAF50',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
          />
          
          {selectedDate && (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateLabel}>Data selecionada:</Text>
              <Text style={styles.selectedDateValue}>{selectedFormattedDate}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Nutricionista</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <>
              {currentNutritionists.map((nutritionist) => (
                <TouchableOpacity
                  key={nutritionist.id}
                  style={[
                    styles.nutritionistCard,
                    selectedNutritionist?.id === nutritionist.id && styles.selectedNutritionistCard,
                  ]}
                  onPress={() => setSelectedNutritionist(nutritionist)}
                >
                  <Image 
                    source={{ uri: "https://ui-avatars.com/api/?name=" + encodeURIComponent(nutritionist.nome) }} 
                    style={styles.nutritionistImage} 
                  />
                  <View style={styles.nutritionistInfo}>
                    <Text style={styles.nutritionistName}>{nutritionist.nome}</Text>
                    <Text style={styles.nutritionistEmail}>{nutritionist.email}</Text>
                    {Array.isArray(nutritionist.horarios_disponiveis) && 
                    nutritionist.horarios_disponiveis.length > 0 ? (
                      <Text style={styles.availabilityInfo}>
                        {nutritionist.horarios_disponiveis.length} horários disponíveis
                      </Text>
                    ) : (
                      <Text style={styles.noAvailabilityInfo}>
                        Sem horários disponíveis
                      </Text>
                    )}
                  </View>
                  {selectedNutritionist?.id === nutritionist.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.selectedIcon} />
                  )}
                </TouchableOpacity>
              ))}
              
              {totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity 
                    style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]} 
                    onPress={prevPage}
                    disabled={currentPage === 0}
                  >
                    <Ionicons name="arrow-back" size={22} color={currentPage === 0 ? "#ccc" : "#4CAF50"} />
                  </TouchableOpacity>
                  
                  <Text style={styles.paginationInfo}>
                    {currentPage + 1} de {totalPages}
                  </Text>
                  
                  <TouchableOpacity 
                    style={[styles.paginationButton, currentPage === totalPages - 1 && styles.disabledButton]} 
                    onPress={nextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    <Ionicons name="arrow-forward" size={22} color={currentPage === totalPages - 1 ? "#ccc" : "#4CAF50"} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Horário</Text>
          {selectedNutritionist ? (
            Array.isArray(selectedNutritionist.horarios_disponiveis) && 
            selectedNutritionist.horarios_disponiveis.length > 0 ? (
              <View style={styles.timeSlotsContainer}>
                {availableTimeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.unavailableTimeSlot,
                      selectedTimeSlot === slot.time && styles.selectedTimeSlot,
                    ]}
                    onPress={() => slot.available && setSelectedTimeSlot(slot.time)}
                    disabled={!slot.available}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        !slot.available && styles.unavailableTimeSlotText,
                        selectedTimeSlot === slot.time && styles.selectedTimeSlotText,
                      ]}
                    >
                      {slot.time}
                    </Text>
                    {!slot.available && <Text style={styles.unavailableText}>Indisponível</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noTimeSlotsContainer}>
                <Text style={styles.noTimeSlotsText}>
                  Este nutricionista não possui horários disponíveis. Por favor, escolha outro nutricionista.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.noTimeSlotsContainer}>
              <Text style={styles.noTimeSlotsText}>
                Selecione um nutricionista para ver os horários disponíveis.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Resumo da Consulta</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Data:</Text>
            <Text style={styles.summaryValue}>{selectedFormattedDate || "Não selecionado"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nutricionista:</Text>
            <Text style={styles.summaryValue}>{selectedNutritionist?.nome || "Não selecionado"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horário:</Text>
            <Text style={styles.summaryValue}>{selectedTimeSlot || "Não selecionado"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleAppointment}>
          <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
        </TouchableOpacity>
      </ScrollView>

      <PatientTabBar activeTab="consultas" />
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
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  selectedDateLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  selectedDateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  nutritionistCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedNutritionistCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8f0",
  },
  nutritionistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  nutritionistInfo: {
    flex: 1,
  },
  nutritionistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  nutritionistEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  availabilityInfo: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  noAvailabilityInfo: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  selectedIcon: {
    marginLeft: 10,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlot: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  unavailableTimeSlot: {
    backgroundColor: "#f5f5f5",
    borderColor: "#eee",
  },
  selectedTimeSlot: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  unavailableTimeSlotText: {
    color: "#aaa",
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "600",
  },
  unavailableText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  reasonInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 100,
    textAlignVertical: "top",
  },
  summarySection: {
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
  summarySectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  scheduleButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noTimeSlotsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  noTimeSlotsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  paginationInfo: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
})