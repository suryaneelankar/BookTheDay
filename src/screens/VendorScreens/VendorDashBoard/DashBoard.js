import React, { useState, useCallback } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, StyleSheet, FlatList, Switch } from "react-native";
import CustomAlert from '../../../components/CustomAlert';
import ProfileIcon from '../../../assets/vendorIcons/profileIcon.svg'
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import BASE_URL from "../../../apiconfig";
import { formatAmount, formatDate } from '../../../utils/GlobalFunctions';
import ArrowRight from '../../../assets/vendorIcons/arrowRight.svg';
import themevariable from "../../../utils/themevariable";
import ListedTimeIcon from '../../../assets/vendorIcons/listedTimeIcon.svg';
import { useSelector } from "react-redux";
import { getVendorAuthToken } from "../../../utils/StoreAuthToken";
import { useFocusEffect } from "@react-navigation/native";
import FastImage from 'react-native-fast-image';
import DeleteIcon from '../../../assets/svgs/deleteIcon.svg';
import CalendarIcon from '../../../assets/svgs/calendarOrangeIcon.svg';
import ServiceTime from '../../../assets/svgs/serviceTime.svg';
const moment = require('moment');
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const VendorDashBoardTab = ({ navigation }) => {

    // const [clothJewelBookingsData, setclothJewelBookingsData] = useState([]);
    const [vendorListing, setVendorListings] = useState([]);
    const [functionHallBookingsData, setFunctionHallBookingsData] = useState([]);
    // const [cateringsBookingsData, setCateringBookingsData] = useState([]);
    const [getVendorAuth, setGetVendorAuth] = useState('');
    const [totalEarnings, setTotalEarnings] = useState(0);
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const vendorLoggedInName = useSelector((state) => state.vendorLoggedInName);

    useFocusEffect(
        useCallback(() => {
            // Code to run when the screen is focused
            getVendorAuthTokenRes();
            getTotalVendorEarnings();
            // getVendorClothJewelBookings();
            getVendorFunctionHallBookings();
            // getVendorFoodCateringBookings();

            getVendorListings();

            // Cleanup function to run when the screen loses focus
            return () => {
                console.log('Screen is unfocused');
            };
        }, [])
    );

    const getVendorAuthTokenRes = async () => {
        const token = await getVendorAuthToken();
    };

    const getTotalVendorEarnings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        setGetVendorAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getPaymentsByVendorMobileNumber/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('response getTotalVendorEarnings is ::>>', response?.data);
            setTotalEarnings(response?.data?.totalEarnings);
        } catch (error) {
            console.log("getTotalVendorEarnings error::::::::::", error);
        }
    }

    const allCatProductDetailEndpoints = {
        // clothjewels: {
        //     productDetailsEndpoint: 'getClothJewelsById',
        //     bookingDetailsEndpoint: 'clothJewelBookingsGotForVendor',
        //     catType: 'clothjewels',
        //     confirmationEndpoint: 'clothJewelsbookingConfirmationFromVendor'
        // },
        // foodcatering: {
        //     productDetailsEndpoint: 'getCateringDetailsById',
        //     bookingDetailsEndpoint: 'foodCateringBookingsGotForVendor',
        //     catType: 'foodcatering',
        //     confirmationEndpoint: 'foodCateringBookingConfirmationFromVendor'
        // },
        functionhalls: {
            productDetailsEndpoint: 'getFunctionHallDetailsById',
            bookingDetailsEndpoint: 'functionHallBookingsGotForVendor',
            catType: 'functionhalls',
            confirmationEndpoint: 'functionHallsBookingConfirmationFromVendor'
        },
    }

    const getVendorListings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllVendorProductsAdded/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // console.log('response?.data vendor products added is::>>',response?.data);

            const result = response?.data?.posts.map(item => {
                const catType = item?.postId?.catType;
                let productName = '';
                let verificationStatus = '';

                if (catType === 'functionhall') {
                    productName = item?.postId?.functionHallName;
                    verificationStatus = item?.postId?.verificationStatus;
                }
                // else if (catType === 'clothjewels') {
                //     productName = item.postId.productName;
                // }
                // else if (catType === 'catering') {
                //     productName = item.postId.foodCateringName;
                // }
                //    console.log("listing data::::::", JSON.stringify(response?.data))
                return {
                    _id: response?.data?._id,
                    productName: productName,
                    productImage: item?.postId?.professionalImage?.url,
                    particularPostId: item?.postId?._id,
                    createdAt: response?.data?.createdAt,
                    available: item?.postId?.available,
                    catType: item?.postId?.catType,
                    verificationStatus: verificationStatus
                };
            });
            const filteredResult = result.filter((item) => item?.productName);
            setVendorListings(filteredResult);
            // console.log('result setVendorListings is ::>>',result);

        } catch (error) {
            console.log("listing error::::::::::", error);
        }
    }

    // const getVendorClothJewelBookings = async () => {
    //     const vendorMobileNumber = vendorLoggedInMobileNum;
    //     const token = await getVendorAuthToken();
    //     setGetVendorAuth(token);
    //     try {
    //         const response = await axios.get(`${BASE_URL}/clothJewelBookingsGotForVendor/${vendorMobileNumber}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         const activeBookings = response?.data?.data.filter((booking) => booking.isActiveBooking === true);
    //         const output = consolidateByProductId(activeBookings);
    //         // const output = consolidateByProductId(response?.data?.data);
    //         // console.log('output is ::>>', output);
    //         setclothJewelBookingsData(output)
    //     } catch (error) {
    //         console.log("clothJewelBookingsGotForVendor error::::::::::", error);
    //     }
    // }

    const getVendorFunctionHallBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/functionHallBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const activeBookings = response?.data?.data || []
            // console.log('activeBookings is ::>>', activeBookings);
            // const outputData = consolidateFunctionHallsDataByProductId(activeBookings);

            const today = new Date();
            const oneMonthAgo = moment().subtract(1, 'months').startOf('day').toDate();
            oneMonthAgo.setMonth(today.getMonth() - 1);

            const filteredData = activeBookings.filter(item => {
                const bookingDate = moment(item?.startDate, 'DD MMM YYYY').toDate();
                return bookingDate >= oneMonthAgo;
            });
            // console.log('filteredData is ::>>', filteredData);
            setFunctionHallBookingsData(filteredData);

        } catch (error) {
            console.log("functionHallBookingsGotForVendor error::::::::::", error);
        }
    }

    // const getVendorFoodCateringBookings = async () => {
    //     const vendorMobileNumber = vendorLoggedInMobileNum;
    //     const token = await getVendorAuthToken();
    //     try {
    //         const response = await axios.get(`${BASE_URL}/foodCateringBookingsGotForVendor/${vendorMobileNumber}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         // console.log('resp foodcateringBookings ::>>', response?.data?.data);
    //         const activeBookings = response?.data?.data.filter((booking) => booking.isActiveBooking === true);
    //         const outputData = consolidateFoodCateringDataByProductId(activeBookings);
    //         // const outputData = consolidateFoodCateringDataByProductId(response?.data?.data);
    //         setCateringBookingsData(outputData);

    //     } catch (error) {
    //         console.log("foodCateringBookingsGotForVendor error::::::::::", error);
    //     }
    // }

    const deleteTheVendorPost = async (vendorId, postId) => {
        const token = await getVendorAuthToken();
        // console.log('vendorId is:::',vendorId,postId);
        try {
            const response = await axios.delete(`${BASE_URL}/deleteVendorPost/${vendorId}/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response?.status == 200) {
                showSuccessAlert();
                getVendorListings();
            }
        } catch (error) {
            console.log("deleteVendorPost error::::::::::", error);
        }
    }

    const showConfirmationAlert = (vendorId, postId) => {
        CustomAlert.alert(
            "Confirmation",
            "Are you sure you want to delete the post?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => deleteTheVendorPost(vendorId, postId) }
            ],
            { cancelable: false }
        );
    };

    const showAvailabilityConfirmation = (catType, postId, toggleAvailable) => {
        CustomAlert.alert(
            "Confirmation",
            "Are you sure you want to make the change in product availability?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => toggleListingAvailability(catType, postId, toggleAvailable) }
            ],
            { cancelable: false }
        );
    };

    const toggleListingAvailability = async (catType, postId, toggleAvailable) => {
        const token = await getVendorAuthToken();
        // console.log('vendorId is:::',vendorId,postId);
        let payload = {
            id: postId,
            available: !toggleAvailable,
            modelType: catType
        }
        try {
            const response = await axios.patch(`${BASE_URL}/vendor/productRecord/availability`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response?.status == 200) {
                showSuccessToggleAlert();
                getVendorListings();
            }
        } catch (error) {
            console.log("vendor/productRecord/availability error::::::::::", error);
        }
    };

    const showSuccessToggleAlert = () => {
        CustomAlert.alert(
            "Confirmation",
            "Your Product has been Updated successfully.",
            [
                {
                    text: "Ok",
                    onPress: () => console.log("No Pressed"),
                    // style: "cancel"
                },
            ],
            { cancelable: false, type: 'success' }
        );
    }

    const showSuccessAlert = () => {
        CustomAlert.alert(
            "Confirmation",
            "Your post has been deleted successfully.",
            [
                {
                    text: "Ok",
                    onPress: () => console.log("No Pressed"),
                    // style: "cancel"
                },
            ],
            { cancelable: false, type: 'success' }
        );
    }

    const renderVendorList = ({ item }) => {
        if (!item) return null; // skip null placeholders

        return (
            <TouchableOpacity
                activeOpacity={0.88}
                style={[styles.listingCard, !item?.available && styles.listingCardInactive]}
                onPress={() => navigation.navigate('EditFunctionHall', { hallId: item?.particularPostId })} // Navigate to edit screen
            >
                <FastImage
                    style={styles.listingImage}
                    source={{ uri: item?.productImage }}
                    resizeMode={FastImage.resizeMode.cover}
                />

                <View style={styles.listingBody}>
                    <View style={styles.listingTitleRow}>
                        <Text style={styles.productName} numberOfLines={2}>
                            {capitalizeFirstLetters(item?.productName)}
                        </Text>
                        <FontAwesome
                            name="pencil"
                            size={24}
                            color="#A44A1F"
                        />
                    </View>

                    <View style={styles.listingMetaRow}>
                        <View style={styles.listedDateRow}>
                            <ListedTimeIcon width={16} height={16} />
                            <Text style={styles.price}>{formatDate(item?.createdAt)}</Text>
                        </View>
                        <Text
                            style={[
                                styles.productListedName,
                                item?.verificationStatus == 'approved' ? styles.listedBadge : styles.unlistedBadge,
                            ]}
                        >
                            {item?.verificationStatus == 'approved' ? 'Listed' : 'On Hold'}
                        </Text>
                    </View>

                    <View style={styles.listingActions}>
                        <View style={styles.availabilityRow}>
                            <Text style={styles.availabilityLabel}>Accept bookings</Text>
                            <Switch
                                trackColor={{ false: '#E5E7EB', true: '#F4C9AA' }}
                                thumbColor={item?.available ? '#C96A32' : '#9CA3AF'}
                                ios_backgroundColor="#E5E7EB"
                                onValueChange={() =>
                                    showAvailabilityConfirmation(item?.catType, item?.particularPostId, item?.available)
                                }
                                value={item?.available}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => showConfirmationAlert(item?._id, item?.particularPostId)}
                            accessibilityRole="button"
                            accessibilityLabel={`Delete ${item?.productName || 'listing'}`}
                        >
                            <DeleteIcon width={18} height={18} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    const renderFunctionHallItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('RequestConfirmation', {
                        productId: item?.productId,
                        catEndPoint: allCatProductDetailEndpoints?.functionhalls,
                        catType: "functionhalls",
                        bookingId: item?.bookingId
                    })
                }
                style={{
                    flexDirection: 'row',
                    backgroundColor:
                        item?.bookingStatus === 'requested' ? '#FFF9DB' : // darker beige for contrast
                            item?.bookingStatus === 'approved' ? '#FFF8F0' :
                                item?.bookingStatus === 'rejected' ? '#FDEDED' :
                                    item?.bookingStatus === 'cancelled' ? '#CCCCCC' :
                                        item?.bookingStatus === 'payment successful' ? '#E8F6E8' :
                                            '#FFF8F0',
                    borderRadius: 12,
                    // marginVertical: 8,
                    // marginHorizontal: 16,
                    padding: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 2,
                    alignItems: 'center',
                }}
            >
                {/* Left - Image */}
                <FastImage
                    source={{ uri: item?.professionalImage?.url }}
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: 10,
                        marginRight: 12,
                    }}
                />

                {/* Right - Info */}
                <View style={{ flex: 1 }}>
                    {/* Hall Name */}
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: '#1A1F36',
                            fontFamily: 'ManropeRegular',
                            marginBottom: 4,
                        }}
                        numberOfLines={1}
                    >
                        {item?.userFullName}
                    </Text>

                    {/* Booking Date & Time */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <CalendarIcon />
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#555',
                                fontFamily: 'ManropeRegular',
                                marginBottom: 4,
                            }}
                        >
                            {' '} {item?.startDate} {'    '}
                        </Text>
                        <ServiceTime />
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#555',
                                fontFamily: 'ManropeRegular',
                                marginBottom: 4,
                            }}
                        >
                            {' '} {item?.bookingTime}
                        </Text>
                    </View>


                    {/* Bottom Row - Status & Total */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#FD813B',
                                fontFamily: 'ManropeRegular',
                            }}
                        >
                            ₹ {item?.totalAmount?.toLocaleString()}
                        </Text>

                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: '500',
                                backgroundColor:
                                    item?.bookingStatus === 'requested' ? '#FFF9DB' : // darker beige for contrast
                                        item?.bookingStatus === 'approved' ? '#FFF8F0' :
                                            item?.bookingStatus === 'rejected' ? '#FDEDED' :
                                                item?.bookingStatus === 'cancelled' ? '#CCCCCC' :
                                                    item?.bookingStatus === 'payment successful' ? '#E8F6E8' :
                                                        '#FFF8F0',

                                color:
                                    item?.bookingStatus === 'requested' ? '#8A6E00' : // dark olive/brown
                                        item?.bookingStatus === 'approved' ? 'orange' :
                                            item?.bookingStatus === 'rejected' ? '#EF0000' :
                                                item?.bookingStatus === 'cancelled' ? 'grey' :
                                                    item?.bookingStatus === 'payment successful' ? '#1B5E20' : // dark green
                                                        '#57A64F',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 20,
                                overflow: 'hidden',
                                fontFamily: 'ManropeRegular',
                                textTransform: 'capitalize'
                            }}
                        >
                            {item?.bookingStatus}
                        </Text>

                    </View>

                </View>
                <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
            </TouchableOpacity>

        )
    }

    // const renderFoodCateringItem = ({ item }) => {
    //     const convertedImageUrl = item?.professionalImage?.url;

    //     return (
    //         <TouchableOpacity
    //             onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.foodcatering, catType: "catering", bookingId: item?.bookingId })}
    //             style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
    //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                 <FastImage source={{
    //                     uri: convertedImageUrl,
    //                     // headers: { Authorization: `Bearer ${getVendorAuth}` }
    //                 }} style={{ width: 60, height: 60 }}
    //                 />
    //                 <View style={{ margin: 10 }}>
    //                     <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{item?.productName} </Text>
    //                     <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.totalAmount)}</Text>
    //                 </View>
    //             </View>
    //             <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
    //                 <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
    //                 {item?.count == 1 ? <PersonOne /> :
    //                     <>
    //                         <PersonOne style={{ marginRight: -10 }} />
    //                         <PersonTwo style={{ marginRight: -10 }} />
    //                         <PersonThree />
    //                     </>}
    //                 <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
    //             </View>


    //         </TouchableOpacity>
    //     )
    // }

    function capitalizeFirstLetters(str) {
        // console.log('str is::>>', str)
        if (str) {
            return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }
    }

    // const renderItem = ({ item }) => {
    //     const convertedImageUrl = item?.professionalImage?.url;

    //     return (
    //         <TouchableOpacity
    //             onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.clothjewels, catType: "clothjewels", bookingId: item?.bookingId })}
    //             style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
    //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                 <FastImage source={{
    //                     uri: convertedImageUrl,
    //                     // headers: { Authorization: `Bearer ${getVendorAuth}` }
    //                 }} style={{ width: 60, height: 60 }}
    //                 />
    //                 <View style={{ margin: 10 }}>
    //                     <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{capitalizeFirstLetters(item?.productName)} </Text>
    //                     <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.perDayPrice)} / day</Text>
    //                 </View>
    //             </View>
    //             <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
    //                 <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
    //                 {item?.count == 1 ? <PersonOne /> :
    //                     <>
    //                         <PersonOne style={{ marginRight: -10 }} />
    //                         <PersonTwo style={{ marginRight: -10 }} />
    //                         <PersonThree />
    //                     </>}
    //                 <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
    //             </View>


    //         </TouchableOpacity>
    //     )
    // }

    // const consolidateByProductId = (data) => {
    //     const grouped = data.reduce((acc, item) => {
    //         if (!acc[item?.productId]) {
    //             acc[item?.productId] = {
    //                 productId: item?.productId,
    //                 productName: item?.productName,
    //                 perDayPrice: item?.perDayPrice,
    //                 professionalImage: item?.professionalImage,
    //                 count: 0
    //             };
    //         }
    //         acc[item?.productId].count += 1;
    //         return acc;
    //     }, {});

    //     return Object.values(grouped);
    // };

    // const consolidateFunctionHallsDataByProductId = (data) => {
    //     const grouped = data.reduce((acc, item) => {
    //         if (!acc[item?.productId]) {
    //             acc[item?.productId] = {
    //                 productId: item?.productId,
    //                 productName: item?.functionHallName,
    //                 totalAmount: item?.totalAmount,
    //                 professionalImage: item?.professionalImage,
    //                 count: 0
    //             };
    //         }
    //         acc[item?.productId].count += 1;
    //         return acc;
    //     }, {});

    //     return Object.values(grouped);
    // };

    // const consolidateFoodCateringDataByProductId = (data) => {
    //     const grouped = data.reduce((acc, item) => {
    //         if (!acc[item?.productId]) {
    //             acc[item?.productId] = {
    //                 productId: item?.productId,
    //                 productName: item?.foodCateringName,
    //                 totalAmount: item?.totalAmount,
    //                 professionalImage: item?.professionalImage,
    //                 count: 0
    //             };
    //         }
    //         acc[item?.productId].count += 1;
    //         return acc;
    //     }, {});

    //     return Object.values(grouped);
    // };

    const ItemSeparator = () => {
        return <View style={{ width: '90%', alignSelf: 'center', height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 }} />;
    };


    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFFBF8', '#FFF7F2', '#FFFFFF']} style={styles.screenGradient}>

                <View style={styles.header}>
                    <View style={styles.profileRow}>
                        {/* <View style={styles.profileIconWrap}>
                            <ProfileIcon width={42} height={42} />
                        </View> */}
                        <View style={styles.profileTextWrap}>
                            <Text style={styles.greeting} numberOfLines={1}>Hi, {vendorLoggedInName}</Text>
                            <Text style={styles.mobileNumber}>+91 {vendorLoggedInMobileNum}</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.myListingsButton}
                            onPress={() =>
                                navigation.navigate(
                                    'VendorVenueListings',
                                )
                            }
                            accessibilityRole="button"
                            accessibilityLabel="Open my venue listings"
                        >
                            <View style={styles.listingsIconWrap}>
                                <Ionicons
                                    name="business-outline"
                                    size={20}
                                    color="#A44A1F"
                                />
                            </View>

                            <Text style={styles.myListingsText}>
                                My Listings
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')}>
                        <ProfileIcon />
                    </TouchableOpacity> */}
                </View>

                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FFF4EB', '#FCE3D2']} style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>TOTAL EARNINGS</Text>
                            <Text style={styles.earningsValue} numberOfLines={1} adjustsFontSizeToFit>{formatAmount(totalEarnings || 0)}</Text>
                            <Text style={styles.summaryHint}>From completed bookings</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={[styles.summaryItem, styles.listingSummaryItem]}>
                            <Text style={styles.summaryLabel}>ACTIVE LISTINGS</Text>
                            <Text style={styles.listingCount}>{vendorListing?.length || 0}</Text>
                            <Text style={styles.summaryHint}>Venue listings</Text>
                        </View>
                    </View>
                </LinearGradient>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {functionHallBookingsData?.length ?
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Recent requests</Text>
                                <Text style={styles.sectionSubtitle}>Review and respond to customers</Text>
                            </View>
                            <View style={styles.countBadge}>
                                <Text style={styles.countBadgeText}>{functionHallBookingsData.length}</Text>
                            </View>
                        </View>
                        : null}
                    <View >
                        {/* {clothJewelBookingsData?.length ?
                            <>
                                <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Cloth/Jewel Bookings</Text>
                                <FlatList
                                    data={clothJewelBookingsData}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                    ItemSeparatorComponent={ItemSeparator}
                                />
                            </>
                            : null} */}

                        {functionHallBookingsData?.length ?
                            <>
                                <FlatList
                                    data={functionHallBookingsData}
                                    renderItem={renderFunctionHallItem}
                                    scrollEnabled={false}
                                    keyExtractor={(item, index) => String(item?.bookingId || item?._id || index)}
                                    contentContainerStyle={styles.bookingList}
                                    ItemSeparatorComponent={ItemSeparator}
                                />
                            </>
                            : null}

                        {/* {cateringsBookingsData?.length ?
                            <>
                                <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Food Catering Bookings</Text>
                                <FlatList
                                    data={cateringsBookingsData}
                                    renderItem={renderFoodCateringItem}
                                    contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                    ItemSeparatorComponent={ItemSeparator}
                                />
                            </>
                            : null} */}
                    </View>
                    {vendorListing?.length > 0 ?
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Your listings</Text>
                                <Text style={styles.sectionSubtitle}>Manage availability and venue details</Text>
                            </View>
                            <View style={styles.countBadge}>
                                <Text style={styles.countBadgeText}>{vendorListing.length}</Text>
                            </View>
                        </View>
                        : <View style={styles.suggestionBox}>
                            <Text style={styles.emptyIcon}>＋</Text>
                            <Text style={styles.suggestionTitle}>Add your first listing</Text>
                            <Text style={styles.suggestionText}>
                                Publish your venue and start receiving booking requests from BookTheDay customers.
                            </Text>
                            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('VendorHome')}>
                                <Text style={styles.ctaButtonText}>Add Listing</Text>
                            </TouchableOpacity>
                        </View>}
                    <FlatList
                        data={vendorListing}
                        renderItem={renderVendorList}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => String(item?.particularPostId || index)}
                        contentContainerStyle={styles.listingList}
                    // numColumns={2}
                    />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFBF8',
    },
    screenGradient: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderBottomWidth: 1,
        borderBottomColor: '#F4EAE3',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileIconWrap: {
        // width: 50,
        // height: 50,
        // borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#FFF2E8',
        // borderWidth: 1,
        // borderColor: '#F4D6C2',
        marginRight: 12,
    },
    myListingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#EACDBB',
        borderRadius: 18,
        backgroundColor: '#FFF8F3',
    },

    listingsIconWrap: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: '#FCE9DC',
    },

    myListingsText: {
        marginLeft: 6,
        color: '#713716',
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
    },
    profileTextWrap: {
        flex: 1,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D211B',
        fontFamily: 'PoppinsRegular',
        textTransform: 'capitalize',
    },
    mobileNumber: {
        marginTop: 1,
        fontSize: 12,
        fontFamily: 'ManropeRegular',
        color: '#806C61',
    },
    summaryCard: {
        width: '90%',
        alignSelf: 'center',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginTop: 18,
        borderWidth: 1,
        borderColor: '#F1CFB7',
        shadowColor: '#7A3E1F',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 12,
        elevation: 3,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    summaryItem: {
        flex: 1.45,
        justifyContent: 'center',
    },
    listingSummaryItem: {
        flex: 0.8,
        alignItems: 'center',
    },
    summaryLabel: {
        color: '#8D6048',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
        fontFamily: 'ManropeRegular',
    },
    earningsValue: {
        marginTop: 4,
        color: '#33231B',
        fontSize: 28,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
    },
    listingCount: {
        marginTop: 4,
        color: '#33231B',
        fontSize: 28,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
    },
    summaryHint: {
        marginTop: 2,
        color: '#8A766B',
        fontSize: 10,
        fontFamily: 'ManropeRegular',
    },
    summaryDivider: {
        width: 1,
        marginHorizontal: 16,
        backgroundColor: '#E9C6AE',
    },
    scrollContent: {
        paddingTop: 8,
        paddingBottom: 110,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        color: '#2D211B',
        fontFamily: 'ManropeRegular',
        fontWeight: '800',
        fontSize: 17,
    },
    sectionSubtitle: {
        marginTop: 2,
        color: '#8A766B',
        fontFamily: 'ManropeRegular',
        fontSize: 11,
    },
    countBadge: {
        minWidth: 28,
        height: 28,
        paddingHorizontal: 8,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF0E5',
        borderWidth: 1,
        borderColor: '#F1D0B9',
    },
    countBadgeText: {
        color: '#A7552B',
        fontFamily: 'ManropeRegular',
        fontWeight: '800',
        fontSize: 12,
    },
    bookingList: {
        marginHorizontal: '5%',
        borderRadius: 15,
    },
    listingList: {
        paddingBottom: 8,
    },
    listingCard: {
        flexDirection: 'row',
        width: '90%',
        minHeight: 126,
        alignSelf: 'center',
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EFE3DB',
        shadowColor: '#5B3827',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 2,
    },
    listingCardInactive: {
        backgroundColor: '#FAFAFA',
        opacity: 0.72,
    },
    listingImage: {
        width: 104,
        height: 106,
        borderRadius: 12,
        backgroundColor: '#F3ECE7',
    },
    listingBody: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    listingTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    listingMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    listedDateRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 6,
    },
    listingActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#F4ECE7',
    },
    availabilityRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    availabilityLabel: {
        color: '#6F5C52',
        fontFamily: 'ManropeRegular',
        fontSize: 11,
    },
    deleteButton: {
        width: 34,
        height: 34,
        marginLeft: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF4F4',
        borderWidth: 1,
        borderColor: '#F2DADA',
    },
    productContainer: {

    },
    productText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        fontSize: 18,
        color: themevariable.Color_202020
    },
    productImage: {
        alignSelf: 'center',
        borderRadius: 10,
        // width: 150,
        // height: 150,
        backgroundColor: 'red'
    },
    productName: {
        fontFamily: 'ManropeRegular',
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '700',
        color: '#2D211B',
        flex: 1,
        marginRight: 8,
    },
    productListedName: {
        fontFamily: 'ManropeRegular',
        fontSize: 10,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: 'hidden',
    },
    listedBadge: {
        color: '#347447',
        backgroundColor: '#E9F5EC',
    },
    unlistedBadge: {
        color: '#A94A4A',
        backgroundColor: '#FBEAEA',
    },
    price: {
        fontWeight: '400',
        fontSize: 10,
        fontFamily: 'ManropeRegular',
        color: '#806C61',
        marginLeft: 5,
    },
    suggestionBox: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#FFF8F3',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#EFDACB',
        padding: 22,
        marginTop: 20,
        alignItems: 'center',
    },
    emptyIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#B75D2F',
        backgroundColor: '#FFEBDD',
        fontSize: 25,
        overflow: 'hidden',
        marginBottom: 10,
    },
    suggestionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#33231B',
        fontFamily: 'ManropeRegular',
        marginBottom: 8,
    },
    suggestionText: {
        fontSize: 13,
        lineHeight: 19,
        color: '#766359',
        fontFamily: 'ManropeRegular',
        textAlign: 'center',
        marginBottom: 16,
    },
    ctaButton: {
        backgroundColor: '#B95F31',
        paddingVertical: 11,
        paddingHorizontal: 26,
        borderRadius: 12,
    },
    ctaButtonText: {
        color: '#FFF',
        fontFamily: 'ManropeRegular',
        fontWeight: '800',
        fontSize: 14,
    },

})

export default VendorDashBoardTab;