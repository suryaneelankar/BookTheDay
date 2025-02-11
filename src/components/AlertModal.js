import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import themevariable from '../utils/themevariable';

const CustomModal = ({ visible, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.buttonContainer}>
            <LinearGradient colors={['#D2453B', '#A0153E']} start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} style={styles.button}>
              <Text style={styles.buttonText}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: 320,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: themevariable.Color_000000,
  },
  buttonContainer: {
    width: '30%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CustomModal;
