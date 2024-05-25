import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { horizontalScale, moderateScale, verticalScale } from "../utils/scalingMetrics";
import RightArrow from '../assets/svgs/rightSidearrowWhite.svg';

const BookDatesButton = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container} >
        <LinearGradient
          colors={['#D2453B', '#A0153E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonView}
        > 
        <View style={{flexDirection:"row",alignItems:"center"}}>
          <Text style={styles.buttonText}>Book Dates</Text>
          <RightArrow style={{marginHorizontal:10,marginTop:2}}/>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  export default BookDatesButton;

  const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        paddingVertical: verticalScale(15),
    },
    buttonView:{
        marginHorizontal:horizontalScale(25),
        padding:moderateScale(12),
        borderRadius:moderateScale(10),
        alignItems:"center",
 
    },
    buttonText:{
        color:"#F4F4F6",
        fontSize:14, 
        fontWeight:"800",
        fontFamily: "ManropeRegular",
        textAlign:"center"   
 }
  })
