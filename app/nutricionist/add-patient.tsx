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

  // Update form field
  const updateField = (field: keyof FormData, value: string | boolean): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle document type selection
  const handleDocumentTypeSelect = (type: "id" | "passport" | "other"): void => {
    updateField("documentType", type)
  }

  // Handle gender selection
  const handleGenderSelect = (gender: "male" | "female" | "other"): void => {
    updateField("gender", gender)
  }

  // Handle form submission
  const handleSubmit = (): void => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.documentId || !formData.email) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.")
      return
    }

    // In a real app, you would send this data to your backend
    Alert.alert("Patient Added", `${formData.firstName} ${formData.lastName} has been added to your patient list.`, [
      {
        text: "OK",
        onPress: () => router.push("/nutritionist/patients"),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Add New Patient",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>
                First Name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                value={formData.firstName}
                onChangeText={(value) => updateField("firstName", value)}
              />
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>
                Last Name <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                value={formData.lastName}
                onChangeText={(value) => updateField("lastName", value)}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>
            Document Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, formData.documentType === "id" && styles.optionButtonSelected]}
              onPress={() => handleDocumentTypeSelect("id")}
            >
              <Text
                style={[styles.optionButtonText, formData.documentType === "id" && styles.optionButtonTextSelected]}
              >
                ID Card
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
                Passport
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.documentType === "other" && styles.optionButtonSelected]}
              onPress={() => handleDocumentTypeSelect("other")}
            >
              <Text
                style={[styles.optionButtonText, formData.documentType === "other" && styles.optionButtonTextSelected]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>
            Document ID <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter document number"
            value={formData.documentId}
            onChangeText={(value) => updateField("documentId", value)}
          />

          <Text style={styles.inputLabel}>
            Email <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
          />

          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => updateField("phone", value)}
          />

          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={formData.dateOfBirth}
            onChangeText={(value) => updateField("dateOfBirth", value)}
          />

          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, formData.gender === "male" && styles.optionButtonSelected]}
              onPress={() => handleGenderSelect("male")}
            >
              <Text style={[styles.optionButtonText, formData.gender === "male" && styles.optionButtonTextSelected]}>
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.gender === "female" && styles.optionButtonSelected]}
              onPress={() => handleGenderSelect("female")}
            >
              <Text style={[styles.optionButtonText, formData.gender === "female" && styles.optionButtonTextSelected]}>
                Female
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, formData.gender === "other" && styles.optionButtonSelected]}
              onPress={() => handleGenderSelect("other")}
            >
              <Text style={[styles.optionButtonText, formData.gender === "other" && styles.optionButtonTextSelected]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                style={styles.input}
                placeholder="cm or ft/in"
                value={formData.height}
                onChangeText={(value) => updateField("height", value)}
              />
            </View>

            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Weight</Text>
              <TextInput
                style={styles.input}
                placeholder="kg or lbs"
                value={formData.weight}
                onChangeText={(value) => updateField("weight", value)}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Medical Conditions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List any medical conditions"
            multiline
            numberOfLines={3}
            value={formData.medicalConditions}
            onChangeText={(value) => updateField("medicalConditions", value)}
          />

          <Text style={styles.inputLabel}>Allergies</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List any allergies"
            multiline
            numberOfLines={3}
            value={formData.allergies}
            onChangeText={(value) => updateField("allergies", value)}
          />

          <Text style={styles.inputLabel}>Dietary Restrictions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List any dietary restrictions"
            multiline
            numberOfLines={3}
            value={formData.dietaryRestrictions}
            onChangeText={(value) => updateField("dietaryRestrictions", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>

          <Text style={styles.inputLabel}>Fitness/Nutrition Goal</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the patient's goals"
            multiline
            numberOfLines={3}
            value={formData.fitnessGoal}
            onChangeText={(value) => updateField("fitnessGoal", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Options</Text>

          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Send welcome email</Text>
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
            <Text style={styles.submitButtonText}>Add Patient</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NutritionistTabBar activeTab="patients" />
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

