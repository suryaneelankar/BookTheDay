import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { height, moderateScale } from '../utils/scalingMetrics';
import BASE_URL, { LocalHostUrl } from '../apiconfig';
import FastImage from 'react-native-fast-image';

const Avatar = ({widthDyn,heightDyn,borderRadiusDyn, name, imageUrl }) => {
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : '';
    const lastNameInitial = nameParts[1] ? nameParts[1][0] : '';
    return firstNameInitial + lastNameInitial;
  };

  const initials = getInitials(name).toUpperCase();
  // console.log("VADATR IMAGE:::::", imageUrl)
const updatedImgUrl = imageUrl !== undefined ? imageUrl.replace('localhost', LocalHostUrl) : imageUrl;
  return (
    <View style={[styles.container,{width:widthDyn, height:heightDyn, borderRadius:borderRadiusDyn}]}>
      {updatedImgUrl ? (
        <FastImage source={{ uri: updatedImgUrl }} style={[styles.image, { width: widthDyn, height: heightDyn, borderRadius: borderRadiusDyn }]} />
      ) : (
        <Svg height="100" width="100">
          <Circle cx="50" cy="50" r="50" fill="#FEF7DE" />
          <SvgText
            x="50"
            y="55"
            fontSize="21"
            fill="#BD7928"
            textAnchor="middle"
          >
            {initials}
          </SvgText>
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: widthDyn,
    // height: moderateScale(height),
    // borderRadius: borderRadius,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default Avatar;
