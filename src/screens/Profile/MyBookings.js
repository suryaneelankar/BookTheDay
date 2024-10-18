import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Alert } from 'react-native';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import axios from 'axios';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import FastImage from 'react-native-fast-image';
import { formatAmount } from '../../utils/GlobalFunctions';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation } from '@react-navigation/native';

const data = [
  { id: '1', name: 'Mr. Riya Trivedi', role: 'Chef - Accord', rating: 4.5, status: 'Requested', image: 'chef-image-url' },
  { id: '2', name: 'Mr. Riya Trivedi', role: 'Price', rating: 4.5, status: 'Approved', image: 'price-image-url' },
  { id: '3', name: 'Mr. Riya Trivedi', role: 'Chef - Accord', rating: 4.5, status: 'Requested', image: 'chef-image-url' },
  { id: '4', name: 'Mr. Riya Trivedi', role: 'Chef - Accord', rating: 4.5, status: 'Rejected', image: 'rejected-image-url' },
];

const ongoingRental = {
  productName: 'Product Name',
  rentDays: 3,
  returnDate: '3 June',
  balanceDue: 200,
  image: 'jacket-image-url',
  status: 'Deposit Paid',
};



const ViewMyBookings = () => {
  const [myBookings, setMyBookings] = useState();
  const [decorsBookings, setDecorsBookings] = useState();
  const [cateringBookings, setCateringBookings] = useState();
  const [hallsBookings, setHallsBookings] = useState();
  const [tentHouseBookings, settentHouseBookings] = useState();
  const [getUserAuth, setGetUserAuth] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    getMyBookings();
    getCateringsBookings();
    getHallsBookings();
  }, []);

  const getMyBookings = async () => {
    const token = await getUserAuthToken();
    setGetUserAuth(token);
    try {
      const response = await axios.get(`${BASE_URL}/getUserClothJewelBookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("BOOKINGS RES:::::::::", JSON.stringify(response?.data))
      setMyBookings(response?.data?.data)
    } catch (error) {
      console.log("My Bookings data error>>::", error);
    }
  };

  const getCateringsBookings = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(`${BASE_URL}/getUserFoodCateringBookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("catering BOOKINGS RES:::::::::", JSON.stringify(response?.data))
      setCateringBookings(response?.data?.data)
    } catch (error) {
      console.log("My Bookings data error>>::", error);
    }
  };

  const getHallsBookings = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(`${BASE_URL}/getUserFunctionHallBookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Funtional halls BOOKINGS RES:::::::::", JSON.stringify(response?.data))
      setHallsBookings(response?.data?.data)
    } catch (error) {
      console.log("My Bookings data error>>::", error);
    }
  };

  const handlePayment = async () => {
    try {
      // Fetch the order details from your backend
      const response = await fetch(`${BASE_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 1, // Amount in INR
          currency: 'INR',
          receipt: 'receipt#1'
        })
      });

      const data = await response.json();
      console.log('razor pay data is ::>>', data);
      // Start the Razorpay payment process
      var options = {
        description: 'Test Transaction',
        image: 'https://your-logo-url.com/logo.png',
        currency: data.currency,
        key: 'rzp_test_SFQjGVsyEZ2P05', // Your Razorpay Key ID
        amount: data.amount, // Amount in smallest currency unit
        order_id: data.orderId, // Order ID returned from backend
        name: 'Book the day',
        prefill: {
          email: 'bookthedaytechnologies@gmail.com',
          contact: '8297735285',
          name: 'Surya Neelankar',
          //   method: 'upi',  // Pre-select UPI as the payment method
          vpa: ''
        },
        theme: { color: '#FFDB7E' }
      };

      console.log('options is::>>', options)

      RazorpayCheckout.open(options)
        .then((paymentData) => {
          // Success callback
          // Alert.alert(`Success: ${paymentData.razorpay_payment_id}`);
          // Verify the payment on the server-side
          console.log('success resp::>>', paymentData);
          navigation.navigate('PaymentSuccess');
          //   verifyPayment(paymentData);
        })
        .catch((error) => {
          // Failure callback
          // Alert.alert(`Error: ${error.code} | ${error.description}`);
          // navigation.navigate('PaymentSuccess');
          navigation.navigate('PaymentFailed');
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };


  const renderItem = ({ item }) => {
    const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

    return (
      <View style={styles.card}>
        <FastImage resizeMode='cover' source={{
          uri: updatedImgUrl,
          headers: { Authorization: `Bearer ${getUserAuth}` }
        }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item?.productName}</Text>
          <Text style={styles.cardAmount}>{formatAmount(item?.totalAmount)}</Text>

          <Text style={styles.startDate}> Start Date: {item?.startDate}</Text>
          <Text style={styles.startDate}> End Date: {item?.endDate}</Text>

          <Text style={styles.cardSubtitle}>{item.role}</Text>
          <View style={styles.cardFooter}>
            <Text style={[styles.cardStatus, getStatusStyle(item.bookingStatus)]}>
              {item.bookingStatus ? item.bookingStatus.charAt(0).toUpperCase() + item.bookingStatus.slice(1) : ''}
            </Text>
            <LinearGradient colors={item.bookingStatus === 'approved' ? ['#D2453B', '#A0153E'] : ['#B0B0B0', '#B0B0B0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneButton}>
              <TouchableOpacity disabled={item.bookingStatus !== 'approved'} onPress={() => { handlePayment() }}>
                <Text style={styles.doneButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </LinearGradient>

          </View>
        </View>
      </View>
    )
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'requested':
        return { backgroundColor: '#ECA73C29', color: '#F29300' };
      case 'approved':
        return { backgroundColor: '#45FE3529', color: "#57A64F" };
      case 'rejected':
        return { backgroundColor: '#FE353529', color: '#EF0000' };
      default:
        return { backgroundColor: '#FFD580' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>

        <ScrollView style={{ flex: 1 }}>
          <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
            Clothes jewellery bookings
          </Text>
          <FlatList
            data={myBookings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />

          <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
            Food Catering bookings
          </Text>
          <FlatList
            data={cateringBookings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
          <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
            Halls bookings
          </Text>
          <FlatList
            data={hallsBookings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: '#F3F5FB',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
  },
  cardImage: {
    height: Dimensions.get('window').height / 5,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  startDate: {
    color: "#878787",
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'ManropeRegular'
  },

  cardContent: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: "#333333",
    fontFamily: 'ManropeRegular'
  },
  cardAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: "#333333",
    fontFamily: 'ManropeRegular',
    marginVertical: 5
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardRating: {
    fontSize: 14,
    color: '#FFA500',
  },
  cardStatus: {
    padding: 4,
    borderRadius: 5,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: "400",
    fontFamily: 'ManropeRegular',
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  doneButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ongoingRentalCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
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
    color: '#32CD32',
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

export default ViewMyBookings;
