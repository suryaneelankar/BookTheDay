import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons

const PaymentFailedScreen = () => {
  const navigation = useNavigation();

  const handleRetry = () => {
    // Navigate to the payment retry or any other screen
    // navigation.navigate('Payment');
  };

  const handleHome = () => {
    // Navigate to the home screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="close-circle" size={100} color="#FF4C4C" />
      </View>

      <Text style={styles.failedText}>Payment Failed</Text>

      <Text style={styles.descriptionText}>
        Oops! Something went wrong. Please try again later or contact support.
      </Text>

      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.buttonText}>Retry Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
        <Text style={styles.buttonText}>Go to Home</Text>
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
  failedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4C4C',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  retryButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  homeButton: {
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

export default PaymentFailedScreen;