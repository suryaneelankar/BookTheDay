import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView,
  ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import BASE_URL from '../../apiconfig';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import { formatAmount } from '../../utils/GlobalFunctions';

const CATEGORIES = ['Function Hall', 'Banquet Hall', 'Farm House', 'Luxury Resort'];
const THEMES = {
  'Function Hall': ['#FFF0E6', '#9A3412'], 'Banquet Hall': ['#FFF7D6', '#785A12'],
  'Farm House': ['#EAF5EC', '#2F653B'], 'Luxury Resort': ['#EAF3FB', '#285E83'],
};
const positive = value => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};
function priceDetails(item) {
  const menus = Array.isArray(item.menuImages) ? item.menuImages.flat(Infinity).filter(Boolean) : [];
  const menuBased = item.pricingType === 'menu_based' || item.menuAvailable === true || menus.length > 0;
  const prices = menus.map(menu => positive(menu.menuPrice)).filter(n => n !== null);
  const rent = positive(item.rentPricePerDay);
  return { menuBased, label: menuBased
    ? (prices.length ? `From ${formatAmount(Math.min(...prices))}/plate` : 'Menu price on request')
    : (rent ? `${formatAmount(rent)}/day` : 'Price on request') };
}
const locality = item => [item.county, item.functionHallAddress?.city]
  .find(value => typeof value === 'string' && value.trim())?.trim() || 'View location details';

export default function HomeVenueFeed({ mode }) {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const listRef = useRef(null);
  const request = useRef(0);
  const busy = useRef(false);
  const page = useRef(0);
  const snapshot = useRef(null);
  const more = useRef(false);
  const lastError = useRef(false);
  const failedReset = useRef(true);
  const fetchPage = useCallback(async (reset = false, pull = false) => {
    if (busy.current) return;
    if (!reset && !more.current) return;
    busy.current = true;
    lastError.current = false;
    const id = ++request.current;
    const nextPage = reset ? 1 : page.current + 1;
    setError(''); setLoading(true); setRefreshing(pull);
    try {
      const token = await getUserAuthToken();
      if (id !== request.current) return;
      const response = await axios.get(`${BASE_URL}/filterFunctionHalls`, {
        params: { homeFeed: mode, page: nextPage, limit: 20,
          ...(category ? { venueCategory: category } : {}),
          ...(!reset && snapshot.current ? { asOf: snapshot.current } : {}) },
        headers: { Authorization: `Bearer ${token}` }, timeout: 20000,
      });
      if (id !== request.current) return;
      const result = response.data;
      // Prevent an old backend from silently returning an unfiltered 'recent' list.
      if (result?.homeFeed !== mode || !Array.isArray(result.data) || !result.asOf) {
        throw new Error('The venue list update is not available yet. Please try again later.');
      }
      setItems(current => {
        const merged = new Map((reset ? [] : current).map(item => [String(item._id), item]));
        result.data.forEach(item => { if (item?._id) merged.set(String(item._id), item); });
        return [...merged.values()];
      });
      page.current = nextPage; snapshot.current = result.asOf;
      more.current = result.hasMore === true;
      setHasMore(more.current); setTotal(result.totalItems);
    } catch (failure) {
      if (id === request.current) {
        lastError.current = true;
        failedReset.current = reset;
        setError(failure.response?.data?.message || failure.message || 'Unable to load venues.');
      }
    } finally {
      if (id === request.current) { busy.current = false; setLoading(false); setRefreshing(false); }
    }
  }, [mode, category]);

  useEffect(() => {
    // Invalidate old responses when category changes or this screen unmounts.
    request.current++; busy.current = false; page.current = 0;
    snapshot.current = null; more.current = false; lastError.current = false;
    setItems([]); setTotal(0); setHasMore(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    fetchPage(true);
    return () => { request.current++; busy.current = false; };
  }, [fetchPage]);

  const renderItem = useCallback(({ item }) => {
    const [backgroundColor, color] = THEMES[item.venueCategory] || THEMES['Function Hall'];
    const price = priceDetails(item);
    const guests = positive(item.includedGuestCount);
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9}
        accessibilityRole="button" accessibilityLabel={`View ${item.functionHallName}`}
        onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
        {item.professionalImage?.url
          ? <FastImage source={{ uri: item.professionalImage.url }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
          : <View style={[styles.image, styles.placeholder]}><IonIcon name="image-outline" size={34} color="#8B6F57" /></View>}
        <View style={styles.body}>
          <View style={[styles.badge, { backgroundColor }]}><Text style={[styles.badgeText, { color }]}>{item.venueCategory}</Text></View>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>{item.functionHallName}</Text>
            <Text style={styles.price}>{price.label}</Text>
          </View>
          {item.venueCategory === 'Farm House' && !price.menuBased && Number.isInteger(guests) &&
            <Text style={styles.guests}>Includes {guests} {guests === 1 ? 'guest' : 'guests'}</Text>}
          <Text style={styles.locality} numberOfLines={1}>{locality(item)}</Text>
          <View style={styles.features}>
            {!!item.seatingCapacity && <Text style={styles.feature}>Seating: {item.seatingCapacity}</Text>}
            {positive(item.bedRooms) !== null && <Text style={styles.feature}>{item.bedRooms} rooms</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" style={styles.back} onPress={() => navigation.goBack()}>
          <IonIcon name="chevron-back" size={24} color="#1A1E25" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>{mode === 'recent' ? 'Recently Added' : 'Discover Venues'}</Text>
          <Text style={styles.subtitle}>{mode === 'recent' ? 'Added in the last 10 days • Newest first' : 'All venue categories • Newest first'}</Text>
        </View>
      </View>
      <View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {['', ...CATEGORIES].map(value => <TouchableOpacity key={value || 'all'}
          accessibilityRole="button" accessibilityState={{ selected: value === category }}
          onPress={() => setCategory(value)} style={[styles.category, value === category && styles.categoryActive]}>
          <Text style={[styles.categoryText, value === category && styles.categorySelected]}>{value || 'All'}</Text>
        </TouchableOpacity>)}
      </ScrollView></View>
      {items.length > 0 && <Text style={styles.count}>{items.length} of {total} venues</Text>}
      <FlatList ref={listRef} data={items} renderItem={renderItem} keyExtractor={item => String(item._id)}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        initialNumToRender={5} maxToRenderPerBatch={5} windowSize={7}
        refreshing={refreshing} onRefresh={() => fetchPage(true, true)}
        onEndReached={() => { if (!lastError.current) fetchPage(false); }} onEndReachedThreshold={0.4}
        ListEmptyComponent={loading ? <View style={styles.state}><ActivityIndicator color="#A74416" /><Text style={styles.subtitle}>Loading venues…</Text></View>
          : !error ? <View style={styles.state}><Text style={styles.heading}>No venues found</Text><Text style={styles.subtitle}>
            {mode === 'recent' ? 'No matching venues were added in the last 10 days.' : 'No venues are available in this category right now.'}</Text></View> : null}
        ListFooterComponent={<View style={styles.footer}>
          {!!error && <><Text accessibilityRole="alert" style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.retry} disabled={loading} onPress={() => fetchPage(failedReset.current)}><Text style={styles.categorySelected}>Retry</Text></TouchableOpacity>
            <TouchableOpacity disabled={loading} onPress={() => fetchPage(true, true)}><Text style={styles.subtitle}>Refresh list</Text></TouchableOpacity></>}
          {loading && items.length > 0 && <ActivityIndicator color="#A74416" />}
          {!loading && !error && hasMore && <TouchableOpacity style={styles.retry} onPress={() => fetchPage(false)}><Text style={styles.categorySelected}>Load more</Text></TouchableOpacity>}
          {!loading && !error && !hasMore && items.length > 0 && <Text style={styles.subtitle}>You’ve reached the end.</Text>}
        </View>} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff' },
  back: { padding: 8, marginRight: 6 }, heading: { fontSize: 18, fontWeight: '700', color: '#1A1E25', fontFamily: 'ManropeRegular' },
  subtitle: { fontSize: 12, color: '#716B64', marginTop: 6, lineHeight: 18 },
  categories: { padding: 12, gap: 8 }, category: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: '#F0EAE3' },
  categoryActive: { backgroundColor: '#A74416' }, categoryText: { color: '#665347', fontSize: 12 }, categorySelected: { color: '#fff', fontSize: 12, fontWeight: '600' },
  count: { color: '#716B64', fontSize: 12, marginHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 28, flexGrow: 1 }, card: { borderRadius: 16, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 16 },
  image: { width: '100%', height: 180 }, placeholder: { backgroundColor: '#EEE8DF', alignItems: 'center', justifyContent: 'center' }, body: { padding: 14 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, marginBottom: 8 }, badgeText: { fontSize: 11, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' }, name: { flex: 1, fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: '#1A1E25', marginRight: 8 },
  price: { maxWidth: '48%', color: '#A74416', fontSize: 13, fontWeight: '700', textAlign: 'right' }, guests: { color: '#2F653B', fontSize: 12, marginTop: 6, textAlign: 'right' },
  locality: { color: '#716B64', fontSize: 12, marginTop: 8 }, features: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }, feature: { fontSize: 11, color: '#665347', backgroundColor: '#FFF4E7', padding: 6, borderRadius: 8 },
  state: { padding: 32, alignItems: 'center' }, footer: { alignItems: 'center', padding: 16 }, retry: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#A74416', borderRadius: 10, marginVertical: 10 }, error: { color: '#A12A24', fontSize: 13, textAlign: 'center' },
});
