import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import Swiper from "react-native-swiper";
import BASE_URL from "../apiconfig";
import PaymentConfirmationModal from "./PaymentConfirmationModal";
import { formatAmount } from "../utils/GlobalFunctions";
import { useSelector } from "react-redux";
import axios from "axios";
import RazorpayCheckout from 'react-native-razorpay';
import CustomAlert from './CustomAlert';
import { useNavigation } from "@react-navigation/native";
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// live

// const BOOKING_TOKEN_AMOUNT = 999;

// staging

const BOOKING_TOKEN_AMOUNT = 1;

const normalizeCategory = value => {
  const category = String(value || '').toLowerCase();

  if (
    category.includes('function')
    || category.includes('hall')
    || category.includes('farm')
    || category.includes('resort')
    || category.includes('banquet')
    || category.includes('venue')
  ) {
    return 'functionHalls';
  }

  return null;
};

const FloatingCartButton = ({ onPress, onClose, hallsData, authToken }) => {
  const [selectedObjectedforPayment, setSelectedObjectedforPayment] = useState();
  const [paymentModal, setPaymentModal] = useState(false);
  const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
  const userLoggedInName = useSelector((state) => state.userLoggedInName);
  const navigation = useNavigation();

  // console.log('hallsData i s::>>>>',hallsData);

  // Merge all data into a single array — memoized so it only recomputes when inputs change
  const allItems = useMemo(
    () =>
      (hallsData || []).map(item => ({
        name: item.functionHallName || item.name || 'Unnamed venue',

        bookingId: String(
          item?.bookingId?._id ||
          item?.bookingId ||
          item?._id ||
          '',
        ),

        vendorMobileNumber: String(
          item?.vendorMobileNumber ||
          item?.venue?.vendorMobileNumber ||
          item?.functionHall?.vendorMobileNumber ||
          '',
        ),

        catType:
          item?.catType ||
          item?.categoryType ||
          'functionHalls',

        productId:
          item?.productId?._id ||
          item?.productId ||
          item?.functionHallId?._id ||
          item?.functionHallId,

        advanceAmountToPay: item?.advanceAmountToPay,
        totalAmount: item?.totalAmount,
        image:
          item?.professionalImage?.url ||
          item?.venue?.professionalImage?.url ||
          '',

        hallAddress:
          item?.functionHallAddress?.address ||
          item?.venue?.functionHallAddress?.address ||
          '',

        seatingCapacity:
          item?.seatingCapacity ||
          item?.venue?.seatingCapacity ||
          '',

        startDate: item?.startDate || '',
        endDate: item?.endDate || '',
        venueCategory: item?.venueCategory || 'Venue',
      })),
    [hallsData],
  );

  const fetchRazorpayKey = useCallback(async (token) => {
    const res = await fetch(`${BASE_URL}/razorpay-key`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok || !data?.key) {
      throw new Error(data?.message || 'Unable to load payment configuration.');
    }

    return data;
  }, []);

  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const handlePayment = useCallback(async item => {
    if (paymentInProgress) return;

    const vendorMobileNumber = String(
      item?.vendorMobileNumber || '',
    ).trim();

    const catType = normalizeCategory(item?.catType);
    const token = authToken;

    const bookingId = String(
      item?.bookingId || '',
    ).trim();

    if (!/^BOOK-\d{13}-\d{4}$/.test(bookingId)) {
      console.log('Invalid payment booking ID:', {
        bookingId,
        item,
      });

      CustomAlert.alert(
        'Payment unavailable',
        'A valid booking reference was not found.',
        undefined,
        { type: 'warning' },
      );

      return;
    }

    if (!/^[6-9]\d{9}$/.test(vendorMobileNumber)) {
      console.log('Invalid payment vendor number:', {
        vendorMobileNumber,
        item,
      });

      CustomAlert.alert(
        'Payment unavailable',
        'The venue vendor number is missing or invalid.',
        undefined,
        { type: 'warning' },
      );

      return;
    }

    if (!catType) {
      console.log('Invalid payment category:', {
        category: item?.catType,
        item,
      });

      CustomAlert.alert(
        'Payment unavailable',
        'The booking category is missing.',
        undefined,
        { type: 'warning' },
      );

      return;
    }

    if (!token) {
      CustomAlert.alert(
        'Session expired',
        'Please log in again to continue.',
        undefined,
        { type: 'warning' },
      );

      return;
    }

    setPaymentInProgress(true);
    let checkoutPaymentCompleted = '';

    try {
      const { key, defaultMethod } =
        await fetchRazorpayKey(token);

      const initiatePaymentPayload = {
        bookingId,
        catType,
        vendorMobileNumber,
        productName: item.name,
        userFullName: userLoggedInName,
      };

      console.log(
        'Initiating ₹999 payment:',
        initiatePaymentPayload,
      );

      const initiateResponse = await axios.post(
        `${BASE_URL}/user/initiate-payment`,
        initiatePaymentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const internalOrderId =
        initiateResponse?.data?.data?.OrderId;

      if (!internalOrderId) {
        throw new Error(
          'The server did not return a payment reference.',
        );
      }

      const orderResponse = await axios.post(
        `${BASE_URL}/create-order`,
        {
          receipt: internalOrderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const order = orderResponse?.data;

      if (
        !order?.orderId ||
        Number(order?.amount) !== BOOKING_TOKEN_AMOUNT * 100
      ) {
        throw new Error(
          'The server returned an invalid ₹999 payment order.',
        );
      }

      const paymentData = await RazorpayCheckout.open({
        description: `Booking token for ${item.name}`,
        currency: order.currency || 'INR',
        key,
        amount: order.amount,
        order_id: order.orderId,
        name: 'BookTheDay',
        prefill: {
          contact: userLoggedInMobileNum,
          name: userLoggedInName,
          ...(defaultMethod
            ? { method: defaultMethod }
            : {}),
        },
        theme: {
          color: '#CE951A',
        },
      });

      console.log('paymentData is ::>>>>>', paymentData);

      checkoutPaymentCompleted = paymentData?.razorpay_payment_id;

      if (
        !paymentData?.razorpay_order_id ||
        !paymentData?.razorpay_payment_id ||
        !paymentData?.razorpay_signature
      ) {
        throw new Error(
          'Razorpay did not return complete payment details.',
        );
      }

      const verificationPayload = {
        orderId: internalOrderId,
        razorpay_order_id:
          paymentData?.razorpay_order_id,
        razorpay_payment_id:
          paymentData?.razorpay_payment_id,
        razorpay_signature:
          paymentData?.razorpay_signature,
      };

      const verificationResponse = await axios.patch(
        `${BASE_URL}/user/update-payment-status`,
        verificationPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const verificationResult = verificationResponse?.data;

      if (verificationResult?.paymentVerified !== true) {
        throw new Error(
          verificationResult?.message ||
          'Payment verification was not confirmed.',
        );
      }

      navigation.navigate('PaymentSuccess', {
        productName: item.name,
        advanceAmount: BOOKING_TOKEN_AMOUNT,
        totalAmount: item.totalAmount,
        bookingId,
        orderId: internalOrderId,
        paymentId: paymentData?.razorpay_payment_id,
        razorpay_order_id: paymentData?.razorpay_order_id,
        catType,
        hallAddress: item.hallAddress || '',
        hallImage: item.image || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        seatingCapacity: item.seatingCapacity || '',
        bookingUpdateCompleted:
          verificationResult.bookingUpdateCompleted,
        verificationMessage:
          verificationResult.message,
      });
    } catch (error) {
      const checkoutCancelled =
        error?.code === 0 ||
        error?.code === 'PAYMENT_CANCELLED' ||
        String(error?.description || '')
          .toLowerCase()
          .includes('cancel');

      console.error(
        'Booking-token payment failed:',
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.description ||
        error?.message,
      );

      console.error('Payment verification error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        description: error?.description,
      });

      if (checkoutCancelled) {
        CustomAlert.alert(
          'Payment cancelled',
          'No amount was charged.',
          undefined,
          { type: 'warning' },
        );
      } else if (checkoutPaymentCompleted === '') {
        CustomAlert.alert(
          'Verification pending',
          'Payment was received but verification could not be completed. Please do not pay again and contact support.',
          undefined,
          { type: 'warning' },
        );
      } else {
        navigation.navigate('PaymentFailed');
      }
    } finally {
      setPaymentInProgress(false);
    }
  }, [
    authToken,
    paymentInProgress,
    userLoggedInName,
    userLoggedInMobileNum,
    navigation,
    fetchRazorpayKey,
  ]);

  const paymentModalMessage = useMemo(() => {
    const total = Number(selectedObjectedforPayment?.totalAmount || 0);
    const balance = Math.max(total - BOOKING_TOKEN_AMOUNT, 0);

    return `Booking token: ${formatAmount(BOOKING_TOKEN_AMOUNT)}\n\nRemaining amount payable to venue: ${formatAmount(balance)}`;
  }, [selectedObjectedforPayment]);

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        showsPagination={allItems.length > 1}
        autoplay={false} // Set to true if you want auto-swiping
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        style={styles.swiper}
      >
        {allItems.map((item, index) => (
          <View key={item.bookingId || index} style={styles.slide}>
            <LinearGradient
              colors={['#FFFDF8', '#FFF8E7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cartBox}
            >
              <TouchableOpacity
                onPress={() => onClose?.()}
                style={styles.closeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Dismiss payment reminder"
              >
                <IonIcon name="close" size={16} color="#806F55" />
              </TouchableOpacity>

              <View style={styles.topRow}>
                {item.image ? (
                  <FastImage
                    source={{ uri: item.image }}
                    style={styles.venueImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View style={[styles.venueImage, styles.imagePlaceholder]}>
                    <IonIcon name="business-outline" size={25} color="#AD8733" />
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.75}
                  style={styles.infoSection}
                  onPress={() => onPress?.(item)}
                >
                  <View style={styles.eyebrowRow}>
                    <IonIcon name="checkmark-circle" size={13} color="#07875D" />
                    <Text style={styles.eyebrow}>VENUE APPROVED</Text>
                  </View>

                  <View style={styles.titleActionRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.86}
                      disabled={paymentInProgress}
                      onPress={() => {
                        setSelectedObjectedforPayment(item);
                        setPaymentModal(true);
                      }}
                      style={styles.ctaWrap}
                      accessibilityRole="button"
                      accessibilityLabel={`Pay ₹999 booking token for ${item.name}`}
                    >
                      <LinearGradient
                        colors={paymentInProgress
                          ? ['#CFC7B8', '#BDB4A4']
                          : ['#A87205', '#CE951A', '#E4B946']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.cartButton}
                      >
                        <Text style={styles.cartText}>
                          {paymentInProgress ? 'Please wait…' : 'Pay ₹999'}
                        </Text>
                        {!paymentInProgress && (
                          <IonIcon name="arrow-forward" size={14} color="#FFFFFF" />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>


                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <IonIcon name="calendar-outline" size={13} color="#8A6A20" />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {item.startDate || 'Date confirmed'}
                      </Text>
                    </View>

                    <View style={styles.metaDivider} />

                    <Text style={styles.categoryText} numberOfLines={1}>
                      {item.venueCategory}
                    </Text>

                  </View>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.paymentRow}>
                <View style={styles.paymentCopy}>
                  <Text style={styles.paymentLabel}>SECURE YOUR BOOKING</Text>
                  <Text style={styles.paymentHint} numberOfLines={1}>
                    Pay ₹999 token · Total {formatAmount(item.totalAmount)}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.86}
                  disabled={paymentInProgress}
                  onPress={() => {
                    setSelectedObjectedforPayment(item);
                    setPaymentModal(true);
                  }}
                  style={styles.ctaWrap}
                  accessibilityRole="button"
                  accessibilityLabel={`Pay ₹999 booking token for ${item.name}`}
                >
                  <LinearGradient
                    colors={paymentInProgress
                      ? ['#CFC7B8', '#BDB4A4']
                      : ['#A87205', '#CE951A', '#E4B946']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.cartButton}
                  >
                    <Text style={styles.cartText}>
                      {paymentInProgress ? 'Please wait…' : 'Pay ₹999'}
                    </Text>
                    {!paymentInProgress && (
                      <IonIcon name="arrow-forward" size={14} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View> */}
            </LinearGradient>
          </View>
        ))}
      </Swiper>

      <PaymentConfirmationModal
        visible={paymentModal}
        message={paymentModalMessage}
        onSubmit={() => {
          setPaymentModal(false);
          handlePayment(selectedObjectedforPayment);
        }}
        onClose={() => setPaymentModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 14,
    right: 14,
    height: 102,
    zIndex: 100,
    elevation: 14,
    backgroundColor: 'transparent',
  },
  swiper: {
    // height: 152,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 2,
    paddingTop: 2,
    paddingBottom: 18,
  },
  cartBox: {
    flex: 1,
    width: Dimensions.get('window').width - 32,
    alignSelf: 'center',
    borderRadius: 18,
    padding: 11,
    borderWidth: 1,
    borderColor: '#E8D49A',
    shadowColor: '#6B4A0B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
    marginLeft: 10,
    minWidth: 0,
  },
  venueImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#FFF2CB',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9D8A9',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    paddingRight: 30,
  },
  eyebrow: {
    marginLeft: 4,
    color: '#55705E',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.65,
    fontFamily: 'ManropeRegular',
  },
  titleActionRow: {
    width: '100%',
    minWidth: 0,
    position: 'relative',
    justifyContent: 'center',
  },
  itemName: {
    width: '100%',
    paddingRight: 94,
    color: '#302817',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  metaRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  metaItem: {
    maxWidth: '62%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 4,
    color: '#766849',
    fontSize: 9.5,
    fontFamily: 'ManropeRegular',
  },
  metaDivider: {
    width: 1,
    height: 11,
    marginHorizontal: 7,
    backgroundColor: '#DCCDA7',
  },
  categoryText: {
    flex: 1,
    color: '#8A6A20',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE2C2',
  },
  paymentCopy: {
    flex: 1,
    paddingRight: 8,
  },
  paymentLabel: {
    color: '#8A6108',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.55,
    fontFamily: 'ManropeRegular',
  },
  paymentHint: {
    marginTop: 2,
    color: '#6F6656',
    fontSize: 9.5,
    fontFamily: 'ManropeRegular',
  },
  ctaWrap: {
    position: 'absolute',
    right: 20,
    top: -6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cartButton: {
    minWidth: 84,
    minHeight: 30,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  cartText: {
    marginRight: 4,
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderWidth: 1,
    borderColor: '#E7D8B1',
    zIndex: 2,
  },
  pagination: {
    bottom: 4,
  },
  dot: {
    backgroundColor: '#D8CDB5',
    width: 5,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#B27A08',
    width: 13,
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default FloatingCartButton;
