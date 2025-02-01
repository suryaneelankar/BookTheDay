import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Alert, Linking } from 'react-native';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import axios from 'axios';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import FastImage from 'react-native-fast-image';
import { formatAmount } from '../../utils/GlobalFunctions';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import { useSelector } from 'react-redux';
import PaymentConfirmationModal from '../../components/PaymentConfirmationModal';
import LocationIcon from '../../assets/vendorIcons/locationIcon.svg';



const ViewMyBookings = () => {
  const [myBookings, setMyBookings] = useState();
  const [cateringBookings, setCateringBookings] = useState();
  const [hallsBookings, setHallsBookings] = useState();
  const [getUserAuth, setGetUserAuth] = useState('');
  const navigation = useNavigation();
  const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
  const userLoggedInName = useSelector((state) => state.userLoggedInName);
  const [selectedObjectedforPayment, setSelectedObjectedforPayment] = useState();
  const [paymentModal, setPaymentModal] = useState(false);

  const labels = ["Initiated", "Confirmed", "Payment Done"];
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
    stepIndicatorLabelCurrentColor: 'green',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#FD813B',
    labelSize: 13,
    currentStepLabelColor: '#333333',

  };

  useFocusEffect(
    useCallback(() => {
      getMyBookings();
      getCateringsBookings();
      getHallsBookings();
      // Cleanup function to run when the screen loses focus
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );

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

  const handlePayment = async (advanceAmount, bookingId, catType, vendorMobileNumber, productName, totalAmount) => {
    const token = await getUserAuthToken();
    let initiatePaymentPayload = {
      orderAmount: advanceAmount,
      currency: 'INR',
      userFullName: userLoggedInName,
      userMobileNumber: userLoggedInMobileNum,
      vendorMobileNumber: vendorMobileNumber,
      productName: productName
    };

    try {
      const initiateresponse = await axios.post(`${BASE_URL}/user/initiate-payment`, initiatePaymentPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("initiate payment  RES:::::::::", JSON.stringify(initiateresponse?.data))

      if (initiateresponse?.data) {
        try {
          // Fetch the order details from your backend
          const response = await fetch(`${BASE_URL}/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: advanceAmount, // Amount in INR
              currency: 'INR',
              receipt: 'receipt#1',
              userFullName: userLoggedInName,
              userMobileNumber: userLoggedInMobileNum,
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

          console.log('options is::>>', options);


          RazorpayCheckout.open(options)
            .then(async (paymentData) => {
              console.log('success resp::>>', paymentData);
              navigation.navigate('PaymentSuccess');
              let statusPaymentPayload = {
                orderId: initiateresponse?.data?.data?.OrderId,
                paymentStatus: "success",
                orderAdvanceAmount: advanceAmount,
                razorpay_order_id: paymentData?.razorpay_order_id,
                razorpay_payment_id: paymentData?.razorpay_payment_id,
                razorpay_signature: paymentData?.razorpay_signature,
                vendorMobileNumber: vendorMobileNumber,
                bookingId: bookingId,
                catType: catType

              };
              try {
                const response = await axios.patch(`${BASE_URL}/user/update-payment-status`, statusPaymentPayload, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },

                });
                console.log("success payment  RES:::::::::", JSON.stringify(response?.data))
              } catch (error) {
                console.log("Payment error>>::", error);
              };
              // Success callback
              // Alert.alert(`Success: ${paymentData.razorpay_payment_id}`);
              // Verify the payment on the server-side

              //   verifyPayment(paymentData);
            })
            .catch(async (error) => {
              let failurePaymentPayload = {

                orderId: initiateresponse?.data?.data?.OrderId,
                paymentStatus: "failed",
                orderAdvanceAmount: advanceAmount,
                razorpay_order_id: data?.orderId,
                razorpay_payment_id: '',
                razorpay_signature: ''

              };

              try {
                const response = await axios.patch(`${BASE_URL}/user/update-payment-status`, failurePaymentPayload, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },

                });
                console.log("failure payment  RES:::::::::", JSON.stringify(response?.data))
              } catch (error) {
                console.log("failure Payment error>>::", error);
              };
              // Failure callback
              // Alert.alert(`Error: ${error.code} | ${error.description}`);
              // navigation.navigate('PaymentSuccess');
              navigation.navigate('PaymentFailed');
              console.log(error);
            });
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Something went wrong');
        }

      }
    } catch (error) {
      console.log("Initiate Payment error>>::", error);
    };
  };

  const payDetails = (catType, advanceAmountToPay, totalAmount, securityDepositAmount) => {
    let currentPayableAmount = 0;

    if (catType === "functionHalls") {
      const serviceFeePercentage = totalAmount > 30000 ? 0.05 : 0.03; // 5% for > 30k, 3% for ≤ 30k
      currentPayableAmount = advanceAmountToPay + (totalAmount * serviceFeePercentage);
    } else if (catType === "caterings") {
      const serviceFeePercentage = totalAmount > 10000 ? 0.05 : 0.03; // 5% for > 10k, 3% for ≤ 10k
      currentPayableAmount = totalAmount * serviceFeePercentage;
    } else if (catType === "clothJewels") {
      const serviceFeePercentage = totalAmount > 10000 ? 0.05 : 0.03; // 5% for > 10k, 3% for ≤ 10k
      currentPayableAmount = securityDepositAmount + (totalAmount * serviceFeePercentage);
    }

    return currentPayableAmount;
  };

  const openMap = (lat, lon) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`, // Apple Maps for iOS
      android: `geo:0,0?q=${lat},${lon}` // Google Maps for Android
    });
    Linking.openURL(url);
  };

  const openDialPad = (number) => {
    if (Platform.OS === 'ios') {
      number = `telprompt:${number}`;
    }
    else {
      number = `tel:${number}`;
    }
    Linking.openURL(number);
  }



  const renderItem = ({ item }) => {
    const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "80%" }}>
            <View style={{ width: "35%", alignItems: "center" }}>
              <FastImage resizeMode='contain' source={{
                uri: updatedImgUrl,
                headers: { Authorization: `Bearer ${getUserAuth}` }
              }} style={styles.cardImage} />
              <Text style={[styles.cardTitle, { marginTop: 5 }]}>{formatAmount(item?.totalAmount)}</Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.cardTitle}>{item?.catType === 'caterings' ? item?.foodCateringName : item?.catType === 'functionHalls' ? item?.functionHallName : item?.productName} </Text>
              <Text style={styles.cardBalanceAmount}>{item?.catType === 'caterings' || item?.catType === 'functionHalls'
                ? item?.advanceAmountPaid > 0
                  ? 'Advance Paid:'
                  : 'Advance Amount:'
                : item?.securityDepositAmountPaid > 0
                  ? 'Security Paid:'
                  : 'Security Deposit:'} {formatAmount(item?.advanceAmountToPay ? item?.advanceAmountToPay : item?.securityDepositAmount)}</Text>
              {/* <Text style={styles.cardBalanceAmount}>{ (item?.catType === 'caterings' || item?.catType === 'functionHalls') ? 'Advance Amount:' : 'Security Deposit'} {formatAmount(item?.advanceAmountToPay ? item?.advanceAmountToPay : item?.securityDepositAmount)}</Text> */}

              {/* <Text style={styles.cardBalanceAmount}>Current Payable Amount: {payDetails(item?.catType, item?.advanceAmountToPay, item?.totalAmount, item?.securityDepositAmount)}</Text> */}
              {/* <Text style={styles.cardBalanceAmount}>Balance Amount: {formatAmount(item?.advanceAmountToPay ? (item?.totalAmount - payDetails(item?.catType, item?.advanceAmountToPay, item?.totalAmount, item?.securityDepositAmount)) : (item?.totalAmount - payDetails(item?.catType, item?.advanceAmountToPay, item?.totalAmount, item?.securityDepositAmount)))}</Text> */}

              <Text style={styles.cardBalanceAmount}>Balance Amount: {formatAmount(item?.advanceAmountToPay ? (item?.totalAmount - item?.advanceAmountToPay) : (item?.totalAmount - item?.securityDepositAmount))}</Text>

              <Text style={styles.startDate}> Start Date: {item?.startDate}</Text>
              <Text style={styles.startDate}> End Date: {item?.endDate}</Text>

              <Text style={styles.cardSubtitle}>{item.role}</Text>
            </View>
          </View>
          <Text numberOfLines={2} style={[styles.cardStatus, getStatusStyle(item.bookingStatus), { width: 75, textAlign: "center" }]}>
            {item.bookingStatus ? item.bookingStatus.charAt(0).toUpperCase() + item.bookingStatus.slice(1) : ''}
          </Text>
        </View>
        {(item?.catType === 'functionHalls' && item?.advanceAmountPaid > 0) ?
          <View style={{ flexDirection: "row", marginHorizontal: 5, marginVertical: 10 }}>
            <LocationIcon />
            <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => openMap(item?.vendorLatitude, item?.vendorLongitude)} >
              <Text numberOfLines={2} style={styles.locationText}>{item?.functionHallAddress?.address}</Text>
            </TouchableOpacity>
          </View>
          : null}

        <StepIndicator
          customStyles={customStyles}
          currentPosition={item?.bookingStatus == 'requested' ? '1' : item?.bookingStatus == 'approved' ? '2' : item?.bookingStatus == 'payment successful' ? '3' : '0'}
          labels={labels}
          stepCount={3}
        />

        <View style={styles.cardFooter}>
          <TouchableOpacity onPress={() => openDialPad('8297735285')}>
            <Text style={[styles.cardStatus, { borderWidth: 1, borderColor: "gray", paddingHorizontal: 20, fontSize: 11, color: "#666666" }]}>
              NEED HELP?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={item.bookingStatus !== 'approved'}
            onPress={() => { setPaymentModal(true), setSelectedObjectedforPayment(item) }}>
            <LinearGradient colors={item.bookingStatus === 'approved' ? ['#FE7939', '#FE7939'] : ['#B0B0B0', '#B0B0B0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.doneButton}>

              <Text style={styles.doneButtonText}>Pay Now</Text>

            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'requested':
        return { backgroundColor: '#ECA73C29', color: '#F29300' };
      case 'approved':
        return { backgroundColor: '#FE7939', color: "#FFFFFF" };
      case 'rejected':
        return { backgroundColor: '#FE353529', color: '#EF0000' };
      case 'payment successful':
        return { backgroundColor: '#45FE3529', color: "#57A64F" };
      default:
        return { backgroundColor: '#FFD580' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {(myBookings?.length > 0 || cateringBookings?.length > 0 || hallsBookings?.length > 0) ?
        <ScrollView style={{ flex: 1 }}>
          {myBookings?.length > 0 ?
            <>
              <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
                Clothes jewellery bookings
              </Text>
              <FlatList
                data={myBookings}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
              />
            </> : null}

          {cateringBookings?.length > 0 ?
            <>
              <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
                Food Catering bookings
              </Text>
              <FlatList
                data={cateringBookings}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
              />
            </> : null}

          {hallsBookings?.length > 0 ?
            <>
              <Text style={{ marginTop: 20, marginBottom: 5, marginHorizontal: 15, color: "#000000", fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular' }}>
                Halls bookings
              </Text>
              <FlatList
                data={hallsBookings}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
              />
            </> : null}

          <PaymentConfirmationModal
            visible={paymentModal}
            message={`Redirecting you to Pay Advance Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? selectedObjectedforPayment?.advanceAmountToPay : selectedObjectedforPayment?.securityDepositAmount)} \n \n \n Balance Payable Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? (selectedObjectedforPayment?.totalAmount - selectedObjectedforPayment?.advanceAmountToPay) : (selectedObjectedforPayment?.totalAmount - selectedObjectedforPayment?.securityDepositAmount))}`}
            // message={`Redirecting you to Pay Advance Amount: ${formatAmount(payDetails(selectedObjectedforPayment?.catType, selectedObjectedforPayment?.advanceAmountToPay, selectedObjectedforPayment?.totalAmount, selectedObjectedforPayment?.securityDepositAmount))} \n \n \n Balance Payable Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? (selectedObjectedforPayment?.totalAmount - payDetails(selectedObjectedforPayment?.catType, selectedObjectedforPayment?.advanceAmountToPay, selectedObjectedforPayment?.totalAmount, selectedObjectedforPayment?.securityDepositAmount)) : (selectedObjectedforPayment?.totalAmount - payDetails(selectedObjectedforPayment?.catType, selectedObjectedforPayment?.advanceAmountToPay, selectedObjectedforPayment?.totalAmount, selectedObjectedforPayment?.securityDepositAmount)))}`}
            onSubmit={() => [setPaymentModal(false), handlePayment(selectedObjectedforPayment?.advanceAmountToPay ? selectedObjectedforPayment?.advanceAmountToPay : selectedObjectedforPayment?.securityDepositAmount, selectedObjectedforPayment?.bookingId, selectedObjectedforPayment?.catType, selectedObjectedforPayment?.vendorMobileNumber, selectedObjectedforPayment?.catType === 'caterings' ? selectedObjectedforPayment?.foodCateringName : selectedObjectedforPayment?.catType === 'functionHalls' ? selectedObjectedforPayment?.functionHallName : selectedObjectedforPayment?.productName, selectedObjectedforPayment?.totalAmount)]}
            onClose={() => setPaymentModal(false)}
          />

        </ScrollView>
        :
        <View style={{ alignSelf: "center", alignItems: "center" }}>
          <Text style={{ color: "#333333", fontSize: 14, fontWeight: "500", fontFamily: 'ManropeRegular', marginTop: 50 }}>No Booking initiated yet</Text>
        </View>
      }
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
    width: '100%',
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
  cardBalanceAmount: {
    fontSize: 12,
    fontWeight: '500',
    color: "#333333",
    fontFamily: 'ManropeRegular',
    marginVertical: 3
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: "#333333",
    fontFamily: 'ManropeRegular',
    textDecorationLine: "underline",
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
    alignSelf: "flex-start",
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
