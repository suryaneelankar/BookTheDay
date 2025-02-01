import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentFailedScreen = () => {
  const navigation = useNavigation();

  const handleRetry = () => {
    navigation.navigate('ViewMyBookings');
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Failure Icon */}
      <View style={styles.iconContainer}>
        <Icon name="close-circle-outline" size={110} color="#E63946" />
      </View>

      {/* Failure Text */}
      <Text style={styles.failedText}>Payment Unsuccessful</Text>

      {/* Description */}
      <Text style={styles.descriptionText}>
        Oops! We couldn’t process your payment. Please try again.
      </Text>

      {/* Retry Payment Button (Gradient Red) */}
      <LinearGradient colors={['#D32F2F', '#9B0000']} style={styles.retryButton}>
        <TouchableOpacity style={styles.buttonContent} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Home Button (White with Red Border) */}
      <TouchableOpacity style={styles.homeButton} onPress={handleHome} activeOpacity={0.8}>
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingVertical:30
  },
  iconContainer: {
    marginBottom: 25,
    shadowColor: '#D32F2F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  failedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 35,
    paddingHorizontal: 15,
    lineHeight: 24,
  },
  retryButton: {
    borderRadius: 12,
    width: '80%',
    overflow: 'hidden',
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF', // White Text
    fontSize: 17,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#FFFFFF', // White Background
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D32F2F', // Red Border
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#D32F2F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  homeButtonText: {
    color: '#D32F2F', // Red Text
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default PaymentFailedScreen;
