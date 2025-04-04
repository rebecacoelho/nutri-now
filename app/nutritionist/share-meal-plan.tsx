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
  Alert,
  ActivityIndicator,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

interface Patient {
  id: string
  name: string
  image: string
  condition: string
}

interface MealPlan {
  id: string
  name: string
  description: string
  days: number
  calories: string
  createdAt: string
}

export default function ShareMealPlan(): React.JSX.Element {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false)
  const [pdfGenerated, setPdfGenerated] = useState<boolean>(false)

  const patients: Patient[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Peso",
    },
    {
      id: "2",
      name: "Michael Brown",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Diabetes",
    },
    {
      id: "3",
      name: "Emily Davis",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Nutrição Esportiva",
    },
  ]

  const mealPlans: MealPlan[] = [
    {
      id: "1",
      name: "Plano de Perda de Peso",
      description: "Plano alimentar de baixa caloria com macros balanceados",
      days: 7,
      calories: "1.500",
      createdAt: "10 de março de 2025",
    },
    {
      id: "2",
      name: "Controle de Diabetes",
      description: "Alimentos de baixo índice glicêmico com ingestão equilibrada de carboidratos",
      days: 14,
      calories: "1.800",
      createdAt: "12 de março de 2025",
    },
    {
      id: "3",
      name: "Ganho de Massa Muscular",
      description: "Plano alimentar rico em proteínas com carboidratos adequados",
      days: 7,
      calories: "2.200",
      createdAt: "13 de março de 2025",
    },
  ]

  const handleGeneratePDF = (): void => {
    if (!selectedPatient || !selectedMealPlan) {
      Alert.alert("Informação Faltando", "Selecione um paciente e um plano alimentar.")
      return
    }

    setIsGeneratingPDF(true)

    setTimeout(() => {
      setIsGeneratingPDF(false)
      setPdfGenerated(true)
    }, 2000)
  }

  const handleShareMealPlan = (): void => {
    if (!pdfGenerated) {
      Alert.alert("Gerar PDF Primeiro", "Por favor, gere o PDF antes de compartilhar.")
      return
    }

    Alert.alert("Plano Alimentar Compartilhado", `O plano alimentar foi compartilhado com ${selectedPatient?.name}.`, [
      {
        text: "OK",
        onPress: () => router.push("/nutritionist/dashboard"),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Compartilhar Plano Alimentar",
          headerStyle: {
            backgroundColor: "#fff",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Paciente</Text>
          {patients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={[styles.patientCard, selectedPatient?.id === patient.id && styles.selectedPatientCard]}
              onPress={() => setSelectedPatient(patient)}
            >
              <Image source={{ uri: patient.image }} style={styles.patientImage} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientCondition}>{patient.condition}</Text>
              </View>
              {selectedPatient?.id === patient.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.selectedIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Plano Alimentar</Text>
          {mealPlans.map((mealPlan) => (
            <TouchableOpacity
              key={mealPlan.id}
              style={[styles.mealPlanCard, selectedMealPlan?.id === mealPlan.id && styles.selectedMealPlanCard]}
              onPress={() => setSelectedMealPlan(mealPlan)}
            >
              <View style={styles.mealPlanHeader}>
                <Text style={styles.mealPlanName}>{mealPlan.name}</Text>
                <Text style={styles.mealPlanDate}>Criado: {mealPlan.createdAt}</Text>
              </View>
              <Text style={styles.mealPlanDescription}>{mealPlan.description}</Text>
              <View style={styles.mealPlanDetails}>
                <View style={styles.mealPlanDetail}>
                  <Ionicons name="calendar-outline" size={16} color="#4CAF50" />
                  <Text style={styles.mealPlanDetailText}>{mealPlan.days} dias</Text>
                </View>
                <View style={styles.mealPlanDetail}>
                  <Ionicons name="flame-outline" size={16} color="#4CAF50" />
                  <Text style={styles.mealPlanDetailText}>{mealPlan.calories} cal/dia</Text>
                </View>
              </View>
              {selectedMealPlan?.id === mealPlan.id && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.selectedMealPlanIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.pdfSection}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfTitle}>PDF Generation</Text>
            {pdfGenerated && (
              <View style={styles.pdfGeneratedBadge}>
                <Text style={styles.pdfGeneratedText}>PDF gerado com sucesso!</Text>
              </View>
            )}
          </View>

          {isGeneratingPDF ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Gerando PDF...</Text>
            </View>
          ) : (
            <View style={styles.pdfContent}>
              <View style={styles.pdfPreview}>
                {pdfGenerated ? (
                  <>
                    <Ionicons name="document-text" size={48} color="#4CAF50" />
                    <Text style={styles.pdfPreviewText}>{selectedMealPlan?.name || "Meal Plan"}.pdf</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="document-outline" size={48} color="#999" />
                    <Text style={styles.pdfPreviewTextEmpty}>Nenhum PDF gerado ainda.</Text>
                  </>
                )}
              </View>

              <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePDF}>
                <Ionicons name="document-text-outline" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>{pdfGenerated ? "Gerar outro PDF" : "Gerar PDF"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Sharing Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Paciente:</Text>
            <Text style={styles.summaryValue}>{selectedPatient?.name || "Não selecionado"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Plano Alimentar:</Text>
            <Text style={styles.summaryValue}>{selectedMealPlan?.name || "Não selected"}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Status do PDF:</Text>
            <Text style={[styles.summaryValue, pdfGenerated ? styles.pdfStatusGenerated : {}]}>
              {pdfGenerated ? "Gerado" : "Não Gerado"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.shareButton,
            (!selectedPatient || !selectedMealPlan || !pdfGenerated) && styles.shareButtonDisabled,
          ]}
          onPress={handleShareMealPlan}
          disabled={!selectedPatient || !selectedMealPlan || !pdfGenerated}
        >
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Compartilhar Plano Alimentar</Text>
        </TouchableOpacity>
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
    paddingBottom: 30,
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
    marginBottom: 15,
    color: "#333",
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedPatientCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8f0",
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  patientCondition: {
    fontSize: 14,
    color: "#666",
  },
  selectedIcon: {
    marginLeft: 10,
  },
  mealPlanCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedMealPlanCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#f0f8f0",
  },
  mealPlanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  mealPlanName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  mealPlanDate: {
    fontSize: 12,
    color: "#888",
  },
  mealPlanDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  mealPlanDetails: {
    flexDirection: "row",
  },
  mealPlanDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  mealPlanDetailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  selectedMealPlanIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  pdfSection: {
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
  pdfHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pdfTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  pdfGeneratedBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  pdfGeneratedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  pdfContent: {
    alignItems: "center",
  },
  pdfPreview: {
    width: "100%",
    height: 150,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  pdfPreviewText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  pdfPreviewTextEmpty: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  summarySection: {
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
  summarySectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  pdfStatusGenerated: {
    color: "#4CAF50",
  },
  shareButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  shareButtonDisabled: {
    backgroundColor: "#aaa",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})

