import React, { useState,useEffect } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Animated } from "react-native";
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


const ViewHireDetails = ({route}) => {
    const {Catid} = route.params;
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [specificDetails, setSpecificDetails] = useState('');

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
      
        const getSpecificDetails = async() =>{
          try {
            const response = await axios.get(`${BASE_URL}/getDriverChef/${Catid}`);
            console.log("specifi RESPONSE::::;;;;", JSON.stringify(response?.data))
            setSpecificDetails(response?.data);

            const photos = response?.data?.additionalImages.flat().map(image => ({
                uri: image.url.replace('localhost', LocalHostUrl),  // Replace 'localhost' with '192.168.1.8'
              }));
            const updateImage = response?.data?.professionalImage?.url;
             setSpecificAdditionImages(photos);

             const updatedImgUrl = updateImage  ? updateImage.replace('localhost', LocalHostUrl) : updateImage;
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

    const handleBookDatesPress = () => {
        // setIsVisible(true)
        navigation.navigate('SelectDateTime',{productNav: false})
    };
    const touchCoordinates = new Animated.Value(0);

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
            <View style={{position:'absolute',bottom:0}}>
                <BookDatesButton onPress={handleBookDatesPress} text={'Book Dates'} padding={12} />
            </View>

            {/* <Modal
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                backdropOpacity={0.9}
                backdropColor={themevariable.Color_000000}
                hideModalContentWhileAnimating={true}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                animationInTiming={500}
                style={{
                    flex: 1,
                    width:"100%",
                    alignSelf:"center"
                    // top: 20,
                    // margin: 0,
                }}
                onBackButtonPress={() => {
                    setIsVisible(false)
                }}
                animationOut={'slideOutDown'}
                animationType={'slideInUp'}
            >
                <View style={{ flex: 1,  }}>
                    <Text style={{ alignSelf: "center", color: "#FFFFFF", fontSize: 20, marginBottom: 20, fontWeight: "800", fontFamily: "ManropeRegular", }}>Select Date & Time</Text>

                    <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        headerStyle={{backgroundColor:"#FDEEBC"}}
                        // customHeaderTitle={}
                        markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#ED5065' } }}
                        theme={{
                            arrowColor: 'black',
                            todayTextColor: '#ED5065',
                            selectedDayBackgroundColor: '#FFC107',
                        }}
                        style={{ marginTop: 20 ,marginHorizontal:25,borderRadius:10}}
                    />

                    <Animated.View
                        style={{
                            flex: 1,
                            top: touchCoordinates,
                            bottom:0
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
                            style={{bottom:0}}>
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
                            marginTop: 100,
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.17,
                            shadowRadius: 2.54,
                            bottom:0,top:0
                        }}>
                            <Text style={{color:"#333333",fontSize:16, fontWeight:"700",fontFamily: "ManropeRegular",}}>Select Time Slot</Text>
                          <Text style={{marginTop:10,color:"#333333",fontSize:16, fontWeight:"500",fontFamily: "ManropeRegular",}}>Preferred Time</Text>
                         
                         <View>
                            <TouchableOpacity style={{flexDirection:"row",alignItems:"center",marginBottom:40,marginTop:10,padding:10,borderRadius:5,borderColor:'#CFD0D5', borderWidth:1}}>
                              <Text style={{width:"90%",color:"#ABABAB",fontSize:14, fontWeight:"400",fontFamily: "ManropeRegular",}}>Pick A Time</Text>
                             <ClockIcon/>
                            </TouchableOpacity>
                         </View>
                          <BookDatesButton onPress={() => setThankYouCardVisible(true)} width={0} text={'Submit'} padding={15}/>
                        </View>


                    </Animated.View>

                </View>

            </Modal> */}

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
        marginBottom: 20,
        paddingHorizontal: 20, paddingVertical: 10
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 10,
        color: '#121212',
        fontFamily: "ManropeRegular",
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