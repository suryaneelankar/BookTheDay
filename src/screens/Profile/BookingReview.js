import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlert from '../../components/CustomAlert';
import Icon from 'react-native-vector-icons/MaterialIcons';
import themevariable from '../../utils/themevariable';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';

const BookingReview = ({ navigation, route }) => {
    const { selectedBooking } = route.params;
    const [isChecked, setIsChecked] = useState(false);

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

    // Token amount fixed to ₹10,000 or full advance if less
    // const fixedTokenAmount = Math.min(10000, advanceAmountToPay || securityDepositAmount || 0);

    let fixedTokenAmount = 1;

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

    const remainingAdvance = (advanceAmountToPay || securityDepositAmount || 0) - fixedTokenAmount;
    const remainingAmount = totalAmount - (advanceAmountToPay || securityDepositAmount || 0);

    const bookingName = catType === 'caterings'
        ? foodCateringName
        : catType === 'functionHalls'
            ? functionHallName
            : productName;

    const shortBookingId = bookingId
        ? `#${String(bookingId).slice(-8).toUpperCase()}`
        : 'Pending ID';

    const formatAmount = (amount) =>
        `₹${amount?.toLocaleString('en-IN') || 0}`;

    const handleProceed = () => {
        if (!isChecked) return;
        handlePayment(fixedTokenAmount, bookingId, catType, vendorMobileNumber, catType === 'caterings' ? foodCateringName : catType === 'functionHalls' ? functionHallName : productName, totalAmount)
    };


    const fetchRazorpayKey = async (token) => {
        const res = await fetch(`${BASE_URL}/razorpay-key`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('Razorpay key data is booking review ::>>', data);
        return data;
    };

    const handlePayment = async (advanceAmount, bookingId, catType, vendorMobileNumber, productName, totalAmount) => {
        const token = await getUserAuthToken();
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
                    // Fetch the order details from your backend
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
                            navigation.navigate('PaymentSuccess', {
                                productName: catType === 'caterings' ? foodCateringName : catType === 'functionHalls' ? functionHallName : productName,
                                advanceAmount,
                                totalAmount,
                                bookingId,
                                orderId: initiateresponse?.data?.data?.OrderId,
                                paymentId: paymentData?.razorpay_payment_id,
                                catType,
                                hallAddress: hallAddress || '',
                                hallImage: hallImage || '',
                                startDate: startDate || '',
                                endDate: endDate || '',
                                seatingCapacity: seatingCapacity || '',
                            });
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
                            navigation.navigate('PaymentFailed');
                            console.log(error);
                        });
                } catch (error) {
                    console.error(error);
                    CustomAlert.alert('Error', 'Something went wrong', undefined, {type: 'error'});
                }

            }
        } catch (error) {
            console.log("Initiate Payment error>>::", error);
        };
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
                    disabled={!isChecked}
                    activeOpacity={0.88}
                    accessibilityRole="button"
                >
                    <LinearGradient
                        colors={isChecked ? ['#A87205', '#CE951A', '#E4B946'] : ['#D9D2C7', '#C8C0B5']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.payButtonGradient}
                    >
                        <Icon name="lock" size={17} color="#FFFFFF" />
                        <Text style={styles.payText}>Pay {formatAmount(fixedTokenAmount)} securely</Text>
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
