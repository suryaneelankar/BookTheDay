import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, Dimensions, FlatList, PermissionsAndroid, Pressable, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import GetLocation from 'react-native-get-location'
import { horizontalScale, verticalScale } from "../../utils/scalingMetrics";
import LocationMarkIcon from '../../assets/svgs/location.svg';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import ArrowDown from '../../assets/svgs/arrowDown.svg';
import MoneyWavy from '../../assets/svgs/MoneyWavy.svg';
import Cloth from '../../assets/svgs/cloth.svg';
import Cheers from '../../assets/svgs/Cheers.svg';
import { LinearGradient } from 'react-native-linear-gradient';
import FilterIcon from '../../assets/svgs/filter.svg';
import RightArrowIcon from '../../assets/svgs/rightArrow.svg';
import themevariable from "../../utils/themevariable";
import { formatAmount } from "../../utils/GlobalFunctions";
import { InfoBox } from "../../components/InfoBox";
import TrendingNow from "../Products/TrendingNow";
import FooterBackGround from '../../assets/svgs/categories/home_footer_banner.svg';
import Swiper from "react-native-swiper";
import TrendingRingBanner from '../../assets/svgs/trendingNow/home_trendingnow_ring.svg';
import TrendingBracelet from '../../assets/svgs/trendingNow/home_trendingnow_bracelets.svg';
import TrendingBridal from '../../assets/svgs/trendingNow/home_trendingnow_bridal.svg';
import TrendingCatering from '../../assets/svgs/trendingNow/home_trendingnow_catering.svg';
import TrendingEarrings from '../../assets/svgs/trendingNow/home_trendingnow_earrings.svg';
import TrendingJewellery from '../../assets/svgs/trendingNow/home_trendingnow_jewellery.svg';
import TrendingNecklace from '../../assets/svgs/trendingNow/home_trendingnow_necklaces.svg';
import TrendingTshirt from '../../assets/svgs/trendingNow/home_trendingnow_tshirt.svg';
import CatCatering from '../../assets/svgs/categories/home_categories_catering_icon.svg';
import CatClothes from '../../assets/svgs/categories/home_categories_clothes_icon.svg';
import CatHalls from '../../assets/svgs/categories/home_categories_hall_icon.svg';
import CatJewellery from '../../assets/svgs/categories/home_categories_jewellery_icon.svg';
import JewelleryCard from '../../assets/svgs/homeSwippers/home_jewellerycard.png';
import ClothesCard from '../../assets/svgs/homeSwippers/home_shirtcard.png';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import { getCurrentLoggedInUserName, getUserLocation, setUserCurrentLocation, showOrHideBottomCard } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import DistanceIcon from '../../assets/svgs/distanceIcon.svg';
import FloatingCartButton from "../../components/FloatingCartButton";

const HomeDashboard = () => {
    const [categories, setCategories] = useState([])
    const [address, setAddress] = useState('');
    const userLocationFetched = useSelector((state) => state.userLocation);
    // console.log("userLocationFetched home :::::", userLocationFetched)
    const userLoggedInMobileNumber = useSelector((state) => state.userLoggedInMobileNum);
    const showBottomCard = useSelector((state) => state.showBottomCard);
    const latitude = userLocationFetched?.geometry?.location?.lat ? userLocationFetched?.geometry?.location?.lat : userLocationFetched?.latitude;
    const longitude = userLocationFetched?.geometry?.location?.lng ? userLocationFetched?.geometry?.location?.lng : userLocationFetched?.longitude
    const dispatch = useDispatch();
    const [eventsData, setEventsData] = useState([]);
    const [nearByEventsData, setNearByEventsData] = useState([]);
    const [nearbyCateringsData, setNearByCateringsData] = useState([]);
    const [cateringsData, setCateringsData] = useState([]);

    const [discountProducts, setDiscountProducts] = useState([]);
    const [newlyAddedProducts, setNewlyAddedProducts] = useState([]);
    const [getUserAuth, setGetUserAuth] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [myBookings, setMyBookings] = useState();
    const [cateringBookings, setCateringBookings] = useState();
    const [hallsBookings, setHallsBookings] = useState();

    const deviceFCMToken = useSelector((state) => state.deviceFCMToken);
    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);

    const bannerImages = [
        { id: '1', image: JewelleryCard },
        { id: '2', image: ClothesCard },
    ];

    const CategoriesData = [
        { name: 'Clothes', image: CatClothes },
        { name: 'Jewellery', image: CatJewellery },
        // { name: 'Chefs', image: CatChef },
        // { name: 'Driver', image: CatDriver },
        // { name: 'Tent House', image: CatTentHouse },
        { name: 'Halls', image: CatHalls },
        // { name: 'Decoration', image: CatDecoration },
        { name: 'Catering', image: CatCatering }
    ];

    const trendingData = [
        { id: '1', Component: TrendingTshirt, name: 'mens' },
        { id: '2', Component: TrendingBridal, name: 'womens' },
        { id: '3', Component: TrendingCatering, name: 'caterings' },
        { id: '6', Component: TrendingRingBanner, name: 'rings' },
        { id: '7', Component: TrendingEarrings, name: 'earrings' },
        { id: '8', Component: TrendingJewellery, name: 'bridal' },
        { id: '9', Component: TrendingNecklace, name: 'chains' },
        { id: '10', Component: TrendingBracelet, name: 'bracelets' },
    ];

    useFocusEffect(
        useCallback(() => {
            getCategories();
            getAllEvents(currentPage);
            getUserAuthTokenRes();
            getProfileData();
            getAllCaterings(currentPage);
            getHallsBookings();
            getMyBookings();
            getCateringsBookings();
            // Cleanup function to run when the screen loses focus
            return () => {
                console.log('Screen is unfocused');
            };
        }, [])
    );

    useEffect(() => {
        storeUserDeviceToken();
        if (cateringBookings?.length > 0 || hallsBookings?.length > 0 || myBookings?.length > 0) {
            console.log("cateringBookings?.length", cateringBookings?.length, hallsBookings?.length, myBookings?.length)
            dispatch(showOrHideBottomCard(true));
        }
    }, [])

    const storeUserDeviceToken = async () => {

        const payload = {
            mobileNumber: String(userLoggedInMobileNum),
            fcmToken: deviceFCMToken
        }
        // console.log("payload is:::::::", payload, type);
        const token = await getUserAuthToken();
        console.log("LOgin screen scan", token);
        try {
            const userTokenRes = await axios.post(`${BASE_URL}/addUserFCMToken`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("userTokenRes  res:::::::::", userTokenRes);
            if (userTokenRes?.status === 200) {
                console.warn("successfully logged fcm token:", userTokenRes?.data?.message);
            }
        } catch (error) {
            console.error("Error during add user token 1 :", error);
        }
    }


    useFocusEffect(
        useCallback(() => {
            getNearByEvents();
            getNearByCaterings();
            // Cleanup function to run when the screen loses focus
            return () => {
                console.log('Screen is unfocused');
            };
        }, [latitude, longitude])
    );

    const getNearByEvents = async () => {
        console.log("latitude , long are::>>", latitude, longitude);
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getNearByFunctionHalls?latitude=${latitude}&longitude=${longitude}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newFunctionHalls = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            // console.log("neareby loc events in HOMEEEEEEE:::::::;", newFunctionHalls);
            setNearByEventsData(newFunctionHalls);
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
    };

    const getNearByCaterings = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getNearByFoodCaterings?latitude=${latitude}&longitude=${longitude}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("nearby caterings:::;;;", response?.data?.data)
            const newCaterings = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            if (response?.data?.data?.length > 0) {
                setNearByCateringsData(newCaterings); // Append new data
            }
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
    }

    const getMyBookings = async () => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getUserClothJewelBookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("BOOKINGS RES:::::::::", JSON.stringify(response?.data));
            const countApproved = response?.data?.data?.filter((item) => item.bookingStatus === "approved");

            setMyBookings(countApproved)
        } catch (error) {
            console.log("My Bookings data error>>::", error);
        }
    };

    const getCateringsBookings = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getUserFoodCateringBookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("catering BOOKINGS RES:::::::::", JSON.stringify(response?.data))
            const countApproved = response?.data?.data?.filter((item) => item.bookingStatus === "approved");

            setCateringBookings(countApproved);

        } catch (error) {
            console.log("My Bookings data error>>::", error);
        }
    };

    const getHallsBookings = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getUserFunctionHallBookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("Funtional halls BOOKINGS RES:::::::::", JSON.stringify(response?.data))
            const countApproved = response?.data?.data?.filter((item) => item.bookingStatus === "approved");

            setHallsBookings(countApproved);

        } catch (error) {
            console.log("My Bookings data error>>::", error);
        }
    };


    const getUserAuthTokenRes = async () => {
        const token = await getUserAuthToken();
        // console.log("usertoklen", token);
    };

    const getProfileData = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllUserLocations/${userLoggedInMobileNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(getCurrentLoggedInUserName(response?.data?.data?.fullName));
            // console.log("profile user res:::", response?.data);

        } catch (error) {
            console.log("profile::::::::::", error);
            // setLoading(false);
        }
    }


    const getAllEvents = async (page) => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHalls?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("ondemand halls::::::", response?.data?.data)
            setEventsData(response?.data?.data)
        } catch (error) {
            console.log("events data error>>::", error);
        }
    };

    const getAllCaterings = async (page) => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodCaterings?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newCateringsData = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            // console.log('resp is caterings ::>>>', JSON.stringify(response?.data?.data));
            setCateringsData(newCateringsData);

        } catch (error) {
            console.error('Error fetching user dashbaord', error);
        }
    };

    const getCategories = async () => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllClothesJewels`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("Products res:::::::", JSON.stringify(response?.data))
            setCategories(response?.data?.data)
            const filteredDiscountItems = response?.data?.data.filter(category => category?.componentType === 'discount');
            const filteredNewItems = response?.data?.data.filter(category => category?.componentType === 'new');

            setDiscountProducts(filteredDiscountItems);
            setNewlyAddedProducts(filteredNewItems);
        } catch (error) {
            console.log("categories discount::::::::::", error);

        }
    }


    useEffect(() => {
        getPermissions();
    }, []);


    const getLocation = async () => {
        try {
            const location = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            });
            console.log("getting location", location);

            if (location) {
                const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';  // Replace with your Google API key
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                // console.log("address in home::::::", JSON.stringify(data));
                setAddress(data?.results[0]?.formatted_address);
                dispatch(getUserLocation(data?.results[0]));
                dispatch(setUserCurrentLocation(data?.results[0]));
            }
        } catch (error) {
            console.error("Error: location 1", error);
        }
    };

    const handleCheckPressed = async () => {
        if (Platform.OS === 'android') {
            const checkEnabled = await isLocationEnabled();
            console.log('checkEnabled', checkEnabled);
            if (!checkEnabled) {
                handleEnabledPressed();
            } else {
                getLocation();
            }
        }
    };

    const handleEnabledPressed = async () => {
        if (Platform.OS === 'android') {
            try {
                const enableResult = await promptForEnableLocationIfNeeded();
                console.log('enableResult', enableResult);
                getLocation();
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                    // The user has not accepted to enable the location services or something went wrong during the process
                    // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
                    // codes :
                    //  - ERR00 : The user has clicked on Cancel button in the popup
                    //  - ERR01 : If the Settings change are unavailable
                    //  - ERR02 : If the popup has failed to open
                    //  - ERR03 : Internal error
                }
            }
        }
    };

    const getPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'BookTheDay location permission',
                    message: 'App needs location Permissions',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK'
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                handleCheckPressed();
                // getLocation()
            } else {
                Alert.alert("Location permissions denied")
            }
        } catch (err) {
            // console.warn(err)
        }
    }

    const renderNewlyAddedDetails = ({ item }) => {
        const updatedImgUrl = item?.professionalImage?.url;

        const originalPrice = item?.rentPricePerDay;
        const discountPercentage = item?.discountPercentage;
        const strikethroughPrice = discountPercentage
            ? Math.round(originalPrice * (1 + discountPercentage / 100))
            : originalPrice;

        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id })}
                    style={{ elevation: 5, width: Dimensions.get('window').width / 2.8, alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', height: 'auto', marginEnd: 10 }}>
                    <FastImage source={{
                        uri: updatedImgUrl,
                        // headers: { Authorization: `Bearer ${getUserAuth}` }
                    }} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, width: '90%', alignSelf: "center", marginTop: 5, height: Dimensions.get('window').height / 5 }}
                    />
                    <View style={{ marginTop: 15, marginHorizontal: 6 }}>
                        <Text numberOfLines={2} style={{ fontWeight: '600', color: '#000000', fontSize: 12, fontFamily: 'ManropeRegular' }}>{item?.productName}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 10 }}>
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.rentPricePerDay)}</Text>
                            <Text style={styles.strickedoffer}>{formatAmount(strikethroughPrice)}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const renderItem = ({ item, index }) => {
        const updatedImgUrl = item?.professionalImage?.url;
        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ marginBottom: 5, elevation: 5, backgroundColor: "white", width: Dimensions.get('window').width / 1.3, alignSelf: 'center', borderRadius: 8, marginHorizontal: 16, marginTop: 15, height: 'auto' }}>
                    <FastImage source={{
                        uri: updatedImgUrl,
                        // headers: { Authorization: `Bearer ${getUserAuth}` }
                    }}
                        style={{ borderRadius: 8, width: '95%', padding: 90, alignSelf: "center", marginTop: 8 }}
                    />
                    <View style={{ marginTop: 15, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '700', color: '#131313', fontSize: 16, fontFamily: 'InterBold', width: '48%' }}>{item?.functionHallName}</Text>
                            {item?.menuImages && item?.menuImages?.length > 0 ? <Text style={{ fontWeight: '600', color: "#FD813B", fontSize: 18, fontFamily: 'ManropeRegular' }}>Menu based</Text> :
                                <Text style={{ fontWeight: '700', color: "#FD813B", fontSize: 18, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.rentPricePerDay)}/day</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <FontAwesome name={"map-marker"} color={themevariable.Color_777777} size={20} style={{ marginTop: 5 }} />
                                {item?.distance ?
                                    <Text style={{ fontWeight: '500', marginHorizontal: 5, color: themevariable.Color_777777, fontSize: 13, marginTop: 5, fontFamily: 'InterBold', }}>{item?.county}</Text>
                                    :
                                    <Text numberOfLines={2} style={{ fontWeight: '500', marginHorizontal: 5, color: themevariable.Color_777777, fontSize: 13, marginTop: 5, fontFamily: 'InterBold', bottom: 3 }}>{item?.functionHallAddress?.address}</Text>
                                }
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}>
                            <Text style={{ color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}> {item?.seatingCapacity} pax</Text>
                        </View>
                        {item?.distance ?
                            <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, marginHorizontal: 5, paddingVertical: 5, alignItems: "center" }}>
                                <DistanceIcon />
                                <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 12, fontWeight: "400" }}>{item?.distance?.toFixed(1)}  km</Text>
                            </View>
                            : null}
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}>
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}> {item?.bedRooms} Rooms</Text>
                        </View>
                        {!item?.distance ?
                            <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, alignItems: "center" }}>

                                <Text style={{}}>{item?.foodType == 'Both' ? <VegNonVegIcon /> : item?.foodType == 'veg' ? <VegIcon /> : <NonVegIcon />}</Text>
                                <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}>{item?.foodType == 'Both' ? 'VEG/NON-VEG' : item?.foodType == 'veg' ? 'VEG' : 'NON-VEG'}</Text>
                            </View>
                            : null}
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    const renderCaterings = ({ item }) => {

        const updatedImgUrl = item?.professionalImage?.url;
        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewCaterings', { categoryId: item?._id })}
                    style={{ marginBottom: 5, elevation: 5, backgroundColor: "white", width: Dimensions.get('window').width / 1.3, alignSelf: 'center', borderRadius: 8, marginHorizontal: 16, marginTop: 15, height: 'auto' }}>
                    <FastImage source={{
                        uri: updatedImgUrl,
                        // headers: { Authorization: `Bearer ${getUserAuth}` }
                    }}
                        style={{ borderRadius: 8, width: '95%', padding: 90, alignSelf: "center", marginTop: 8 }}
                    />
                    <View style={{ marginTop: 15, justifyContent: 'space-between', }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '700', color: '#131313', fontSize: 16, fontFamily: 'InterBold', width: '48%' }}>{item?.foodCateringName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <FontAwesome name={"map-marker"} color={themevariable.Color_777777} size={20} style={{ marginTop: 5 }} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: themevariable.Color_777777, fontSize: 13, marginTop: 5, fontFamily: 'InterBold', bottom: 3 }}>{item?.foodCateringAddress?.address}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "60%", padding: 5, marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            {item?.distance ?
                                <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 5, paddingVertical: 5, marginHorizontal: 10, alignItems: "center" }}>
                                    <DistanceIcon />
                                    <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 12, fontWeight: "400" }}>{item?.distance.toFixed(1)}  km</Text>
                                </View>
                                : null}
                            <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, alignItems: "center", paddingVertical: 5 }}>
                                <Text>{item?.foodType == 'Both' ? <VegNonVegIcon /> : item?.foodType == 'veg' ? <VegIcon /> : <NonVegIcon />}</Text>
                                <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}>{item?.foodType == 'Both' ? 'VEG/NON-VEG' : item?.foodType == 'veg' ? 'VEG' : 'NON-VEG'}</Text>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const { width } = Dimensions.get('window');
    const navigation = useNavigation();

    const renderTrendingView = ({ item }) => {
        const SvgComponent = item.Component;
        return (
            <TouchableOpacity onPress={() => handleTrendingBanners(item?.name)} style={{ marginHorizontal: 10 }}>
                <SvgComponent />
            </TouchableOpacity>
        );
    };

    const handleTrendingBanners = (catClicked) => {
        if (catClicked === 'rings') {
            navigation.navigate('CategoriesList', { catType: 'rings' });
        } else if (catClicked === 'earrings') {
            navigation.navigate('CategoriesList', { catType: 'earrings' });
        } else if (catClicked === 'bridal') {
            navigation.navigate('CategoriesList', { catType: 'bridal' });
        } else if (catClicked === 'chains') {
            navigation.navigate('CategoriesList', { catType: 'chains' });
        } else if (catClicked === 'bracelets') {
            navigation.navigate('CategoriesList', { catType: 'bracelets' });
        } else if (catClicked === 'mens') {
            navigation.navigate('CategoriesList', { catType: 'mens' });
        } else if (catClicked === 'womens') {
            navigation.navigate('CategoriesList', { catType: 'womens' });
        } else if (catClicked === 'caterings') {
            navigation.navigate('Caterings');
        }
    }

    const handlePress = (name) => {
        console.log("name is::::::", name);
        if (name === 'Clothes') {
            navigation.navigate('CategoriesList', { catType: 'clothes' });
        } else if (name === 'Jewellery') {
            navigation.navigate('CategoriesList', { catType: 'jewels' });
        } else if (name === 'Halls') {
            navigation.navigate('Events');
        } else if (name === 'Catering') {
            navigation.navigate('Caterings');
        } else {
            navigation.navigate('OtpValidation');
        }

        // Add other conditions for different categories if needed
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ marginBottom: 70 }} >
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>
                    <View style={styles.topContainer}>
                        <View style={styles.locationContainer}>
                            <Text style={styles.currentLoc}>Select location</Text>
                            {/* navigation.navigate('LocationAdded') */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => getLocation()} style={styles.getLoc}>
                                    <LocationMarkIcon />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('LocationAdded') }}>
                                    <Text numberOfLines={1} style={styles.retrievedLoc}>{userLocationFetched?.formatted_address ? userLocationFetched?.formatted_address : userLocationFetched?.address ? userLocationFetched?.address : 'Select Location'}</Text>
                                    <ArrowDown />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
                            <FontAwesome name={"user-circle"} color={"#000000"} size={35} />
                            {hallsBookings?.length + cateringBookings?.length + myBookings?.length > 0 ?
                                <TouchableOpacity onPress={() => navigation.navigate('ViewMyBookings')} style={styles.badge}>
                                    <Text style={styles.badgeText}> {(hallsBookings?.length) + (cateringBookings?.length) + (myBookings?.length)} </Text>
                                </TouchableOpacity>
                                : null}
                        </Pressable>
                    </View>
                    <Swiper
                        autoplay
                        autoplayTimeout={3}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                        style={{ height: Dimensions.get('window').height / 3.5, }}
                    >
                        {bannerImages.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (item.id === '1') {
                                            navigation.navigate('CategoriesList', { catType: 'jewels' });
                                        } else if (item.id === '2') {
                                            navigation.navigate('CategoriesList', { catType: 'clothes' });
                                        }
                                    }}
                                    style={{ padding: 10 }}
                                >
                                    <Image
                                        source={item?.image}
                                        style={{ width: "100%", height: "100%", alignSelf: "center", padding: 10 }} />
                                </TouchableOpacity>
                            );
                        })}
                    </Swiper>

                    <View style={styles.infoBoxContainer}>

                        <InfoBox
                            IconComponent={MoneyWavy}
                            mainText="100%"
                            subText="Cost Efficient"
                        />
                        <View style={styles.verticalLine} />
                        <InfoBox
                            IconComponent={Cloth}
                            mainText="150+"
                            subText="Products"
                        />
                        <View style={styles.verticalLine} />
                        <InfoBox
                            IconComponent={Cheers}
                            mainText="100+"
                            subText="Events"
                        />

                    </View>

                    <View style={{}}>
                        <Text style={{ marginHorizontal: 20, fontFamily: "ManropeRegular", fontWeight: "700", fontSize: 16, color: '#202020' }}>Categories</Text>
                        <FlatList
                            data={CategoriesData}
                            renderItem={({ item }) => {
                                const SvgComponent = item.image;
                                return (
                                    <TouchableOpacity onPress={() => handlePress(item?.name)} style={{ alignItems: "center", alignSelf: "center", justifyContent: "center", width: Dimensions.get('window').width / 4 }} >
                                        <SvgComponent width={65} height={65} />
                                        <Text style={{ marginTop: 2, fontSize: 13, fontWeight: "500", color: '#202020', fontFamily: "ManropeRegular" }}>
                                            {item?.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            showsHorizontalScrollIndicator={false}
                            numColumns={4}
                        />
                    </View>
                </LinearGradient>

                {discountProducts?.length > 0 ?
                    <TrendingNow data={discountProducts} textHeader={'Live Offers!'} token={getUserAuth} />
                    :
                    null}

                {nearByEventsData?.length > 0 ?
                    <>
                        <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between', marginTop: horizontalScale(20) }}>
                            <Text style={styles.onDemandTextStyle}>Halls Near You</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('NearByEvents')} style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                <Text style={[styles.onDemandTextStyle, { marginHorizontal: 5 }]}>See Nearby</Text>
                                <RightArrowIcon width={25} height={25} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={nearByEventsData}
                            renderItem={renderItem}
                            horizontal
                            keyExtractor={(item) => item?._id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </> : null}
                <View style={{ marginTop: 20, }}>
                    <Text style={[styles.onDemandTextStyle, { alignSelf: 'flex-start', padding: 10, marginHorizontal: 10 }]}>Trusted Lender</Text>
                    <FlatList
                        data={trendingData}
                        horizontal
                        renderItem={renderTrendingView}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 10, }}
                        showsHorizontalScrollIndicator={true}
                    />

                </View>

                {nearbyCateringsData?.length > 0 ?
                    <>
                        <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between', marginTop: horizontalScale(20) }}>
                            <Text style={styles.onDemandTextStyle}>Caterings Near You</Text>
                        </View>

                        <FlatList
                            data={nearbyCateringsData}
                            renderItem={renderCaterings}
                            horizontal
                            keyExtractor={(item) => item?._id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </> : null}

                {newlyAddedProducts?.length ?
                    <View style={{}}>
                        <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                            <Text style={styles.onDemandTextStyle}>Newly Added</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('CategoriesList', { componentType: 'new' })} style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                <Text style={[styles.onDemandTextStyle, { marginHorizontal: 5 }]}>See All</Text>
                                <RightArrowIcon width={25} height={25} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            horizontal
                            data={newlyAddedProducts}
                            contentContainerStyle={{ backgroundColor: "#FFF7E7", paddingVertical: verticalScale(15), paddingHorizontal: 10, marginTop: 5 }}
                            renderItem={renderNewlyAddedDetails}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View> : null}

                {eventsData?.length > 0 ?
                    <>
                        <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between', marginTop: horizontalScale(20) }}>
                            <Text style={styles.onDemandTextStyle}>On Demand Halls</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Events')} style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                <Text style={[styles.onDemandTextStyle, { marginHorizontal: 5 }]}>See All</Text>
                                <RightArrowIcon width={25} height={25} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={eventsData}
                            renderItem={renderItem}
                            horizontal
                            keyExtractor={(item) => item?._id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </> : null}

                {cateringsData?.length > 0 ?
                    <>
                        <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between', marginTop: horizontalScale(20) }}>
                            <Text style={styles.onDemandTextStyle}>Food Caterings</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Caterings')} style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                <Text style={[styles.onDemandTextStyle, { marginHorizontal: 5 }]}>See All</Text>
                                <RightArrowIcon width={25} height={25} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={cateringsData}
                            renderItem={renderCaterings}
                            horizontal
                            keyExtractor={(item) => item?._id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </> : null}


                <View style={{
                    alignItems: 'center',
                    // justifyContent: 'center',
                    position: 'relative',
                    width: "100%",
                    marginTop: 10
                }}>
                    <FooterBackGround style={{ width: "100%" }} />
                    <View style={styles.textContainer}>
                        <Text style={styles.footerTitle}>Expect More With Less</Text>
                        <Text style={styles.subtitle}>We are here for your every need.</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoriesList', { catType: 'clothes' })} style={styles.button}>
                            <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF", fontFamily: 'ManropeRegular', }} >About us  &raquo;</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal transparent={true} visible={isModalVisible} animationType="slide">
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>
                                For a better experience, your device will need to use Location Accuracy
                            </Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                    <Text style={styles.noThanksText}>No, thanks</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={getPermissions}>
                                    <Text style={styles.turnOnText}>Turn on</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>



            </ScrollView>

            {showBottomCard && (
                <FloatingCartButton
                    totalCount={hallsBookings + cateringBookings + myBookings}
                    hallsData={hallsBookings}
                    cateringData={cateringBookings}
                    clothsData={myBookings}
                    authToken={getUserAuth}
                    onPress={() => dispatch(showOrHideBottomCard(false))}
                    onClose={() => dispatch(showOrHideBottomCard(false))} />
            )}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        marginTop: Dimensions.get('window').height / 9
    },
    footerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#000000',
        fontFamily: 'ManropeRegular',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'ManropeRegular',
        fontWeight: "500",
        color: '#000000',
    },
    button: {
        backgroundColor: '#EB8D46',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center', backgroundColor: "yellow",
        height: 200,
    },
    onDemandTextStyle: {
        fontFamily: 'ManropeRegular',
        color: themevariable.Color_202020,
        fontSize: 16,
        fontWeight: '700',
        alignSelf: 'center'
    },
    strickedoffer: {
        fontSize: 12,
        color: "#57A64F",
        fontWeight: "400",
        marginLeft: 7,
        textDecorationLine: 'line-through'
    },
    off: {
        fontSize: 13,
        color: "#57A64F",
        fontWeight: "bold"
    },
    swiperContainer: {
        flex: 1,
        alignSelf: 'center',
        backgroundColor: 'white',
        width: "90%",
    },
    topContainer: {
        // alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginHorizontal: 20
        // paddingVertical:10,
        // width:"90%",
    },
    locationContainer: {
        flexDirection: 'column',
        width: '70%'
        // marginLeft: 10,
    },
    locationSubContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginHorizontal: 20,
    },
    dot: {
        backgroundColor: '#DCD7FD',
        width: 8,
        height: 8,
        borderRadius: 4,
        bottom: 0,
        top: 35
    },
    activeDot: {
        backgroundColor: '#FF6347',
        width: 18,
        height: 8,
        borderRadius: 4,
        bottom: 0,
        top: 35
    },
    locationIcon: {
        marginRight: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    category: {
        alignItems: 'center',
        marginBottom: 16,
        width: '22%',
    },
    iconContainer: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    label: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
    locationName: {
        fontWeight: '900',
        fontSize: 12,
        color: "#000000",
    },
    fullLocation: {
        width: 200,
        fontSize: 15,
        fontWeight: "400",
    },
    profileContainer: {

    },
    text: { fontSize: 12, textAlign: 'center' },
    title: {
        fontSize: 12,
        fontWeight: "400",
        alignSelf: "center",
        textAlign: "center",
        // marginTop:5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    status: {
        fontSize: 10,
        padding: 4,
        borderRadius: 5,
        marginTop: 5
    },
    card: {
        borderWidth: 1, borderColor: "lightgray", borderRadius: 10, paddingBottom: 10,
        paddingHorizontal: 5,
        marginTop: 10,
        alignItems: 'center',
        margin: 5,
        // backgroundColor:"#f7f5f5"
    },
    listcard: {
        marginTop: 10,
        width: "90%",
        borderRadius: 20,
        alignSelf: "center",
        alignItems: "center"
    },
    image: {
        width: '50%',
        height: "100%",
        resizeMode: 'cover',
    },
    currentLoc: {
        fontFamily: 'ManropeRegular',
        color: '#7D7F88',
        fontSize: 14,
        fontWeight: '400'
    },
    getLoc: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    retrievedLoc: {
        fontFamily: 'ManropeRegular',
        color: '#1A1E25',
        fontSize: 15,
        fontWeight: '400',
        marginHorizontal: 5,
        width: '95%'
    },
    searchContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "space-between"
    },
    searchProduct: {
        height: 45,
        backgroundColor: "#FFFFFF",
        width: "85%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderColor: "#FFFFFF",
        borderWidth: 0.8
    },
    searchProHeader: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center",
        color: themevariable.Color_000000
    },
    filterView: {
        height: 45,
        backgroundColor: "#FFFFFF",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderColor: "#FFFFFF",
        borderWidth: 0.8
    },
    infoBoxContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#FFFFFF",
        padding: 8,
        marginVertical: 20,
        borderRadius: 10
    },
    verticalLine: {
        backgroundColor: "#EFAE1A",
        height: "80%",
        width: 1,
        alignSelf: "center"
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: "#333333"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noThanksText: {
        fontSize: 16,
        color: 'gray',
    },
    turnOnText: {
        fontSize: 16,
        color: '#1E90FF',
    },
    badge: {
        position: "absolute",
        right: -5,
        top: -5,
        backgroundColor: "#CC3F3C",
        borderRadius: 10,
        height: 20,
        width: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default HomeDashboard;