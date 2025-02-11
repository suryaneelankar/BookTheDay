import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import BookDatesButton from "../../components/GradientButton";
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { formatAmount } from "../../utils/GlobalFunctions";
import ServiceTime from '../../assets/svgs/serviceTime.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import MapMarkIcon from '../../assets/svgs/orangeMapMark.svg';
import ThumsUpIcon from '../../assets/svgs/thumsupIcon.svg';

const HallsBookingOverView = ({ route, navigation }) => {

    const { categoryId, timeSlot, bookingDate, totalPrice } = route.params;
    const [bookingDetails, setBookingDetails] = useState([]);
    const [bookingDone, setBookingDone] = useState(false);
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const userLoggedInName = useSelector((state) => state.userLoggedInName);

    useEffect(() => {
        getEventsDetails();
    }, []);

    const getEventsDetails = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getFunctionHallDetailsById/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Halls house over view ::::::::::", JSON.stringify(response?.data));
            setBookingDetails(response?.data)
        } catch (error) {
            console.log("Halls error::::::::::", error);
        }
    }

    const ConfirmBooking = async () => {
        const token = await getUserAuthToken();
        const payload = {
            productId: categoryId,
            startDate: moment(bookingDate, "DD-MM-YYYY").format("DD MMMM YYYY"),
            endDate: moment(bookingDate, "DD-MM-YYYY").format("DD MMMM YYYY"),
            numOfDays: 1,
            totalAmount: totalPrice.replace(/[^\d]/g, ''),
            userMobileNumber: userLoggedInMobileNum,
            bookingTime: timeSlot,
            userFullName: userLoggedInName,
            advanceAmountToPay: bookingDetails?.advanceAmount,
        }
        console.log("payload is:::::::", payload);
        try {
            const bookingResponse = await axios.post(`${BASE_URL}/create-function-hall-booking`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("booking res:::::::::", bookingResponse);
            if (bookingResponse?.status === 201) {
                setThankYouCardVisible(true);

            }
        } catch (error) {
            console.error("Error during function hall booking:", error);
        }
    }



    return (
        <View style={{ flex: 1, backgroundColor: "white", }}>
            {bookingDone ? (
                <View style={styles.bookingContainer}>
                    <View style={styles.rowAlignCenter}>
                        <Icon name="exclamationcircleo" size={18} color="grey" />
                        <Text style={styles.pendingText}>Confirmation Pending</Text>
                    </View>
                    <Text style={styles.waitingText}>
                        We're waiting for {bookingDetails?.title} to confirm your booking request.
                    </Text>
                    <View style={styles.rowAlignCenter}>
                        <IonIcon name="time-sharp" size={18} color="green" />
                        <Text style={styles.timeText}>
                            We'll get back within an Hour with booking confirmation status.
                        </Text>
                    </View>
                </View>
            ) : null}
            <ScrollView style={{}}>

                <View style={styles.productContainer}>
                    <FastImage source={{ uri: bookingDetails?.professionalImage?.url.replace('localhost', LocalHostUrl) }}
                        style={styles.productImage}
                        resizeMethod="resize"
                        resizeMode="cover"
                    />
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.productTitle}>{bookingDetails?.functionHallName}</Text>
                        <Text style={styles.productPrice}><Text style={styles.productPriceperDay}>Advance Amount  </Text>{formatAmount(bookingDetails?.advanceAmount)}</Text>
                        <View >
                            <View style={styles.dateContainer}>
                                <CalendarIcon />
                                <Text style={styles.dateText}>{bookingDate}</Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <ServiceTime />
                                <Text style={styles.dateText}>{timeSlot}</Text>
                            </View>
                            <View style={styles.addressContainer}>
                                <MapMarkIcon />
                                <Text style={styles.addressText}>{bookingDetails?.functionHallAddress?.address}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.detailsContainer}>
                    <View style={styles.rowSpaceBetween}>
                        <Text style={[styles.detailsText, styles.detailsTitle]}>Total Amount</Text>
                        <Text style={[ styles.detailsAmount]}>{totalPrice}</Text>
                    </View>
                    <View style={styles.rowSpaceBetween}>
                        <Text style={styles.detailsText}>Advance Amount</Text>
                        <Text style={styles.detailsAmount}>{formatAmount(bookingDetails?.advanceAmount)}</Text>
                    </View>
                </View>
            </ScrollView>
            <Modal
                isVisible={thankyouCardVisible}
                onBackdropPress={() => setThankYouCardVisible(false)}
                backdropOpacity={0.9}
                backdropColor={themevariable.Color_000000}
                hideModalContentWhileAnimating={true}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                animationInTiming={500}
                style={{
                    flex: 1,
                    // bottom: "10%"
                }}
                onBackButtonPress={() => {
                    setThankYouCardVisible(false)
                }}
                animationOut={'slideOutDown'}
                animationType={'slideInUp'}
            >
                <View style={styles.Thankcontainer}>
                    <LinearGradient colors={['#D2453B', '#A0153E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: "55%", padding: 4, }}>
                    </LinearGradient>
                    <View style={{ height: 120 }}>
                        <ThumsUpIcon />
                    </View>
                    <Text style={styles.title}>Thank You!</Text>
                    <Text style={styles.subtitle}>Your Booking Has Been Initiated</Text>
                    <Text style={styles.description}>Our team is processing your request and will update you within an hour.</Text>
                    {/* <Text style={styles.description}>*Once your booking is approved, please complete the payment to confirm your reservation.</Text> */}
                    <LinearGradient colors={['#D2453B', '#A0153E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.doneButton}>
                        <TouchableOpacity onPress={() => [setThankYouCardVisible(false), setBookingDone(true), navigation.navigate('Home')]}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

            </Modal>

            <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
                {!bookingDone ?
                    <BookDatesButton
                        onPress={() => ConfirmBooking()}
                        text={'Confirm Booking'}
                        padding={10}
                    /> : null}
            </View>
        </View>
    )
}

export default HallsBookingOverView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    item: {
        backgroundColor: '#f9f9f9',

    },
    Thankcontainer: {
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: 'white',
        // paddingVertical: 50,
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    productContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        marginHorizontal: 20,
    },
    productImage: {
        // width: Dimensions.get('window').width/1.5,
        height: Dimensions.get('window').height / 4,
        borderRadius: 8,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: "#100D25",
        fontFamily: "ManropeRegular",
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#202020',
        fontFamily: "ManropeRegular",
    },
    dateText: {
        marginLeft: 10,
        fontSize: 13,
        color: '#333333',
        fontWeight: "600",
        fontFamily: "ManropeRegular",

    },
    addressText: {
        marginLeft: 10,
        fontSize: 13,
        color: '#333333',
        fontWeight: "600",
        fontFamily: "ManropeRegular",
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    addressContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    productPriceperDay: {
        fontSize: 12,
        fontWeight: '400',
        color: '#202020',
        fontFamily: "ManropeRegular",

    },
    iconContainer: {
        margin: 20
    },
    iconBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 27,
        fontWeight: '800',
        marginBottom: 10,
        color: "#333333",
        fontFamily: "ManropeRegular",
        marginTop: 20
    },
    subtitle: {
        fontSize: 14,
        color: '#FF730D',
        fontWeight: "500",
        fontFamily: "ManropeRegular",
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        color: '#677294',
        marginBottom: 20,
        fontWeight: "500",
        fontFamily: "ManropeRegular",
        marginHorizontal: 20
    },
    doneButton: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    doneButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    separator: {
        backgroundColor: '#dcdcdc',
        width: '90%',
        height: 2,
        alignSelf: 'center',
        marginVertical: 10,
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        paddingHorizontal: 20,
    },
    rowSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    detailsText: {
        color: 'black',
        fontSize: 18,
        fontWeight: "500",
        fontFamily: 'ManropeRegular',
    },
    detailsTitle: {
        // marginTop: 20,
        marginVertical: 15,
    },
    detailsAmount: {
        fontWeight: "700",
        color: 'black',
        fontSize: 14,
        fontFamily: 'ManropeRegular',
    },
    bookingContainer: {
        backgroundColor: '#fdf5e6',
        borderRadius: 15,
        padding: 10,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
        marginVertical: 20,
    },
    rowAlignCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pendingText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
    },
    waitingText: {
        color: 'black',
        fontWeight: '400',
        fontSize: 13,
        marginTop: 15,
    },
    timeText: {
        color: 'green',
        fontWeight: '800',
        fontSize: 13,
        marginTop: 10,
        marginHorizontal: 10,
    },

});

