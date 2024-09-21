import React, { useEffect, useState } from "react";
import { View, Text, Image } from 'react-native';
import axios from 'axios';
import BASE_URL from "../../apiconfig";
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon  from 'react-native-vector-icons/Ionicons';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";

const BookingConfirm = ({ route, navigation }) => {

    const [eventsDetails, setEventsDetails] = useState([])

    useEffect(() => {
        getBookingDetails();
    }, []);

    const getBookingDetails = async () => {
        const token = await getUserAuthToken();
        const bookingIdData = {
            "bookingId":"BOOK-1714477859168-7696",
            "eventId":"661d6a6ba8da8199cf381c2a"
        }
        try {
            const response = await axios.get(`${BASE_URL}/get-event-by-bookingid`,bookingIdData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            // console.log("events over view ::::::::::", response?.data?.data);
            setEventsDetails(response?.data?.data)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }


    return (
        <View style={{ flex: 1, alignSelf: 'center', width: '100%', alignItems: 'center' }}>

            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, marginTop: 20,width: '90%' }}>Upcoming Booking, {eventsDetails?.name}</Text>
            <View style={{ backgroundColor: '#fdf5e6', borderRadius: 15, padding: 10, marginTop: 20, width: '90%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="exclamationcircleo" size={18} color="grey" />
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginHorizontal: 10 }}>Confirmation Pending</Text>
                </View>
                <Text style={{ color: 'black', fontWeight: '400', fontSize: 13, marginTop: 15 }}>We're waiting for {eventsDetails?.title} to confirm your booking request.</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IonIcon name="time-sharp" size={18} color="green" />
                <Text style={{ color: 'green', fontWeight: '800', fontSize: 13, marginTop: 10,marginHorizontal:10 }}>We'll get back with in 2 hrs with booking confirmation status.</Text>
                </View>
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, marginTop: 20, width: '90%', paddingHorizontal: 18, }}>
                <View style={{ flexDirection: 'row',justifyContent:'space-between',alignItems:'center' }}>
                    <View>
                        <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 10 }}>Requested Booking Date</Text>
                        <Text style={{ fontWeight: '600', fontSize: 16 }}>5:00 AM, Apr 30, 2024</Text>
                        <Text style={{ color: 'grey' }}>Surya Neelankar</Text>
                        <Text style={{ color: 'black' }}>Booked for - Rakesh Pandit</Text>
                    </View>
                    <FastImage source={{ uri: eventsDetails?.mainImageUrl }}
                        style={{ width: 70, height: 70,borderRadius:35 }}
                        resizeMethod="resize"
                        resizeMode="cover"
                    />
                </View>


                <View style={{ backgroundColor: '#dcdcdc', width: '100%', height: 2, alignSelf: 'center', marginTop: 10 }} />
                <Text style={{ fontWeight: '600', marginTop: 10, fontSize: 18 }}>{eventsDetails?.title}</Text>
                <Text style={{ fontWeight: '600', marginTop: 10 }}>{eventsDetails?.location}</Text>
            </View>
        </View>
    )
}

export default BookingConfirm;
