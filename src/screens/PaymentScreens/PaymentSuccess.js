import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons

const PaymentSuccess = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Navigate to the home or any other screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkmark-circle" size={100} color="#4CAF50" />
      </View>

      <Text style={styles.successText}>Payment Successful!</Text>

      <Text style={styles.descriptionText}>
        Thank you for your payment. Your transaction has been completed.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentSuccess;


