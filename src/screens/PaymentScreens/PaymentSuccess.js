import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  SafeAreaView, Animated, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const { width } = Dimensions.get('window');

const PaymentSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Route params (optional — screen works without them)
  const {
    productName = '',
    advanceAmount = 0,
    totalAmount = 0,
    bookingId = '',
    orderId = '',
    paymentId = '',
    catType = '',
    hallAddress = '',
    hallImage = '',
    startDate = '',
    endDate = '',
    seatingCapacity = '',
  } = route.params || {};

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1, tension: 60, friction: 8, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(confettiAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleViewBookings = () => {
    navigation.navigate('ViewMyBookings');
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return now.toLocaleDateString('en-IN', options);
  };

  const formatBookingDate = (date) => {
    if (!date) return '';
    return moment(date).format('DD MMM YYYY');
  };

  const hasBookingDetails = productName || advanceAmount || bookingId;
  const hasHallDetails = productName || hallAddress || hallImage;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Success gradient header ── */}
        <LinearGradient
          colors={['#06BE66', '#049B54', '#037A42']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.topGradient}
        >
          <Animated.View style={[styles.gradientCircle1, {
            opacity: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.16] }),
          }]} />
          <Animated.View style={[styles.gradientCircle2, {
            opacity: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.12] }),
          }]} />
          <Animated.View style={[styles.gradientCircle3, {
            opacity: confettiAnim.interpolate({ inputRange: [0, 1], outputRange: [0.06, 0.1] }),
          }]} />

          {/* Floating sparkle dots */}
          <View style={[styles.sparkle, { top: 30, left: 40 }]} />
          <View style={[styles.sparkle, { top: 60, right: 50 }]} />
          <View style={[styles.sparkle, { top: 100, left: 80 }]} />
          <View style={[styles.sparkle, { top: 45, right: 100 }]} />
        </LinearGradient>

        {/* ── Main card ── */}
        <View style={styles.card}>

          {/* Animated checkmark */}
          <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={['#06BE66', '#049B54']} style={styles.iconGradient}>
              <Icon name="checkmark" size={38} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* Status text */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
            <Text style={styles.statusText}>Payment Successful!</Text>
            <View style={styles.statusBadge}>
              <Icon name="shield-checkmark" size={13} color="#06BE66" />
              <Text style={styles.statusBadgeText}>Verified & Secured</Text>
            </View>
          </Animated.View>

          {/* Amount display */}
          {advanceAmount > 0 && (
            <Animated.View style={[styles.amountContainer, { opacity: fadeAnim }]}>
              <Text style={styles.amountLabel}>Amount Paid</Text>
              <Text style={styles.amountValue}>{formatCurrency(advanceAmount)}</Text>
              {totalAmount > 0 && totalAmount !== advanceAmount && (
                <Text style={styles.amountSub}>
                  of {formatCurrency(totalAmount)} total
                </Text>
              )}
            </Animated.View>
          )}

          {/* ── Booked Hall Details Card ── */}
          {hasHallDetails && (
            <Animated.View style={[styles.hallCard, { opacity: fadeAnim }]}>
              {hallImage ? (
                <View style={styles.hallImageWrapper}>
                  <FastImage
                    source={{ uri: hallImage, priority: FastImage.priority.normal }}
                    style={styles.hallImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.hallImageOverlay}
                  />
                  <View style={styles.hallImageBadge}>
                    <Icon name="checkmark-circle" size={12} color="#06BE66" />
                    <Text style={styles.hallImageBadgeText}>Booked</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.hallInfo}>
                {/* Hall Name */}
                {productName ? (
                  <View style={styles.hallNameRow}>
                    <Icon name="business" size={16} color="#FD813B" />
                    <Text style={styles.hallName} numberOfLines={2}>{productName}</Text>
                  </View>
                ) : null}

                {/* Category badge */}
                {catType ? (
                  <View style={styles.catBadge}>
                    <Icon name="pricetag" size={10} color="#FD813B" />
                    <Text style={styles.catBadgeText}>
                      {catType === 'functionHalls' ? 'Function Hall' :
                       catType === 'caterings' ? 'Catering' : catType}
                    </Text>
                  </View>
                ) : null}

                {/* Location */}
                {hallAddress ? (
                  <View style={styles.hallDetailRow}>
                    <View style={styles.hallDetailIcon}>
                      <Icon name="location" size={14} color="#D2453B" />
                    </View>
                    <View style={styles.hallDetailContent}>
                      <Text style={styles.hallDetailLabel}>Location</Text>
                      <Text style={styles.hallDetailValue} numberOfLines={2}>{hallAddress}</Text>
                    </View>
                  </View>
                ) : null}

                {/* Booking Dates */}
                {(startDate || endDate) ? (
                  <View style={styles.hallDetailRow}>
                    <View style={styles.hallDetailIcon}>
                      <Icon name="calendar" size={14} color="#6C5CE7" />
                    </View>
                    <View style={styles.hallDetailContent}>
                      <Text style={styles.hallDetailLabel}>Event Date</Text>
                      <Text style={styles.hallDetailValue}>
                        {formatBookingDate(startDate)}
                        {endDate && startDate !== endDate ? ` — ${formatBookingDate(endDate)}` : ''}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {/* Capacity */}
                {seatingCapacity ? (
                  <View style={styles.hallDetailRow}>
                    <View style={styles.hallDetailIcon}>
                      <Icon name="people" size={14} color="#06BE66" />
                    </View>
                    <View style={styles.hallDetailContent}>
                      <Text style={styles.hallDetailLabel}>Seating Capacity</Text>
                      <Text style={styles.hallDetailValue}>{seatingCapacity} guests</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </Animated.View>
          )}

          {/* ── Payment details ── */}
          {(orderId || paymentId || bookingId) ? (
            <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
              <View style={styles.detailsHeader}>
                <Icon name="receipt-outline" size={16} color="#FD813B" />
                <Text style={styles.detailsHeaderText}>Transaction Details</Text>
              </View>

              <View style={styles.divider} />

              {orderId ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{orderId}</Text>
                </View>
              ) : null}

              {paymentId ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment ID</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{paymentId}</Text>
                </View>
              ) : null}

              {bookingId ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking ID</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{bookingId}</Text>
                </View>
              ) : null}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Paid On</Text>
                <Text style={styles.detailValue}>{getFormattedDate()}</Text>
              </View>
            </Animated.View>
          ) : null}

          {/* ── What's next ── */}
          <Animated.View style={[styles.nextStepsCard, { opacity: fadeAnim }]}>
            <Text style={styles.nextStepsTitle}>What happens next?</Text>
            <View style={styles.stepRow}>
              <View style={styles.stepDot}>
                <Text style={styles.stepDotText}>1</Text>
              </View>
              <Text style={styles.stepText}>Vendor will confirm your booking</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepDot}>
                <Text style={styles.stepDotText}>2</Text>
              </View>
              <Text style={styles.stepText}>You'll receive a notification update</Text>
            </View>
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.stepDotText, { color: '#FD813B' }]}>3</Text>
              </View>
              <Text style={styles.stepText}>Track your booking in "My Bookings"</Text>
            </View>
          </Animated.View>

          {/* CTA Buttons */}
          <TouchableOpacity onPress={handleViewBookings} style={styles.primaryBtn} activeOpacity={0.88}>
            <LinearGradient
              colors={['#FD813B', '#ECA73C']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              <Icon name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>View My Bookings</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleHome} style={styles.secondaryBtn} activeOpacity={0.8}>
            <Icon name="home-outline" size={16} color="#06BE66" />
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>

        </View>

        {/* ── Footer ── */}
        <View style={styles.footerRow}>
          <Icon name="lock-closed" size={12} color="#B0B0B0" />
          <Text style={styles.footerText}>Secured by Razorpay</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFBF5' },
  scrollContent: { alignItems: 'center', paddingBottom: 40 },

  // ── TOP GRADIENT ──
  topGradient: {
    width: '100%', height: 120,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    overflow: 'hidden', position: 'relative',
  },
  gradientCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#fff', top: -60, right: -40,
  },
  gradientCircle2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#fff', top: 80, left: -40,
  },
  gradientCircle3: {
    position: 'absolute', width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#fff', bottom: -20, right: 60,
  },
  sparkle: {
    position: 'absolute', width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  // ── CARD ──
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, paddingTop: 50,
    width: width - 36, alignItems: 'center', marginTop: -60,
    elevation: 10, shadowColor: '#06BE66',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20,
  },

  // ── ICON ──
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, marginBottom: 18, marginTop: -70,
    elevation: 8, shadowColor: '#06BE66',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
  },
  iconGradient: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: '#fff',
  },

  // ── STATUS ──
  statusText: {
    fontFamily: 'ManropeRegular', fontSize: 24, fontWeight: '800',
    color: '#131313', textAlign: 'center', marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'center',
    backgroundColor: 'rgba(6,190,102,0.08)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(6,190,102,0.2)',
  },
  statusBadgeText: {
    fontFamily: 'ManropeRegular', fontSize: 11, fontWeight: '600', color: '#06BE66',
  },

  // ── AMOUNT ──
  amountContainer: {
    alignItems: 'center', marginBottom: 20,
    backgroundColor: '#F0FFF7', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 28,
    borderWidth: 1, borderColor: 'rgba(6,190,102,0.15)', width: '100%',
  },
  amountLabel: {
    fontFamily: 'ManropeRegular', fontSize: 12, color: '#777', marginBottom: 4,
  },
  amountValue: {
    fontFamily: 'ManropeRegular', fontSize: 32, fontWeight: '800', color: '#06BE66',
  },
  amountSub: {
    fontFamily: 'ManropeRegular', fontSize: 12, color: '#999', marginTop: 4,
  },

  // ── HALL DETAILS CARD ──
  hallCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16,
    marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#F0F0F0',
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  hallImageWrapper: {
    width: '100%', height: 140, position: 'relative',
  },
  hallImage: {
    width: '100%', height: '100%',
  },
  hallImageOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
  },
  hallImageBadge: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  hallImageBadgeText: {
    fontFamily: 'ManropeRegular', fontSize: 10, fontWeight: '700', color: '#06BE66',
  },
  hallInfo: {
    padding: 14,
  },
  hallNameRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  hallName: {
    fontFamily: 'ManropeRegular', fontSize: 16, fontWeight: '700',
    color: '#131313', flex: 1,
  },
  catBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    backgroundColor: '#FFF5EE', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3, marginBottom: 12,
    borderWidth: 1, borderColor: '#FFEAC1',
  },
  catBadgeText: {
    fontFamily: 'ManropeRegular', fontSize: 10, fontWeight: '600', color: '#FD813B',
  },
  hallDetailRow: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10,
  },
  hallDetailIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F5F5',
    justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 2,
  },
  hallDetailContent: { flex: 1 },
  hallDetailLabel: {
    fontFamily: 'ManropeRegular', fontSize: 10, color: '#999', marginBottom: 2,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  hallDetailValue: {
    fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '600', color: '#333',
    lineHeight: 18,
  },

  // ── TRANSACTION DETAILS ──
  detailsCard: {
    width: '100%', backgroundColor: '#FAFAFA', borderRadius: 14,
    padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0',
  },
  detailsHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8,
  },
  detailsHeaderText: {
    fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '700', color: '#131313',
  },
  divider: {
    height: 1, backgroundColor: '#ECECEC', marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontFamily: 'ManropeRegular', fontSize: 12, color: '#777',
  },
  detailValue: {
    fontFamily: 'ManropeRegular', fontSize: 12, fontWeight: '600', color: '#333',
    maxWidth: '55%', textAlign: 'right',
  },

  // ── NEXT STEPS ──
  nextStepsCard: {
    width: '100%', backgroundColor: '#F8FBF8', borderRadius: 14,
    padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E8F5E9',
  },
  nextStepsTitle: {
    fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '700',
    color: '#131313', marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  stepDot: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  stepDotText: {
    fontFamily: 'ManropeRegular', fontSize: 11, fontWeight: '700', color: '#06BE66',
  },
  stepText: {
    fontFamily: 'ManropeRegular', fontSize: 13, color: '#555', flex: 1,
  },

  // ── BUTTONS ──
  primaryBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  primaryGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, gap: 8,
  },
  primaryBtnText: {
    fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: '#fff',
  },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 14, width: '100%',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#D6EDD6',
    backgroundColor: '#F0FFF7',
  },
  secondaryBtnText: {
    fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: '#06BE66',
  },

  // ── FOOTER ──
  footerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 20,
  },
  footerText: {
    fontFamily: 'ManropeRegular', fontSize: 11, color: '#B0B0B0',
  },
});

export default PaymentSuccess;
