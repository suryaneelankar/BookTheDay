import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import BookDatesButton from "../../components/GradientButton";
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-swiper";
import moment from "moment";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import EditButton from '../../assets/svgs/categories/editButton.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import { formatAmount } from "../../utils/GlobalFunctions";
import ServiceTime from '../../assets/svgs/serviceTime.svg';


const CateringsOverView = ({ route, navigation }) => {

    const { categoryId, timeSlot, bookingDate, totalPrice, cateringItems } = route.params;
    const [bookingDetails, setBookingDetails] = useState([]);
    const [bookingDone, setBookingDone] = useState(false);
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);

    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const userLocationFetched = useSelector((state) => state.userLocation);
    const userLoggedInName = useSelector((state) => state.userLoggedInName);

    useEffect(() => {
        getEventsDetails();
    }, []);
    console.log("received item::::::::", cateringItems)

    const getEventsDetails = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getCateringDetailsById/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(" caterings over view ::::::::::", JSON.stringify(response?.data));
            setBookingDetails(response?.data)
        } catch (error) {
            console.log("caterings error::::::::::", error);
        }
    };

    const ConfirmBooking = async () => {
        const token = await getUserAuthToken();
        const transformedData = cateringItems.map(item => ({
            subMenuId: item?._id,
            numOfPlatesOrdered: item?.totalPrice / item?.perPlateCost,
        }));
        const payload = {
            productId: categoryId,
            startDate: bookingDate,
            endDate: bookingDate,
            numOfDays: 1,
            totalAmount: totalPrice.replace(/[^\d]/g, ''),
            bookingMenuIds: transformedData,
            userMobileNumber: userLoggedInMobileNum,
            bookingTime: timeSlot,
            userDeliveryLocation: userLocationFetched?.display_name ? userLocationFetched?.display_name : userLocationFetched?.address,
            advacnceAmountToPay : bookingDetails?.advanceAmount,
            userFullName : userLoggedInName,
            userDeliveryLocationLatitude : userLocationFetched?.lat ? userLocationFetched?.lat : userLocationFetched?.latitude,
            userDeliveryLocationlongitude : userLocationFetched?.lon ? userLocationFetched?.lon : userLocationFetched?.longitude
            
        }
        console.log("payload is:::::::", payload);
        try {
            const bookingResponse = await axios.post(`${BASE_URL}/create-food-catering-booking`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("booking res:::::::::", bookingResponse);
            if (bookingResponse?.status === 201) {
                setThankYouCardVisible(true);

            }
        } catch (error) {
            console.error("Error during food catering booking:", error);
        }
    }


    console.log("addeiets:::::", cateringItems)
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: "#202020" }]}>Shipping Address</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text numberOfLines={2} style={styles.address}>{userLocationFetched?.display_name ? userLocationFetched?.display_name : userLocationFetched?.address}</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('LocationAdded') }}>
                        <EditButton />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={{ marginBottom: "20%" }}>

                {/* <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, marginTop: 20, width: '90%' }}>Upcoming Booking, {bookingDetails?.name}</Text> */}
                {bookingDone ?
                    <View style={{ backgroundColor: '#fdf5e6', borderRadius: 15, padding: 10, marginTop: 20, width: '90%',alignSelf:"center" }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="exclamationcircleo" size={18} color="grey" />
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginHorizontal: 10 }}>Confirmation Pending</Text>
                        </View>
                        <Text style={{ color: 'black', fontWeight: '400', fontSize: 13, marginTop: 15 }}>We're waiting for {bookingDetails?.title} to confirm your booking request.</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <IonIcon name="time-sharp" size={18} color="green" />
                            <Text style={{ color: 'green', fontWeight: '800', fontSize: 13, marginTop: 10, marginHorizontal: 10 }}>We'll get back with in 2 hrs with booking confirmation status.</Text>
                        </View>
                    </View> : null}

                <View style={styles.imgsection}>
                    <View style={styles.productContainer}>
                        <FastImage source={{ uri: bookingDetails?.professionalImage?.url.replace('localhost', LocalHostUrl) }}
                            style={styles.productImage}
                            resizeMethod="resize"
                            resizeMode="cover"
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productTitle}>{bookingDetails?.foodCateringName}</Text>
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


                            </View>
                        </View>
                    </View>

                    <Text style={{ color: '#000000', fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular', marginVertical: 15 }}>Package selected</Text>
                    <FlatList
                        data={cateringItems}
                        keyExtractor={item => item?._id}
                        renderItem={({ item, index }) => {
                            const numOfPlates = item?.totalPrice / item?.perPlateCost;
                            const itemPairs = [];
                            for (let i = 0; i < item?.items?.length; i += 2) {
                                itemPairs.push(item?.items?.slice(i, i + 2));
                            }
                            return (
                                <View style={{ paddingHorizontal: 10, justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: "row", marginVertical: 5 }}>
                                        <Text style={styles.comboText} >{item.title}</Text>
                                        <Text style={styles.comboText} >{numOfPlates} Plates</Text>
                                    </View>
                                    <View>
                                        {itemPairs.map((pair, index) => (
                                            <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                                                {/* First Column Item */}
                                                <Text style={{ flex: 1, color: "gray" }}>• {pair[0]}</Text>
                                                {/* Second Column Item (if available) */}
                                                {pair[1] && <Text style={{ flex: 1, color: "gray" }}>• {pair[1]}</Text>}
                                            </View>
                                        ))}
                                    </View>
                                    {index < itemPairs?.length - 1 && (
                                        <View
                                            style={{
                                                borderBottomWidth: 1,
                                                borderColor: 'lightgray',
                                                borderStyle: 'dotted',
                                            }}
                                        />
                                    )}
                                </View>
                            );
                        }}
                    />

                    <Text style={{ marginTop: 20, color: 'black', fontSize: 18, fontWeight: "700", fontFamily: 'ManropeRegular', marginVertical: 15 }}>Price Details</Text>
                    <FlatList
                        data={cateringItems}
                        keyExtractor={item => item?._id}
                        renderItem={({ item }) => {
                            const numOfPlates = item?.totalPrice / item?.perPlateCost;

                            // Split the items array into pairs for two-column layout
                            const itemPairs = [];
                            for (let i = 0; i < item?.items?.length; i += 2) {
                                itemPairs.push(item?.items?.slice(i, i + 2));
                            }

                            return (
                                <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                                    {/* Title and Number of Plates */}
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                                        <Text style={styles.comboPriceText}>{item?.title}</Text>
                                    </View>

                                    {/* Combo Summary UI */}
                                    <View style={{ paddingVertical: 5 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                            <Text style={styles.comboPriceMainText}>Per Plate Cost:</Text>
                                            <Text style={styles.comboPriceSubText}>{item.perPlateCost}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                            <Text style={styles.comboPriceMainText}>Number of Plates:</Text>
                                            <Text style={styles.comboPriceSubText}>{numOfPlates}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                                            <Text style={styles.comboPriceMainText}>Total Price:</Text>
                                            <Text style={styles.comboPriceSubText}>{item.totalPrice}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }}
                    />
                    {/* <View style={{ backgroundColor: '#FD813B', width: '100%', height: 1, alignSelf: 'center', marginVertical: 10 }} /> */}

                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ marginTop: 20, color: 'black', fontSize: 18, fontWeight: "500", fontFamily: 'ManropeRegular', marginVertical: 15 }}>Total Amount</Text>
                            <Text style={{ marginTop: 20, color: 'black', fontSize: 18, fontWeight: "700", fontFamily: 'ManropeRegular', marginVertical: 15 }}>{totalPrice}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: "500", fontFamily: 'ManropeRegular', }}>Advacnce Amount</Text>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: "700", fontFamily: 'ManropeRegular', }}>{bookingDetails?.advanceAmount}</Text>
                        </View>
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
                        {/* <View style={{borderWidth:4, width:"50%", }}/> */}
                    </LinearGradient>

                    <View style={styles.iconContainer}>
                        <View style={styles.iconBackground}>
                            {/* <Image source={{ uri: 'thumbs_up_icon_url' }} style={styles.icon} /> */}

                        </View>
                    </View>
                    <Text style={styles.title}>Thank You!</Text>
                    <Text style={styles.subtitle}>Your Booking Initiated.</Text>
                    <Text style={styles.description}>Our team will update to you in less than 2 hours</Text>
                    <LinearGradient colors={['#D2453B', '#A0153E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.doneButton}>
                        <TouchableOpacity onPress={() => [setThankYouCardVisible(false), setBookingDone(true)]}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

            </Modal>

            <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
                {!bookingDone ?
                    <BookDatesButton
                        onPress={() => [ConfirmBooking()]}
                        text={'Confirm Booking'}
                        padding={10}
                    /> : null}
            </View>
        </View>
    )
}

export default CateringsOverView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    item: {
        backgroundColor: '#f9f9f9',

    },
    imgsection: {
        backgroundColor: 'white',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 10,
        elevation: 15
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: "#FD813B",
        fontFamily: "ManropeRegular",
    },
    address: {
        fontSize: 14,
        fontWeight: "400",
        color: '#000000',
        fontFamily: "ManropeRegular",
        width: "80%"
    },
    section: {
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 8,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 10
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').height / 6,
        borderRadius: 8,
        marginRight: 16,
    },
    productDetails: {
        flex: 1,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: "#100D25",
        fontFamily: "ManropeRegular",
    },
    productSubTitle: {
        fontSize: 14,
        color: '#000000',
        fontFamily: "ManropeRegular",
        fontWeight: "500",
        marginHorizontal: 10
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
        color: '#FE8235',
        fontWeight: "600",
        fontFamily: "ManropeRegular",

    },
    productPriceperDay: {
        fontSize: 12,
        fontWeight: '400',
        color: '#202020',
        fontFamily: "ManropeRegular",

    },
    itemText: {
        fontSize: 16
    },
    comboText: {
        width: "80%", fontSize: 14,
        fontWeight: '700',
        color: "#FD813B",
        fontFamily: "ManropeRegular",
    },
    comboPriceText: {
        width: "80%",
        fontSize: 14,
        fontWeight: '700',
        color: "#FD813B",
        fontFamily: "ManropeRegular",
    },
    comboPriceMainText: {
        fontSize: 14,
        fontWeight: '600',
        color: "#000000",
        fontFamily: "ManropeRegular",
    },
    comboPriceSubText: {
        fontSize: 14,
        fontWeight: '600',
        color: "#000000",
        fontFamily: "ManropeRegular",
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomColor: "#D6D6D6",
        borderBottomWidth: 1
        // padding: 16,
        // borderRadius: 8,
        // backgroundColor: '#f9f9f9',
        // elevation: 1,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10
    },
    itemName: {
        fontSize: 16,
        fontWeight: '400',
        color: "#000000",
        fontFamily: 'ManropeRegular',

    },
    itemPrice: {
        fontSize: 13,
        color: '#000000',
        fontFamily: 'ManropeRegular',
        fontWeight: "700",
        marginTop: 5
    },
    itemDescription: {
        fontSize: 10,
        color: '#8B8B8B',
        fontWeight: "400",
        fontFamily: 'ManropeRegular',
        marginTop: 5,
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
    trackProgressText: {
        color: '#FF730D',
        textDecorationLine: 'underline',
        fontWeight: "400",
        fontFamily: "ManropeRegular",
        fontSize: 12,
        marginBottom: 30
    },
});

