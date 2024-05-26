import React, {useState} from 'react';

import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';

const CustomSwitch = ({
  navigation,
  selectionMode,
  roundCorner,
  option1,
  option2,
  top,
  onSelectSwitch,
  selectionColor
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  const updatedSwitchData = val => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View>
      <View
        style={{
          width: Dimensions.get('window').width/1.8,
          backgroundColor: '#F2F2F3',
          borderRadius: getRoundCorner ? 25 : 0,
          borderWidth: 0.5,
          borderColor: '#E3E3E7',
          flexDirection: 'row',
          justifyContent: 'center',
          paddingHorizontal:10,
          paddingVertical:5,
          marginTop:top,
          alignSelf:"center"
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 1 ? selectionColor : '#F2F2F3',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
            padding:8
          }}>
          <Text
            style={{
              color: getSelectionMode == 1 ? '#FDFDFD' : '#000000',
              fontSize:14,
              fontWeight:"700",
              fontFamily: "ManropeRegular",
            }}>
            {option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 2 ? selectionColor : '#F2F2F3',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
            padding:8
          }}>
          <Text
            style={{
              color: getSelectionMode == 2 ?  '#FDFDFD' : '#000000',
              fontSize:14,
              fontWeight:"700",
              fontFamily: "ManropeRegular",

            }}>
            {option2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomSwitch;