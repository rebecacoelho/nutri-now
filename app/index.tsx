import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color="#4CAF50" />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  )
}

export default function WelcomeScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Image source={{ uri: "/placeholder.svg?height=80&width=80" }} style={styles.logo} />
        <Text style={styles.appName}>Nutri Now</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao Nutri Now</Text>
        <Text style={styles.subtitle}>Sua solução completa para gerenciamento nutricional e cuidado com pacientes</Text>

        <View style={styles.featureContainer}>
          <FeatureItem
            icon="restaurant-outline"
            title="Planejamento de Refeições"
            description="Crie e acompanhe planos de refeição personalizados para os pacientes"
          />
          <FeatureItem
            icon="chatbubbles-outline"
            title="Comunicação Direta"
            description="Conecte nutricionistas e pacientes de forma simples"
          />
          <FeatureItem
            icon="bar-chart-outline"
            title="Análise de Progresso"
            description="Monitore o progresso dos pacientes com gráficos detalhados"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
    lineHeight: 22,
  },
  featureContainer: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#F5F5F5",
    paddingInline: 12,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 4
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
    color: "#333",
    marginRight: 8
  },
  featureDescription: {
    fontSize: 12,
    color: "#666",
    flex: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  registerButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
})

