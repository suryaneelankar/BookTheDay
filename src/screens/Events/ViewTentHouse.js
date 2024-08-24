import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity, FlatList, Alert } from "react-native";
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
import CustomModal from "../../components/AlertModal";

const ViewTentHouse = ({ route, navigation }) => {

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
    const [itemQuantities, setItemQuantities] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [selectedRange, setSelectedRange] = useState({
        startDate: '',
        endDate: '',
    });
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [getUserAuth, setGetUserAuth] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');



    const { categoryId } = route.params;
    console.log("CATEID I::::::", categoryId)





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
        getTentHouseDetails();
    }, []);

    const getTentHouseDetails = async () => {
        console.log("IAM CALLING API")
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getTentHouseDetailsById/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("tenthouse view details ::::::::::",JSON.stringify( response?.data));
            setEventsDetails(response?.data);

            const imageUrls = response?.data?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));
            setSubImages(imageUrls);
            setRentalItemsData(response?.data?.rentalItems);
            console.log("rental items::::::", response?.data?.rentalItems)
        } catch (error) {
            console.log("tenthouse details::::::::::", error);

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
        const { startDate, endDate } = selectedRange;

        // if (selectedOption === 'monthly') {
        //   // Set start date and end date to 30 days after start date for monthly option
        //   const endDate = moment(day.dateString).add(29, 'days').format('YYYY-MM-DD');
        //   setSelectedRange({ startDate: day.dateString, endDate });
        // //   setNumberOfDays(31); // 30 days + 1 to include both start and end date
        // } else {
        // If start date is not set or both dates are set, set the start date
        if (!startDate || (startDate && endDate)) {
            setSelectedRange({ startDate: day.dateString, endDate: '' });
            setNumberOfDays(1); // Reset number of days when selecting a new start date
        } else if (startDate && !endDate) {
            // Ensure the end date is after the start date
            if (moment(day.dateString).isAfter(moment(startDate))) {
                setSelectedRange({ startDate, endDate: day.dateString });
                const days = moment(day.dateString).diff(moment(startDate), 'days') + 1; // Include both start and end dates
                setNumberOfDays(days);
            } else {
                Alert.alert('Invalid date selection', 'End date must be after start date.');
            }
        }
        // }
    };


    const getMarkedDates = () => {
        const { startDate, endDate } = selectedRange;
        if (!startDate) {
            return {};
        }

        let markedDates = {
            [startDate]: {
                startingDay: true,
                color: '#FFC107',
                textColor: 'white',
            },
        };

        if (endDate) {
            markedDates[endDate] = {
                endingDay: true,
                color: '#FFC107',
                textColor: 'white',
            };

            // Add dates between startDate and endDate
            let currentDate = new Date(startDate);
            while (currentDate < new Date(endDate)) {
                currentDate.setDate(currentDate.getDate() + 1);
                const dateString = currentDate.toISOString().split('T')[0];
                if (dateString !== endDate) {
                    markedDates[dateString] = {
                        color: '#FFE082',
                        textColor: 'white',
                    };
                }
            }
        } else {
            markedDates[startDate].endingDay = true;
        }

        return markedDates;
    };

    console.log("selected dates:::::::::", selectedRange.startDate, selectedRange.endDate);


    const updateQuantity = (item) => {
        const quantity = itemQuantities[item.itemName] || 0;
        const newQuantity = quantity + 1;
        setItemQuantities(prevState => ({
            ...prevState,
            [item.itemName]: newQuantity
        }));

        setSelectedItems(prevState => ({
            ...prevState,
            [item.itemName]: {
                name: item.itemName,
                quantity: newQuantity,
                perDayPrice: item.perDayPrice,
                total: newQuantity * item.perDayPrice
            }
        }));
    };

    const decrementQuantity = (item) => {
        const quantity = itemQuantities[item.itemName] || 0;
        const newQuantity = quantity > 0 ? quantity - 1 : 0;
        setItemQuantities(prevState => ({
            ...prevState,
            [item.itemName]: newQuantity
        }));

        if (newQuantity > 0) {
            setSelectedItems(prevState => ({
                ...prevState,
                [item.itemName]: {
                    name: item.itemName,
                    quantity: newQuantity,
                    perDayPrice: item.perDayPrice,
                    total: newQuantity * item.perDayPrice
                }
            }));
        } else {
            const updatedItems = { ...selectedItems };
            delete updatedItems[item.itemName];
            setSelectedItems(updatedItems);
        }
    };
    console.log("selected rental irems", selectedItems);

    const calculateTotalPrice = (rentalItemsData, itemQuantities) => {
        if (!rentalItemsData) return 0;
        return rentalItemsData.reduce((total, item) => {
            const quantity = itemQuantities[item.itemName] || 0;
            return total + (item.perDayPrice * quantity);
        }, 0);
    };

    const RentalItem = ({ item }) => {
        const quantity = itemQuantities[item.itemName] || 0;
        return (
            <View style={styles.itemContainer}>
                <Image source={{
                    uri: item?.image,
                    headers: { Authorization: `Bearer ${getUserAuth}` }
                }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                        <View>
                            <Text style={styles.itemName}>{item?.itemName}</Text>
                            {/* <Text style={styles.itemPrice}><Text style={{fontSize:12, fontWeight:"400"}}>Per Hour</Text> ₹{item?.perHourPrice}/-</Text> */}
                            <Text style={styles.itemPrice}><Text style={{ fontSize: 12, fontWeight: "400", }}>Per Day </Text>₹{item?.perDayPrice}/-</Text>
                        </View>

                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => decrementQuantity(item)}>
                                <MinusIcon />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => updateQuantity(item)}>
                                <AddIcon />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Text style={styles.itemDescription}>{item?.description}</Text>
                </View>

            </View>
        );
    };


    console.log("item qunttes, ", itemQuantities?.length);
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

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 20, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular' }}>{eventsDetails?.tentHouseName}</Text>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}>
                        <MapMarkIcon />
                        <Text style={{ color: "#939393", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', marginLeft: 5 }}>{eventsDetails?.tentHosueAddress?.address}</Text>
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
                        renderItem={({ item }) =>
                            <RentalItem
                                item={item}
                                quantity={itemQuantities[item.itemName] || 0}
                                updateQuantity={updateQuantity}
                            />
                        }
                    />

                    <Text style={{ marginTop: 20, fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Book The Day</Text>

                    <TouchableOpacity style={{ marginTop: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => setIsVisible(true)}>
                        <View style={{ alignItems: "center" }}>
                            <CalendarIcon />
                            <Text style={{ fontSize: 12, fontFamily: 'ManropeRegular', fontWeight: "400" }}>{selectedDate ? 'Booking Date' : 'Select The Date'}</Text>
                        </View>
                        <View>
                            <Text style={[styles.title, { marginTop: 2 }]}>{selectedRange?.endDate ? `${selectedRange?.startDate} to ${selectedRange?.endDate}` : `${selectedRange?.startDate}`}</Text>
                            {/* <Text style={[styles.title, { marginTop: 2 }]}>No of Days: {selectedRange ? `${numberOfDays}`: null}</Text> */}
                        </View>
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
                        <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{numberOfDays} Days</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: "25%" }}>

                        <Text style={[styles.title, { marginTop: 10 }]}>Total Price :</Text>
                        <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{`₹${numberOfDays > 0 ? numberOfDays * calculateTotalPrice(rentalItemsData, itemQuantities) : calculateTotalPrice(rentalItemsData, itemQuantities)}`}</Text>
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
                            onDayPress={onDayPress}
                            headerStyle={{ backgroundColor: '#FDEEBC' }}
                            markedDates={getMarkedDates()}
                            markingType="period"
                            minDate={moment().format('YYYY-MM-DD')} // Disable past dates
                            theme={{
                                arrowColor: 'black',
                                todayTextColor: '#ED5065',
                                selectedDayBackgroundColor: '#FFC107',
                            }}
                            style={{ marginTop: 20, marginHorizontal: 25, borderRadius: 10 }}
                        />
                        {/* <Calendar
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
                        /> */}

                        <View style={{ flex: 1, bottom: 0, position: "absolute" }}>
                            <BookDatesButton
                                onPress={() => setIsVisible(false)}
                                text={`Confirm Date`}
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
                        if (selectedRange && selectedTimeSlot && Object.keys(itemQuantities).length > 0) {
                            navigation.navigate('BookingOverView', { categoryId: categoryId, numberOfDays: numberOfDays, selectedRentalItems: selectedItems, rentalItems: itemQuantities, timeSlot: selectedTimeSlot, startDate: selectedRange?.startDate, endDate: selectedRange?.endDate, totalPrice: `₹${numberOfDays * calculateTotalPrice(rentalItemsData, itemQuantities)}` })
                        } else if (!selectedRange?.startDate) {
                            setModalMessage("Please select the Dates");
                            setModalVisible(true);
                        } else if (!selectedTimeSlot) {
                            setModalMessage("Please select the Time Slot");
                            setModalVisible(true);
                        } else if (!itemQuantities || Object.keys(itemQuantities).length === 0) {
                            setModalMessage("Please select the Rental Items");
                            setModalVisible(true);
                        }

                    }
                    }
                    text={`₹${numberOfDays > 0 ? numberOfDays * calculateTotalPrice(rentalItemsData, itemQuantities) : calculateTotalPrice(rentalItemsData, itemQuantities)}   View Cart`}
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
        borderRadius: 10,
        paddingHorizontal: 10,
        height: "50%"
    },
    quantityText: {
        fontSize: 13,
        marginHorizontal: 8,
        color: "#000000",
        fontWeight: "400",
        fontFamily: 'ManropeRegular',

    },
});

export default ViewTentHouse;