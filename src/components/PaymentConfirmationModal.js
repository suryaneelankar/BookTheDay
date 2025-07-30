import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PaymentConfirmationModal = ({ visible, message, onClose, onSubmit }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Your Payment</Text>

          <View style={styles.messageWrapper}>
            {typeof message === 'string' ? (
              <Text style={styles.modalMessage}>{message}</Text>
            ) : (
              message
            )}
          </View>
          <Text style={{ color: "red", fontSize: 12, fontWeight: "500", bottom: 2, fontFamily: 'ManropeRegular', marginLeft: 10 }}>
              Note: ₹10,000 is paid to block the date. The remaining advance must be paid offline to the vendor at least 7 days before the booking date to confirm the booking
            </Text>
          <View style={{ flexDirection: 'row', width: "90%", alignSelf: "center", bottom: 10 }}>
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 1,
                    borderColor: 'black',
                    backgroundColor: isChecked ? '#4CAF50' : '#fff',
                    borderRadius: 3,
                  }}
                >
                  {isChecked && <Icon name="check" size={16} style={{ marginLeft: 1 }} color="white" />}
                </View>
                <Text style={{ color: "red", fontSize: 12, fontWeight: "500", bottom: 2, fontFamily: 'ManropeRegular', marginLeft: 10 }}>
                  I understand that the advance amount is <Text style={{ fontWeight: 'bold', fontFamily: 'ManropeBold' }}>non-refundable</Text> in case of cancellation.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              onClose();
              setIsChecked(false);
            }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.payButton, { opacity: isChecked ? 1 : 0.5 }]} onPress={onSubmit}
              disabled={!isChecked}
            >
              <Text style={styles.payText}>Pay Now</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'ManropeBold',
  },
  messageWrapper: {
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  modalMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'ManropeRegular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 120,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#FD813B',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FD813B',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    fontFamily: 'ManropeRegular',
  },
  payText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'ManropeRegular',
  },
});

export default PaymentConfirmationModal;
