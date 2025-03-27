"use client"

import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

interface Conversation {
  id: string
  name: string
  role: string
  lastMessage: string
  time: string
  unread: number
}

interface Message {
  id: string
  sender: "patient" | "nutritionist"
  text: string
  time: string
}

export default function PatientMessages(): React.JSX.Element {
  const router = useRouter()
  const [activeChat, setActiveChat] = useState<Conversation | null>(null)

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Dra. Emily Johnson",
      role: "Nutricionista",
      lastMessage: "Como você está se sentindo após as mudanças na dieta?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: "2",
      name: "Dr. Michael Smith",
      role: "Dietista",
      lastMessage: "Os seus exames mais recentes estão bons!",
      time: "Ontem",
      unread: 0,
    },
    {
      id: "3",
      name: "Suporte Nutri Now",
      role: "Equipe de Suporte",
      lastMessage: "Há algo mais com o que podemos te ajudar?",
      time: "10 de Mar",
      unread: 0,
    },
  ]

  const messages: Message[] = [
    {
      id: "1",
      sender: "nutritionist",
      text: "Bom dia Sarah! Como você está se sentindo após as mudanças na dieta que fizemos na semana passada?",
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "patient",
      text: "Bom dia Dra. Johnson! Estou me sentindo muito melhor. O inchaço diminuiu significativamente.",
      time: "10:32 AM",
    },
    {
      id: "3",
      sender: "nutritionist",
      text: "Que bom ouvir isso! Você tem conseguido seguir o plano alimentar de forma consistente?",
      time: "10:33 AM",
    },
    {
      id: "4",
      sender: "patient",
      text: "Sim, na maior parte do tempo. Tive um pouco de dificuldade com as opções de jantar no final de semana quando estava com amigos.",
      time: "10:35 AM",
    },
    {
      id: "5",
      sender: "nutritionist",
      text: "Isso é compreensível. Situações sociais podem ser desafiadoras. O que você acabou comendo?",
      time: "10:36 AM",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: activeChat ? activeChat.name : "Chat",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerLeft: () =>
            activeChat ? (
              <TouchableOpacity style={styles.headerButton} onPress={() => setActiveChat(null)}>
                <Ionicons name="arrow-back" size={24} color="#4CAF50" />
              </TouchableOpacity>
            ) : null,
        }}
      />

      {!activeChat ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.conversationItem} onPress={() => setActiveChat(item)}>
              <View style={styles.conversationAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text style={styles.conversationTime}>{item.time}</Text>
                </View>
                <Text style={styles.conversationRole}>{item.role}</Text>
                <View style={styles.conversationFooter}>
                  <Text style={styles.conversationLastMessage} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.conversationsList}
        />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={90}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === "patient" ? styles.outgoingMessage : styles.incomingMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "patient" ? styles.outgoingBubble : styles.incomingBubble,
                  ]}
                >
                  <Text
                    style={[styles.messageText, item.sender === "patient" ? styles.outgoingText : styles.incomingText]}
                  >
                    {item.text}
                  </Text>
                </View>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
            )}
            contentContainerStyle={styles.messagesList}
            inverted={false}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Type a message..." multiline />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {!activeChat && (
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/dashboard")}>
            <Ionicons name="home-outline" size={24} color="#999" />
            <Text style={styles.tabLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/meal-plans")}>
            <Ionicons name="restaurant-outline" size={24} color="#999" />
            <Text style={styles.tabLabel}>Meals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="chatbubbles" size={24} color="#4CAF50" />
            <Text style={[styles.tabLabel, styles.tabLabelActive]}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/patient/progress")}>
            <Ionicons name="analytics-outline" size={24} color="#999" />
            <Text style={styles.tabLabel}>Progress</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerButton: {
    marginLeft: 10,
  },
  conversationsList: {
    padding: 15,
  },
  conversationItem: {
    flexDirection: "row",
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
  conversationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  conversationTime: {
    fontSize: 12,
    color: "#999",
  },
  conversationRole: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  conversationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationLastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  messagesList: {
    padding: 15,
    paddingBottom: 70,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: "80%",
  },
  outgoingMessage: {
    alignSelf: "flex-end",
  },
  incomingMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
  },
  outgoingBubble: {
    backgroundColor: "#4CAF50",
  },
  incomingBubble: {
    backgroundColor: "#e8e8e8",
  },
  messageText: {
    fontSize: 16,
  },
  outgoingText: {
    color: "#fff",
  },
  incomingText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
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

