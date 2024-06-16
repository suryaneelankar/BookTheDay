import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, Alert, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Animated, TextInput } from "react-native";
import Avatar from "../../components/NameAvatar";
import TruestedMarkGray from '../../assets/svgs/trustedMarkGray.svg';
import { formatAmount } from "../../utils/GlobalFunctions";
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import { HireDetails, PaginationDots } from "../../components/InfoBox";
import PricingOptions from "../../components/PriceOptions";
import Swiper from 'react-native-swiper';
import LinearGradient from "react-native-linear-gradient";
import BookDatesButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale, moderateScale, verticalScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
import Modal from 'react-native-modal';
import { Calendar } from "react-native-calendars";
import SelectDateTimeScreen from "./SelectDateTime";
import ClockIcon from '../../assets/svgs/clock.svg';
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import moment from "moment";
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const ViewHireDetails = ({ route }) => {
    const { Catid } = route.params;
    const [selectedOption, setSelectedOption] = useState('daily');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [specificDetails, setSpecificDetails] = useState('');
    const [pickedTime, setPickedTime] = useState('');

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
    const [pickedStartTime, setPickedStartTime] = useState('');
    const [pickedEndTime, setPickedEndTime] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [hoursDifference, setHoursDifference] = useState('');

    const [pickupLocation, setPickupLocation] = useState();
    const [destinationLocation, setDestinationLocation] = useState();

    const { width: viewportWidth } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const [specifcadditionalImages, setSpecificAdditionImages] = useState([]);
    const [HireImage, setHireImage] = useState('');
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedRange, setSelectedRange] = useState({
        startDate: '',
        endDate: '',
    });
    const [numberOfDays, setNumberOfDays] = useState(0);

    const photos = [
        { uri: 'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg' },
        { uri: 'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg' },
        { uri: 'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg' },
        // Add more photos as needed
    ];
    useEffect(() => {
        getSpecificDetails();
        // requestGalleryPermission();
    }, []);

    const getSpecificDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getDriverChef/${Catid}`);
            console.log("specifi RESPONSE::::;;;;", JSON.stringify(response?.data))
            setSpecificDetails(response?.data);

            const photos = response?.data?.additionalImages.flat().map(image => ({
                uri: image.url.replace('localhost', LocalHostUrl),  // Replace 'localhost' with '192.168.1.8'
            }));
            const updateImage = response?.data?.professionalImage?.url;
            setSpecificAdditionImages(photos);

            const updatedImgUrl = updateImage ? updateImage.replace('localhost', LocalHostUrl) : updateImage;
            setHireImage(updatedImgUrl)

        } catch (error) {
            console.log("specifc hire data error>>::", error);
        }
    }

    const renderPagination = (index, total) => {
        return (
            <View style={styles.paginationContainer}>
                <Text style={styles.counterText}>{index + 1}/{total}</Text>
            </View>
        );
    };

    const handleSelect = (option, price) => {
        console.log("SELECTED PRIVE TAG::::::", option, price)
        setSelectedOption(option);
        setSelectedPrice(price);
    };

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };

    const handleStartConfirm = (date) => {
        setStartDate(date);
        setPickedStartTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        hideStartDatePicker();
        if (endDate) {
            calculateHoursDifference(date, endDate);
        }
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };

    const handleEndConfirm = (date) => {
        setEndDate(date);
        setPickedEndTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        hideEndDatePicker();
        if (startDate) {
            calculateHoursDifference(startDate, date);
        }
    };

    const calculateHoursDifference = (start, end) => {
        const difference = Math.abs(end - start);
        const hours = Math.floor(difference / 36e5); // Difference in hours
        const minutes = Math.floor((difference % 36e5) / 60000); // Difference in minutes
        setHoursDifference(`${hours} hours ${minutes} minutes`);
    };

    //

    const handleBookDatesPress = () => {
        setIsVisible(true)
        // navigation.navigate('SelectDateTime', { productNav: false })
    };
 console.log("SELEVCTED OPTION::::::::", selectedOption)

    const touchCoordinates = new Animated.Value(0);

    const onDayPress = (day) => {
        const { startDate, endDate } = selectedRange;

        if (selectedOption === 'monthly') {
            // Set start date and end date to 30 days after start date for monthly option
            const endDate = moment(day.dateString).add(29, 'days').format('YYYY-MM-DD');
            setSelectedRange({ startDate: day.dateString, endDate });
            //   setNumberOfDays(31); // 30 days + 1 to include both start and end date
        } else {
            // If start date is not set or both dates are set, set the start date
            if (!startDate || (startDate && endDate)) {
                setSelectedRange({ startDate: day.dateString, endDate: '' });
                setNumberOfDays(0); // Reset number of days when selecting a new start date
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
        }
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


    return (
        <SafeAreaView>
            <ScrollView >
                <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 10, paddingVertical: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Avatar widthDyn={92} heightDyn={87} borderRadiusDyn={5} name={'Neelankar'} imageUrl={HireImage} />

                        <View style={{ marginLeft: 10, width: "58%" }}>
                            <Text style={{ marginTop: 5, color: "#333333", fontSize: 16, fontWeight: "500", fontFamily: "ManropeRegular", }}>{specificDetails?.name}</Text>
                            <Text style={{ color: "#939191", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", }}>{specificDetails?.serviceType === 'chef' ? specificDetails?.expertiseFood : specificDetails?.vehicleType}</Text>
                            <View style={{ marginTop: 5, flexDirection: "row", backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center", paddingVertical: 2, borderRadius: 5, paddingHorizontal: 5, width: 57 }}>
                                <TruestedMarkGray style={{ marginHorizontal: 2 }} />
                                <Text style={{ color: '#6B779A', fontSize: 9, fontFamily: "ManropeRegular", fontWeight: "800" }}>Verified</Text>
                            </View>
                        </View>
                        {specificDetails?.foodType === 'veg' ? (
                            <VegIcon />
                        ) : specificDetails?.foodType === 'nonveg' ? (
                            <NonVegIcon />
                        ) : specificDetails?.foodType === 'both' ? (
                            <VegNonVegIcon />
                        ) : null}
                        {/* <Text style={{marginLeft:5,color:"#101010",fontSize:14, fontWeight:"800",fontFamily: "ManropeRegular",}}>{formatAmount('900')}<Text style={{color:"#101010",fontSize:14, fontWeight:"400",fontFamily: "ManropeRegular",}}> /hr</Text></Text> */}
                    </View>

                    <View style={styles.infoBoxContainer}>
                        <HireDetails
                            mainText="Experience"
                            subText={specificDetails?.experience}
                        />
                        <View style={styles.verticalLine} />
                        <HireDetails
                            mainText="Trusted"
                            subText="Yes"
                        />
                        <View style={styles.verticalLine} />
                        <HireDetails
                            mainText="Availability"
                            subText={`${specificDetails?.avalable ? 'All Days' : 'Not Available'}`}
                        />
                    </View>

                    <TouchableOpacity style={{ backgroundColor: '#AF243E', borderRadius: 5, marginTop: 15, width: Dimensions.get('window').width / 1.3, alignSelf: "center", marginBottom: 10, alignItems: "center", paddingVertical: 8 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700", fontFamily: "ManropeRegular", }}>{formatAmount(specificDetails?.subscriptionChargesPerMonth)}/month<Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800", fontFamily: "ManropeRegular", }}> | Subscribe</Text></Text>
                    </TouchableOpacity>

                </View>

                <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ color: "#121212", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Description</Text>
                    <Text style={{ marginTop: 5, color: "#393C47", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", }}>{specificDetails?.description}</Text>

                </View>
                {specificDetails?.serviceType !== 'chef' ?
                    <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 20 }}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pick up Location</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => setPickupLocation(value)}
                                value={pickupLocation}
                                placeholder="Pickup Location"
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Destination</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => setDestinationLocation(value)}
                                value={destinationLocation}
                                placeholder="Destination"
                                placeholderTextColor="#C7C7CD"
                            />
                        </View>
                    </View> : null}

                <View style={{ marginTop: 10 }}>
                    <PricingOptions
                        onSelect={handleSelect}
                        dailyPrice={specificDetails?.price}
                        monthlyPrice={specificDetails?.subscriptionChargesPerMonth}
                    />
                </View>



                <View style={styles.container}>
                    <Text style={styles.title}>Photos</Text>
                    <Swiper
                        style={styles.wrapper}
                        loop={false}
                        onIndexChanged={(index) => setActiveIndex(index)}
                        renderPagination={renderPagination}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                    >
                        {specifcadditionalImages.map((item, index) => (
                            <View style={styles.slide} key={index}>
                                <Image source={{ uri: item.uri }} resizeMode="contain" style={[styles.image, { width: viewportWidth * 0.9 }]} />
                            </View>
                        ))}
                    </Swiper>
                    <PaginationDots total={specifcadditionalImages?.length} activeIndex={activeIndex} />

                </View>

            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0 }}>
                <BookDatesButton onPress={handleBookDatesPress} text={'Book Dates'} padding={12} />
            </View>

            <Modal
                isVisible={isVisible}
                // onBackdropPress={() =>  navigation.goBack()}
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
                onBackButtonPress={() => {
                    navigation.goBack()
                }}
                animationOut={'slideOutDown'}
                animationType={'slideInUp'}
            >
                <View style={{ flex: 1, }}>
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

                    <Animated.View
                        style={{
                            flex: 1,
                            top: touchCoordinates,
                            bottom: 0,
                        }}>
                        <View
                            onStartShouldSetResponder={() => true}
                            onResponderMove={e => {
                                touchCoordinates.setValue(e.nativeEvent.pageY - 30);
                            }}
                            onResponderRelease={e => {
                                if (e.nativeEvent.pageY > 500) {
                                    setIsVisible(false)
                                }
                                Animated.spring(touchCoordinates, {
                                    toValue: 0,
                                    delay: 50,
                                    useNativeDriver: false,
                                }).start();
                            }}
                        >
                            <View style={{
                                alignSelf: 'center',
                                backgroundColor: themevariable.Color_CCCCCC,
                                height: verticalScale(5),
                                width: horizontalScale(57),
                                borderRadius: moderateScale(20),
                                top: 80,
                                position: 'absolute',
                            }} />
                        </View>

                        <View style={{
                            flex: 1,
                            // borderRadius: moderateScale(10),
                            borderTopLeftRadius: moderateScale(10),
                            borderTopRightRadius: moderateScale(10),
                            backgroundColor: themevariable.Color_FFFFFF,
                            paddingHorizontal: horizontalScale(20),
                            paddingVertical: verticalScale(20),
                            width: "100%",
                            bottom: 0,
                            position: 'absolute',
                            // marginTop: 100,
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 2.54,
                            alignSelf: 'center',
                            // alignItems: 'center',
                            bottom: -20
                            //  top: 0
                        }}>
                            {specificDetails?.serviceType === 'chef' ?
                                <Text style={{ alignSelf: "center", color: "#333333", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Select Time Slot</Text>
                                :
                                <Text style={{ alignSelf: "center", marginTop: 10, color: "#333333", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Selected Locations</Text>
                            }
                            {/* <TouchableOpacity  style={{ flexDirection: "row", alignItems: "center", marginBottom: 40, marginTop: 10, padding: 10, borderRadius: 5, borderColor: '#CFD0D5', borderWidth: 1 }}>
                               
                             <ClockIcon />
                            </TouchableOpacity> */}
                            <View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{specificDetails?.serviceType === 'chef' ? 'Start Time' : 'Pick-Up Location'}</Text>
                                    {specificDetails?.serviceType === 'chef' ?
                                        <TouchableOpacity onPress={showStartDatePicker}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Pick A Start Time"
                                                placeholderTextColor="#C7C7CD"
                                                value={pickedStartTime}
                                                editable={false}
                                            />
                                        </TouchableOpacity>
                                        :
                                        <Text>{pickupLocation ? pickupLocation : 'Pickup Location not selected'}</Text>}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>{specificDetails?.serviceType === 'chef' ? 'End Time' : 'Destination'}</Text>
                                    {specificDetails?.serviceType === 'chef' ?

                                        <TouchableOpacity onPress={showEndDatePicker}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Pick An End Time"
                                                placeholderTextColor="#C7C7CD"
                                                value={pickedEndTime}
                                                editable={false}
                                            />
                                        </TouchableOpacity>
                                        :
                                        <Text> {destinationLocation ? destinationLocation : 'Destination not selected'}</Text>
                                    }
                                </View>


                                <DateTimePickerModal
                                    isVisible={isStartDatePickerVisible}
                                    mode="time"
                                    onConfirm={handleStartConfirm}
                                    onCancel={hideStartDatePicker}
                                />

                                <DateTimePickerModal
                                    isVisible={isEndDatePickerVisible}
                                    mode="time"
                                    onConfirm={handleEndConfirm}
                                    onCancel={hideEndDatePicker}
                                />

                                {hoursDifference ? (
                                    <View style={styles.resultContainer}>
                                        <Text style={styles.resultText}>Duration: {hoursDifference}</Text>
                                    </View>
                                ) : null}
                            </View>

                            <BookDatesButton onPress={() => {
                                navigation.navigate("ViewHireCartDetails",
                                    {
                                        catId: specificDetails?._id,
                                        NumOfDays: numberOfDays,
                                        isDayOrMonthly: selectedOption,
                                        monthlyPrice: specificDetails?.subscriptionChargesPerMonth,
                                        startDate: selectedRange?.startDate,
                                        endDate: selectedRange?.endDate,
                                        startTime: pickedStartTime,
                                        endTime: pickedEndTime,
                                        durationIs: hoursDifference
                                    })
                                // if (productNav) {
                                //   callNavigation()
                                // } else {
                                //   setThankYouCardVisible(true);
                                // }
                            }}
                                text={'Submit'} padding={10} />
                        </View>


                    </Animated.View>

                </View>

            </Modal>

        </SafeAreaView>
    )
}

export default ViewHireDetails;

const styles = StyleSheet.create({
    infoBoxContainer: {
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between",
        marginTop: 15

    },
    verticalLine: {
        backgroundColor: "#E4E4E4",
        height: "80%",
        width: 1.5,
        alignSelf: "center"
    },
    dot: {
        backgroundColor: '#DCD7FD',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    activeDot: {
        backgroundColor: '#FF6347',
        width: 18,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: "20%",
        paddingHorizontal: 20, paddingVertical: 10
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 10,
        color: '#121212',
        fontFamily: "ManropeRegular",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        color: '#202020',
        marginBottom: 5,
        // textAlign:"left"
    },
    input: {
        height: 40,
        borderColor: '#D3D3D3',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
    },
    wrapper: {
        height: 200,
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        height: 200,
        borderRadius: 10,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    counterText: {
        color: '#fff',
        fontSize: 14,
    },
    buttonContainer: {
        borderRadius: 25,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    gradient: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})