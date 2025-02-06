import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import themevariable from '../utils/themevariable';
import BookDatesButton from './GradientButton';

const CustomModal = ({ visible, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          {/* <BookDatesButton
                onPress={onClose}
                text={'Save Combo'}
                padding={10}
                showIcon={false}

            /> */}
          <Button title="OK" onPress={onClose} />
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
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color:themevariable.Color_000000,
  },
});

export default CustomModal;
