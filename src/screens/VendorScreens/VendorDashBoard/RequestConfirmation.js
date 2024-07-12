import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert, FlatList } from 'react-native';
import BASE_URL from "../../../apiconfig";
import axios from "axios";
import { LocalHostUrl } from "../../../apiconfig";
import DollarIcon from "../../../assets/vendorIcons/dollarIcon.svg";
import RupeeIcon from "../../../assets/vendorIcons/rupeeIcon.svg";
import Avatar from "../../../components/NameAvatar";
import RejectIcon from "../../../assets/vendorIcons/RejectIcon.svg";
import AcceptIcon from "../../../assets/vendorIcons/AcceptIcon.svg";
import themevariable from "../../../utils/themevariable";
import LinearGradient from 'react-native-linear-gradient';
import { formatAmount } from "../../../utils/GlobalFunctions";

const RequestConfirmation = ({ navigation, route }) => {
    const { productId } = route?.params;
    const [productDetails, setProductDetails] = useState([]);
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [wholeBookingData, setWholeBookingData] = useState([]);

    useEffect(() => {
        getProductDetails();
        getVendorClothJewelBookings();
    }, [])

    const getVendorClothJewelBookings = async () => {
        const vendorMobileNumber = "8297735285"
        try {
            const response = await axios.get(`${BASE_URL}/clothJewelBookingsGotForVendor/${vendorMobileNumber}`);
            groupByFilterData(response?.data?.data);
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const groupByFilterData = (data) => {
        var result = data.reduce((x, y) => {
            (x[y.productId] = x[y.productId] || []).push(y);
            return x;
        }, {});
        setWholeBookingData(result[`${productId}`]);
        console.log('final res is ::>>', result[`${productId}`]);
    }


    const getProductDetails = async () => {
        console.log('productId is ::>>', productId)
        try {
            const response = await axios.get(`${BASE_URL}/getClothJewelsById/${productId}`);
            // console.log("getClothJewelsById::::::::::", response?.data);
            setProductDetails(response?.data)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const convertUrlToIp = () => {
        const convertedImageUrl = productDetails?.professionalImage?.url !== undefined ? productDetails?.professionalImage?.url.replace('localhost', LocalHostUrl) : productDetails?.professionalImage?.url;
        return convertedImageUrl;
    }

    const renderModal = () => {
        return (
            <Modal
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
                }}
                onBackButtonPress={() => {
                    setIsVisible(false)
                }}
                animationOut={'slideOutDown'}
                animationType={'slideInUp'}
            >
                <View style={styles.Thankcontainer}>
                    <LinearGradient colors={['#D2453B', '#A0153E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: "55%", padding: 4, }}>
                        {/* <View style={{borderWidth:4, width:"50%", }}/> */}
                    </LinearGradient>

                    <View style={styles.iconContainer}>
                        <View style={styles.iconBackground}>
                            {/* <Image source={{ uri: 'thumbs_up_icon_url' }} style={styles.icon} /> */}

                        </View>
                    </View>
                    <Text style={styles.title}>Thank You!</Text>
                    <Text style={styles.description}>Our team will deliver the update to you in less than 2 hours</Text>
                    <LinearGradient colors={['#D2453B', '#A0153E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.doneButton}>
                        <TouchableOpacity onPress={() => setIsVisible(false)}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <TouchableOpacity>
                        <Text style={styles.trackProgressText}>Track your Booking Progress</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
        )
    }

    const RequestConfirmationAcceptOrReject = async (bookingStatus) => {
        const updatedParams = {
            productId: productId,
            accepted: bookingStatus
        }
        console.log('updatedParams is::>>',updatedParams);
        try {
            const response = await axios.patch(`${BASE_URL}/clothJewelsbookingConfirmationFromVendor`,updatedParams);
            console.log("accept confirm response::::::::::", response?.data);
        } catch (error) {
            console.log("accept::::::::::", error);
        }
    }

    const callConfirmationWithStatus = (alertText) => {
        if (alertText.includes('accept')) {
            RequestConfirmationAcceptOrReject(true)
        } else {
            RequestConfirmationAcceptOrReject(false);
        }
    }

    const showAlert = (alertText) => {
        Alert.alert(
            "Confirmation",
            alertText,
            [
                {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => callConfirmationWithStatus(alertText) }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => {
        return (
            <View onPress={() => { }} style={{ borderRadius: 10, backgroundColor: "white", marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Avatar widthDyn={61} heightDyn={61} borderRadiusDyn={8} name={'Surya Neelankar'} imageUrl={''} />
                    <View style={{ marginLeft: 10, width: "50%" }}>
                        <Text style={{ marginTop: 5, color: "#101010", fontSize: 14, fontWeight: "500", fontFamily: "ManropeRegular", }}>Surya Neelankar</Text>
                        <View style={{ marginTop: 5 }}>
                            <Text style={{ color: "#1A1E25", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular" }}>Banglore, KA</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <DollarIcon style={{}} />
                                <Text style={{ color: "#4A4A4A", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", marginHorizontal: 5 }}>{formatAmount(item?.totalAmount)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Text style={{ color: '#6B779A', fontSize: 9, fontFamily: "ManropeRegular", fontWeight: "800", }}>{item?.startDate} - {item?.endDate}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, backgroundColor: "#FFF8F0", padding: 5, height: 30, flexDirection: 'row' }}
                            onPress={() => { showAlert("Are you sure you want to accept the order?") }}
                        >
                            <AcceptIcon />
                            <Text style={{ color: "#57A64F", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", }}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center', marginTop: 10, borderRadius: 5, backgroundColor: "#FFF8F0", padding: 5, height: 30, flexDirection: 'row' }}
                            onPress={() => { showAlert("Are you sure you want to reject/cancel the order?") }}
                        >
                            <RejectIcon />
                            <Text style={{ color: "#EF0000", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", }}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </View>
        )
    }


    return (
        <View style={{ flex: 1 }}>
            <Image style={{ width: '90%', alignSelf: 'center', height: 200, borderRadius: 10 }} source={{ uri: convertUrlToIp() }} resizeMode="contain" />
            <Text style={{ color: '#121212', width: '90%', alignSelf: 'center', fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 16, marginTop: 10 }}>Product Availability</Text>

            <Text style={{ color: '#969696', width: '90%', alignSelf: 'center', fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 16, marginTop: 10 }}>Product Details</Text>
            <FlatList
                data={wholeBookingData}
                renderItem={renderItem}
            />

            {/* {renderProductDetails()} */}
            {/* {renderModal()} */}


        </View>
    )
}

const styles = StyleSheet.create({
    Thankcontainer: {
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    iconContainer: {
        margin: 20
    },
    iconBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    icon: {
        width: 40,
        height: 40,
    },
    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    title: {
        fontSize: 27,
        fontWeight: '800',
        marginBottom: 10,
        color: "#333333",
        fontFamily: "ManropeRegular",
        marginTop: 20
    },
    subtitle: {
        fontSize: 14,
        color: '#FF730D',
        fontWeight: "500",
        fontFamily: "ManropeRegular",
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        color: '#677294',
        marginBottom: 20,
        fontWeight: "500",
        fontFamily: "ManropeRegular",
        marginHorizontal: 20
    },
    doneButton: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    doneButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    trackProgressText: {
        color: '#FF730D',
        textDecorationLine: 'underline',
        fontWeight: "400",
        fontFamily: "ManropeRegular",
        fontSize: 12,
        marginBottom: 30
    },

});

export default RequestConfirmation;