import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoBox = ({ IconComponent, mainText, subText }) => {
  return (
    <View style={styles.container}>
      <IconComponent />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{mainText}</Text>
        <Text style={styles.text}>{subText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 5,
  },
  text:{
    color:"#404348",
    fontSize:12,
    fontWeight:"600",
    fontFamily:'ManropeRegular'
  }
});

export default InfoBox;
