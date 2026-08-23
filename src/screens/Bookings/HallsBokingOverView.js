import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

import BASE_URL from '../../apiconfig';
import {getUserAuthToken} from '../../utils/StoreAuthToken';
import {formatAmount} from '../../utils/GlobalFunctions';

const COLORS = {
  primary: '#FD813B',
  primaryDark: '#D85B1E',
  primaryLight: '#FFF0E8',
  gold: '#F0B761',
  goldDark: '#A16207',
  goldLight: '#FFF7E1',
  background: '#FFFBF7',
  surface: '#FFFFFF',
  text: '#2B211B',
  muted: '#786B64',
  border: '#F1E5DE',
  green: '#07875D',
  greenLight: '#E7F8F1',
  red: '#B4234D',
};

const toNumericString = value => String(value ?? '').replace(/[^\d]/g, '');

const toNumber = value => Number(toNumericString(value)) || 0;

const InfoRow = ({icon, label, value, valueStyle, multiline = false}) => (
  <View style={[styles.infoRow, multiline && styles.infoRowTop]}>
    <View style={styles.infoIcon}>
      <IonIcon name={icon} size={17} color={COLORS.primary} />
    </View>

    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        numberOfLines={multiline ? 3 : 1}
        style={[styles.infoValue, valueStyle]}>
        {value || 'Not available'}
      </Text>
    </View>
  </View>
);

const PriceRow = ({label, value, highlighted = false, muted = false}) => (
  <View style={styles.priceRow}>
    <Text style={[styles.priceLabel, muted && styles.priceLabelMuted]}>
      {label}
    </Text>
    <Text style={[styles.priceValue, highlighted && styles.priceValuePrimary]}>
      {formatAmount(value)}
    </Text>
  </View>
);

const HallsBookingOverView = ({route, navigation}) => {
  const {
    categoryId,
    timeSlot,
    bookingDate,
    totalPrice,
    advanceAmount,
    selectedMenus,
  } = route.params;

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [thankYouCardVisible, setThankYouCardVisible] = useState(false);

  const userLoggedInMobileNum = useSelector(
    state => state.userLoggedInMobileNum,
  );
  const userLoggedInName = useSelector(state => state.userLoggedInName);

  const totalAmountValue = useMemo(() => toNumber(totalPrice), [totalPrice]);
  const advanceAmountValue = useMemo(
    () => toNumber(advanceAmount),
    [advanceAmount],
  );
  const balanceAmountValue = Math.max(
    totalAmountValue - advanceAmountValue,
    0,
  );

  const selectedMenuCount = Array.isArray(selectedMenus)
    ? selectedMenus.length
    : 0;

  const formattedBookingDate = useMemo(() => {
    const parsedDate = moment(bookingDate, ['DD-MM-YYYY', 'DD MMMM YYYY']);
    return parsedDate.isValid()
      ? parsedDate.format('ddd, DD MMM YYYY')
      : bookingDate;
  }, [bookingDate]);

  const getEventsDetails = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const token = await getUserAuthToken();
      const response = await axios.get(
        `${BASE_URL}/getFunctionHallDetailsById/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBookingDetails(response?.data);
    } catch (error) {
      setLoadError(
        error?.response?.data?.message ||
          'Unable to load the venue details. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    getEventsDetails();
  }, [getEventsDetails]);

  const confirmBooking = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      productId: categoryId,
      startDate: moment(bookingDate, 'DD-MM-YYYY').format('DD MMMM YYYY'),
      endDate: moment(bookingDate, 'DD-MM-YYYY').format('DD MMMM YYYY'),
      numOfDays: 1,
      totalAmount: toNumericString(totalPrice),
      userMobileNumber: userLoggedInMobileNum,
      bookingTime: timeSlot,
      userFullName: userLoggedInName,
      advanceAmountToPay: toNumericString(advanceAmount),
      foodMenuSelectedByUser: selectedMenus,
    };

    try {
      const token = await getUserAuthToken();
      const response = await axios.post(
        `${BASE_URL}/create-function-hall-booking`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.status === 201) {
        setThankYouCardVisible(true);
      } else {
        setSubmitError('Unable to send the booking request. Please try again.');
      }
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          'Something went wrong while sending your request.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setThankYouCardVisible(false);
    navigation.navigate('Home');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerState}>
        <View style={styles.loadingIcon}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
        <Text style={styles.stateTitle}>Preparing your booking</Text>
        <Text style={styles.stateSubtitle}>
          Loading venue and pricing details...
        </Text>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.centerState}>
        <View style={styles.errorIcon}>
          <IonIcon name="cloud-offline-outline" size={32} color={COLORS.red} />
        </View>
        <Text style={styles.stateTitle}>Could not load booking</Text>
        <Text style={styles.stateSubtitle}>{loadError}</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={getEventsDetails}
          style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.75}
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <IonIcon name="arrow-back" size={21} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Review booking</Text>
          <Text style={styles.headerSubtitle}>Check details before sending</Text>
        </View>

        <View style={styles.secureHeaderIcon}>
          <IonIcon
            name="shield-checkmark-outline"
            size={20}
            color={COLORS.green}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.venueCard}>
          <FastImage
            source={{uri: bookingDetails?.professionalImage?.url}}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.venueImage}
          />

          <View style={styles.imageCategoryBadge}>
            <IonIcon name="business-outline" size={12} color={COLORS.primary} />
            <Text style={styles.imageCategoryText}>FUNCTION HALL</Text>
          </View>

          <View style={styles.venueContent}>
            <Text numberOfLines={2} style={styles.venueName}>
              {bookingDetails?.functionHallName}
            </Text>

            <View style={styles.infoGrid}>
              <InfoRow
                icon="calendar-outline"
                label="EVENT DATE"
                value={formattedBookingDate}
              />

              <InfoRow
                icon="time-outline"
                label="TIME SLOT"
                value={timeSlot}
              />

              <InfoRow
                icon="location-outline"
                label="VENUE ADDRESS"
                value={bookingDetails?.functionHallAddress?.address}
                multiline
              />
            </View>
          </View>
        </View>

        {selectedMenuCount > 0 && (
          <View style={styles.menuCard}>
            <View style={styles.menuIcon}>
              <IonIcon name="restaurant-outline" size={20} color={COLORS.goldDark} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Food menu selected</Text>
              <Text style={styles.menuSubtitle}>
                {selectedMenuCount}{' '}
                {selectedMenuCount === 1 ? 'menu option' : 'menu options'} added
                to this booking
              </Text>
            </View>
            <IonIcon name="checkmark-circle" size={22} color={COLORS.green} />
          </View>
        )}

        <View style={styles.priceCard}>
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.sectionTitle}>Price summary</Text>
              <Text style={styles.sectionSubtitle}>One-day venue booking</Text>
            </View>
            <View style={styles.rupeeIcon}>
              <Text style={styles.rupeeText}>₹</Text>
            </View>
          </View>

          <View style={styles.priceRows}>
            <PriceRow label="Total venue amount" value={totalAmountValue} />
            <PriceRow
              label="Booking advance"
              value={advanceAmountValue}
              highlighted
            />
            <View style={styles.priceDivider} />
            <PriceRow
              label="Remaining balance"
              value={balanceAmountValue}
              muted
            />
          </View>

          <View style={styles.advanceNote}>
            <IonIcon name="information-circle-outline" size={17} color={COLORS.goldDark} />
            <Text style={styles.advanceNoteText}>
              You will be asked to pay the advance only after the venue approves
              your request.
            </Text>
          </View>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.sectionTitle}>What happens next?</Text>

          <View style={styles.timelineRow}>
            <View style={styles.timelineMarkerActive}>
              <Text style={styles.timelineNumberActive}>1</Text>
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Send request</Text>
              <Text style={styles.timelineDescription}>
                Your selected date and venue details are sent to the vendor.
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineRow}>
            <View style={styles.timelineMarker}>
              <Text style={styles.timelineNumber}>2</Text>
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Venue approval</Text>
              <Text style={styles.timelineDescription}>
                Track the approval status from My Bookings.
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineRow}>
            <View style={styles.timelineMarker}>
              <Text style={styles.timelineNumber}>3</Text>
            </View>
            <View style={styles.timelineTextContainer}>
              <Text style={styles.timelineTitle}>Pay and confirm</Text>
              <Text style={styles.timelineDescription}>
                Complete the secure advance payment after approval.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.secureStrip}>
          <IonIcon name="lock-closed" size={16} color={COLORS.green} />
          <Text style={styles.secureStripText}>
            Secure booking flow powered by BookTheDay
          </Text>
        </View>

        {!!submitError && (
          <View style={styles.submitError}>
            <IonIcon name="alert-circle-outline" size={18} color={COLORS.red} />
            <Text style={styles.submitErrorText}>{submitError}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomAmount}>
          <Text style={styles.bottomAmountLabel}>Advance after approval</Text>
          <Text style={styles.bottomAmountValue}>
            {formatAmount(advanceAmountValue)}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Send booking request"
          disabled={submitting}
          activeOpacity={0.88}
          onPress={confirmBooking}
          style={styles.requestButtonWrapper}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.requestButton}>
            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.surface} />
            ) : (
              <>
                <Text style={styles.requestButtonText}>Send request</Text>
                <IonIcon name="arrow-forward" size={17} color={COLORS.surface} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={thankYouCardVisible}
        onBackdropPress={closeSuccessModal}
        onBackButtonPress={closeSuccessModal}
        backdropOpacity={0.55}
        hideModalContentWhileAnimating
        animationIn="zoomIn"
        animationOut="zoomOut"
        useNativeDriver>
        <View style={styles.successCard}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <IonIcon name="checkmark" size={34} color={COLORS.primary} />
            </View>
          </LinearGradient>

          <Text style={styles.successTitle}>Request sent!</Text>
          <Text style={styles.successSubtitle}>
            Your booking request has been shared with{' '}
            {bookingDetails?.functionHallName || 'the venue'}.
          </Text>

          <View style={styles.successInfo}>
            <IonIcon name="notifications-outline" size={18} color={COLORS.goldDark} />
            <Text style={styles.successInfoText}>
              We will notify you when the venue responds. You can track the
              status from My Bookings.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={closeSuccessModal}
            style={styles.successButton}>
            <Text style={styles.successButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    marginTop: 2,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    color: COLORS.muted,
  },
  secureHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greenLight,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 118,
  },
  venueCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  venueImage: {
    width: '100%',
    height: 185,
    backgroundColor: '#F3EAE4',
  },
  imageCategoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  imageCategoryText: {
    fontFamily: 'ManropeRegular',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: COLORS.primary,
  },
  venueContent: {
    padding: 15,
  },
  venueName: {
    marginBottom: 14,
    fontFamily: 'ManropeRegular',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRowTop: {
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoLabel: {
    marginBottom: 2,
    fontFamily: 'ManropeRegular',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: COLORS.muted,
  },
  infoValue: {
    fontFamily: 'ManropeRegular',
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 13,
    borderRadius: 15,
    backgroundColor: COLORS.goldLight,
    borderWidth: 1,
    borderColor: '#F0D591',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  menuContent: {
    flex: 1,
    marginHorizontal: 11,
  },
  menuTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  menuSubtitle: {
    marginTop: 3,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    lineHeight: 14,
    color: COLORS.muted,
  },
  priceCard: {
    marginTop: 12,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSubtitle: {
    marginTop: 3,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    color: COLORS.muted,
  },
  rupeeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  rupeeText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  priceRows: {
    marginTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    flex: 1,
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    color: COLORS.muted,
  },
  priceLabelMuted: {
    color: COLORS.text,
    fontWeight: '700',
  },
  priceValue: {
    fontFamily: 'ManropeRegular',
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  priceValuePrimary: {
    fontSize: 15,
    color: COLORS.primary,
  },
  priceDivider: {
    height: 1,
    marginBottom: 12,
    backgroundColor: COLORS.border,
  },
  advanceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 11,
    borderRadius: 12,
    backgroundColor: COLORS.goldLight,
  },
  advanceNoteText: {
    flex: 1,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    lineHeight: 15,
    color: '#765515',
  },
  nextStepsCard: {
    marginTop: 12,
    padding: 15,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  timelineMarkerActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  timelineMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: '#F6D2BE',
  },
  timelineNumberActive: {
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.surface,
  },
  timelineNumber: {
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  timelineTextContainer: {
    flex: 1,
    marginLeft: 11,
  },
  timelineTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  timelineDescription: {
    marginTop: 3,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    lineHeight: 15,
    color: COLORS.muted,
  },
  timelineConnector: {
    width: 1,
    height: 13,
    marginLeft: 13.5,
    marginTop: 3,
    backgroundColor: '#F1CDB9',
  },
  secureStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 12,
    padding: 11,
    borderRadius: 13,
    backgroundColor: COLORS.greenLight,
  },
  secureStripText: {
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.green,
  },
  submitError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FDECF1',
  },
  submitErrorText: {
    flex: 1,
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.red,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 14,
    shadowColor: COLORS.primaryDark,
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.08,
    shadowRadius: 9,
  },
  bottomAmount: {
    flex: 1,
    marginRight: 12,
  },
  bottomAmountLabel: {
    fontFamily: 'ManropeRegular',
    fontSize: 9.5,
    color: COLORS.muted,
  },
  bottomAmountValue: {
    marginTop: 2,
    fontFamily: 'ManropeRegular',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  requestButtonWrapper: {
    flex: 1.25,
    borderRadius: 24,
    overflow: 'hidden',
  },
  requestButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  requestButtonText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.surface,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    backgroundColor: COLORS.background,
  },
  loadingIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDECF1',
  },
  stateTitle: {
    marginTop: 18,
    fontFamily: 'ManropeRegular',
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  stateSubtitle: {
    marginTop: 7,
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: COLORS.muted,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.surface,
  },
  successCard: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 20,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
  },
  successIconOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  successTitle: {
    marginTop: 18,
    fontFamily: 'ManropeRegular',
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.text,
  },
  successSubtitle: {
    marginTop: 8,
    fontFamily: 'ManropeRegular',
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    color: COLORS.muted,
  },
  successInfo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 18,
    padding: 12,
    borderRadius: 13,
    backgroundColor: COLORS.goldLight,
  },
  successInfoText: {
    flex: 1,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    lineHeight: 15,
    color: '#765515',
  },
  successButton: {
    width: '100%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
  },
  successButtonText: {
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.surface,
  },
});

export default HallsBookingOverView;
