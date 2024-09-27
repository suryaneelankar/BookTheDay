import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ThankYouCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBackground}>
          <Image source={{ uri: 'thumbs_up_icon_url' }} style={styles.icon} />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>S</Text>
          </View>
        </View>
      </View>
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.subtitle}>Your Booking Initiated.</Text>
      <Text style={styles.description}>Our team will deliver the update to you in less than 2 hours</Text>
      <LinearGradient colors={['#FF6F61', '#D72E8A']} style={styles.doneButton}>
        <TouchableOpacity>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 40,
    height: 40,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FF6F61',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  doneButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  trackProgressText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default ThankYouCard;
