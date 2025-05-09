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
  Image,
  FlatList,
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
  lastVisit: string
  nextAppointment?: string
  progress: number
  goal: string
}

export default function Patients(): React.JSX.Element {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterCondition, setFilterCondition] = useState<string | null>(null)

  // Dados de exemplo para pacientes
  const patients: Patient[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Peso",
      lastVisit: "10 de Março de 2025",
      nextAppointment: "17 de Março de 2025",
      progress: 75,
      goal: "Perder 7 kg",
    },
    {
      id: "2",
      name: "Michael Brown",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Diabetes",
      lastVisit: "8 de Março de 2025",
      nextAppointment: "22 de Março de 2025",
      progress: 60,
      goal: "Estabilizar glicemia",
    },
    {
      id: "3",
      name: "Emily Davis",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Nutrição Esportiva",
      lastVisit: "5 de Março de 2025",
      progress: 85,
      goal: "Melhorar desempenho",
    },
    {
      id: "4",
      name: "Robert Wilson",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Peso",
      lastVisit: "3 de Março de 2025",
      nextAppointment: "18 de Março de 2025",
      progress: 40,
      goal: "Perder 9 kg",
    },
    {
      id: "5",
      name: "Jennifer Lee",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Nutrição na Gravidez",
      lastVisit: "1 de Março de 2025",
      nextAppointment: "15 de Março de 2025",
      progress: 90,
      goal: "Dieta saudável na gravidez",
    },
    {
      id: "6",
      name: "David Martinez",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Diabetes",
      lastVisit: "28 de Fevereiro de 2025",
      progress: 55,
      goal: "Reduzir níveis de A1C",
    },
    {
      id: "7",
      name: "Amanda Taylor",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Nutrição Esportiva",
      lastVisit: "25 de Fevereiro de 2025",
      nextAppointment: "20 de Março de 2025",
      progress: 70,
      goal: "Aumentar massa muscular",
    },
  ]

  const conditions = Array.from(new Set(patients.map((patient) => patient.condition)))

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCondition = filterCondition ? patient.condition === filterCondition : true

    return matchesSearch && matchesCondition
  })

  const handlePatientPress = (patientId: string): void => {
    alert(`Navegar para os detalhes do paciente com ID: ${patientId}`)
  }

  const handleAddPatient = (): void => {
    router.push("/nutritionist/add-patient")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Meus Pacientes",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={handleAddPatient}>
              <Ionicons name="person-add-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pacientes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, filterCondition === null && styles.filterButtonActive]}
            onPress={() => setFilterCondition(null)}
          >
            <Text style={[styles.filterButtonText, filterCondition === null && styles.filterButtonTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition}
              style={[styles.filterButton, filterCondition === condition && styles.filterButtonActive]}
              onPress={() => setFilterCondition(condition)}
            >
              <Text style={[styles.filterButtonText, filterCondition === condition && styles.filterButtonTextActive]}>
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.patientsList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.patientCard} onPress={() => handlePatientPress(item.id)}>
            <Image source={{ uri: item.image }} style={styles.patientImage} />

            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{item.name}</Text>
              <View style={styles.patientConditionContainer}>
                <Text style={styles.patientCondition}>{item.condition}</Text>
              </View>

              <View style={styles.patientDetails}>
                <View style={styles.patientDetail}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.patientDetailText}>Última: {item.lastVisit}</Text>
                </View>

                {item.nextAppointment && (
                  <View style={styles.patientDetail}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.patientDetailText}>Próxima: {item.nextAppointment}</Text>
                  </View>
                )}
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.progress}%`,
                        backgroundColor: item.progress > 70 ? "#4CAF50" : item.progress > 40 ? "#FFC107" : "#F44336",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{item.progress}%</Text>
              </View>

              <Text style={styles.patientGoal}>Objetivo: {item.goal}</Text>
            </View>

            <View style={styles.patientActions}>
              <TouchableOpacity style={styles.patientAction}>
                <Ionicons name="create-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.patientAction}>
                <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.patientAction}>
                <Ionicons name="restaurant-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
            <Text style={styles.emptySubtext}>Tente outro termo de busca ou filtro</Text>
          </View>
        }
      />

      <NutritionistTabBar activeTab="pacientes" />
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
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  patientsList: {
    padding: 15,
    paddingBottom: 100,
  },
  patientCard: {
    flexDirection: "row",
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
  patientConditionContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  patientCondition: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  patientDetails: {
    flexDirection: "column",
    marginBottom: 8,
    gap: 4,
  },
  patientDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  patientDetailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginRight: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    width: 35,
  },
  patientGoal: {
    fontSize: 12,
    color: "#666",
  },
  patientActions: {
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  patientAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f8f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
})

