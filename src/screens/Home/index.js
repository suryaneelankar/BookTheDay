import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, FlatList, PermissionsAndroid, Pressable, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Wedding from '../../assets/wedding.png';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'
import { height, moderateScale } from "../../utils/scalingMetrics";
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationMarkIcon from '../../assets/svgs/location.svg';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import HomeSwipper from '../../assets/svgs/homeswippers.svg';
import ArrowDown from '../../assets/svgs/arrowDown.svg';
import TentHouseIcon from '../../assets/svgs/categories/tentHouse.svg';
import FuntionalHall from '../../assets/svgs/categories/funtionHalls.svg';
import DecorationsIcon from '../../assets/svgs/categories/decorations.svg';
import CateringIcon from '../../assets/svgs/categories/catering.svg';
import DriversIcon from '../../assets/svgs/categories/drivers.svg';
import ChefIcon from '../../assets/svgs/categories/chefs.svg';
import JewelleryIcon from '../../assets/svgs/categories/jewellery.svg';
import ClothesIcon from '../../assets/svgs/categories/clothes.svg';
import SwipperOne from '../../assets/svgs/homeSwippers/swipperOne.svg';
import MoneyWavy from '../../assets/svgs/MoneyWavy.svg';
import Cloth from '../../assets/svgs/cloth.svg';
import Cheers from '../../assets/svgs/Cheers.svg';
import { LinearGradient } from 'react-native-linear-gradient';
import FilterIcon from '../../assets/svgs/filter.svg';
import RightArrowIcon from '../../assets/svgs/rightArrow.svg';
import themevariable from "../../utils/themevariable";
import { formatAmount } from "../../utils/GlobalFunctions";
import WantDriver from '../../assets/svgs/chefDriver/driver.svg';
import WantChef from '../../assets/svgs/chefDriver/chef.svg';
import Svg, { Circle } from 'react-native-svg';
import InfoBox from "../../components/InfoBox";
import TrendingView from "../../components/TrendingView";
import TrendingShirtImg from '../../assets/svgs/shirtTrending.svg';

const HomeDashboard = () => {
    const [categories, setCategories] = useState([])
    const [address, setAddress] = useState('');
    const [eventsData, setEventsData] = useState([]);

    useEffect(() => {
        getPermissions();
        // getCategories();
        getAllEvents();
    }, []);

    const getAllEvents = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/all-events`);
            setEventsData(response?.data?.data)
        } catch (error) {
            console.log("events data error>>::", error);
        }
    }


    const images = [SwipperOne, SwipperOne, SwipperOne]; //svg images for swipper  
    const wantChefDriver = [WantChef, WantDriver];  
    const trendingImageList = [{name:'Levis Full-Sleeve Blue Shirt',image:TrendingShirtImg},
    {name:'Delicious meals in 1 mins',image:TrendingShirtImg},
    {name:'MAX blue full hands',image:TrendingShirtImg},
    {name:'MAX blue full hands i',image:TrendingShirtImg},
    {name:'levis bluew5555',image:TrendingShirtImg},];

    const newData = [{ name: 'Clothes', image: require('../../assets/clothesIcon.png') },
    { name: 'Jewellery', image: require('../../assets/clothesIcon.png') },
    { name: 'Chefs', image: require('../../assets/clothesIcon.png') },
    { name: 'Driver', image: require('../../assets/clothesIcon.png') },
    { name: 'Tent House', image: require('../../assets/clothesIcon.png') },
    { name: 'Halls', image: require('../../assets/clothesIcon.png') },
    { name: 'Decoration', image: require('../../assets/clothesIcon.png') },
    { name: 'Catering', image: require('../../assets/clothesIcon.png') },
    ]


    useEffect(() => {
        getPermissions();
        getCategories();
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
                    title: 'APP location permission',
                    message: 'App needs location Permissions',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK'
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getLocation()
            } else {
                Alert.alert("Location persmiion denied")
            }
        } catch (err) {
            // console.warn(err)
        }
    }



    const getCategories = async () => {
        console.log("IAM CALLING API in home")
        try {
            const response = await axios.get(`${BASE_URL}/all-category`);
            console.log("categories::::::::::", response?.data?.data);
            setCategories(response?.data?.data)
        } catch (error) {
            console.log("categories::::::::::", error);

        }
    }

    const renderItem = ({ item }) => {

        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ width: Dimensions.get('window').width / 1.3, alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', marginHorizontal: 16, marginTop: 15, height: 'auto' }}>
                    <Image source={{ uri: item?.mainImageUrl }} style={{ borderRadius: 8, width: '100%', padding: 90 }}
                        resizeMode="stretch"

                    />
                    <View style={{ marginTop: 15, justifyContent: 'space-between', }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '700', color: '#131313', fontSize: 16, fontFamily: 'InterBold', width: '48%' }}>{item?.name}</Text>
                            <Text style={{ fontWeight: '700', color: themevariable.Color_B46609, fontSize: 18, fontFamily: 'InterBold' }}>{formatAmount(item?.price)}/day</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesome name={"map-marker"} color={themevariable.Color_777777} size={20} style={{}} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: themevariable.Color_777777, fontSize: 13, marginTop: 5, fontFamily: 'InterBold', bottom: 3 }}>Madhapur,Hyderabad</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                <Text style={styles.strickedoffer}>{formatAmount(item?.price + 1000)}</Text>
                                <Text style={styles.off}> 20% off</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "60%", marginTop: 10, padding: 5 }}>

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
                            <Text style={{ marginHorizontal: 2, fontFamily: 'InterRegular', fontWeight: '600' }}> 300-500</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const { width } = Dimensions.get('window');
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ marginBottom: 70 }} >
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>
                    <View style={styles.topContainer}>
                        <View style={styles.locationContainer}>
                            <Text style={styles.currentLoc}>Your current location</Text>
                            <TouchableOpacity onPress={getLocation} style={styles.getLoc}>
                                <LocationMarkIcon />
                                <Text style={styles.retrievedLoc}>{address?.neighbourhood}, {address?.city}</Text>
                                <ArrowDown />
                            </TouchableOpacity>
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
                                    placeholder="Search by products,"
                                    style={styles.textInput} />
                            </View>
                        </View>
                        <View style={styles.filterView}>
                            <FilterIcon />
                        </View>
                    </View>
                    <View style={{ width: "100%" }}>
                        <SwiperFlatList
                            autoplay
                            autoplayDelay={2}
                            autoplayLoop
                            index={2}
                            showPagination
                            paginationDefaultColor='#DDD4F3'
                            paginationActiveColor='#ECA73C'
                            paginationStyle={{ bottom: -20, }}
                            paginationStyleItem={{ backgroundColor: "red" }}
                            paginationStyleItemInactive={{ width: 8, height: 8 }}
                            paginationStyleItemActive={{ height: 8, width: 20 }}
                            data={images}
                            style={{}}
                            renderItem={({ item: Item }) => (
                                <View style={{ width, flex: 1, alignItems: "center" }}>
                                    <Item />
                                </View>

                            )}
                        />
                    </View>

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

                    <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                        <Text style={{ fontFamily: "ManropeRegular", fontWeight: "700", fontSize: 16, color: '#202020' }}>Categories</Text>
                        <FlatList
                            data={newData}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ padding: 5, alignItems: "center", marginRight: 20 }} >
                                        <Image source={item.image} style={{ height: 60, width: 60, borderRadius: 30, elevation: 2 }} />
                                        <Text style={{ marginTop: 5, fontSize: 13, fontWeight: "500", color: '#202020', fontFamily: "ManropeRegular", }}>{item?.name}</Text>
                                    </View>
                                )
                            }}
                            showsHorizontalScrollIndicator={false}
                            numColumns={4}
                        />
                    </View>
                </LinearGradient>

                <View style={{marginTop:40,}}>
                <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.onDemandTextStyle}>Trending Now</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Text style={[styles.onDemandTextStyle, { marginHorizontal: 5 }]}>See All</Text>
                        <RightArrowIcon width={25} height={25} />
                    </TouchableOpacity>
                </View>

                <TrendingView 
                data={trendingImageList}
                />
                </View>

                        <SwiperFlatList
                            index={2}
                            showPagination
                            paginationDefaultColor='#DDD4F3'
                            paginationActiveColor='#ECA73C'
                            paginationStyle={{bottom: -20}}
                            paginationStyleItem={{ backgroundColor: "red" }}
                            paginationStyleItemInactive={{ width: 8, height: 8 }}
                            paginationStyleItemActive={{ height: 8, width: 20 }}
                            data={wantChefDriver}
                            style={{width}}
                            renderItem={({ item: Item }) => (
                                <View style={{ width, flex: 1, alignItems: "center"}}>
                                    <Item />
                                </View>
                            )}
                        />

                <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.onDemandTextStyle}>On Demand Halls</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Text style={[styles.onDemandTextStyle, { marginHorizontal: 5 }]}>See All</Text>
                        <RightArrowIcon width={25} height={25} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={eventsData}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />

            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center', backgroundColor: "yellow",
        height: 200, // Adjust the height as needed
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
        // marginLeft: 10,
    },
    locationSubContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginHorizontal: 20,
    },
    locationIcon: {
        marginRight: 8,
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
        marginHorizontal: 5
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
        marginVertical: 25,
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
