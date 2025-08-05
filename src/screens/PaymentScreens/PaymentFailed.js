import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const PaymentFailedScreen = () => {
  const navigation = useNavigation();

  const handleRetry = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="fadeInDown"
        delay={100}
        style={styles.card}
        useNativeDriver
      >
        {/* Icon */}
        <Animatable.View animation="shake" delay={300} useNativeDriver>
          <Icon name="close-circle" size={100} color="#E63946" style={styles.icon} />
        </Animatable.View>

        {/* Header */}
        <Text style={styles.failedText}>Payment Failed</Text>

        {/* Description */}
        <Text style={styles.descriptionText}>
          Oops! Your payment couldn’t be completed. This might be due to transaction limits or technical issues.
        </Text>

        {/* Retry Button */}
        <LinearGradient colors={['#D32F2F', '#9B0000']} style={styles.retryButton}>
          <TouchableOpacity onPress={handleRetry} style={styles.buttonContent} activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Home Button */}
        <TouchableOpacity onPress={handleHome} style={styles.homeButton} activeOpacity={0.8}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: width * 0.9,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  icon: {
    marginBottom: 15,
  },
  failedText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  retryButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    borderColor: '#D32F2F',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  homeButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentFailedScreen;
