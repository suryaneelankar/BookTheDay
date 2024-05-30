import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { horizontalScale, moderateScale, verticalScale,TouchableOpacity } from '../utils/scalingMetrics';
import LinearGradient from 'react-native-linear-gradient';

export const InfoBox = ({ IconComponent, mainText, subText }) => {
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

 export  const HireDetails = ({ mainText, subText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.hireText}>{mainText}</Text>
        <Text style={styles.subText}>{subText}</Text>
      </View>
    </View>
  );
};



export const PaginationDots = ({ total, activeIndex }) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: moderateScale(5),
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: verticalScale(5),
    alignItems:"center"
  },
  text:{
    color:"#404348",
    fontSize:12,
    fontWeight:"600",
    fontFamily:'ManropeRegular'
  },
  hireText:{
   color:'#333333',
   fontSize:12,
   fontWeight:"500",
   fontFamily:'ManropeRegular',
   alignSelf:"center",
   textAlign:"center"
  },
  subText:{
    color:"#FD813B",
    fontSize:12,
    fontWeight:"600",
    fontFamily:'ManropeRegular'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginHorizontal:horizontalScale(4),
  },
  activeDot: {
    backgroundColor: '#FD813B',
    width: moderateScale(15),
  },
  inactiveDot: {
    backgroundColor: '#c4c4c4',
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


