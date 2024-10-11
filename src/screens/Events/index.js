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
import TentHouseIcon from '../../assets/svgs/categories/home_tenthouseimage.svg';
import CategoryFilter from "../../components/CategoryFilter";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import themevariable from "../../utils/themevariable";
import Autocomplete from 'react-native-autocomplete-input';


const Events = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [getUserAuth, setGetUserAuth] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nearByCurrentPage, setNearByCurrentPage] = useState(1);
    const [nearByData, setNearByData] = useState([]);
    const [hasMoreNearBy, setHasMoreNearBy] = useState(true);
    const [nearByLoading, setNearByLoading] = useState(false);
    const [nearByClicked, setNearByClicked] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const userLocationFetched = useSelector((state) => state.userLocation);
    const [totalNearByPages, setTotalNearByPages] = useState(0);
    const [totalEventPages, setTotalEventPages] = useState(0);
    const [allLocations, setAllLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [query, setQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);  // New state to handle dropdown visibility



    // console.log("user selevcted address is events::::::::", userLocationFetched)

    // const [userLatitude,setUserLatitude] = useState(userLocationFetched?.latitude);
    // const [userLongitude,setUserLongitude] = useState(userLocationFetched?.longitude);
    // console.log("latitue long", userLatitude ,'+++++++++', userLongitude);
    console.log('userLocationFetched is::>>', userLocationFetched?.latitude, userLocationFetched?.longitude);

    useEffect(() => {
        getAllEvents(currentPage);
        getAllLocations();
    }, [])

    const handleAllEventsPress = async () => {
        // Reset the current page and data
        setNearByClicked(false); // Set "All events" view
        setCurrentPage(1); // Reset page to 1
        setNearByCurrentPage(1); // Reset nearby page to 1
        setEventsData([]); // Clear current event data
        setHasMore(true); // Reset pagination control
        await getAllEvents(1); // Fetch initial page of all events
    };

    const handleNearByEventsPress = async () => {
        // Reset the nearby page and data
        setNearByClicked(true); // Set "Nearby" view
        setCurrentPage(1); // Reset page to 1
        setNearByCurrentPage(1); // Reset nearby page to 1
        setNearByData([]); // Clear nearby event data
        setHasMoreNearBy(true); // Reset pagination control
        await getNearByEvents(1); // Fetch initial page of nearby events
    };

    // This function loads more function halls (all events) and ensures the page is incremented correctly
    const loadMoreFunctionHalls = () => {
        if (hasMore && !loading && currentPage < totalEventPages) {
            getAllEvents(currentPage + 1); // Fetch the next page
            setCurrentPage((prev) => prev + 1); // Increment page number
        }
    };

    // This function loads more nearby function halls and ensures the page is incremented correctly
    const loadMoreNearByFunctionHalls = () => {
        if (hasMoreNearBy && !nearByLoading && nearByCurrentPage < totalNearByPages) {
            getNearByEvents(nearByCurrentPage + 1); // Fetch the next page
            setNearByCurrentPage((prev) => prev + 1); // Increment page number
        }
    };


    const getAllEvents = async (page) => {
        setNearByData([]);
        setLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHalls?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newFunctionHalls = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            setTotalEventPages(response?.data?.totalPages);
            // console.log('resp is::>>>', response?.data);
            if (response?.data?.data?.length > 0) {
                setEventsData((prevData) => [...prevData, ...newFunctionHalls]); // Append new data
                setCurrentPage(page);
            } else {
                setHasMore(false); // No more data to load
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching function halls:', error);
        }
        setLoading(false);
    };

    const getAllEventsByLocation = async (value) => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHallsByLocation/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("location select res:::::::", response);
            setEventsData(response?.data?.data);
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
            console.log("all locations resL::::", response?.data);
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

    const getNearByEvents = async (nearByPage) => {
        const userLat = userLocationFetched?.lat ? userLocationFetched?.lat : userLocationFetched?.latitude;
        const userLong = userLocationFetched?.lon ? userLocationFetched?.lon : userLocationFetched?.longitude;
        console.log('userLatitude in api call::>>', userLocationFetched?.lat, userLocationFetched?.lon);
        setEventsData([]);
        setNearByLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getNearByFunctionHalls?page=${nearByPage}&limit=10&latitude=${userLat}&longitude=${userLong}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newFunctionHalls = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            // console.log('resp is::>>>', response?.data);
            setTotalNearByPages(response?.data?.totalPages);
            if (response?.data?.data?.length > 0) {
                setNearByData((prevData) => [...prevData, ...newFunctionHalls]); // Append new data
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

    const renderItem = ({ item }) => {

        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));

        return (
            <View style={{ flex: 1, borderRadius: 20, marginHorizontal: 20, marginBottom: 5, elevation: -10 }}>
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
                                    headers: { Authorization: `Bearer ${getUserAuth}` }
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
        if (nearByClicked) {
            count = nearByData?.length;
            return count;
        }
        count = eventsData?.length;
        return count;
    };
    console.log("selected query is:::::::", query)
    const handleQueryChange = (text) => {
        setQuery(text);
        if (text.length > 0) {
            setDropdownVisible(true);  // Show dropdown when typing
        } else {
            setDropdownVisible(false);  // Hide dropdown if query is cleared
        }
        // Filter data logic can go here
        // e.g. setFilteredData(filteredDataBasedOnQuery);
    };
    const handleSelect = (value) => {
        setQuery(value);  // Set query to selected item value
        setDropdownVisible(false);  // Hide dropdown after selection
        getAllEventsByLocation(value)
    };
    

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: "10%" }}>
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
                    borderRadius: 15,
                    height:50,
                    width:"90%",
                    alignSelf:"center",
                    marginTop:10,
                    backgroundColor:"#E3E3E7"
                   
                }}
                style={{marginTop:3, borderRadius:15, width:"90%",alignSelf:"center",backgroundColor:"#E3E3E7"}}
                hideResults={dropdownVisible === false || filteredData.length === 0}  // Hide results initially and when dropdownVisible is false
                />
                </View>

            <View style={{marginTop:60, marginHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View>
                    <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular", }}>Near your location</Text>
                    <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "500", fontFamily: "ManropeRegular", }}>{returnCategoriesCount()} Function Halls</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { handleAllEventsPress() }}>
                    <Text style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10, fontWeight: '800', fontFamily: "ManropeRegular", }}>All events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { handleNearByEventsPress() }}>
                    <Text style={{ backgroundColor: 'orange', borderRadius: 10, padding: 10, fontWeight: '800', fontFamily: "ManropeRegular", }}>Near By</Text>
                </TouchableOpacity>

            </View>


            <View style={{ flex: 1 }}>
                {!nearByClicked ?
                    <FlatList
                        data={eventsData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreFunctionHalls} // Fetch more when list ends
                        onEndReachedThreshold={0.5} // Trigger when user scrolls near the bottom
                        ListFooterComponent={() =>
                            loading ? <ActivityIndicator size="large" color="orange" /> : null
                        }
                        ListEmptyComponent={
                            <View >
                                <Text>{eventsData?.length == 0 ? 'No Near By Function halls Available please check in all' : 'No Function halls found'}</Text>
                            </View>
                        }
                    />
                    :
                    <FlatList
                        data={nearByData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreNearByFunctionHalls} // Fetch more when list ends
                        onEndReachedThreshold={0.1} // Trigger when user scrolls near the bottom
                        ListFooterComponent={() =>
                            nearByLoading ? <ActivityIndicator size="large" color="orange" /> : null
                        }
                        ListEmptyComponent={
                            <View >
                                <Text>{nearByData?.length == 0 ? 'No Near By Function halls Available please check in all' : 'No Function halls found'}</Text>
                            </View>
                        }
                    />
                }
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
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
      },
    dropdown: {
        height: 50,
        borderColor: themevariable.Color_C8C8C6,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10
    },
    placeholderStyle: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        color: "gray",
        fontSize: 14,
    },
    selectedText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
        color: "black",
        fontSize: 14,
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

export default Events;
