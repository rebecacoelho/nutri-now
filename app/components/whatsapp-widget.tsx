"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface WhatsAppWidgetProps {
  phoneNumber: string
  message: string
}

export default function WhatsAppWidget({ phoneNumber, message }: WhatsAppWidgetProps): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false)

  const openWhatsApp = async (): Promise<void> => {
    const formattedPhone = phoneNumber.replace(/\s+/g, "").replace(/[()+-]/g, "")

    const encodedMessage = encodeURIComponent(message)

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    const canOpen = await Linking.canOpenURL(whatsappUrl)

    if (canOpen) {
      await Linking.openURL(whatsappUrl)
    } else {
      console.error("Não foi possível abrir o WhatsApp")
    }

    setModalVisible(false)
  }

  return (
    <>
      <TouchableOpacity style={styles.whatsappButton} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Ionicons name="logo-whatsapp" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="logo-whatsapp" size={28} color="#4CAF50" />
              <Text style={styles.modalTitle}>Contato via WhatsApp</Text>
            </View>

            <Text style={styles.modalText}>
              Deseja entrar em contato com a Clínica Escola UNDB via WhatsApp para marcar uma consulta?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={openWhatsApp}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  whatsappButton: {
    position: "absolute",
    bottom: 90,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    lineHeight: 22,
  },
  messagePreview: {
    backgroundColor: "#f0f8f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  messagePreviewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 5,
  },
  messagePreviewText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#25D366",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
})

