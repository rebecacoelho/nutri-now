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
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [dates, setDates] = useState<string[]>([])
  const [formattedDates, setFormattedDates] = useState<{[key: string]: string}>({})

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "09:00", available: true },
    { id: "2", time: "10:00", available: true },
    { id: "3", time: "11:00", available: true },
    { id: "4", time: "13:00", available: true },
    { id: "5", time: "14:00", available: true },
    { id: "6", time: "15:00", available: true },
    { id: "7", time: "16:00", available: true },
  ];

  useEffect(() => {
    const generateWeekdayDates = () => {
      const datesList: string[] = [];
      const formattedDateMap: { [key: string]: string } = {};
      const today = new Date();
      let count = 0;
      let daysAdded = 0;
      
      while (daysAdded < 10) {
        const date = new Date();
        date.setDate(today.getDate() + count);
        
        const dayOfWeek = date.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          const formattedDate = formatDate(date);
          datesList.push(formattedDate);
          
          const apiDateFormat = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          formattedDateMap[formattedDate] = apiDateFormat;
          
          daysAdded++;
        }
        count++;
      }
      
      setDates(datesList);
      setFormattedDates(formattedDateMap);
    };
    
    generateWeekdayDates();
  }, []);

  const formatDate = (date: Date): string => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        setLoading(true);
        const data = await getAllNutritionists();
        setNutritionists(data);
      } catch (error) {
        console.error("Erro ao buscar nutricionistas:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de nutricionistas.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNutritionists();
  }, []);

  const handleScheduleAppointment = async (): Promise<void> => {
    if (!selectedDate || !selectedNutritionist || !selectedTimeSlot) {
      Alert.alert("Informações Faltando", "Por favor, selecione uma data, um nutricionista e um horário.");
      return;
    }

    try {
      const apiDate = formattedDates[selectedDate];
      if (!apiDate) {
        throw new Error('Data inválida');
      }
      
      const appointmentDateTime = `${apiDate}T${selectedTimeSlot}:00-03:00`;
      
      await makeAppointment({
        nutricionista: String(selectedNutritionist.id),
        data_consulta: appointmentDateTime
      });
      
      Alert.alert(
        "Consulta Agendada",
        `Sua consulta com ${selectedNutritionist.nome} em ${selectedDate} às ${selectedTimeSlot} foi agendada com sucesso.`,
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dateButtonText, selectedDate === date && styles.selectedDateButtonText]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Nutricionista</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            nutritionists.map((nutritionist) => (
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
                </View>
                {selectedNutritionist?.id === nutritionist.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.selectedIcon} />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione o Horário</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
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
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Resumo da Consulta</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Data:</Text>
            <Text style={styles.summaryValue}>{selectedDate || "Não selecionado"}</Text>
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
  datesContainer: {
    marginLeft: -5,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedDateButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedDateButtonText: {
    color: "#fff",
    fontWeight: "600",
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
})