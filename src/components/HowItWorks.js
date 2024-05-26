import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import IconBg from '../assets/svgs/howitWorkBg.svg';
import ProfileIcon from '../assets/svgs/profileRed.svg';


const HowItWorks = () => {
  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <Image
          source={{ uri: 'https://path/to/your/image1.png' }}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Select your product</Text>
          <Text style={styles.description}>Your EcoFlex host will use it to identify you at pickup.</Text>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Image
          source={{ uri: 'https://path/to/your/image2.png' }}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Book your date & time</Text>
          <Text style={styles.description}>We’ll send you a verification code to help secure your account.</Text>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Image
          source={{ uri: 'https://path/to/your/image3.png' }}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Receive Chef contact details</Text>
          <Text style={styles.description}>You must have a valid driver’s license to book on EcoFlex.</Text>
        </View>
      </View>

      <View style={styles.stepContainer}>
        <Image
          source={{ uri: 'https://path/to/your/image4.png' }}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Have Chef in your Home</Text>
          <Text style={styles.description}>You won’t be charged until you book your trip.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FDF9EE',
    borderRadius: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default HowItWorks;
