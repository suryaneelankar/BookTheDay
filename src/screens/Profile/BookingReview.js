import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlert from '../../components/CustomAlert';
import Icon from 'react-native-vector-icons/MaterialIcons';
import themevariable from '../../utils/themevariable';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';

// live

// const BOOKING_TOKEN_AMOUNT = 999;

// staging

const BOOKING_TOKEN_AMOUNT = 1;

const normalizeCategory = value => {
    const category = String(value || '').toLowerCase();

    if (category.includes('cater')) return 'caterings';

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

const BookingReview = ({ navigation, route }) => {
    const { selectedBooking } = route.params;
    const [isChecked, setIsChecked] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);

    const {
        totalAmount,
        advanceAmountToPay,
        securityDepositAmount,
        vendorName,
        bookingId,
        productName,
        catType,
        startDate,
        endDate,
        vendorMobileNumber,
        functionHallName,
        foodCateringName,
        hallAddress,
        hallImage,
        seatingCapacity,
    } = selectedBooking;

    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const userLoggedInName = useSelector((state) => state.userLoggedInName);

    const fixedTokenAmount = BOOKING_TOKEN_AMOUNT;

    // if (securityDepositAmount) {
    //     fixedTokenAmount = securityDepositAmount;
    // } else {
    //     if (totalAmount > 900000) {
    //         fixedTokenAmount = 30000;
    //     } else if (totalAmount > 600000) {
    //         fixedTokenAmount = 20000;
    //     } else if (totalAmount > 300000) {
    //         fixedTokenAmount = 15000;
    //     } else {
    //         fixedTokenAmount = 10000;
    //     }
    // }   

    // if (advanceAmountToPay < 10000) {
    //     fixedTokenAmount = 5;
    // }

    const requestedAdvance = Number(advanceAmountToPay || securityDepositAmount || 0);
    const bookingTotal = Number(totalAmount || 0);
    const remainingAdvance = Math.max(requestedAdvance - fixedTokenAmount, 0);
    const remainingAmount = Math.max(
        bookingTotal - fixedTokenAmount - remainingAdvance,
        0,
    );

    const bookingCategory = normalizeCategory(catType);
    const bookingName = bookingCategory === 'caterings'
        ? foodCateringName
        : bookingCategory === 'functionHalls'
            ? functionHallName
            : productName;

    const shortBookingId = bookingId
        ? `#${String(bookingId).slice(-8).toUpperCase()}`
        : 'Pending ID';

    const formatAmount = (amount) =>
        `₹${amount?.toLocaleString('en-IN') || 0}`;

    const handleProceed = () => {
        if (!isChecked || paymentInProgress) return;
        handlePayment();
    };


    const fetchRazorpayKey = async (token) => {
        const res = await fetch(`${BASE_URL}/razorpay-key`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data?.key) {
            throw new Error(data?.message || 'Unable to load payment configuration.');
        }

        return data;
    };

    const handlePayment = async () => {
        if (paymentInProgress) return;

        const normalizedCatType = bookingCategory;

        if (!bookingId || !vendorMobileNumber || !normalizedCatType) {
            CustomAlert.alert(
                'Payment unavailable',
                'This booking does not contain the required payment details.',
                undefined,
                { type: 'warning' },
            );
            return;
        }

        setPaymentInProgress(true);
        let checkoutPaymentCompleted = '';

        try {
            const token = await getUserAuthToken();

            if (!token) {
                CustomAlert.alert(
                    'Session expired',
                    'Please log in again to continue.',
                    undefined,
                    { type: 'warning' },
                );
                return;
            }

            const { key, defaultMethod } = await fetchRazorpayKey(token);
            const initiatePaymentPayload = {
                bookingId,
                catType: normalizedCatType,
                vendorMobileNumber,
                productName: bookingName || productName,
                userFullName: userLoggedInName,
            };

            const initiateresponse = await axios.post(`${BASE_URL}/user/initiate-payment`, initiatePaymentPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const internalOrderId = initiateresponse?.data?.data?.OrderId;

            if (!internalOrderId) {
                throw new Error('The server did not return a payment reference.');
            }

            const orderResponse = await axios.post(
                `${BASE_URL}/create-order`,
                { receipt: internalOrderId },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            const order = orderResponse?.data;

            if (!order?.orderId || order?.amount !== BOOKING_TOKEN_AMOUNT * 100) {
                throw new Error('The server returned an invalid ₹999 payment order.');
            }

            const paymentData = await RazorpayCheckout.open({
                description: `Booking token for ${bookingName || productName}`,
                currency: order.currency || 'INR',
                key,
                amount: order.amount,
                order_id: order.orderId,
                name: 'BookTheDay',
                prefill: {
                    contact: userLoggedInMobileNum,
                    name: userLoggedInName,
                    ...(defaultMethod ? { method: defaultMethod } : {}),
                },
                theme: { color: '#CE951A' },
            });

            console.log('paymentData is in booking review ::>>>>', paymentData);

            checkoutPaymentCompleted = paymentData?.razorpay_payment_id;

            const verificationResponse = await axios.patch(
                `${BASE_URL}/user/update-payment-status`,
                {
                    orderId: internalOrderId,
                    razorpay_order_id: paymentData?.razorpay_order_id,
                    razorpay_payment_id: paymentData?.razorpay_payment_id,
                    razorpay_signature: paymentData?.razorpay_signature,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            const verificationResult =
                verificationResponse?.data;

            if (verificationResult?.paymentVerified !== true) {
                throw new Error(
                    verificationResult?.message ||
                    'Payment verification was not confirmed.',
                );
            }

            navigation.navigate('PaymentSuccess', {
                productName: bookingName || productName,
                advanceAmount: BOOKING_TOKEN_AMOUNT,
                totalAmount,
                bookingId,
                orderId: internalOrderId,
                paymentId: paymentData.razorpay_payment_id,
                catType: normalizedCatType,
                hallAddress: hallAddress || '',
                hallImage: hallImage || '',
                startDate: startDate || '',
                endDate: endDate || '',
                seatingCapacity: seatingCapacity || '',
            });
        } catch (error) {
            const checkoutCancelled =
                error?.code === 0
                || error?.code === 'PAYMENT_CANCELLED'
                || String(error?.description || '').toLowerCase().includes('cancel');

            console.error(
                'Booking-token payment failed:',
                error?.response?.data?.message || error?.description || error?.message,
            );

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
    };

    const PaymentRow = ({ icon, label, value, valueStyle, last }) => (
        <View style={[styles.paymentRow, !last && styles.paymentRowBorder]}>
            <View style={styles.paymentLabelWrap}>
                <View style={styles.paymentIconWrap}>
                    <Icon name={icon} size={17} color="#8A6108" />
                </View>
                <Text style={styles.paymentLabel}>{label}</Text>
            </View>
            <Text style={[styles.paymentValue, valueStyle]}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF8E8" />

            <LinearGradient colors={['#FFF8E8', '#FFF1C7']} style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Icon name="arrow-back" size={22} color="#5D430D" />
                </TouchableOpacity>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerTitle}>Review booking</Text>
                    <Text style={styles.headerSubtitle}>Confirm details before payment</Text>
                </View>
                <View style={styles.secureHeaderIcon}>
                    <Icon name="lock-outline" size={19} color="#8A6108" />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.summaryCard}>
                    <View style={styles.venueIcon}>
                        <Icon name="location-on" size={23} color="#A87205" />
                    </View>
                    <View style={styles.summaryText}>
                        <Text style={styles.summaryEyebrow}>YOUR BOOKING</Text>
                        <Text style={styles.venueName} numberOfLines={2}>
                            {bookingName || vendorName || 'Selected venue'}
                        </Text>
                        {!!vendorName && vendorName !== bookingName && (
                            <Text style={styles.vendorName} numberOfLines={1}>
                                Managed by {vendorName}
                            </Text>
                        )}
                    </View>
                    <View style={styles.bookingIdChip}>
                        <Text style={styles.bookingIdText}>{shortBookingId}</Text>
                    </View>
                </View>

                <View style={styles.dateCard}>
                    <View style={styles.dateIconWrap}>
                        <Icon name="event-available" size={21} color="#8A6108" />
                    </View>
                    {catType === 'clothJewels' ? (
                        <View style={styles.dateRange}>
                            <View style={styles.dateBlock}>
                                <Text style={styles.dateLabel}>START DATE</Text>
                                <Text style={styles.dateValue}>{startDate || '-'}</Text>
                            </View>
                            <Icon name="arrow-forward" size={18} color="#B29B6A" />
                            <View style={[styles.dateBlock, styles.endDateBlock]}>
                                <Text style={styles.dateLabel}>END DATE</Text>
                                <Text style={styles.dateValue}>{endDate || '-'}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.dateBlock}>
                            <Text style={styles.dateLabel}>BOOKING DATE</Text>
                            <Text style={styles.dateValue}>{startDate || '-'}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Payment summary</Text>
                <View style={styles.paymentCard}>
                    <PaymentRow icon="currency-rupee" label="Total booking amount" value={formatAmount(totalAmount)} />
                    <PaymentRow icon="verified-user" label="Pay securely now" value={formatAmount(fixedTokenAmount)} valueStyle={styles.payNowValue} />
                    {remainingAdvance > 0 && (
                        <PaymentRow icon="schedule" label="Remaining advance (offline)" value={formatAmount(remainingAdvance)} />
                    )}
                    <PaymentRow icon="account-balance-wallet" label="Balance at venue" value={formatAmount(Math.max(0, remainingAmount))} last />
                </View>

                <LinearGradient colors={['#FFF7D6', '#FFF1C7']} style={styles.payNowCard}>
                    <View>
                        <Text style={styles.payNowLabel}>AMOUNT TO PAY NOW</Text>
                        <Text style={styles.payNowHint}>Secure online payment</Text>
                    </View>
                    <Text style={styles.payNowAmount}>{formatAmount(fixedTokenAmount)}</Text>
                </LinearGradient>

                {/* Note */}
                <View style={styles.noteBox}>
                    <View style={styles.noteIcon}>
                        <Icon name="info-outline" size={19} color="#8A6108" />
                    </View>
                    <Text style={styles.noteText}>
                        The token amount blocks your selected date. Pay the remaining advance directly to the vendor at least 7 days before the booking date.
                    </Text>
                </View>

                <View style={styles.secureStrip}>
                    <Icon name="verified-user" size={17} color="#39704A" />
                    <Text style={styles.secureStripText}>Payment processed securely by Razorpay</Text>
                </View>
            </ScrollView>

            {/* Sticky Proceed Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.checkRow, isChecked && styles.checkRowSelected]}
                    onPress={() => setIsChecked(current => !current)}
                    activeOpacity={0.8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isChecked }}
                >
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                        {isChecked && <Icon name="check" size={15} color="#fff" />}
                    </View>
                    <Text style={styles.checkText}>
                        I understand the advance is <Text style={styles.checkStrong}>non-refundable</Text> if I cancel.
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.payButton, !isChecked && styles.payButtonDisabled]}
                    onPress={handleProceed}
                    disabled={!isChecked || paymentInProgress}
                    activeOpacity={0.88}
                    accessibilityRole="button"
                >
                    <LinearGradient
                        colors={isChecked && !paymentInProgress ? ['#A87205', '#CE951A', '#E4B946'] : ['#D9D2C7', '#C8C0B5']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.payButtonGradient}
                    >
                        <Icon name="lock" size={17} color="#FFFFFF" />
                        <Text style={styles.payText}>
                            {paymentInProgress
                                ? 'Processing payment…'
                                : `Pay ${formatAmount(fixedTokenAmount)} securely`}
                        </Text>
                        <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FAF8F4' },
    header: {
        minHeight: 68,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E9D69B',
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.72)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8D49A',
    },
    headerTextWrap: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
    headerTitle: { fontFamily: 'ManropeBold', fontSize: 17, color: '#3E3013' },
    headerSubtitle: { marginTop: 1, fontFamily: 'ManropeRegular', fontSize: 10.5, color: '#826B35' },
    secureHeaderIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 170 },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EEE7DA',
        elevation: 2,
        shadowColor: '#604816',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 7,
    },
    venueIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFF4D6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: { flex: 1, marginHorizontal: 11 },
    summaryEyebrow: { fontFamily: 'ManropeBold', fontSize: 9, letterSpacing: 0.8, color: '#A87205' },
    venueName: { marginTop: 3, fontFamily: 'ManropeBold', fontSize: 15, lineHeight: 20, color: '#28231B' },
    vendorName: { marginTop: 3, fontFamily: 'ManropeRegular', fontSize: 10.5, color: '#7D7469' },
    bookingIdChip: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, backgroundColor: '#F5F1E9' },
    bookingIdText: { fontFamily: 'ManropeBold', fontSize: 9, color: '#756A5C' },
    dateCard: {
        marginTop: 12,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#FFFCF5',
        borderWidth: 1,
        borderColor: '#EADFBF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FFF1C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },
    dateRange: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    dateBlock: { flex: 1 },
    endDateBlock: { alignItems: 'flex-end' },
    dateLabel: { fontFamily: 'ManropeBold', fontSize: 9, letterSpacing: 0.6, color: '#9A7B31' },
    dateValue: { marginTop: 3, fontFamily: 'ManropeBold', fontSize: 13, color: '#332D22' },
    sectionTitle: { marginTop: 22, marginBottom: 10, fontFamily: 'ManropeBold', fontSize: 16, color: '#2C2821' },
    paymentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#ECE5DA', overflow: 'hidden' },
    paymentRow: { minHeight: 59, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    paymentRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0ECE5' },
    paymentLabelWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
    paymentIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF8E8', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    paymentLabel: { flex: 1, fontFamily: 'ManropeRegular', fontSize: 12.5, color: '#665F56' },
    paymentValue: { fontFamily: 'ManropeBold', fontSize: 13.5, color: '#2D2923' },
    payNowValue: { color: '#986704', fontSize: 15 },
    payNowCard: { marginTop: 12, paddingHorizontal: 15, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E6C76D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    payNowLabel: { fontFamily: 'ManropeBold', fontSize: 10, letterSpacing: 0.7, color: '#7A5200' },
    payNowHint: { marginTop: 2, fontFamily: 'ManropeRegular', fontSize: 10, color: '#927A45' },
    payNowAmount: { fontFamily: 'ManropeBold', fontSize: 21, color: '#805701' },
    noteBox: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF9EA',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFE1B7',
    },
    noteIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: '#FFF0C3', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
    noteText: {
        flex: 1,
        fontSize: 11,
        color: '#6D5A2C',
        fontFamily: 'ManropeRegular',
        lineHeight: 17,
    },
    secureStrip: { marginTop: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    secureStripText: { marginLeft: 6, fontFamily: 'ManropeRegular', fontSize: 10.5, color: '#52715D' },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 11,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E4DED4',
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
    },
    checkRowSelected: { borderColor: '#D7B34D', backgroundColor: '#FFFCF3' },
    checkbox: {
        width: 21,
        height: 21,
        borderWidth: 1.5,
        borderColor: '#A99E8E',
        marginRight: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    checkboxChecked: { backgroundColor: '#A87205', borderColor: '#A87205' },
    checkText: {
        flex: 1,
        fontSize: 11.5,
        lineHeight: 17,
        color: '#655D53',
        fontFamily: 'ManropeRegular',
    },
    checkStrong: { fontFamily: 'ManropeBold', color: '#8A4B2A' },
    footer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EAE4DA',
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 12,
        elevation: 12,
        shadowColor: '#392B10',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    payButton: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    payButtonDisabled: { opacity: 0.72 },
    payButtonGradient: { minHeight: 50, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
    payText: {
        marginHorizontal: 9,
        fontSize: 14,
        color: '#fff',
        fontFamily: 'ManropeBold',
    },
});

export default BookingReview;
