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
  Alert,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import NutritionistTabBar from "../components/nutritionist-tab-bar"
import { registerUser } from "../../api"

interface FormData {
  firstName: string
  lastName: string
  documentId: string
  documentType: "id" | "passport" | "other"
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other" | ""
  height: string
  weight: string
  medicalConditions: string
  allergies: string
  dietaryRestrictions: string
  fitnessGoal: string
  address: string
  age: string
}

export default function AddPatient(): React.JSX.Element {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    documentId: "",
    documentType: "id",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    medicalConditions: "",
    allergies: "",
    dietaryRestrictions: "",
    fitnessGoal: "",
    address: "",
    age: "",
  })

  const updateField = (field: keyof FormData, value: string | boolean): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenderSelect = (gender: "male" | "female" | "other"): void => {
    updateField("gender", gender)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!formData.firstName || !formData.lastName || !formData.documentId || !formData.email) {
      Alert.alert("Informações Faltando", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("E-mail Inválido", "Por favor, insira um endereço de e-mail válido.")
      return
    }

    try {
      const userData = {
        email: formData.email,
        is_nutricionista: false,
        is_paciente: true,
        paciente_data: {
          altura: Number(formData.height),
          data_nascimento: formData.dateOfBirth,
          email: formData.email,
          endereco: formData.address,
          genero: formData.gender === "male" ? "Masculino" : formData.gender === "female" ? "Feminino" : "Outro",
          idade: Number(formData.age),
          nome: `${formData.firstName} ${formData.lastName}`,
          peso: Number(formData.weight),
          senha: "nutrinow",
          telefone: formData.phone
        },
        password: "nutrinow",
      }

      await registerUser(userData)
      
      Alert.alert(
        "Paciente Adicionado",
        `${formData.firstName} ${formData.lastName} foi adicionado à sua lista de pacientes. Uma senha padrão 'nutrinow' foi definida. Por questões de segurança, o paciente deve alterar esta senha no primeiro acesso.`,
        [
          {
            text: "OK",
            onPress: () => router.push("/nutritionist/patients"),
          },
        ]
      )
    } catch (error) {
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao adicionar o paciente. Por favor, tente novamente."
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Adicionar Novo Paciente",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>
                Nome <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="João"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={formData.firstName}
                onChangeText={(value) => updateField("firstName", value)}
              />
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>
                Sobrenome <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Silva"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={formData.lastName}
                onChangeText={(value) => updateField("lastName", value)}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>
            E-mail <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
          />

          <Text style={styles.inputLabel}>Número de Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="+55 (11) 91234-5678"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => updateField("phone", value)}
          />

          <Text style={styles.inputLabel}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={formData.dateOfBirth}
            onChangeText={(value) => updateField("dateOfBirth", value)}
          />

          <Text style={styles.inputLabel}>Gênero</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, formData.gender === "male" && styles.optionButtonSelected]}
              onPress={() => handleGenderSelect("male")}
            >
              <Text style={[styles.optionButtonText, formData.gender === "male" && styles.optionButtonTextSelected]}>
                Masculino
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.gender === "female" && styles.optionButtonSelected]}
              onPress={() => handleGenderSelect("female")}
            >
              <Text style={[styles.optionButtonText, formData.gender === "female" && styles.optionButtonTextSelected]}>
                Feminino
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.gender === "other" && styles.optionButtonSelected]}
              onPress={() => handleGenderSelect("other")}
            >
              <Text style={[styles.optionButtonText, formData.gender === "other" && styles.optionButtonTextSelected]}>
                Outro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Físicas</Text>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Altura</Text>
              <TextInput
                style={styles.input}
                placeholder="cm"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={formData.height}
                onChangeText={(value) => updateField("height", value)}
              />
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Peso</Text>
              <TextInput
                style={styles.input}
                placeholder="kg"
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                value={formData.weight}
                onChangeText={(value) => updateField("weight", value)}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.inputLabel}>Endereço Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o endereço completo"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            value={formData.address}
            onChangeText={(value) => updateField("address", value)}
          />

          <Text style={styles.inputLabel}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a idade"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(value) => updateField("age", value)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Adicionar Paciente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionistTabBar activeTab="pacientes" />
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
    paddingBottom: 100,
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  formColumn: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  requiredStar: {
    color: "#f44336",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  optionsRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionButtonSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#666",
  },
  optionButtonTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionLabel: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

