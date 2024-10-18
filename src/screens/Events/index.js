import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import FilterIcon from '../../assets/svgs/filter.svg';
import Swiper from "react-native-swiper";
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { verticalScale } from "../../utils/scalingMetrics";
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import { Dropdown } from 'react-native-element-dropdown';
import themevariable from "../../utils/themevariable";
import Autocomplete from 'react-native-autocomplete-input';
import IonIcon from 'react-native-vector-icons/Ionicons';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';

const Events = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [getUserAuth, setGetUserAuth] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const userLocationFetched = useSelector((state) => state.userLocation);
    const [totalEventPages, setTotalEventPages] = useState(0);
    const [allLocations, setAllLocations] = useState([]);
    const [query, setQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [locationBasedData, setLoactionBasedData] = useState([]);

    useEffect(() => {
        getAllEvents(currentPage);
        getAllLocations();
    }, [])

    // This function loads more function halls (all events) and ensures the page is incremented correctly
    const loadMoreFunctionHalls = () => {
        if (hasMore && !loading && currentPage < totalEventPages) {
            getAllEvents(currentPage + 1); // Fetch the next page
            setCurrentPage((prev) => prev + 1); // Increment page number
        }
    };

    // This function loads more nearby function halls and ensures the page is incremented correctly
    const getAllEvents = async (page) => {
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

    const renderItem = ({ item }) => {

        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));

        return (
            <View style={{ flex: 1, borderRadius: 20 }}>
                <View style={[styles.container]}>
                    <Swiper
                        style={styles.wrapper}
                        loop={true}
                        // autoplay={true}
                        onIndexChanged={() => { }}
                        activeDotColor="#FFFFFF"
                        dotColor="#FFFFFF"
                        activeDotStyle={{ width: 12, height: 12, borderRadius: 6 }}
                        dot={<View style={{ backgroundColor: '#FFFFFF', width: 7, height: 7, borderRadius: 6, marginHorizontal: 8 }} />}
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
                    style={{ width: Dimensions.get('window').width - 30, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: '#101010', fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.functionHallName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <LocationMarkIcon />
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: "90%", fontWeight: '400', marginHorizontal: 5, color: '#939393', fontSize: 13, fontFamily: "ManropeRegular" }}>{item?.county}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: '800', color: '#202020', fontSize: 14, fontFamily: "ManropeRegular" }}>{formatAmount(item?.rentPricePerDay)}<Text style={{ color: '#202020', fontFamily: "ManropeRegular", fontSize: 12, fontWeight: "400" }}> /day</Text></Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row',marginBottom:10 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}>
                            <Text style={{ color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}> {item?.seatingCapacity} pax</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}>
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}> {item?.bedRooms} Rooms</Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10,alignItems:"center"}}>

                            <Text style={{  }}>{item?.foodType == 'Both' ? <VegNonVegIcon /> : item?.foodType == 'veg' ? <VegIcon /> : <NonVegIcon/>}</Text>
                            <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}>{item?.foodType == 'Both' ? 'VEG/NON-VEG': item?.foodType == 'vEG' ? 'VEG' : 'NON-VEG'}</Text>
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
        if (value) {
            getAllEventsByLocation(value)
        }
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
                    // You can also set dropdownVisible to false if needed
                }}>
                    <IonIcon name="close-circle" size={24} color="gray" style={{ marginTop: 0 }} />
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 60, marginHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View>
                    <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular", }}>Near your location</Text>
                    <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "400", fontFamily: "ManropeRegular", }}>{returnCategoriesCount()} Function Halls in Hyderabad</Text>
                </View>
            </View>

            <FlatList
                data={query ? locationBasedData : eventsData}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                onEndReached={loadMoreFunctionHalls} // Fetch more when list ends
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
    dropdown: {
        height: 50,
        width: 350,
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        paddingHorizontal: 12,
        borderRadius: 5
    },
    placeholderStyle: {
        fontSize: 14,
        color: "gray",
        fontFamily: 'ManropeRegular',
        fontWeight: "400"
    },
    selectedTextStyle: {
        fontSize: 14,
        color: "black",
        fontFamily: 'ManropeRegular',
        fontWeight: "400",
    },
    iconStyle: {
        width: 25,
        height: 25,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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
        zIndex: 1,
        flexDirection: 'row',
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

export default Events;
