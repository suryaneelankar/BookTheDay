import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import axios from 'axios';

const BookingOverView = ({ route, navigation }) => {

    const { categoryId } = route.params;
    const [eventsDetails, setEventsDetails] = useState([])

    useEffect(() => {
        getEventsDetails();
    }, []);

    const getEventsDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getEvent/${categoryId}`);
            console.log("events view details ::::::::::", response?.data?.data);
            setEventsDetails(response?.data?.data)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }


    return (
        <View style={{flex:1}}>

            <Text>Upcoming Booking, {eventsDetails?.title}</Text>
            <View style={{backgroundColor:'#FFFFE8E6',borderRadius:15,padding:10,width:'90%'}}>
              <Text style={{color:'black',fontWeight:'bold',fontSize:16}}>Confirmation Pending</Text>
              <Text style={{color:'black',fontWeight:'200',fontSize:13,marginTop:15}}>We're waiting for {eventsDetails?.title} to confirm your booking request.</Text>
              <Text style={{color:'black',fontWeight:'200',fontSize:13}}>We'll get back with booking confirmation in 2 hrs</Text>
            </View>

            <View style={{width:'90%',backgroundColor:'white',borderColor:'grey',borderWidth:2}}>
                <Text>Requested Booking Date & Time</Text>
                <Text>5:00 AM, Apr 30, 2024</Text>
                <Text>Surya Neelankar</Text>
                <Text>Booked for - Rakesh Pandit</Text>
                <View style={{backgroundColor:'black'}}>
                    
                </View>
            </View>
        </View>
    )
}

export default BookingOverView;
