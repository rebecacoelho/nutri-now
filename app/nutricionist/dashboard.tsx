"use client"

import type React from "react"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

export default function NutritionistDashboard(): React.JSX.Element {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/nutritionist/profile")}>
              <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Dr. Johnson</Text>
            <Text style={styles.date}>Monday, March 13</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentTime}>
              <Text style={styles.appointmentTimeText}>10:30 AM</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentPatient}>
                <Image source={{ uri: "/placeholder.svg?height=50&width=50" }} style={styles.patientImage} />
                <View>
                  <Text style={styles.patientName}>Sarah Johnson</Text>
                  <Text style={styles.appointmentType}>Weight Management</Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.appointmentCard}>
            <View style={styles.appointmentTime}>
              <Text style={styles.appointmentTimeText}>2:00 PM</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentPatient}>
                <Image source={{ uri: "/placeholder.svg?height=50&width=50" }} style={styles.patientImage} />
                <View>
                  <Text style={styles.patientName}>Michael Brown</Text>
                  <Text style={styles.appointmentType}>Diabetes Management</Text>
                </View>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="videocam-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.appointmentButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Appointments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Patient Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} style={styles.activityPatientImage} />
              <View>
                <Text style={styles.activityPatientName}>Sarah Johnson</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <TouchableOpacity style={styles.activityButton}>
                <Text style={styles.activityButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Meal Plan Compliance</Text>
              <Text style={styles.activityDescription}>Completed 2/3 meals today. Skipped dinner.</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Image source={{ uri: "/placeholder.svg?height=40&width=40" }} style={styles.activityPatientImage} />
              <View>
                <Text style={styles.activityPatientName}>Robert Davis</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
              <TouchableOpacity style={styles.activityButton}>
                <Text style={styles.activityButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Weight Update</Text>
              <Text style={styles.activityDescription}>Recorded new weight: 172 lbs (-2 lbs this week)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Activity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push("/nutricionist/create-meal-plan")}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Create Meal Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutricionist/dashboard")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="person-add-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Add Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutricionist/schedule")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/nutricionist/dashboard")}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="analytics-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={24} color="#4CAF50" />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/")}>
          <Ionicons name="people-outline" size={24} color="#999" />
          <Text style={styles.tabLabel}>Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/messages")}>
          <Ionicons name="chatbubbles-outline" size={24} color="#999" />
          <Text style={styles.tabLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/meal-plans")}>
          <Ionicons name="restaurant-outline" size={24} color="#999" />
          <Text style={styles.tabLabel}>Meal Plans</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f8f0",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 15,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
  },
  appointmentTime: {
    backgroundColor: "#f0f8f0",
    padding: 15,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  appointmentTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  appointmentDetails: {
    flex: 1,
    padding: 15,
  },
  appointmentPatient: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  appointmentType: {
    fontSize: 14,
    color: "#666",
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  appointmentButton: {
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  viewAllButton: {
    alignItems: "center",
    padding: 10,
  },
  viewAllButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityPatientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  activityPatientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activityTime: {
    fontSize: 12,
    color: "#666",
  },
  activityButton: {
    marginLeft: "auto",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  activityButtonText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  activityContent: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    backgroundColor: "#e8f5e9",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  tabLabelActive: {
    color: "#4CAF50",
  },
})

