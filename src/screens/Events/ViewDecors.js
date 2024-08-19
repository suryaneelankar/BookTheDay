import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity, FlatList } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import { verticalScale, moderateScale, horizontalScale } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from "react-native-swiper";
import MapMarkIcon from '../../assets/svgs/orangeMapMark.svg';
import PeopleAccommodate from '../../assets/svgs/peopleAccommodate.svg';
import FanIcon from '../../assets/svgs/Fan.svg';
import RoomsAvailable from '../..//assets/svgs/roomAvailable.svg';
import AcIcon from '../../assets/svgs/AcAvailable.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import BookDatesButton from "../../components/GradientButton";
import ServiceTime from '../../assets/svgs/serviceTime.svg';
import MinusIcon from '../../assets/svgs/minusIcon.svg';
import AddIcon from '../../assets/svgs/addIcon.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";

const ViewDecors = ({ route, navigation }) => {

    const { width } = Dimensions.get('window');
    const [eventsDetails, setEventsDetails] = useState([])
    const [subImages, setSubImages] = useState();
    const [rentalItemsData, setRentalItemsData] = useState();

    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [noOfDays, setNoOfDays] = useState();
    const [bookingData, setBookingData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isTimeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [addedItems, setAddedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);


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

    const amenitiesData = [
        { id: '1', icon: PeopleAccommodate, label: '500-1200 pax' },
        { id: '2', icon: FanIcon, label: 'Fan Available' },
        { id: '3', icon: RoomsAvailable, label: '4 Bedroom' },
        { id: '4', icon: AcIcon, label: 'Air Condition' },
    ];

    const rentalItems = [
        {
            id: '1',
            name: 'Marriage',
            price: '1300',
            description: 'The Critical Minerals Association USA aims to address critical mineral supply chain challenges to favourably...',
            image: 'https://fpimages.withfloats.com/tile/61fb32feb11d6b00017d8f8b.jpg',
        },
        {
            id: '2',
            name: 'Birthday',
            price: '1000',
            description: 'The Critical Minerals Association USA aims to address critical mineral supply chain challenges to favourably...',
            image: 'https://fpimages.withfloats.com/tile/61fb32feb11d6b00017d8f8b.jpg',
        },
        {
            id: '3',
            name: 'Anniversary',
            price: '800',
            description: 'The Critical Minerals Association USA aims to address critical mineral supply chain challenges to favourably...',
            image: 'https://fpimages.withfloats.com/tile/61fb32feb11d6b00017d8f8b.jpg',
        },
        {
            id: '4',
            name: 'House Warming',
            price: '1800',
            description: 'The Critical Minerals Association USA aims to address critical mineral supply chain challenges to favourably...',
            image: 'https://fpimages.withfloats.com/tile/61fb32feb11d6b00017d8f8b.jpg',
        },
    ];

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

    const convertLocalhostUrls = (url) => {
        return url.replace("localhost", LocalHostUrl);
    };

    useEffect(() => {
        getDecorDetails();
    }, []);

    const getDecorDetails = async () => {
        console.log("IAM CALLING API")
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getDecorationDetailsById/${categoryId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            console.log("decorations view details ::::::::::", JSON.stringify(response?.data));
            setEventsDetails(response?.data);

            const imageUrl = response?.data?.professionalImage?.url.replace('localhost', LocalHostUrl);
            setSubImages([imageUrl]);

            setRentalItemsData(response?.data?.packages);
        } catch (error) {
            console.log("tenthouse details::::::::::", error);

        }
    }


    console.log("profe image:", JSON.stringify(rentalItemsData));

    const addItem = (item) => {
        setAddedItems((prevAddedItems) => {
            if (prevAddedItems.some(addedItem => addedItem._id === item._id)) {
                return prevAddedItems.filter(addedItem => addedItem._id !== item._id);
            } else {
                return [...prevAddedItems, item];
            }
        });
    };

    const isItemAdded = (item) => {
        return addedItems.some(addedItem => addedItem._id === item._id);
    };

    useEffect(() => {
        const total = addedItems.reduce((sum, item) => sum + item.packagePrice, 0);
        setTotalPrice(total);
      }, [addedItems]);

    console.log("added to cart is:::::::", JSON.stringify(addedItems))

    const createFunctionHallBooking = async (eventId) => {

        const bookingData = {
            eventId: eventId,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            totalAmount: noOfDays ? formatAmount(eventsDetails?.price * noOfDays) : formatAmount(eventsDetails?.price),
            numOfDays: noOfDays
        };

        console.log('params data is::>>', bookingData);
        const token = await getUserAuthToken();
        try {
            const response = await axios.post(`${BASE_URL}/create-event-booking`, bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                }
            });
            console.log("event booking resp ::::::::::", response?.data?.data);

            setBookingData(response?.data?.data);
            if (response?.data?.status == 200) {
                navigation.navigate('BookingOverView', { categoryId: categoryId })
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

    console.log("selected dates:::::::::", selectedStartDate, selectedEndDate);

    const AmenitiesRenderItem = ({ icon: Icon, label }) => (
        <View style={{ alignItems: 'center', marginHorizontal: 15, marginTop: 10 }}>
            <Icon style={{}} />
            <Text style={{ fontSize: 9.5, color: "#606060", fontWeight: "400", fontFamily: 'ManropeRegular', marginTop: 5 }}>{label}</Text>
        </View>
    );




    const RentalItem = ({ item , addItem, isAdded}) => {

        return (
            <View style={styles.itemContainer}>
                <View style={{ width: Dimensions.get('window').width / 4, height: 100 }}>
                    <Swiper
                        showsPagination
                        autoplay={true}
                        paginationStyle={{ bottom: 15 }}
                        dotStyle={{ width: 7, height: 7 }}
                        activeDotStyle={{ width: 10, height: 10 }}
                    >
                        {item.packageImages.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: image.url.replace('localhost', LocalHostUrl) }}
                                style={{
                                    width: '100%',
                                    height: "95%",
                                    resizeMode: 'cover'
                                }}
                                resizeMode="cover"
                            />
                        ))}
                    </Swiper>
                </View>
                <View style={styles.itemDetails}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                        <View>
                            <Text style={styles.itemName}>{item?.packageName}</Text>
                            <Text style={styles.itemPrice}><Text style={{ fontSize: 12, fontWeight: "400" }}></Text> ₹{item?.packagePrice}/-</Text>
                        </View>

                        <View style={styles.quantityContainer}> 
                            <TouchableOpacity onPress={() => addItem(item)}>
                            <Text style={styles.addText}>{isAdded ? 'Added -' : 'ADD'}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Text style={styles.itemDescription}>{item?.packageDescription}</Text>
                </View>

            </View>
        );
    };



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
                                <Image source={{ uri: item }} style={styles.image}
                                    resizeMethod="auto"
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    />
                </View>


                <View style={{ flex: 1, marginTop: 10, marginHorizontal: 20 }}>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 20, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular' }}>{eventsDetails?.eventOrganiserName}</Text>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}>
                        <MapMarkIcon />
                        <Text style={{ color: "#939393", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', marginLeft: 5 }}>{eventsDetails?.eventOrganizerAddress?.address}</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.title}>Description :</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#8B8B8B", fontWeight: "400", marginTop: 4, marginBottom: 10 }}>{eventsDetails?.description}</Text>
                    </View>

                    <View style={{ borderColor: "#F1F1F1", borderWidth: 1, width: "100%", marginTop: 5 }} />

                    <Text style={{ color: "#000000", fontSize: 13, fontWeight: "700", fontFamily: 'ManropeRegular', marginTop: 15 }}>Available Rental Items</Text>
                    <FlatList
                        data={rentalItemsData}
                        keyExtractor={(item) => item?.id}
                        renderItem={({ item }) => <RentalItem item={item} addItem={addItem}
                            isAdded={isItemAdded(item)} />}
                    />

                    <Text style={{ marginTop: 20, fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Book The Day</Text>

                    <TouchableOpacity style={{ marginTop: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => setIsVisible(true)}>
                        <View style={{ alignItems: "center" }}>
                            <CalendarIcon />
                            <Text style={{ fontSize: 12, fontFamily: 'ManropeRegular', fontWeight: "400" }}>{selectedDate ? 'Booking Date' : 'Select The Date'}</Text>
                        </View>
                        <Text style={[styles.title, { marginTop: 2 }]}>{selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : null}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setTimeSlotModalVisible(true)} style={{ marginTop: 25, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ alignItems: "center" }}>
                            <ServiceTime />
                            <Text style={{ fontSize: 12, fontFamily: 'ManropeRegular', fontWeight: "400" }}>{selectedDate ? 'Service Time' : 'Service Time'}</Text>
                        </View>
                        <Text style={[styles.title, { marginTop: 2 }]}>{selectedTimeSlot ? selectedTimeSlot : 'Pick A Time Slot'}</Text>

                    </TouchableOpacity>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

                        <Text style={[styles.title, { marginTop: 10 }]}>Total Days :</Text>
                        <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{noOfDays > 1 ? `${noOfDays} days` : '1 day'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,marginBottom:"20%" }}>

                        <Text style={[styles.title, { marginTop: 10 }]}>Total Price :</Text>
                        <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{formatAmount(totalPrice)}</Text>
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
                            minDate={moment().format('YYYY-MM-DD')} // Disable past dates
                            theme={{
                                arrowColor: 'black',
                                todayTextColor: '#ED5065',
                                selectedDayBackgroundColor: '#ED5065',
                                textDisabledColor: '#d9e1e8' // Make disabled dates less prominent
                            }}
                            disableAllTouchEventsForDisabledDays={true} // Disable touch events for past dates
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


            </ScrollView>

            <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
        <BookDatesButton
          onPress={() => navigation.navigate('DecorsBookingOverView', { categoryId: categoryId, timeSlot: selectedTimeSlot, bookingDate: moment(selectedDate).format('DD-MM-YYYY'), totalPrice: `${formatAmount(totalPrice)}`, addedItems: addedItems})}
          text={` View Cart`}
          padding={10}
        />
      </View>
            {/* <Text style={{ padding: 10, color: 'black', fontWeight: '600' }}>Total for {noOfDays} days</Text> */}
            {/* <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 8, padding: 10, borderColor: '#D2453B', borderWidth: 2, width: '45%' }}
                    onPress={() => navigation.navigate('BookingOverView', { categoryId: categoryId })}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View>
                            <Text style={[styles.strickedoffer, { fontWeight: '500', color: '#D2453B' }]}>₹1800</Text>
                            <Text style={{ color: '#D2453B', fontWeight: '900', fontSize: 16 }}>{noOfDays ? formatAmount(eventsDetails?.price * noOfDays) : formatAmount(eventsDetails?.price)}</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end' }}>
                            <Text style={{ color: '#D2453B', textAlign: 'right', fontWeight: '800', }} numberOfLines={2}>Book</Text>
                            <Text style={{ color: '#D2453B', textAlign: 'right', fontWeight: '800', }} numberOfLines={2}>Now</Text>
                        </View>
                    </View>

                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#D2453B', borderRadius: 8, padding: 10, borderColor: 'white', borderWidth: 2, width: '45%' }}
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

            </View> */}
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
        color: "#8B8B8B"
        , fontWeight: "500",
    },
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#4E7B10",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: "50%"
    },
    addText: {
        color: "#4E7B10",
        fontSize: 12,
        fontWeight: "700",
        fontFamily: 'ManropeRegular',

    },
    quantityText: {
        fontSize: 13,
        marginHorizontal: 8,
        color: "#000000",
        fontWeight: "400",
        fontFamily: 'ManropeRegular',

    },
});

export default ViewDecors;