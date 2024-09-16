import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, FlatList, Button, Linking, ScrollView } from 'react-native';
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
import { useSelector } from "react-redux";
import { getUserAuthToken, getVendorAuthToken } from "../../../utils/StoreAuthToken";
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actions-sheet';
import Feather from 'react-native-vector-icons/Feather';
import UserIcon from '../../../assets/vendorIcons/userIcon.svg';
import LocationIcon from '../../../assets/vendorIcons/locationIcon.svg';
import PhoneIcon from '../../../assets/vendorIcons/phoneIcon.svg';
import AdvPayIcon from '../../../assets/vendorIcons/advPayIcon.svg';
import FastImage from "react-native-fast-image";

const RequestConfirmation = ({ navigation, route }) => {
    const { productId, catEndPoint } = route?.params;
    const [productDetails, setProductDetails] = useState([]);
    const [thankyouCardVisible, setThankYouCardVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [wholeBookingData, setWholeBookingData] = useState([]);
    const actionSheetRef = useRef(null);
    const [selectedItemDetails, setSelectedItemDetails] = useState([]);
    const [getVendorAuth, setGetVendorAuth] = useState('');

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    useEffect(() => {
        getProductDetails();
        getProductBookingDetails();
    }, [])

    const getProductBookingDetails = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/${catEndPoint?.bookingDetailsEndpoint}/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('before resp::><>', response?.data?.data);
            groupByFilterData(response?.data?.data);
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    // filter the data based on product ID, if same product got multiple req then filter those from whole data.
    const groupByFilterData = (data) => {
        var result = data.reduce((x, y) => {
            (x[y.productId] = x[y.productId] || []).push(y);
            return x;
        }, {});

        const finalResult = result[`${productId}`]?.map(item => {
            const catType = item?.catType;
            let productName = '';
            let numOfDays = 0;
            let vendorAddress = '';
            let bookingItem = undefined;
            let startDate = '';
            let endDate = '';
            let totalAmount = '';
            let bookingStatus = '';

            if (catType === 'functionHalls') {
                productName = item?.functionHallName;
                vendorAddress = item?.address;
                numOfDays = item?.numOfDays;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
            }
            else if (catType === 'tentHouses') {
                productName = item?.tentHouseName;
                vendorAddress = item?.address;
                numOfDays = item?.numOfDays;
                bookingItem = item?.bookingItems;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
            }
            else if (catType === 'clothJewels') {
                productName = item?.productName;
                numOfDays = item?.numOfDays;
                vendorAddress = item?.address;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
            }
            else if (catType === 'decorations') {
                productName = item?.eventOrganiserName;
                vendorAddress = item?.address;
                numOfDays = item?.numOfDays;
                bookingItem = item?.particularPackageData;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
            }
            else if (catType === 'caterings') {
                productName = item?.foodCateringName;
                vendorAddress = item?.address;
                bookingItem = item?.bookedFoodItems;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
            }

            return {
                // _id: data?._id,
                productName: productName,
                productImage: item?.professionalImage.url,
                createdAt: data?.createdAt,
                bookingStatus: bookingStatus,
                userMobileNumber: item?.userMobileNumber,
                numOfDays: numOfDays,
                vendorAddress: vendorAddress,
                bookingItem: bookingItem,
                startDate: startDate,
                endDate: endDate,
                totalAmount: totalAmount,

            };
        });
        // setWholeBookingData(result[`${productId}`]);
        setWholeBookingData(finalResult);
        console.log('final res is ::>>', finalResult);
    }


    const getProductDetails = async () => {
        console.log('productId is ::>>', productId);
        const token = await getUserAuthToken();

        try {
            const response = await axios.get(`${BASE_URL}/${catEndPoint?.productDetailsEndpoint}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("getClothJewelsById::::::::::", response?.data);
            setProductDetails(response?.data);
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const convertUrlToIp = () => {
        const convertedImageUrl = wholeBookingData[0]?.productImage !== undefined ? wholeBookingData[0]?.productImage.replace('localhost', LocalHostUrl) : wholeBookingData[0]?.productImage;
        console.log('convertedImageUrl is::>>', convertedImageUrl);
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

    const RequestConfirmationAcceptOrReject = async (bookingStatus, userMobileNumber) => {
        const updatedParams = {
            productId: productId,
            accepted: true,
            bookingStatus: bookingStatus,
            userMobileNumber: userMobileNumber
        }
        console.log('updatedParams is::>>', updatedParams);
        const token = await getVendorAuthToken();
        setGetVendorAuth(token);
        try {
            const response = await axios.patch(`${BASE_URL}/${catEndPoint?.confirmationEndpoint}`, updatedParams, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("accept confirm response::::::::::", response?.data);
            setIsVisible(true)
        } catch (error) {
            console.log("accept::::::::::", error);
        }
    }

    const callConfirmationWithStatus = (alertText, userMobileNumber) => {
        if (alertText.includes('accept')) {
            RequestConfirmationAcceptOrReject('approved', userMobileNumber)
        } else {
            RequestConfirmationAcceptOrReject('rejected', userMobileNumber);
        }
    }

    const showAlert = (alertText, userMobileNumber) => {
        Alert.alert(
            "Confirmation",
            alertText,
            [
                {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => callConfirmationWithStatus(alertText, userMobileNumber) }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => {


        return (
            <View onPress={() => { }} style={{ borderRadius: 10, backgroundColor: item?.bookingStatus == 'rejected' || item?.bookingStatus == 'approved' ? '#dddddd' : 'white', marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center' }}
                    onPress={() => { actionSheetRef.current?.show(), setSelectedItemDetails(item) }}
                >
                    <Avatar widthDyn={61} heightDyn={61} borderRadiusDyn={8} name={'Surya Neelankar'} imageUrl={''} />
                    <View style={{ marginLeft: 10, width: "50%" }}>
                        <Text style={{ marginTop: 5, color: "#101010", fontSize: 14, fontWeight: "500", fontFamily: "ManropeRegular", }}>{item?.productName}</Text>
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

                    {item?.bookingStatus == 'requested' ?
                        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, backgroundColor: "#FFF8F0", padding: 5, height: 30, flexDirection: 'row' }}
                                onPress={() => { showAlert("Are you sure you want to accept the order?", item?.userMobileNumber) }}
                            >
                                <AcceptIcon />
                                <Text style={{ color: "#57A64F", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", }}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: 'center', marginTop: 10, borderRadius: 5, backgroundColor: "#FFF8F0", padding: 5, height: 30, flexDirection: 'row' }}
                                onPress={() => { showAlert("Are you sure you want to reject/cancel the order?", item?.userMobileNumber) }}
                            >
                                <RejectIcon />
                                <Text style={{ color: "#EF0000", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", }}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, padding: 5, height: 30, flexDirection: 'row' }}
                                onPress={() => { showAlert("Are you sure you want to reject/cancel the order?", item?.userMobileNumber) }}
                                disabled={true}
                            >
                                {item?.bookingStatus == 'rejected' ?
                                    <RejectIcon /> :
                                    <AcceptIcon />
                                }
                                <Text style={{ color: item?.bookingStatus == 'rejected' ? "#EF0000" : "#57A64F", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", textTransform: 'capitalize' }}>{item?.bookingStatus}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {item?.bookingStatus == 'requested' ?
                        <Feather style={[styles.icon, { marginHorizontal: 5 }]} name='chevron-right' size={25} color={'black'} />
                        :
                        <></>}
                </TouchableOpacity>
            </View>
        )
    }

    const openDialPad = (number) => {
        if (Platform.OS === 'ios') {
            number = `telprompt:${number}`;
        }
        else {
            number = `tel:${number}`;
        }
        Linking.openURL(number);
    }


    const openMap = (lat, lon) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${lat},${lon}`, // Apple Maps for iOS
            android: `geo:0,0?q=${lat},${lon}` // Google Maps for Android
        });
        Linking.openURL(url);
    };


    const renderActionSheetWithProductDetais = () => {
        console.log('selectedItemDetails is::>>>', selectedItemDetails);
        return (
            <ActionSheet
                animated={false}
                ref={actionSheetRef}
                statusBarTranslucent
                closeOnPressBack={true}
                defaultOverlayOpacity={0.5}
                containerStyle={styles.actionSheetContainer}>
                <ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 15 }}>
                        <View>
                            <Text>{selectedItemDetails?.productName}</Text>
                            <Text>{selectedItemDetails?.startDate} - {selectedItemDetails?.endDate}</Text>
                        </View>
                        <View style={{ backgroundColor: '#FFF8F0', borderRadius: 10, padding: 5, width: 80, alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: '#FD813B', fontWeight: '700' }}>{selectedItemDetails?.bookingStatus}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#dddddd', height: 1, width: '80%', alignSelf: 'center', marginTop: 0 }} />
                    <View style={{ padding: 20, marginHorizontal: 38 }}>
                        <Text style={{ color: 'black', fontFamily: 'ManropeRegular', fontWeight: '900', fontSize: 16 }}>Other Details</Text>
                        <View style={styles.detailsViewStyle}>
                            <UserIcon />
                            <Text style={styles.detailsStyle}>Ashok Reddy</Text>
                        </View>
                        <TouchableOpacity style={styles.detailsViewStyle}
                            onPress={() => openDialPad('+91 9876543210')}
                        >
                            <PhoneIcon />
                            <Text style={styles.detailsStyle}>{selectedItemDetails?.userMobileNumber}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.detailsViewStyle} onPress={() => openMap(37.7749, -122.4194)}>
                            <LocationIcon />
                            <Text style={styles.detailsStyle}>#12, Bachupally, Hyderabad</Text>
                        </TouchableOpacity>
                        <View style={styles.detailsViewStyle}>
                            <AdvPayIcon />
                            <Text style={styles.detailsStyle}>Advance Paid: ₹ {selectedItemDetails?.advanceAmountPaid}/-</Text>
                        </View>
                        <View style={styles.detailsViewStyle}>
                            <AdvPayIcon />
                            <Text style={styles.detailsStyle}>Balance Payable: ₹ 4000/-</Text>
                        </View>

                        <View>
                            <Text >Booked Items</Text>
                            
                        </View>
                    </View>
                </ScrollView>
            </ActionSheet>
        )
    }


    return (
        <View style={{ flex: 1 }}>

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
            <FastImage source={{
                uri: convertUrlToIp(),
                headers: { Authorization: `Bearer ${getVendorAuth}` }
            }} style={{ width: '90%', alignSelf: 'center', height: 200, borderRadius: 10 }}
            />
            {/* <Image style={{ width: '90%', alignSelf: 'center', height: 200, borderRadius: 10 }} source={{ uri: convertUrlToIp() }} resizeMode="contain" /> */}
            <Text style={{ color: '#121212', width: '90%', alignSelf: 'center', fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 16, marginTop: 10 }}>Product Availability</Text>

            <Text style={{ color: '#969696', width: '90%', alignSelf: 'center', fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 16, marginTop: 10 }}>Product Details</Text>
            <Button title="Open Action Sheet" onPress={() => actionSheetRef.current?.show()} />

            {renderActionSheetWithProductDetais()}
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
    detailsStyle: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        marginHorizontal: 5
    },
    detailsViewStyle: {
        flexDirection: 'row',
        padding: 10,
        right: 15
    },
    sheetContent: {
        backgroundColor: '#fff',
        padding: 16,
        height: 250,
    },
    actionSheetContainer: {
        backgroundColor: 'white',
        paddingBottom: 20,
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