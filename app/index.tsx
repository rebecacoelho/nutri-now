import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Linking, ScrollView } from "react-native"
import { Link, Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker } from "react-native-maps"
import { useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { refreshToken } from "@/api"
import { notifyTokenRefreshed } from "./utils/tokenEvents"

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
  const router = useRouter()

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userType = await AsyncStorage.getItem('userType')
        const isLoggedIn = await AsyncStorage.getItem('refreshToken') && userType

        if (isLoggedIn) {
          const response = await refreshToken()

          if (response.access) {
            await AsyncStorage.setItem("accessToken", response.access)
            notifyTokenRefreshed();

            if (userType === 'patient') {
              router.replace('/patient/dashboard')
            } else if (userType === 'nutritionist') {
              router.replace('/nutritionist/dashboard')
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
      }
    }

    checkLogin()
  }, [])

  const clinicLocation = {
    latitude: -2.499679,
    longitude: -44.288340,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  }


  const openMaps = () => {
    const url = `https://maps.google.com/?q=${clinicLocation.latitude},${clinicLocation.longitude}`
    Linking.openURL(url)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao Nutri Now</Text>
        <Text style={styles.subtitle}>Sua solução completa para gerenciamento nutricional e cuidado com pacientes</Text>

        <View style={styles.featureContainer}>
          <FeatureItem
            icon="restaurant-outline"
            title="Planejamento de Refeições"
            description="Crie e acompanhe planos de refeição personalizados para os pacientes"
          />
          <FeatureItem
            icon="leaf-outline"
            title="Biblioteca de Alimentos"
            description="Consulte informações nutricionais detalhadas de diversos alimentos"
          />
          <FeatureItem
            icon="clipboard-outline"
            title="Consultas"
            description="Visualize histórico de consultas e os próximos agendamentos"
          />
        </View>

        <View>
          <Text style={styles.locationTitle}>Nossa Localização</Text>
          <View style={styles.mapContainer}>
            <MapView 
              style={styles.map} 
              initialRegion={clinicLocation}
            >
              <Marker 
                coordinate={{
                  latitude: clinicLocation.latitude,
                  longitude: clinicLocation.longitude,
                }}
                title="Clínicas Integradas de Saúde UNDB"
                description="Rua Queopes, 11 - Renascença"
              />
            </MapView>
          </View>
          <View style={styles.locationInfo}>
            <Ionicons name="location-outline" size={22} color="#4CAF50" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationAddress}>
                Rua Queopes, 11 - Renascença, São Luís - MA, 65.075-800
              </Text>
              <Text style={styles.locationDescription}>
                Clínicas Integradas de Saúde UNDB - Atendimento nutricional especializado em ambiente moderno e acolhedor.
              </Text>
              <TouchableOpacity style={styles.directionButton} onPress={openMaps}>
                <Text style={styles.directionButtonText}>Como chegar</Text>
                <Ionicons name="navigate-outline" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 60,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 20,
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
    paddingHorizontal: 12,
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
  locationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationInfo: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  locationAddress: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  locationDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    lineHeight: 18,
  },
  directionButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  directionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4CAF50",
    marginRight: 5,
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