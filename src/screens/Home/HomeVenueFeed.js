import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView,
  ActivityIndicator, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import BASE_URL from '../../apiconfig';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import { formatAmount } from '../../utils/GlobalFunctions';
import LinearGradient from 'react-native-linear-gradient';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/scalingMetrics';

const CATEGORIES = ['Function Hall', 'Banquet Hall', 'Farm House', 'Luxury Resort'];
const CATEGORY_THEMES = {
  '': {
    backgroundColor: '#F7F3EC',
    borderColor: '#DDD4C7',
    textColor: '#5F574D',
    iconColor: '#756A58',
    activeGradient: ['#514A42', '#6C6257', '#827668'],
    activeBorder: '#403A34',
  },
  'Function Hall': {
    backgroundColor: '#FFF4D6',
    borderColor: '#E6C76D',
    textColor: '#7A5200',
    iconColor: '#A87205',
    activeGradient: ['#7A5200', '#A87205', '#CE951A'],
    activeBorder: '#674500',
  },
  'Banquet Hall': {
    backgroundColor: '#FCECEF',
    borderColor: '#E7BCC5',
    textColor: '#7F3444',
    iconColor: '#A54B60',
    activeGradient: ['#702A3B', '#923D51', '#B45469'],
    activeBorder: '#5D2231',
  },
  'Farm House': {
    backgroundColor: '#EAF5EC',
    borderColor: '#BBD8C1',
    textColor: '#2F653B',
    iconColor: '#3D7A49',
    activeGradient: ['#214F2C', '#2F653B', '#478052'],
    activeBorder: '#183E21',
  },
  'Luxury Resort': {
    backgroundColor: '#EAF3FB',
    borderColor: '#BED6E8',
    textColor: '#285E83',
    iconColor: '#35759D',
    activeGradient: ['#1D4A69', '#285E83', '#35759D'],
    activeBorder: '#173C56',
  },
};

const categoryIcon = value => (
  value === 'Function Hall'
    ? 'business-outline'
    : value === 'Banquet Hall'
      ? 'wine-outline'
      : value === 'Farm House'
        ? 'leaf-outline'
        : value === 'Luxury Resort'
          ? 'sunny-outline'
          : 'grid-outline'
);

const positive = value => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};
function priceDetails(item) {
  const menus = Array.isArray(item.menuImages) ? item.menuImages.flat(Infinity).filter(Boolean) : [];
  const menuBased = item.pricingType === 'menu_based' || item.menuAvailable === true || menus.length > 0;
  const prices = menus.map(menu => positive(menu.menuPrice)).filter(n => n !== null);
  const rent = positive(item.rentPricePerDay);
  return {
    menuBased, label: menuBased
      ? (prices.length ? `From ${formatAmount(Math.min(...prices))}/plate` : 'Menu price on request')
      : (rent ? `${formatAmount(rent)}/day` : 'Price on request')
  };
}
const locality = item => [item.county, item.functionHallAddress?.city]
  .find(value => typeof value === 'string' && value.trim())?.trim() || 'View location details';

export default function HomeVenueFeed({ mode, route }) {
  const navigation = useNavigation();
  const routeMode = route?.params?.mode;
  const feedMode = routeMode === 'recent' || mode === 'recent'
    ? 'recent'
    : 'discover';
  const initialCategory = CATEGORIES.includes(route?.params?.category)
    ? route.params.category
    : '';
  const [category, setCategory] = useState(initialCategory);
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

  const categoryScrollRef = useRef(null);

  useEffect(() => {
    const routeCategory =
      route?.params?.category;

    if (
      routeCategory &&
      CATEGORIES.includes(routeCategory)
    ) {
      setCategory(routeCategory);
    }
  }, [route?.params?.category]);

  useEffect(() => {
    const categoryValues = [
      '',
      ...CATEGORIES,
    ];

    const selectedIndex =
      categoryValues.indexOf(category);

    if (selectedIndex < 0) {
      return;
    }

    const timeout = setTimeout(() => {
      categoryScrollRef.current?.scrollTo({
        x: Math.max(
          0,
          (selectedIndex - 1) *
          horizontalScale(115),
        ),

        animated: true,
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [category]);

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
        params: {
          homeFeed: feedMode, page: nextPage, limit: 20,
          ...(category ? { venueCategory: category } : {}),
          ...(!reset && snapshot.current ? { asOf: snapshot.current } : {})
        },
        headers: { Authorization: `Bearer ${token}` }, timeout: 20000,
      });
      if (id !== request.current) return;
      const result = response.data;
      // Prevent an old backend from silently returning an unfiltered 'recent' list.
      if (result?.homeFeed !== feedMode || !Array.isArray(result.data) || !result.asOf) {
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
  }, [feedMode, category]);

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
    const theme = CATEGORY_THEMES[item.venueCategory] || CATEGORY_THEMES[''];
    const price = priceDetails(item);
    const guests = positive(item.includedGuestCount);
    return (
      <TouchableOpacity
        style={[styles.card, { borderColor: theme.borderColor }]}
        activeOpacity={0.9}
        accessibilityRole="button" accessibilityLabel={`View ${item.functionHallName}`}
        onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
        <View style={styles.imageWrap}>
          {item.professionalImage?.url
            ? <FastImage source={{ uri: item.professionalImage.url }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
            : <View style={[styles.image, styles.placeholder, { backgroundColor: theme.backgroundColor }]}><IonIcon name="image-outline" size={34} color={theme.iconColor} /></View>}

          <View style={[styles.cardCategoryIcon, { backgroundColor: theme.activeBorder }]}>
            <IonIcon name={categoryIcon(item.venueCategory)} size={16} color="#FFFFFF" />
          </View>

          <LinearGradient
            colors={theme.activeGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.cardAccent}
          />
        </View>

        <View style={[styles.body, { backgroundColor: theme.backgroundColor }]}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>{item.functionHallName}</Text>
            <Text style={[styles.price, { color: theme.activeGradient[0] }]}>{price.label}</Text>
          </View>
          {item.venueCategory === 'Farm House' && !price.menuBased && Number.isInteger(guests) &&
            <Text style={[styles.guests, { color: theme.textColor }]}>Includes {guests} {guests === 1 ? 'guest' : 'guests'}</Text>}
          <View style={styles.localityRow}>
            <IonIcon name="location-outline" size={14} color={theme.iconColor} />
            <Text style={styles.locality} numberOfLines={1}>{locality(item)}</Text>
          </View>
          <View style={styles.features}>
            {!!item.seatingCapacity && <View style={styles.feature}><IonIcon name="people-outline" size={13} color={theme.iconColor} /><Text style={styles.featureText}>Seating: {item.seatingCapacity}</Text></View>}
            {positive(item.bedRooms) !== null && <View style={styles.feature}><IonIcon name="bed-outline" size={13} color={theme.iconColor} /><Text style={styles.featureText}>{item.bedRooms} rooms</Text></View>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={category
          ? [CATEGORY_THEMES[category].backgroundColor, '#FFFFFF']
          : ['#FFF4D6', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" style={styles.back} onPress={() => navigation.goBack()}>
          <IonIcon name="chevron-back" size={23} color="#5B4210" />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <View style={styles.headerEyebrow}>
            <IonIcon
              name={feedMode === 'recent' ? 'time-outline' : 'compass-outline'}
              size={12}
              color="#A87205"
            />
            <Text style={styles.headerEyebrowText}>
              {feedMode === 'recent' ? 'FRESH LISTINGS' : 'VENUE COLLECTION'}
            </Text>
          </View>
          <Text style={styles.heading}>{feedMode === 'recent' ? 'Recently Added' : 'Discover Venues'}</Text>
          <Text style={styles.subtitle}>{feedMode === 'recent' ? 'Explore venues added during the last 10 days' : 'Explore verified venues across every category'}</Text>
        </View>
        {total > 0 && (
          <View style={styles.headerCount}>
            <Text style={styles.headerCountValue}>{total}</Text>
            <Text style={styles.headerCountLabel}>venues</Text>
          </View>
        )}
      </LinearGradient>
      <View style={styles.categorySection}>
        <Text style={styles.categorySectionLabel}>
          Filter by venue type
        </Text>

        <ScrollView
          horizontal
          ref={categoryScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          keyboardShouldPersistTaps="handled"
        >
          {['', ...CATEGORIES].map(value => {
            const isSelected = value === category;
            const label = value || 'All';

            const theme =
              CATEGORY_THEMES[value] ??
              CATEGORY_THEMES[''];

            const iconName =
              value === ''
                ? 'grid-outline'
                : value === 'Function Hall'
                  ? 'business-outline'
                  : value === 'Banquet Hall'
                    ? 'wine-outline'
                    : value === 'Farm House'
                      ? 'leaf-outline'
                      : 'sunny-outline';

            const content = (
              <>
                <IonIcon
                  name={iconName}
                  size={14}
                  color={
                    isSelected
                      ? '#FFFFFF'
                      : theme.iconColor
                  }
                />

                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : theme.textColor,
                    },
                    isSelected &&
                    styles.categorySelected,
                  ]}
                >
                  {label}
                </Text>
              </>
            );

            return (
              <TouchableOpacity
                key={value || 'all'}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                }}
                onPress={() => setCategory(value)}
                style={styles.categoryTouchable}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={theme.activeGradient}
                    locations={[0, 0.55, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[
                      styles.category,
                      styles.categoryActive,
                      {
                        borderColor: theme.activeBorder,
                      },
                    ]}
                  >
                    <IonIcon
                      name={iconName}
                      size={14}
                      color="#FFFFFF"
                    />

                    <Text
                      style={[
                        styles.categoryText,
                        styles.categorySelected,
                      ]}
                    >
                      {label}
                    </Text>

                    <View style={styles.selectedCheck}>
                      <IonIcon
                        name="checkmark"
                        size={10}
                        color={theme.activeBorder}
                      />
                    </View>
                  </LinearGradient>
                ) : (
                  <View
                    style={[
                      styles.category,
                      {
                        backgroundColor:
                          theme.backgroundColor,
                        borderColor:
                          theme.borderColor,
                      },
                    ]}
                  >
                    {content}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {items.length > 0 && <Text style={styles.count}>{items.length} of {total} venues</Text>}
      <FlatList ref={listRef} data={items} renderItem={renderItem} keyExtractor={item => String(item._id)}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        initialNumToRender={5} maxToRenderPerBatch={5} windowSize={7}
        refreshing={refreshing} onRefresh={() => fetchPage(true, true)}
        onEndReached={() => { if (!lastError.current) fetchPage(false); }} onEndReachedThreshold={0.4}
        ListEmptyComponent={loading ? <View style={styles.state}><ActivityIndicator color="#A87205" /><Text style={styles.subtitle}>Loading venues…</Text></View>
          : !error ? <View style={styles.state}><Text style={styles.heading}>No venues found</Text><Text style={styles.subtitle}>
            {feedMode === 'recent' ? 'No matching venues were added in the last 10 days.' : 'No venues are available in this category right now.'}</Text></View> : null}
        ListFooterComponent={<View style={styles.footer}>
          {!!error && <><Text accessibilityRole="alert" style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.retry} disabled={loading} onPress={() => fetchPage(failedReset.current)}><Text style={styles.categorySelected}>Retry</Text></TouchableOpacity>
            <TouchableOpacity disabled={loading} onPress={() => fetchPage(true, true)}><Text style={styles.subtitle}>Refresh list</Text></TouchableOpacity></>}
          {loading && items.length > 0 && <ActivityIndicator color="#A87205" />}
          {!loading && !error && hasMore && <TouchableOpacity style={styles.retry} onPress={() => fetchPage(false)}><Text style={styles.categorySelected}>Load more</Text></TouchableOpacity>}
          {!loading && !error && !hasMore && items.length > 0 && <Text style={styles.subtitle}>You’ve reached the end.</Text>}
        </View>} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#E9D9B3' },
  back: { width: 38, height: 38, borderRadius: 19, marginRight: 10, backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: '#E6D8B3', alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  headerEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  headerEyebrowText: { color: '#A87205', fontSize: 8, fontWeight: '900', letterSpacing: 0.8, fontFamily: 'ManropeRegular' },
  headerCount: { minWidth: 52, paddingHorizontal: 8, paddingVertical: 7, marginLeft: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.88)', borderWidth: 1, borderColor: '#E6D8B3', alignItems: 'center' },
  headerCountValue: { color: '#7A5200', fontSize: 14, fontWeight: '900' },
  headerCountLabel: { color: '#756A58', fontSize: 8, fontWeight: '700', marginTop: 1 },
  heading: { fontSize: 18, fontWeight: '800', color: '#1A1E25', fontFamily: 'ManropeRegular' },
  subtitle: { fontSize: 11, color: '#716B64', marginTop: 3, lineHeight: 16 },
  categorySection: {
    marginTop: verticalScale(8),
  },

  categorySectionLabel: {
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(8),
    color: '#756A58',
    fontSize: moderateScale(11),
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },

  categories: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(8),
    gap: horizontalScale(8),
  },

  categoryTouchable: {
    borderRadius: moderateScale(20),
  },

  category: {
    minHeight: verticalScale(36),
    paddingHorizontal: horizontalScale(14),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(6),
  },

  categoryText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },

  categoryActive: {
    borderWidth: 1.5,
    elevation: 5,
    shadowColor: '#392C1F',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    transform: [{ scale: 1.02 }],
  },
  categorySelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  selectedCheck: {
    width: moderateScale(16),
    height: moderateScale(16),
    marginLeft: horizontalScale(2),
    borderRadius: moderateScale(8),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { color: '#716B64', fontSize: 11, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 28, flexGrow: 1 },
  card: { borderRadius: 17, backgroundColor: '#fff', overflow: 'hidden', marginBottom: 16, borderWidth: 1, elevation: 2, shadowColor: '#5B4630', shadowOpacity: 0.09, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  imageWrap: { position: 'relative', height: 172, backgroundColor: '#EEE8DF' },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  cardCategoryIcon: { position: 'absolute', top: 11, left: 11, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)', elevation: 2 },
  cardAccent: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 5 },
  body: { padding: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' }, name: { flex: 1, fontFamily: 'ManropeRegular', fontSize: 15, fontWeight: '700', color: '#1A1E25', marginRight: 8 },
  price: { maxWidth: '48%', fontSize: 13, fontWeight: '800', textAlign: 'right' },
  guests: { fontSize: 11, fontWeight: '700', marginTop: 6, textAlign: 'right' },
  localityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  locality: { flex: 1, color: '#716B64', fontSize: 12 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 9 },
  featureText: { fontSize: 10, color: '#665347', fontWeight: '700' },
  state: { padding: 32, alignItems: 'center' }, footer: { alignItems: 'center', padding: 16 }, retry: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#A87205', borderRadius: 10, marginVertical: 10 }, error: { color: '#A12A24', fontSize: 13, textAlign: 'center' },
});
