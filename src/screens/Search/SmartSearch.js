import React, { useState, useCallback, useMemo } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Modal from 'react-native-modal';
import GuestSelector from './components/GuestSelector';
import BudgetSelector from './components/BudgetSelector';
import { POPULAR_SEARCHES, SEARCH_COLORS } from './constants';

// Static objects moved outside component — never recreated
const CALENDAR_THEME = {
    arrowColor: SEARCH_COLORS.PRIMARY,
    todayTextColor: SEARCH_COLORS.PRIMARY,
    selectedDayBackgroundColor: SEARCH_COLORS.PRIMARY,
};

const MODAL_STYLE = { margin: 0, justifyContent: 'flex-end' };

const SmartSearch = () => {
    const navigation = useNavigation();

    // ── State ──
    const [location] = useState('Hyderabad'); // Will be set from LocationAdded screen via route params
    const [selectedDate, setSelectedDate] = useState(null);
    const [guestCount, setGuestCount] = useState('');
    const [budgetRange, setBudgetRange] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    // ── Memoized values — prevent object recreation on every render ──
    const todayDate = useMemo(() => moment().format('YYYY-MM-DD'), []);
    const formattedDate = useMemo(
        () => selectedDate ? moment(selectedDate).format('DD MMM YYYY') : 'Pick a date',
        [selectedDate]
    );
    const markedDates = useMemo(
        () => selectedDate ? { [selectedDate]: { selected: true, selectedColor: SEARCH_COLORS.PRIMARY } } : {},
        [selectedDate]
    );

    // ── Stable callbacks — useCallback prevents child re-renders ──
    const openCalendar = useCallback(() => setShowCalendar(true), []);
    const closeCalendar = useCallback(() => setShowCalendar(false), []);
    const navigateToLocation = useCallback(() => navigation.navigate('LocationAdded'), [navigation]);

    const handleDayPress = useCallback((day) => {
        setSelectedDate(day.dateString);
        setShowCalendar(false);
    }, []);

    const handleSearch = useCallback(() => {
        console.log('Search:', { location, selectedDate, guestCount, budgetRange });
        // navigation.navigate('Events', { searchParams: {...} });
    }, [location, selectedDate, guestCount, budgetRange]);

    const handleFilter = useCallback(() => {
        console.log('Open filters');
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ── HEADER ── */}
                <LinearGradient
                    colors={['#FD813B', '#DF6E12', '#B46609']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerCircle} />
                    <Text style={styles.headerTitle}>Find Your{'\n'}Perfect Venue</Text>
                    <Text style={styles.headerSub}>Search across all halls, resorts & farm houses</Text>
                </LinearGradient>

                {/* ── SEARCH CARD ── */}
                <View style={styles.searchCard}>

                    {/* Location */}
                    <TouchableOpacity style={styles.field} onPress={navigateToLocation} activeOpacity={0.8}>
                        <View style={styles.fieldIconWrap}>
                            <IonIcon name="location" size={18} color={SEARCH_COLORS.PRIMARY} />
                        </View>
                        <View style={styles.fieldContent}>
                            <Text style={styles.fieldLabel}>Location</Text>
                            <Text style={styles.fieldValue}>{location || 'Select location'}</Text>
                        </View>
                        <IonIcon name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Event Date */}
                    <TouchableOpacity style={styles.field} onPress={openCalendar} activeOpacity={0.8}>
                        <View style={[styles.fieldIconWrap, styles.fieldIconWrapAlt]}>
                            <IonIcon name="calendar-outline" size={18} color={SEARCH_COLORS.SECONDARY} />
                        </View>
                        <View style={styles.fieldContent}>
                            <Text style={styles.fieldLabel}>Event Date</Text>
                            <Text style={styles.fieldValue}>{formattedDate}</Text>
                        </View>
                        <IonIcon name="chevron-forward" size={16} color="#ccc" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Guest Selector */}
                    <GuestSelector selected={guestCount} onSelect={setGuestCount} />

                    <View style={styles.divider} />

                    {/* Budget Selector */}
                    <BudgetSelector selected={budgetRange} onSelect={setBudgetRange} />

                    {/* ── BUTTONS ROW ── */}
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.filterBtn} onPress={handleFilter} activeOpacity={0.8}>
                            <IonIcon name="options-outline" size={18} color={SEARCH_COLORS.PRIMARY} />
                            <Text style={styles.filterBtnText}>Filters</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.88}>
                            <LinearGradient
                                colors={[SEARCH_COLORS.CTA_START, SEARCH_COLORS.CTA_END]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.searchBtnGradient}
                            >
                                <IonIcon name="search" size={18} color="#fff" />
                                <Text style={styles.searchBtnText}>Search Venues</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── POPULAR SUGGESTIONS ── */}
                <View style={styles.suggestionsSection}>
                    <Text style={styles.suggestionsTitle}>Popular Searches</Text>
                    <View style={styles.suggestionsRow}>
                        {POPULAR_SEARCHES.map(tag => (
                            <TouchableOpacity key={tag} style={styles.suggestionChip} activeOpacity={0.8}>
                                <IonIcon name="trending-up" size={12} color={SEARCH_COLORS.PRIMARY} />
                                <Text style={styles.suggestionText}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* ── CALENDAR MODAL ── */}
            <Modal
                isVisible={showCalendar}
                onBackdropPress={closeCalendar}
                onBackButtonPress={closeCalendar}
                style={MODAL_STYLE}
            >
                <View style={styles.calendarSheet}>
                    <View style={styles.calendarHandle} />
                    <Text style={styles.calendarTitle}>Select Event Date</Text>
                    <Calendar
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        minDate={todayDate}
                        theme={CALENDAR_THEME}
                        style={styles.calendarStyle}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: SEARCH_COLORS.BG },
    scroll: { paddingBottom: 100 },
    header: {
        paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden',
    },
    headerCircle: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40,
    },
    headerTitle: {
        fontFamily: 'ManropeRegular', fontSize: 28, fontWeight: '800',
        color: '#fff', lineHeight: 34, marginBottom: 6,
    },
    headerSub: { fontFamily: 'ManropeRegular', fontSize: 13, color: 'rgba(255,255,255,0.75)' },
    searchCard: {
        marginHorizontal: 16, marginTop: -36,
        backgroundColor: SEARCH_COLORS.CARD_BG, borderRadius: 20, padding: 20,
        elevation: 6, shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10,
    },
    field: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
    fieldIconWrap: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: SEARCH_COLORS.TINT,
        justifyContent: 'center', alignItems: 'center',
    },
    fieldIconWrapAlt: { backgroundColor: '#FEF8E8' },
    fieldContent: { flex: 1 },
    fieldLabel: { fontFamily: 'ManropeRegular', fontSize: 11, color: SEARCH_COLORS.TEXT_SECONDARY },
    fieldValue: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '600', color: SEARCH_COLORS.TEXT_PRIMARY, marginTop: 2 },
    divider: { height: 1, backgroundColor: SEARCH_COLORS.DIVIDER, marginVertical: 4 },
    buttonsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
    filterBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 16, paddingVertical: 14,
        backgroundColor: SEARCH_COLORS.TINT, borderRadius: 14,
        borderWidth: 1, borderColor: SEARCH_COLORS.BORDER,
    },
    filterBtnText: { fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '700', color: SEARCH_COLORS.PRIMARY },
    searchBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
    searchBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
    searchBtnText: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: '#fff' },
    suggestionsSection: { marginHorizontal: 16, marginTop: 28 },
    suggestionsTitle: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: SEARCH_COLORS.TEXT_PRIMARY, marginBottom: 12 },
    suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    suggestionChip: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: SEARCH_COLORS.TINT, borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 8,
        borderWidth: 1, borderColor: SEARCH_COLORS.BORDER,
    },
    suggestionText: { fontFamily: 'ManropeRegular', fontSize: 12, color: '#555', fontWeight: '500' },
    calendarSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    calendarHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 16 },
    calendarTitle: { fontFamily: 'ManropeRegular', fontSize: 16, fontWeight: '700', color: SEARCH_COLORS.TEXT_PRIMARY, marginBottom: 12 },
    calendarStyle: { borderRadius: 12 },
});

export default SmartSearch;
