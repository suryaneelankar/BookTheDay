import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Linking,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import CustomAlert from '../../components/CustomAlert';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import FastImage from 'react-native-fast-image';
import { formatAmount } from '../../utils/GlobalFunctions';
import RazorpayCheckout from 'react-native-razorpay';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import { useSelector } from 'react-redux';
import LocationIcon from '../../assets/vendorIcons/locationIcon.svg';
import PayNowButton from './PayNowButton';
import ActionSheet from 'react-native-actions-sheet';
import FloatingCloseButton from '../Events/floatingCloseButton';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primary: '#93186C',
  primaryDark: '#68133F',
  primaryLight: '#FBEAF4',

  gold: '#D9A95A',
  goldLight: '#FFF7E6',

  dark: '#211A1E',
  gray: '#746B70',
  lightGray: '#A49CA0',

  background: '#FAF8F9',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F3F5',

  green: '#07875D',
  greenLight: '#E7F8F1',

  amber: '#D97706',
  amberLight: '#FFF4DB',

  red: '#B4234D',
  redLight: '#FDECF1',

  white: '#FFFFFF',
};

const ViewMyBookings = () => {
  const [hallsBookings, setHallsBookings] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const userLoggedInMobileNum = useSelector(
    state => state.userLoggedInMobileNum,
  );
  const userLoggedInName = useSelector(state => state.userLoggedInName);
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

  const labels = ['Request Sent', 'Venue Approved', 'Payment Completed'];
  const customStyles = {
    stepIndicatorSize: 24,
    currentStepIndicatorSize: 28,

    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 2,
    stepStrokeWidth: 2,

    stepStrokeCurrentColor: COLORS.primary,
    stepStrokeFinishedColor: COLORS.primary,
    stepStrokeUnFinishedColor: '#DDD5D9',

    separatorFinishedColor: COLORS.primary,
    separatorUnFinishedColor: '#E8E1E4',

    stepIndicatorFinishedColor: COLORS.primary,

    // Changed
    stepIndicatorCurrentColor: COLORS.primary,

    stepIndicatorUnFinishedColor: COLORS.white,

    // Changed
    stepIndicatorLabelCurrentColor: COLORS.white,

    stepIndicatorLabelFinishedColor: COLORS.white,
    stepIndicatorLabelUnFinishedColor: '#A49CA0',

    stepIndicatorLabelFontSize: 11,
    currentStepIndicatorLabelFontSize: 12,

    labelColor: COLORS.gray,
    currentStepLabelColor: COLORS.primary,
    labelSize: 11,
  };

  useFocusEffect(
    useCallback(() => {
      getMyBookings();
      getCateringsBookings();
      getHallsBookings();
      return () => {
        console.log('Screen is unfocused');
      };
    }, []),
  );

  const getBookingStep = status => {
    switch (status) {
      case 'requested':
        return 0;

      case 'approved':
        return 1;

      case 'payment successful':
        return 2;

      default:
        return 0;
    }
  };

  const getMyBookings = async () => {
    const token = await getUserAuthToken();
    try {
      const resp = await axios.get(`${BASE_URL}/getUserClothJewelBookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('BOOKINGS RES:::::::::', JSON.stringify(resp?.data));
    } catch (error) {
      console.log('My Bookings data error>>::', error);
    }
  };

  const getCateringsBookings = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getUserFoodCateringBookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log('My Bookings data error>>::', error);
    }
  };

  const getHallsBookings = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getUserFunctionHallBookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(
        'Funtional halls BOOKINGS RES:::::::::',
        JSON.stringify(response?.data),
      );
      setHallsBookings(response?.data?.data);
    } catch (error) {
      console.log('My Bookings data error>>::', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelFunctionHallBooking = async bookingId => {
    const token = await getUserAuthToken();
    const reasonToSend =
      selectedReason === 'Other (Please specify...)'
        ? otherReasonText.trim()
        : selectedReason;

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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(
        'cancelBookingResp RES:::::::::',
        JSON.stringify(cancelBookingResp?.data),
      );
      if (cancelBookingResp?.data?.status === 200) {
        actionSheetRef.current?.hide();
        CustomAlert.alert(
          'Success',
          'Booking cancelled successfully!',
          [
            {
              text: 'Ok',
              onPress: () => {
                setSelectedBookingId(null);
                setSelectedReason('');
                setOtherReasonText('');
                getHallsBookings();
                setIsChecked(false);
              },
            },
          ],
          { cancelable: false, type: 'success' },
        );
      }
    } catch (error) {
      CustomAlert.alert(
        'Error',
        error?.response?.data?.message ||
        'Something went wrong while cancelling the booking',
        undefined,
        { type: 'error' },
      );
      console.log(
        'cancelBookingResp error>>::',
        error?.response?.data || error,
      );
    }
  };

  const fetchRazorpayKey = async () => {
    const res = await fetch(`${BASE_URL}/razorpay-key`);
    const data = await res.json();
    console.log('Razorpay key data is my bookings ::>>', data);
    return data;
  };

  const handlePayment = async (
    advanceAmount,
    bookingId,
    catType,
    vendorMobileNumber,
    productName,
    totalAmount,
  ) => {
    const token = await getUserAuthToken();
    const { key, defaultMethod } = await fetchRazorpayKey();
    let initiatePaymentPayload = {
      orderAmount: advanceAmount,
      currency: 'INR',
      userFullName: userLoggedInName,
      userMobileNumber: userLoggedInMobileNum,
      vendorMobileNumber: vendorMobileNumber,
      productName: productName,
    };

    try {
      const initiateresponse = await axios.post(
        `${BASE_URL}/user/initiate-payment`,
        initiatePaymentPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(
        'initiate payment  RES:::::::::',
        JSON.stringify(initiateresponse?.data),
      );

      if (initiateresponse?.data) {
        try {
          const response = await fetch(`${BASE_URL}/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: advanceAmount,
              currency: 'INR',
              receipt: 'receipt#1',
              userFullName: userLoggedInName,
              userMobileNumber: userLoggedInMobileNum,
            }),
          });

          const data = await response.json();
          console.log('razor pay data is ::>>', data);

          var options = {
            description: 'Test Transaction',
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
            theme: { color: '#FFDB7E' },
          };

          console.log('options is::>>', options);

          RazorpayCheckout.open(options)
            .then(async paymentData => {
              console.log('success resp::>>', paymentData);
              navigation.navigate('PaymentSuccess', {
                productName,
                advanceAmount,
                totalAmount,
                bookingId,
                orderId: initiateresponse?.data?.data?.OrderId,
                paymentId: paymentData?.razorpay_payment_id,
                catType,
              });

              let statusPaymentPayload = {
                orderId: initiateresponse?.data?.data?.OrderId,
                paymentStatus: 'success',
                orderAdvanceAmount: advanceAmount,
                razorpay_order_id: paymentData?.razorpay_order_id,
                razorpay_payment_id: paymentData?.razorpay_payment_id,
                razorpay_signature: paymentData?.razorpay_signature,
                vendorMobileNumber: vendorMobileNumber,
                bookingId: bookingId,
                catType: catType,
              };
              try {
                const resp = await axios.patch(
                  `${BASE_URL}/user/update-payment-status`,
                  statusPaymentPayload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                console.log(
                  'success payment  RES:::::::::',
                  JSON.stringify(resp?.data),
                );
              } catch (error) {
                console.log('Payment error>>::', error);
              }
            })

            .catch(async error => {
              let failurePaymentPayload = {
                orderId: initiateresponse?.data?.data?.OrderId,
                paymentStatus: 'failed',
                orderAdvanceAmount: advanceAmount,
                razorpay_order_id: data?.orderId,
                razorpay_payment_id: '',
                razorpay_signature: '',
              };

              try {
                const resp = await axios.patch(
                  `${BASE_URL}/user/update-payment-status`,
                  failurePaymentPayload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                console.log(
                  'failure payment  RES:::::::::',
                  JSON.stringify(resp?.data),
                );
              } catch (err) {
                console.log('failure Payment error>>::', err);
              }
              navigation.navigate('PaymentFailed');
              console.log(error);
            });
        } catch (error) {
          console.error(error);
          CustomAlert.alert('Error', 'Something went wrong', undefined, {
            type: 'error',
          });
        }
      }
    } catch (error) {
      console.log('Initiate Payment error>>::', error);
    }
  };

  const openMap = (lat, lon) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}`,
    });
    Linking.openURL(url);
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'requested':
        return styles.statusRequested;
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      case 'cancelled':
        return styles.statusRejected;
      case 'payment successful':
        return styles.statusSuccess;
      default:
        return styles.statusDefault;
    }
  };

  const renderItem = ({ item }) => {
    const updatedImgUrl = item?.professionalImage?.url;

    const bookingDate = item?.startDate;
    const today = moment();
    const parsedBookingDate = moment(bookingDate, 'DD MMMM YYYY');
    const diffInDays = parsedBookingDate.diff(today, 'days');

    const canCancel =
      diffInDays >= 7 &&
      item.bookingStatus !== 'cancelled' &&
      item.bookingStatus !== 'rejected';

    const venueName =
      item?.catType === 'caterings'
        ? item?.foodCateringName
        : item?.catType === 'functionHalls'
          ? item?.functionHallName
          : item?.productName;

    const advanceLabel =
      item?.catType === 'caterings' || item?.catType === 'functionHalls'
        ? item?.advanceAmountPaid > 0
          ? 'Advance Paid'
          : 'Advance Amount'
        : item?.securityDepositAmountPaid > 0
          ? 'Security Paid'
          : 'Security Deposit';

    const advanceValue = item?.advanceAmountToPay
      ? item?.advanceAmountToPay
      : item?.securityDepositAmount;

    const balanceValue = item?.advanceAmountToPay
      ? item?.totalAmount - item?.advanceAmountToPay
      : item?.totalAmount - item?.securityDepositAmount;

    const statusText = item.bookingStatus
      ? item.bookingStatus.charAt(0).toUpperCase() +
      item.bookingStatus.slice(1)
      : '';

    return (
      <View style={styles.card}>
        <FastImage
          resizeMode="cover"
          source={{ uri: updatedImgUrl }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.venueName} numberOfLines={2}>
              {venueName}
            </Text>
            <View style={[styles.statusBadge, getStatusStyle(item.bookingStatus)]}>
              <Text
                style={[styles.statusText, getStatusStyle(item.bookingStatus)]}
                numberOfLines={1}>
                {statusText}
              </Text>
            </View>
          </View>

          <Text style={styles.totalAmount}>
            {formatAmount(item?.totalAmount)}
          </Text>

          <View style={styles.amountGrid}>
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>{advanceLabel}</Text>
              <Text style={styles.amountValueGreen}>
                {formatAmount(advanceValue)}
              </Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountItem}>
              <Text style={styles.amountLabel}>Balance</Text>
              <Text style={styles.amountValueOrange}>
                {formatAmount(balanceValue)}
              </Text>
            </View>
          </View>

          <View style={styles.dateSection}>
            {item?.catType === 'caterings' ||
              item?.catType === 'functionHalls' ? (
              <View style={styles.dateRow}>
                <IonIcon name="calendar-outline" size={14} color={COLORS.gray} />
                <Text style={styles.dateText}>
                  Booking Date:{' '}
                  <Text style={styles.dateHighlight}>{item?.startDate}</Text>
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.dateRow}>
                  <IonIcon name="calendar-outline" size={14} color={COLORS.gray} />
                  <Text style={styles.dateText}>Start: {item?.startDate}</Text>
                </View>
                <View style={styles.dateRow}>
                  <IonIcon name="calendar-outline" size={14} color={COLORS.gray} />
                  <Text style={styles.dateText}>End: {item?.endDate}</Text>
                </View>
              </>
            )}
            <Text style={styles.bookingId}>ID: {item?.bookingId}</Text>
          </View>

          {item?.catType === 'functionHalls' && item?.advanceAmountPaid > 0 ? (
            <TouchableOpacity
              style={styles.locationRow}
              onPress={() =>
                openMap(item?.vendorLatitude, item?.vendorLongitude)
              }>
              <LocationIcon />
              <Text numberOfLines={2} style={styles.locationText}>
                {item?.functionHallAddress?.address}
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={getBookingStep(item?.bookingStatus)}
              labels={labels}
              stepCount={3}
            />
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => {
                setSelectedBookingId(item.bookingId);
                actionSheetRef.current?.show();
              }}
              disabled={!canCancel}
              activeOpacity={canCancel ? 0.7 : 0.5}
              style={[
                styles.cancelButton,
                !canCancel && styles.cancelButtonDisabled,
              ]}>
              <Text
                style={[
                  styles.cancelButtonText,
                  !canCancel && styles.cancelButtonTextDisabled,
                ]}>
                Cancel Booking
              </Text>
            </TouchableOpacity>
            <PayNowButton
              onPress={() => {
                console.log('selected item is::>>>', item);
                const yourObjectWithDetails = {
                  totalAmount: item?.totalAmount,
                  advanceAmountToPay: item?.advanceAmountToPay,
                  securityDepositAmount: item?.securityDepositAmount,
                  vendorName:
                    item?.vendorName ??
                    item?.functionHallName ??
                    item?.foodCateringName ??
                    item?.productName,
                  bookingId: item?.bookingId,
                  productName:
                    item?.productName ??
                    item?.functionHallName ??
                    item?.foodCateringName,
                  startDate: item?.startDate,
                  endDate: item?.endDate,
                  catType: item?.catType,
                  vendorMobileNumber: item?.vendorMobileNumber,
                  foodCateringName: item?.foodCateringName ?? '',
                  functionHallName: item?.functionHallName ?? '',
                  hallAddress: item?.functionHallAddress?.address ?? '',
                  hallImage: item?.professionalImage?.url ?? '',
                  seatingCapacity: item?.seatingCapacity ?? '',
                };
                navigation.navigate('BookingReview', {
                  selectedBooking: yourObjectWithDetails,
                });
              }}
              text={'Pay Now'}
              showIcon={false}
              disabled={item.bookingStatus !== 'approved'}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActionSheet
        ref={actionSheetRef}
        statusBarTranslucent
        closeOnPressBack
        defaultOverlayOpacity={0.5}
        height={SCREEN_HEIGHT - 20}
        containerStyle={styles.actionSheetContainer}>
        <View>
          <FloatingCloseButton
            onPress={() => actionSheetRef.current?.hide()}
          />
        </View>
        <ScrollView contentContainerStyle={styles.actionSheetScroll}>
          <View style={styles.actionSheetContent}>
            <Text style={styles.actionSheetTitle}>
              Choose the reason for cancellation
            </Text>
            {cancellationReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedReason(reason)}
                style={styles.radioRow}>
                <View style={styles.radioOuter}>
                  {selectedReason === reason && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{reason}</Text>
              </TouchableOpacity>
            ))}

            {selectedReason === 'Other (Please specify...)' && (
              <>
                <Text style={styles.otherReasonLabel}>
                  Please specify the reason
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Please specify your reason"
                  placeholderTextColor={COLORS.gray}
                  value={otherReasonText}
                  onChangeText={setOtherReasonText}
                />
              </>
            )}
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
              <View style={styles.checkboxRow}>
                <View
                  style={[
                    styles.checkbox,
                    isChecked && styles.checkboxChecked,
                  ]}>
                  {isChecked && (
                    <IonIcon name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree that the advance amount paid is{' '}
                  <Text style={styles.checkboxBold}>non-refundable</Text> upon
                  cancellation.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.confirmCancelButton,
              (!selectedReason || !selectedBookingId) &&
              styles.confirmCancelButtonDisabled,
            ]}
            disabled={!selectedReason || !selectedBookingId}
            onPress={() => {
              if (
                selectedReason === 'Other (Please specify...)' &&
                !otherReasonText.trim()
              ) {
                CustomAlert.alert(
                  'Alert',
                  'Please enter your custom reason!',
                  [{ text: 'Ok', onPress: () => { } }],
                  { cancelable: false, type: 'warning' },
                );
                return;
              }
              if (isChecked === false) {
                CustomAlert.alert(
                  'Alert',
                  'Please agree the terms & conditions upon cancellation.',
                  [{ text: 'Ok', onPress: () => { } }],
                  { cancelable: false, type: 'warning' },
                );
                return;
              }
              if (selectedReason) {
                CustomAlert.alert(
                  'Alert',
                  'Are you sure you want to cancel the booking? This will apply the refund policy mentioned.',
                  [
                    { text: 'Cancel', onPress: () => { } },
                    {
                      text: 'Yes',
                      onPress: () => {
                        cancelFunctionHallBooking(selectedBookingId);
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }
            }}>
            <Text style={styles.confirmCancelText}>Confirm Cancellation</Text>
          </TouchableOpacity>
        </ScrollView>
      </ActionSheet>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>
            Loading your bookings...
          </Text>
        </View>
      ) : hallsBookings?.length > 0 ? (
        <FlatList
          data={hallsBookings}
          renderItem={renderItem}
          keyExtractor={item =>
            String(item?._id ?? item?.bookingId)
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bookingList}
          ListHeaderComponent={
            <View style={styles.bookingHeader}>
              <View>
                <Text style={styles.bookingHeaderTitle}>
                  My Bookings
                </Text>

                <Text style={styles.bookingHeaderSubtitle}>
                  View and manage your venue reservations
                </Text>
              </View>

              <View style={styles.bookingCount}>
                <Text style={styles.bookingCountText}>
                  {hallsBookings.length}
                </Text>
              </View>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <IonIcon
              name="calendar-outline"
              size={moderateScale(34)}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>No bookings yet</Text>

          <Text style={styles.emptySubtitle}>
            When you reserve a venue, your booking details will appear here.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BanquetHallstab')}
            style={styles.exploreButton}>

            <Text style={styles.exploreButtonText}>
              Explore venues
            </Text>

            <IonIcon
              name="arrow-forward"
              size={15}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: COLORS.lightBg,
  // },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#EEE7EA',
  },

  cancelButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 21,
  },

  cancelButtonDisabled: {
    backgroundColor: '#F5F3F4',
    borderColor: '#DDD7DA',
  },

  cancelButtonText: {
    fontFamily: 'ManropeRegular',
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.red,
  },

  cancelButtonTextDisabled: {
    color: COLORS.lightGray,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statusRequested: {
    backgroundColor: COLORS.amberLight,
    color: COLORS.amber,
  },

  statusApproved: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },

  statusRejected: {
    backgroundColor: COLORS.redLight,
    color: COLORS.red,
  },

  statusSuccess: {
    backgroundColor: COLORS.greenLight,
    color: COLORS.green,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#EEE7EA',

    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  cardImage: {
    width: '100%',
    height: 155,
    backgroundColor: '#EFEAEC',
  },

  cardContent: {
    padding: 15,
  },

  venueName: {
    flex: 1,
    marginRight: 8,
    fontFamily: 'ManropeRegular',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    color: COLORS.dark,
  },

  totalAmount: {
    fontFamily: 'ManropeRegular',
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 12,
  },

  amountGrid: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 13,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE7EA',
  },

  amountDivider: {
    width: 1,
    marginHorizontal: 8,
    backgroundColor: '#E2D9DD',
  },

  amountValueGreen: {
    fontFamily: 'ManropeRegular',
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.green,
  },

  amountValueOrange: {
    fontFamily: 'ManropeRegular',
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.amber,
  },
  bookingList: {
    paddingBottom: 30,
  },

  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  bookingHeaderTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.dark,
  },

  bookingHeaderSubtitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 11.5,
    color: COLORS.gray,
    marginTop: 3,
  },

  bookingCount: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },

  bookingCountText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    height: 140,
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
    flex: 1,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  statusRequested: {
    backgroundColor: '#FEF3E2',
    color: COLORS.amber,
  },
  statusApproved: {
    backgroundColor: COLORS.orange,
    color: COLORS.white,
  },
  statusRejected: {
    backgroundColor: '#FDEAEA',
    color: '#EF4444',
  },
  statusSuccess: {
    backgroundColor: '#E8F5E9',
    color: COLORS.green,
  },
  statusDefault: {
    backgroundColor: '#FFF3E0',
    color: COLORS.amber,
  },

  amountGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.gray,
    fontFamily: 'ManropeRegular',
    marginBottom: 4,
  },
  amountValueGreen: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.green,
    fontFamily: 'ManropeRegular',
  },
  amountValueOrange: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.amber,
    fontFamily: 'ManropeRegular',
  },
  dateSection: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'ManropeRegular',
    marginLeft: 6,
  },
  dateHighlight: {
    fontWeight: '600',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'ManropeRegular',
    marginTop: 4,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.orange,
    fontFamily: 'ManropeRegular',
    textDecorationLine: 'underline',
    marginLeft: 6,
    flex: 1,
  },
  stepIndicatorContainer: {
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.cancelRed,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cancelButtonDisabled: {
    borderColor: '#CCCCCC',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.cancelRed,
    fontFamily: 'ManropeRegular',
  },
  cancelButtonTextDisabled: {
    color: '#CCCCCC',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actionSheetContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    height: SCREEN_HEIGHT / 1.6,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  actionSheetScroll: {
    paddingBottom: 100,
  },
  actionSheetContent: {
    padding: 20,
  },
  actionSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
    marginBottom: 16,
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioOuter: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.cancelRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.cancelRed,
  },
  radioLabel: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'ManropeRegular',
    flex: 1,
  },
  otherReasonLabel: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'ManropeRegular',
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'ManropeRegular',
    color: COLORS.dark,
    backgroundColor: COLORS.lightBg,
  },

  checkboxContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  checkboxChecked: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  checkboxLabel: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'ManropeRegular',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  checkboxBold: {
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  confirmCancelButton: {
    backgroundColor: COLORS.cancelRed,
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  confirmCancelButtonDisabled: {
    opacity: 0.5,
  },
  confirmCancelText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
    fontFamily: 'ManropeRegular',
  },
});

export default ViewMyBookings;
