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
  Switch,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNutritionist } from "../contexts/NutritionistContext"
import { updateNutritionistAvailability } from "../../api"

interface Appointment {
  id: string
  patient: string
  date: string
  time: string
  type: string
}

export default function NutritionistProfile(): React.JSX.Element {
  const router = useRouter()
  const { nutritionistData } = useNutritionist()

  // Configurações de notificações
  const [notificationSettings, setNotificationSettings] = useState({
    appointmentReminders: true,
    newPatientAlerts: true,
    messageNotifications: true,
    patientProgressAlerts: true,
  })

  const [isSelectingHours, setIsSelectingHours] = useState(false)
  const [selectedHours, setSelectedHours] = useState<string[]>([])

  useEffect(() => {
    if (nutritionistData?.horarios_disponiveis) {
      setSelectedHours(nutritionistData.horarios_disponiveis);
    }
  }, [nutritionistData]);

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza de que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: async () => {
            await AsyncStorage.removeItem("accessToken")
            await AsyncStorage.removeItem("refreshToken")
            await AsyncStorage.removeItem("@paciente/data")
            await AsyncStorage.removeItem("@nutricionista/data")
            await AsyncStorage.removeItem("@paciente/userId")
            await AsyncStorage.removeItem("@nutricionista/userId")  
            router.replace("/")
          },
        },
      ],
      { cancelable: true },
    )

  }

  const toggleNotificationSetting = (setting: keyof typeof notificationSettings): void => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  const toggleHourSelector = () => {
    setIsSelectingHours(!isSelectingHours)
  }

  const handleHourSelection = (hour: string) => {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    )
  }

  const updateAvailability = async () => {
    if (!nutritionistData?.id) {
      Alert.alert("Erro", "ID do nutricionista não encontrado.");
      return;
    }
    try {
      await updateNutritionistAvailability({
        id_nutricionista: nutritionistData.id,
        horarios_disponiveis: selectedHours
      });
      Alert.alert("Sucesso", "Horários atualizados com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar os horários.");
    }
  };

  const availableHours = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Meu Perfil",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#F44336" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>{nutritionistData?.nome}</Text>
          <Text style={styles.profileEmail}>{nutritionistData?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações de Notificação</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Lembretes de Consultas</Text>
              <Text style={styles.settingDescription}>Receba notificações sobre consultas futuras</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={notificationSettings.appointmentReminders}
              onValueChange={() => toggleNotificationSetting("appointmentReminders")}
            />
          </View>
          <View style={[
            styles.settingItem,
            { borderBottomWidth: 0 }
          ]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Alertas de Progresso dos Pacientes</Text>
              <Text style={styles.settingDescription}>Receba notificações sobre progresso significativo dos pacientes</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={notificationSettings.patientProgressAlerts}
              onValueChange={() => toggleNotificationSetting("patientProgressAlerts")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários de Atendimento</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={toggleHourSelector}>
            <Text style={styles.editProfileButtonText}>Editar Horários</Text>
          </TouchableOpacity>
          {isSelectingHours && (
            <View style={styles.hourSelector}>
              {availableHours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={selectedHours.includes(hour) ? styles.selectedHour : styles.hourButton}
                  onPress={() => handleHourSelection(hour)}
                >
                  <Text style={selectedHours.includes(hour) ? styles.hourSelectedText : styles.hourText}>{hour}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.saveProfileButton} onPress={updateAvailability}>
                <Text style={styles.saveProfileButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profileSpecialization: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editProfileButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  saveProfileButtonText: {
    color: "#fff",
    fontWeight: "600",
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
    color: "#333",
    marginBottom: 15,
  },
  infoList: {
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  editForm: {
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  formInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  appointmentCard: {
    backgroundColor: "#f0f8f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#666",
    marginLeft: "auto",
  },
  appointmentContent: {
    marginBottom: 15,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  appointmentPatient: {
    fontSize: 14,
    color: "#666",
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  appointmentButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginRight: 0,
  },
  appointmentButtonText: {
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 5,
  },
  appointmentButtonTextOutline: {
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    marginBottom: 15,
  },
  scheduleButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f8f0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 15,
  },
  viewReportsButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  viewReportsButtonText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  hourSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "space-between",
  },
  hourButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedHour: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
    margin: 5,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  hourText: {
    color: "#333",
  },
  hourSelectedText: {
    color: "#fff",
  },
})

