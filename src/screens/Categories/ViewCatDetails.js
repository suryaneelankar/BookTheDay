import React, { useState } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Animated } from "react-native";
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



const ViewCatDetails = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const { width: viewportWidth } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
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
         navigation.navigate('SelectDateTime',{productNav: true})
    };
    const touchCoordinates = new Animated.Value(0);

    return (
        <SafeAreaView>
            <ScrollView style={{marginBottom:'15%'}}>
            <View style={{ backgroundColor: "white", }}>

                     <Swiper
                        style={styles.wrapper}
                        loop={false}
                        onIndexChanged={(index) => setActiveIndex(index)}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                    >
                        {photos.map((item, index) => (
                            <View style={styles.slide} key={index}>
                                <Image source={{ uri: item.uri }} style={[styles.image, { width: viewportWidth * 0.9 }]} />
                            </View>
                        ))}
                    </Swiper>

                    <View style={{marginHorizontal:20, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                        <Text style={{color:"#100D25", fontSize:20, fontWeight:"700",fontFamily: "ManropeRegular",}}>GoldNecklace</Text>
                        <Text style={{color:"#100D25", fontSize:18, fontWeight:"700",fontFamily: "ManropeRegular",}}>{formatAmount('800')}</Text>
                    </View>

                    <View style={{marginBottom:20,marginHorizontal:20, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                        <Text style={{color:"#9095A6", fontSize:12, fontWeight:"500",fontFamily: "ManropeRegular",}}>Size : (M) 83cm</Text>
                        
                        <View style={{flexDirection:"row",backgroundColor:"#FFF8F0",paddingVertical:5,paddingHorizontal:10,borderRadius:10}}>
                        <TruestedMarkOrange/>
                        <Text style={{marginLeft:5,color:"#FD813B", fontSize:11, fontWeight:"800",fontFamily: "ManropeRegular",}}>Trusted Lender</Text>
                        </View>

                    </View>

                    </View>
                <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ color: "#121212", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Description</Text>
                    
                    <Text style={{marginBottom:20, marginTop: 5, color: "#393C47", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", }}>Our resort offers a perfect blend of tranquility, breathtaking beauty, and impeccable service. Located along the pristine white sands and azure waters will perfect for your holiday.</Text>
                   <ProductInfoCard/>
                    </View>
                <View style={{ marginTop: 10 ,marginBottom:20}}>
                    <PricingOptions
                        onSelect={handleSelect}
                        dailyPrice={'400'}
                        monthlyPrice={'8000'}
                    />
                </View>

               
                {/* <BookDatesButton onPress={handleBookDatesPress} width={25} text={'Book Dates'} padding={12} /> */}
            </ScrollView>
            <View style={{position:'absolute',bottom:0}}>
                <BookDatesButton onPress={handleBookDatesPress} text={'Book Dates'} padding={12} />
            </View>


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
        paddingHorizontal: 20, paddingVertical: 10
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
        height: Dimensions.get('window').height/3.1,
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