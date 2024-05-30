import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import EditButton from '../../assets/svgs/categories/editButton.svg';

const BookingDetailsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={{flexDirection:"row"}}>
        <Text style={styles.address}>26, Duong So 2, Thao Dien Ward, An Phu, District 2, Ho Chi Minh city</Text>
        <EditButton/>
        </View>
      </View>

      <View style={[styles.imgsection]}>
        <View style={styles.productContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.productImage} />
          <View style={styles.productDetails}>
            <Text style={styles.productTitle}>Gold Necklace</Text>
            <Text style={styles.productSubTitle}>Pink, Size M</Text>
            <Text style={styles.productPrice}>₹ 700 /day</Text>
            <View style={styles.dateContainer}>
              {/* <Icon name="calendar-outline" size={14} color="#FFB156" /> */}
              <Text style={styles.dateText}>26 Feb - 26 Mar 2023</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Rent / Day</Text>
          <Text style={styles.priceDetailValue}>₹ 2000</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>No. rental days</Text>
          <Text style={styles.priceDetailValue}>2 days</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Total rent to be paid</Text>
          <Text style={styles.priceDetailValue}>₹ 4000</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Delivery charges</Text>
          <Text style={styles.priceDetailValue}>₹ 400</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Grand Total</Text>
          <Text style={styles.priceDetailValue}>₹ 4500</Text>
        </View>
        <Text style={styles.note}>*Inclusive of all taxes and GST</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confirm Your Booking</Text>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Security deposit</Text>
          <Text style={styles.priceDetailValue}>₹ 200</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Platform charges</Text>
          <Text style={styles.priceDetailValue}>₹ 100</Text>
        </View>
        <View style={styles.priceDetailRow}>
          <Text style={styles.priceDetailLabel}>Total Deposit</Text>
          <Text style={styles.priceDetailValue}>₹ 300</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Image source={{ uri: 'https://via.placeholder.com/200x100' }} style={styles.bannerImage} />
        <Text style={styles.bannerText}>Support For Porters</Text>
        <Text style={styles.bannerSubText}>Service charges we charge is provided for our porters.</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>Security Deposit confirms your order 90%</Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={[styles.button, styles.payLaterButton]}>
            <Text style={styles.buttonText}>Pay Later</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmBookingButton]}>
            <Text style={styles.buttonText}>Confirm Booking | ₹ 300</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
  },
  section: {
    backgroundColor: '#F9F9F9',
    paddingHorizontal:15,
    paddingVertical:10,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal:20,
    marginTop:10
  },
  imgsection: {
    backgroundColor: 'white',
    paddingHorizontal:5,
    paddingVertical:5,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal:20,
    marginTop:10,
    elevation:1.5
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color:"#202020",
    fontFamily: "ManropeRegular",
  },
  address: {
    fontSize: 14,
    fontWeight:"400",
    color: '#000000',
    fontFamily: "ManropeRegular",
    width:"90%"
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: Dimensions.get('window').width/4.5,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productSubTitle: {
    fontSize: 14,
    color: '#7E7E7E',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FFB156',
  },
  priceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceDetailLabel: {
    fontSize: 14,
    color: '#7E7E7E',
  },
  priceDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#7E7E7E',
    marginTop: 8,
  },
  bannerImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerSubText: {
    fontSize: 12,
    color: '#7E7E7E',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  footerNote: {
    fontSize: 12,
    color: '#7E7E7E',
    marginBottom: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  payLaterButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  confirmBookingButton: {
    backgroundColor: '#D9534F',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default BookingDetailsScreen;
