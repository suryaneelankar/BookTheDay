import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../../apiconfig';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import FastImage from 'react-native-fast-image';
import { formatAmount } from '../../utils/GlobalFunctions';
import ActionSheet from 'react-native-actions-sheet';
import LinearGradient from 'react-native-linear-gradient';

const seatingCapacity = ['50-100', '100-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+'];
const priceRanges = ['10k-50k', '50k-1L', '1L-2L', '2L-3L', '3L-5L', '5L-10L', '10L-12L', '12L-15L', '15L-20L', '20L+'];

const SearchVenues = () => {
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const actionSheetRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filter states
  const [selectedSeating, setSelectedSeating] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [isACSelected, setIsACSelected] = useState(null);
  const [withFood, setWithFood] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const timeout = setTimeout(() => {
        searchVenues(query);
      }, 500);
      return () => clearTimeout(timeout);
    } else if (!filtersApplied) {
      setResults([]);
      setSearched(false);
    }
  }, [query]);

  const searchVenues = async searchText => {
    setLoading(true);
    setSearched(true);
    const token = await getUserAuthToken();
    try {
      const params = { page: 1, limit: 50 };
      if (selectedSeating) params.seatingCapacity = selectedSeating;
      if (selectedPrice) params.priceRanges = selectedPrice;
      if (isACSelected !== null) params.ac = isACSelected === 'AC';
      if (withFood) params.withFoodOnly = true;

      const response = await axios.get(`${BASE_URL}/filterFunctionHalls`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = Array.isArray(response?.data?.data) ? response.data.data : [];
      const filtered = searchText
        ? allData.filter(
          item =>
            item?.functionHallName?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.functionHallAddress?.address?.toLowerCase().includes(searchText.toLowerCase()),
        )
        : allData;
      setResults(filtered);
    } catch (error) {
      console.log('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    actionSheetRef.current?.hide();
    setFiltersApplied(true);
    setSearched(true);
    searchVenues(query);
  };

  const clearFilters = () => {
    setSelectedSeating('');
    setSelectedPrice('');
    setIsACSelected(null);
    setWithFood(false);
    setFiltersApplied(false);
    if (query.length >= 2) {
      searchVenues(query);
    } else {
      setResults([]);
      setSearched(false);
    }
    actionSheetRef.current?.hide();
  };

  const activeFilterCount = [selectedSeating, selectedPrice, isACSelected, withFood || null].filter(Boolean).length;

  const renderItem = ({ item }) => {
    const imgUrl = item?.professionalImage?.url;
    const hasMenu = item?.menuImages?.length > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
        <FastImage
          source={{ uri: imgUrl, priority: FastImage.priority.normal }}
          style={styles.cardImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>{item?.functionHallName}</Text>
          <View style={styles.cardLocationRow}>
            <IonIcon name="location-sharp" size={12} color="#FD813B" />
            <Text style={styles.cardAddress} numberOfLines={1}>{item?.functionHallAddress?.address || ''}</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>
              {hasMenu ? 'Menu Based' : `${formatAmount(item?.rentPricePerDay)}/day`}
            </Text>
            {item?.seatingCapacity ? (
              <View style={styles.cardChip}>
                <IonIcon name="people-outline" size={11} color="#D97706" />
                <Text style={styles.cardChipText}>{item?.seatingCapacity} pax</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <IonIcon name="chevron-back" size={22} color="#1A1E25" />
        </TouchableOpacity>
        <View style={styles.searchInputWrap}>
          <IonIcon name="search-outline" size={18} color="#7E8389" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search venues, halls, resorts..."
            placeholderTextColor="#A0A5AB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <IonIcon name="close-circle" size={18} color="#A0A5AB" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => actionSheetRef.current?.show()}
          style={[styles.filterIconBtn, activeFilterCount > 0 && styles.filterIconBtnActive]}>
          <IonIcon name="options-outline" size={20} color={activeFilterCount > 0 ? '#fff' : '#1A1E25'} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {results?.length > 0
        ?
        <Text style={styles.headerSubtitle}>{results?.length} Halls found</Text>
        : <></>}

      {/* Results */}
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#D97706" />
          <Text style={styles.stateText}>Searching...</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item?._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : searched && (query.length >= 2 || filtersApplied) ? (
        <View style={styles.centerState}>
          <IonIcon name="search" size={48} color="#E0E0E0" />
          <Text style={styles.stateTitle}>No venues found</Text>
          <Text style={styles.stateText}>Try different search or adjust filters</Text>
        </View>
      ) : (
        <View style={styles.centerState}>
          <IonIcon name="business-outline" size={48} color="#E0E0E0" />
          <Text style={styles.stateTitle}>Search Venues</Text>
          <Text style={styles.stateText}>Type venue name or area to find halls, resorts & farm houses</Text>
        </View>
      )}

      {/* Filter Action Sheet */}
      <ActionSheet
        ref={actionSheetRef}
        statusBarTranslucent
        closeOnPressBack
        defaultOverlayOpacity={0.5}
        containerStyle={styles.actionSheet}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Text style={styles.filterTitle}>Filters</Text>

          <Text style={styles.filterSectionLabel}>Seating Capacity</Text>
          <View style={styles.filterChipsWrap}>
            {seatingCapacity.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.filterChip, selectedSeating === item && styles.filterChipActive]}
                onPress={() => setSelectedSeating(selectedSeating === item ? '' : item)}>
                <Text style={[styles.filterChipText, selectedSeating === item && styles.filterChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionLabel}>Price Range</Text>
          <View style={styles.filterChipsWrap}>
            {priceRanges.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.filterChip, selectedPrice === item && styles.filterChipActive]}
                onPress={() => setSelectedPrice(selectedPrice === item ? '' : item)}>
                <Text style={[styles.filterChipText, selectedPrice === item && styles.filterChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionLabel}>AC / Non-AC</Text>
          <View style={styles.filterChipsWrap}>
            {['AC', 'Non-AC'].map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.filterChip, isACSelected === item && styles.filterChipActive]}
                onPress={() => setIsACSelected(isACSelected === item ? null : item)}>
                <Text style={[styles.filterChipText, isACSelected === item && styles.filterChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>In-house Catering</Text>
              <Switch
                trackColor={{ false: '#E8E8E8', true: '#FFE0B2' }}
                thumbColor={withFood ? '#D97706' : '#ccc'}
                onValueChange={setWithFood}
                value={withFood}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.filterFooter}>
          <TouchableOpacity style={styles.filterClearBtn} onPress={clearFilters}>
            <Text style={styles.filterClearText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={applyFilters} style={styles.filterApplyWrap}>
            <LinearGradient
              colors={['#D97706', '#92400E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterApplyBtn}>
              <Text style={styles.filterApplyText}>Apply Filters</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'ManropeRegular', color: '#1A1E25', marginLeft: 8, paddingVertical: 0 },
  filterIconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  headerSubtitle: {
    fontSize: 14,
    color: '#7D7F88',
    fontFamily: 'ManropeRegular',
    marginTop: 16,
    marginHorizontal: 16,
  },
  filterIconBtnActive: { backgroundColor: '#D97706' },
  filterBadge: { position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { fontSize: 9, fontWeight: '800', color: '#D97706' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardImage: { width: '100%', height: 140 },
  cardBody: { padding: 12 },
  cardName: { fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: '#1A1E25', marginBottom: 4 },
  cardLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardAddress: { fontFamily: 'ManropeRegular', fontSize: 12, color: '#7E8389', marginLeft: 4, flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: '#D97706' },
  cardChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF8EB', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  cardChipText: { fontFamily: 'ManropeRegular', fontSize: 11, fontWeight: '600', color: '#D97706' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  stateTitle: { fontFamily: 'ManropeRegular', fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 12 },
  stateText: { fontFamily: 'ManropeRegular', fontSize: 13, color: '#7E8389', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  // Filter Sheet
  actionSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 16 },
  filterTitle: { fontFamily: 'ManropeRegular', fontSize: 18, fontWeight: '800', color: '#1A1E25', paddingHorizontal: 20, marginBottom: 16 },
  filterSectionLabel: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: '#1A1E25', paddingHorizontal: 20, marginTop: 16, marginBottom: 10 },
  filterChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E5E5', backgroundColor: '#F8F9FA' },
  filterChipActive: { backgroundColor: '#FEF3E2', borderColor: '#D97706' },
  filterChipText: { fontFamily: 'ManropeRegular', fontSize: 12, fontWeight: '600', color: '#7E8389' },
  filterChipTextActive: { color: '#D97706' },
  switchRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginTop: 10, paddingRight: 4 },
  switchLabel: { fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '600', color: '#1A1E25' },
  filterFooter: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 12 },
  filterClearBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5', alignItems: 'center' },
  filterClearText: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '600', color: '#7E8389' },
  filterApplyWrap: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  filterApplyBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  filterApplyText: { fontFamily: 'ManropeRegular', fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});

export default SearchVenues;
