import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Dimensions,
    FlatList, SafeAreaView, ActivityIndicator, ScrollView,
    Switch, TextInput, Animated
} from 'react-native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Banquet Hall theme — deep crimson + warm gold ─────────────────────────────
const BH_DARK = '#1A0808';   // deep maroon-black
const BH_ACCENT = '#A0143E';   // primary crimson
const BH_GOLD = '#ECA73C';   // harvest gold
const BH_CREAM = '#FDF5F5';   // warm rose-cream background
const BH_LIGHT = '#FAE8EC';   // light crimson tint for chips

const VENUE_CATEGORY = 'Banquet Hall';
const PAGE_SIZE = 20;

const seatingCapacity = ['50-100', '100-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+'];
const priceRanges = ['10k-50k', '50k-1L', '1L-2L', '2L-3L', '3L-5L', '5L-10L', '10L-12L', '12L-15L', '15L-20L', '20L+'];
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
// Display helpers only; preserve existing styles and data-loading behaviour.
const cleanText = value => typeof value === 'string' ? value.trim() : '';
const venueLocality = item => cleanText(item?.county) || cleanText(item?.locality) ||
    cleanText(item?.functionHallAddress?.city) || 'Location not provided';
const mediaList = value => Array.isArray(value) ? value.flat(Infinity).filter(Boolean) : [];
const positiveNumber = value => {
    if (!['string', 'number'].includes(typeof value)) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};
const startingMenuPrice = item => {
    const prices = mediaList(item?.menuImages).map(menu => positiveNumber(menu?.menuPrice))
        .filter(price => price !== null);
    return prices.length ? Math.min(...prices) : null;
};
const formatPlatePrice = price => `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

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

const BanquetHalls = () => {
    const navigation = useNavigation();
    const actionSheetRef = useRef(null);
    const heroProgress = useRef(new Animated.Value(0)).current;
    const isHeroCollapsedRef = useRef(false);
    const isHeroAnimatingRef = useRef(false);
    const lastScrollYRef = useRef(0);

    const heroContentHeight = heroProgress.interpolate({
        inputRange: [0, 1], outputRange: [105, 0], extrapolate: 'clamp',
    });
    const heroContentOpacity = heroProgress.interpolate({
        inputRange: [0, 0.55, 1], outputRange: [1, 0.35, 0], extrapolate: 'clamp',
    });
    const heroContentTranslateY = heroProgress.interpolate({
        inputRange: [0, 1], outputRange: [0, -18], extrapolate: 'clamp',
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
    const [totalEventItems, setTotalEventItems] = useState(0);
    const [filterDataCurrentPage, setFilterDataCurrentPage] = useState(1);
    const [filterDataLimit] = useState(PAGE_SIZE);
    const [hasMoreFilterData, setHasMoreFilterData] = useState(true);
    const [filterDataLoading, setFilterDataLoading] = useState(false);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [totalFilterDataPages, setTotalFilterDataPages] = useState(0);
    const [totalFilterItems, setTotalFilterItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const isFetchingRef = useRef(false);
    const isFetchingFilterRef = useRef(false);
    const currentPageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const totalEventPagesRef = useRef(0);
    const filterPageRef = useRef(1);
    const hasMoreFilterRef = useRef(true);
    const totalFilterPagesRef = useRef(0);
    const isFilterAppliedRef = useRef(false);
    const authTokenRef = useRef(null);

    const getCachedAuthToken = useCallback(async () => {
        if (authTokenRef.current) return authTokenRef.current;
        const token = await getUserAuthToken();
        authTokenRef.current = token;
        return token;
    }, []);

    useEffect(() => { getAllEvents(1); getAllLocations(); }, []);

    const getAllEvents = async (page) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        try {
            const token = await getCachedAuthToken();
            const response = await axios.get(
                `${BASE_URL}/filterFunctionHalls`,
                {
                    params: {
                        page,
                        limit: PAGE_SIZE,
                        venueCategory: "Banquet Hall",
                        cardView: 'true',
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const allData = Array.isArray(response?.data?.data) ? response.data.data : [];
            const newData = allData.filter(item => item?.venueCategory === VENUE_CATEGORY);
            const total = response?.data?.totalPages ?? 0;
            const totalItems = Number(response?.data?.totalItems ?? newData.length);
            currentPageRef.current = page;
            totalEventPagesRef.current = total;
            hasMoreRef.current = page < total;
            setCurrentPage(page); setTotalEventPages(total); setHasMore(page < total);
            setTotalEventItems(Number.isFinite(totalItems) ? totalItems : newData.length);
            setEventsData(prev => {
                if (page === 1) return newData;
                const existingIds = new Set(prev.map(item => String(item?._id)));
                return [...prev, ...newData.filter(item => !existingIds.has(String(item?._id)))];
            });
        } catch (e) { console.error('FarmHouse fetch error:', e); }
        finally { isFetchingRef.current = false; setLoading(false); }
    };

    const getAllEventsByLocation = async (value) => {
        try {
            const token = await getCachedAuthToken();
            const res = await axios.get(`${BASE_URL}/getAllFunctionHallsByLocation/${value}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setLocationBasedData((res?.data?.data ?? []).filter(i => i?.venueCategory === VENUE_CATEGORY));
        } catch (e) { console.error(e); }
    };

    const getAllLocations = async () => {
        try {
            const token = await getCachedAuthToken();
            const res = await axios.get(`${BASE_URL}/user/locationList`, { headers: { Authorization: `Bearer ${token}` } });
            setAllLocations(res?.data?.data ?? []);
        } catch (e) { console.error(e); }
    };

    const fetchFilteredFunctionHalls = async (reset = false, page = 1) => {
        if (isFetchingFilterRef.current) return;
        isFetchingFilterRef.current = true;
        setFilterDataLoading(true);
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
        qp.append('page', page);
        qp.append('limit', filterDataLimit);
        qp.append('cardView', 'true');
        try {
            const token = await getCachedAuthToken();
            const response = await axios.get(
                `${BASE_URL}/filterFunctionHalls?${qp.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const allData = response?.data?.data ?? [];
            const newData = allData.filter(item => item?.venueCategory === VENUE_CATEGORY);
            const total = response?.data?.totalPages ?? 1;
            const totalItems = Number(response?.data?.totalItems ?? newData.length);
            filterPageRef.current = page;
            totalFilterPagesRef.current = total;
            hasMoreFilterRef.current = page < total;
            setFilterDataCurrentPage(page);
            setTotalFilterDataPages(total);
            setTotalFilterItems(Number.isFinite(totalItems) ? totalItems : newData.length);
            setHasMoreFilterData(page < total);
            setFilteredList(prev => {
                if (reset) return newData;
                const existingIds = new Set(prev.map(item => String(item?._id)));
                return [...prev, ...newData.filter(item => !existingIds.has(String(item?._id)))];
            });
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
        setCurrentPage(1); setTotalEventItems(0); setHasMore(true); getAllEvents(1);
    };
    const applyFilters = () => {
        setFilteredList([]);
        filterPageRef.current = 1; hasMoreFilterRef.current = true;
        totalFilterPagesRef.current = 0; isFetchingFilterRef.current = false;
        setFilterDataCurrentPage(1); setTotalFilterItems(0); setHasMoreFilterData(true);
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
        if (isFilterApplied) return filteredList; // show empty array if filter returned 0
        return eventsData;
    }, [query, locationBasedData, nameFilteredData, filteredList, eventsData, isFilterApplied]);

    const countText = useMemo(() => {
        if (query && locationBasedData.length > 0) return `${locationBasedData.length} Banquet Halls in "${query}"`;
        if (query && nameFilteredData.length > 0) return `${nameFilteredData.length} Halls matching "${query}"`;
        if (query) return 'No banquet halls found';
        if (filteredList.length > 0 || isFilterApplied)
            return totalFilterItems === 0
                ? 'No halls found'
                : `${filteredList.length} of ${totalFilterItems} Filtered Banquet Halls`;
        return totalEventItems === 0
            ? 'No banquet halls found'
            : `${eventsData.length} of ${totalEventItems} Banquet Halls`;
    }, [query, locationBasedData, nameFilteredData, filteredList, isFilterApplied,
        eventsData, totalEventItems, totalFilterItems]);

    const activeFilterCount = [selectedSeatingCapacity, selectedPriceRange, selectedChip, isACSelected, switchCateringVal || null].filter(Boolean).length;
    const keyExtractor = useCallback((item) => item._id, []);
    const onEndReached = useCallback(() => {
        isFilterAppliedRef.current ? loadMoreFiltered() : loadMore();
    }, []);

    const renderItem = useCallback(({ item }) => {
        const heroImage = item?.professionalImage?.url;
        const additionalImageCount = Number(item?.additionalImageCount);
        const videoCount = Number(item?.videoCount);
        const menuBased = item?.pricingType === 'menu_based' || item?.menuAvailable === true ||
            mediaList(item?.menuImages).length > 0;
        const menuPrice = startingMenuPrice(item);
        const rent = positiveNumber(item?.rentPricePerDay);
        const totalPhotos = (heroImage ? 1 : 0) +
            (Number.isFinite(additionalImageCount)
                ? additionalImageCount
                : mediaList(item?.additionalImages).length);
        const hasVideo = Number.isFinite(videoCount)
            ? videoCount > 0
            : mediaList(item?.hallVideos).length > 0;
        return (
            <View style={styles.card}>
                <View style={styles.cardImageWrapper}>
                    {heroImage ? (
                        <TouchableOpacity
                            activeOpacity={0.93}
                            onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}
                            style={styles.cardImageWrapper}>
                            <FastImage
                                source={{
                                    uri: heroImage,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                                style={styles.cardImage}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EBEBEB' }}
                            onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
                            <IonIcon name="image-outline" size={36} color="#939393" />
                            <Text style={[styles.addressText, { flex: 0, marginTop: 8 }]}>Photo not available</Text>
                        </TouchableOpacity>
                    )}
                    <LinearGradient colors={['transparent', 'rgba(26,8,8,0.72)']} style={styles.cardImageGradient} pointerEvents="none" />
                    <View style={styles.banquetBadge}>
                        <IonIcon name="ribbon" size={10} color="#fff" />
                        <Text style={styles.banquetBadgeText}>Banquet</Text>
                    </View>
                    {hasVideo && (
                        <View style={styles.videoBadge}>
                            <IonIcon name="videocam" size={11} color="#fff" />
                            <Text style={styles.badgeText}>Video</Text>
                        </View>
                    )}
                    {totalPhotos > 0 && (
                        <View style={styles.photoBadge}>
                            <IonIcon name="images-outline" size={11} color="#fff" />
                            <Text style={styles.badgeText}>{totalPhotos}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity activeOpacity={0.93}
                    onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
                    <View style={styles.cardBody}>
                        <View style={styles.cardTitleRow}>
                            <Text style={styles.cardTitle} numberOfLines={2}>{item?.functionHallName}</Text>
                            <View style={styles.priceOverlay}>
                                {menuBased
                                    ? menuPrice !== null
                                        ? <Text style={styles.priceText}>From {formatPlatePrice(menuPrice)}<Text style={styles.priceUnit}>/plate</Text></Text>
                                        : <Text style={styles.priceText}>Menu price on request</Text>
                                    : rent !== null
                                        ? <Text style={styles.priceText}>{formatAmount(rent)}<Text style={styles.priceUnit}>/day</Text></Text>
                                        : <Text style={styles.priceText}>Price on request</Text>}
                            </View>
                        </View>
                        <View style={styles.addressRow}>
                            <LocationMarkIcon width={12} height={12} />
                            <Text numberOfLines={1} style={styles.addressText}>{venueLocality(item)}</Text>
                        </View>
                        <View style={styles.chipsRow}>
                            {item?.seatingCapacity ? (
                                <View style={styles.chip}>
                                    <IonIcon name="people-outline" size={11} color={BH_ACCENT} />
                                    <Text style={styles.chipText}>{item?.seatingCapacity} pax</Text>
                                </View>) : null}
                            {item?.bedRooms > 0 && (
                                <View style={styles.chip}>
                                    <IonIcon name="bed-outline" size={11} color={BH_ACCENT} />
                                    <Text style={styles.chipText}>{item?.bedRooms} Rooms</Text>
                                </View>)}
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
    }, [navigation]);

    const isApplyDisabled = !selectedPriceRange && !selectedSeatingCapacity && isACSelected === null && !selectedChip && !switchCateringVal;

    const ListFooter = useCallback(() => {
        if (!loading && !filterDataLoading) return null;
        return (<View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={BH_ACCENT} />
            <Text style={styles.footerLoaderText}>Loading banquet halls...</Text>
        </View>);
    }, [loading, filterDataLoading]);

    const ListEmpty = useCallback(() => (
        <View style={styles.emptyState}>
            <IonIcon name="ribbon-outline" size={56} color={BH_LIGHT} />
            <Text style={styles.emptyTitle}>No Banquet Halls Found</Text>
            <Text style={styles.emptySubtitle}>
                {isFilterApplied ? 'Try adjusting your filters.' : 'No banquet halls available right now.'}
            </Text>
            {isFilterApplied && (
                <TouchableOpacity style={styles.emptyBtn} onPress={clearFilters}>
                    <Text style={styles.emptyBtnText}>Clear Filters</Text>
                </TouchableOpacity>)}
        </View>
    ), [isFilterApplied]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ActionSheet ref={actionSheetRef} statusBarTranslucent closeOnPressBack
                defaultOverlayOpacity={0.5} containerStyle={styles.actionSheetContainer}>
                <FloatingCloseButton onPress={() => actionSheetRef.current?.hide()} />
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text style={styles.filterSectionLabel}>Seating Capacity</Text>
                    <View style={styles.filterChipsWrap}>
                        {seatingCapacity.map(item => (
                            <TouchableOpacity key={item}
                                style={[styles.filterChip, selectedSeatingCapacity === item && styles.filterChipActive]}
                                onPress={() => setSelectedSeatingCapacity(selectedSeatingCapacity === item ? '' : item)}>
                                <Text style={[styles.filterChipText, selectedSeatingCapacity === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>))}
                    </View>
                    <Text style={styles.filterSectionLabel}>AC / Non-AC</Text>
                    <View style={styles.filterChipsWrap}>
                        {['AC', 'Non-AC'].map(item => (
                            <TouchableOpacity key={item}
                                style={[styles.filterChip, isACSelected === item && styles.filterChipActive]}
                                onPress={() => setIsACSelected(isACSelected === item ? null : item)}>
                                <Text style={[styles.filterChipText, isACSelected === item && styles.filterChipTextActive]}>{item}</Text>
                            </TouchableOpacity>))}
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>In-house Catering</Text>
                            <Switch trackColor={{ false: '#E8E8E8', true: '#F5C0CC' }}
                                thumbColor={switchCateringVal ? BH_ACCENT : '#ccc'}
                                onValueChange={(val) => {
                                    setSwitchCateringVal(val);
                                    if (val) { setSelectedChip(''); setSelectedPriceRange(''); }
                                }}
                                value={switchCateringVal} />
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
                            </TouchableOpacity>))}
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
                            </TouchableOpacity>))}
                    </View>
                </ScrollView>
                <View style={styles.filterFooter}>
                    <TouchableOpacity style={styles.filterClearBtn} onPress={clearFilters}>
                        <Text style={styles.filterClearText}>Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterApplyBtn, isApplyDisabled && { opacity: 0.45 }]}
                        onPress={applyFilters} disabled={isApplyDisabled}>
                        <LinearGradient colors={[BH_ACCENT, '#D2453B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.filterApplyGradient}>
                            <Text style={styles.filterApplyText}>Apply Filters</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

            {/* ── BANQUET HALLS HERO ── */}
                    <LinearGradient colors={['#B63282', '#93186C', '#68133F']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
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
                                        <IonIcon name="ribbon" size={11} color={BH_GOLD} />
                                        <Text style={styles.heroBadgeText}>Grand Venues</Text>
                                    </View>
                                    <Text style={styles.heroTitle}>Banquet Halls</Text>
                                    <Text style={styles.heroSub}>Premium halls for all occasions</Text>
                                </View>
                                <View style={styles.heroIconWrap}>
                                    <IonIcon name="ribbon" size={32} color={BH_GOLD} />
                                </View>
                            </View>
                        </Animated.View>
                        <View style={styles.searchBar}>
                            <IonIcon name="search-outline" size={16} color="black" style={{ marginRight: 8 }} />
                            <TextInput style={styles.searchInput} value={query} onChangeText={handleQueryChange}
                                placeholder="Search banquet halls by name or area..."
                                placeholderTextColor="black" returnKeyType="search" />
                            {query.length > 0 && (
                                <TouchableOpacity onPress={() => { setQuery(''); setDropdownVisible(false); setLocationBasedData([]); }}>
                                    <IonIcon name="close-circle" size={16} color="rgba(236,167,60,0.7)" />
                                </TouchableOpacity>)}
                        </View>
                        {dropdownVisible && (locationSuggestions.length > 0 || nameFilteredData.length > 0) && (
                            <View style={styles.dropdown}>
                                {locationSuggestions.map((item, index) => (
                                    <TouchableOpacity key={`area-${item._id}`}
                                        style={[styles.dropdownItem, index < locationSuggestions.length - 1 && styles.dropdownDivider]}
                                        onPress={() => { setQuery(item.value); setDropdownVisible(false); getAllEventsByLocation(item.value); }}>
                                        <IonIcon name="location-outline" size={13} color={BH_GOLD} style={{ marginRight: 8 }} />
                                        <Text style={styles.dropdownText}>{item.value}</Text>
                                    </TouchableOpacity>))}
                                {nameFilteredData.slice(0, 4).map((item, index) => (
                                    <TouchableOpacity key={`bh-${item._id}`}
                                        style={[styles.dropdownItem, index < 3 && styles.dropdownDivider]}
                                        onPress={() => { setDropdownVisible(false); navigation.navigate('ViewEvents', { categoryId: item._id }); }}>
                                        <IonIcon name="business-outline" size={13} color="#939393" style={{ marginRight: 8 }} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.dropdownText} numberOfLines={1}>{item.functionHallName}</Text>
                                            <Text style={styles.dropdownSubText} numberOfLines={1}>{venueLocality(item)}</Text>
                                        </View>
                                        <IonIcon name="chevron-forward" size={12} color="#ccc" />
                                    </TouchableOpacity>))}
                            </View>)}
                    </LinearGradient>

            {/* ── HEADER ROW ── */}

            <View style={{ flex: 1 }}>

                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.headerTitle}>Banquet Halls</Text>
                        <Text style={styles.headerSubtitle}>{countText}</Text>
                    </View>
                    <TouchableOpacity style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                        onPress={() => actionSheetRef.current?.show()}>
                        <IonIcon name="options-outline" size={16} color={activeFilterCount > 0 ? '#fff' : BH_ACCENT} />
                        <Text style={[styles.filterBtnText, activeFilterCount > 0 && { color: '#fff' }]}>Filter</Text>
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>)}
                    </TouchableOpacity>
                </View>

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
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={ListFooter}
                        ListEmptyComponent={ListEmpty}
                        contentContainerStyle={styles.listContent}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        updateCellsBatchingPeriod={50}
                        windowSize={7}
                        initialNumToRender={4}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: BH_CREAM },
    listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },

    // ── HERO ──
    heroHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, overflow: 'hidden' },
    heroCircle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -50 },
    heroCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20 },
    heroCollapsible: { overflow: 'hidden' },
    heroRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 16 },
    heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    heroBadgeText: { fontFamily: 'ManropeRegular', fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    heroTitle: { fontFamily: 'ManropeRegular', fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
    heroSub: { fontFamily: 'ManropeRegular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
    heroIconWrap: { width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },

    // ── SEARCH ──
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', marginTop: 20, bottom:10 },
    searchInput: { flex: 1, fontSize: 13, fontFamily: 'ManropeRegular', color: 'black', padding: 0 },
    dropdown: { backgroundColor: '#fff', borderRadius: 12, marginTop: 6, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, overflow: 'hidden' },
    dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11 },
    dropdownDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F1F1' },
    dropdownText: { fontSize: 13, fontFamily: 'ManropeRegular', color: '#333', flex: 1 },
    dropdownSubText: { fontSize: 11, fontFamily: 'ManropeRegular', color: '#939393', marginTop: 1 },

    // ── HEADER ROW ──
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
    headerTitle: { fontFamily: 'ManropeRegular', fontSize: 17, fontWeight: '800', color: BH_DARK },
    headerSubtitle: { fontFamily: 'ManropeRegular', fontSize: 12, color: '#7D7F88', marginTop: 2 },
    filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3, borderWidth: 1, borderColor: BH_LIGHT },
    filterBtnActive: { backgroundColor: BH_ACCENT, borderColor: BH_ACCENT },
    filterBtnText: { fontSize: 13, fontWeight: '600', fontFamily: 'ManropeRegular', color: BH_ACCENT },
    filterBadge: { backgroundColor: '#fff', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 2 },
    filterBadgeText: { fontSize: 10, fontWeight: '800', color: BH_ACCENT, fontFamily: 'ManropeRegular' },

    // ── CARD ──
    card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, overflow: 'hidden' },
    cardImageWrapper: { width: '100%', height: 200 },
    cardImage: { width: '100%', height: '100%' },
    cardImageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
    banquetBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(160,20,62,0.88)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
    banquetBadgeText: { fontFamily: 'ManropeRegular', fontSize: 10, fontWeight: '700', color: '#fff' },
    videoBadge: { position: 'absolute', top: 12, left: 86, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(236,167,60,0.85)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
    photoBadge: { position: 'absolute', bottom: 10, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', fontFamily: 'ManropeRegular' },
    priceOverlay: { flexShrink: 0, maxWidth: '52%', alignItems: 'flex-end' },
    priceText: { color: BH_ACCENT, fontSize: 13, fontWeight: '800', fontFamily: 'ManropeRegular', textAlign: 'right' },
    priceUnit: { fontSize: 10, fontWeight: '400', color: BH_ACCENT },
    cardBody: { padding: 14 },
    cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    cardTitle: { fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: BH_DARK, flex: 1, marginRight: 8 },
    addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
    addressText: { fontSize: 12, color: '#939393', fontFamily: 'ManropeRegular', flex: 1 },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: BH_LIGHT, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    chipText: { fontSize: 11, color: BH_DARK, fontFamily: 'ManropeRegular', fontWeight: '500', marginLeft: 3 },

    // ── FILTER SHEET ──
    actionSheetContainer: { backgroundColor: '#fff', paddingBottom: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
    filterSectionLabel: { fontFamily: 'ManropeRegular', fontWeight: '700', color: BH_DARK, fontSize: 14, paddingLeft: 16, paddingTop: 18, paddingBottom: 4 },
    filterChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 4, gap: 8, alignItems: 'center' },
    filterChip: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: 'transparent' },
    filterChipActive: { borderColor: BH_ACCENT, backgroundColor: BH_LIGHT },
    filterChipText: { fontSize: 13, fontFamily: 'ManropeRegular', color: '#555' },
    filterChipTextActive: { color: BH_ACCENT, fontWeight: '700' },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
    switchLabel: { fontSize: 13, fontFamily: 'ManropeRegular', color: '#333' },
    filterFooter: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', padding: 16, gap: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F1F1' },
    filterClearBtn: { flex: 1, paddingVertical: 13, backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center' },
    filterClearText: { fontSize: 14, fontWeight: '600', color: '#555', fontFamily: 'ManropeRegular' },
    filterApplyBtn: { flex: 2, borderRadius: 12, overflow: 'hidden' },
    filterApplyGradient: { paddingVertical: 13, alignItems: 'center' },
    filterApplyText: { fontSize: 14, fontWeight: '700', color: '#fff', fontFamily: 'ManropeRegular' },

    // ── FOOTER / EMPTY / SKELETON ──
    footerLoader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 20 },
    footerLoaderText: { fontSize: 13, color: '#939393', fontFamily: 'ManropeRegular' },
    emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: BH_DARK, fontFamily: 'ManropeRegular', marginTop: 16 },
    emptySubtitle: { fontSize: 13, color: '#939393', fontFamily: 'ManropeRegular', textAlign: 'center', marginTop: 8, lineHeight: 20 },
    emptyBtn: { marginTop: 20, backgroundColor: BH_LIGHT, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, borderWidth: 1, borderColor: BH_ACCENT },
    emptyBtnText: { color: BH_ACCENT, fontWeight: '700', fontFamily: 'ManropeRegular', fontSize: 14 },
    skeletonImage: { width: '100%', height: 200, backgroundColor: '#F5E8EC' },
    skeletonBody: { padding: 14 },
    skeletonLine: { height: 14, borderRadius: 7, backgroundColor: '#F5E8EC', width: '80%' },
    skeletonChip: { height: 28, width: 72, borderRadius: 14, backgroundColor: '#F5E8EC' },
});

export default BanquetHalls;