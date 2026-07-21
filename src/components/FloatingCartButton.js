import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import Swiper from "react-native-swiper";
import BASE_URL, { LocalHostUrl } from "../apiconfig";
import PaymentConfirmationModal from "./PaymentConfirmationModal";
import { formatAmount } from "../utils/GlobalFunctions";
import { useSelector } from "react-redux";
import axios from "axios";
import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation } from "@react-navigation/native";

const FloatingCartList = ({ onPress, onClose, hallsData, cateringData, clothsData, authToken }) => {
  const [selectedObjectedforPayment, setSelectedObjectedforPayment] = useState();
  const [paymentModal, setPaymentModal] = useState(false);
  const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
  const userLoggedInName = useSelector((state) => state.userLoggedInName);
  const navigation = useNavigation();

  // Merge all data into a single array
  const allItems = [
    ...(cateringData || []).map(item => ({
      name: item.foodCateringName || "Unnamed",
      catType: item.catType,
      productId: item.productId,
      bookingId: item.bookingId,
      advanceAmountToPay: item?.advanceAmountToPay,
      totalAmount: item?.totalAmount,
      vendorMobileNumber: item?.vendorMobileNumber,
      image: item?.professionalImage?.url
    })),
    ...(clothsData || []).map(item => ({
      name: item.productName || "Unnamed",
      catType: item.catType,
      productId: item.productId,
      bookingId: item.bookingId,
      securityDepositAmount: item?.securityDepositAmount,
      totalAmount: item?.totalAmount,
      vendorMobileNumber: item?.vendorMobileNumber,
      image: item?.professionalImage?.url
    })),
    ...(hallsData || []).map(item => ({
      name: item.functionHallName || "Unnamed",
      catType: item.catType,
      productId: item.productId,
      bookingId: item?.bookingId,
      advanceAmountToPay: item?.advanceAmountToPay,
      totalAmount: item?.totalAmount,
      vendorMobileNumber: item?.vendorMobileNumber,
      image: item?.professionalImage?.url,
      hallAddress: item?.functionHallAddress?.address || '',
      seatingCapacity: item?.seatingCapacity || '',
      startDate: item?.startDate || '',
      endDate: item?.endDate || '',
    })),
  ];

  const fetchRazorpayKey = async (token) => {
    const res = await fetch(`${BASE_URL}/razorpay-key`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log('Razorpay key data is floating cart ::>>', data);
    return data;
  };

  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const handlePayment = async (advanceAmount, bookingId, catType, vendorMobileNumber, productName, totalAmount) => {
    if (paymentInProgress) return;
    setPaymentInProgress(true);

    const token = authToken;
    const { key, defaultMethod } = await fetchRazorpayKey(token);
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
          const response = await fetch(`${BASE_URL}/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: advanceAmount,
              currency: 'INR',
              receipt: `${bookingId.slice(-8)}_${new Date().toISOString().slice(0,16)}`,
              userFullName: userLoggedInName,
              userMobileNumber: userLoggedInMobileNum,
            })
          });

          const data = await response.json();
          console.log('razor pay data is ::>>', data);
          var options = {
            description: 'Book the day Transaction',
            image: 'https://your-logo-url.com/logo.png',
            currency: data.currency,
            key: key,
            amount: data.amount,
            order_id: data.orderId,
            name: 'Book the day',
            prefill: {
              email: 'bookthedaytechnologies@gmail.com',
              contact: userLoggedInMobileNum,
              name: userLoggedInName,
              method: defaultMethod,
            },
            theme: { color: '#FD813B' }
          };

          console.log('options is::>>', options);

          RazorpayCheckout.open(options)
            .then(async (paymentData) => {
              console.log('success resp::>>', paymentData);
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
                const resp = await axios.patch(`${BASE_URL}/user/update-payment-status`, statusPaymentPayload, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                console.log("success payment  RES:::::::::", JSON.stringify(resp?.data))
              } catch (updateErr) {
                console.log("Payment status update error>>::", updateErr);
              }
              // Navigate AFTER status update completes
              navigation.navigate('PaymentSuccess', {
                productName,
                advanceAmount,
                totalAmount,
                bookingId,
                orderId: initiateresponse?.data?.data?.OrderId,
                paymentId: paymentData?.razorpay_payment_id,
                catType,
                hallAddress: selectedObjectedforPayment?.hallAddress || '',
                hallImage: selectedObjectedforPayment?.image || '',
                startDate: selectedObjectedforPayment?.startDate || '',
                endDate: selectedObjectedforPayment?.endDate || '',
                seatingCapacity: selectedObjectedforPayment?.seatingCapacity || '',
              });
              setPaymentInProgress(false);
            })
            .catch(async (paymentErr) => {
              let failurePaymentPayload = {
                orderId: initiateresponse?.data?.data?.OrderId,
                paymentStatus: "failed",
                orderAdvanceAmount: advanceAmount,
                razorpay_order_id: data?.orderId,
                razorpay_payment_id: '',
                razorpay_signature: ''
              };
              try {
                const resp = await axios.patch(`${BASE_URL}/user/update-payment-status`, failurePaymentPayload, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                console.log("failure payment  RES:::::::::", JSON.stringify(resp?.data))
              } catch (updateErr) {
                console.log("failure Payment status update error>>::", updateErr);
              }
              navigation.navigate('PaymentFailed');
              setPaymentInProgress(false);
              console.log('Razorpay error:', paymentErr);
            });
        } catch (orderErr) {
          console.error('Create order error:', orderErr);
          Alert.alert('Error', 'Something went wrong');
          setPaymentInProgress(false);
        }
      } else {
        setPaymentInProgress(false);
      }
    } catch (initiateErr) {
      console.log("Initiate Payment error>>::", initiateErr);
      setPaymentInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        showsPagination
        autoplay={false} // Set to true if you want auto-swiping
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        style={{ height: 120 }}
      >
        {allItems.map((item, index) => (
          <View key={index} style={styles.cartBox}>
            {/* Image & Info */}
            <FastImage source={{
              uri: item?.image,
              // headers: { Authorization: `Bearer ${authToken}` }


            }}
              style={{ width: 50, height: 50, borderRadius: 10 }}
            />
            <View style={styles.infoSection}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.viewMenu}>Confirm Booking &gt;</Text>
              </View>
            </View>

            {/* View Cart Button */}
            <TouchableOpacity style={styles.cartButton}
              onPress={() => { setPaymentModal(true), setSelectedObjectedforPayment(item) }}
            // onPress={() => onPress(item)}
            >
              <Text style={styles.cartText}>Pay Now</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>

      <PaymentConfirmationModal
        visible={paymentModal}
        message={`Redirecting you to Pay Advance Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? selectedObjectedforPayment?.advanceAmountToPay : selectedObjectedforPayment?.securityDepositAmount)} \n \n \n Balance Payable Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? (selectedObjectedforPayment?.totalAmount - selectedObjectedforPayment?.advanceAmountToPay) : (selectedObjectedforPayment?.totalAmount - selectedObjectedforPayment?.securityDepositAmount))}`}
        // message={`Redirecting you to Pay Advance Amount: ${formatAmount(payDetails(selectedObjectedforPayment?.catType, selectedObjectedforPayment?.advanceAmountToPay, selectedObjectedforPayment?.totalAmount, selectedObjectedforPayment?.securityDepositAmount))} \n \n \n Balance Payable Amount: ${formatAmount(selectedObjectedforPayment?.advanceAmountToPay ? (selectedObjectedforPayment?.totalAmount - payDetails(selectedObjectedforPayment?.catType, selectedObjectedforPayment?.advanceAmountToPay, selectedObjectedforPayment?.totalAmount, selectedObjectedforPayment?.securityDepositAmount)) : (selectedObjectedforPayment?.totalAmount - payDetails(selectedObjectedforPayment?.catType, selectedObjectedforPayment?.advanceAmountToPay, selectedObjectedforPayment?.totalAmount, selectedObjectedforPayment?.securityDepositAmount)))}`}
        onSubmit={() => [setPaymentModal(false), handlePayment(selectedObjectedforPayment?.advanceAmountToPay ? selectedObjectedforPayment?.advanceAmountToPay : selectedObjectedforPayment?.securityDepositAmount, selectedObjectedforPayment?.bookingId, selectedObjectedforPayment?.catType, selectedObjectedforPayment?.vendorMobileNumber, selectedObjectedforPayment?.name, selectedObjectedforPayment?.totalAmount)]}
        onClose={() => setPaymentModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "white",
    // borderRadius: 15,
    // padding: 10,
    elevation: 5,
    // alignSelf:"center",
    width: "100%",
    paddingHorizontal: 10,
    height: 70, // Prevents full-screen overlay
  },
  cartBox: {
    flexDirection: "row",
    backgroundColor: "white",
    // padding: 10,
    // borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get("window").width - 40,
    justifyContent: "space-between",
    height: "100%",
    // marginHorizontal: 10, // Space between swiping items
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  viewMenu: {
    fontSize: 12,
    color: "#ff5722",
  },
  cartButton: {
    backgroundColor: "#FE7939",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cartText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 14,
    color: "#999",
    marginLeft: 10,
  },
  pagination: {
    bottom: 0,
  },
  dot: {
    backgroundColor: "#bbb",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#ff5722",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default FloatingCartList;
