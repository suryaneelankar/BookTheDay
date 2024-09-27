import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, ScrollView,Alert, TouchableOpacity, Dimensions, StyleSheet, Animated } from "react-native";
import Avatar from "../../components/NameAvatar";
import TruestedMarkGray from '../../assets/svgs/trustedMarkGray.svg';
// import VegNonVegIcon from '../../assets/svgs/vegNonveg.svg';
import { formatAmount } from "../../utils/GlobalFunctions";
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
// import SelectDateTimeScreen from "./SelectDateTime";
import ClockIcon from '../../assets/svgs/clock.svg';
import TruestedMarkOrange from '../../assets/svgs/trustedOrange.svg';
import ProductInfoCard from "../../components/ProductInfoCard";
import axios from "axios";
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import LeftArrow from '../../assets/svgs/leftarrowWhite.svg';
import moment from "moment";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";

const ViewCatDetails = ({ route }) => {

    const [selectedOption, setSelectedOption] = useState('daily');
    const [selectedPrice, setSelectedPrice] = useState(null);
    // const { width } = Dimensions.get('window').width;
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();
    const { catId } = route.params;
    const [specifcadditionalImages, setSpecificAdditionImages] = useState([]);
    const touchCoordinates = new Animated.Value(0);
    const [jewelleryDetails, setJewelleryDetails] = useState()
    const [isVisible, setIsVisible] = useState(false);
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedRange, setSelectedRange] = useState({
        startDate: '',
        endDate: '',
    });
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [getUserAuth, setGetUserAuth] = useState('');


    useEffect(() => {
        getCategoriesDetails();
    }, []);

    const getCategoriesDetails = async () => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getClothJewelsById/${catId}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            console.log("categories each ::::::::::", JSON.stringify(response?.data));
            setJewelleryDetails(response?.data)

            const photos = response?.data?.additionalImages.flat().map(image => ({
                uri: image.url.replace('localhost', LocalHostUrl),  // Replace 'localhost' with '192.168.1.8'
            }));
            setSpecificAdditionImages(photos);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

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
        }
      };
    // const onDayPress = (day) => {
    //     const { startDate, endDate } = selectedRange;

    //     // If start date is not set or both dates are set, set the start date
    //     if (!startDate || (startDate && endDate)) {
    //         setSelectedRange({ startDate: day.dateString, endDate: '' });
    //     } else if (startDate && !endDate) {
    //         // Ensure the end date is after the start date
    //         if (moment(day.dateString).isAfter(moment(startDate))) {
    //             setSelectedRange({ startDate, endDate: day.dateString });
    //             const days = moment(day.dateString).diff(moment(startDate), 'days') + 1; // Include both start and end dates
    //             setNumberOfDays(days);
    //         } else {
    //             Alert.alert('Invalid date selection', 'End date must be after start date.');
    //         }
    //     }
    // };

    console.log("numofDAYS IS::::::::::", numberOfDays)
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

    const handleSelect = (option, price) => {
        console.log("SELECTED PRIVE TAG::::::", option, price)
        setSelectedOption(option);
        setSelectedPrice(price);
    };

    const handleBookDatesPress = () => {
        setIsVisible(true)
        //  navigation.navigate('SelectDateTime',{productNav: true})
    };


    return (
        <SafeAreaView style={{flex:1}}>
            <ScrollView style={{ marginBottom: '15%' }}>
                <View style={{ backgroundColor: "white", }}>

                    <Swiper
                        style={styles.wrapper}
                        loop={false}
                        onIndexChanged={(index) => setActiveIndex(index)}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                    >
                        {specifcadditionalImages.map((item, index) => (
                            <View style={styles.slide} key={index}>
                                <FastImage resizeMode='contain' source={{ uri: item?.uri,
                                    headers:{Authorization : `Bearer ${getUserAuth}`}
                                 }} style={[styles.image, { width: '90%' }]} />
                            </View>
                        ))}
                    </Swiper>

                    <View style={{ marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: "#100D25", fontSize: 20, fontWeight: "700", fontFamily: "ManropeRegular", }}>{jewelleryDetails?.productName}</Text>
                        <Text style={{ color: "#100D25", fontSize: 18, fontWeight: "700", fontFamily: "ManropeRegular", }}>{formatAmount(jewelleryDetails?.rentPricePerDay)}</Text>
                    </View>

                    <View style={{ marginBottom: 20, marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: "#9095A6", fontSize: 12, fontWeight: "500", fontFamily: "ManropeRegular", }}>Size : (M) {jewelleryDetails?.professionalImage?.size} cm</Text>

                        <View style={{ flexDirection: "row", backgroundColor: "#FFF8F0", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}>
                            <TruestedMarkOrange />
                            <Text style={{ marginLeft: 5, color: "#FD813B", fontSize: 11, fontWeight: "800", fontFamily: "ManropeRegular", }}>Trusted Lender</Text>
                        </View>

                    </View>

                </View>
                <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ color: "#121212", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Description</Text>

                    <Text style={{ marginBottom: 20, marginTop: 5, color: "#393C47", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", }}>{jewelleryDetails?.description}</Text>
                    <ProductInfoCard />
                </View>
                <View style={{ marginTop: 10, marginBottom: 20 }}>
                    <PricingOptions
                        onSelect={handleSelect}
                        dailyPrice={jewelleryDetails?.rentPricePerDay}
                        // monthlyPrice={jewelleryDetails?.rentPricePerMonth}
                    />
                </View>


                {/* <BookDatesButton onPress={handleBookDatesPress} width={25} text={'Book Dates'} padding={12} /> */}
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
                    {/* <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        headerStyle={{ backgroundColor: "#FDEEBC" }}
                        // customHeaderTitle={}
                        markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#ED5065' } }}
                        theme={{
                            arrowColor: 'black',
                            todayTextColor: '#ED5065',
                            selectedDayBackgroundColor: '#FFC107',
                        }}
                        style={{ marginTop: 20, marginHorizontal: 25, borderRadius: 10 }}
                    /> */}

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
                            alignItems: 'center',
                            bottom: -20
                            //  top: 0
                        }}>
                            {/* <Text style={{ color: "#333333", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Select Time Slot</Text>
                            <Text style={{ marginTop: 10, color: "#333333", fontSize: 16, fontWeight: "500", fontFamily: "ManropeRegular", }}>Preferred Time</Text>

                            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 40, marginTop: 10, padding: 10, borderRadius: 5, borderColor: '#CFD0D5', borderWidth: 1 }}>
                                <Text style={{ width: "90%", color: "#ABABAB", fontSize: 14, fontWeight: "400", fontFamily: "ManropeRegular", }}>Pick A Time</Text>
                                <ClockIcon />
                            </TouchableOpacity> */}
                            <BookDatesButton onPress={() => {
                                navigation.navigate("BookingDetailsScreen",{catId: catId, NumOfDays: numberOfDays, isDayOrMonthly: selectedOption, monthlyPrice: jewelleryDetails?.rentPricePerMonth, startDate: selectedRange?.startDate, endDate: selectedRange?.endDate })
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

export default ViewCatDetails;

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
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 10
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
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    size: {
        fontSize: 14,
        color: '#7E7E7E',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    trustedLender: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF4EB',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    trustedLenderText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#FC823D',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 10,
        color: '#121212',
        fontFamily: "ManropeRegular",
    },
    wrapper: {
        height: Dimensions.get('window').height / 3.1,
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        height: '100%',
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