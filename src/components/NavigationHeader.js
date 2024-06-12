import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { horizontalScale , verticalScale, moderateScale} from '../utils/scalingMetrics';
import themevariable from '../utils/themevariable';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../assets/svgs/blackBackButton.svg';

const NavigationHeader = ({
  Icon,
  title,
  onPressBack,
}) => {
  const { goBack, canGoBack, navigate } = useNavigation();

  const onPressGoBack = () => {
       goBack();
     };

  return (
    <View style={[styles.container,{marginRight: Icon ? horizontalScale(40) : 0} ]}>
        {Icon ?
      <Pressable style={styles.btnContainer} onPress={onPressGoBack}>
        <BackIcon/>
      </Pressable>
      : null}
      <Text numberOfLines={1} style={styles.headerText}>
        {title}
      </Text>
    </View>
  );
};

export default NavigationHeader;

const styles = StyleSheet.create({

  container: {
    // height: verticalScale(64),
    // paddingLeft: horizontalScale(10),
    paddingVertical: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themevariable.Color_FFFFFF,
    // marginRight:  horizontalScale(40)
  },
  boxShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
  },
  image: {
    // height: verticalScale(12),
    // width: horizontalScale(16),
    // marginRight: horizontalScale(14),
  },
  btnContainer: {
    // height: moderateScale(44),
    width: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: "ManropeRegular",
    fontWeight:"700",
    fontSize: moderateScale(20),
    flex: 1,
    color: '#1A1E25',
    alignSelf:"center",
    textAlign:"center"
  },
});
