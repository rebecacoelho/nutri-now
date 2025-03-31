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
  Switch,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

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
  sendWelcomeEmail: boolean
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
    sendWelcomeEmail: true,
  })

  // Atualizar campo do formulário
  const updateField = (field: keyof FormData, value: string | boolean): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDocumentTypeSelect = (type: "id" | "passport" | "other"): void => {
    updateField("documentType", type)
  }

  const handleGenderSelect = (gender: "male" | "female" | "other"): void => {
    updateField("gender", gender)
  }

  const handleSubmit = (): void => {
    if (!formData.firstName || !formData.lastName || !formData.documentId || !formData.email) {
      Alert.alert("Informações Faltando", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("E-mail Inválido", "Por favor, insira um endereço de e-mail válido.")
      return
    }

    // enviar esses dados para o backend
    Alert.alert(
      "Paciente Adicionado",
      `${formData.firstName} ${formData.lastName} foi adicionado à sua lista de pacientes.`,
      [
        {
          text: "OK",
          onPress: () => router.push("/nutritionist/patients"),
        },
      ]
    )
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
                value={formData.lastName}
                onChangeText={(value) => updateField("lastName", value)}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>
            Tipo de Documento <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, formData.documentType === "id" && styles.optionButtonSelected]}
              onPress={() => handleDocumentTypeSelect("id")}
            >
              <Text
                style={[styles.optionButtonText, formData.documentType === "id" && styles.optionButtonTextSelected]}
              >
                RG
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.documentType === "passport" && styles.optionButtonSelected]}
              onPress={() => handleDocumentTypeSelect("passport")}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  formData.documentType === "passport" && styles.optionButtonTextSelected,
                ]}
              >
                Passaporte
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.documentType === "other" && styles.optionButtonSelected]}
              onPress={() => handleDocumentTypeSelect("other")}
            >
              <Text
                style={[styles.optionButtonText, formData.documentType === "other" && styles.optionButtonTextSelected]}
              >
                Outro
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            Número do Documento <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o número do documento"
            value={formData.documentId}
            onChangeText={(value) => updateField("documentId", value)}
          />

          <Text style={styles.inputLabel}>
            E-mail <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
          />

          <Text style={styles.inputLabel}>Número de Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="+55 (11) 91234-5678"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => updateField("phone", value)}
          />

          <Text style={styles.inputLabel}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
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
          <Text style={styles.sectionTitle}>Informações de Saúde</Text>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Altura</Text>
              <TextInput
                style={styles.input}
                placeholder="cm"
                value={formData.height}
                onChangeText={(value) => updateField("height", value)}
              />
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Peso</Text>
              <TextInput
                style={styles.input}
                placeholder="kg"
                value={formData.weight}
                onChangeText={(value) => updateField("weight", value)}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Condições Médicas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Liste quaisquer condições médicas"
            multiline
            numberOfLines={3}
            value={formData.medicalConditions}
            onChangeText={(value) => updateField("medicalConditions", value)}
          />

          <Text style={styles.inputLabel}>Alergias</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Liste quaisquer alergias"
            multiline
            numberOfLines={3}
            value={formData.allergies}
            onChangeText={(value) => updateField("allergies", value)}
          />

          <Text style={styles.inputLabel}>Restrições Alimentares</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Liste quaisquer restrições alimentares"
            multiline
            numberOfLines={3}
            value={formData.dietaryRestrictions}
            onChangeText={(value) => updateField("dietaryRestrictions", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivos</Text>

          <Text style={styles.inputLabel}>Objetivo de Fitness/Nutrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva os objetivos do paciente"
            multiline
            numberOfLines={3}
            value={formData.fitnessGoal}
            onChangeText={(value) => updateField("fitnessGoal", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções Adicionais</Text>

          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Enviar e-mail de boas-vindas</Text>
            <Switch
              trackColor={{ false: "#ddd", true: "#a5d6a7" }}
              thumbColor={"#4CAF50"}
              value={formData.sendWelcomeEmail}
              onValueChange={(value) => updateField("sendWelcomeEmail", value)}
            />
          </View>
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

