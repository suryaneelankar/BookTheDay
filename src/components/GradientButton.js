import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { horizontalScale, moderateScale, verticalScale } from "../utils/scalingMetrics";
import RightArrow from '../assets/svgs/rightSidearrowWhite.svg';

const BookDatesButton = ({ onPress, width, text,padding }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container} >
        <LinearGradient
          colors={['#D2453B', '#A0153E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.buttonView,{width:Dimensions.get('window').width-50, padding:padding ? moderateScale(padding) : 0,alignSelf:'center'}]}
        > 
        <View style={{flexDirection:"row",alignItems:"center"}}>
          {text === 'Book Dates' ?
          <Text style={styles.buttonText}>{text}</Text>
          :
          <Text style={styles.SubmitbuttonText}>{text}</Text>
           }
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
        width:Dimensions.get('window').width
    },
    buttonView:{
        // marginHorizontal:horizontalScale(25),
        // padding:moderateScale(12),
        borderRadius:moderateScale(10),
        alignItems:"center",
 
    },
    buttonText:{
        color:"#F4F4F6",
        fontSize:14, 
        fontWeight:"800",
        fontFamily: "ManropeRegular",
        textAlign:"center"   
   },
   SubmitbuttonText:{
    color:"#F4F4F6",
    fontSize:16, 
    fontWeight:"600",
    fontFamily: "ManropeRegular",
    textAlign:"center"   
}
  })
