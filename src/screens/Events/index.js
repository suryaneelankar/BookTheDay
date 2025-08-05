import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    Switch,
} from 'react-native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import Swiper from "react-native-swiper";
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import themevariable from "../../utils/themevariable";
import Autocomplete from 'react-native-autocomplete-input';
import IonIcon from 'react-native-vector-icons/Ionicons';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import ActionSheet from 'react-native-actions-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FloatingCloseButton from "./floatingCloseButton";


const seatingCapacity = ['50-100', '100-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+'];
const priceRanges = ['10k-50k', '50k-1L', '1L-2L', '2L-3L', '3L-5L', '5L-10L', '10L+'];
const chips = ['Budget', 'Standard', 'Premium', 'Luxury', 'Elite'];
const chipColors = {
    Budget: '#FFE8B3',
    Standard: '#B3E5FF',
    Luxury: '#D3C0FF',
    Premium: '#C8FACC',
    Elite: '#FFD6E8',
};
const categoryPriceMapping = {
    Budget: '10k-50k',
    Standard: '1L-2L',
    Premium: '3L-5L',
    Luxury: '5L-10L',
    Elite: '10L+',
};

const Events = () => {
    const navigation = useNavigation();
    const actionSheetRef = useRef(null);
    const userLocationFetched = useSelector((state) => state.userLocation);

    // Data states
    const [eventsData, setEventsData] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [locationBasedData, setLocationBasedData] = useState([]);
    const [allLocations, setAllLocations] = useState([]);

    // Filter states
    const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedChip, setSelectedChip] = useState('');
    const [isACSelected, setIsACSelected] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalEventPages, setTotalEventPages] = useState(0);

    const [filterDataCurrentPage, setFilterDataCurrentPage] = useState(1);
    const [filterDataLimit] = useState(10);
    const [hasMoreFilterData, setHasMoreFilterData] = useState(true);
    const [filterDataLoading, setFilterDataLoading] = useState(false);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [totalFilterDataPages, setTotalFilterDataPages] = useState(0);

    // UI states
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [switchCateringVal, setSwitchCateringVal] = useState(false);

    // Auth
    const [getUserAuth, setGetUserAuth] = useState('');

    // Effects
    useEffect(() => {
        getAllEvents(1);
        getAllLocations();
    }, []);

    // Data fetchers
    const getAllEvents = async (page) => {
        setLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHalls?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const newFunctionHalls = Array.isArray(response?.data?.data) ? response?.data?.data : [];
            setTotalEventPages(response?.data?.totalPages);
            setEventsData(prevData => page === 1 ? newFunctionHalls : [...prevData, ...newFunctionHalls]);
            setCurrentPage(page);
            setHasMore(newFunctionHalls.length > 0);
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
        setLoading(false);
    };

    const getAllEventsByLocation = async (value) => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFunctionHallsByLocation/${value}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLocationBasedData(response?.data?.data);
        } catch (error) {
            console.error('Error fetching function halls:', error);
        }
        setLoading(false);
    };

    const getAllLocations = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/user/locationList`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllLocations(response?.data?.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
        setLoading(false);
    };

    const fetchFilteredFunctionHalls = async (reset = false, page = 1) => {
        setFilterDataLoading(true);
        const token = await getUserAuthToken();
        const queryParams = new URLSearchParams();

        if (isACSelected !== null) queryParams.append('ac', isACSelected === 'AC');
        if (selectedChip) {
            const priceRange = categoryPriceMapping[selectedChip];
            if (priceRange) queryParams.append('priceRanges', priceRange);
        } else if (selectedPriceRange) {
            queryParams.append('priceRanges', selectedPriceRange);
        }
        if (selectedSeatingCapacity) queryParams.append('seatingCapacity', selectedSeatingCapacity);
        queryParams.append('withFoodOnly', switchCateringVal);
        queryParams.append('page', reset ? 1 : page);
        queryParams.append('limit', filterDataLimit);

        try {
            const response = await axios.get(`${BASE_URL}/filterFunctionHalls?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const newData = response?.data?.data || [];
            setFilteredList(reset ? newData : prev => [...prev, ...newData]);
            setTotalFilterDataPages(response?.data?.totalPages || 1);
            setHasMoreFilterData(newData.length === filterDataLimit);
            setFilterDataCurrentPage(page);
        } catch (error) {
            console.error('Error fetching filtered function halls:', error);
        }
        setFilterDataLoading(false);
    };

    // Pagination handlers
    const loadMoreFunctionHalls = () => {
        if (hasMore && !loading && currentPage < totalEventPages) {
            getAllEvents(currentPage + 1);
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleLoadMoreFilteredData = () => {
        if (hasMoreFilterData && !filterDataLoading && filterDataCurrentPage < totalFilterDataPages) {
            fetchFilteredFunctionHalls(false, filterDataCurrentPage + 1);
            setFilterDataCurrentPage(prev => prev + 1);
        }
    };

    // Filter UI handlers
    const handleSelection = (value) => setIsACSelected(value);

    const clearFilters = () => {
        setSelectedPriceRange('');
        setSelectedSeatingCapacity('');
        setIsACSelected(null);
        setSelectedChip('');
        setFilteredList([]);
        setCurrentPage(1);
        getAllEvents(1);
        setIsFilterApplied(false);
        setSwitchCateringVal(false);
    };

    const applyFilters = () => {
        setFilteredList([]);
        setFilterDataCurrentPage(1);
        fetchFilteredFunctionHalls(true, 1);
        actionSheetRef.current?.hide();
        setIsFilterApplied(true);
    };

    // Autocomplete logic
    const filteredData = useMemo(() => (
        allLocations?.filter(item =>
            item?.value.toLowerCase().includes(query.toLowerCase())
        )
    ), [allLocations, query]);

    const handleQueryChange = (text) => {
        setQuery(text);
        setDropdownVisible(text.length > 0);
    };

    const handleSelect = (value) => {
        setQuery(value);
        setDropdownVisible(false);
        if (value) getAllEventsByLocation(value);
    };

    // Data source for FlatList
    const getDataSource = () => {
        if (query) return locationBasedData;
        if (filteredList.length > 0) return filteredList;
        return eventsData;
    };

    // Count text utility
    const getCountText = () => {
        if (query) {
            return locationBasedData?.length === 0
                ? "No halls found"
                : `${locationBasedData?.length} Nearby Function Halls`;
        } else if (filteredList.length > 0 || isFilterApplied) {
            return filteredList.length === 0
                ? "No halls found"
                : `${filteredList.length} Filtered Function Halls`;
        } else {
            return eventsData?.length === 0
                ? "No halls found"
                : `${eventsData?.length} Function Halls in Hyderabad`;
        }
    };

    // UI Components
    const renderItem = ({ item }) => {
        const professionalImageUrl = item?.professionalImage?.url;
        const imageUrls = [
            professionalImageUrl,
            ...item?.additionalImages.flat().map(image => image?.url)
        ];
        return (
            <View style={{ flex: 1, borderRadius: 20 }}>
                <View style={styles.container}>
                    <Swiper
                        style={styles.wrapper}
                        loop={true}
                        activeDotColor="#FFFFFF"
                        dotColor="#FFFFFF"
                        activeDotStyle={{ width: 12, height: 12, borderRadius: 6 }}
                        dot={<View style={{ backgroundColor: '#FFFFFF', width: 7, height: 7, borderRadius: 6, marginHorizontal: 8 }} />}
                    >
                        {imageUrls.map((itemData, index) => (
                            <TouchableOpacity style={styles.slide} key={index}
                                onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}>
                                <FastImage source={{ uri: itemData }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                    style={{
                        width: Dimensions.get('window').width - 30,
                        padding: 15,
                        bottom: 15,
                        alignSelf: 'center',
                        backgroundColor: '#FFFFFF',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20
                    }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ width: '60%' }}>
                            <Text style={{ color: '#101010', fontSize: 16, fontWeight: "700", fontFamily: "ManropeRegular" }}>{item?.functionHallName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <LocationMarkIcon />
                                <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: "100%", fontWeight: '400', marginHorizontal: 5, color: '#939393', fontSize: 13, fontFamily: "ManropeRegular" }}>
                                    {item?.county !== 'undefined' ? item?.functionHallAddress?.address : item?.county}
                                </Text>
                            </View>
                        </View>
                        <View>
                            {item?.menuImages && item?.menuImages?.length > 0
                                ? <Text style={{ color: '#FD813B', fontFamily: "ManropeRegular", fontSize: 12, fontWeight: "600" }}>Menu based</Text>
                                : <Text style={{ fontWeight: '800', color: '#FD813B', fontSize: 14, fontFamily: "ManropeRegular" }}>
                                    {formatAmount(item?.rentPricePerDay)}
                                    <Text style={{ color: '#FD813B', fontFamily: "ManropeRegular", fontSize: 12, fontWeight: "400" }}> /day</Text>
                                </Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}>
                            <Text style={{ color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}> {item?.seatingCapacity} pax</Text>
                        </View>
                        {
                            item?.bedRooms > 0 &&
                            <View style={{ flexDirection: 'row', alignSelf: "center", alignItems: "center", marginHorizontal: 5, backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, paddingVertical: 8 }}>
                                <Text style={{ marginHorizontal: 2, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}> {item?.bedRooms} {item?.bedRooms > 1 ? 'Rooms' : 'Room'}</Text>
                            </View>
                        }
                        <View style={{ flexDirection: 'row', backgroundColor: "#FEF7DE", borderRadius: 15, paddingHorizontal: 10, alignItems: "center" }}>
                            {item?.foodType == 'Both' ? <VegNonVegIcon /> : item?.foodType == 'veg' ? <VegIcon /> : <NonVegIcon />}
                            <Text style={{ marginHorizontal: 5, color: '#4A4A4A', fontFamily: "ManropeRegular", fontSize: 11, fontWeight: "400" }}>
                                {item?.foodType == 'Both' ? 'VEG/NON-VEG' : item?.foodType == 'veg' ? 'VEG' : 'NON-VEG'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    // UI filter chips
    const renderChips = () => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
            {chips.map((item) => (
                <TouchableOpacity
                    key={item}
                    style={{
                        borderWidth: item === selectedChip ? 2 : 0,
                        borderColor: item === selectedChip ? '#ECA73C' : 'transparent',
                        backgroundColor: chipColors[item],
                        opacity: switchCateringVal ? 0.5 : 1,
                        marginHorizontal: 5,
                        marginVertical: 5,
                        borderRadius: 5,
                        padding: 10,
                    }}
                    disabled={switchCateringVal ? true : false}
                    onPress={() => {
                        setSelectedChip(item);
                        setSelectedPriceRange('');
                    }}
                >
                    <Text style={{ color: themevariable.Color_000000 }}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    console.log('switchCateringVal is :::>>>>', switchCateringVal);

    const renderPriceRanges = () => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
            {priceRanges.map((item) =>
                <TouchableOpacity
                    key={item}
                    style={{
                        borderWidth: item === selectedPriceRange ? 2 : 0,
                        borderColor: item === selectedPriceRange ? '#ECA73C' : 'transparent',
                        backgroundColor: '#FFF5E3',
                        marginHorizontal: 5,
                        marginVertical: 5,
                        borderRadius: 5,
                        padding: 10,
                        opacity: switchCateringVal ? 0.5 : 1,
                    }}
                    disabled={switchCateringVal ? true : false}
                    onPress={() => {
                        setSelectedPriceRange(item);
                        setSelectedChip('');
                    }}
                >
                    <Text style={{ color: themevariable.Color_000000 }}>{item}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderSeatingCapacity = () => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
            {seatingCapacity.map((item) =>
                <TouchableOpacity
                    key={item}
                    style={{
                        borderWidth: item === selectedSeatingCapacity ? 2 : 0,
                        borderColor: item === selectedSeatingCapacity ? '#ECA73C' : 'transparent',
                        backgroundColor: '#FFF5E3',
                        marginHorizontal: 5,
                        marginVertical: 5,
                        borderRadius: 5,
                        padding: 10,
                    }}
                    onPress={() => setSelectedSeatingCapacity(item)}
                >
                    <Text style={{ color: themevariable.Color_000000 }}>{item}</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const onChangeSwitchCateringVal = (val) => {
        setSwitchCateringVal(val);
        if (val) {
            setSelectedChip('');
            setSelectedPriceRange('');
        }
    }

    const isApplyDisabled = !selectedPriceRange && !selectedSeatingCapacity && isACSelected === null && !selectedChip && !switchCateringVal;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent
                closeOnPressBack
                defaultOverlayOpacity={0.5}
                height={Dimensions.get("window").height - 20}
                containerStyle={styles.actionSheetContainer}
            >
                <View>
                    <FloatingCloseButton onPress={() => actionSheetRef.current?.hide()} />
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text style={styles.labelText}>Seating Capacity pax</Text>
                    {renderSeatingCapacity()}
                    <View style={{ flexDirection: "row" }}>
                        <View>
                            <Text style={[styles.labelText, { paddingTop: 0 }]}>Ac / Non-AC</Text>
                            <View style={{ flexDirection: 'row', gap: 12, padding: 10 }}>
                                <TouchableOpacity
                                    onPress={() => handleSelection('AC')}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 16,
                                        borderRadius: 20,
                                        backgroundColor: isACSelected === 'AC' ? '#FF990066' : '#f0f0f0',
                                        borderColor: isACSelected === 'AC' ? '#FF990066' : '#ccc',
                                        borderWidth: isACSelected === 'AC' ? 1 : 0,
                                    }}
                                >
                                    <Text style={{ color: '#000' }}>AC</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleSelection('Non-AC')}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 16,
                                        borderRadius: 20,
                                        backgroundColor: isACSelected === 'Non-AC' ? '#FF990066' : '#f0f0f0',
                                        borderColor: isACSelected === 'Non-AC' ? '#FF990066' : '#ccc',
                                        borderWidth: isACSelected === 'Non-AC' ? 1 : 0,
                                    }}
                                >
                                    <Text style={{ color: '#000' }}>Non-AC</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.labelText, { paddingTop: 0 }]}>In-house Catering</Text>
                            <Switch
                                trackColor={{ false: '#f0f0f0', true: '#e8e46b' }}
                                thumbColor={'#ECA73C'}
                                ios_backgroundColor="#3e3e3e"
                                style={{
                                    padding: 10,
                                    marginTop: 10,
                                    marginLeft: 20,
                                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], // Increase size
                                    alignSelf: 'flex-start',
                                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] // Increase size
                                }}
                                onValueChange={(val) => onChangeSwitchCateringVal(val)}
                                value={switchCateringVal}
                            />
                        </View>
                    </View>

                    <Text style={styles.labelText}>Filter By Category</Text>
                    {renderChips()}
                    <Text style={styles.labelText}>Filter by Price</Text>
                    {renderPriceRanges()}
                </ScrollView>
                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderTopWidth: 1,
                    borderColor: '#eee',
                }}>
                    <TouchableOpacity
                        onPress={clearFilters}
                        style={{
                            flex: 1,
                            marginRight: 8,
                            padding: 12,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#333' }}>Clear Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={applyFilters}
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            padding: 12,
                            backgroundColor: '#007bff',
                            opacity: isApplyDisabled ? 0.5 : 1,
                            borderRadius: 8,
                            alignItems: 'center',
                        }}
                        disabled={isApplyDisabled}
                    >
                        <Text style={{ color: '#fff' }}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
            <View style={[
                styles.autocompleteContainer,
            ]}>
                <Autocomplete
                    data={dropdownVisible && filteredData?.length > 0 ? filteredData : []}
                    value={query}
                    onChangeText={handleQueryChange}
                    placeholder="Search Location..."
                    placeholderTextColor={"#A3A3A3"}
                    flatListProps={{
                        keyExtractor: (item) => item?._id.toString(),
                        renderItem: ({ item, index }) => (
                            <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => handleSelect(item?.value)}>
                                <Text style={{ padding: 10, color: "#000000", fontSize: 12, fontFamily: "ManropeRegular", marginVertical: 5 }}>{item?.value}</Text>
                                {index !== filteredData.length - 1 && (
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#ccc", marginHorizontal: 10 }} />
                                )}
                            </TouchableOpacity>
                        ),
                    }}
                    inputContainerStyle={{
                        borderRadius: 10,
                        height: 50,
                        width: "95%",
                        alignSelf: "center",
                        marginTop: 10,
                        backgroundColor: "#E3E3E7",
                    }}
                    textInputProps={{
                        color: "red", // Change this to your desired entered text color
                        fontSize: 14,
                        fontFamily: "ManropeRegular",
                        paddingHorizontal: 10,
                    }}
                    style={{ marginTop: 3, borderRadius: 15, width: "90%", alignSelf: "center", backgroundColor: "#E3E3E7", color: "#000000", }}
                    hideResults={dropdownVisible === false || filteredData.length === 0}
                />
                <TouchableOpacity style={{
                    position: 'absolute',
                    right: 20,
                    top: 22,
                    zIndex: 10, // Ensures it's above other components
                    elevation: 5,
                }} onPress={() => setQuery('')}>
                    <IonIcon name="close-circle" size={24} color="gray" style={{ marginTop: 0 }} />
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                <View>
                    <Text style={{ marginTop: 15, color: "#333333", fontSize: 16, fontWeight: "800", fontFamily: "ManropeRegular" }}>All Function Halls</Text>
                    <Text style={{ marginTop: 15, color: "#7D7F88", bottom: 10, fontSize: 13, fontWeight: "400", fontFamily: "ManropeRegular" }}>{getCountText()}</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 15, height: "50%", backgroundColor: "#FF990066", flexDirection: "row", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, alignItems: "center" }} onPress={() => actionSheetRef.current?.show()}>
                    <Text style={{ color: "#333333", fontSize: 12, fontWeight: "600", fontFamily: "ManropeRegular", marginHorizontal: 5 }}>Filter</Text>
                    <Icon name="filter-list" size={18} color="#000" />
                </TouchableOpacity>
            </View>
            {filteredList?.length === 0 && isFilterApplied ? (
                filterDataLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#333', fontFamily: "ManropeRegular", fontWeight: "600" }}>Loading filtered function halls...</Text>
                        <ActivityIndicator size="large" color="orange" style={{ marginTop: 20 }} />
                    </View>
                ) : (
                    <View style={{ alignItems: 'center', marginTop: 100, paddingHorizontal: 24 }}>
                        <Text style={{ fontSize: 18, marginBottom: 8, fontFamily: "ManropeRegular", fontWeight: "700", color: "#000000" }}>
                            No halls found
                        </Text>
                        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, fontFamily: "ManropeRegular" }}>
                            Try clearing or adjusting your filters to see more results.
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    backgroundColor: '#E3E3E7',
                                    borderRadius: 8,
                                }}
                                onPress={clearFilters}
                            >
                                <Text style={{ color: '#333', fontFamily: "ManropeRegular", fontSize: 13 }}>Clear Filters</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    backgroundColor: '#FD813B',
                                    borderRadius: 8,
                                }}
                                onPress={() => actionSheetRef.current?.show()}
                            >
                                <Text style={{ color: '#fff', fontFamily: "ManropeRegular", fontSize: 13 }}>Modify Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            ) : (
                <FlatList
                    data={getDataSource()}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    onEndReached={isFilterApplied ? handleLoadMoreFilteredData : loadMoreFunctionHalls}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        loading || filterDataLoading ? <ActivityIndicator size="large" color="orange" /> : null
                    }
                    ListEmptyComponent={
                        <View style={{ alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
                            <Text style={{ color: "#333333", fontSize: 14, fontWeight: "400", fontFamily: 'ManropeRegular', }}>No Function halls found</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    calendarViewStyle: {
        width: '70%',
        height: 'auto',
        padding: 10,
        backgroundColor: '#FFF2F1F7',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    wrapper: { height: 200 },
    actionSheetContainer: {
        backgroundColor: 'white',
        paddingBottom: 20,
        height: Dimensions.get('window').height - 150,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    labelText: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        paddingLeft: 15,
        paddingTop: 15,
    },
    container: {
        flex: 1,
        alignSelf: 'center',
        width: Dimensions.get('window').width - 30,
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
    },
    autocompleteContainer: {
        width: "95%",
        alignSelf: "center",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
    },
});

export default Events;
