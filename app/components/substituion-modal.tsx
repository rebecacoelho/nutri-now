import { Ionicons } from "@expo/vector-icons"
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface SubstitutionModalProps {
  isVisible: boolean
  onClose: () => void
  substitutions: Array<{
    descricao: string
    itens: Array<{
      descricao: string
      kcal: number
      grupo: string
    }>
  }>
  foodName: string
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({ isVisible, onClose, substitutions, foodName }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Substituições para {foodName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.substitutionsList}>
            {substitutions.map((substitution, index) => (
              <View key={index} style={styles.substitutionGroup}>
                <Text style={styles.substitutionGroupTitle}>{substitution.descricao}</Text>
                {substitution.itens.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.substitutionItem}>
                    <Text style={styles.substitutionName}>{item.descricao}</Text>
                    <Text style={styles.substitutionCalories}>{item.kcal} cal</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  substitutionsList: {
    width: '100%',
  },
  substitutionGroup: {
    marginBottom: 20,
  },
  substitutionGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  substitutionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  substitutionName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  substitutionCalories: {
    fontSize: 14,
    color: '#666',
  },
})