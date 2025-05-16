"use client"

import React, { useState } from "react"
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
import { 
  registerUser, 
  RegisterUserData,
  formatDateToAPI,
} from "../api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { registerForPushNotificationsAsync, sendWelcomeNotification } from "./utils/notifications"

type UserType = "patient" | "nutritionist"

export default function RegisterScreen(): React.JSX.Element {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [userType, setUserType] = useState<UserType>("patient")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const [age, setAge] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [birthDate, setBirthDate] = useState<string>("")
  const [displayBirthDate, setDisplayBirthDate] = useState<string>("")
  const genderOptions = ["Feminino", "Masculino", "Outro"]

  const handleBirthDateChange = (text: string): void => {
    const cleaned = text.replace(/\D/g, "");
  
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4 && cleaned.length <= 8) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 8) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  
    setDisplayBirthDate(formatted);
  
    if (formatted.length === 10) {
      setBirthDate(formatDateToAPI(formatted));
    } else {
      setBirthDate("");
    }
  };

  const validateForm = (): string | null => {
    if (!name) return "Nome é obrigatório";
    if (!email) return "Email é obrigatório";
    if (!password) return "Senha é obrigatória";
    if (!phone) return "Telefone é obrigatório";
    if (!address) return "Endereço é obrigatório";
    
    if (userType === "patient") {
      if (!age) return "Idade é obrigatória";
      if (!weight) return "Peso é obrigatório";
      if (!height) return "Altura é obrigatória";
      if (!gender) return "Gênero é obrigatório";
      if (!birthDate) return "Data de nascimento é obrigatória";
      
      if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        return "Data de nascimento deve estar no formato AAAA-MM-DD";
      }
    }
    
    return null;
  };

  const handleRegister = async (): Promise<void> => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert("Erro", validationError);
      return;
    }

    try {
      setLoading(true);

      await AsyncStorage.setItem("userType", userType);
            
      const userData: RegisterUserData = {
        email,
        password: password,
        is_paciente: userType === "patient",
        is_nutricionista: userType === "nutritionist",
      };

      if (userType === "patient") {
        userData.paciente_data = {
          nome: name,
          idade: parseInt(age),
          peso: parseFloat(weight),
          altura: parseFloat(height),
          genero: gender,
          email: email,
          senha: password,
          endereco: address,
          telefone: phone,
          data_nascimento: formatDateToAPI(birthDate),
        };
      }

      if (userType === "nutritionist") {
        userData.nutricionista_data = {
          nome: name,
          email: email,
          senha: password,
          endereco: address,
          telefone: phone,
          horarios_disponiveis: {}
        };
      }

      const response = await registerUser(userData);

      if (response.mensagem) {
        const match = response.mensagem.match(/id:(\d+)/);
        if (match && match[1]) {
          const userId = match[1];

          const { password, ...userDataWithoutPassword } = userData;

          await AsyncStorage.setItem(`user@${userId}`, JSON.stringify(userDataWithoutPassword));
          await AsyncStorage.setItem("userId", userId);

          const token = await registerForPushNotificationsAsync();
          if (token) {
            await sendWelcomeNotification(name, userType);
          }
        }
      }
      
      Alert.alert(
        "Sucesso", 
        `Cadastro realizado com sucesso!\n Bem vindo(a) ${name}!`,
        [
          { 
            text: "OK", 
            onPress: () => {
              router.replace('/login')
            }
          }
        ]
      );
    } catch (error) {
      let errorMessage = (error as Error).message || "Falha ao cadastrar. Tente novamente.";
      
      if (errorMessage.includes("formato de data inválido")) {
        errorMessage = "A data de nascimento deve estar no formato AAAA-MM-DD. Por favor, use o formato DD/MM/AAAA.";
      }
      
      if (errorMessage.includes("já existe") || errorMessage.includes("already exists")) {
        errorMessage = "Este nome de usuário já está em uso. O sistema gerará um nome único automaticamente.";
      }
      
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Cadastro",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para começar</Text>

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
                <Text style={[styles.userTypeText, userType === "nutritionist" && styles.userTypeTextActive]}>Nutricionista</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor={"#999"}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Endereço de Email"
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

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor={"#999"}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor={"#999"}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {userType === "patient" && (
              <>
                <View style={styles.inputContainer}>
                  <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Data de Nascimento (DD/MM/AAAA)"
                    placeholderTextColor={"#999"}
                    value={displayBirthDate}
                    onChangeText={handleBirthDateChange}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="fitness-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Idade"
                    placeholderTextColor={"#999"}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="body-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Peso (kg)"
                    placeholderTextColor={"#999"}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="resize-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Altura (m)"
                    placeholderTextColor={"#999"}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.genderContainer}>
                  <Text style={styles.genderLabel}>Gênero</Text>
                  <View style={styles.genderOptions}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.genderOption,
                          gender === option && styles.genderOptionSelected
                        ]}
                        onPress={() => setGender(option)}
                      >
                        <Text
                          style={[
                            styles.genderOptionText,
                            gender === option && styles.genderOptionTextSelected
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Entrar</Text>
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
    gap: 10,
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
  registerButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  genderContainer: {
    marginBottom: 16,
  },
  
  genderLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  
  genderOptionSelected: {
    backgroundColor: "#4CAF50", 
    borderColor: "#4CAF50",
  },
  
  genderOptionText: {
    color: "#333",
    fontWeight: "500",
  },
  
  genderOptionTextSelected: {
    color: "#fff",
  },
  
})