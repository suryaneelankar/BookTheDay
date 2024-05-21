import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, PermissionsAndroid, Pressable, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
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
import Svg, { Circle } from 'react-native-svg';

const HomeDashboard = () => {
    const [categories, setCategories] = useState([])
    const [address, setAddress] = useState('');

    useEffect(() => {
        getPermissions();
        getCategories();
    }, []);


    const getLocation = async () => {
        console.log("getting location", location);
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
                console.warn(code, message);
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
            console.warn(err)
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ marginBottom: 70 }} >

                <View style={styles.topContainer}>
                    <View style={styles.locationContainer}>
                        <Text style={{ fontFamily: 'ManropeRegular', color: '#7D7F88', fontSize: 12, fontWeight: '400' }}>Location</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <FontAwesome name={"map-marker"} color={"#B46609"} size={20} style={{ marginHorizontal: 0 }} />
                            <Text style={{ fontFamily: 'ManropeRegular', color: '#1A1E25', fontSize: 16, fontWeight: '400', marginHorizontal: 5 }}>Gachibowli, Hyderabad</Text>
                            <FontAwesome name={"chevron-down"} color={"#000000"} size={15} style={{ marginHorizontal: 5 }} />
                            <FilterIcon width={20} height={20} />
                            <Svg height="50%" width="50%" viewBox="0 0 100 100" >
                                <Circle cx="50" cy="50" r="50" stroke="purple" strokeWidth=".5" fill="violet" />
                            </Svg>
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

                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: "space-between", width: "90%" }}>
                        <Text style={{ color: "black", fontSize: 14, fontWeight: "400" }}>Trending Now</Text>
                        <Text style={{ color: "black", fontSize: 12, fontWeight: "400" }}>View All {'>'}</Text>
                    </View>
                    <ScrollView horizontal style={{ marginHorizontal: 10, }} showsHorizontalScrollIndicator={false}>
                        {categories.filter(item => item.type === 'Trending Now').map((item, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ViewTrendingDetails', { categoryId: item?._id })}
                                key={index} style={styles.card}>
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: 100,
                                    height: 150,
                                    resizeMode: "contain",
                                }} />
                                <Text style={styles.title}>{item?.name}</Text>
                                <Text style={[styles.status, { color: item?.rented ? "#a85705" : "white", backgroundColor: item?.rented ? "#fabdb6" : "green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>

                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: "space-between", width: "90%" }}>
                        <Text style={{ color: "black", fontSize: 14, fontWeight: "400" }}>Brand New</Text>
                        <Text style={{ color: "black", fontSize: 12, fontWeight: "400" }}>View All {'>'}</Text>
                    </View>
                    <ScrollView horizontal style={{ marginHorizontal: 10, }} showsHorizontalScrollIndicator={false}>
                        {categories.filter(item => item.type === 'Brand New').map((item, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ViewTrendingDetails', { categoryId: item?._id })}
                                key={index} style={styles.card}>
                                <Image source={{ uri: item.catImageUrl }} style={{
                                    width: 100,
                                    height: 150,
                                    resizeMode: "contain"
                                }} />
                                <Text style={styles.title}>{item?.name}</Text>
                                <Text style={[styles.status, { color: item?.rented ? "#a85705" : "white", backgroundColor: item?.rented ? "#fabdb6" : "green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                </View>
                <View style={{ marginTop: 30 }}>
                    {editsData.map((item, index) => (
                        <View key={index} style={styles.listcard}>
                            <Image source={item.image} style={{
                                width: "100%",
                                height: 120,
                                borderRadius: 10,
                                // marginBottom: 10,
                            }} />

                            <Text style={{ position: "absolute", left: 20, top: 30, color: "black" }}>{item?.name}</Text>
                        </View>
                    ))}
                </View>



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

