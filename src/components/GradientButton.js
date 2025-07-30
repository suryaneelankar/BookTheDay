import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale } from "../utils/scalingMetrics";
import RightArrow from '../assets/svgs/rightSidearrowWhite.svg';
import Arrowright from 'react-native-vector-icons/AntDesign';

const BookDatesButton = ({ onPress, width, text, padding, disabled, showIcon = true, buttonStyle, gradientButtonStyle }) => {

  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    try {
      await onPress(); // Ensure `onPress` is an async function
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, buttonStyle]} disabled={disabled}>
      <LinearGradient
        colors={['#D2453B', '#A0153E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.buttonView, { width: Dimensions.get('window').width - 50, padding: padding ? moderateScale(padding) : 0, alignSelf: 'center' },gradientButtonStyle]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator color="#F4F4F6" />
          ) : (
            <View style={{ flex: 1, alignItems: "center",justifyContent:"center", flexDirection: "row",position: "relative" }}>
              <Text style={text === "Book Dates" ? styles.buttonText : styles.SubmitbuttonText}>
                {text}
              </Text>
              {showIcon && <Arrowright name='arrowright' color={'#FFF'} size={24} style={{ position: "absolute", right: 10 }} />}
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default BookDatesButton;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    paddingVertical: verticalScale(15),
    width: Dimensions.get('window').width,
    alignSelf: "center"
  },
  buttonView: {
    // marginHorizontal:horizontalScale(25),
    // padding:moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: "center",

  },
  buttonText: {
    color: "#F4F4F6",
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "ManropeRegular",
    textAlign: "center"
  },
  SubmitbuttonText: {
    color: "#F4F4F6",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "ManropeRegular",
    textAlign: "center"
  }
})
