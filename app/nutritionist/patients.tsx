"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { getAppointments, confirmAppointment } from "../../api"

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

interface ConfirmationModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  appointmentDate: string
  patientName: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  appointmentDate,
  patientName,
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Confirmar Consulta</Text>
        <Text style={styles.modalText}>
          Deseja confirmar a realização da consulta com {patientName} no dia {appointmentDate}?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={onConfirm}>
            <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
)

export default function Patients(): React.JSX.Element {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [groupedAppointments, setGroupedAppointments] = useState<PatientAppointments[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const handleConfirmAppointment = async (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setModalVisible(true)
  }

  const handleConfirmationModalConfirm = async () => {
    if (selectedAppointment) {
      try {
        await confirmAppointment(String(selectedAppointment.id))
        
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
        setModalVisible(false)
        setSelectedAppointment(null)
      } catch (error) {
        Alert.alert("Erro", "Não foi possível confirmar a consulta. Tente novamente.")
      }
    }
  }

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

      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleConfirmationModalConfirm}
        onCancel={() => {
          setModalVisible(false)
          setSelectedAppointment(null)
        }}
        appointmentDate={selectedAppointment ? formatDate(selectedAppointment.data_consulta) : ''}
        patientName={selectedAppointment?.paciente_nome || ''}
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
                  <View style={styles.appointmentActions}>
                    {appointment.realizada ? (
                      <View style={styles.appointmentStatus}>
                        <Text style={[styles.statusText, { color: "#4CAF50" }]}>
                          Realizada
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View style={styles.appointmentStatusContainer}>
                          <View style={styles.appointmentStatus}>
                            <Text style={[styles.statusText, { color: "#FFC107" }]}>
                              Agendada
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.confirmAppointmentButton}
                            onPress={() => handleConfirmAppointment(appointment)}
                          >
                            <Text style={styles.confirmAppointmentButtonText}>Confirmar</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
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
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  appointmentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appointmentStatusContainer: {
    alignItems: "center",
    gap: 8,
  },
  appointmentStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  confirmAppointmentButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  confirmAppointmentButtonText: {
    color: "#fff",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  confirmButtonText: {
    color: "#fff",
  },
})

