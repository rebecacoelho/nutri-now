"use client"

import type React from "react"
import { View, StyleSheet } from "react-native"
import WhatsAppWidget from "./whatsapp-widget"

interface PatientLayoutProps {
  children: React.ReactNode
}

export default function PatientLayout({ children }: PatientLayoutProps): React.JSX.Element {
  const whatsappMessage =
    "Olá! Gostaria de marcar uma consulta na Clínica Escola UNDB. Poderia me ajudar com informações sobre disponibilidade e valores?"

  return (
    <View style={styles.container}>
      {children}
      <WhatsAppWidget phoneNumber="+55 98 9193-1960" message={whatsappMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

