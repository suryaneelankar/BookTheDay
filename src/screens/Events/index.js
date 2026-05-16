import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
    TextInput,
} from 'react-native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import themevariable from "../../utils/themevariable";
import ActionSheet from 'react-native-actions-sheet';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import FloatingCloseButton from "./floatingCloseButton";
import LinearGradient from "react-native-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

const seatingCapacity = ['50-100', '100-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+'];
const priceRanges = ['10k-50k', '50k-1L', '1L-2L', '2L-3L', '3L-5L', '5L-10L', '10L+'];
const chips = ['Budget', 'Standard', 'Premium', 'Luxury', 'Elite'];
const chipColors = {
    Budget: '#FFE8B3', Standard: '#B3E5FF',
    Luxury: '#D3C0FF', Premium: '#C8FACC', Elite: '#FFD6E8',
};
const categoryPriceMapping = {
    Budget: '10k-50k', Standard: '1L-2L',
    Premium: '3L-5L', Luxury: '5L-10L', Elite: '10L+',
};

// ─── Skeleton card shown while first page loads ───────────────────────────────
const SkeletonCard = () => (
    <View style={[styles.card, { marginBottom: 16 }]}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonBody}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <View style={styles.skeletonChip} />
                <View style={styles.skeletonChip} />
                <View style={styles.skeletonChip} />
            </View>
        </View>
    </View>
);

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
    const [switchCateringVal, setSwitchCateringVal] = useState(false);

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
    const [getUserAuth, setGetUserAuth] = useState('');

    // ── Refs: hold latest pagination values without stale-closure issues ──────
    // These mirror the state values so callbacks always read the current value
    const isFetchingRef = useRef(false);       // hard in-flight lock — blocks concurrent requests
    const isFetchingFilterRef = useRef(false); // same for filtered fetch
    const currentPageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const totalEventPagesRef = useRef(0);
    const filterPageRef = useRef(1);
    const hasMoreFilterRef = useRef(true);
    const totalFilterPagesRef = useRef(0);
    const isFilterAppliedRef = useRef(false);

    useEffect(() => {
        getAllEvents(1);
        getAllLocations();
    }, []);

    const getAllEvents = async (page) => {
        // Hard lock — ignore if a request is already in flight
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(
                `${BASE_URL}/getAllFunctionHalls?page=${page}&limit=10`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const newData = Array.isArray(response?.data?.data) ? response.data.data : [];
            const total = response?.data?.totalPages ?? 0;

            // Update refs first (synchronous, always current)
            currentPageRef.current = page;
            totalEventPagesRef.current = total;
            // hasMore is true only when there are more pages AND we got a full batch
            hasMoreRef.current = page < total;

            // Then sync state for UI
            setCurrentPage(page);
            setTotalEventPages(total);
            setHasMore(page < total);
            setEventsData(prev => page === 1 ? newData : [...prev, ...newData]);
        } catch (e) {
            console.error('Error fetching function halls:', e);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    };

    const getAllEventsByLocation = async (value) => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(
                `${BASE_URL}/getAllFunctionHallsByLocation/${value}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setLocationBasedData(response?.data?.data ?? []);
        } catch (e) {
            console.error('Error fetching by location:', e);
        }
    };

    const getAllLocations = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(
                `${BASE_URL}/user/locationList`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            setAllLocations(response?.data?.data ?? []);
        } catch (e) {
            console.error('Error fetching locations:', e);
        }
    };

    const fetchFilteredFunctionHalls = async (reset = false, page = 1) => {
        // Hard lock for filter fetches
        if (isFetchingFilterRef.current) return;
        isFetchingFilterRef.current = true;
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
        queryParams.append('page', page);
        queryParams.append('limit', filterDataLimit);
        try {
            const response = await axios.get(
                `${BASE_URL}/filterFunctionHalls?${queryParams.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const newData = response?.data?.data ?? [];
            const total = response?.data?.totalPages ?? 1;

            filterPageRef.current = page;
            totalFilterPagesRef.current = total;
            hasMoreFilterRef.current = page < total;

            setFilterDataCurrentPage(page);
            setTotalFilterDataPages(total);
            setHasMoreFilterData(page < total);
            setFilteredList(reset ? newData : prev => [...prev, ...newData]);
        } catch (e) {
            console.error('Error fetching filtered halls:', e);
        } finally {
            isFetchingFilterRef.current = false;
            setFilterDataLoading(false);
        }
    };

    const loadMoreFunctionHalls = () => {
        // Read from refs — always current, no stale closure
        if (!hasMoreRef.current || isFetchingRef.current) return;
        if (currentPageRef.current >= totalEventPagesRef.current) return;
        getAllEvents(currentPageRef.current + 1);
    };

    const handleLoadMoreFilteredData = () => {
        if (!hasMoreFilterRef.current || isFetchingFilterRef.current) return;
        if (filterPageRef.current >= totalFilterPagesRef.current) return;
        fetchFilteredFunctionHalls(false, filterPageRef.current + 1);
    };

    const clearFilters = () => {
        setSelectedPriceRange('');
        setSelectedSeatingCapacity('');
        setIsACSelected(null);
        setSelectedChip('');
        setFilteredList([]);
        setSwitchCateringVal(false);
        setIsFilterApplied(false);
        isFilterAppliedRef.current = false;
        // Reset all pagination refs before re-fetching
        currentPageRef.current = 1;
        hasMoreRef.current = true;
        totalEventPagesRef.current = 0;
        isFetchingRef.current = false;
        setCurrentPage(1);
        setHasMore(true);
        getAllEvents(1);
    };

    const applyFilters = () => {
        setFilteredList([]);
        // Reset filter pagination refs
        filterPageRef.current = 1;
        hasMoreFilterRef.current = true;
        totalFilterPagesRef.current = 0;
        isFetchingFilterRef.current = false;
        setFilterDataCurrentPage(1);
        setHasMoreFilterData(true);
        fetchFilteredFunctionHalls(true, 1);
        actionSheetRef.current?.hide();
        setIsFilterApplied(true);
        isFilterAppliedRef.current = true;
    };

    // ── Search: area suggestions (API) + hall name (client-side) ──────────────
    // Suggestions shown in dropdown = matching area names from allLocations
    const locationSuggestions = useMemo(() => {
        if (!query) return [];
        return allLocations
            ?.filter(item => item?.value?.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    }, [allLocations, query]);

    // Hall-name filter applied directly on already-loaded eventsData (client-side)
    // Only active when query doesn't match any area suggestion that was selected
    const nameFilteredData = useMemo(() => {
        if (!query) return [];
        const q = query.toLowerCase();
        return eventsData.filter(item =>
            item?.functionHallName?.toLowerCase().includes(q)
        );
    }, [query, eventsData]);

    const handleQueryChange = (text) => {
        setQuery(text);
        setDropdownVisible(text.length > 0);
        // If user clears the box, reset location-based results
        if (!text) setLocationBasedData([]);
    };

    const handleSelectArea = (value) => {
        setQuery(value);
        setDropdownVisible(false);
        if (value) getAllEventsByLocation(value);
    };

    const handleClearSearch = () => {
        setQuery('');
        setDropdownVisible(false);
        setLocationBasedData([]);
    };

    // memoised data source — three modes:
    //  1. area selected via dropdown  → locationBasedData (API result)
    //  2. query typed, no area chosen → nameFilteredData  (client-side name filter)
    //  3. filter applied              → filteredList
    //  4. default                     → eventsData (paginated)
    const dataSource = useMemo(() => {
        if (query && locationBasedData.length > 0) return locationBasedData;
        if (query) return nameFilteredData;
        if (filteredList.length > 0) return filteredList;
        return eventsData;
    }, [query, locationBasedData, nameFilteredData, filteredList, eventsData]);

    const countText = useMemo(() => {
        if (query && locationBasedData.length > 0)
            return `${locationBasedData.length} Halls in "${query}"`;
        if (query && nameFilteredData.length > 0)
            return `${nameFilteredData.length} Halls matching "${query}"`;
        if (query)
            return 'No halls found';
        if (filteredList.length > 0 || isFilterApplied)
            return filteredList.length === 0 ? 'No halls found' : `${filteredList.length} Filtered Halls`;
        return eventsData?.length === 0 ? 'No halls found' : `${eventsData.length} Function Halls`;
    }, [query, locationBasedData, nameFilteredData, filteredList, isFilterApplied, eventsData]);

    // active filter count badge
    const activeFilterCount = [selectedSeatingCapacity, selectedPriceRange, selectedChip,
        isACSelected, switchCateringVal || null].filter(Boolean).length;

    const keyExtractor = useCallback((item) => item._id, []);

    // onEndReached reads from refs inside the handlers — no stale closure risk
    const onEndReached = useCallback(() => {
        if (isFilterAppliedRef.current) {
            handleLoadMoreFilteredData();
        } else {
            loadMoreFunctionHalls();
        }
    }, []); // empty deps — safe because handlers use refs

    // ─── Card ─────────────────────────────────────────────────────────────────
    const renderItem = useCallback(({ item, index }) => {
        const heroImage = item?.professionalImage?.url;
        const totalPhotos = 1 + (item?.additionalImages?.flat()?.length || 0);
        const hasVideo = item?.hallVideos?.length > 0;

        return (
            <TouchableOpacity
                activeOpacity={0.93}
                style={styles.card}
                onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}
            >
                {/* ── hero image ── */}
                <View style={styles.cardImageWrapper}>
                    <FastImage
                        source={{ uri: heroImage, priority: FastImage.priority.normal }}
                        style={styles.cardImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {/* gradient overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.55)']}
                        style={styles.cardImageGradient}
                    />
                    {/* photo count badge */}
                    <View style={styles.photoCountBadge}>
                        <IonIcon name="images-outline" size={11} color="#fff" />
                        <Text style={styles.photoCountText}>{totalPhotos}</Text>
                    </View>
                    {/* video badge */}
                    {hasVideo && (
                        <View style={styles.videoBadge}>
                            <IonIcon name="videocam" size={11} color="#fff" />
                            <Text style={styles.photoCountText}>Video</Text>
                        </View>
                    )}
                    {/* price overlay bottom-right */}
                    <View style={styles.priceOverlay}>
                        {item?.menuImages?.length > 0
                            ? <Text style={styles.priceOverlayText}>Menu Based</Text>
                            : <Text style={styles.priceOverlayText}>{formatAmount(item?.rentPricePerDay)}<Text style={styles.priceOverlayUnit}>/day</Text></Text>
                        }
                    </View>
                </View>

                {/* ── card body ── */}
                <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item?.functionHallName}</Text>
                        <View style={styles.cardRatingPill}>
                            <IonIcon name="star" size={11} color="#FD813B" />
                            <Text style={styles.cardRatingText}>4.5</Text>
                        </View>
                    </View>

                    <View style={styles.cardAddressRow}>
                        <LocationMarkIcon width={12} height={12} />
                        <Text numberOfLines={1} style={styles.cardAddress}>
                            {item?.functionHallAddress?.address}
                        </Text>
                    </View>

                    {/* ── chips row ── */}
                    <View style={styles.cardChipsRow}>
                        <View style={styles.cardChip}>
                            <IonIcon name="people-outline" size={11} color="#FD813B" />
                            <Text style={styles.cardChipText}>{item?.seatingCapacity} pax</Text>
                        </View>
                        {item?.bedRooms > 0 && (
                            <View style={styles.cardChip}>
                                <IonIcon name="bed-outline" size={11} color="#FD813B" />
                                <Text style={styles.cardChipText}>{item?.bedRooms} Rooms</Text>
                            </View>
                        )}
                        <View style={styles.cardChip}>
                            {item?.foodType === 'Both' ? <VegNonVegIcon width={14} height={14} /> :
                             item?.foodType === 'veg' ? <VegIcon width={14} height={14} /> :
                             <NonVegIcon width={14} height={14} />}
                            <Text style={styles.cardChipText}>
                                {item?.foodType === 'Both' ? 'Veg & Non-Veg' :
                                 item?.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [navigation]);

    const isApplyDisabled = !selectedPriceRange && !selectedSeatingCapacity &&
        isACSelected === null && !selectedChip && !switchCateringVal;

    const ListFooter = useCallback(() => {
        if (!loading && !filterDataLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#FD813B" />
                <Text style={styles.footerLoaderText}>Loading more halls...</Text>
            </View>
        );
    }, [loading, filterDataLoading]);

    const ListEmpty = useCallback(() => (
        <View style={styles.emptyState}>
            <IonIcon name="business-outline" size={56} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No Function Halls Found</Text>
            <Text style={styles.emptySubtitle}>
                {isFilterApplied
                    ? 'Try adjusting your filters to see more results.'
                    : 'No halls available right now. Check back soon.'}
            </Text>
            {isFilterApplied && (
                <TouchableOpacity style={styles.emptyBtn} onPress={clearFilters}>
                    <Text style={styles.emptyBtnText}>Clear Filters</Text>
                </TouchableOpacity>
            )}
        </View>
    ), [isFilterApplied]);

    return (
        <SafeAreaView style={styles.safeArea}>

            {/* ── FILTER ACTION SHEET ── */}
            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent
                closeOnPressBack
                defaultOverlayOpacity={0.5}
                containerStyle={styles.actionSheetContainer}
            >
                <FloatingCloseButton onPress={() => actionSheetRef.current?.hide()} />
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text style={styles.filterSectionLabel}>Seating Capacity</Text>
                    <View style={styles.filterChipsWrap}>
                        {seatingCapacity.map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[styles.filterChip, selectedSeatingCapacity === item && styles.filterChipActive]}
                                onPress={() => setSelectedSeatingCapacity(item)}
                            >
                                <Text style={[styles.filterChipText, selectedSeatingCapacity === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.filterSectionLabel}>AC / Non-AC</Text>
                    <View style={styles.filterChipsWrap}>
                        {['AC', 'Non-AC'].map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[styles.filterChip, isACSelected === item && styles.filterChipActive]}
                                onPress={() => setIsACSelected(isACSelected === item ? null : item)}
                            >
                                <Text style={[styles.filterChipText, isACSelected === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>In-house Catering</Text>
                            <Switch
                                trackColor={{ false: '#E8E8E8', true: '#FFEAC1' }}
                                thumbColor={switchCateringVal ? '#FD813B' : '#ccc'}
                                onValueChange={(val) => {
                                    setSwitchCateringVal(val);
                                    if (val) { setSelectedChip(''); setSelectedPriceRange(''); }
                                }}
                                value={switchCateringVal}
                            />
                        </View>
                    </View>

                    <Text style={styles.filterSectionLabel}>Category</Text>
                    <View style={styles.filterChipsWrap}>
                        {chips.map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[styles.filterChip,
                                    { backgroundColor: chipColors[item] },
                                    selectedChip === item && styles.filterChipActive,
                                    switchCateringVal && { opacity: 0.4 }]}
                                disabled={switchCateringVal}
                                onPress={() => { setSelectedChip(item); setSelectedPriceRange(''); }}
                            >
                                <Text style={[styles.filterChipText, selectedChip === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.filterSectionLabel}>Price Range</Text>
                    <View style={styles.filterChipsWrap}>
                        {priceRanges.map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[styles.filterChip,
                                    selectedPriceRange === item && styles.filterChipActive,
                                    switchCateringVal && { opacity: 0.4 }]}
                                disabled={switchCateringVal}
                                onPress={() => { setSelectedPriceRange(item); setSelectedChip(''); }}
                            >
                                <Text style={[styles.filterChipText, selectedPriceRange === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* sticky footer buttons */}
                <View style={styles.filterFooter}>
                    <TouchableOpacity style={styles.filterClearBtn} onPress={clearFilters}>
                        <Text style={styles.filterClearText}>Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterApplyBtn, isApplyDisabled && { opacity: 0.45 }]}
                        onPress={applyFilters}
                        disabled={isApplyDisabled}
                    >
                        <LinearGradient
                            colors={['#FD813B', '#DF6E12']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.filterApplyGradient}
                        >
                            <Text style={styles.filterApplyText}>Apply Filters</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

            {/* ── SEARCH BAR ── */}
            <View style={styles.searchBarWrapper}>
                <View style={styles.searchBar}>
                    <IonIcon name="search-outline" size={18} color="#A3A3A3" style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={handleQueryChange}
                        placeholder="Search by hall name or area..."
                        placeholderTextColor="#A3A3A3"
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch}>
                            <IonIcon name="close-circle" size={18} color="#A3A3A3" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── DROPDOWN: area suggestions + name matches ── */}
                {dropdownVisible && (locationSuggestions.length > 0 || nameFilteredData.length > 0) && (
                    <View style={styles.dropdown}>

                        {/* area suggestions */}
                        {locationSuggestions.length > 0 && (
                            <>
                                <View style={styles.dropdownSectionHeader}>
                                    <IonIcon name="location-outline" size={12} color="#FD813B" />
                                    <Text style={styles.dropdownSectionLabel}>Areas</Text>
                                </View>
                                {locationSuggestions.map((item, index) => (
                                    <TouchableOpacity
                                        key={`area-${item._id}`}
                                        style={[
                                            styles.dropdownItem,
                                            (index < locationSuggestions.length - 1 || nameFilteredData.length > 0)
                                                && styles.dropdownDivider,
                                        ]}
                                        onPress={() => handleSelectArea(item.value)}
                                    >
                                        <IonIcon name="location-outline" size={14} color="#FD813B" style={{ marginRight: 8 }} />
                                        <Text style={styles.dropdownText}>{item.value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                        {/* hall name matches */}
                        {nameFilteredData.length > 0 && (
                            <>
                                <View style={styles.dropdownSectionHeader}>
                                    <IonIcon name="business-outline" size={12} color="#FD813B" />
                                    <Text style={styles.dropdownSectionLabel}>Halls</Text>
                                </View>
                                {nameFilteredData.slice(0, 5).map((item, index) => (
                                    <TouchableOpacity
                                        key={`hall-${item._id}`}
                                        style={[
                                            styles.dropdownItem,
                                            index < Math.min(nameFilteredData.length, 5) - 1 && styles.dropdownDivider,
                                        ]}
                                        onPress={() => {
                                            setDropdownVisible(false);
                                            navigation.navigate('ViewEvents', { categoryId: item._id });
                                        }}
                                    >
                                        <IonIcon name="business-outline" size={14} color="#939393" style={{ marginRight: 8 }} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.dropdownText} numberOfLines={1}>
                                                {item.functionHallName}
                                            </Text>
                                            <Text style={styles.dropdownSubText} numberOfLines={1}>
                                                {item?.functionHallAddress?.address}
                                            </Text>
                                        </View>
                                        <IonIcon name="chevron-forward" size={13} color="#ccc" />
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}

                    </View>
                )}
            </View>

            {/* ── HEADER ROW ── */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.headerTitle}>Function Halls</Text>
                    <Text style={styles.headerSubtitle}>{countText}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                    onPress={() => actionSheetRef.current?.show()}
                >
                    <MaterialIcon name="filter-list" size={16} color={activeFilterCount > 0 ? '#fff' : '#333'} />
                    <Text style={[styles.filterBtnText, activeFilterCount > 0 && { color: '#fff' }]}>Filter</Text>
                    {activeFilterCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── LIST ── */}
            {loading && eventsData.length === 0 ? (
                // first-load skeleton
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}>
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </ScrollView>
            ) : (
                <FlatList
                    data={dataSource}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={ListFooter}
                    ListEmptyComponent={ListEmpty}
                    contentContainerStyle={styles.listContent}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={6}
                    windowSize={10}
                    initialNumToRender={5}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F9F9', marginBottom: '10%' },
    listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },

    // ── SEARCH ──
    searchBarWrapper: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 4,
        zIndex: 10,
        backgroundColor: '#F9F9F9',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'ManropeRegular',
        color: '#121212',
        padding: 0,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 4,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dropdownDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
    },
    dropdownText: {
        fontSize: 13,
        fontFamily: 'ManropeRegular',
        color: '#333',
    },
    dropdownSubText: {
        fontSize: 11,
        fontFamily: 'ManropeRegular',
        color: '#939393',
        marginTop: 1,
    },
    dropdownSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 4,
        backgroundColor: '#FAFAFA',
    },
    dropdownSectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FD813B',
        fontFamily: 'ManropeRegular',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // ── HEADER ROW ──
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#121212',
        fontFamily: 'ManropeRegular',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#7D7F88',
        fontFamily: 'ManropeRegular',
        marginTop: 2,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
    },
    filterBtnActive: {
        backgroundColor: '#FD813B',
    },
    filterBtnText: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'ManropeRegular',
        color: '#333',
    },
    filterBadge: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2,
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FD813B',
        fontFamily: 'ManropeRegular',
    },

    // ── CARD ──
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        overflow: 'hidden',
    },
    cardImageWrapper: {
        width: '100%',
        height: 200,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardImageGradient: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 80,
    },
    photoCountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 20,
    },
    videoBadge: {
        position: 'absolute',
        top: 12,
        left: 70,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(253,129,59,0.85)',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 20,
    },
    photoCountText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
    },
    priceOverlay: {
        position: 'absolute',
        bottom: 10,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    priceOverlayText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
    },
    priceOverlayUnit: {
        fontSize: 10,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.8)',
    },
    cardBody: {
        padding: 14,
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#121212',
        fontFamily: 'ManropeRegular',
        flex: 1,
        marginRight: 8,
    },
    cardRatingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#FFF5EE',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    cardRatingText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FD813B',
        fontFamily: 'ManropeRegular',
    },
    cardAddressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    cardAddress: {
        fontSize: 12,
        color: '#939393',
        fontFamily: 'ManropeRegular',
        flex: 1,
    },
    cardChipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 10,
    },
    cardChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF5EE',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    cardChipText: {
        fontSize: 11,
        color: '#4A4A4A',
        fontFamily: 'ManropeRegular',
        fontWeight: '500',
    },

    // ── FILTER SHEET ──
    actionSheetContainer: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    filterSectionLabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        color: '#121212',
        fontSize: 14,
        paddingLeft: 16,
        paddingTop: 18,
        paddingBottom: 4,
    },
    filterChipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        paddingBottom: 4,
        gap: 8,
        alignItems: 'center',
    },
    filterChip: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    filterChipActive: {
        borderColor: '#FD813B',
        backgroundColor: '#FFF5EE',
    },
    filterChipText: {
        fontSize: 13,
        fontFamily: 'ManropeRegular',
        color: '#555',
    },
    filterChipTextActive: {
        color: '#FD813B',
        fontWeight: '700',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 4,
    },
    switchLabel: {
        fontSize: 13,
        fontFamily: 'ManropeRegular',
        color: '#333',
    },
    filterFooter: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F1F1',
    },
    filterClearBtn: {
        flex: 1,
        paddingVertical: 13,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        alignItems: 'center',
    },
    filterClearText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        fontFamily: 'ManropeRegular',
    },
    filterApplyBtn: {
        flex: 2,
        borderRadius: 12,
        overflow: 'hidden',
    },
    filterApplyGradient: {
        paddingVertical: 13,
        alignItems: 'center',
    },
    filterApplyText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        fontFamily: 'ManropeRegular',
    },

    // ── FOOTER LOADER ──
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 20,
    },
    footerLoaderText: {
        fontSize: 13,
        color: '#939393',
        fontFamily: 'ManropeRegular',
    },

    // ── EMPTY STATE ──
    emptyState: {
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#333',
        fontFamily: 'ManropeRegular',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#939393',
        fontFamily: 'ManropeRegular',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    emptyBtn: {
        marginTop: 20,
        backgroundColor: '#FFF5EE',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#FD813B',
    },
    emptyBtnText: {
        color: '#FD813B',
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
        fontSize: 14,
    },

    // ── SKELETON ──
    skeletonImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#EBEBEB',
    },
    skeletonBody: {
        padding: 14,
    },
    skeletonLine: {
        height: 14,
        borderRadius: 7,
        backgroundColor: '#EBEBEB',
        width: '80%',
    },
    skeletonChip: {
        height: 28,
        width: 72,
        borderRadius: 14,
        backgroundColor: '#EBEBEB',
    },
});

export default Events;
