import React, { useState } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Avatar from "../../components/NameAvatar";
import TruestedMarkGray from '../../assets/svgs/trustedMarkGray.svg';
import VegNonVegIcon from '../../assets/svgs/vegNonveg.svg';
import { formatAmount } from "../../utils/GlobalFunctions";
import {HireDetails, PaginationDots } from "../../components/InfoBox";
import PricingOptions from "../../components/PriceOptions";
import Swiper from 'react-native-swiper';
import LinearGradient from "react-native-linear-gradient";
import BookDatesButton from "../../components/GradientButton";
import { useNavigation } from "@react-navigation/native";
import { moderateScale, verticalScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
import Modal from 'react-native-modal';


const ViewHireDetails = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const { width: viewportWidth } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation();
    const [isVisible,setIsVisible] = useState(false);


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
        setIsVisible(true)
        //  navigation.navigate('SelectDateTime')
      };

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 10, paddingVertical: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Avatar widthDyn={92} heightDyn={87} borderRadiusDyn={5} name={'Neelankar'} imageUrl={'https://t4.ftcdn.net/jpg/06/35/20/15/360_F_635201516_G2TFpFPoFA6utXYNgFlgPJGwU24mj6CJ.jpg'} />

                        <View style={{ marginLeft: 10, width: "58%" }}>
                            <Text style={{ marginTop: 5, color: "#333333", fontSize: 16, fontWeight: "500", fontFamily: "ManropeRegular", }}>Mrs. Srinivas</Text>
                            <Text style={{ color: "#939191", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", }}> South Indian | Meals</Text>
                            <View style={{ marginTop: 5, flexDirection: "row", backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center", paddingVertical: 2, borderRadius: 5, paddingHorizontal: 5, width: 57 }}>
                                <TruestedMarkGray style={{ marginHorizontal: 2 }} />
                                <Text style={{ color: '#6B779A', fontSize: 9, fontFamily: "ManropeRegular", fontWeight: "800" }}>Verified</Text>
                            </View>
                        </View>
                        <VegNonVegIcon />
                        {/* <Text style={{marginLeft:5,color:"#101010",fontSize:14, fontWeight:"800",fontFamily: "ManropeRegular",}}>{formatAmount('900')}<Text style={{color:"#101010",fontSize:14, fontWeight:"400",fontFamily: "ManropeRegular",}}> /hr</Text></Text> */}
                    </View>

                    <View style={styles.infoBoxContainer}>
                        <HireDetails
                            mainText="Experience"
                            subText="10+ years"
                        />
                        <View style={styles.verticalLine} />
                        <HireDetails
                            mainText="Events"
                            subText="900+"
                        />
                        <View style={styles.verticalLine} />
                        <HireDetails
                            mainText="Availability"
                            subText="All Days"
                        />
                    </View>

                    <TouchableOpacity style={{ backgroundColor: '#AF243E', borderRadius: 5, marginTop: 15, width: Dimensions.get('window').width / 1.3, alignSelf: "center", marginBottom: 10, alignItems: "center", paddingVertical: 8 }}>
                        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700", fontFamily: "ManropeRegular", }}>{formatAmount('900')}/month<Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800", fontFamily: "ManropeRegular", }}> | Subscribe</Text></Text>
                    </TouchableOpacity>

                </View>

                <View style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 15, paddingHorizontal: 20, paddingVertical: 20 }}>
                    <Text style={{ color: "#121212", fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular", }}>Description</Text>
                    <Text style={{ marginTop: 5, color: "#393C47", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", }}>Our resort offers a perfect blend of tranquility, breathtaking beauty, and impeccable service. Located along the pristine white sands and azure waters will perfect for your holiday.</Text>

                </View>
                <View style={{ marginTop: 10 }}>
                    <PricingOptions
                        onSelect={handleSelect}
                        dailyPrice={'400'}
                        monthlyPrice={'8000'}
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.title}>Photos</Text>
                    <Swiper
                        style={styles.wrapper}
                        loop={false}
                        onIndexChanged={(index) => setActiveIndex(index)}
                        renderPagination={renderPagination}
                        activeDotColor="#FD813B"
                        dotColor="#c4c4c4"
                    >
                        {photos.map((item, index) => (
                            <View style={styles.slide} key={index}>
                                <Image source={{ uri: item.uri }} style={[styles.image, { width: viewportWidth * 0.9 }]} />
                            </View>
                        ))}
                    </Swiper>
                    <PaginationDots total={photos.length} activeIndex={activeIndex} />

                </View>
                <BookDatesButton onPress={handleBookDatesPress} />    
        </ScrollView>

      <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      backdropOpacity={0.8}
      backdropColor={themevariable.Color_000000}
      hideModalContentWhileAnimating={true}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      animationInTiming={500}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        top:20
        // margin: 0,
      }}
      onBackButtonPress={() => {
        setIsVisible(false)
      }}
      animationOut={'slideOutDown'}
      animationType={'slideInUp'}>
        </Modal>

        <View style={{marginTop:20, backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',}}>
            <Text style={{color:"red",fontSize: 18,marginBottom: 20,}}>Select Date & Time</Text>
        </View>

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
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal:15,
        marginTop: 15,
        marginBottom:20,
        paddingHorizontal:20,paddingVertical:10
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 10,
        color:'#121212',
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