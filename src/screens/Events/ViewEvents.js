import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity, FlatList } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import { height, verticalScale, width } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
// import Icon from 'react-native-vector-icons/FontAwesome';
import MapMarkIcon from '../../assets/svgs/orangeMapMark.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import BookDatesButton from "../../components/GradientButton";
import ServiceTime from '../../assets/svgs/serviceTime.svg';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import CustomModal from "../../components/AlertModal";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';



const ViewEvents = ({ route, navigation }) => {

  const [eventsDetails, setEventsDetails] = useState([])
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [noOfDays, setNoOfDays] = useState();
  const [subImages, setSubImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTimeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState();
  const [getUserAuth, setGetUserAuth] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { categoryId } = route.params;
  console.log("CATEID I::::::", categoryId)

  const HallDescription = 'Transform your special occasions into unforgettable memories with our exquisite function hall rentals! Whether you are hosting a grand wedding, a lively birthday bash, or a corporate event, our halls offer the perfect blend of elegance and comfort. With spacious layouts, stunning décor, and top-notch amenities, your guests will be impressed from the moment they arrive. Book with us today and let us help you create an event that exceeds all expectations!'

  const timeSlots = [
    '12:00 AM',
    '01:00 AM',
    '02:00 AM',
    '03:00 AM',
    '04:00 AM',
    '05:00 AM',
    '06:00 AM',
    '07:00 AM',
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeSlotModalVisible(false);
  };


  useEffect(() => {
    getEventsDetails();
  }, []);

  const convertLocalhostUrls = (url) => {
    return url.replace("localhost", LocalHostUrl);
  };

  const getEventsDetails = async () => {
    const token = await getUserAuthToken();
    setGetUserAuth(token);
    try {
      const response = await axios.get(`${BASE_URL}/getFunctionHallDetailsById/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEventsDetails(response?.data);
      const imageUrls = response?.data?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));
      setSubImages(imageUrls);
      console.log("hall amenities", JSON.stringify(response?.data))
      const amenities = response?.data?.hallAmenities[0].split(',').map((item, index) => ({
        id: (index + 1).toString(),
        name: item.trim()
      }));
      setAmenitiesData(amenities);

    } catch (error) {
      console.log("categories::::::::::", error);

    }
  }

  console.log("Amenities::::::", amenitiesData);


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


  const AmenitiesRenderItem = ({ item }) => (
    <View style={{ alignItems: 'center', marginHorizontal: 15, marginTop: 10 }}>
      <Text style={{ fontSize: 9.5, color: "#606060", fontWeight: "400", fontFamily: 'ManropeRegular', marginTop: 5 }}>{item?.name}</Text>
    </View>
  );

  const getIcon = (name) => {
    switch (name) {
      case 'Parking':
        return  <FontAwesome5 name={'car'} size={24} color={'#FD813B'}  />;
      case 'Restrooms/Toilets':
        return <FontAwesome5 name={'restroom'} size={22} color={'#FD813B'}  />;
      case 'Wheelchair access':
        return <FontAwesome name='wheelchair' size={20} color={'#FD813B'}/>;
      case 'Tables with basic covers':
        return <MaterialIcon name='table-restaurant' size={24} color={'#FD813B'} />;
      case 'Chairs':
        return <Icon name='chair' size={20} color={'#FD813B'} />;
      case 'Coolers / Fans':
        return <MaterialCommunityIcons name='fan' size={24} color={'#FD813B'} />;
      case 'Air Conditioners':
        return <MaterialCommunityIcons name='air-conditioner' size={24} color={'#FD813B'} />;
      case 'Bedrooms':
        return <IonIcons name={'bed-sharp'} size={24} color={'#FD813B'} />;
      case 'Lighting':
        return <MaterialCommunityIcons name='string-lights' size={28} color={'#FD813B'} />;
      case 'Kitchen Space':
        return <FontAwesome6 name={'kitchen-set'} size={22} color={'#FD813B'} />;
      case 'Bridal Room':
        return <IonIcons name={'bed-sharp'} size={24} color={'#FD813B'} />;
      case 'Sound/music license':
        return <MaterialIcon name='queue-music' size={25} color={'#FD813B'} />;
      default:
        return null;
    }
  };

  // Helper function to chunk data into rows of 4
  const chunkArray = (data, chunkSize) => {
    const result = [];
    for (let i = 0; i < data?.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  };

  const rows = chunkArray(amenitiesData, 4); // Split data into rows of 4 items

  const renderHallAmenities = ({item}) => {

    return (
      <View style={styles.row}>
        {item.map((data) => (
          <View key={data?.id} style={styles.itemContainer}>
             
            {getIcon(data?.name)}

            <Text style={styles.itemText}>{data?.name}</Text>
          </View>
        ))}
      </View>
    )

  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ backgroundColor: "white", marginBottom: 30 }}>
        <View style={styles.container}>
          <SwiperFlatList
            index={0}
            paginationDefaultColor='white'
            paginationActiveColor='white'
            showPagination={true}
            paginationStyle={{ bottom: 15 }}
            paginationStyleItem={{ alignSelf: 'center' }}
            paginationStyleItemInactive={{ width: 7, height: 7 }}
            paginationStyleItemActive={{ width: 10, height: 10 }}
            data={subImages}
            style={{ flex: 1, alignSelf: "center", }}
            renderItem={({ item }) => (
              <View style={[{ width: Dimensions.get('window').width, height: 300 }]}>
                <Image source={{
                  uri: item,
                  headers: { Authorization: `Bearer ${getUserAuth}` }
                }} style={styles.image}
                  resizeMethod="auto"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>


        <View style={{ flex: 1, marginTop: 10, marginHorizontal: 20 }}>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 20, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular', width: "70%" }}>{eventsDetails?.functionHallName}</Text>
            <Text style={{ color: "#202020", fontSize: 18, fontWeight: "700", fontFamily: 'ManropeRegular' }}> {formatAmount(eventsDetails?.rentPricePerDay)}/day</Text>

          </View>

          <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}>
            <MapMarkIcon />
            <Text style={{ color: "#939393", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', marginLeft: 5 }}>{eventsDetails?.functionHallAddress?.address}</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between",marginTop:15 }}>
            < View style={{}}>
            <Text style={{ fontSize: 14, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular'}}>Food Type Allowed:</Text>
            <Text style={{marginTop:10}}>{eventsDetails?.foodType == 'Both' ? <VegNonVegIcon/> :  eventsDetails?.foodType == 'veg' ? <VegIcon/>  : <NonVegIcon/>}</Text>
            </View>
            <View style={{backgroundColor:"#FEF7DE",height:25}}>
            <Text style={{textAlign:"center", color: "#FD813B", fontSize: 14, fontWeight: "700", fontFamily: 'ManropeRegular' ,paddingHorizontal:10,borderRadius:5}}> {eventsDetails?.seatingCapacity} pax</Text>
           </View>
          </View>

          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text style={styles.title}>Description:</Text>
            <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#8B8B8B", fontWeight: "400", marginTop: 4, marginBottom: 10 }}>{HallDescription}</Text>
            <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#8B8B8B", fontWeight: "400", marginTop: 4 }}>{eventsDetails?.description}</Text>
          </View>


          <View style={{ borderColor: "#F1F1F1", borderWidth: 1, width: "100%", marginTop: 5 }} />

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Hall Amenities</Text>
            <FlatList
              data={rows}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHallAmenities}
            />

            <View style={{ marginTop: 20, }}>
              <Text style={{ fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Food Type Allowed</Text>
              <Text style={{ fontWeight: "700", color: "#8B8B8B", fontSize: 12, fontFamily: 'ManropeRegular', marginTop: 10 }}>{eventsDetails?.foodType}</Text>
            </View>

          </View>

          {renderCalendar()}
          <Text style={{ marginTop: 20, fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Select Booking Details</Text>
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: "600", color: "#121212", fontSize: 14, fontFamily: 'ManropeRegular' }}>Booking Date</Text>

            <TouchableOpacity style={{
              marginTop: 5, flexDirection: "row",
              alignItems: "center", justifyContent: "space-between",
              borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
              paddingHorizontal: 20, paddingVertical: 12
            }} onPress={() => setIsVisible(true)}>
              <Text style={{ fontSize: 13, fontFamily: 'ManropeRegular', fontWeight: "400", color: selectedDate ? "#121212" : "#8B8B8B", }}>{selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : 'Pick A Date'}</Text>
              <CalendarIcon />
            </TouchableOpacity>

            <Text style={{ marginTop: 20, fontWeight: "600", color: "#121212", fontSize: 14, fontFamily: 'ManropeRegular' }}>Booking Time</Text>

            <TouchableOpacity style={{
              marginTop: 5, flexDirection: "row",
              alignItems: "center", justifyContent: "space-between",
              borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
              paddingHorizontal: 20, paddingVertical: 12
            }} onPress={() => setTimeSlotModalVisible(true)}>
              <Text style={{ fontSize: 13, fontFamily: 'ManropeRegular', fontWeight: "400", color: selectedDate ? "#121212" : "#8B8B8B", }}>{selectedTimeSlot ? selectedTimeSlot : 'Pick A Time'}</Text>
              <ServiceTime />
            </TouchableOpacity>
          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

            <Text style={[styles.title, { marginTop: 10 }]}>Total Days :</Text>
            <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{noOfDays > 1 ? `${noOfDays} days` : '1 day'}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: "20%" }}>
            <Text style={[styles.title, { marginTop: 10 }]}>Total Price :</Text>
            <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{formatAmount(eventsDetails?.rentPricePerDay)}</Text>
          </View>
        </View>

        <Modal
          isVisible={isVisible}
          backdropOpacity={0.9}
          backdropColor={themevariable.Color_000000}
          hideModalContentWhileAnimating={true}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
          animationInTiming={500}
          style={{
            flex: 1,
            width: "100%",
            alignSelf: "center"
            // top: 20,
            // margin: 0,
          }}
          onBackButtonPress={() => setIsVisible(false)}
          animationOut={'slideOutDown'}
          animationType={'slideInUp'}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <LeftArrow style={{ marginTop: 3, marginHorizontal: 50 }} />
              </TouchableOpacity>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "800", fontFamily: "ManropeRegular", }}>Select Date & Time</Text>
            </View>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              headerStyle={{ backgroundColor: '#FDEEBC' }}
              markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#ED5065' } }}
              markingType="single"
              minDate={moment().format('DD-MM-YYYY')} // Disable past dates
              theme={{
                arrowColor: 'black',
                todayTextColor: '#ED5065',
                selectedDayBackgroundColor: '#ED5065',
              }}
              style={{ marginTop: 20, marginHorizontal: 25, borderRadius: 10 }}
            />

            <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
              <BookDatesButton
                onPress={() => setIsVisible(false)}
                text={'Confirm Date'}
                padding={10}
              />
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={isTimeSlotModalVisible}
          backdropOpacity={0.9}
          backdropColor={themevariable.Color_000000}
          onBackdropPress={() => setTimeSlotModalVisible(false)}
        >
          <View style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 10
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 10
            }}>Select Time Slot</Text>
            <FlatList
              data={timeSlots}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderRadius: 10,
                    borderColor: "pink",
                    borderWidth: 1,
                    marginHorizontal: 10,
                    marginVertical: 5
                  }}
                  onPress={() => handleTimeSlotSelection(item)}
                >
                  <Text style={styles.timeSlotText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <CustomModal
          visible={modalVisible}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>

      <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
        <BookDatesButton

          onPress={() => {
            if (selectedTimeSlot && selectedDate) {
              navigation.navigate('HallsBookingOverView', { categoryId: categoryId, timeSlot: selectedTimeSlot, bookingDate: moment(selectedDate).format('DD-MM-YYYY'), totalPrice: `${formatAmount(eventsDetails?.rentPricePerDay)}` })
            } else if (!selectedDate) {
              setModalMessage("Please select the Dates");
              setModalVisible(true);
            } else if (!selectedTimeSlot) {
              setModalMessage("Please select the Time Slot");
              setModalVisible(true);
            }
          }}
          text={`${formatAmount(eventsDetails?.rentPricePerDay)} View Cart`}
          padding={10}
        />
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
  title: {
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    color: "#121212",
    fontWeight: "700",
  },
  subTitle: { fontSize: 14, color: "#5a5c5a", fontWeight: "400", },
  status: {
    fontSize: 10,
    color: 'gray',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: "center",
    marginTop: 5,
    justifyContent:"flex-start"
  },
  itemContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 5,
    marginRight:10
  },
  itemText: {
    fontSize: 9,
    fontWeight: "400",
    color: "#606060",
    fontFamily: 'ManropeRegular',
    marginTop: 5,
    height:30

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
  },
  off: {
    fontSize: 13,
    color: "#ed890e",
    fontWeight: "bold"
  },
  strickedoffer: {
    fontSize: 12,
    color: "#ed890e",
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
});

export default ViewEvents;