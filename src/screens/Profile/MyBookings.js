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
import StepProgress from '../../components/StepProgress';
import StepIndicator from 'react-native-step-indicator';




const ViewMyBookings = () => {
  const [myBookings, setMyBookings] = useState();
  const [decorsBookings, setDecorsBookings] = useState();
  const [cateringBookings, setCateringBookings] = useState();
  const [hallsBookings, setHallsBookings] = useState();
  const [tentHouseBookings, settentHouseBookings] = useState();
  const [getUserAuth, setGetUserAuth] = useState('');
  const navigation = useNavigation();

  const labels = ["Initiated", "Confirmed", "Payment Pending"];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#FD813B',
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: '#FD813B',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#FD813B',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#FD813B',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#FD813B',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#FD813B',
    
  };
  
  const [currentPosition, setCurrentPosition] = useState(0);



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
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "80%" }}>
            <FastImage resizeMode='cover' source={{
              uri: updatedImgUrl,
              headers: { Authorization: `Bearer ${getUserAuth}` }
            }} style={styles.cardImage} />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.cardTitle}>{item?.catType === 'caterings' ? item?.foodCateringName : item?.catType === 'functionhall' ? item?.functionHallName : item?.productName} </Text>
              <Text style={styles.cardAmount}>{formatAmount(item?.totalAmount)}</Text>

              <Text style={styles.startDate}> Start Date: {item?.startDate}</Text>
              <Text style={styles.startDate}> End Date: {item?.endDate}</Text>

              <Text style={styles.cardSubtitle}>{item.role}</Text>
            </View>
          </View>
          <Text style={[styles.cardStatus, getStatusStyle(item.bookingStatus)]}>
            {item.bookingStatus ? item.bookingStatus.charAt(0).toUpperCase() + item.bookingStatus.slice(1) : ''}
          </Text>
        </View>

        <StepIndicator
          customStyles={customStyles}
          currentPosition={item?.bookingStatus == 'requested' ? '1' : item?.bookingStatus == 'approved' ? '2': '1'}
          labels={labels}
          stepCount={3}
        />


        {/* <StepProgress status={item?.bookingStatus} /> */}

        <View style={styles.cardFooter}>
          <Text style={[styles.cardStatus, { borderWidth: 1, borderColor: "gray", paddingHorizontal: 20 ,fontSize:11}]}>
            NEED HELP?
          </Text>
          <LinearGradient colors={item.bookingStatus === 'approved' ? ['#FE7939', '#FE7939'] : ['#B0B0B0', '#B0B0B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButton}>
            <TouchableOpacity disabled={item.bookingStatus !== 'approved'} onPress={() => { handlePayment() }}>
              <Text style={styles.doneButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </LinearGradient>
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

      <ScrollView style={{ flex: 1 }}>
        <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
          Clothes jewellery bookings
        </Text>
        <FlatList
          data={myBookings}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id}
        />

        <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
          Food Catering bookings
        </Text>
        <FlatList
          data={cateringBookings}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id}
        />
        <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
          Halls bookings
        </Text>
        <FlatList
          data={hallsBookings}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id}
        />
      </ScrollView>
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
    paddingHorizontal: 10
  },
  cardImage: {
    height: Dimensions.get('window').height / 10,
    width: '30%',
    borderRadius: 10,
  },
  startDate: {
    color: "#878787",
    fontSize: 10,
    fontWeight: '300',
    fontFamily: 'ManropeRegular'
  },

  cardContent: {
    marginTop: 10,
    marginBottom: 15
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
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 15,
    alignSelf: "center",
    width: "65%",
    justifyContent: "space-around",
    paddingBottom: 15,
  },
  cardRating: {
    fontSize: 14,
    color: '#FFA500',
  },
  cardStatus: {
    borderRadius: 5,
    fontSize: 10,
    fontWeight: "400",
    fontFamily: 'ManropeRegular',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start"
  },
  doneButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
    paddingHorizontal: 15
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
