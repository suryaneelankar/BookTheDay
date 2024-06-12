import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ongoingRentals = [
  {
    id: '1',
    productName: 'Product Name',
    rentDays: 3,
    returnDate: '3 June',
    balanceDue: 200,
    image: 'jacket-image-url',
    status: 'Deposit Paid',
  },
  {
    id: '2',
    productName: 'Product Name',
    rentDays: 3,
    returnDate: '3 June',
    balanceDue: 200,
    image: 'jacket-image-url',
    status: 'Due Date',
  },
  {
    id: '3',
    productName: 'Product Name',
    rentDays: 3,
    returnDate: '3 June',
    balanceDue: 200,
    image: 'jacket-image-url',
    status: 'Deposit Paid',
  },
  {
    id: '4',
    productName: 'Product Name',
    rentDays: 3,
    returnDate: '3 June',
    balanceDue: 200,
    image: 'jacket-image-url',
    status: 'Deposit Paid',
  },
];

const ViewMyLendings = () => {
  const renderOngoingRental = ({ item }) => (
    <View style={styles.ongoingRentalCard}>
      <Image source={{ uri: item.image }} style={styles.ongoingRentalImage} />
      <View style={styles.ongoingRentalContent}>
        <Text style={styles.ongoingRentalTitle}>{item.productName}</Text>
        <Text style={styles.ongoingRentalDetails}>Rent Days: {item.rentDays}</Text>
        <Text style={styles.ongoingRentalDetails}>Return date: {item.returnDate}</Text>
        <Text style={styles.ongoingRentalDetails}>Balance Due: ₹{item.balanceDue}</Text>
        <View style={styles.ongoingRentalFooter}>
          <Text style={[styles.ongoingRentalStatus, getStatusStyle(item.status)]}>{item.status}</Text>
          <TouchableOpacity style={styles.payNowButton}>
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Deposit Paid':
        return { backgroundColor: '#32CD32' };
      case 'Due Date':
        return { backgroundColor: '#FF6347' };
      default:
        return { backgroundColor: '#FFD700' };
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ongoingRentals}
        renderItem={renderOngoingRental}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  ongoingRentalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  ongoingRentalImage: {
    height: 80,
    width: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  ongoingRentalContent: {
    flex: 1,
  },
  ongoingRentalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ongoingRentalDetails: {
    fontSize: 14,
    color: '#555555',
  },
  ongoingRentalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ongoingRentalStatus: {
    fontSize: 14,
    color: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
  },
  payNowButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 4,
  },
  payNowButtonText: {
    color: '#FFFFFF',
  },
});

export default ViewMyLendings;
