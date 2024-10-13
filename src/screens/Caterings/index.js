import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import FilterIcon from '../../assets/svgs/filter.svg';
import Swiper from "react-native-swiper";
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { verticalScale } from "../../utils/scalingMetrics";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import Autocomplete from 'react-native-autocomplete-input';
import IonIcon from 'react-native-vector-icons/Ionicons';
import OfferStikcer from '../../assets/svgs/offerSticker.svg';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';

const Caterings = () => {
    const navigation = useNavigation();
    const [cateringsData, setCateringsData] = useState([]);

    const [getUserAuth, setGetUserAuth] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Catering');
    const userLocationFetched = useSelector((state) => state.userLocation);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalNearByPages, setTotalNearByPages] = useState(0);
    const [nearByCurrentPage, setNearByCurrentPage] = useState(1);
    const [nearByData, setNearByData] = useState([]);
    const [hasMoreNearBy, setHasMoreNearBy] = useState(true);
    const [nearByLoading, setNearByLoading] = useState(false);
    const [nearByClicked, setNearByClicked] = useState(false);
    const [allLocations, setAllLocations] = useState([]);
    const [query, setQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [locationBasedData, setLoactionBasedData] = useState([]);

    const userLatitude = userLocationFetched?.lat ? userLocationFetched?.lat : userLocationFetched?.latitude;
    const userLongitude = userLocationFetched?.lon ? userLocationFetched?.lon : userLocationFetched?.longitude;
    console.log("latitue long", userLatitude, '+++++++++', userLongitude, userLocationFetched);

    // console.log("user selevcted address is events::::::::", userLocationFetched)

    useEffect(() => {
        getAllCaterings(currentPage);
        getAllLocations();
    }, []);


    const loadMoreCaterings = () => {
        if (hasMore && !loading) {
            getAllCaterings(currentPage + 1); // Fetch the next page
            setCurrentPage((prev) => prev + 1); // Increment page number
        }
    };

    // This function loads more nearby function halls and ensures the page is incremented correctly
    const loadMoreNearByCaterings = () => {
        if (hasMoreNearBy && !nearByLoading) {
            getNearByCaterings(nearByCurrentPage + 1); // Fetch the next page
            setNearByCurrentPage((prev) => prev + 1); // Increment page number
        }
    };

    const handleAllFoodCateringsPress = async () => {
        // Reset the current page and data
        setNearByClicked(false); // Set "All events" view
        setCurrentPage(1); // Reset page to 1
        setNearByCurrentPage(1); // Reset nearby page to 1
        setCateringsData([]); // Clear current event data
        setHasMore(true); // Reset pagination control
        await getAllCaterings(1); // Fetch initial page of all events
    };

    const handleNearByFoodCateringsPress = async () => {
        // Reset the nearby page and data
        setNearByClicked(true); // Set "Nearby" view
        setCurrentPage(1); // Reset page to 1
        setNearByCurrentPage(1); // Reset nearby page to 1
        setNearByData([]); // Clear nearby event data
        setHasMoreNearBy(true); // Reset pagination control
        await getNearByCaterings(1); // Fetch initial page of nearby events
    };

    const getAllCaterings = async (page = 1) => {
        setLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodCaterings?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newCateringsData = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            console.log('resp is caterings ::>>>', response?.data?.data);
            if (response?.data?.data?.length > 0) {
                setCateringsData((prevData) => [...prevData, ...newCateringsData]); // Append new data
                setCurrentPage(page);
            } else {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching food caterings:', error);
        }
        setLoading(false);
    };

    const getAllCateringsByLocation = async (value) => {
        console.log("value is :::",value);
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodCateringsByLocation/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("location select res:::::::", response);
            setLoactionBasedData(response?.data?.data);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching function halls:', error);
        }
        setLoading(false);
    };

    const getAllLocations = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/user/locationList`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllLocations(response?.data?.data);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching function halls:', error);
        }
        setLoading(false);
    };

    const filteredData = allLocations?.filter(item =>
        item?.value.toLowerCase().includes(query.toLowerCase())
    );

    const handleQueryChange = (text) => {
        setQuery(text);
        if (text.length > 0) {
            setDropdownVisible(true);  // Show dropdown when typing
        } else {
            setDropdownVisible(false);  // Hide dropdown if query is cleared
        }
       
    };
    const handleSelect = (value) => {
        setQuery(value); 
        setDropdownVisible(false);
        if (value) {
            getAllCateringsByLocation(value);
        }
    };


    const getNearByCaterings = async (nearByPage) => {
        setCateringsData([]);
        setNearByLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        console.log('userLocationFetched?.latitude caters is::>>', userLatitude, userLongitude)
        try {
            const response = await axios.get(`${BASE_URL}/getNearByFoodCaterings?page=${nearByPage}&limit=10&latitude=${userLatitude}&longitude=${userLongitude}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newCaterings = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            // console.log('resp is::>>>', response?.data);
            setTotalNearByPages(response?.data?.totalPages);
            if (response?.data?.data?.length > 0) {
                setNearByData((prevData) => [...prevData, ...newCaterings]); // Append new data
                setNearByCurrentPage(nearByPage);
            } else {
                setHasMoreNearBy(false); // No more data to load
            }
        } catch (error) {
            setNearByLoading(false);
            console.error('Error fetching function halls:', error);
        }
        setNearByLoading(false);
    }

    const renderFoodCaterings = ({ item }) => {
        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));
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
                        dot={<View style={{ backgroundColor: '#FFFFFF', width: 7, height: 7, borderRadius: 6, marginHorizontal: 8 }} />}
                    >
                        {imageUrls.map((itemData, index) => (
                            <>
                                <TouchableOpacity style={styles.slide} key={index}
                                    onPress={() => navigation.navigate('ViewCaterings', { categoryId: item?._id })}
                                >
                                    <FastImage source={{
                                        uri: itemData,
                                        headers: { Authorization: `Bearer ${getUserAuth}` }
                                    }} style={styles.image} />
                                </TouchableOpacity>
                                {item?.discountPercentage ?
                                    <>
                                        <OfferStikcer style={{
                                            position: 'absolute',
                                            // alignSelf:"flex-end"
                                            top: 5,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                        }} />
                                        <View style={{
                                            position: 'absolute',
                                            top: 5,
                                            left: 5,
                                            right: 0,
                                            bottom: 0,

                                        }}>
                                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700", fontFamily: 'ManropeRegular' }}>{item?.discountPercentage}%</Text>
                                            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700", fontFamily: 'ManropeRegular' }}>Off</Text>
                                        </View>
                                    </> : null}
                            </>
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
                    }} style={{ width: Dimensions.get('window').width - 30, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: '#101010', fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.foodCateringName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <LocationMarkIcon />
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: "90%", fontWeight: '400', marginHorizontal: 5, color: '#939393', fontSize: 13, fontFamily: "ManropeRegular" }}>{item?.county}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:10 }}>

                        {/* <View style={{ backgroundColor: item?.available ? "orange" : "orange", flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Booked</Text>
                            }
                        </View> */}
                        <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, alignItems: "center",paddingVertical:5 }}>
                            <Text>{item?.foodType == 'Both' ? <VegNonVegIcon /> : item?.foodType == 'veg' ? <VegIcon /> : <NonVegIcon />}</Text>
                            <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}>{item?.foodType == 'Both' ? 'VEG/NON-VEG' : item?.foodType == 'vEG' ? 'VEG' : 'NON-VEG'}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const returnCategoriesCount = () => {
        let count = 0;
        count = query ? locationBasedData?.length : cateringsData?.length;
        return count;
    }

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: "10%" }}>
            <View style={{ flex: 1 }}>

                <View style={styles.autocompleteContainer}>

                    <Autocomplete
                        data={dropdownVisible && filteredData?.length > 0 ? filteredData : []}  // Conditionally hide results based on dropdownVisible
                        value={query}
                        onChangeText={handleQueryChange}  // Handle query changes
                        placeholder="Seach Location..."
                        flatListProps={{
                            keyExtractor: (item) => item?._id.toString(),
                            renderItem: ({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item?.value)}>
                                    <Text style={{ padding: 10 }}>{item?.value}</Text>
                                </TouchableOpacity>
                            ),
                        }}
                        inputContainerStyle={{
                            borderRadius: 35,
                            height: 50,
                            width: "90%",
                            alignSelf: "center",
                            marginTop: 10,
                            backgroundColor: "#E3E3E7",

                        }}
                        style={{ marginTop: 3, borderRadius: 15, width: "90%", alignSelf: "center", backgroundColor: "#E3E3E7" }}
                        hideResults={dropdownVisible === false || filteredData.length === 0}  // Hide results initially and when dropdownVisible is false
                    />
                    <TouchableOpacity style={{ position: 'absolute', justifyContent: 'flex-end', right: 30, marginTop: 20 }} onPress={() => {
                        setQuery(''); // Clear the input value
                    }}>
                        <IonIcon name="close-circle" size={24} color="gray" style={{ marginTop: 0 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row', marginTop: 60 }}>
                    <View>
                        <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular", }}>Near your location</Text>
                        <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "500", fontFamily: "ManropeRegular", }}>{returnCategoriesCount()} Catering Services in Hyderabad</Text>
                    </View>
                </View>

                <FlatList
                    data={query ? locationBasedData : cateringsData}
                    renderItem={renderFoodCaterings}
                    keyExtractor={(item) => item?._id}
                    onEndReached={loadMoreCaterings} // Fetch more when list ends
                    onEndReachedThreshold={0.5} // Trigger when user scrolls near the bottom
                    ListFooterComponent={() =>
                        loading ? <ActivityIndicator size="large" color="orange" /> : null
                    }
                    ListEmptyComponent={
                        <View >
                            <Text>No Function halls found</Text>
                        </View>
                    }
                    contentContainerStyle={{}}
                />

                {/* <FlatList
                    data={cateringsData}
                    renderItem={renderFoodCaterings}
                    keyExtractor={(item) => item._id}
                    onEndReached={loadMoreCaterings}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        loading ? <ActivityIndicator size="large" color="orange" /> : null
                    }
                /> */}

                {/* {!nearByClicked ?
                    <FlatList
                        data={cateringsData}
                        renderItem={renderFoodCaterings}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreCaterings} // Fetch more when list ends
                        onEndReachedThreshold={0.5} // Trigger when user scrolls near the bottom
                        ListFooterComponent={() =>
                            loading ? <ActivityIndicator size="large" color="orange" /> : null
                        }
                        ListEmptyComponent={
                            <View >
                                <Text>{cateringsData?.length == 0 ? 'No Near By Catering services Available please check in all' : 'No Function halls found'}</Text>
                            </View>
                        }
                    />
                    :
                    <FlatList
                        data={nearByData}
                        renderItem={renderFoodCaterings}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreNearByCaterings} // Fetch more when list ends
                        onEndReachedThreshold={0.5} // Trigger when user scrolls near the bottom
                        ListFooterComponent={() =>
                            nearByLoading ? <ActivityIndicator size="large" color="orange" /> : null
                        }
                        ListEmptyComponent={
                            <View >
                                <Text>{nearByData?.length == 0 ? 'No Near By Catering services Available please check in all' : 'No Function halls found'}</Text>
                            </View>
                        }
                    />
                } */}

            </View>
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
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        flexDirection: 'row',
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
        width: Dimensions.get('window').width - 30,
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

export default Caterings;
