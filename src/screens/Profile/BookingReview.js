import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
    } = selectedBooking;

    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const userLoggedInName = useSelector((state) => state.userLoggedInName);

    // Token amount fixed to ₹10,000 or full advance if less
    // const fixedTokenAmount = Math.min(10000, advanceAmountToPay || securityDepositAmount || 0);

    let fixedTokenAmount = 0;

    if (securityDepositAmount) {
        fixedTokenAmount = securityDepositAmount;
    } else {
        if (totalAmount > 900000) {
            fixedTokenAmount = 30000;
        } else if (totalAmount > 600000) {
            fixedTokenAmount = 20000;
        } else if (totalAmount > 300000) {
            fixedTokenAmount = 15000;
        } else {
            fixedTokenAmount = 10000;
        }
    }     

    const remainingAdvance = (advanceAmountToPay || securityDepositAmount || 0) - fixedTokenAmount;
    const remainingAmount = totalAmount - (advanceAmountToPay || securityDepositAmount || 0);

    const formatAmount = (amount) =>
        `₹${amount?.toLocaleString('en-IN') || 0}`;

    const handleProceed = () => {
        if (!isChecked) return;
        handlePayment(fixedTokenAmount, bookingId, catType, vendorMobileNumber, catType === 'caterings' ? foodCateringName : catType === 'functionHalls' ? functionHallName : productName, totalAmount)
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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 140 }} style={styles.container}>
                <View style={styles.card}>


                    {/* Vendor / Product Name */}
                    <View style={styles.row}>
                        <Icon name="location-on" size={20} color={"#6B7280"} />
                        <Text style={styles.label}>Venue / Service:</Text>
                    </View>
                    <Text style={styles.value}>{productName || 'Selected Vendor'}</Text>

                    <View style={styles.divider} />

                    {/* Booking Dates */}
                    {catType === 'clothJewels' ? (
                        <>
                            <View style={styles.row}>
                                <Icon name="event" size={20} color={"#6B7280"} />
                                <Text style={styles.label}>Start Date:</Text>
                            </View>
                            <Text style={styles.value}>{startDate || '-'}</Text>

                            <View style={styles.row}>
                                <Icon name="event-available" size={20} color={"#6B7280"} />
                                <Text style={styles.label}>End Date:</Text>
                            </View>
                            <Text style={styles.value}>{endDate || '-'}</Text>
                        </>
                    ) : (
                        <>
                            <View style={styles.row}>
                                <Icon name="event" size={20} color={"#6B7280"} />
                                <Text style={styles.label}>Booking Date:</Text>
                            </View>
                            <Text style={styles.value}>{startDate || '-'}</Text>
                        </>
                    )}

                    <View style={styles.divider} />

                    {/* Token Amount */}
                    <View style={styles.row}>
                        <Icon name="verified-user" size={20} color="#6B7280" />
                        <Text style={styles.label}>Token Amount (to pay now):</Text>
                    </View>
                    <Text style={[styles.value, { color: '#2E7D32' }]}>{formatAmount(fixedTokenAmount)}</Text>

                    {/* Remaining Advance (if any) */}
                    {remainingAdvance > 0 && (
                        <>
                            <View style={styles.row}>
                                <Icon name="hourglass-bottom" size={20} color="#6B7280" />
                                <Text style={styles.label}>Remaining Advance to Pay(Offline):</Text>
                            </View>
                            <Text style={[styles.value, { color: '#F57C00' }]}>{formatAmount(remainingAdvance)}</Text>
                        </>
                    )}

                    <View style={styles.divider} />

                    {/* Remaining at Venue */}
                    <View style={styles.row}>
                        <Icon name="payments" size={20} color="#6B7280" />
                        <Text style={styles.label}>Balance Payable at Venue:</Text>
                    </View>
                    <Text style={[styles.value, { color: '#C62828' }]}>{formatAmount(remainingAmount)}</Text>

                    <View style={styles.divider} />

                    {/* Total Booking Amount */}
                    <View style={styles.row}>
                        <Icon name="currency-rupee" size={20} color={"#6B7280"} />
                        <Text style={styles.label}>Total Booking Amount:</Text>
                    </View>
                    <Text style={styles.value}>{formatAmount(totalAmount)}</Text>

                </View>

                {/* Note */}
                <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                        📝 <Text style={{ fontWeight: 'bold' }}>Note:</Text> Token amount is paid online to block the date. Remaining advance amount must be paid offline at least 7 days before the booking date.
                    </Text>
                </View>

                {/* Non-refundable Check */}
            </ScrollView>

            {/* Sticky Proceed Button */}
            <View style={styles.footer}>

                <TouchableOpacity
                    style={styles.checkRow}
                    onPress={() => setIsChecked(!isChecked)}
                >
                    <View style={[styles.checkbox, { backgroundColor: isChecked ? "#4CAF50" : "#fff" }]}>
                        {isChecked && <Icon name="check" size={16} color="#fff" />}
                    </View>
                    <Text style={styles.checkText}>
                        I understand that the advance amount is <Text style={{ fontWeight: 'bold' }}>non-refundable</Text> in case of cancellation.
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.payButton, { opacity: isChecked ? 1 : 0.5 }]}
                    onPress={handleProceed}
                    disabled={!isChecked}
                >
                    <Text style={styles.payText}>Proceed to Pay {formatAmount(fixedTokenAmount)}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
        fontFamily: 'ManropeBold',
        color: '#222',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    label: {
        marginLeft: 8,
        fontSize: 15,
        color: '#333',
        fontFamily: 'ManropeRegular',
    },
    value: {
        fontSize: 16,
        fontFamily: 'ManropeBold',
        marginLeft: 28,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    noteBox: {
        backgroundColor: '#FFF3E0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    noteText: {
        fontSize: 13,
        color: '#E65100',
        fontFamily: 'ManropeRegular',
        lineHeight: 18,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        // alignItems: 'center',
        // marginVertical: 15,
        backgroundColor: "#fff",
        marginBottom: 16

    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#999',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        marginTop: 4
    },
    checkText: {
        fontSize: 13,
        color: '#C62828',
        alignSelf: "center",
        // marginTop: 8,
        fontFamily: 'ManropeRegular',
        width: "90%"
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // padding: 8,
        // paddingTop: 4,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
        padding: 8,
    },
    payButton: {
        backgroundColor: '#FD813B',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    payText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'ManropeBold',
    },
});

export default BookingReview;
