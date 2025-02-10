import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Button, Linking, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import BASE_URL from "../../../apiconfig";
import axios from "axios";
import { LocalHostUrl } from "../../../apiconfig";
import DollarIcon from "../../../assets/vendorIcons/dollarIcon.svg";
import Avatar from "../../../components/NameAvatar";
import RejectIcon from "../../../assets/vendorIcons/RejectIcon.svg";
import AcceptIcon from "../../../assets/vendorIcons/AcceptIcon.svg";
import ApprovedIcon from "../../../assets/vendorIcons/ApprovedIcon.svg";
import themevariable from "../../../utils/themevariable";
import LinearGradient from 'react-native-linear-gradient';
import { formatAmount } from "../../../utils/GlobalFunctions";
import { useSelector } from "react-redux";
import { getUserAuthToken, getVendorAuthToken } from "../../../utils/StoreAuthToken";
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actions-sheet';
import UserIcon from '../../../assets/vendorIcons/userIcon.svg';
import LocationIcon from '../../../assets/vendorIcons/locationIcon.svg';
import PhoneIcon from '../../../assets/vendorIcons/phoneIcon.svg';
import AdvPayIcon from '../../../assets/vendorIcons/advPayIcon.svg';
import FastImage from "react-native-fast-image";
import { verticalScale } from "../../../utils/scalingMetrics";
import ThumsUpIcon from '../../../assets/svgs/thumsupIcon.svg';

const RequestConfirmation = ({ navigation, route }) => {
    const { productId, catEndPoint } = route?.params;
    const [productDetails, setProductDetails] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [wholeBookingData, setWholeBookingData] = useState([]);
    const actionSheetRef = useRef(null);
    const [selectedItemDetails, setSelectedItemDetails] = useState([]);
    const [getVendorAuth, setGetVendorAuth] = useState('');
    const [loading, setLoading] = useState(false);

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    useEffect(() => {
        // getProductDetails();
        getProductBookingDetails();
    }, [])

    const getProductBookingDetails = async () => {
        setLoading(true);
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/${catEndPoint?.bookingDetailsEndpoint}/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const activeBookings = response?.data?.data.filter((booking) => booking.isActiveBooking === true);
            console.log('before resp::><>', JSON.stringify(activeBookings));

            groupByFilterData(activeBookings);
            // groupByFilterData(response?.data?.data);
            setLoading(false);
        } catch (error) {
            console.log("booking details error::::::::::", error);
            setLoading(false);
        }
    }

    // filter the data based on product ID, if same product got multiple req then filter those from whole data.
    const groupByFilterData = (data) => {
        var result = data.reduce((x, y) => {
            (x[y.productId] = x[y.productId] || []).push(y);
            return x;
        }, {});

        const finalResult = result[`${productId}`]?.map(item => {
            let catType = item?.catType;
            let productName = '';
            let numOfDays = 0;
            let vendorAddress = '';
            let bookingItem = undefined;
            let startDate = '';
            let endDate = '';
            let totalAmount = '';
            let bookingStatus = '';
            let bookingId = '';
            let advanceAmountPaid = 0;
            let userFullName = '';
            let userAddress = '';
            let userLatitude = '';
            let userLongitude = '';
            let securityDepositAmount = 0;
            let securityDepositAmountPaid = 0;

            if (catType === 'functionHalls') {
                productName = item?.functionHallName;
                vendorAddress = item?.address;
                numOfDays = item?.numOfDays;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
                bookingId = item?.bookingId;
                advanceAmountPaid = item?.advanceAmountPaid;
                userFullName = item?.userFullName;
                userAddress = item?.userDeliveryLocation;
                userLatitude = item?.userDeliveryLocationLatitude;
                userLongitude = item?.userDeliveryLocationLongitude;
                catType = catType
            }
            else if (catType === 'clothJewels') {
                productName = item?.productName;
                numOfDays = item?.numOfDays;
                vendorAddress = item?.address;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
                bookingId = item?.bookingId;
                advanceAmountPaid = item?.advanceAmountPaid;
                userFullName = item?.userFullName;
                userAddress = item?.userDeliveryLocation
                userLatitude = item?.userDeliveryLocationLatitude;
                userLongitude = item?.userDeliveryLocationLongitude;
                securityDepositAmount = item?.securityDepositAmount;
                securityDepositAmountPaid = item?.securityDepositAmountPaid;
                catType = catType;

            }
            else if (catType === 'caterings') {
                productName = item?.foodCateringName;
                vendorAddress = item?.address;
                bookingItem = item?.bookedFoodItems;
                startDate = item?.startDate;
                endDate = item?.endDate;
                totalAmount = item?.totalAmount;
                bookingStatus = item?.bookingStatus;
                bookingId = item?.bookingId;
                advanceAmountPaid = item?.advanceAmountPaid;
                userFullName = item?.userFullName;
                userAddress = item?.userDeliveryLocation;
                userLatitude = item?.userDeliveryLocationLatitude;
                userLongitude = item?.userDeliveryLocationLongitude;
                catType = catType
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
                bookingId: bookingId,
                advanceAmountPaid: advanceAmountPaid,
                userFullName: userFullName,
                userAddress: userAddress,
                userLatitude: userLatitude,
                userLongitude: userLongitude,
                securityDepositAmount: securityDepositAmount,
                securityDepositAmountPaid: securityDepositAmountPaid
            };
        });
        // setWholeBookingData(result[`${productId}`]);
        setWholeBookingData(finalResult);
        console.log('final res is ::>>', finalResult);
    }


    const getProductDetails = async () => {
        setLoading(true);
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/${catEndPoint?.productDetailsEndpoint}/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log("getClothJewelsById::::::::::", response?.data);
            setProductDetails(response?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("categories product details::::::::::", error);
        }
    }

    const convertUrlToIp = () => {
        console.log('wholeBookingData is::>>>>', wholeBookingData);

        // Check if wholeBookingData is an array and has at least one item
        if (Array.isArray(wholeBookingData) && wholeBookingData.length > 0) {
            const convertedImageUrl = wholeBookingData[0]?.productImage !== undefined
                ? wholeBookingData[0]?.productImage.replace('localhost', LocalHostUrl)
                : wholeBookingData[0]?.productImage;
            console.log('convertedImageUrl is::>>', convertedImageUrl);
            return convertedImageUrl;
        } else {
            return null;
        }
    }


    const RequestConfirmationAcceptOrReject = async (bookingStatus, userMobileNumber, bookingId) => {
        const updatedParams = {
            bookingId: bookingId,
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
            setIsVisible(true);
            getProductBookingDetails();
        } catch (error) {
            console.log("accept::::::::::", error);
        }
    }

    const callConfirmationWithStatus = (alertText, userMobileNumber, bookingId) => {
        if (alertText.includes('accept')) {
            RequestConfirmationAcceptOrReject('approved', userMobileNumber, bookingId);
        } else {
            RequestConfirmationAcceptOrReject('rejected', userMobileNumber, bookingId);
        }
    }

    const showAlert = (alertText, userMobileNumber, bookingId) => {
        Alert.alert(
            "Confirmation",
            alertText,
            [
                {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => callConfirmationWithStatus(alertText, userMobileNumber, bookingId) }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => {
        return (
            <View onPress={() => { }} style={{ borderRadius: 10, backgroundColor: item?.bookingStatus == 'rejected' || item?.bookingStatus == 'approved' ? 'white' : 'white', marginHorizontal: 15, marginTop: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center' }}
                    onPress={() => { actionSheetRef.current?.show(), setSelectedItemDetails(item) }}
                >
                    <Avatar widthDyn={61} heightDyn={61} borderRadiusDyn={8} name={item?.userFullName ? item?.userFullName : ''} imageUrl={''} token={getVendorAuth} />
                    <View style={{ marginLeft: 10, width: "50%" }}>
                        <Text style={{ marginTop: 5, color: "#101010", fontSize: 14, fontWeight: "500", fontFamily: "ManropeRegular", }}>{item?.productName}</Text>
                        <View style={{ marginTop: 5 }}>
                            <Text numberOfLines={1} style={{ color: "#1A1E25", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular" }}>{item?.userAddress}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <DollarIcon style={{}} />
                                <Text style={{ color: "#4A4A4A", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular", marginHorizontal: 5 }}>{formatAmount(item?.totalAmount)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Text style={{ color: '#6B779A', fontSize: 9, fontFamily: "ManropeRegular", fontWeight: "800", }}>{item?.startDate} - {item?.endDate}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => { actionSheetRef.current?.show(), setSelectedItemDetails(item) }}
                            style={{ bottom: verticalScale(25), left: verticalScale(20) }}>
                            <Text style={{ color: "#4A4A4A", textDecorationLine: "underline", fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular" }}>View Details</Text>
                        </TouchableOpacity>

                        {item?.bookingStatus == 'requested' ?
                            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                                <TouchableOpacity style={{ alignItems: 'center', borderRadius: 5, backgroundColor: "#FFF8F0", padding: 5, height: 30, flexDirection: 'row' }}
                                    onPress={() => { showAlert("Are you sure you want to accept the order?", item?.userMobileNumber, item?.bookingId) }}
                                >
                                    <AcceptIcon />
                                    <Text style={{ color: "#57A64F", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", }}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center', marginTop: 10, borderRadius: 5, backgroundColor: "#FFF8F0", padding: 5, height: 30, flexDirection: 'row' }}
                                    onPress={() => { showAlert("Are you sure you want to reject/cancel the order?", item?.userMobileNumber, item?.bookingId) }}
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
                                        item?.bookingStatus == 'approved' ?
                                            <ApprovedIcon /> :
                                            <AcceptIcon />
                                    }
                                    <Text numberOfLines={2} style={{ width: 70, height: 30, textAlignVertical: "center", color: item?.bookingStatus == 'rejected' ? "#EF0000" : item?.bookingStatus == 'approved' ? "orange" : "#57A64F", marginHorizontal: 5, fontSize: 12, fontWeight: "700", fontFamily: "ManropeRegular", textTransform: 'capitalize' }}>{item?.bookingStatus}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
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

        const renderBookedItems = ({ item }) => (
            <View style={styles.bookedItemContainer}>
                <Text style={styles.bookedItemTitle}>{item?.title}</Text>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.bookedItemLabel}>Combo Items:</Text>
                    <Text style={styles.bookedItemList}>{item?.items.join(', ')}</Text>
                </View>

                <View style={styles.bookedItemContent}>
                    <Text style={styles.bookedItemLabel}>Per Plate Cost:</Text>
                    <Text style={styles.bookedItemValue}>{formatAmount(item?.perPlateCost)}/-</Text>
                </View>

                <View style={styles.bookedItemContent}>
                    <Text style={styles.bookedItemLabel}>No. of Plates Ordered:</Text>
                    <Text style={styles.bookedItemValue}>{item?.numOfPlatesOrdered} Plates</Text>
                </View>
            </View>
        );

        const formatDate = (dateString) => {
            console.log("datestring", dateString)
            if (!dateString) return "Invalid Date"; // Handle undefined or empty date

            const date = new Date(dateString);
            if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats

            const day = date.getDate().toString().padStart(2, '0'); // Two-digit day
            const month = date.toLocaleString('default', { month: 'short' }); // Short month name
            const year = date.getFullYear().toString().slice(-2); // Last two digits of the year

            return `${day}-${month}-${year}`;
        };

        return (
            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent
                closeOnPressBack
                defaultOverlayOpacity={0.5}
                height={Dimensions.get("window").height - 64}
                containerStyle={styles.actionSheetContainer}
            // animationType=
            >
                <View style={styles.headerContainer}>
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%",alignSelf:"center",alignItems:"center" }}>
                            <Text style={styles.productNameText}>{selectedItemDetails?.productName}</Text>
                            <View style={[styles.bookingStatusContainer, {
                                backgroundColor:
                                    selectedItemDetails?.bookingStatus === "approved" ? "orange" :
                                        selectedItemDetails?.bookingStatus === "rejected" ? "red" :
                                            selectedItemDetails?.bookingStatus === "payment successful" ? "green" :
                                                "orange"
                            }]}>
                                <Text
                                    style={[
                                        styles.bookingStatusText,
                                        {
                                            textTransform: "capitalize",
                                            color: "white",
                                            textAlignVertical: "center",
                                            // width:"50%"
                                        }
                                    ]}
                                >
                                    {selectedItemDetails?.bookingStatus}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.productDateText}>
                            {/* {formatDate(selectedItemDetails?.startDate)} - {formatDate(selectedItemDetails?.endDate)} */}
                            {selectedItemDetails?.startDate} - {selectedItemDetails?.endDate}
                        </Text>
                    </View>

                </View>
                <View style={styles.divider} />

                <ScrollView>
                    <View style={styles.contentContainer}>
                        <Text style={styles.sectionTitle}>Customer Details</Text>
                        <View style={styles.detailsViewStyle}>
                            <UserIcon />
                            <Text style={styles.detailsStyle}>{selectedItemDetails?.userFullName}</Text>
                        </View>
                        {selectedItemDetails?.catType === 'clothJewels' ?
                        <> {(selectedItemDetails?.securityDepositAmountPaid > 0) && (
                            <TouchableOpacity style={styles.detailsViewStyle} onPress={() => openDialPad(selectedItemDetails?.userMobileNumber)}>
                                <PhoneIcon />
                                <Text style={[styles.phoneNumDetailStyle, { textDecorationLine: "underline" }]}>{selectedItemDetails?.userMobileNumber}</Text>
                            </TouchableOpacity>
                        )}
                        </> : <>
                        {(selectedItemDetails?.advanceAmountPaid !== 0 && selectedItemDetails?.advanceAmountPaid !== undefined) && (
                            <TouchableOpacity style={styles.detailsViewStyle} onPress={() => openDialPad(selectedItemDetails?.userMobileNumber)}>
                                <PhoneIcon />
                                <Text style={[styles.phoneNumDetailStyle, { textDecorationLine: "underline" }]}>{selectedItemDetails?.userMobileNumber}</Text>
                            </TouchableOpacity>
                        )}
                        </>}
                        {(selectedItemDetails?.advanceAmountPaid !== 0 && selectedItemDetails?.userAddress) && (
                            <TouchableOpacity style={[styles.detailsViewStyle, { alignItems: "flex-start" }]} onPress={() => openMap(selectedItemDetails?.userLatitude, selectedItemDetails?.userLongitude)}>
                                <LocationIcon />
                                <Text style={[styles.phoneNumDetailStyle, { textDecorationLine: "underline" }]}>{selectedItemDetails?.userAddress}</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.detailsViewStyle}>
                            <AdvPayIcon />
                            {selectedItemDetails?.securityDepositAmount ?
                            <Text style={styles.detailsStyle}>Security Deposit Paid: {formatAmount(selectedItemDetails?.securityDepositAmountPaid)}/-</Text>
                           : <Text style={styles.detailsStyle}>Advance Paid: {formatAmount(selectedItemDetails?.advanceAmountPaid)}/-</Text>
                            }
                           </View>
                        <View style={styles.detailsViewStyle}>
                            <AdvPayIcon />
                            <Text style={styles.detailsStyle}>Balance Payable: {formatAmount(selectedItemDetails?.totalAmount - (selectedItemDetails?.advanceAmountPaid !== undefined  ? selectedItemDetails?.advanceAmountPaid : selectedItemDetails?.securityDepositAmountPaid ))}/-</Text>
                        </View>

                        {selectedItemDetails?.bookingItem && (
                            <View>
                                <Text style={styles.detailsBookedText}>Booked Items</Text>
                                <FlatList
                                    data={selectedItemDetails?.bookingItem}
                                    renderItem={renderBookedItems}
                                    keyExtractor={(item) => item?._id}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.flatListContainer}
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>
            </ActionSheet>
        );
    };

    return (
        <View style={{ flex: 1 }}>

            {!loading ?
                <>
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
                            <View style={{ height: 120 }}>
                                <ThumsUpIcon />
                            </View>
                            <Text style={styles.title}>Thank You!</Text>
                            <Text style={styles.description}>Our team will update the information to the customer and will get back in an Hour</Text>
                            <LinearGradient colors={['#D2453B', '#A0153E']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.doneButton}>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <Text style={styles.doneButtonText}>Done</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                    </Modal>
                    <FastImage source={{
                        uri: convertUrlToIp(),
                        headers: { Authorization: `Bearer ${getVendorAuth}` }
                    }} style={{ width: '90%', alignSelf: 'center', height: 200, borderRadius: 10 }}
                    />
                    <Text style={{ color: '#121212', width: '90%', alignSelf: 'center', fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 16, marginTop: 10 }}>Product Availability</Text>

                    <Text style={{ color: '#969696', width: '90%', alignSelf: 'center', fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 16, marginTop: 10 }}>Product Details</Text>

                    {renderActionSheetWithProductDetais()}
                    <FlatList
                        data={wholeBookingData}
                        renderItem={renderItem}
                    />
                </>
                :
                <ActivityIndicator size="large" color="orange" />
            }

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
        fontWeight: '400',
        marginHorizontal: 5,
        color: "#000000",
        fontSize: 14,
    },
    phoneNumDetailStyle: {
        fontFamily: 'ManropeRegular',
        fontWeight: '400',
        marginHorizontal: 5,
        color: "#000000",
        fontSize: 14,
        textDecorationLine: "underline"
    },
    detailsBookedText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        marginHorizontal: 5,
        color: "#000000",
        fontSize: 16
    },
    detailsViewStyle: {
        flexDirection: 'row',
        padding: 10,
        right: 15,
        alignItems: "center"
    },
    sheetContent: {
        backgroundColor: '#fff',
        padding: 16,
        height: 250,
    },
    actionSheetContainer: {
        backgroundColor: 'white',
        paddingBottom: 20,
        height: Dimensions.get('window').height - 100,
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


    bookedItemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4, // For Android shadow
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    bookedItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
    },
    bookedItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    bookedItemLabel: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
        fontFamily: 'ManropeRegular',
    },
    bookedItemList: {
        fontSize: 14,
        color: 'green',
        fontWeight: '600',
        fontFamily: 'ManropeRegular',
    },
    bookedItemValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'ManropeRegular',
    },
    boldText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
    },



    actionSheetContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    productNameText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
        fontFamily: 'ManropeRegular',
    },
    productDateText: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
        fontFamily: 'ManropeRegular',
    },
    bookingStatusContainer: {
        borderRadius: 10,
        padding: 15,
        paddingVertical: 5,
        alignItems: 'center',
        alignSelf: "center",
    },
    bookingStatusText: {
        fontWeight: '700',
    },
    divider: {
        backgroundColor: '#dddddd',
        height: 1,
        width: '90%',
        alignSelf: 'center',
        // marginVertical: 20,
    },
    contentContainer: {
        padding: 20,
        width: "90%",
        alignSelf: "center",
    },
    sectionTitle: {
        color: 'black',
        fontFamily: 'ManropeRegular',
        fontWeight: '900',
        fontSize: 16,
    },
    detailsViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    detailsStyle: {
        color: '#000000',
        fontFamily: 'ManropeRegular',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 10,
    },
    phoneNumDetailStyle: {
        color: '#000000',
        fontFamily: 'ManropeRegular',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 10,
    },
    detailsBookedText: {
        color: '#000000',
        fontFamily: 'ManropeRegular',
        fontWeight: '900',
        fontSize: 16,
        marginTop: 20,
    },
    flatListContainer: {
        paddingVertical: 10,
    },
    bookedItemContainer: {
        backgroundColor: '#FFF8F0',
        borderRadius: 10,
        padding: 10,
        width: "100%",
        marginVertical: 5,
    },
    bookedItemTitle: {
        fontWeight: '700',
        color: 'black',
        fontSize: 14,
        fontFamily: 'ManropeRegular',
    },
    bookedItemSubtitle: {
        fontWeight: '500',
        color: "#000000",
        fontSize: 14,
        fontFamily: 'ManropeRegular',
    },
    bookedItemList: {
        fontWeight: '700',
        color: "#FE8235",
        fontSize: 12,
        fontFamily: 'ManropeRegular',
    },
    boldText: {
        fontWeight: '700',
        color: "#000000",
        fontSize: 14,
        fontFamily: 'ManropeRegular',
    },
});

export default RequestConfirmation;