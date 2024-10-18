import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ScrollView, Button, TouchableOpacity, FlatList, TextInput } from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import { verticalScale, moderateScale, horizontalScale } from "../../utils/scalingMetrics";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import MapMarkIcon from '../../assets/svgs/orangeMapMark.svg';
import CalendarIcon from '../../assets/svgs/calendarOrangeIcon.svg';
import Modal from 'react-native-modal';
import themevariable from "../../utils/themevariable";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import BookDatesButton from "../../components/GradientButton";
import ServiceTime from '../../assets/svgs/serviceTime.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import CustomModal from "../../components/AlertModal";

const ViewCaterings = ({ route, navigation }) => {

    const { width } = Dimensions.get('window');
    const [eventsDetails, setEventsDetails] = useState([])
    const [subImages, setSubImages] = useState();
    const [foodItemsData, setFoodItemsData] = useState();

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
    const [addedItems, setAddedItems] = useState([]);
    const [numPlates, setNumPlates] = useState({});
    // const [selectedIndex, SetSelectedIndex] = useState();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [getUserAuth, setGetUserAuth] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [missingTitle, setMissingTitle] = useState('');


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

    const cateringsDescription = 'Exquisite Catering for Your Unforgettable Moments Elevate your event with impeccable catering services, curated to perfection by BookTheDay. Whether it’s an elegant wedding or a grand celebration, our handpicked chefs deliver gourmet experiences that delight every palate. Enjoy tailored menus, flawless service, and a culinary journey your guests will remember forever.';

    const handleTimeSlotSelection = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setTimeSlotModalVisible(false);
    };

    const convertLocalhostUrls = (url) => {
        return url.replace("localhost", LocalHostUrl);
    };

    useEffect(() => {
        getCateringDetails();
    }, []);

    const getCateringDetails = async () => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getCateringDetailsById/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("catering view details ::::::::::", JSON.stringify(response?.data));
            setEventsDetails(response?.data);

            const imageUrls = response?.data?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));
            setSubImages(imageUrls);
            setFoodItemsData(response?.data?.foodItems);
        } catch (error) {
            console.log("catering details::::::::::", error);

        }
    }

    function formatAmount(amount) {
        const amountStr = `${amount}`;
        const [integerPart, decimalPart] = amountStr.split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
        return `₹${formattedAmount}`;
    };

    const FoodItem = ({ item, onAdd, onDelete, addedItems, numPlates, setNumPlates, selectedIndex, setSelectedIndex, index, totalItems }) => {
        const isAdded = addedItems.some(addedItem => addedItem?._id === item?._id);

        return (
            <View style={{ marginTop:15}}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: "60%" }}>
                        <Text style={{ color: "#100D25", fontSize: 16, fontWeight: "600", fontFamily: 'ManropeRegular' }}>{item?.title}</Text>
                        <Text style={{ fontSize: 10, color: "#FD813B", marginTop: 5 }}>{formatAmount(item?.perPlateCost)}</Text>
                        <Text style={{ fontSize: 10, color: "#FD813B", marginTop: 5 }}>Min order: {item?.minOrder}</Text>
                        <Text style={{ marginTop: 5, color: "#100D25", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular' }}>{item?.items.join(', ')}</Text>
                    </View>

                    <View style={{ width: "40%" }}>
                        <Image style={{ height: 120, borderRadius: 15 }} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Lunch_Meals.jpg' }} />
                        <TouchableOpacity
                            onPress={() => {
                                if (isAdded) {
                                    onDelete(item, index);
                                    setSelectedIndex(null);
                                } else {
                                    onAdd(item, index);
                                    setSelectedIndex(index);
                                }
                            }}
                            style={{ width: "75%", position: "relative", bottom: 15, borderRadius: 10, backgroundColor: "#F1F1F1", alignSelf: "center" }}
                        >
                            <Text style={styles.addText}>{isAdded ? 'DELETE' : 'ADD'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isAdded && (
                    <>
                        <TextInput
                            style={{ backgroundColor: "#F1F1F1", borderRadius: 5, elevation: 2,marginBottom:15 }}
                            placeholder="Enter number of plates"
                            keyboardType='phone-pad'
                            value={numPlates[item.title] || ''}
                            onChangeText={(text) => setNumPlates({ ...numPlates, [item.title]: text })}
                        />
                    </>
                )}

                {index < totalItems - 1 && (
                    <View style={{
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderColor: '#E0E0E0',

                    }} />
                )}
            </View>
        );
    };
    console.log("numof plates::::::::", numPlates)

    const handleAdd = (item) => {
        setAddedItems([...addedItems, item]);
    };

    const handleDelete = (item) => {
        setAddedItems(addedItems.filter(addedItem => addedItem.title !== item.title));
        setNumPlates({ ...numPlates, [item.title]: '' });
    };

    const formattedDates = (date) => {
        const formattedDate = moment(date).format("DD MMM YYYY");
        return formattedDate;
    }

    const onDayPress = (day) => {
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
            const diffInTime = endDate.getTime() - startDate.getTime();
            const diffInDays = diffInTime / (1000 * 3600 * 24);
            setNoOfDays(diffInDays);
            const formattedStartDate = formattedDates(selectedStartDate);
            setSelectedStartDate(formattedStartDate);
        }
    };

    // console.log("selected dates:::::::::", selectedStartDate, selectedEndDate);

    const calculateTotalPrice = (numOfPlates, addedItems) => {
        return addedItems.map(item => {
            const numPlates = numOfPlates[item.title];
            if (numPlates) {
                return {
                    ...item,
                    totalPrice: numPlates * item.perPlateCost,
                };
            }
            return item;
        });
    };
    const calculateGrandTotal = itemsWithTotalPrice => {
        return itemsWithTotalPrice.reduce((sum, item) => sum + item.totalPrice, 0);
    };
    const itemsWithTotalPrice = calculateTotalPrice(numPlates, addedItems);
    const grandTotal = calculateGrandTotal(itemsWithTotalPrice);

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
                        <Text style={{ fontSize: 20, color: "#100D25", fontWeight: "700", fontFamily: 'ManropeRegular' }}>{eventsDetails?.foodCateringName}</Text>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 5, alignItems: "flex-start" }}>
                        <MapMarkIcon style={{marginTop:2}} />
                        <Text style={{ color: "#939393", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', marginLeft: 5 }}>{eventsDetails?.foodCateringAddress?.address}</Text>
                    </View>

                    <View style={{ marginTop: 20 ,marginBottom: 10 }}>
                        <Text style={styles.title}>Description</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#8B8B8B", fontWeight: "400", marginTop: 4, marginBottom: 10 }}>{cateringsDescription}</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontSize: 12, color: "#8B8B8B", fontWeight: "400", marginTop: 4, }}>{eventsDetails?.description}</Text>
                    </View>

                    <View style={{ borderColor: "#F1F1F1", borderWidth: 1, width: "100%", marginTop: 5 }} />

                    <Text style={{ color: "#000000", fontSize: 14, fontWeight: "700", fontFamily: 'ManropeRegular', marginTop: 15 }}>Available Food Menu</Text>

                    <FlatList
                        data={foodItemsData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <FoodItem
                                item={item}
                                index={index}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                                addedItems={addedItems}
                                numPlates={numPlates}
                                setNumPlates={setNumPlates}
                                selectedIndex={selectedIndex}
                                setSelectedIndex={setSelectedIndex}
                                totalItems={foodItemsData?.length}
                            />
                        )}
                    />
                    <Text style={{ marginTop: 20, fontWeight: "700", color: "#121212", fontSize: 16, fontFamily: 'ManropeRegular' }}>Select Booking Details</Text>

                    <View style={{ marginTop: 15 }}>
                        <Text style={{ fontWeight: "600", color: "#121212", fontSize: 14, fontFamily: 'ManropeRegular' }}>Booking Date</Text>
                        <TouchableOpacity style={{
                            marginTop: 10, flexDirection: "row",
                            alignItems: "center", justifyContent: "space-between",
                            borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
                            paddingHorizontal: 20, paddingVertical: 12
                        }} onPress={() => setIsVisible(true)}>
                            <Text style={{ fontSize: 13, fontFamily: 'ManropeRegular', fontWeight: "400", color: selectedDate ? "#121212" : "#8B8B8B", }}>{selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : 'Pick A Date'}</Text>
                            <CalendarIcon />
                        </TouchableOpacity>
                        <Text style={{ marginTop: 20, fontWeight: "600", color: "#121212", fontSize: 14, fontFamily: 'ManropeRegular' }}>Booking Time</Text>


                        <TouchableOpacity style={{
                            marginTop: 10, flexDirection: "row",
                            alignItems: "center", justifyContent: "space-between",
                            borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
                            paddingHorizontal: 20, paddingVertical: 12
                        }} onPress={() => setTimeSlotModalVisible(true)}>
                            <Text style={{ fontSize: 13, fontFamily: 'ManropeRegular', fontWeight: "400", color: selectedDate ? "#121212" : "#8B8B8B", }}>{selectedTimeSlot ? selectedTimeSlot : 'Pick A Time Slot'}</Text>
                            <ServiceTime />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

                        <Text style={[styles.title, { marginTop: 10 }]}>Total Days :</Text>
                        <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{noOfDays > 1 ? `${noOfDays} days` : '1 day'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: "25%" }}>

                        <Text style={[styles.title, { marginTop: 10 }]}>Total Price :</Text>
                        <Text style={[styles.title, { marginTop: 10, fontWeight: "bold" }]}>{`₹${grandTotal}`}</Text>
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
                        const incompleteItem = itemsWithTotalPrice.find(item => !item.hasOwnProperty('totalPrice'));
                        console.log("incomplete value::::::::", incompleteItem)
                        if (incompleteItem) {
                            // setMissingTitle(incompleteItem?.title);
                            setModalMessage(`Please add the number of plates for ${incompleteItem.title}`);
                            setModalVisible(true)
                        } else if (selectedTimeSlot && selectedDate && itemsWithTotalPrice?.length !== 0) {
                            navigation.navigate('CateringsOverView', { categoryId: categoryId, cateringItems: itemsWithTotalPrice, timeSlot: selectedTimeSlot, bookingDate: moment(selectedDate).format('DD-MM-YYYY'), totalPrice: `₹${grandTotal}` })
                        } else if (itemsWithTotalPrice?.length === 0) {
                            setModalMessage("Please select the Combo");
                            setModalVisible(true);
                        } else if (!selectedDate) {
                            setModalMessage("Please select the Dates");
                            setModalVisible(true);
                        } else if (!selectedTimeSlot) {
                            setModalMessage("Please select the Time Slot");
                            setModalVisible(true);
                        }
                    }}
                    text={itemsWithTotalPrice?.length > 0 ? `₹${grandTotal}   View Cart` : "View Cart"}
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
        fontSize: 14,
        color: "#121212",
        fontWeight: "700",
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
    addText: {
        color: "#4E7B10",
        fontSize: 16,
        fontWeight: "700",
        fontFamily: 'ManropeRegular',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: "#4E7B10",
        borderWidth: 1,
        alignSelf: "center",
        textAlign: "center",
        width: "100%"


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

export default ViewCaterings;