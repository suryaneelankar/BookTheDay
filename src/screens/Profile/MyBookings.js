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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StepIndicator from 'react-native-step-indicator';
import LocationIcon from '../../assets/vendorIcons/locationIcon.svg';
import PayNowButton from './PayNowButton';
import ActionSheet from 'react-native-actions-sheet';
import FloatingCloseButton from '../Events/floatingCloseButton';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scalingMetrics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primary: '#B27A08',
  primaryDark: '#7A5200',
  primaryLight: '#FFF4D6',

  gold: '#D9A95A',
  goldLight: '#FFF7E6',

  dark: '#211A1E',
  gray: '#746B70',
  lightGray: '#A49CA0',

  background: '#FAF8F3',
  surface: '#FFFFFF',
  surfaceMuted: '#FCF8EE',

  green: '#07875D',
  greenLight: '#E7F8F1',

  amber: '#B97805',
  amberLight: '#FFF4DB',

  red: '#B4234D',
  redLight: '#FDECF1',

  white: '#FFFFFF',

  orange: '#B27A08',
  lightBg: '#FCF8EE',
  cancelRed: '#B4234D',
};

const ViewMyBookings = () => {
  const [hallsBookings, setHallsBookings] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const actionSheetRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

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
    stepIndicatorSize: 19,
    currentStepIndicatorSize: 22,

    separatorStrokeWidth: 1.5,
    currentStepStrokeWidth: 1.5,
    stepStrokeWidth: 1.5,

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

    stepIndicatorLabelFontSize: 8,
    currentStepIndicatorLabelFontSize: 9,

    labelColor: COLORS.gray,
    currentStepLabelColor: COLORS.primary,
    labelSize: 8.5,
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

  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return COLORS.primary;
      case 'rejected':
      case 'cancelled':
        return COLORS.red;
      case 'payment successful':
        return COLORS.green;
      case 'requested':
      default:
        return COLORS.amber;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'approved':
        return 'checkmark-circle-outline';
      case 'payment successful':
        return 'shield-checkmark-outline';
      case 'rejected':
      case 'cancelled':
        return 'close-circle-outline';
      case 'requested':
      default:
        return 'time-outline';
    }
  };

  const bookingFilters = [
    { key: 'all', label: 'All' },
    { key: 'requested', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'payment successful', label: 'Paid' },
  ];

  const filteredBookings = (hallsBookings || []).filter(booking =>
    activeFilter === 'all' ? true : booking?.bookingStatus === activeFilter,
  );

  const renderItem = ({ item }) => {
    const updatedImgUrl = item?.professionalImage?.url;

    const bookingDate = String(item?.startDate || '',).trim();
    const bookingStatus = String(item?.bookingStatus || '',).trim().toLowerCase();

    console.log('bookingStatus is ::>>>>', bookingStatus);

    const today = moment().startOf('day');
    const parsedBookingDate = moment(bookingDate, ['DD MMMM YYYY', 'DD MMM YYYY', 'YYYY-MM-DD', moment.ISO_8601,], true,);

    const bookingDay = parsedBookingDate.clone().startOf('day');
    const diffInDays = parsedBookingDate.isValid() ? bookingDay.diff(today, 'days') : -1;

    const canCancel = parsedBookingDate.isValid() && diffInDays >= 10 && !['cancelled', 'rejected', 'payment successful'].includes(bookingStatus);

    const canPay = parsedBookingDate.isValid() && bookingDay.isSameOrAfter(today) && bookingStatus === 'approved';

    const getPaymentButtonConfig = () => {
      if (bookingStatus === 'payment successful') {
        return {
          text: 'Payment Success',
          gradientColors: ['#07875D', '#12A875'],
          textColor: '#FFFFFF',
          borderColor: '#07875D',
        };
      }

      if (bookingStatus === 'cancelled') {
        return {
          text: 'Cancelled',
          gradientColors: ['#FDECF1', '#F8DCE5'],
          textColor: '#B4234D',
          borderColor: '#E8A9BB',
        };
      }

      if (bookingStatus === 'rejected') {
        return {
          text: 'Rejected',
          gradientColors: ['#F1F0F5', '#E3E1E9'],
          textColor: '#625D70',
          borderColor: '#C9C5D2',
        };
      }

      if (diffInDays < 0) {
        return {
          text: 'Booking Expired',
          gradientColors: ['#E9E4E1', '#DDD6D2'],
          textColor: '#746D65',
          borderColor: '#CEC5C0',
        };
      }

      if (bookingStatus === 'approved') {
        return {
          text: 'Pay ₹999',
        };
      }

      return {
        text: 'Awaiting Approval',
        gradientColors: ['#FFF4DB', '#FFE9B8'],
        textColor: '#9A6500',
        borderColor: '#EBCB82',
      };
    };

    const paymentButtonConfig = getPaymentButtonConfig();

    const venueName = item?.catType === 'functionHalls'
      ? item?.functionHallName
      : item?.productName;

    const advanceLabel = item?.catType === 'functionHalls'
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
        <View style={styles.cardImageWrap}>
          {updatedImgUrl ? (
            <FastImage
              resizeMode="cover"
              source={{ uri: updatedImgUrl }}
              style={styles.cardImage}
            />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <IonIcon name="business-outline" size={36} color="#B79F92" />
              <Text style={styles.cardImagePlaceholderText}>Venue photo unavailable</Text>
            </View>
          )}

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {item?.venueCategory || 'VENUE BOOKING'}
            </Text>
          </View>

          <View style={[styles.statusBadge, getStatusStyle(item.bookingStatus)]}>
            <IonIcon
              name={getStatusIcon(item.bookingStatus)}
              size={13}
              color={getStatusColor(item.bookingStatus)}
            />
            <Text
              style={[styles.statusText, { color: getStatusColor(item.bookingStatus) }]}
              numberOfLines={1}>
              {statusText}
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.venueName} numberOfLines={2}>
              {venueName}
            </Text>
            <View style={styles.totalAmountWrap}>
              <Text style={styles.totalAmountLabel}>TOTAL</Text>
              <Text style={styles.totalAmount}>{formatAmount(item?.totalAmount)}</Text>
            </View>
          </View>

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

          <View style={styles.bookingMetaBar}>
            {/* Booking date */}
            <View style={styles.bookingMetaItem}>
              <View style={styles.bookingMetaIcon}>
                <IonIcon
                  name="calendar-outline"
                  size={moderateScale(13)}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.bookingMetaTextWrap}>
                <Text style={styles.bookingMetaLabel}>
                  EVENT DATE
                </Text>

                <Text
                  numberOfLines={1}
                  style={styles.bookingMetaValue}>
                  {item?.startDate || 'Not available'}
                </Text>
              </View>
            </View>

            <View style={styles.bookingMetaDivider} />

            {/* Booking ID */}
            <View style={styles.bookingMetaItem}>
              <View style={styles.bookingMetaIcon}>
                <IonIcon
                  name="document-text-outline"
                  size={moderateScale(13)}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.bookingMetaTextWrap}>
                <Text style={styles.bookingMetaLabel}>
                  BOOKING ID
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={styles.bookingMetaValue}>
                  {item?.bookingId || 'Not available'}
                </Text>
              </View>
            </View>
          </View>

          {item?.catType === 'functionHalls' && item?.advanceAmountPaid > 0 ? (
            <TouchableOpacity
              style={styles.locationRow}
              onPress={() =>
                openMap(item?.vendorLatitude, item?.vendorLongitude)
              }>
              <LocationIcon />
              <Text numberOfLines={1} style={styles.locationText}>
                {item?.functionHallAddress?.address}
              </Text>
            </TouchableOpacity>
          ) : null}

          {bookingStatus === 'payment successful' &&
            item?.vendorMobileNumber ? (
            <View style={styles.vendorContactCard}>
              <View style={styles.vendorContactLeft}>
                <View style={styles.vendorContactIcon}>
                  <IonIcon
                    name="call-outline"
                    size={moderateScale(15)}
                    color="#07875D"
                  />
                </View>

                <View style={styles.vendorContactContent}>
                  <Text style={styles.vendorContactLabel}>
                    VENUE CONTACT
                  </Text>

                  <Text style={styles.vendorContactNumber}>
                    {item.vendorMobileNumber}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Call venue"
                activeOpacity={0.8}
                onPress={() =>
                  Linking.openURL(
                    `tel:${item.vendorMobileNumber}`,
                  )
                }
                style={styles.callVendorButton}>
                <IonIcon
                  name="call"
                  size={moderateScale(13)}
                  color="#FFFFFF"
                />

                <Text style={styles.callVendorButtonText}>
                  Call
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.stepIndicatorContainer}>
            <Text style={styles.progressLabel}>BOOKING PROGRESS</Text>
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
                !canCancel &&
                styles.cancelButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  !canCancel &&
                  styles.cancelButtonTextDisabled,
                ]}
              >
                Cancel Booking
              </Text>
            </TouchableOpacity>

            <View style={styles.payButtonWrapper}>
              <PayNowButton
                onPress={() => {
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
                text={paymentButtonConfig.text}
                gradientColors={paymentButtonConfig.gradientColors}
                textColor={paymentButtonConfig.textColor}
                borderColor={paymentButtonConfig.borderColor}
                showIcon={false}
                disabled={!canPay}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // console.log('!selectedReason || !selectedBookingId',selectedReason,selectedBookingId);

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
              (!selectedReason || !selectedBookingId || (selectedReason === 'Other (Please specify...)' && !otherReasonText.trim())) ?
                styles.confirmCancelButtonDisabled : styles.confirmCancelButton
            ]}
            disabled={!selectedReason || !selectedBookingId || (selectedReason === 'Other (Please specify...)' && !otherReasonText.trim())}
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

      <LinearGradient
        colors={[
          '#6F4A00',
          '#936407',
          '#B98516',
        ]}
        // locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pageHeader}>
        <View style={styles.pageHeaderTop}>
          <View style={styles.pageHeaderCopy}>
            <Text style={styles.pageHeaderEyebrow}>YOUR RESERVATIONS</Text>
            <Text style={styles.pageHeaderTitle}>My Bookings</Text>
            <Text style={styles.pageHeaderSubtitle}>
              Track requests, payments and venue confirmations
            </Text>
          </View>

          <View style={styles.pageHeaderCount}>
            <Text style={styles.pageHeaderCountValue}>{hallsBookings?.length || 0}</Text>
            <Text style={styles.pageHeaderCountLabel}>Bookings</Text>
          </View>
        </View>
      </LinearGradient>

      {!!hallsBookings?.length && !loading && (
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}>
            {bookingFilters.map(filter => {
              const selected = activeFilter === filter.key;
              const count = filter.key === 'all'
                ? hallsBookings.length
                : hallsBookings.filter(item => item?.bookingStatus === filter.key).length;

              return (
                <TouchableOpacity
                  key={filter.key}
                  activeOpacity={0.8}
                  onPress={() => setActiveFilter(filter.key)}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}>
                  <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                    {filter.label}
                  </Text>
                  <View style={[styles.filterCount, selected && styles.filterCountSelected]}>
                    <Text style={[styles.filterCountText, selected && styles.filterCountTextSelected]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>
            Loading your bookings...
          </Text>
        </View>
      ) : hallsBookings?.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderItem}
          keyExtractor={item =>
            String(item?._id ?? item?.bookingId)
          }
          contentContainerStyle={styles.bookingListContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={styles.cardSeparator} />
          )}
          ListEmptyComponent={
            <View style={styles.filterEmptyState}>
              <IonIcon name="file-tray-outline" size={34} color="#B58B74" />
              <Text style={styles.filterEmptyTitle}>No {bookingFilters.find(item => item.key === activeFilter)?.label.toLowerCase()} bookings</Text>
              <Text style={styles.filterEmptyText}>Try another booking status.</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <IonIcon
              name="calendar-outline"
              size={34}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>No bookings yet</Text>

          <Text style={styles.emptySubtitle}>
            When you reserve a venue, your booking details will appear here.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ExploreTab')}
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
  container: {
    flex: 1,
    backgroundColor: '#F6F1ED',
    paddingBottom: 32
  },
  bookingListContent: {
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(32),
    backgroundColor: '#F7F2EE',
  },
  cardSeparator: {
    height: verticalScale(2),
  },
  pageHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageHeaderCopy: {
    flex: 1,
    paddingRight: 12,
  },
  pageHeader: {
    marginHorizontal: 14,
    marginTop: 8,
    paddingHorizontal: 17,
    paddingVertical: 18,
    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#E5C25D',

    elevation: 5,
    shadowColor: '#6B4700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 9,
  },

  pageHeaderEyebrow: {
    color: '#FFF0B3',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: 'ManropeRegular',
  },

  pageHeaderTitle: {
    marginTop: 3,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  pageHeaderSubtitle: {
    marginTop: 5,
    color: '#FFF4CB',
    fontSize: 10.5,
    lineHeight: 15,
    fontFamily: 'ManropeRegular',
  },

  pageHeaderCount: {
    minWidth: 65,
    minHeight: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.46)',
    borderRadius: 18,

    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  pageHeaderCountValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  pageHeaderCountLabel: {
    marginTop: 1,
    color: '#FFF0B3',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  filterSection: {
    backgroundColor: COLORS.background,
  },
  filterContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
  },
  filterChip: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E4D7CF',
    borderRadius: 19,
    backgroundColor: COLORS.white,
  },
  filterChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  filterChipText: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  filterChipTextSelected: {
    color: COLORS.primary,
  },
  filterCount: {
    minWidth: 21,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: '#F0E9E5',
  },
  filterCountSelected: {
    backgroundColor: COLORS.primary,
  },
  filterCountText: {
    color: COLORS.gray,
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  filterCountTextSelected: {
    color: COLORS.white,
  },
  filterEmptyState: {
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 30,
  },
  filterEmptyTitle: {
    marginTop: 12,
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  filterEmptyText: {
    marginTop: 5,
    color: COLORS.gray,
    fontSize: 11,
    fontFamily: 'ManropeRegular',
  },
  bookingList: {
    paddingTop: 6,
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
    marginHorizontal: horizontalScale(12),
    marginBottom: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(18),
    borderWidth: 1.2,
    borderColor: '#DFC8BA',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#6B3821',
    shadowOffset: {
      width: 0,
      height: verticalScale(3),
    },
    shadowOpacity: 0.12,
    shadowRadius: moderateScale(6),
  },
  cardImageWrap: {
    position: 'relative',
    width: '100%',
    height: verticalScale(150),
    backgroundColor: '#EEE7E2',
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImagePlaceholderText: {
    marginTop: 4,
    color: '#8C786D',
    fontSize: 10,
    fontFamily: 'ManropeRegular',
  },
  categoryBadge: {
    position: 'absolute',
    left: 11,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
    borderRadius: 12,
    backgroundColor: 'rgba(43,28,20,0.66)',
  },
  categoryBadgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: 'ManropeRegular',
  },

  cardContent: {
    paddingHorizontal: horizontalScale(12),
    paddingTop: verticalScale(9),
    paddingBottom: verticalScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  venueName: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    color: COLORS.dark,
    fontFamily: 'ManropeRegular',
    flex: 1,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'ManropeRegular',
  },
  totalAmountWrap: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  totalAmountLabel: {
    marginBottom: 1,
    color: COLORS.lightGray,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.6,
    fontFamily: 'ManropeRegular',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.74)',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  statusRequested: {
    backgroundColor: '#FEF3E2',
    color: COLORS.amber,
  },
  statusApproved: {
    backgroundColor: '#FFF0E6',
    color: COLORS.primary,
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

    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#EEE2DB',

    paddingHorizontal: horizontalScale(9),
    paddingVertical: verticalScale(6),

    marginTop: verticalScale(5),
    marginBottom: verticalScale(6),
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
    fontSize: 9.5,
    fontWeight: '500',
    color: COLORS.gray,
    fontFamily: 'ManropeRegular',
    marginBottom: 2,
  },
  amountValueGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.green,
    fontFamily: 'ManropeRegular',
  },
  amountValueOrange: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amber,
    fontFamily: 'ManropeRegular',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 10.5,
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
    fontSize: 9,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'ManropeRegular',
    marginLeft: 5,
  },
  bookingIdPill: {
    alignSelf: 'flex-start',
    // flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 0,
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 9,
    backgroundColor: '#F5EFEB',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    paddingHorizontal: 2,
  },
  locationText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.orange,
    fontFamily: 'ManropeRegular',
    textDecorationLine: 'underline',
    marginLeft: 6,
    flex: 1,
  },
  vendorContactCard: {
    minHeight: verticalScale(45),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(7),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(11),
    borderWidth: 1,
    borderColor: '#B9E4D3',
    backgroundColor: '#EFFAF5',
  },
  vendorContactLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorContactIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDF5EA',
  },
  vendorContactContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: horizontalScale(7),
  },
  vendorContactLabel: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(6.8),
    lineHeight: moderateScale(9),
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#53806E',
  },
  vendorContactNumber: {
    marginTop: verticalScale(1),
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10.5),
    lineHeight: moderateScale(14),
    fontWeight: '800',
    color: '#185C45',
  },
  callVendorButton: {
    minHeight: verticalScale(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(11),
    borderRadius: moderateScale(16),
    backgroundColor: '#07875D',
  },
  callVendorButtonText: {
    marginLeft: horizontalScale(4),
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stepIndicatorContainer: {
    marginBottom: verticalScale(7),
    paddingHorizontal: horizontalScale(6),
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(2),
    borderWidth: 1,
    borderColor: '#EEE2DB',
    borderRadius: moderateScale(11),
    backgroundColor: '#FFFCFA',
  },

  progressLabel: {
    marginBottom: verticalScale(4),

    color: '#9A715C',
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(6.8),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: horizontalScale(8),

    marginTop: verticalScale(2),
    paddingTop: verticalScale(9),

    borderTopWidth: 1,
    borderTopColor: '#EADFD9',
  },

  cancelButton: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cancelRed,
    borderRadius: 20,
  },

  payButtonWrapper: {
    flex: 1,
  },
  cancelButtonDisabled: {
    borderColor: '#DDD4D0',
    backgroundColor: '#F5F1EF',
  },
  cancelButtonText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.cancelRed,
    fontFamily: 'ManropeRegular',
  },
  cancelButtonTextDisabled: {
    color: COLORS.lightGray,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 70,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7CDBE',
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
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
  exploreButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
  },
  exploreButtonText: {
    marginRight: 7,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
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
    borderRadius: 12,
    backgroundColor: COLORS.red,
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
    backgroundColor: COLORS.green,
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  confirmCancelButtonDisabled: {
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    backgroundColor: COLORS.gray,
  },
  confirmCancelText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
    fontFamily: 'ManropeRegular',
  },
  bookingMetaBar: {
    minHeight: verticalScale(44),
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: verticalScale(6),
    marginBottom: verticalScale(7),

    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(5),

    borderRadius: moderateScale(11),
    borderWidth: 1,
    borderColor: '#EEE2DB',
    backgroundColor: '#FCF8F5',
  },

  bookingMetaItem: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookingMetaIcon: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFF0E6',
  },

  bookingMetaTextWrap: {
    flex: 1,
    minWidth: 0,
    marginLeft: horizontalScale(6),
  },

  bookingMetaLabel: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(6.8),
    lineHeight: moderateScale(9),
    fontWeight: '800',
    letterSpacing: 0.45,
    color: COLORS.lightGray,
  },

  bookingMetaValue: {
    marginTop: verticalScale(1),

    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9.5),
    lineHeight: moderateScale(13),
    fontWeight: '700',
    color: COLORS.dark,
  },

  bookingMetaDivider: {
    width: 1,
    height: verticalScale(27),
    marginHorizontal: horizontalScale(7),
    backgroundColor: '#E8DCD5',
  },
});

export default ViewMyBookings;