import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, Image, ScrollView, Alert, TouchableOpacity, Dimensions, StyleSheet, Animated, FlatList } from "react-native";
import ProfileIcon from '../../../assets/vendorIcons/profileIcon.svg'
import LinearGradient from "react-native-linear-gradient";
import shirtImg from '../../../assets/shirt.png';
import axios from "axios";
import BASE_URL from "../../../apiconfig";
import { LocalHostUrl } from "../../../apiconfig";
import { formatAmount, formatDate } from '../../../utils/GlobalFunctions';
import ArrowRight from '../../../assets/vendorIcons/arrowRight.svg';
import PersonOne from '../../../assets/vendorIcons/personOne.svg';
import PersonTwo from '../../../assets/vendorIcons/personTwo.svg';
import PersonThree from '../../../assets/vendorIcons/personThree.svg';
import themevariable from "../../../utils/themevariable";
import ListedTimeIcon from '../../../assets/vendorIcons/listedTimeIcon.svg';
import EditButton from '../../../assets/vendorIcons/editButton.svg';
import Avatar from "../../../components/NameAvatar";
import { useSelector } from "react-redux";
import { getVendorAuthToken } from "../../../utils/StoreAuthToken";
import { useFocusEffect } from "@react-navigation/native";
import FastImage from 'react-native-fast-image';

const VendorDashBoardTab = ({ navigation }) => {

    const [clothJewelBookingsData, setclothJewelBookingsData] = useState([]);
    const [vendorListing, setVendorListings] = useState([]);
    const [decorationsBookingsData, setDecorationsBookingsData] = useState([]);
    const [functionHallBookingsData, setFunctionHallBookingsData] = useState([]);
    const [tentHouseBookingsData, setTentHouseBookingsData] = useState([]);
    const [cateringsBookingsData, setCateringBookingsData] = useState([]);
    const [getVendorAuth, setGetVendorAuth] = useState('');

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    // console.log('vendorLoggedInMobileNum is ::>>', vendorLoggedInMobileNum);

    useFocusEffect(
        useCallback(() => {
            // Code to run when the screen is focused
            getVendorClothJewelBookings();
            getVendorDecorationBookings();
            getVendorFunctionHallBookings();
            getVendorTentHouseBookings();
            getVendorFoodCateringBookings()

            getVendorListings();

            // Cleanup function to run when the screen loses focus
            return () => {
                console.log('Screen is unfocused');
            };
        }, [])
    );

    const allCatProductDetailEndpoints = {
        decorations: {
            productDetailsEndpoint: 'getDecorationDetailsById',
            bookingDetailsEndpoint: 'decorationBookingsGotForVendor',
            catType: 'decorations',
            confirmationEndpoint: 'decorationsBookingConfirmationFromVendor'
        },
        clothjewels: {
            productDetailsEndpoint: 'getClothJewelsById',
            bookingDetailsEndpoint: 'clothJewelBookingsGotForVendor',
            catType: 'clothjewels',
            confirmationEndpoint: 'clothJewelsbookingConfirmationFromVendor'
        },
        foodcatering: {
            productDetailsEndpoint: 'getCateringDetailsById',
            bookingDetailsEndpoint: 'foodCateringBookingsGotForVendor',
            catType: 'foodcatering',
            confirmationEndpoint: 'foodCateringBookingConfirmationFromVendor'
        },
        tenthouse: {
            productDetailsEndpoint: 'getTentHouseDetailsById',
            bookingDetailsEndpoint: 'tentHouseBookingsGotForVendor',
            catType: 'tenthouse',
            confirmationEndpoint: 'tentHouseBookingConfirmationFromVendor'
        },
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
            // console.log("postsposts events halls test******::::::::::", response?.data?.posts);
            // setVendorListings(response?.data?.posts);

            const result = response?.data?.posts.map(item => {
                const catType = item?.postId?.catType;
                let productName = '';

                if (catType === 'functionhall') {
                    productName = item.postId.functionHallName;
                } else if (catType === 'tenthouse') {
                    productName = item.postId.tentHouseName;
                }
                else if (catType === 'clothjewels') {
                    productName = item.postId.productName;
                }
                else if (catType === 'decoration') {
                    productName = item.postId.eventOrganiserName;
                }
                else if (catType === 'catering') {
                    productName = item.postId.foodCateringName;
                }

                return {
                    _id: response?.data?._id,
                    productName: productName,
                    productImage: item.postId.professionalImage.url,
                    particularPostId: item?.postId?._id,
                    createdAt: response?.data?.createdAt
                };
            });
            setVendorListings(result);
            // console.log('result is ::>>',result);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }


    const getVendorClothJewelBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        setGetVendorAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/clothJewelBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const output = consolidateByProductId(response?.data?.data);
            // console.log('output is ::>>', output);
            setclothJewelBookingsData(output)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorDecorationBookings = async () => {
        // console.log("getVendorChefDriverBookings::::::::::");
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/decorationBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('resp decorationsBookingsData ::>>', response?.data?.data);
            const outputData = consolidateDecorationDataByProductId(response?.data?.data);
            setDecorationsBookingsData(outputData);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorFunctionHallBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/functionHallBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('resp getVendorFunctionHallBookings ::>>', response?.data?.data);
            const outputData = consolidateFunctionHallsDataByProductId(response?.data?.data);
            setFunctionHallBookingsData(outputData);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorTentHouseBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/tentHouseBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('resp getVendorTentHouseBookings ::>>', response?.data?.data);
            const outputData = consolidateTentHouseDataByProductId(response?.data?.data);
            setTentHouseBookingsData(outputData);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorFoodCateringBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/foodCateringBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('resp foodcateringBookings ::>>', response?.data?.data);
            const outputData = consolidateFoodCateringDataByProductId(response?.data?.data);
            setCateringBookingsData(outputData);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const deleteTheVendorPost = async (vendorId, postId) => {
        const token = await getVendorAuthToken();
        // console.log('vendorId is:::',vendorId,postId);
        try {
            const response = await axios.delete(`${BASE_URL}/deleteVendorPost/${vendorId}/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('response is:::>>',response);
            if (response?.status == 200) {
                showSuccessAlert();
                getVendorListings();
            }
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const showConfirmationAlert = (vendorId, postId) => {
        Alert.alert(
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
    }

    const showSuccessAlert = () => {
        Alert.alert(
            "Confirmation",
            "Your post has been deleted successfully.",
            [
                {
                    text: "Ok",
                    onPress: () => console.log("No Pressed"),
                    // style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }

    const renderVendorList = async ({ item }) => {
        const token = await getVendorAuthToken();

        const convertedImageUrl = item?.productImage !== undefined ? item?.productImage.replace('localhost', LocalHostUrl) : item?.productImage;
        // console.log('items are is::>>>', item);
        // console.log("token is:::::::", token);
        return (
            <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10, width: '48%', marginHorizontal: 5, alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                <View style={{ marginTop: 5, width: '100%', marginHorizontal: 5 }}>

                    <FastImage
                        style={{ width: '95%', height: 200, borderRadius: 10 }}
                        source={{
                            uri: convertedImageUrl,
                            headers: { Authorization: `Bearer ${token}` }
                        }}
                    />
                    {/* <Image style={{ width: '95%', height: 200, borderRadius: 10 }} source={{ uri: convertedImageUrl, headers: { Authorization: `Bearer ${token}` }, }} resizeMode="cover" /> */}
                    <Text style={styles.productName}>{capitalizeFirstLetters(item?.productName)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between', width: '90%', bottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
                            <ListedTimeIcon />
                            <Text style={styles.price}>{formatDate(item?.createdAt)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { showConfirmationAlert(item?._id, item?.particularPostId) }}>
                            <EditButton />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderDecorationItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.decorations })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" /> */}
                    <FastImage source={{
                        uri: convertedImageUrl,
                        headers: { Authorization: `Bearer ${getVendorAuth}` }
                    }} style={{ width: 50, height: 50 }}
                    />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{item?.productName} </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.totalAmount)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    const renderFunctionHallItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.functionhalls })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" /> */}
                    <FastImage source={{
                        uri: convertedImageUrl,
                        headers: { Authorization: `Bearer ${getVendorAuth}` }
                    }} style={{ width: 60, height: 60 }}
                    />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{item?.productName} </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.totalAmount)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    const renderTentHouseItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.tenthouse })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" /> */}
                    <FastImage source={{
                        uri: convertedImageUrl,
                        headers: { Authorization: `Bearer ${getVendorAuth}` }
                    }} style={{ width: 60, height: 60 }}
                    />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{item?.productName} </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.totalAmount)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    const renderFoodCateringItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.foodcatering })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" /> */}
                    <FastImage source={{
                        uri: convertedImageUrl,
                        headers: { Authorization: `Bearer ${getVendorAuth}` }
                    }} style={{ width: 60, height: 60 }}
                    />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{item?.productName} </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.totalAmount)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    function capitalizeFirstLetters(str) {
        // console.log('str is::>>', str)
        if (str) {
            return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }
    }

    const renderItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId, catEndPoint: allCatProductDetailEndpoints?.clothjewels })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" /> */}
                    <FastImage source={{
                        uri: convertedImageUrl,
                        headers: { Authorization: `Bearer ${getVendorAuth}` }
                    }} style={{ width: 60, height: 60 }}
                    />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 3.5 }}>{capitalizeFirstLetters(item?.productName)} </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.perDayPrice)} / day</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    const consolidateByProductId = (data) => {
        const grouped = data.reduce((acc, item) => {
            if (!acc[item?.productId]) {
                acc[item?.productId] = {
                    productId: item?.productId,
                    productName: item?.productName,
                    perDayPrice: item?.perDayPrice,
                    professionalImage: item?.professionalImage,
                    count: 0
                };
            }
            acc[item?.productId].count += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const consolidateDecorationDataByProductId = (data) => {
        const grouped = data.reduce((acc, item) => {
            if (!acc[item?.productId]) {
                acc[item?.productId] = {
                    productId: item?.productId,
                    productName: item?.eventOrganiserName,
                    totalAmount: item?.totalAmount,
                    professionalImage: item?.professionalImage,
                    count: 0
                };
            }
            acc[item?.productId].count += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const consolidateFunctionHallsDataByProductId = (data) => {
        const grouped = data.reduce((acc, item) => {
            if (!acc[item?.productId]) {
                acc[item?.productId] = {
                    productId: item?.productId,
                    productName: item?.functionHallName,
                    totalAmount: item?.totalAmount,
                    professionalImage: item?.professionalImage,
                    count: 0
                };
            }
            acc[item?.productId].count += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const consolidateTentHouseDataByProductId = (data) => {
        const grouped = data.reduce((acc, item) => {
            if (!acc[item?.productId]) {
                acc[item?.productId] = {
                    productId: item?.productId,
                    productName: item?.tentHouseName,
                    totalAmount: item?.totalAmount,
                    professionalImage: item?.professionalImage,
                    count: 0
                };
            }
            acc[item?.productId].count += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const consolidateFoodCateringDataByProductId = (data) => {
        const grouped = data.reduce((acc, item) => {
            if (!acc[item?.productId]) {
                acc[item?.productId] = {
                    productId: item?.productId,
                    productName: item?.foodCateringName,
                    totalAmount: item?.totalAmount,
                    professionalImage: item?.professionalImage,
                    count: 0
                };
            }
            acc[item?.productId].count += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const ItemSeparator = () => {
        return <View style={{ width: '80%', alignSelf: 'center', height: 1, backgroundColor: 'gray' }} />;
    };


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                <ProfileIcon style={{}} />
                <View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1E25', fontFamily: 'PoppinsRegular' }}>Hi, Surya Neelankar</Text>
                    <Text style={{ fontFamily: 'LeagueSpartanRegular' }}>+91 8297735285</Text>
                </View>
            </View>


            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF3CD', '#FFDB7E']} style={{ width: '90%', alignSelf: 'center', padding: 20, borderRadius: 10, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ color: '#1A1F36', fontSize: 14, fontWeight: 700, color: '#1A1F36' }}>Total Earning:</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 40, color: '#1A1F36', }}>₹4,500</Text>
                    </View>
                    <View style={{ width: 2, height: '100%', backgroundColor: '#F9CD4F' }} />
                    <View>
                        <Text style={{ color: '#1A1F36', fontSize: 14, fontWeight: 700, color: '#1A1F36' }}>Current Listing</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 40, color: '#1A1F36' }}>{vendorListing?.length}</Text>
                    </View>
                </View>

            </LinearGradient>
            <ScrollView>
                <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Recent Request</Text>
                <View >
                    {clothJewelBookingsData?.length ?
                        <>
                            <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Cloth/Jewel Bookings</Text>
                            <FlatList
                                data={clothJewelBookingsData}
                                renderItem={renderItem}
                                contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                ItemSeparatorComponent={ItemSeparator}
                            />
                        </>
                        : null}
                    {decorationsBookingsData?.length ?
                        <>
                            <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Decoration Bookings</Text>
                            <FlatList
                                data={decorationsBookingsData}
                                renderItem={renderDecorationItem}
                                contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                ItemSeparatorComponent={ItemSeparator}
                            />
                        </>
                        : null}

                    {functionHallBookingsData?.length ?
                        <>
                            <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Function Hall Bookings</Text>
                            <FlatList
                                data={functionHallBookingsData}
                                renderItem={renderFunctionHallItem}
                                contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                ItemSeparatorComponent={ItemSeparator}
                            />
                        </>
                        : null}
                    {tentHouseBookingsData?.length ?
                        <>
                            <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Tent House Bookings</Text>
                            <FlatList
                                data={tentHouseBookingsData}
                                renderItem={renderTentHouseItem}
                                contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                ItemSeparatorComponent={ItemSeparator}
                            />
                        </>
                        : null}

                    {cateringsBookingsData?.length ?
                        <>
                            <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Food Catering Bookings</Text>
                            <FlatList
                                data={cateringsBookingsData}
                                renderItem={renderFoodCateringItem}
                                contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                                ItemSeparatorComponent={ItemSeparator}
                            />
                        </>
                        : null}
                </View>
                <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%' }}>All Listed Products</Text>
                <FlatList
                    data={vendorListing}
                    renderItem={renderVendorList}
                    contentContainerStyle={{ borderRadius: 15, margin: 15, paddingBottom: 40 }}
                    numColumns={2}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        fontSize: 12,
        color: '#202020',
        width: '90%',
        margin: 5
    },
    price: {
        color: themevariable.Color_202020,
        fontWeight: '400',
        fontSize: 14,
        fontFamily: 'ManropeRegular',
        color: '#202020',
        marginHorizontal: 5,
        margin: 5
    },


})

export default VendorDashBoardTab;