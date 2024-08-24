import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList, Pressable, SafeAreaView } from 'react-native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import Icon from 'react-native-vector-icons/FontAwesome';
import SwiperFlatList from 'react-native-swiper-flatlist';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
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

const Events = () => {
    const navigation = useNavigation();
    const [eventsData, setEventsData] = useState([]);
    const [tentHouseData, setTentHouseData] = useState([]);
    const [decorationsData, setDecorationsData] = useState([]);
    const [cateringsData, setCateringsData] = useState([]);

    const [getUserAuth, setGetUserAuth] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const suggestions = ['Events', 'Function Hall', 'Food', 'Catering', 'Tent House', 'Decoration', 'Halls'];
    const Cats = [TentHouseIcon, TentHouseIcon, TentHouseIcon, TentHouseIcon];
    const [selectedCategory, setSelectedCategory] = useState('Tent House');

    useEffect(() => {
        getAllEvents();
        getTentHouse();
        getDecorations();
        getAllCaterings();
    }, []);

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

    const getAllEvents = async () => {
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHalls`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            // console.log('events response is::::::::', response?.data?.data);
            setEventsData(response?.data)
        } catch (error) {
            console.log("events data error>>::", error);
        }
    };

    const getAllCaterings = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodCaterings`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            // console.log('catering response is::::::::', JSON.stringify(response?.data));
            setCateringsData(response?.data)
        } catch (error) {
            console.log("caterings data error>>::", error);
        }
    };

    const getTentHouse = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllTentHouses`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            // console.log('Tent house response is::::::::', JSON.stringify(response?.data))
            setTentHouseData(response?.data)
        } catch (error) {
            console.log("events data error>>::", error);
        }
    };

    const getDecorations = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllDecorations`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            console.log('decorations response is::::::::', JSON.stringify(response?.data))
            setDecorationsData(response?.data)
        } catch (error) {
            console.log("decorations data error>>::", error);
        }
    };

    console.log("usertoken is::::::::", getUserAuth);

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
                                <FastImage  source={{ uri: itemData ,   
                                headers:{Authorization : `Bearer ${getUserAuth}`}
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

    const renderFoodCaterings =  ({ item }) => {
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
                                <FastImage source={{ uri: itemData, 
                                    headers:{Authorization : `Bearer ${getUserAuth}`}
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

    const renderDecorationItem = ({ item }) => {

        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        const imageUrls = item?.packages.flatMap(packageItem =>
            packageItem.packageImages.map(image => convertLocalhostUrls(image.url))
        );
    
        console.log("IMAGE URLS IS:::::::::::::", imageUrls)
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
                                onPress={() => navigation.navigate('ViewDecors', { categoryId: item?._id })}
                            >
                                <FastImage source={{ uri: itemData,
                                 headers:{Authorization : `Bearer ${getUserAuth}`}
                                 }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>
                <TouchableOpacity
                    onPress={() => {
                            navigation.navigate('ViewDecors', { categoryId: item?._id });
                        }} style={{ width: Dimensions.get('window').width - 50, padding: 15, bottom: 15, alignSelf: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ width: '60%', }}>
                            <Text style={{ color: 'black', fontSize: 17, fontWeight: "700", fontFamily: "ManropeRegular" }} >{item?.eventOrganiserName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <LocationMarkIcon style={{ marginTop: 5 }} />
                                <Text style={{ fontWeight: '500', marginHorizontal: 5, color: '#696969', fontSize: 13, marginTop: 5, fontFamily: "ManropeRegular" }}>{item?.eventOrganizerAddress?.address}</Text>
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

    const renderItem = ({ item }) => {

        const convertLocalhostUrls = (url) => {
            return url.replace("localhost", LocalHostUrl);
        };
        // console.log("insdie render item")
        const imageUrls = item?.additionalImages.flat().map(image => convertLocalhostUrls(image.url));
        console.log("image urls arrya:", imageUrls)

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
                                onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                            >
                                <FastImage  source={{ uri: itemData,
                                 headers:{Authorization : `Bearer ${getUserAuth}`}
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
                            {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                <Text style={styles.strickedoffer}>₹20000</Text>
                                <Text style={styles.off}> 20% off</Text>
                            </View> */}
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
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const returnCategoriesCount = () => {
        let count = 0;
        if(selectedCategory === 'Tent House'){
            count = tentHouseData?.length;
            return count;
        }else if(selectedCategory === 'Halls'){
            count = eventsData?.length;
            return count;
        }else if (selectedCategory === 'Decoration'){
            count = decorationsData?.length;
            return count;
        }else{
            count = cateringsData?.length;
            return count;
        }
    }


    return (
        <SafeAreaView style={{ flex: 1,marginBottom:"10%" }}>
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
                <CategoryFilter onCategoryChange={handleCategoryChange} />
            </View>
            {/* <FlatList
                data={filteredSuggestions}
                contentContainerStyle={{}}
                renderItem={({ item }) => (
                    <Text style={{ padding: 10, backgroundColor: "pink", borderBottomColor: "#e0dede", borderBottomWidth: 1 }}
                        onPress={() => handleSuggestionPress(item)}
                    >
                        {item}
                    </Text>
                )}
                keyExtractor={(item) => item}
                style={{ maxHeight: 200 }}
            /> */}
            {/* <View style={{ flexDirection: 'row',backgroundColor:'#FFEFC0' }}>
                {Cats.map((IconComponent, index) => (
                    <TouchableOpacity>
                        <IconComponent key={index} width={100} height={100} />
                    </TouchableOpacity>
                ))}
            </View> */}
            <View style={{ marginHorizontal: 20 }}>
                <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular", }}>Near your location</Text>
                <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "500", fontFamily: "ManropeRegular", }}>{returnCategoriesCount()} {selectedCategory} Service in Hyderabad</Text>
            </View>
            {selectedCategory === 'Tent House' ?

                <FlatList
                    data={tentHouseData}
                    renderItem={renderTentHouseItem}
                    keyExtractor={(item) => item._id}
                />
                : selectedCategory === 'Halls' ?
                    <FlatList
                        data={eventsData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                    />
                    : 
                    selectedCategory === 'Decoration' ?
                    <FlatList
                        data={decorationsData}
                        renderItem={renderDecorationItem}
                        keyExtractor={(item) => item._id}
                    />
                    : 
                     selectedCategory === 'Catering' ?
                     <FlatList
                        data={cateringsData}
                        renderItem={renderFoodCaterings}
                        keyExtractor={(item) => item._id}
                    />
                    : null}
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

export default Events;
