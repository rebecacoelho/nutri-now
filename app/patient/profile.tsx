"use client"

import type React from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { usePatient } from "../contexts/PatientContext"
import { useState, useEffect, useRef } from "react"
import { registerForPushNotificationsAsync, NotificationSettings, defaultPatientSettings } from "../utils/notifications"
import * as Notifications from 'expo-notifications';
import { getAppointments } from "@/api"

export default function PatientProfile(): React.JSX.Element {
  const router = useRouter()
  const { patientData } = usePatient()
  const [appointments, setAppointments] = useState<any[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultPatientSettings);

  const upcomingAppointments = appointments.filter(appointment => new Date(appointment.data_consulta) > new Date())

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('@notifications/settings');
        if (savedSettings) {
          setNotificationSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token.data);
      }
    });

    loadNotificationSettings();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    };
  }, []);

  useEffect(() => {
    const fetchAppointmentsAndSet = async () => {
      const appointments = await getAppointments();
      setAppointments(appointments);
    };

    fetchAppointmentsAndSet();
  }, [appointments]);

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

  const toggleNotificationSetting = async (setting: keyof NotificationSettings) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };
    setNotificationSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('@notifications/settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

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
          <Text style={styles.profileName}>{patientData?.nome}</Text>
          <Text style={styles.profileEmail}>{patientData?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{patientData?.telefone}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Data de Nascimento</Text>
                  <Text style={styles.infoValue}>{patientData?.data_nascimento.split("-").reverse().join("/")}</Text>                
                </View>
              </View>
            </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Saúde</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Gênero</Text>
                  <Text style={styles.infoValue}>{patientData?.genero}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Altura</Text>
                  <Text style={styles.infoValue}>{patientData?.altura} cm</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="fitness-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Peso</Text>
                  <Text style={styles.infoValue}>{patientData?.peso} kg</Text>
                </View>
              </View>
            </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Consultas</Text>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentDate}>{new Date(appointment.data_consulta).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                <Text style={styles.appointmentTime}>{new Date(appointment.data_consulta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            ))
          ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color="#ddd" />
            <Text style={styles.emptyStateText}>Nenhuma consulta agendada</Text>
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => router.push("/patient/schedule-appointment")}
            >
              <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
            </TouchableOpacity>
          </View>
        )}
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

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Lembretes de Refeições</Text>
              <Text style={styles.settingDescription}>Receba lembretes para registrar suas refeições</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={notificationSettings.mealReminders}
              onValueChange={() => toggleNotificationSetting("mealReminders")}
            />
          </View>
        </View>
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
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
  saveProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveProfileButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
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
  appointmentCard: {
    backgroundColor: "#f0f8f0",
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  appointmentDoctor: {
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
})

