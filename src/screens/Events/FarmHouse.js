import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Dimensions,
    FlatList, SafeAreaView, ActivityIndicator, ScrollView,
    Switch, TextInput, Animated,
} from 'react-native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../utils/GlobalFunctions';
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";
import ActionSheet from 'react-native-actions-sheet';
import IonIcon from 'react-native-vector-icons/Ionicons';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
import FloatingCloseButton from "./floatingCloseButton";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-swiper";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Farm House theme palette ──────────────────────────────────────────────────
const FH_DARK = '#1A2E1A';   // deep forest green
const FH_GREEN = '#06BE66';   // accent green
const FH_SAGE = '#7BAE7F';   // muted sage
const FH_EARTH = '#8B5E3C';   // warm earth brown
const FH_CREAM = '#F4F9F4';   // natural off-white background
const FH_LIGHT = '#D6EDD6';   // light green tint for chips
const FH_GOLD = '#ECA73C';   // harvest gold accent

const VENUE_CATEGORY = 'Farm House';

const seatingCapacity = ['50-100', '100-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+'];
const priceRanges = ['10k-50k','50k-1L','1L-2L','2L-3L','3L-5L','5L-10L','10L-12L','12L-15L','15L-20L','20L+'];
const chips = ['Budget', 'Standard', 'Premium', 'Luxury', 'Elite'];
const chipColors = {
    Budget: '#FFE8B3', Standard: '#B3E5FF',
    Luxury: '#D3C0FF', Premium: '#C8FACC', Elite: '#FFD6E8',
};
const categoryPriceMapping = {
    Budget: '50k-1L', Standard: '2L-3L',
    Premium: '5L-10L', Luxury: '12L-15L', Elite: '20L+',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <View style={[styles.card, { marginBottom: 16 }]}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonBody}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <View style={styles.skeletonChip} />
                <View style={styles.skeletonChip} />
            </View>
        </View>
    </View>
);

const FarmHouse = () => {
    const navigation = useNavigation();
    const isScreenFocused = useIsFocused();
    const actionSheetRef = useRef(null);
    const heroProgress = useRef(new Animated.Value(0)).current;
    const isHeroCollapsedRef = useRef(false);
    const isHeroAnimatingRef = useRef(false);
    const lastScrollYRef = useRef(0);

    const heroContentHeight = heroProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [105, 0],
        extrapolate: 'clamp',
    });
    const heroContentOpacity = heroProgress.interpolate({
        inputRange: [0, 0.55, 1],
        outputRange: [1, 0.35, 0],
        extrapolate: 'clamp',
    });
    const heroContentTranslateY = heroProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -18],
        extrapolate: 'clamp',
    });

    const setHeroCollapsed = useCallback((collapsed) => {
        if (isHeroCollapsedRef.current === collapsed || isHeroAnimatingRef.current) return;

        isHeroCollapsedRef.current = collapsed;
        isHeroAnimatingRef.current = true;
        Animated.timing(heroProgress, {
            toValue: collapsed ? 1 : 0,
            duration: 220,
            useNativeDriver: false,
        }).start(() => {
            isHeroAnimatingRef.current = false;
        });
    }, [heroProgress]);

    const handleListScroll = useCallback((event) => {
        const y = Math.max(0, event.nativeEvent.contentOffset.y);
        const delta = y - lastScrollYRef.current;

        if (delta > 6 && y > 35) {
            setHeroCollapsed(true);
        } else if (delta < -12 || y <= 4) {
            setHeroCollapsed(false);
        }

        lastScrollYRef.current = y;
    }, [setHeroCollapsed]);

    const [eventsData, setEventsData] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [locationBasedData, setLocationBasedData] = useState([]);
    const [allLocations, setAllLocations] = useState([]);
    const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedChip, setSelectedChip] = useState('');
    const [isACSelected, setIsACSelected] = useState(null);
    const [switchCateringVal, setSwitchCateringVal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalEventPages, setTotalEventPages] = useState(0);
    const [filterDataCurrentPage, setFilterDataCurrentPage] = useState(1);
    const [filterDataLimit] = useState(10);
    const [hasMoreFilterData, setHasMoreFilterData] = useState(true);
    const [filterDataLoading, setFilterDataLoading] = useState(false);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [totalFilterDataPages, setTotalFilterDataPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [activeAutoplayCardId, setActiveAutoplayCardId] = useState(null);

    // A card must be mostly visible before its carousel is allowed to autoplay.
    // Keeping these refs stable prevents FlatList viewability warnings/rework.
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 70,
        minimumViewTime: 250,
    }).current;
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        const visibleCard = viewableItems.find(({ isViewable }) => isViewable);
        const nextId = visibleCard?.item?._id ?? null;
        setActiveAutoplayCardId(currentId => currentId === nextId ? currentId : nextId);
    }).current;

    const isFetchingRef = useRef(false);
    const isFetchingFilterRef = useRef(false);
    const currentPageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const totalEventPagesRef = useRef(0);
    const filterPageRef = useRef(1);
    const hasMoreFilterRef = useRef(true);
    const totalFilterPagesRef = useRef(0);
    const isFilterAppliedRef = useRef(false);

    useEffect(() => { getAllEvents(1); getAllLocations(); }, []);

    // ── API: fetch all halls, filter client-side to Farm House ────────────────
    const getAllEvents = async (page) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(
                `${BASE_URL}/filterFunctionHalls`,
                {
                    params: {
                        page,
                        limit: 10,
                        venueCategory: "Farm House",
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const allData = Array.isArray(response?.data?.data) ? response.data.data : [];
            const newData = allData.filter(item => item?.venueCategory === VENUE_CATEGORY);
            const total = response?.data?.totalPages ?? 0;
            currentPageRef.current = page;
            totalEventPagesRef.current = total;
            hasMoreRef.current = page < total;
            setCurrentPage(page); setTotalEventPages(total); setHasMore(page < total);
            setEventsData(prev => page === 1 ? newData : [...prev, ...newData]);
        } catch (e) { console.error('FarmHouse fetch error:', e); }
        finally { isFetchingRef.current = false; setLoading(false); }
    };

    const getAllEventsByLocation = async (value) => {
        const token = await getUserAuthToken();
        try {
            const res = await axios.get(
                `${BASE_URL}/getAllFunctionHallsByLocation/${value}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const allData = res?.data?.data ?? [];
            setLocationBasedData(allData.filter(item => item?.venueCategory === VENUE_CATEGORY));
        } catch (e) { console.error(e); }
    };

    const getAllLocations = async () => {
        const token = await getUserAuthToken();
        try {
            const res = await axios.get(`${BASE_URL}/user/locationList`, { headers: { Authorization: `Bearer ${token}` } });
            setAllLocations(res?.data?.data ?? []);
        } catch (e) { console.error(e); }
    };

    const fetchFilteredFunctionHalls = async (reset = false, page = 1) => {
        if (isFetchingFilterRef.current) return;
        isFetchingFilterRef.current = true;
        setFilterDataLoading(true);
        const token = await getUserAuthToken();
        const qp = new URLSearchParams();
        qp.append('venueCategory', VENUE_CATEGORY);
        if (isACSelected !== null) qp.append('ac', isACSelected === 'AC');
        if (selectedChip) {
            const priceRange = categoryPriceMapping[selectedChip];
            if (priceRange) qp.append('priceRanges', priceRange);
        } else if (selectedPriceRange) {
            qp.append('priceRanges', selectedPriceRange);
        }
        if (selectedSeatingCapacity) qp.append('seatingCapacity', selectedSeatingCapacity);
        qp.append('withFoodOnly', switchCateringVal);
        qp.append('page', page); qp.append('limit', filterDataLimit);
        try {
            const res = await axios.get(
                `${BASE_URL}/filterFunctionHalls?${qp.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const allData = res?.data?.data ?? [];
            const newData = allData.filter(item => item?.venueCategory === VENUE_CATEGORY);
            const total = res?.data?.totalPages ?? 1;
            filterPageRef.current = page; totalFilterPagesRef.current = total;
            hasMoreFilterRef.current = page < total;
            setFilterDataCurrentPage(page); setTotalFilterDataPages(total);
            setHasMoreFilterData(page < total);
            setFilteredList(reset ? newData : prev => [...prev, ...newData]);
        } catch (e) { console.error(e); }
        finally { isFetchingFilterRef.current = false; setFilterDataLoading(false); }
    };

    const loadMore = () => {
        if (!hasMoreRef.current || isFetchingRef.current) return;
        if (currentPageRef.current >= totalEventPagesRef.current) return;
        getAllEvents(currentPageRef.current + 1);
    };
    const loadMoreFiltered = () => {
        if (!hasMoreFilterRef.current || isFetchingFilterRef.current) return;
        if (filterPageRef.current >= totalFilterPagesRef.current) return;
        fetchFilteredFunctionHalls(false, filterPageRef.current + 1);
    };
    const clearFilters = () => {
        setSelectedPriceRange(''); setSelectedSeatingCapacity('');
        setIsACSelected(null); setSelectedChip(''); setFilteredList([]);
        setSwitchCateringVal(false); setIsFilterApplied(false);
        isFilterAppliedRef.current = false;
        currentPageRef.current = 1; hasMoreRef.current = true;
        totalEventPagesRef.current = 0; isFetchingRef.current = false;
        setCurrentPage(1); setHasMore(true); getAllEvents(1);
    };
    const applyFilters = () => {
        setFilteredList([]);
        filterPageRef.current = 1; hasMoreFilterRef.current = true;
        totalFilterPagesRef.current = 0; isFetchingFilterRef.current = false;
        setFilterDataCurrentPage(1); setHasMoreFilterData(true);
        fetchFilteredFunctionHalls(true, 1);
        actionSheetRef.current?.hide();
        setIsFilterApplied(true); isFilterAppliedRef.current = true;
    };

    const locationSuggestions = useMemo(() => {
        if (!query) return [];
        return allLocations?.filter(i => i?.value?.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    }, [allLocations, query]);

    const nameFilteredData = useMemo(() => {
        if (!query) return [];
        const q = query.toLowerCase();
        return eventsData.filter(i => i?.functionHallName?.toLowerCase().includes(q));
    }, [query, eventsData]);

    const handleQueryChange = (text) => {
        setQuery(text); setDropdownVisible(text.length > 0);
        if (!text) setLocationBasedData([]);
    };

    const dataSource = useMemo(() => {
        if (query && locationBasedData.length > 0) return locationBasedData;
        if (query) return nameFilteredData;
        if (isFilterApplied) return filteredList;
        return eventsData;
    }, [query, locationBasedData, nameFilteredData, filteredList, eventsData, isFilterApplied]);

    const countText = useMemo(() => {
        if (query && locationBasedData.length > 0) return `${locationBasedData.length} Farm Houses in "${query}"`;
        if (query && nameFilteredData.length > 0) return `${nameFilteredData.length} Farm Houses matching "${query}"`;
        if (query) return 'No farm houses found';
        if (filteredList.length > 0 || isFilterApplied)
            return filteredList.length === 0 ? 'No farm houses found' : `${filteredList.length} Filtered`;
        return eventsData?.length === 0 ? 'No farm houses found' : `${eventsData.length} Farm Houses`;
    }, [query, locationBasedData, nameFilteredData, filteredList, isFilterApplied, eventsData]);

    const activeFilterCount = [selectedSeatingCapacity, selectedPriceRange, selectedChip, isACSelected, switchCateringVal || null].filter(Boolean).length;
    const keyExtractor = useCallback((item) => item._id, []);
    const onEndReached = useCallback(() => {
        isFilterAppliedRef.current ? loadMoreFiltered() : loadMore();
    }, []);

    // ── Farm House themed card ────────────────────────────────────────────────
    const renderItem = useCallback(({ item }) => {
        const heroImage = item?.professionalImage?.url;
        const imageUrls = [heroImage, ...(item?.additionalImages?.flat()?.map(img => img?.url) || [])].filter(Boolean);
        const totalPhotos = imageUrls.length;
        const hasVideo = item?.hallVideos?.length > 0;
        const shouldAutoplay =
            isScreenFocused &&
            activeAutoplayCardId === item._id &&
            imageUrls.length > 1;
        return (
            <View style={styles.card}>
                <View style={styles.cardImageWrapper}>
                    <Swiper
                        key={`${item._id}-${shouldAutoplay ? 'playing' : 'paused'}`}
                        loop={imageUrls.length > 1}
                        showsPagination={imageUrls.length > 1}
                        activeDotColor="#fff"
                        dotColor="rgba(255,255,255,0.5)"
                        activeDotStyle={{ width: 12, height: 6, borderRadius: 3 }}
                        dotStyle={{ width: 6, height: 6, borderRadius: 3 }}
                        paginationStyle={{ bottom: 10 }}
                        style={{ height: 200 }}
                        autoplay={shouldAutoplay}
                        autoplayTimeout={4}
                        loadMinimal
                        loadMinimalSize={1}
                    >
                        {imageUrls.map((imgUrl, idx) => (
                            <TouchableOpacity key={`${item._id}-${idx}`} activeOpacity={0.93}
                                onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}
                                style={{ flex: 1 }}>
                                <FastImage source={{
                                    uri: imgUrl,
                                    priority: shouldAutoplay
                                        ? FastImage.priority.high
                                        : FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                                    style={styles.cardImage} resizeMode={FastImage.resizeMode.cover} />
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                    <LinearGradient colors={['transparent', 'rgba(26,46,26,0.72)']} style={styles.cardImageGradient} pointerEvents="none" />
                    <View style={styles.scenicBadge}>
                        <IonIcon name="leaf" size={10} color="#fff" />
                        <Text style={styles.scenicBadgeText}>Scenic</Text>
                    </View>
                    {hasVideo && (
                        <View style={styles.videoBadge}>
                            <IonIcon name="videocam" size={11} color="#fff" />
                            <Text style={styles.badgeText}>Video</Text>
                        </View>
                    )}
                    <View style={styles.photoBadge}>
                        <IonIcon name="images-outline" size={11} color="#fff" />
                        <Text style={styles.badgeText}>{totalPhotos}</Text>
                    </View>
                    <View style={styles.priceOverlay}>
                        {item?.menuImages?.length > 0
                            ? <Text style={styles.priceText}>Menu Based</Text>
                            : <Text style={styles.priceText}>{formatAmount(item?.rentPricePerDay)}<Text style={styles.priceUnit}>/day</Text></Text>
                        }
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.93}
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
                <View style={styles.cardBody}>
                    <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item?.functionHallName}</Text>
                    </View>
                    <View style={styles.addressRow}>
                        <LocationMarkIcon width={12} height={12} />
                        <Text numberOfLines={1} style={styles.addressText}>{item?.functionHallAddress?.address}</Text>
                    </View>
                    <View style={styles.chipsRow}>
                        {item?.seatingCapacity ? (
                            <View style={styles.chip}>
                                <IonIcon name="people-outline" size={11} color={FH_GREEN} />
                                <Text style={styles.chipText}>{item?.seatingCapacity} pax</Text>
                            </View>
                        ) : null}
                        {item?.bedRooms > 0 && (
                            <View style={styles.chip}>
                                <IonIcon name="bed-outline" size={11} color={FH_GREEN} />
                                <Text style={styles.chipText}>{item?.bedRooms} Rooms</Text>
                            </View>
                        )}
                        <View style={styles.chip}>
                            {item?.foodType === 'Both' ? <VegNonVegIcon width={14} height={14} /> :
                                item?.foodType === 'veg' ? <VegIcon width={14} height={14} /> :
                                    <NonVegIcon width={14} height={14} />}
                            <Text style={styles.chipText}>
                                {item?.foodType === 'Both' ? 'Veg & Non-Veg' : item?.foodType === 'veg' ? 'Veg' : 'Non-Veg'}
                            </Text>
                        </View>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        );
    }, [navigation, activeAutoplayCardId, isScreenFocused]);

    const isApplyDisabled = !selectedPriceRange && !selectedSeatingCapacity && isACSelected === null && !selectedChip && !switchCateringVal;

    const ListFooter = useCallback(() => {
        if (!loading && !filterDataLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={FH_GREEN} />
                <Text style={styles.footerLoaderText}>Loading more farm houses...</Text>
            </View>
        );
    }, [loading, filterDataLoading]);

    const ListEmpty = useCallback(() => (
        <View style={styles.emptyState}>
            <IonIcon name="leaf-outline" size={56} color={FH_LIGHT} />
            <Text style={styles.emptyTitle}>No Farm Houses Found</Text>
            <Text style={styles.emptySubtitle}>
                {isFilterApplied ? 'Try adjusting your filters.' : 'No farm houses available right now.'}
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

            {/* ── FILTER SHEET ── */}
            <ActionSheet
                ref={actionSheetRef}
                statusBarTranslucent closeOnPressBack
                defaultOverlayOpacity={0.5}
                containerStyle={styles.actionSheetContainer}
            >
                <FloatingCloseButton onPress={() => actionSheetRef.current?.hide()} />
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text style={styles.filterSectionLabel}>Seating Capacity</Text>
                    <View style={styles.filterChipsWrap}>
                        {seatingCapacity.map(item => (
                            <TouchableOpacity key={item}
                                style={[styles.filterChip, selectedSeatingCapacity === item && styles.filterChipActive]}
                                onPress={() => setSelectedSeatingCapacity(selectedSeatingCapacity === item ? '' : item)}>
                                <Text style={[styles.filterChipText, selectedSeatingCapacity === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.filterSectionLabel}>AC / Non-AC</Text>
                    <View style={styles.filterChipsWrap}>
                        {['AC', 'Non-AC'].map(item => (
                            <TouchableOpacity key={item}
                                style={[styles.filterChip, isACSelected === item && styles.filterChipActive]}
                                onPress={() => setIsACSelected(isACSelected === item ? null : item)}>
                                <Text style={[styles.filterChipText, isACSelected === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>In-house Catering</Text>
                            <Switch
                                trackColor={{ false: '#E8E8E8', true: '#B8E8C8' }}
                                thumbColor={switchCateringVal ? FH_GREEN : '#ccc'}
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
                            <TouchableOpacity key={item}
                                style={[styles.filterChip,
                                    { backgroundColor: chipColors[item] },
                                    selectedChip === item && styles.filterChipActive,
                                    switchCateringVal && { opacity: 0.4 }]}
                                disabled={switchCateringVal}
                                onPress={() => { setSelectedChip(selectedChip === item ? '' : item); setSelectedPriceRange(''); }}>
                                <Text style={[styles.filterChipText, selectedChip === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.filterSectionLabel}>Price Range</Text>
                    <View style={styles.filterChipsWrap}>
                        {priceRanges.map(item => (
                            <TouchableOpacity key={item}
                                style={[styles.filterChip,
                                    selectedPriceRange === item && styles.filterChipActive,
                                    switchCateringVal && { opacity: 0.4 }]}
                                disabled={switchCateringVal}
                                onPress={() => { setSelectedPriceRange(selectedPriceRange === item ? '' : item); setSelectedChip(''); }}>
                                <Text style={[styles.filterChipText, selectedPriceRange === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.filterFooter}>
                    <TouchableOpacity style={styles.filterClearBtn} onPress={clearFilters}>
                        <Text style={styles.filterClearText}>Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterApplyBtn, isApplyDisabled && { opacity: 0.45 }]}
                        onPress={applyFilters} disabled={isApplyDisabled}>
                        <LinearGradient
                            colors={[FH_GREEN, '#047A42']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.filterApplyGradient}>
                            <Text style={styles.filterApplyText}>Apply Filters</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

            {/* ── FARM HOUSE HERO HEADER ── */}
            <LinearGradient
                colors={['#37B578', '#159B65', '#08734C']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.heroHeader}
            >
                {/* decorative leaf circles */}
                <View style={styles.heroCircle1} />
                <View style={styles.heroCircle2} />

                <Animated.View
                    style={[
                        styles.heroCollapsible,
                        {
                            height: heroContentHeight,
                            opacity: heroContentOpacity,
                            transform: [{ translateY: heroContentTranslateY }],
                        },
                    ]}
                    pointerEvents="none"
                >
                    <View style={styles.heroRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.heroBadge}>
                                <IonIcon name="leaf" size={11} color={FH_GREEN} />
                                <Text style={styles.heroBadgeText}>Open-Air Retreats</Text>
                            </View>
                            <Text style={styles.heroTitle}>Farm Houses</Text>
                            <Text style={styles.heroSub}>Nature escapes & scenic celebrations</Text>
                        </View>
                        <View style={styles.heroIconWrap}>
                            <IonIcon name="leaf" size={32} color={FH_GREEN} />
                        </View>
                    </View>
                </Animated.View>

                {/* search bar */}
                <View style={styles.searchBar}>
                    <IonIcon name="search-outline" size={16} color={'black'} style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        value={query}
                        onChangeText={handleQueryChange}
                        placeholder="Search farm houses by name or area..."
                        placeholderTextColor={'black'}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => { setQuery(''); setDropdownVisible(false); setLocationBasedData([]); }}>
                            <IonIcon name="close-circle" size={16} color={FH_SAGE} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* dropdown */}
                {dropdownVisible && (locationSuggestions.length > 0 || nameFilteredData.length > 0) && (
                    <View style={styles.dropdown}>
                        {locationSuggestions.map((item, index) => (
                            <TouchableOpacity
                                key={`area-${item._id}`}
                                style={[styles.dropdownItem, index < locationSuggestions.length - 1 && styles.dropdownDivider]}
                                onPress={() => { setQuery(item.value); setDropdownVisible(false); getAllEventsByLocation(item.value); }}
                            >
                                <IonIcon name="location-outline" size={13} color={FH_GREEN} style={{ marginRight: 8 }} />
                                <Text style={styles.dropdownText}>{item.value}</Text>
                            </TouchableOpacity>
                        ))}
                        {nameFilteredData.slice(0, 4).map((item, index) => (
                            <TouchableOpacity
                                key={`fh-${item._id}`}
                                style={[styles.dropdownItem, index < 3 && styles.dropdownDivider]}
                                onPress={() => { setDropdownVisible(false); navigation.navigate('ViewEvents', { categoryId: item._id }); }}
                            >
                                <IonIcon name="home-outline" size={13} color="#939393" style={{ marginRight: 8 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dropdownText} numberOfLines={1}>{item.functionHallName}</Text>
                                    <Text style={styles.dropdownSubText} numberOfLines={1}>{item?.functionHallAddress?.address}</Text>
                                </View>
                                <IonIcon name="chevron-forward" size={12} color="#ccc" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </LinearGradient>

            {/* ── HEADER ROW ── */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.headerTitle}>Farm Houses</Text>
                    <Text style={styles.headerSubtitle}>{countText}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                    onPress={() => actionSheetRef.current?.show()}
                >
                    <IonIcon name="options-outline" size={16} color={activeFilterCount > 0 ? '#fff' : FH_GREEN} />
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
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}>
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </ScrollView>
            ) : (
                <FlatList
                    data={dataSource}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onScroll={handleListScroll}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    extraData={`${activeAutoplayCardId}-${isScreenFocused}`}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={ListFooter}
                    ListEmptyComponent={ListEmpty}
                    contentContainerStyle={styles.listContent}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={4}
                    updateCellsBatchingPeriod={50}
                    windowSize={5}
                    initialNumToRender={4}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: FH_CREAM },
    listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },

    // ── HERO ──
    heroHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, overflow: 'hidden', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
    heroCircle1: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(6,190,102,0.06)', top: -50, right: -50,
    },
    heroCircle2: {
        position: 'absolute', width: 120, height: 120, borderRadius: 60,
        backgroundColor: 'rgba(6,190,102,0.04)', bottom: -30, left: -20,
    },
    heroCollapsible: { overflow: 'hidden' },
    heroRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 16 },
    heroBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
        alignSelf: 'flex-start', marginBottom: 10,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    },
    heroBadgeText: { fontFamily: 'ManropeRegular', fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    heroTitle: { fontFamily: 'ManropeRegular', fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
    heroSub: { fontFamily: 'ManropeRegular', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    heroIconWrap: {
        width: 60, height: 60, borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    },

    // ── SEARCH ──
    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)',bottom: 10,marginTop:20,
    },
    searchInput: { flex: 1, fontSize: 13, fontFamily: 'ManropeRegular', color: 'black', padding: 0 },
    dropdown: {
        backgroundColor: '#fff', borderRadius: 12, marginTop: 6,
        elevation: 8, shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, overflow: 'hidden',
    },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11 },
    dropdownDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F1F1' },
    dropdownText: { fontSize: 13, fontFamily: 'ManropeRegular', color: '#333', flex: 1 },
    dropdownSubText: { fontSize: 11, fontFamily: 'ManropeRegular', color: '#939393', marginTop: 1 },

    // ── HEADER ROW ──
    headerRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
    },
    headerTitle: { fontFamily: 'ManropeRegular', fontSize: 17, fontWeight: '800', color: FH_DARK },
    headerSubtitle: { fontFamily: 'ManropeRegular', fontSize: 12, color: '#7D7F88', marginTop: 2 },
    filterBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#fff', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 8,
        elevation: 2, shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3,
        borderWidth: 1, borderColor: FH_LIGHT,
    },
    filterBtnActive: { backgroundColor: FH_GREEN, borderColor: FH_GREEN },
    filterBtnText: { fontSize: 13, fontWeight: '600', fontFamily: 'ManropeRegular', color: FH_GREEN },
    filterBadge: {
        backgroundColor: '#fff', borderRadius: 10,
        width: 18, height: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 2,
    },
    filterBadgeText: { fontSize: 10, fontWeight: '800', color: FH_GREEN, fontFamily: 'ManropeRegular' },

    // ── CARD ──
    card: {
        backgroundColor: '#fff', borderRadius: 20, marginBottom: 16,
        elevation: 3, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6,
        overflow: 'hidden',
    },
    cardImageWrapper: { width: '100%', height: 200 },
    cardImage: { width: '100%', height: '100%' },
    cardImageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
    scenicBadge: {
        position: 'absolute', top: 12, left: 12,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(6,190,102,0.88)',
        paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
    },
    scenicBadgeText: { fontFamily: 'ManropeRegular', fontSize: 10, fontWeight: '700', color: '#fff' },
    videoBadge: {
        position: 'absolute', top: 12, left: 82,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(139,94,60,0.85)',
        paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
    },
    photoBadge: {
        position: 'absolute', bottom: 10, left: 12,
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', fontFamily: 'ManropeRegular' },
    priceOverlay: {
        position: 'absolute', bottom: 10, right: 12,
        backgroundColor: 'rgba(26,46,26,0.72)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    },
    priceText: { color: '#fff', fontSize: 13, fontWeight: '800', fontFamily: 'ManropeRegular' },
    priceUnit: { fontSize: 10, fontWeight: '400', color: 'rgba(255,255,255,0.75)' },
    cardBody: { padding: 14 },
    cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: FH_DARK, flex: 1, marginRight: 8 },
    ratingPill: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: '#FEF8E8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    },
    ratingText: { fontSize: 11, fontWeight: '700', color: FH_EARTH, fontFamily: 'ManropeRegular' },
    addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
    addressText: { fontSize: 12, color: '#939393', fontFamily: 'ManropeRegular', flex: 1 },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
    chip: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: FH_LIGHT,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    },
    chipText: { fontSize: 11, color: FH_DARK, fontFamily: 'ManropeRegular', fontWeight: '500', marginLeft: 3 },

    // ── FILTER SHEET ──
    actionSheetContainer: { backgroundColor: '#fff', paddingBottom: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
    filterSectionLabel: { fontFamily: 'ManropeRegular', fontWeight: '700', color: FH_DARK, fontSize: 14, paddingLeft: 16, paddingTop: 18, paddingBottom: 4 },
    filterChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 4, gap: 8, alignItems: 'center' },
    filterChip: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent' },
    filterChipActive: { borderColor: FH_GREEN, backgroundColor: FH_LIGHT },
    filterChipText: { fontSize: 13, fontFamily: 'ManropeRegular', color: '#555' },
    filterChipTextActive: { color: FH_GREEN, fontWeight: '700' },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
    switchLabel: { fontSize: 13, fontFamily: 'ManropeRegular', color: '#333' },
    filterFooter: {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        flexDirection: 'row', padding: 16, gap: 12,
        backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F1F1',
    },
    filterClearBtn: { flex: 1, paddingVertical: 13, backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center' },
    filterClearText: { fontSize: 14, fontWeight: '600', color: '#555', fontFamily: 'ManropeRegular' },
    filterApplyBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
    filterApplyGradient: { paddingVertical: 13, alignItems: 'center' },
    filterApplyText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'ManropeRegular' },

    // ── FOOTER / EMPTY / SKELETON ──
    footerLoader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 20 },
    footerLoaderText: { fontSize: 13, color: '#939393', fontFamily: 'ManropeRegular' },
    emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: FH_DARK, fontFamily: 'ManropeRegular', marginTop: 16 },
    emptySubtitle: { fontSize: 13, color: '#939393', fontFamily: 'ManropeRegular', textAlign: 'center', marginTop: 8, lineHeight: 20 },
    emptyBtn: { marginTop: 20, backgroundColor: FH_LIGHT, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 1, borderColor: FH_GREEN },
    emptyBtnText: { color: FH_GREEN, fontWeight: '700', fontFamily: 'ManropeRegular', fontSize: 14 },
    skeletonImage: { width: '100%', height: 200, backgroundColor: '#E8F0E8' },
    skeletonBody: { padding: 14 },
    skeletonLine: { height: 14, borderRadius: 7, backgroundColor: '#E8F0E8', width: '80%' },
    skeletonChip: { height: 28, width: 72, borderRadius: 14, backgroundColor: '#E8F0E8' },
});

export default FarmHouse;