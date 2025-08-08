import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Alert, Linking, TextInput } from 'react-native';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import axios from 'axios';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import FastImage from 'react-native-fast-image';
import { formatAmount } from '../../utils/GlobalFunctions';
import RazorpayCheckout from 'react-native-razorpay';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import { useSelector } from 'react-redux';
import PaymentConfirmationModal from '../../components/PaymentConfirmationModal';
import LocationIcon from '../../assets/vendorIcons/locationIcon.svg';
import PayNowButton from './PayNowButton';
import ActionSheet from 'react-native-actions-sheet';
import FloatingCloseButton from '../Events/floatingCloseButton';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const actionSheetRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const cancellationReasons = [
    'Change in event plans',
    'Found a better venue',
    'Price too high',
    'Need to reschedule',
    'Want to modify the package',
    'Personal emergency',
    'Booked by mistake',
    'Other (Please specify...)',
  ];

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
      // console.log("catering BOOKINGS RES:::::::::", JSON.stringify(response?.data))
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

  // cancel-function-hall-booking

  const cancelFunctionHallBooking = async (bookingId) => {
    const token = await getUserAuthToken();
    const reasonToSend = selectedReason === "Other" ? otherReasonText : selectedReason;

    const bookingParams = {
      bookingId: bookingId,
      cancelReason: reasonToSend,
    };

    console.log('bookingParams is ::>>', bookingParams);

    try {
      const cancelBookingResp = await axios.post(
        `${BASE_URL}/cancel-function-hall-booking`,
        bookingParams,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("cancelBookingResp RES:::::::::", JSON.stringify(cancelBookingResp?.data));
      if (cancelBookingResp?.data?.status === 200) {
        actionSheetRef.current?.hide();
        Alert.alert(
          "Success",
          "Booking cancelled successfully!",
          [
            {
              text: "Ok", onPress: () => {
                setSelectedBookingId(null);
                setSelectedReason('');
                setOtherReasonText('');
                getHallsBookings();
                setIsChecked(false);
              }
            }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong while cancelling the booking");
      console.log("cancelBookingResp error>>::", error?.response?.data || error);
    }
  };


  const fetchRazorpayKey = async () => {
    const res = await fetch(`${BASE_URL}/razorpay-key`);
    const data = await res.json();
    console.log('Razorpay key data is ::>>', data);
    return data;
  };

  const handlePayment = async (advanceAmount, bookingId, catType, vendorMobileNumber, productName, totalAmount) => {
    const token = await getUserAuthToken();
    const { key, defaultMethod } = await fetchRazorpayKey();
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
            key: key, // Your Razorpay Key ID
            amount: data.amount, // Amount in smallest currency unit
            order_id: data.orderId, // Order ID returned from backend
            name: 'Book the day',
            prefill: {
              email: 'bookthedaytechnologies@gmail.com',
              contact: userLoggedInMobileNum,
              name: userLoggedInName,
              method: defaultMethod,  // Pre-select UPI as the payment method
              // vpa: ''
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

  const openMap = (lat, lon) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`, // Apple Maps for iOS
      android: `geo:0,0?q=${lat},${lon}` // Google Maps for Android
    });
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const updatedImgUrl = item?.professionalImage?.url;

    const bookingDate = item?.startDate; // e.g., "24 April 2025"
    const today = moment();
    const parsedBookingDate = moment(bookingDate, 'DD MMMM YYYY');
    const diffInDays = parsedBookingDate.diff(today, 'days');

    const canCancel = diffInDays >= 7 && (item.bookingStatus !== 'cancelled') && (item.bookingStatus !== 'rejected');

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ flexDirection: "row", width: "80%" }}>
            <View style={{ width: "35%", alignItems: "center" }}>
              <FastImage resizeMode='contain' source={{
                uri: updatedImgUrl,
              }} style={styles.cardImage} />
              <Text style={[styles.cardTitle, { marginTop: 5 }]}>{formatAmount(item?.totalAmount)}</Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.cardTitle}>{item?.catType === 'caterings' ? item?.foodCateringName : item?.catType === 'functionHalls' ? item?.functionHallName : item?.productName} </Text>
              <Text style={styles.cardBalanceAmount}>{item?.catType === 'caterings' || item?.catType === 'functionHalls'
                ? item?.advanceAmountPaid > 0
                  ? 'Advance Paid: '
                  : 'Advance Amount: '
                : item?.securityDepositAmountPaid > 0
                  ? 'Security Paid: '
                  : 'Security Deposit: '}
                <Text style={{ fontWeight: 'bold', color: '#2E7D32', fontFamily: 'ManropeBold' }}>
                  <Text>{formatAmount(item?.advanceAmountToPay ? item?.advanceAmountToPay : item?.securityDepositAmount)}</Text>
                </Text>
              </Text>

              <Text style={styles.cardBalanceAmount}>Balance Amount:
                <Text>{' '}</Text>
                <Text style={{ fontWeight: 'bold', color: '#C62828', fontFamily: 'ManropeBold' }}>
                  {formatAmount(item?.advanceAmountToPay ? ` ${(item?.totalAmount - item?.advanceAmountToPay)}` : `  ${(item?.totalAmount - item?.securityDepositAmount)}`)}
                </Text>
              </Text>
              {item?.catType === 'caterings' || item?.catType === 'functionHalls' ?
                <Text style={styles.startDate}>Booking Date: <Text style={{ fontWeight: 'bold', color: '#2E7D32', fontFamily: 'ManropeBold' }}>{item?.startDate}</Text></Text> :
                <>
                  <Text style={styles.startDate}> Start Date: {item?.startDate}</Text>
                  <Text style={styles.startDate}> End Date: {item?.endDate}</Text>
                </>
              }
              <Text style={[styles.startDate, { marginTop: 5 }]}>Booking Id: {item?.bookingId}</Text>

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
          <TouchableOpacity style={{ backgroundColor: "#fff", }}
            // onPress={() => cancelFunctionHallBooking(item?.bookingId)}
            onPress={() => { setSelectedBookingId(item.bookingId); actionSheetRef.current?.show() }}
            disabled={canCancel ? false : true} // Disable if not cancelable or not in requested/approved status
            activeOpacity={canCancel ? 1 : 0.5} // Add this line to change opacity on press
          >
            <Text style={[styles.cardStatus, { borderWidth: 1, borderColor: canCancel ? "#A0153E" : "#999", paddingHorizontal: 20, fontSize: 11, color: canCancel ? "#A0153E" : "#999" }]}>
              Cancel Booking
            </Text>
          </TouchableOpacity>
          <PayNowButton
            onPress={() => {
              console.log('selected item is::>>>',item);
              const yourObjectWithDetails = {
                totalAmount: item?.totalAmount,
                advanceAmountToPay: item?.advanceAmountToPay,
                securityDepositAmount: item?.securityDepositAmount,
                vendorName: item?.vendorName ?? item?.functionHallName ?? item?.foodCateringName ?? item?.productName,
                bookingId: item?.bookingId,
                productName: item?.productName ?? item?.functionHallName ?? item?.foodCateringName,
                startDate: item?.startDate,
                endDate: item?.endDate,
                catType: item?.catType,
                vendorMobileNumber: item?.vendorMobileNumber,
                foodCateringName: item?.foodCateringName ?? '',
                functionHallName: item?.functionHallName ?? '',

              };
              navigation.navigate('BookingReview', {
              selectedBooking: yourObjectWithDetails
            })
            // setSelectedObjectedforPayment(item);
          }
        }
            text={'Pay Now'}
            showIcon={false}
            disabled={item.bookingStatus !== 'approved'}
          />
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

  // const TotalAmountToShow = () => {
  //   const advance = selectedObjectedforPayment?.advanceAmountToPay;
  //   const deposit = selectedObjectedforPayment?.securityDepositAmount;

  //   const amountToShow =
  //     advance !== null && advance !== undefined
  //       ? advance > 10000
  //         ? 10000
  //         : advance
  //       : deposit > 10000
  //         ? 10000
  //         : deposit;

  //   return formatAmount(amountToShow);
  // };



  // const isCancelable = dayjs(item.bookingDate).diff(dayjs(), 'day') >= 7;

  return (
    <SafeAreaView style={styles.container}>
      <ActionSheet
        ref={actionSheetRef}
        statusBarTranslucent
        closeOnPressBack
        defaultOverlayOpacity={0.5}
        height={Dimensions.get("window").height - 20}
        containerStyle={styles.actionSheetContainer}
      >
        <View>
          <FloatingCloseButton onPress={() => actionSheetRef.current?.hide()} />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

          <View style={{ padding: 16 }}>
            <Text style={[styles.cardStatus, { fontSize: 16, color: "#000000" }]}>
              Choose the reason for cancellation
            </Text>
            {cancellationReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedReason(reason)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 8,
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#A0153E',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  {selectedReason === reason && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: '#A0153E',
                      }}
                    />
                  )}
                </View>
                <Text style={{ color: "#4D4D4D", fontSize: 16, fontWeight: "500", fontFamily: 'ManropeRegular' }}>{reason}</Text>
              </TouchableOpacity>
            ))}
            {selectedReason === 'Other (Please specify...)' && (
              <>
                <Text style={{ color: "#666666", fontSize: 16, fontWeight: "500", fontFamily: 'ManropeRegular' }}>Please specify the reason</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Please specify your reason"
                  value={otherReasonText}
                  onChangeText={setOtherReasonText}
                />
              </>
            )}
          </View>

          <View style={{ flexDirection: 'row', width: "90%", alignSelf: "center" }}>
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: 'black',
                    backgroundColor: isChecked ? '#4CAF50' : '#fff',
                    justifyContent: 'center',
                    borderRadius: 5
                  }}
                >
                  {isChecked && <Icon name="check" size={16} style={{ marginLeft: 3 }} color="white" />}
                </View>
                <Text style={{ color: "#4D4D4D", fontSize: 16, fontWeight: "500", fontFamily: 'ManropeRegular', marginLeft: 10 }}>
                  I agree that the advance amount paid is <Text style={{ fontWeight: 'bold', fontFamily: 'ManropeBold' }}>non-refundable</Text> upon cancellation.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#A0153E',
              padding: 12,
              borderRadius: 8,
              marginTop: 20,
              alignItems: 'center',
              width: "80%",
              alignSelf: "center",
              opacity: selectedReason && selectedBookingId ? 1 : 0.5, // Disable button if no reason or booking ID is selected
            }}
            disabled={!selectedReason || !selectedBookingId}
            onPress={() => {
              if (selectedReason === "Other (Please specify...)" && !otherReasonText.trim()) {
                Alert.alert(
                  "Alert",
                  "Please enter your custom reason!",
                  [
                    {
                      text: "Ok", onPress: () => {
                      }
                    }
                  ],
                  { cancelable: false }
                );
                return;
              }
              if (isChecked === false) {
                Alert.alert(
                  "Alert",
                  "Please agree the terms & conditions upon cancellation.",
                  [
                    {
                      text: "Ok", onPress: () => {
                      }
                    }
                  ],
                  { cancelable: false }
                );
                return;
              }
              if (selectedReason) {
                // Are you sure? This will cancel your booking and apply the refund policy mentioned
                Alert.alert(
                  "Alert",
                  "Are you sure you want to cancel the booking? This will apply the refund policy mentioned.",
                  [
                    {
                      text: "Cancel", onPress: () => { }
                    },
                    {
                      text: "Yes", onPress: () => {
                        cancelFunctionHallBooking(selectedBookingId);
                      }
                    }
                  ],
                  { cancelable: false }
                );
              }
            }}
          >

            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm Cancellation</Text>
          </TouchableOpacity>

        </ScrollView>
      </ActionSheet>
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

          {/* <PaymentConfirmationModal
            visible={paymentModal}
            // message={`Redirecting you to Pay Advance Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? selectedObjectedforPayment?.advanceAmountToPay : selectedObjectedforPayment?.securityDepositAmount)} \n \n \n Balance Payable Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? (selectedObjectedforPayment?.totalAmount - selectedObjectedforPayment?.advanceAmountToPay) : (selectedObjectedforPayment?.totalAmount - selectedObjectedforPayment?.securityDepositAmount))}`}
            message={
              // UPI transactions are limited to ₹50,000. You’ll pay ₹50,000 now via UPI.
              // Please pay the remaining ₹{advanceAmount - 50000} directly to the vendor offline.
              selectedObjectedforPayment?.advanceAmountToPay > 50000 || selectedObjectedforPayment?.securityDepositAmount > 50000 ?
                <Text style={{ textAlign: 'center', fontSize: 16, color: '#333', fontFamily: 'ManropeRegular' }}>
                  <Text>You’re being redirected to pay the partial advance amount to block the date:</Text>
                  {'\n\n'}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E7D32', fontFamily: 'ManropeBold' }}>
                    {' '}
                    {TotalAmountToShow()}
                  </Text>
                  <></>

                  {'\n\n'}
                  Remaining balance payable at the venue:
                  {'\n\n'}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#C62828', fontFamily: 'ManropeBold' }}>
                    {' '}
                    {formatAmount(
                      selectedObjectedforPayment?.advanceAmountToPay
                        ? selectedObjectedforPayment?.totalAmount -
                        selectedObjectedforPayment?.advanceAmountToPay
                        : selectedObjectedforPayment?.totalAmount -
                        selectedObjectedforPayment?.securityDepositAmount
                    )}
                  </Text>

                  {'\n\n'}
                  Remaining balance payable at the venue:
                  {'\n\n'}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#C62828', fontFamily: 'ManropeBold' }}>
                    {' '}
                    {formatAmount(
                      selectedObjectedforPayment?.advanceAmountToPay
                        ? selectedObjectedforPayment?.totalAmount -
                        selectedObjectedforPayment?.advanceAmountToPay
                        : selectedObjectedforPayment?.totalAmount -
                        selectedObjectedforPayment?.securityDepositAmount
                    )}
                  </Text>
                  {'\n\n'}
                  {/* Note: ₹10,000 is paid to block the date. The remaining advance must be paid offline to the vendor at least 7 days before the booking date to confirm the booking */}
                  {/* <Text style={{ fontSize: 14, color: '#555', fontFamily: 'ManropeRegular' }}>
                    Please ensure to pay the remaining amount offline to the vendor directly.
                  </Text> */}
                {/* </Text> 
                :
                <Text style={{ textAlign: 'center', fontSize: 16, color: '#333', fontFamily: 'ManropeRegular' }}>
                  <Text>You’re being redirected to pay the advance amount:</Text>
                  {'\n\n'}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E7D32', fontFamily: 'ManropeBold' }}>
                    {' '}
                    {formatAmount(
                      selectedObjectedforPayment?.advanceAmountToPay
                        ? selectedObjectedforPayment?.advanceAmountToPay
                        : selectedObjectedforPayment?.securityDepositAmount
                    )}
                  </Text>
                  : <></>

                  {'\n\n'}
                  Remaining balance payable at the venue:
                  {'\n\n'}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#C62828', fontFamily: 'ManropeBold' }}>
                    {' '}
                    {formatAmount(
                      selectedObjectedforPayment?.advanceAmountToPay
                        ? selectedObjectedforPayment?.totalAmount -
                        selectedObjectedforPayment?.advanceAmountToPay
                        : selectedObjectedforPayment?.totalAmount -
                        selectedObjectedforPayment?.securityDepositAmount
                    )}
                  </Text>
                  {'\n\n'}
                  <Text style={{ fontSize: 14, color: '#555', fontFamily: 'ManropeRegular' }}>
                    Please ensure to pay the remaining amount offline to the vendor directly.
                  </Text>
                </Text>
            }

            onSubmit={() => [setPaymentModal(false), handlePayment(selectedObjectedforPayment?.advanceAmountToPay ? selectedObjectedforPayment?.advanceAmountToPay : selectedObjectedforPayment?.securityDepositAmount, selectedObjectedforPayment?.bookingId, selectedObjectedforPayment?.catType, selectedObjectedforPayment?.vendorMobileNumber, selectedObjectedforPayment?.catType === 'caterings' ? selectedObjectedforPayment?.foodCateringName : selectedObjectedforPayment?.catType === 'functionHalls' ? selectedObjectedforPayment?.functionHallName : selectedObjectedforPayment?.productName, selectedObjectedforPayment?.totalAmount)]}
            onClose={() => setPaymentModal(false)}
          /> */}

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
  actionSheetContainer: {
    backgroundColor: 'white',
    paddingBottom: 20,
    height: Dimensions.get('window').height / 1.6,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 10,
    borderRadius: 6,
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
    width: "90%",
    justifyContent: "space-between",
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
    paddingVertical: 8,
    // paddingHorizontal: 10,
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