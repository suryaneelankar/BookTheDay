import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
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

const CateringsOverView = ({ route, navigation }) => {

    const { categoryId, timeSlot, bookingDate, totalPrice, cateringItems } = route.params;
    const [bookingDetails, setBookingDetails] = useState([]);
    const [bookingDone, setBookingDone] = useState(false);
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);

    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);

  console.log("date is::::", bookingDate);
    useEffect(() => {
        getEventsDetails();
    }, []);
    console.log("received item::::::::", cateringItems)

    const getEventsDetails = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getCateringDetailsById/${categoryId}`,{
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
          userMobileNumber: userLoggedInMobileNum
        }
        console.log("payload is:::::::", payload);
        try {
          const bookingResponse = await axios.post(`${BASE_URL}/create-food-catering-booking`, payload,{
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
        <View style={{ flex: 1, alignSelf: 'center', width: '100%', alignItems: 'center' }}>

            {/* <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, marginTop: 20, width: '90%' }}>Upcoming Booking, {bookingDetails?.name}</Text> */}
            {bookingDone ?
                <View style={{ backgroundColor: '#fdf5e6', borderRadius: 15, padding: 10, marginTop: 20, width: '90%' }}>
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

            <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 20, width: '90%', paddingHorizontal: 18, }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: "80%" }}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: "700", fontFamily: 'ManropeRegular', }}>{bookingDetails?.foodCateringName}</Text>
                        <Text style={{ color: 'black', fontSize: 14, fontWeight: "600", fontFamily: 'ManropeRegular', }}>Address : {bookingDetails?.foodCateringAddress?.address}</Text>


                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontWeight: '600', fontSize: 12, fontFamily: 'ManropeRegular', }}>Booking Date : </Text>
                            <Text style={{ fontWeight: '600', fontSize: 13, fontFamily: 'ManropeRegular', }}>{bookingDate}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontWeight: '600', fontSize: 12, fontFamily: 'ManropeRegular', }}>Booking Time : </Text>
                            <Text style={{ fontWeight: '600', fontSize: 13, fontFamily: 'ManropeRegular', }}>{timeSlot}</Text>
                        </View>
                        <Text style={{ color: 'black', fontSize: 12, fontWeight: "500", fontFamily: 'ManropeRegular', }}>Booked for - Rakesh Pandit</Text>
                    </View>
                    <FastImage source={{ uri: bookingDetails?.professionalImage?.url.replace('localhost', LocalHostUrl) }}
                        style={{ width: 70, height: 70, borderRadius: 35 }}
                        resizeMethod="resize"
                        resizeMode="cover"
                    />
                </View>



                <View style={{ backgroundColor: '#dcdcdc', width: '100%', height: 2, alignSelf: 'center', marginTop: 10 }} />

                <Text style={{ color: 'black', fontSize: 14, fontWeight: "600", fontFamily: 'ManropeRegular', }}>Package selected</Text>
                <FlatList
                    data={cateringItems}
                    keyExtractor={item => item?._id}
                    renderItem={({ item }) => {
                        const numOfPlates = item?.totalPrice / item?.perPlateCost;
                        return (
                            <View style={{flexDirection:"row", paddingHorizontal:10, borderWidth:1, borderColor:"lightgray", justifyContent:"space-between"}}>
                                <Text style={{}} >{item.title}</Text>
                                <Text >
                                 {numOfPlates} Plates
                                </Text>
                            </View>
                        );
                    }}
                />

                <Text style={{ marginTop:20,color: 'black', fontSize: 18, fontWeight: "700", fontFamily: 'ManropeRegular', }}>Total Price : {totalPrice}</Text>
                <Text style={{ color: 'black', fontSize: 14, fontWeight: "600", fontFamily: 'ManropeRegular', }}> Advacnce Amount : {bookingDetails?.advanceAmount}</Text>
            </View>

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
    itemText: {
        fontSize: 16
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

