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
  Image,
  TextInput,
  Switch,
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface Appointment {
  id: string
  nutritionist: string
  date: string
  time: string
  type: string
}

export default function PatientProfile(): React.JSX.Element {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(98) 92474-2384",
    dateOfBirth: "05/12/1990",
    height: "1,68 m",
    weight: "75 kg",
    allergies: "Amendoim, Frutos do mar",
    medicalConditions: "Nenhuma",
    dietaryRestrictions: "Vegetariano",
  })

  // Configurações de notificação
  const [notificationSettings, setNotificationSettings] = useState({
    appointmentReminders: true,
    mealPlanUpdates: true,
    messageNotifications: true,
    progressReports: false,
  })

  // Próximas consultas
  const upcomingAppointments: Appointment[] = [
    {
      id: "1",
      nutritionist: "Dra. Emily Johnson",
      date: "18 de Março de 2025",
      time: "10:30 AM",
      type: "Consulta Nutricional",
    },
    {
      id: "2",
      nutritionist: "Dr. Michael Smith",
      date: "02 de Abril de 2025",
      time: "14:00",
      type: "Revisão de Progresso",
    },
  ]

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
          onPress: () => router.replace("/"),
        },
      ],
      { cancelable: true },
    )

    await AsyncStorage.removeItem("accessToken")
    await AsyncStorage.removeItem("refreshToken")
    await AsyncStorage.removeItem("@paciente/data")
    await AsyncStorage.removeItem("@nutricionista/data")
    await AsyncStorage.removeItem("@paciente/userId")
    await AsyncStorage.removeItem("@nutricionista/userId")
    router.replace("/")
  }

  const handleSaveProfile = (): void => {
    // Em um app real, você salvaria os dados no backend
    Alert.alert("Sucesso", "Perfil atualizado com sucesso")
    setIsEditing(false)
  }

  const toggleNotificationSetting = (setting: keyof typeof notificationSettings): void => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }


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
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: "/placeholder.svg?height=150&width=150" }} style={styles.profileImage} />
            {!isEditing && (
              <TouchableOpacity style={styles.editImageButton}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>

          {!isEditing ? (
            <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveProfileButton} onPress={handleSaveProfile}>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveProfileButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome Completo</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>E-mail</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefone</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Data de Nascimento</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.dateOfBirth}
                  onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Gênero</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.dateOfBirth}
                  onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Idade</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.dateOfBirth}
                  onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{profileData.phone}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Data de Nascimento</Text>
                  <Text style={styles.infoValue}>{profileData.dateOfBirth}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Saúde</Text>
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Altura</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.height}
                  onChangeText={(text) => setProfileData({ ...profileData, height: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Peso</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.weight}
                  onChangeText={(text) => setProfileData({ ...profileData, weight: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Alergias</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.allergies}
                  onChangeText={(text) => setProfileData({ ...profileData, allergies: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Condições Médicas</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.medicalConditions}
                  onChangeText={(text) => setProfileData({ ...profileData, medicalConditions: text })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Restrições Alimentares</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.dietaryRestrictions}
                  onChangeText={(text) => setProfileData({ ...profileData, dietaryRestrictions: text })}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="resize-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Altura</Text>
                  <Text style={styles.infoValue}>{profileData.height}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="fitness-outline" size={20} color="#4CAF50" style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Peso</Text>
                  <Text style={styles.infoValue}>{profileData.weight}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Consultas</Text>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentDate}>{appointment.date}</Text>
                <Text style={styles.appointmentTime}>{appointment.time}</Text>
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
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
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

