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
  FlatList,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { getAppointments } from "../../api"

interface Appointment {
  id: number
  data_consulta: string
  nutricionista_nome: string
  paciente_nome: string
  realizada: boolean
}

interface PatientAppointments {
  paciente_nome: string
  consultas: Appointment[]
}

export default function Patients(): React.JSX.Element {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [groupedAppointments, setGroupedAppointments] = useState<PatientAppointments[]>([])

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointments()
        setAppointments(response)

        const grouped = response.reduce((acc: { [key: string]: Appointment[] }, appointment: Appointment) => {
          if (!acc[appointment.paciente_nome]) {
            acc[appointment.paciente_nome] = []
          }
          acc[appointment.paciente_nome].push(appointment)
          return acc
        }, {} as { [key: string]: Appointment[] })

        const groupedArray = (Object.entries(grouped) as [string, Appointment[]][]).map(([paciente_nome, consultas]) => ({
          paciente_nome,
          consultas: consultas.sort((a: Appointment, b: Appointment) => new Date(b.data_consulta).getTime() - new Date(a.data_consulta).getTime())
        }))

        setGroupedAppointments(groupedArray)
      } catch (error) {
        console.error('Erro ao buscar consultas:', error)
      }
    }

    fetchAppointments()
  }, [])

  const filteredPatients = groupedAppointments.filter((patient) =>
    patient.paciente_nome.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Histórico de Pacientes",
          headerStyle: {
            backgroundColor: "#fff",
          },
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

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.paciente_nome}
        contentContainerStyle={styles.patientsList}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{item.paciente_nome}</Text>
                <Text style={styles.consultCount}>
                  {item.consultas.length} consulta{item.consultas.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View style={styles.appointmentsContainer}>
              {item.consultas.map((appointment, index) => (
                <View 
                  key={appointment.id} 
                  style={[
                    styles.appointmentItem,
                    index === item.consultas.length - 1 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.appointmentDate}>
                    <Ionicons 
                      name={appointment.realizada ? "checkmark-circle" : "time"} 
                      size={20} 
                      color={appointment.realizada ? "#4CAF50" : "#FFC107"} 
                    />
                    <Text style={styles.dateText}>{formatDate(appointment.data_consulta)}</Text>
                    <Text style={styles.timeText}>{formatTime(appointment.data_consulta)}</Text>
                  </View>
                  <View style={styles.appointmentStatus}>
                    <Text style={[
                      styles.statusText,
                      { color: appointment.realizada ? "#4CAF50" : "#FFC107" }
                    ]}>
                      {appointment.realizada ? "Realizada" : "Agendada"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
            <Text style={styles.emptySubtext}>Tente outro termo de busca</Text>
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
  patientsList: {
    padding: 15,
    paddingBottom: 100,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  consultCount: {
    fontSize: 14,
    color: "#666",
  },
  appointmentsContainer: {
    padding: 15,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appointmentDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  appointmentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
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

