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
import LinearGradient from "react-native-linear-gradient";

const Caterings = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [tentHouseData, setTentHouseData] = useState([]);
    const [decorationsData, setDecorationsData] = useState([]);
    const [cateringsData, setCateringsData] = useState([]);

    const [getUserAuth, setGetUserAuth] = useState('');
    const suggestions = ['Events', 'Function Hall', 'Food', 'Catering', 'Tent House', 'Decoration', 'Halls'];
    const Cats = [TentHouseIcon, TentHouseIcon, TentHouseIcon, TentHouseIcon];
    const [selectedCategory, setSelectedCategory] = useState('Catering');
    const userLocationFetched = useSelector((state) => state.userLocation);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    // console.log("user selevcted address is events::::::::", userLocationFetched)

    useEffect(() => {
        if (selectedCategory === 'Halls') {
            getAllEvents(currentPage);
        } else if (selectedCategory === 'Catering') {
            getAllCaterings(currentPage);
        }
    },[selectedCategory])

    const MAX_DESTINATIONS_PER_BATCH = 25;

    const splitArrayIntoChunks = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const getDistanceMatrixForAll = async (origin, locations) => {
        const locationChunks = splitArrayIntoChunks(locations, MAX_DESTINATIONS_PER_BATCH);
        const allDistances = [];

        for (const chunk of locationChunks) {
            const distanceMatrix = await getDistanceMatrix(origin, chunk);
            // console.log("Distance matrix is:::::::::", distanceMatrix);

            if (distanceMatrix.status === "OK") {
                const distances = distanceMatrix.rows[0].elements.map((element, index) => {
                    if (element.status === "OK" && element.distance) {
                        return {
                            ...chunk[index],
                            distanceText: element.distance.text,
                            distanceValue: element.distance.value,
                        };
                    } else {
                        console.warn(`Invalid distance data for destination: ${chunk[index].latitude}, ${chunk[index].longitude}`);
                        return {};  // Return an empty object for invalid data
                    }
                });
                allDistances.push(...distances);
            } else {
                console.error('Error in one of the batches:', distanceMatrix.status);
            }
        }
        return allDistances;
    };


    const API_KEY = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';

    const getDistanceMatrix = async () => {
        // const originStr = `${origin.latitude},${origin.longitude}`;
        // const destinationsStr = destinations
        //     .map((dest) => `${dest.latitude},${dest.longitude}`)
        //     .join('|');

        // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originStr}&destinations=${destinationsStr}&key=${API_KEY}`;
        const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?units=metric&origins=51.4822656,-0.1933769&destinations=51.4994794,-0.1269979&key=${API_KEY}`
        try {
            const response = await axios.get(url);
            console.log('response data is for matrxi apis is:::: ::>>', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching Distance Matrix:', error);
            throw error;
        }
    };

    const sortLocationsByDistance = async (origin, locations, eventsData) => {
        // console.log("events data receivedd is::::::::::;", eventsData);
        try {
            const allDistances = await getDistanceMatrixForAll(origin, locations);

            const validDistances = allDistances.filter((distanceData) => {
                return distanceData.distanceValue !== undefined;  // Filter out invalid distances
            });

            validDistances.sort((a, b) => a.distanceValue - b.distanceValue);

            const sortedEventsData = validDistances.map(distanceData => {
                const matchingEvent = eventsData.find(
                    event => event.latitude === distanceData.latitude && event.longitude === distanceData.longitude
                );
                return { ...matchingEvent, ...distanceData };
            });

            return sortedEventsData;
        } catch (error) {
            console.error('Error sorting locations by distance:', error);
        }
    };




    const [text, setText] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const filterSuggestions = (inputText) => {
        const filtered = suggestions.filter(
            (item) => item.toLowerCase().indexOf(inputText.toLowerCase()) !== -1
        );
        setFilteredSuggestions(filtered);
    };

    const handleTextChange = (inputText) => {
        setText(inputText);
        filterSuggestions(inputText);
    };

    const handleSuggestionPress = (item) => {
        setText(item);
        setFilteredSuggestions([]);
    };

    const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
        // You can also perform any other actions needed when the category changes
    };
    // console.log("SELECTED FILETRS", selectedCategory)

    const loadMoreFunctionHalls = () => {
        // if (hasMore && !loading) {
        //     console.log('hasmore values::>>>',hasMore,loading);
        //     getAllEvents(currentPage + 1);
        // }
    };

    const loadMoreCaterings = () => {
        if (hasMore && !loading) {
            console.log('hasmore values::>>>',hasMore,loading);
            getAllCaterings(currentPage + 1);
        }
    };

    const getAllEvents = async (page) => {
        setLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHalls?page=${page}&limit=10`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newFunctionHalls = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            console.log('resp is::>>>',response?.data);
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
    }

    const getAllEventsOld = async () => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHalls`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log('events response is::::::::', response?.data);
            setEventsData(response?.data);
            console.log("insdie events call::::;", userLocationFetched);
            const origin = {
                latitude: userLocationFetched?.lat ? userLocationFetched?.lat : userLocationFetched?.latitude,
                longitude: userLocationFetched?.lon ? userLocationFetched?.lon : userLocationFetched?.longitude
            };


            console.log("origin avlues :::::::::::", origin)
            const locations = response?.data.map(item => ({
                latitude: item.latitude,
                longitude: item.longitude,
            }));
            // const sortedEvents = await sortLocationsByDistance(origin, locations, response?.data);
            // setEventsData(sortedEvents);  // Set the sorted data
            getDistanceMatrix()
        } catch (error) {
            console.log("events data error>>::", error);
        }
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

    // const getAllCateringsOld = async () => {
    //     const token = await getUserAuthToken();
    //     try {
    //         const response = await axios.get(`${BASE_URL}/getAllFoodCaterings`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         // console.log('catering response is::::::::', JSON.stringify(response?.data));
    //         setCateringsData(response?.data)
    //     } catch (error) {
    //         console.log("caterings data error>>::", error);
    //     }
    // };

    const renderTentHouseItem = ({ item }) => {

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
                                onPress={() => navigation.navigate('ViewTentHouse', { categoryId: item?._id })}
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
                    onPress={() => {
                        if (selectedCategory === 'Tent House') {
                            navigation.navigate('ViewTentHouse', { categoryId: item?._id });
                        } else if (selectedCategory === 'Catering') {
                            navigation.navigate('ViewCaterings', { categoryId: item?._id });
                        }
                    }} style={{ width: Dimensions.get('window').width - 50, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: 'black', fontSize: 17, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.tentHouseName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <LocationMarkIcon style={{ marginTop: 5 }} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: '#696969', fontSize: 13, marginTop: 5, fontFamily: "ManropeRegular" }}>{item?.tentHosueAddress?.address}</Text>
                            </View>
                        </View>
                        {/* <View>
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 18, fontFamily: "ManropeRegular" }}>{formatAmount(item?.price)}<Text style={{ color: "gray", fontSize: 16 }}> /day</Text></Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                <Text style={styles.strickedoffer}>₹20000</Text>
                                <Text style={styles.off}> 20% off</Text>
                            </View>
                        </View> */}
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>

                        {/* <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12, width: '100%' }}>{item?.description}</Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "50%" }}>

                        <View style={{ backgroundColor: item?.available ? "#FEF7DE" : "#FEF7DE", flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Booked</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "#FEF7DE", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 13 }}> Min 30- Max 500</Text>
                        </View>
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
                                    headers: { Authorization: `Bearer ${getUserAuth}` }
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <LocationMarkIcon style={{ marginTop: 5 }} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: '#696969', fontSize: 13, marginTop: 5, fontFamily: "ManropeRegular" }}>{item?.foodCateringAddress?.address}</Text>
                            </View>
                        </View>
                        {/* <View>
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 18, fontFamily: "ManropeRegular" }}>{formatAmount(item?.price)}<Text style={{ color: "gray", fontSize: 16 }}> /day</Text></Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                <Text style={styles.strickedoffer}>₹20000</Text>
                                <Text style={styles.off}> 20% off</Text>
                            </View>
                        </View> */}
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>

                        {/* <Text style={{ fontWeight: '600', color: '#696969', fontSize: 12, width: '100%' }}>{item?.description}</Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "50%" }}>

                        <View style={{ backgroundColor: item?.available ? "#FEF7DE" : "#FEF7DE", flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Booked</Text>
                            }
                        </View>

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

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

                        <View style={{ backgroundColor: item?.available ? "#FEF7DE" : "#FEF7DE", flexDirection: 'row', alignSelf: "center", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Image source={require('../../assets/available.png')} style={{ width: 15, height: 15 }} />
                            {item?.available ?
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Available</Text>
                                :
                                <Text style={{ fontWeight: '600', color: '#4A4A4A', fontSize: 13, marginHorizontal: 5, fontFamily: "ManropeRegular" }}>Booked</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "#FEF7DE", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}>
                            <Image source={require('../../assets/people.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 13 }}> {item?.seatingCapacity}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "#FEF7DE", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}>
                            <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 13 }}> {item?.distanceText}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const returnCategoriesCount = () => {
        let count = 0;
            count = cateringsData?.length;
            return count;
    }

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: "10%" }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>

            <View style={{ backgroundColor: "white" ,marginTop:20}}>
                <View style={styles.searchProduct}>
                    <View style={styles.searchProHeader}>
                        <SearchIcon style={{ marginLeft: verticalScale(20) }} />
                        <TextInput
                            placeholder="Search fashion"
                            style={styles.textInput} />
                        <FilterIcon />
                    </View>
                </View>
                {/* <CategoryFilter onCategoryChange={handleCategoryChange} /> */}
            </View>

            <View style={{ marginHorizontal: 20 }}>
                <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular", }}>Near your location</Text>
                <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "500", fontFamily: "ManropeRegular", }}>{returnCategoriesCount()} {selectedCategory} Service in Hyderabad</Text>
            </View>
            {selectedCategory === 'Halls' ?
                    <FlatList
                        data={eventsData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreFunctionHalls} // Fetch more when list ends
                        onEndReachedThreshold={0.5} // Trigger when user scrolls near the bottom
                        ListFooterComponent={() =>
                            loading ? <ActivityIndicator size="large" color="#FEF7DE" /> : null
                        }
                        ListEmptyComponent={
                            <View >
                              <Text>No Products Available</Text>
                            </View>
                          }
                    />
                    :
                        selectedCategory === 'Catering' ?
                            <FlatList
                                data={cateringsData}
                                renderItem={renderFoodCaterings}
                                keyExtractor={(item) => item._id}
                                onEndReached={loadMoreCaterings}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={() => 
                                    loading ? <ActivityIndicator size="large" color="#FEF7DE" /> : null
                                }
                            />
                            : null}
                            </LinearGradient>
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

export default Caterings;
