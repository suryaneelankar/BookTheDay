import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, FlatList, PermissionsAndroid, Pressable, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Wedding from '../../assets/wedding.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'
import { LinearGradient } from 'react-native-linear-gradient';
import FilterIcon from '../../assets/svgs/filter.svg';
import RightArrowIcon from '../../assets/svgs/rightArrow.svg';
import themevariable from "../../utils/themevariable";
import { formatAmount } from "../../utils/GlobalFunctions";


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


    const getLocation = async () => {
        // console.log("getting location", location);
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
                console.log(code, message);
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
            console.log(err)
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
                                <Text style={{ fontWeight: '600', color: 'black', fontSize: 12, marginHorizontal: 5,fontFamily: 'InterBold' }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: themevariable.Color_EB772F, fontSize: 12, marginHorizontal: 5,fontFamily: 'InterBold' }}>Booked</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5,backgroundColor:themevariable.Color_FFF8DF }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ marginHorizontal: 2 ,fontFamily: 'InterRegular',fontWeight:'600'}}> 300-500</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const { width } = Dimensions.get('window');
    const navigation = useNavigation();
    const images = [
        require('../../assets/wedding.png'),
        require('../../assets/furniture.jpg'),
        require('../../assets/decoration.jpg'),
    ];
    const editsData = [
        { image: require('../../assets/cameraIcon.jpeg'), name: 'Sardha cameras', status: 'Available' },
        { image: require('../../assets/men.jpeg'), name: 'fashionstore', status: 'Available' },
        { image: require('../../assets/jwellery.jpg'), name: 'trendnow', status: 'Available' },
    ]

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F6F5" }}>
            <ScrollView style={{ marginBottom: 70 }} >

                <View style={styles.topContainer}>
                    <View style={styles.locationContainer}>
                        <Text style={{ fontFamily: 'ManropeRegular', color: '#7D7F88', fontSize: 12, fontWeight: '400' }}>Location</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <FontAwesome name={"map-marker"} color={"#B46609"} size={20} style={{ marginHorizontal: 0 }} />
                            <Text style={{ fontFamily: 'ManropeRegular', color: '#1A1E25', fontSize: 16, fontWeight: '400', marginHorizontal: 5 }}>Gachibowli, Hyderabad</Text>
                            <FontAwesome name={"chevron-down"} color={"#000000"} size={15} style={{ marginHorizontal: 5 }} />
                            <FilterIcon width={20} height={20} />
                        </View>

                        <View style={styles.locationSubContainer}>
                            {address && (
                                <>
                                    <Text style={styles.locationName}>{address?.neighbourhood}, </Text>
                                    <Text style={styles.locationName}>{address?.city?.substring(0, 3)}</Text>

                                    <MaterialIcon name={"keyboard-arrow-down"} color={"#7e7c7c"} size={20} style={{ marginTop: 5 }} />
                                </>)}
                        </View>
                    </View>
                    <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
                        <FontAwesome name={"user-circle"} color={"#000000"} size={35} />
                    </Pressable>

                </View>
                <View style={{ height: 60, width: "100%", alignSelf: "center", paddingVertical: 10, borderBottomColor: "#e0dede", marginBottom: 25 }}>

                    <View style={{ flexDirection: "row", width: "90%", alignSelf: "center", alignItems: "center", borderRadius: 20, borderColor: "#bfb8b8", backgroundColor: "white", borderWidth: 0.8 }}>
                        <Image source={require('../../assets/searchIcon.png')}
                            style={{ height: 15, width: 15, marginLeft: 10, alignSelf: "center" }}
                        />
                        <TextInput
                            placeholder="Browse requirements"
                            style={{ marginLeft: 15, alignSelf: "center", }} />
                    </View>
                </View>
                <View style={{ marginHorizontal: 20, alignSelf: "center", flex: 1 }}>
                    <SwiperFlatList
                        autoplay
                        autoplayDelay={2}
                        autoplayLoop
                        index={2}
                        showPagination
                        paginationDefaultColor='lightgray'
                        paginationActiveColor='gray'
                        paginationStyle={{ position: 'absolute', bottom: -30, left: 0, right: 0 }}
                        paginationStyleItem={{ alignSelf: 'center' }}
                        paginationStyleItemInactive={{ width: 7, height: 7 }}
                        paginationStyleItemActive={{ width: 8, height: 8 }}
                        data={images}
                        style={{}}
                        renderItem={({ item }) => (
                            <View style={[{ backgroundColor: "yellow", flexDirection: "row", width, height: 200, borderRadius: 15 }]}>
                                <View style={{ width: "50%", marginTop: 20, marginHorizontal: 10 }}>
                                    <Text style={{ fontSize: 14, fontWeight: "800", color: "black" }}>New Collection</Text>
                                    <Text style={{ fontSize: 12, fontWeight: "400", color: "black", marginTop: 10, fontFamily: 'ManropeRegular' }}>New Collection now available at store at lowest price</Text>
                                    <Text style={{ backgroundColor: "green", width: "50%", padding: 5, borderRadius: 5, alignItems: "center", marginTop: 10, textAlign: 'center', fontWeight: '900', color: 'white', fontFamily: 'PoppinsRegular' }}>Book Now</Text>
                                </View>
                                <Image source={item} style={styles.image}
                                    resizeMethod="resize"
                                    resizeMode="stretch" />
                            </View>
                        )}
                    />
                </View>

                <View style={{ flexDirection: 'row', width: '88%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 30 }}>
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: '#fff',
    },
    topContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        // paddingVertical:10,
        width: "90%",
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
        marginTop: 5
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
});

export default HomeDashboard;

