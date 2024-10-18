import React, { useEffect, useState, useRef } from "react";
import { View, Text, Dimensions, FlatList, PermissionsAndroid, Pressable, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
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
import CatChef from '../../assets/svgs/categories/home_categories_chef_icon.svg';
import CatClothes from '../../assets/svgs/categories/home_categories_clothes_icon.svg';
import CatDecoration from '../../assets/svgs/categories/home_categories_decoration_icon.svg';
import CatDriver from '../../assets/svgs/categories/home_categories_driver_icon.svg';
import CatHalls from '../../assets/svgs/categories/home_categories_hall_icon.svg';
import CatJewellery from '../../assets/svgs/categories/home_categories_jewellery_icon.svg';
import CatTentHouse from '../../assets/svgs/categories/home_categories_tent_icon.svg';
import JewelleryCard from '../../assets/svgs/homeSwippers/home_jewellerycard.svg';
import ClothesCard from '../../assets/svgs/homeSwippers/home_shirtcard.svg';
import { getUserAuthToken, getVendorAuthToken } from "../../utils/StoreAuthToken";
import { getCurrentLoggedInUserName, getUserLocation, setUserCurrentLocation } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";

const HomeDashboard = () => {
    const [categories, setCategories] = useState([])
    const [address, setAddress] = useState('');
    const userLocationFetched = useSelector((state) => state.userLocation);
    const userLoggedInMobileNumber = useSelector((state) => state.userLoggedInMobileNum);

    // console.log("userlocation dispctahed:::::;;", userLocationFetched)
    const dispatch = useDispatch();
    const [eventsData, setEventsData] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [newlyAddedProducts, setNewlyAddedProducts] = useState([]);
    const [getUserAuth, setGetUserAuth] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const bannerImages = [
        { id: '1', image: JewelleryCard },
        { id: '2', image: ClothesCard },
    ];


    const CategoriesData = [
        { name: 'Clothes', image: CatClothes },
        { name: 'Jewellery', image: CatJewellery },
        { name: 'Chefs', image: CatChef },
        { name: 'Driver', image: CatDriver },
        { name: 'Tent House', image: CatTentHouse },
        { name: 'Halls', image: CatHalls },
        { name: 'Decoration', image: CatDecoration },
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
    useEffect(() => {
        // getPermissions();
        getCategories();
        getAllEvents(currentPage);
        getUserAuthTokenRes();
        getProfileData();
    }, []);

    const getUserAuthTokenRes = async () => {
        const token = await getUserAuthToken();
        console.log("usertoklen", token);
    };

    const getProfileData = async() =>{
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllUserLocations/${userLoggedInMobileNumber}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            dispatch(getCurrentLoggedInUserName(response?.data?.data?.fullName));
            console.log("profile user res:::", response?.data);
           
        } catch (error) {
            console.log("profile::::::::::", error);
            setLoading(false);
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
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                console.log("getting location", location);
                if (location) {
                    fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
                    )
                        .then(response => response.json())
                        .then(data => {
                            console.log("address is::::::", data)
                            setAddress(data?.address);
                            dispatch(getUserLocation(data));
                            dispatch(setUserCurrentLocation(data));

                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            })
            .catch(error => {
                const { code, message } = error;
                // console.warn(code, message);
            })

    }

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
                getLocation()
            } else {
                Alert.alert("Location permissions denied")
            }
        } catch (err) {
            // console.warn(err)
        }
    }

    const renderNewlyAddedDetails = ({ item }) => {
        const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        const originalPrice = item?.rentPricePerDay;
        const discountPercentage = item?.discountPercentage;
        const strikethroughPrice = discountPercentage
            ? Math.round(originalPrice * (1 + discountPercentage / 100))
            : originalPrice;

        return (
            <View style={{}}>
                <TouchableOpacity
                     onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id })}
                    style={{ elevation: 5, width: Dimensions.get('window').width / 2.8, alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', height: 'auto',marginEnd:10 }}>
                    <FastImage source={{
                        uri: updatedImgUrl,
                        headers: { Authorization: `Bearer ${getUserAuth}` }


                    }} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, width: '90%', alignSelf: "center", marginTop: 5, height: Dimensions.get('window').height / 5 }}
                    />
                    <View style={{ marginTop: 15, marginHorizontal: 6 }}>
                        <Text numberOfLines={2} style={{ fontWeight: '600', color: '#000000', fontSize: 12, fontFamily: 'ManropeRegular' }}>{item?.productName}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 10 }}>
                            {/* <Text style={{ fontWeight: '700', color:'#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.price)}/day</Text> */}
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.rentPricePerDay)}</Text>

                            <Text style={styles.strickedoffer}>{formatAmount(strikethroughPrice)}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const renderItem = ({ item }) => {

        const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;
        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ marginBottom: 5, elevation: 5, backgroundColor: "white", width: Dimensions.get('window').width / 1.3, alignSelf: 'center', borderRadius: 8, marginHorizontal: 16, marginTop: 15, height: 'auto' }}>
                    <FastImage source={{
                        uri: updatedImgUrl,
                        headers: { Authorization: `Bearer ${getUserAuth}` }
                    }}
                        style={{ borderRadius: 8, width: '95%', padding: 90, alignSelf: "center", marginTop: 8 }}
                    />
                    <View style={{ marginTop: 15, justifyContent: 'space-between', }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '700', color: '#131313', fontSize: 16, fontFamily: 'InterBold', width: '48%' }}>{item?.functionHallName}</Text>
                            <Text style={{ fontWeight: '700', color: themevariable.Color_B46609, fontSize: 18, fontFamily: 'InterBold' }}>{formatAmount(item?.rentPricePerDay)}/day</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesome name={"map-marker"} color={themevariable.Color_777777} size={20} style={{}} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: themevariable.Color_777777, fontSize: 13, marginTop: 5, fontFamily: 'InterBold', bottom: 3 }}>{item?.functionHallAddress?.address}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "60%", marginTop: 10, padding: 5, marginBottom: 5 }}>

                        <View style={{ backgroundColor: item?.available ? "#dcfcf0" : themevariable.Color_FFF8DF, flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: 'black', fontSize: 12, marginHorizontal: 5, fontFamily: 'InterBold' }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: themevariable.Color_EB772F, fontSize: 12, marginHorizontal: 5, fontFamily: 'InterBold' }}>Booked</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: themevariable.Color_FFF8DF }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ marginHorizontal: 2, fontFamily: 'InterRegular', fontWeight: '600' }}> {item?.seatingCapacity}</Text>
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
        if (name === 'Clothes') {
            navigation.navigate('CategoriesList', { catType: 'clothes' });
        } else if (name === 'Jewellery') {
            navigation.navigate('CategoriesList', { catType: 'jewels' });
        }
        // Add other conditions for different categories if needed
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ marginBottom: 70 }} >
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>
                    <View style={styles.topContainer}>
                        <View style={styles.locationContainer}>
                            <Text style={styles.currentLoc}>Your current location</Text>
                            {/* navigation.navigate('LocationAdded') */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => getLocation()} style={styles.getLoc}>
                                    <LocationMarkIcon />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('LocationAdded') }}>
                                    <Text numberOfLines={1} style={styles.retrievedLoc}>{userLocationFetched?.display_name ? userLocationFetched?.display_name : userLocationFetched?.address}</Text>
                                    <ArrowDown />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
                            <FontAwesome name={"user-circle"} color={"#000000"} size={35} />
                        </Pressable>

                    </View>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchProduct}>
                            <View style={styles.searchProHeader}>
                                <SearchIcon style={{ marginLeft: 10 }} />
                                <TextInput
                                    placeholder="Search by products"
                                    style={styles.textInput} />
                            </View>
                        </View>
                        <View style={styles.filterView}>
                            <FilterIcon />
                        </View>
                    </View>
                    <Swiper
                        autoplay
                        autoplayTimeout={3}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                        style={{ height: Dimensions.get('window').height / 4, }}
                    >
                        {bannerImages.map((item, index) => {
                            const SvgComponent = item?.image;
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
                                >
                                    <SvgComponent
                                        width="90%"
                                        height="100%"
                                        style={{ alignSelf: "center" }}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </Swiper>
                    {/* </View> */}

                    <View style={styles.infoBoxContainer}>

                        <InfoBox
                            IconComponent={MoneyWavy}
                            mainText="100%"
                            subText="Cost Efficient"
                        />
                        <View style={styles.verticalLine} />
                        <InfoBox
                            IconComponent={Cloth}
                            mainText="1500+"
                            subText="Products"
                        />
                        <View style={styles.verticalLine} />
                        <InfoBox
                            IconComponent={Cheers}
                            mainText="1500+"
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
            </ScrollView>
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
        color: '#7D7F88;',
        fontSize: 12,
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
        fontSize: 16,
        fontWeight: '400',
        marginHorizontal: 5,
        // width:'60%'
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
        alignSelf: "center"
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
});

export default HomeDashboard;