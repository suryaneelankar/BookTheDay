import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { formatAmount } from '../utils/GlobalFunctions';

const PricingOptions = ({ onSelect ,dailyPrice,monthlyPrice}) => {
  const [selectedOption, setSelectedOption] = useState('daily');
  const [selectedPrice, setSelectedPrice] = useState(600);

  const handleSelect = (option, price) => {
    setSelectedOption(option);
    setSelectedPrice(price);
    if (onSelect) {
      onSelect(option, price);
    }
  };

  return (
    <View style={styles.container}>
      {dailyPrice ?
      <TouchableOpacity
        style={[styles.optionContainer, selectedOption === 'daily' && styles.selectedOption]}
        onPress={() => handleSelect('daily', 300)}
      >
        <View style={[styles.radioButton,{borderColor: selectedOption === 'daily' ? "#CC403C" : "gray"}]}>
          {selectedOption === 'daily' && <View style={styles.radioButtonSelected} />}
        </View>
        <Text style={styles.optionText}>Daily</Text>
        <View style={styles.chargeContainer}>
          <Text style={styles.chargeLabel}>Per Day Charges</Text>
        </View>
        <Text style={styles.priceText}>{formatAmount(dailyPrice)}</Text>
      </TouchableOpacity> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal:15,
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:10,
    // padding: 16,
    backgroundColor: '#fff',
    // // borderRadius: 8,
    // marginHorizontal:20,
    
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: 13,
    borderWidth: 1,
    borderColor: '#FFDA56',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#FFF4CF',
    borderColor: '#FFDA56',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CC403C',
  },
  optionText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
    width:Dimensions.get('window').width/3.9,
    marginLeft: 8,
  },
  chargeContainer: {
    backgroundColor: '#FFF5E3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chargeLabel: {
    fontSize: 13,
    color: '#FD813B',
    fontWeight: '500',
    fontFamily: 'ManropeRegular',
  },
  priceText: {
    fontSize: 16,
    color: '#101010',
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
    marginLeft:10
  },
});

export default PricingOptions;
