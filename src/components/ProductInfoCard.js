import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductInfoCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.value}>1</Text>
        <Text style={styles.label}>Qty Available</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <Text style={styles.value}>(M) 32cm</Text>
        <Text style={styles.label}>Size</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <View style={styles.colorCircle} />
        <Text style={styles.label}>Color</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  item: {
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  label: {
    fontSize: 12,
    color: '#7E7E7E',
  },
  separator: {
    height: '100%',
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DAA520', // Golden color
    marginBottom: 4,
  },
});

export default ProductInfoCard;