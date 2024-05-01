import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, Modal, Button, TouchableOpacity } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL from "../../apiconfig";
import { verticalScale, moderateScale, horizontalScale } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewEvents = ({ route,navigation }) => {
  const { width } = Dimensions.get('window');
  const [eventsDetails, setEventsDetails] = useState([])
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [noOfDays, setNoOfDays] = useState();
  const [bookingData,setBookingData] = useState([]);

  const { categoryId } = route.params;
  console.log("CATEID I::::::", categoryId)
  const editsData = [
    { image: require('../../assets/chair.png'), name: '300 Seating', status: 'Available' },
    { image: require('../../assets/foodAvailable.png'), name: 'Food', status: 'Available' },
    { image: require('../../assets/rooms.png'), name: 'Rooms', status: 'Available' },
    { image: require('../../assets/foodAvailable.png'), name: 'Area Available', status: 'Available' },
    { image: require('../../assets/acAvailable.jpeg'), name: 'No A/C', status: 'Available' },
    { image: require('../../assets/foodAvailable.png'), name: 'Food', status: 'Available' },

]

  useEffect(() => {
    getEventsDetails();
  }, []);

  const getEventsDetails = async () => {
    console.log("IAM CALLING API")
    try {
      const response = await axios.get(`${BASE_URL}/getEvent/${categoryId}`);
      console.log("events view details ::::::::::", response?.data?.data);
      setEventsDetails(response?.data?.data)
    } catch (error) {
      console.log("categories::::::::::", error);

    }
  }

  const createFunctionHallBooking = async (eventId) => {

    const bookingData = {
      eventId: eventId,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      totalAmount: noOfDays ? formatAmount(eventsDetails?.price * noOfDays) : formatAmount(eventsDetails?.price),
      numOfDays:noOfDays
    };
 
    console.log('params data is::>>',bookingData);
     
    try {
        const response = await axios.post(`${BASE_URL}/create-event-booking`,bookingData,{
          headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        console.log("event booking resp ::::::::::", response?.data?.data);

        setBookingData(response?.data?.data);
        if(response?.data?.status == 200){
          navigation.navigate('BookingOverView',{categoryId:categoryId})
        }
    } catch (error) {
        console.log("event bookings api error::::::::::", error);
    }
}

  function formatAmount(amount) {
    const amountStr = `${amount}`;
    const [integerPart, decimalPart] = amountStr.split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    return `₹${formattedAmount}`;
}


  const renderCalendar = () => {
    return (
      <Modal visible={isCalendarVisible} animationType="slide">
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedStartDate]: { startingDay: true, color: 'green', textColor: 'white' },
              [selectedEndDate]: { endingDay: true, color: 'green', textColor: 'white' },
            }}
          />
          <Button title="Close Calendar" onPress={() => setCalendarVisible(false)} />
        </View>
      </Modal>
    );
  };

  const formattedDates = (date) => {
    const formattedDate = moment(date).format("DD MMM YYYY");
    return formattedDate;
  }

  const onDayPress = (day) => {
    console.log('day is::>>', day)
    let startedDate;
    if (!selectedStartDate || selectedEndDate) {
      startedDate = day?.dateString;
      const formattedDate = formattedDates(day?.dateString);
      setSelectedStartDate(day?.dateString);
      setSelectedEndDate('');
    } else if (day.dateString < selectedStartDate) {
      startedDate = day?.dateString;
      const formattedDate = formattedDates(day?.dateString);
      setSelectedStartDate(day?.dateString);
    } else {
      const formattedDate = formattedDates(day?.dateString);
      setSelectedEndDate(formattedDate);
      const endedDate = day?.dateString;
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(endedDate);
      console.log(selectedStartDate, endedDate, 'started and ednded dates::>>>')
      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      setNoOfDays(diffInDays);
      const formattedStartDate = formattedDates(selectedStartDate);
      setSelectedStartDate(formattedStartDate);
      console.log('Number of days:', diffInDays);
    }
  };

  console.log("selected dates:::::::::", selectedStartDate, selectedEndDate)

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ backgroundColor: "white",marginBottom: 30 }}>
        <View style={styles.container}>
          <SwiperFlatList
            index={0}
            paginationDefaultColor='white'
            paginationActiveColor='white'
            showPagination={true}
            paginationStyle={{ bottom: 5 }}
            paginationStyleItem={{ alignSelf: 'center' }}
            paginationStyleItemInactive={{ width: 7, height: 7 }}
            paginationStyleItemActive={{ width: 10, height: 10 }}
            data={eventsDetails?.subImages}
            style={{ flex: 1, alignSelf: "center", marginTop: 10 }}
            renderItem={({ item }) => (
              <View style={[{ width: Dimensions.get('window').width, justifyContent: 'center', height: 300 }]}>
                <Image source={{ uri: item }} style={styles.image}
                  resizeMethod="auto"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>
        <View style={{ flex: 1, marginTop: 30, marginHorizontal: 20 }}>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "black", fontWeight: "600" }}>{eventsDetails?.name}</Text>
            <Text style={{ fontSize: 16, color: "#6e6d6d", marginLeft: 5 }}>{eventsDetails?.title}</Text>

          </View>

          <View style={styles.priceContainer}>
            <Text style={{
              fontSize: 12,
              color: "black",
              fontWeight: "400"
            }}>MRP</Text>
            <Text style={{ color: "black", fontSize: 12, fontWeight: "700" }}> {formatAmount(eventsDetails?.price)}</Text>
            <Text style={styles.strickedoffer}>₹1800</Text>
            <Text style={styles.off}> (20% off) </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.title}>Description :</Text>
            <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400", marginTop: 10, marginBottom: 10 }}>{eventsDetails?.description}</Text>
          </View>

          <View style={{ marginTop: 10, flexDirection:"row" }}>
            <Icon name="map-marker" size={20} color="black" />
            <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400",marginLeft:5 }}>Madhapur, Hyderabad</Text>
          </View>


          <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", backgroundColor: "#e6fcfc", borderRadius: 10, justifyContent: "space-between" }}>
            <Image source={require('../../assets/offerIcon.png')}
              style={{ height: 50, width: 50, }}
            />
            <Text style={{ marginRight: 10 }}>5% Discount on First Booking</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={[styles.title,{fontWeight:"700"}]}>Venue Facilities :</Text>
            <ScrollView horizontal>
          {editsData.map((item, index) => (
                            <View key={index} style={{width:100, margin:5,alignItems:"center",paddingVertical:10}} >
                                <Image source={item.image} style={{width:40, height:40, borderRadius:20, marginTop:10}} />
                                
                                 <Text >{item?.name}</Text>
                            </View>
                        ))}
                        </ScrollView>
            {/* <View style={{flexDirection:"row", alignItems:"center",marginTop:10,}}>
              <Image source={require('../../assets/chair.png')} style={{width:25, height:25,}}/>
            <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400",marginLeft:10 }}>300 Seating</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center",marginTop:10}}>
              <Image source={require('../../assets/foodAvailable.png')} style={{width:25, height:25}}/>
              <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400",marginLeft:10 }}>Food</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center",marginTop:10}}>
              <Image source={require('../../assets/rooms.png')} style={{width:20, height:20}}/>
              <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400",marginLeft:10 }}>4 Rooms</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center",marginTop:10}}>
              <Image source={require('../../assets/chair.png')} style={{width:20, height:20}}/>
              <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400",marginLeft:10 }}>Area : 1000 sq.yrds</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center",marginTop:10}}>
              <Image source={require('../../assets/chair.png')} style={{width:20, height:20}}/>
              <Text style={{fontFamily:"roboto", fontSize: 14, color: "#5a5c5a", fontWeight: "400", marginLeft:10 }}>No A/C</Text>
            </View> */}

          </View>

          {renderCalendar()}
          <View style={{flexDirection:"row", alignItems:"center",marginTop:30}}>
            <Text style={{fontSize:14, fontWeight:"600", color:"black", }}>Book The Day</Text>
          </View>

          <View style={{ marginTop: 15, flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity style={{}} onPress={() => setCalendarVisible(true)}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
            <Icon name="calendar" size={15} color="green" />
              <Text style={[styles.title,{marginLeft:5}]}>From Date:</Text>
              </View>
              <Text style={[styles.title,{marginTop:2}]}>{selectedStartDate}</Text>

            </TouchableOpacity>
            <TouchableOpacity  onPress={() => setCalendarVisible(true)}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
            <Icon name="calendar" size={15} color="green" />
              <Text style={[styles.title,{marginLeft:5}]}>To  Date:</Text>   
             </View>
               <Text sstyle={[styles.title,{marginTop:2,color:"black"}]}>{selectedEndDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:10 }}>
          
              <Text style={[styles.title, { marginTop: 10 }]}>Total Days :</Text>
              <Text style={[styles.title, { marginTop: 10, fontWeight:"bold" }]}>{noOfDays > 1 ? `${noOfDays} days` : '1 day'}</Text> 
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop:10 }}>
          
          <Text style={[styles.title, { marginTop: 10 }]}>Total Price :</Text>
          <Text style={[styles.title, { marginTop: 10,fontWeight:"bold"  }]}>{noOfDays ? formatAmount(eventsDetails?.price * noOfDays) : formatAmount(eventsDetails?.price)}</Text>
          </View>
        

        
          


        </View>


      </ScrollView>
      <Text style={{ padding:10,color:'black',fontWeight:'600' }}>Total for {noOfDays} days</Text>
      <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 8, padding: 10, borderColor: 'green', borderWidth: 2, width: '45%' }}
        onPress={() => navigation.navigate('BookingOverView',{categoryId:categoryId})}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View>
              <Text style={[styles.strickedoffer, { fontWeight: '500', color: 'grey' }]}>₹1800</Text>
              <Text style={{ color: 'grey', fontWeight: '900', fontSize: 16 }}>{noOfDays ? formatAmount(eventsDetails?.price * noOfDays) : formatAmount(eventsDetails?.price)}</Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <Text style={{ color: 'green', textAlign: 'right', fontWeight: '800', }} numberOfLines={2}>Book</Text>
              <Text style={{ color: 'green', textAlign: 'right', fontWeight: '800', }} numberOfLines={2}>Now</Text>
            </View>
          </View>

        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'green', borderRadius: 8, padding: 10, borderColor: 'white', borderWidth: 2, width: '45%' }}
        onPress={() => createFunctionHallBooking(categoryId)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View>
              <Text style={[styles.strickedoffer, { color: 'white', fontWeight: '500' }]}>₹1800</Text>
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>{noOfDays ? formatAmount(eventsDetails?.price * noOfDays) : formatAmount(eventsDetails?.price)}</Text>
            </View>
            <View>
              <Text style={{ color: 'white', textAlign: 'right', fontWeight: '800' }} numberOfLines={2}>Book</Text>
              <Text style={{ color: 'white', textAlign: 'right', fontWeight: '800' }} numberOfLines={2}>Advance</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  )
};


const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center', backgroundColor: "yellow",
    height: 200, // Adjust the height as needed
  },
  container: { flex: 1, backgroundColor: 'white' },
  text: { fontSize: 12, textAlign: 'center' },
  title: { fontSize: 14, color: "black", fontWeight: "400",},
  subTitle: { fontSize: 14, color: "#5a5c5a", fontWeight: "400", },
  status: {
    fontSize: 10,
    color: 'gray',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(2),
    marginTop: 10
  },
  off: {
    fontSize: 13,
    color: "#ed890e",
    fontWeight: "bold"
  },
  strickedoffer: {
    fontSize: 12,
    color: "black",
    fontWeight: "400",
    marginLeft: 7,
    textDecorationLine: 'line-through'
  },
  card: {
    margin: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  listcard: {
    marginTop: 10,
    width: "90%",
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center"
  },
  image: {
    width: '100%',
    height: "95%",
    resizeMode: 'cover',
  },
});

export default ViewEvents;