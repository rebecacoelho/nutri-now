"use client"

import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { getAppointments, getNutritionistData, getPatientData, loginUser } from "../api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNutritionist } from "./contexts/NutritionistContext"
import { usePatient } from "./contexts/PatientContext"
type UserType = "patient" | "nutritionist"

export default function LoginScreen(): React.JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [userType, setUserType] = useState<UserType>("patient")
  const [loading, setLoading] = useState<boolean>(false)
  const { setNutritionistData } = useNutritionist();
  const { setPatientData } = usePatient();


  const router = useRouter()

  const validateForm = (): string | null => {
    if (!email) return "Email é obrigatório"
    if (!password) return "Senha é obrigatória"
    return null
  }

  const handleLogin = async (): Promise<void> => {
    const validationError = validateForm()
    if (validationError) {
      Alert.alert("Erro", validationError)
      return
    }

    try {
      setLoading(true)

      const loginData = {
        username: email, 
        password: password,
      }

      const response = await loginUser(loginData)
      
      if (response.access && response.refresh) {
        await AsyncStorage.setItem("accessToken", response.access)
        await AsyncStorage.setItem("refreshToken", response.refresh)
        await AsyncStorage.setItem("userType", userType)
        
        if (response.is_paciente) {
          await AsyncStorage.setItem("@paciente/userId", String(response.paciente_id));
        }
        
        if (response.is_nutricionista) {
          await AsyncStorage.setItem("@nutricionista/userId", String(response.nutricionista_id));
        }
        
        if (userType === "patient") {
          const patientData = await getPatientData()
          await AsyncStorage.setItem("@paciente/data", JSON.stringify(patientData))

          const appointments = await getAppointments()
          await AsyncStorage.setItem("@paciente/appointments", JSON.stringify(appointments))
          setPatientData(patientData)

          router.replace("/patient/dashboard")
        }
        
        if (userType === "nutritionist") {
          const nutritionistData = await getNutritionistData()
          await AsyncStorage.setItem("@nutricionista/data", JSON.stringify(nutritionistData))

          const appointments = await getAppointments()
          await AsyncStorage.setItem("@nutricionista/appointments", JSON.stringify(appointments))
          setNutritionistData(nutritionistData)
          router.replace("/nutritionist/dashboard")
        }
      } else {
        throw new Error("Tokens de autenticação não recebidos")
      }
    } catch (error) {
      let errorMessage = (error as Error).message || "Falha ao fazer login. Tente novamente."
      
      if (errorMessage.includes("credenciais inválidas") || errorMessage.includes("invalid credentials")) {
        errorMessage = "Email ou senha incorretos. Por favor, tente novamente."
      }
      
      Alert.alert("Erro de Login", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Login",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Faça login para acessar sua conta</Text>

            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[styles.userTypeButton, userType === "patient" && styles.userTypeButtonActive]}
                onPress={() => setUserType("patient")}
              >
                <Ionicons name="person-outline" size={20} color={userType === "patient" ? "#fff" : "#666"} />
                <Text style={[styles.userTypeText, userType === "patient" && styles.userTypeTextActive]}>Paciente</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.userTypeButton, userType === "nutritionist" && styles.userTypeButtonActive]}
                onPress={() => setUserType("nutritionist")}
              >
                <Ionicons name="medkit-outline" size={20} color={userType === "nutritionist" ? "#fff" : "#666"} />
                <Text style={[styles.userTypeText, userType === "nutritionist" && styles.userTypeTextActive]}>
                  Nutricionista
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Endereço de e-mail"
                placeholderTextColor={"#999"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={"#999"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  userTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 10,
  },
  userTypeButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  userTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  userTypeTextActive: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#4CAF50",
    fontWeight: "600",
  },
})