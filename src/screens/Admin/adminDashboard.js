import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, Alert, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import FilterIcon from '../../assets/svgs/filter.svg';
import Swiper from "react-native-swiper";
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { verticalScale } from "../../utils/scalingMetrics";
import { getUserAuthToken, getVendorAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [foodCateringsData, setFoodCateringsData] = useState([]);
    const [clothJewelsData, setClothJewelsData] = useState([]);
    const userLocationFetched = useSelector((state) => state.userLocation);
    const [getVendorAuth, setGetVendorAuth] = useState('');

    useEffect(() => {
        getAllEvents();
        getAllFoodCaterings();
        getAllClothJewels();
    }, [])

    const getAllEvents = async () => {
        const token = await getVendorAuthToken();
        setGetVendorAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllAdminFunctionHalls`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('resp is in admin function halls::>>>', response);
            const newFunctionHalls = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            if (response?.data?.data?.length > 0) {
                setEventsData(newFunctionHalls); // Append new data
            }
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
    }

    const getAllFoodCaterings = async () => {
        // getAllAdminFoodCaterings
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllAdminFoodCaterings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('resp is in admin function halls::>>>', response);
            const foodCaterings = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            if (response?.data?.data?.length > 0) {
                setFoodCateringsData(foodCaterings); // Append new data
            }
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
    }

    // getAllAdminClothJewels
    const getAllClothJewels = async () => {
        // getAllAdminFoodCaterings
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllAdminClothJewels`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('resp is in admin function halls::>>>', response);
            const allClothJewels = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            if (response?.data?.data?.length > 0) {
                setClothJewelsData(allClothJewels); // Append new data
            }
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
    }

    // /functionhallrecord/verify

    const verifyStatusOfProducts = async (status, postId, catType) => {
        const token = await getVendorAuthToken();
        // console.log('vendorId is:::',vendorId,postId);
        let payload = {
            id: postId,
            status: status,
        }
        console.log("toggle payloa d:;", payload);

        
        let Model;
        switch (catType) {
            case 'functionhall':
                Model = 'functionhallrecord/verify';
                break;
            case 'caterings':
                Model = 'foodcateringrecord/verify';
                break;
            case 'clothjewels':
                Model = 'clothjewelrecord/verify';
                break;
            default:
                return res.status(400).send({ message: 'Invalid model type' });
        }
        
        try {
            const response = await axios.patch(`${BASE_URL}/${Model}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('response toggle availability is:::>>', response);
            if (response?.status == 200) {
                showSuccessToggleAlert();
            }
        } catch (error) {
            console.log("vendor/productRecord/availability error::::::::::", error);
        }
    };

    const showSuccessToggleAlert = () => {
        Alert.alert(
            "Confirmation",
            "Your Product verification status has been Updated successfully.",
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


    const showApprovalConfirmation = (status, postId, catType) => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to update verification status?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => verifyStatusOfProducts(status, postId, catType) }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => {

        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));

        return (
            <View style={{ borderRadius: 20, marginHorizontal: 20, marginBottom: 5, elevation: -10 }}>
                <View style={[styles.container]}>
                    <Swiper
                        style={styles.wrapper}
                        loop={true}
                        // autoplay={true}
                        onIndexChanged={() => { }}
                        activeDotColor="#FFFFFF"
                        dotColor="#FFFFFF"
                        activeDotStyle={{ width: 12, height: 12, borderRadius: 6 }}
                        dot={<View style={{ backgroundColor: '#FFFFFF', width: 8, height: 8, borderRadius: 6, marginHorizontal: 8 }} />}
                    >
                        {imageUrls.map((itemData, index) => (
                            <TouchableOpacity style={styles.slide} key={index}
                                onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                            >
                                <FastImage source={{
                                    uri: itemData,
                                    headers: { Authorization: `Bearer ${getVendorAuth}` }
                                }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ width: Dimensions.get('window').width - 50, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: 'black', fontSize: 17, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.functionHallName}</Text>

                        </View>
                        <View>
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 18, fontFamily: "ManropeRegular" }}>{formatAmount(item?.rentPricePerDay)}<Text style={{ color: "gray", fontSize: 16 }}> /day</Text></Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { showApprovalConfirmation('approved', item?._id, 'functionhall') }}>
                            <Text style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10, fontWeight: '800', fontFamily: "ManropeRegular", }}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { showApprovalConfirmation('rejected', item?._id, 'functionhall') }}>
                            <Text style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10, fontWeight: '800', fontFamily: "ManropeRegular", }}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderFoodCaterings = ({ item }) => {
        //    const token = await getUserAuthToken()
        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        // console.log("insdie render item")
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));

        // console.log("IMAGE URLS IS:::::::::::::", imageUrls)
        return (
            <View style={{ borderRadius: 20, marginHorizontal: 20, marginBottom: 5, elevation: -10 }}>
                <View style={[styles.container]}>
                    <Swiper
                        style={styles.wrapper}
                        loop={false}
                        onIndexChanged={() => { }}
                        activeDotColor="#FFFFFF"
                        dotColor="#FFFFFF"
                        activeDotStyle={{ width: 12, height: 12, borderRadius: 6 }}
                        dot={<View style={{ backgroundColor: '#FFFFFF', width: 8, height: 8, borderRadius: 6, marginHorizontal: 8 }} />}
                    >
                        {imageUrls.map((itemData, index) => (
                            <TouchableOpacity style={styles.slide} key={index}
                                onPress={() => navigation.navigate('ViewCaterings', { categoryId: item?._id })}
                            >
                                <FastImage source={{
                                    uri: itemData,
                                    headers: { Authorization: `Bearer ${getVendorAuth}` }
                                }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (selectedCategory === 'Tent House') {
                            navigation.navigate('ViewTentHouse', { categoryId: item?._id });
                        } else if (selectedCategory === 'Catering') {
                            navigation.navigate('ViewCaterings', { categoryId: item?._id });
                        }
                    }} style={{ width: Dimensions.get('window').width - 50, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: 'black', fontSize: 17, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.foodCateringName}</Text>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { showApprovalConfirmation('approved', item?._id, 'caterings') }}>
                            <Text style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10, fontWeight: '800', fontFamily: "ManropeRegular", }}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { showApprovalConfirmation('rejected', item?._id, 'caterings') }}>
                            <Text style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10, fontWeight: '800', fontFamily: "ManropeRegular", }}>Reject</Text>
                        </TouchableOpacity>
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    const renderClothJewels = ({ item }) => {

        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));

        return (
            <View style={{ borderRadius: 20, marginHorizontal: 20, marginBottom: 5, elevation: -10 }}>
                <View style={[styles.container]}>
                    <Swiper
                        style={styles.wrapper}
                        loop={true}
                        // autoplay={true}
                        onIndexChanged={() => { }}
                        activeDotColor="#FFFFFF"
                        dotColor="#FFFFFF"
                        activeDotStyle={{ width: 12, height: 12, borderRadius: 6 }}
                        dot={<View style={{ backgroundColor: '#FFFFFF', width: 8, height: 8, borderRadius: 6, marginHorizontal: 8 }} />}
                    >
                        {imageUrls.map((itemData, index) => (
                            <TouchableOpacity style={styles.slide} key={index}
                                onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                            >
                                <FastImage source={{
                                    uri: itemData,
                                    headers: { Authorization: `Bearer ${getVendorAuth}` }
                                }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{ width: Dimensions.get('window').width - 50, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: 'black', fontSize: 17, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.functionHallName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <LocationMarkIcon style={{ marginTop: 5 }} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: '#696969', fontSize: 13, marginTop: 5, fontFamily: "ManropeRegular" }}>{item?.functionHallAddress?.address}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 18, fontFamily: "ManropeRegular" }}>{formatAmount(item?.rentPricePerDay)}<Text style={{ color: "gray", fontSize: 16 }}> /day</Text></Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "50%" }}>

                        <View style={{ backgroundColor: item?.available ? "orange" : "orange", flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Booked</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "orange", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 13 }}> {item?.seatingCapacity}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "orange", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}>
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 13 }}> {item?.distance}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const returnCategoriesCount = () => {
        let count = 0;
        count = eventsData?.length;
        return count;
    }

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: "10%" }}>
            <View style={{ backgroundColor: "white" }}>
                <View style={styles.searchProduct}>
                    <View style={styles.searchProHeader}>
                        <SearchIcon style={{ marginLeft: verticalScale(20) }} />
                        <TextInput
                            placeholder="Search fashion"
                            style={styles.textInput} />
                        <FilterIcon />
                    </View>
                </View>
            </View>

            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View>
                    <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular", }}>Near your location</Text>
                    <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "500", fontFamily: "ManropeRegular", }}>{returnCategoriesCount()} Function Halls</Text>
                </View>

            </View>
            <ScrollView>

                <FlatList
                    data={eventsData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                />

                <FlatList
                    data={foodCateringsData}
                    renderItem={renderFoodCaterings}
                    keyExtractor={(item) => item._id}
                />

                <FlatList
                    data={clothJewelsData}
                    renderItem={renderClothJewels}
                    keyExtractor={(item) => item._id}
                />
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    calendarViewStyle: {
        width: '70%',
        height: 'auto',
        padding: 10,
        backgroundColor: '#FFF2F1F7',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    wrapper: {
        height: 200,
    },
    strickedoffer: {
        fontSize: 12,
        color: "black",
        fontWeight: "200",
        marginLeft: 7,
        textDecorationLine: 'line-through'
    },
    searchContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "space-between",
        borderColor: '#E3E3E7',
        borderWidth: 1,
        borderRadius: 22,
        backgroundColor: '#F2F2F3'
    },
    searchProduct: {
        height: 45,
        backgroundColor: '#F2F2F3',
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 50,
        borderColor: "#E3E3E7",
        borderWidth: 0.8,
        marginTop: 10,
        marginBottom: 15
    },
    searchProHeader: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center",
        width: "80%"
    },
    filterView: {
        height: 45,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        alignSelf: 'center',
        width: Dimensions.get('window').width - 50,
        // backgroundColor:'red'
    },
    image: {
        width: '100%',
        height: "95%",
        resizeMode: 'cover',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#F0F5FA'
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: "95%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // backgroundColor:'red'
    },
    off: {
        fontSize: 13,
        color: "#ed890e",
        fontWeight: "bold"
    },
})

export default AdminDashboard;
