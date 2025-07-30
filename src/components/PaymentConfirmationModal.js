import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PaymentConfirmationModal = ({ visible, message, onClose, onSubmit }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Payment Confirmation</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.cancelbuttonText}>CLOSE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payButton} onPress={onSubmit}>
              <Text style={styles.buttonText}>PAY</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color:"black"
  },
  modalText: {
    fontSize: 16,
    color: '#333333',
    fontWeight:"400",
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
    marginHorizontal:5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  payButton: {
    backgroundColor: '#FD813B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  cancelbuttonText: {
    color: '#333333',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default PaymentConfirmationModal;
