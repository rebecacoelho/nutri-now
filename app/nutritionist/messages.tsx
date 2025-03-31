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
  Image,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import NutritionistTabBar from "../components/nutritionist-tab-bar"

interface Conversation {
  id: string
  name: string
  image: string
  condition: string
  lastMessage: string
  time: string
  unread: number
}

interface Message {
  id: string
  sender: "nutritionist" | "patient"
  text: string
  time: string
}

export default function NutritionistMessages(): React.JSX.Element {
  const router = useRouter()
  const [activeChat, setActiveChat] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState<string>("")

  // Dados de exemplo para conversas
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Peso",
      lastMessage: "Obrigada pelas dicas sobre o café da manhã, vou experimentar!",
      time: "10:30",
      unread: 0,
    },
    {
      id: "2",
      name: "Michael Brown",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Diabetes",
      lastMessage: "Dra., meu nível de açúcar no sangue está mais estável agora",
      time: "Ontem",
      unread: 2,
    },
    {
      id: "3",
      name: "Emily Davis",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Nutrição Esportiva",
      lastMessage: "Preciso de ajuda com meu plano de refeição pré-treino",
      time: "15 Mar",
      unread: 1,
    },
    {
      id: "4",
      name: "Robert Wilson",
      image: "/placeholder.svg?height=60&width=60",
      condition: "Controle de Peso",
      lastMessage: "Quando podemos revisar meu plano alimentar?",
      time: "14 Mar",
      unread: 0,
    },
  ]

  const getMessages = (conversationId: string): Message[] => {
    return [
      {
        id: "1",
        sender: "patient",
        text: "Bom dia, Dra. Johnson! Estou tendo dificuldades para seguir o plano alimentar nos fins de semana. Você tem alguma dica?",
        time: "10:30",
      },
      {
        id: "2",
        sender: "nutritionist",
        text: "Olá! Entendo que os fins de semana podem ser desafiadores. Que tal preparar algumas refeições com antecedência? Isso pode ajudar a manter o foco.",
        time: "10:32",
      },
      {
        id: "3",
        sender: "patient",
        text: "Boa ideia! Vou tentar preparar algumas opções saudáveis para ter em casa. Também tenho dúvidas sobre o café da manhã.",
        time: "10:35",
      },
      {
        id: "4",
        sender: "nutritionist",
        text: "Claro! Para o café da manhã, recomendo incluir proteínas como ovos ou iogurte grego, além de frutas e grãos integrais. Isso ajuda a manter a saciedade por mais tempo.",
        time: "10:36",
      },
      {
        id: "5",
        sender: "patient",
        text: "Obrigada pelas dicas sobre o café da manhã, vou experimentar!",
        time: "10:38",
      },
    ]
  }

  const handleSendMessage = (): void => {
    if (messageText.trim() === "") return

    // enviarie a mensagem para o backend e atualizar o estado local após confirmação

    setMessageText("")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: activeChat ? activeChat.name : "Mensagens",
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
        <View style={styles.conversationsContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput style={styles.searchInput} placeholder="Buscar pacientes..." />
            </View>
          </View>

          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.conversationItem} onPress={() => setActiveChat(item)}>
                <Image source={{ uri: item.image }} style={styles.conversationAvatar} />
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>{item.name}</Text>
                    <Text style={styles.conversationTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.conversationCondition}>{item.condition}</Text>
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
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={48} color="#ddd" />
                <Text style={styles.emptyStateText}>Nenhuma conversa encontrada</Text>
              </View>
            }
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={90}
        >
          <View style={styles.chatHeader}>
            <Image source={{ uri: activeChat.image }} style={styles.chatAvatar} />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatName}>{activeChat.name}</Text>
              <Text style={styles.chatCondition}>{activeChat.condition}</Text>
            </View>
            <View style={styles.chatActions}>
              <TouchableOpacity style={styles.chatAction}>
                <Ionicons name="call-outline" size={22} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatAction}>
                <Ionicons name="videocam-outline" size={22} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatAction}>
                <Ionicons name="information-circle-outline" size={22} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={getMessages(activeChat.id)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === "nutritionist" ? styles.outgoingMessage : styles.incomingMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "nutritionist" ? styles.outgoingBubble : styles.incomingBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "nutritionist" ? styles.outgoingText : styles.incomingText,
                    ]}
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
            <TextInput
              style={styles.input}
              placeholder="Digite uma mensagem..."
              multiline
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity
              style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {!activeChat && <NutritionistTabBar activeTab="mensagens" />}
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
  conversationsContainer: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  conversationsList: {
    padding: 15,
    paddingBottom: 80,
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
    marginRight: 15,
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
  conversationCondition: {
    fontSize: 12,
    color: "#4CAF50",
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  chatCondition: {
    fontSize: 12,
    color: "#4CAF50",
  },
  chatActions: {
    flexDirection: "row",
  },
  chatAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f8f0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
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
  sendButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
})

