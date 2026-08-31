import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  SectionList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import BASE_URL from '../../apiconfig';
import { getUserAuthToken } from '../../utils/StoreAuthToken';

const BRAND = '#E56B1F';
const GOLD = '#FFD166';
const INK = '#2D1B12';
const CREAM = '#FFF8F1';
const MUTED = '#78645A';
const VENUE_CATEGORIES = [
  { label: 'All', value: 'Any' },
  { label: 'Function Halls', value: 'Function Hall' },
  { label: 'Banquet Halls', value: 'Banquet Hall' },
  { label: 'Farm Houses', value: 'Farm House' },
  { label: 'Resorts', value: 'Luxury Resort' },
];
const CATEGORY_HIGHLIGHTS = {
  'Function Hall': {
    label: 'Function Hall',
    icon: 'business-outline',
    color: '#C2410C',
    background: '#FFEDD5',
  },
  'Banquet Hall': {
    label: 'Banquet Hall',
    icon: 'wine-outline',
    color: '#9A6700',
    background: '#FFF3CD',
  },
  'Farm House': {
    label: 'Farm House',
    icon: 'leaf-outline',
    color: '#287A4B',
    background: '#E5F6EC',
  },
  'Luxury Resort': {
    label: 'Resort',
    icon: 'sunny-outline',
    color: '#176B87',
    background: '#E4F5FA',
  },
};
const FOOD_OPTIONS = ['Veg', 'Non-Veg', 'Both'];
const DISTANCES = [2, 5, 10, 20, 'all'];

const RUPEE = '\u20B9';
const money = value => `${RUPEE}${Number(value || 0).toLocaleString('en-IN')}`;

const SmartVenueMatch = () => {
  const navigation = useNavigation();
  const userLocationFetched = useSelector(state => state.userLocation);
  const currentLatitude = userLocationFetched?.geometry?.location?.lat
    ? userLocationFetched?.geometry?.location?.lat
    : userLocationFetched?.latitude;
  const currentLongitude = userLocationFetched?.geometry?.location?.lng
    ? userLocationFetched?.geometry?.location?.lng
    : userLocationFetched?.longitude;
  const [form, setForm] = useState({
    budget: '',
    guests: '',
    location: '',
    venueCategory: 'Any',
    searchMode: 'current',
    radiusKm: 5,
    foodPreference: 'Both',
    includeFood: false,
    includeDecoration: false,
    acRequired: false,
    outsideCateringRequired: false,
    outsideDecorationRequired: false,
    roomsRequired: '0',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [compareVisible, setCompareVisible] = useState(false);
  const compareNavigationTimer = useRef(null);
  const bestComparedVenueId = useMemo(() => {
    if (!comparison.length) return null;

    return comparison.reduce((best, venue) =>
      Number(venue.match?.score ?? 0) > Number(best.match?.score ?? 0)
        ? venue
        : best,
    )._id;
  }, [comparison]);
  const [locations, setLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);

  useEffect(() => () => {
    if (compareNavigationTimer.current) {
      clearTimeout(compareNavigationTimer.current);
    }
  }, []);

  const closeComparison = useCallback(() => {
    if (compareNavigationTimer.current) {
      clearTimeout(compareNavigationTimer.current);
      compareNavigationTimer.current = null;
    }

    setCompareVisible(false);
  }, []);

  const viewComparedVenue = useCallback((venueId) => {
    // A native Modal sits above the navigation stack. Close it before
    // navigating so it cannot block the destination screen or reappear
    // when the user returns.
    setCompareVisible(false);

    if (compareNavigationTimer.current) {
      clearTimeout(compareNavigationTimer.current);
    }

    compareNavigationTimer.current = setTimeout(() => {
      navigation.navigate('ViewEvents', {
        categoryId: venueId,
      });

      compareNavigationTimer.current = null;
    }, 350);
  }, [navigation]);

  useEffect(() => {
    let active = true;

    const fetchLocations = async () => {
      setLocationLoading(true);
      try {
        const token = await getUserAuthToken();
        const response = await axios.get(`${BASE_URL}/user/locationList`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const payload = response?.data;
        const rawList = payload?.locationList
          ?? payload?.data?.locationList
          ?? payload?.data
          ?? [];
        const list = Array.isArray(rawList)
          && rawList.length === 1
          && Array.isArray(rawList[0]?.locationList)
          ? rawList[0].locationList
          : rawList;

        if (active && Array.isArray(list)) {
          const uniqueLocations = Array.from(
            new Map(
              list
                .filter(item => item?.label || item?.value)
                .map(item => {
                  const value = String(item.value ?? item.label).trim();
                  return [value.toLowerCase(), { ...item, label: item.label ?? value, value }];
                }),
            ).values(),
          ).sort((a, b) => a.label.localeCompare(b.label));

          setLocations(uniqueLocations);
        }
      } catch (error) {
        console.log('locationList error:', error?.response?.data || error?.message);
      } finally {
        if (active) setLocationLoading(false);
      }
    };

    fetchLocations();

    return () => {
      active = false;
    };
  }, []);

  // console.log('currentLatitude ...................',currentLatitude,currentLongitude);

  const update = useCallback((key, value) => {
    setForm(current => ({ ...current, [key]: value }));
  }, []);

  const validationMessage = useMemo(() => {
    if (
      !form.includeFood &&
      Number(form.budget) < 10000
    ) {
      return 'Enter a budget of at least ₹10,000';
    }
    if (Number(form.guests) < 1) return 'Enter the expected guest count';
    if (form.searchMode === 'area' && !form.location.trim()) return 'Enter an area or city';
    if (form.searchMode === 'current' && (!Number.isFinite(currentLatitude) || !Number.isFinite(currentLongitude))) {
      return 'Please select or enable your current location first';
    }
    return '';
  }, [currentLatitude, currentLongitude, form]);

  const filteredLocations = useMemo(() => {
    const searchText = form.location.trim().toLowerCase();

    if (!searchText) return locations.slice(0, 8);

    return locations
      .filter(item =>
        String(item.label ?? item.value)
          .toLowerCase()
          .includes(searchText),
      )
      .slice(0, 8);
  }, [form.location, locations]);

  const selectLocation = useCallback(location => {
    update('location', location.value ?? location.label);
    setLocationDropdownVisible(false);
    Keyboard.dismiss();
  }, [update]);

  const findMatches = useCallback(async () => {
    if (validationMessage) {
      Alert.alert('Complete your requirement', validationMessage);
      return;
    }

    setLoading(true);
    setComparison([]);
    try {
      const token = await getUserAuthToken();
      const response = await axios.post(
        `${BASE_URL}/smartVenueMatch`,
        {
          ...form,
          venueCategory: form.venueCategory,
          budget: Number(form.budget),
          guests: Number(form.guests),
          roomsRequired: Number(form.roomsRequired || 0),
          latitude: form.searchMode === 'current' ? currentLatitude : undefined,
          longitude: form.searchMode === 'current' ? currentLongitude : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // console.log('response is::>>>',response);
      const withinBudgetGroups = (response?.data?.groups ?? [])
        .map(group => ({
          ...group,
          data: (group.data ?? []).filter(
            venue => {
              if (form.includeFood) {
                return (
                  venue?.match?.budgetStatus ===
                  'not_applicable'
                );
              }

              return (
                venue?.match?.budgetStatus ===
                'within' ||
                venue?.match?.budgetStatus ===
                'unknown'
              );
            },
          ),
        }))
        .filter(group => group.data.length > 0);

      setResults(withinBudgetGroups);
      setMeta(response?.data ?? null);
    } catch (error) {
      console.log('error is::>>>>', error);
      Alert.alert(
        'Could not find matches',
        error?.response?.data?.message || 'Please check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [currentLatitude, currentLongitude, form, validationMessage]);

  const showSearchForm = useCallback(() => {
    setMeta(null);
    setResults([]);
    setComparison([]);
    setCompareVisible(false);
  }, []);

  const toggleMenuBased = () => {
    setForm(current => ({
      ...current,
      includeFood: !current.includeFood,

      budget: !current.includeFood
        ? ''
        : current.budget,
    }));
  };

  const toggleCompare = useCallback(venue => {
    setComparison(current => {
      const exists = current.some(item => item._id === venue._id);
      if (exists) return current.filter(item => item._id !== venue._id);
      if (current.length === 3) {
        Alert.alert('Comparison full', 'You can compare up to three venues.');
        return current;
      }
      return [...current, venue];
    });
  }, []);

  const renderToggle = (label, key, icon) => (
    <TouchableOpacity
      style={[styles.preference, form[key] && styles.preferenceActive]}
      onPress={() => update(key, !form[key])}
      activeOpacity={0.8}
    >
      <IonIcon name={icon} size={16} color={BRAND} />
      <Text style={[styles.preferenceText, form[key] && styles.preferenceTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const formatIndianNumber = value => {
    const digits = String(value ?? '').replace(/\D/g, '');

    if (!digits) return '';

    return Number(digits).toLocaleString('en-IN');
  };

  const SearchForm = () => (
    <View>
      <LinearGradient
        colors={['#FFF8F2', '#FDEBDD', '#F8D6BF']}
        locations={[0, 0.58, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <IonIcon name="sparkles" size={13} color={BRAND} />
          <Text style={styles.heroBadgeText}>SMART VENUE MATCH</Text>
        </View>
        <Text style={styles.heroTitle}>Your budget. Your area.{`\n`}Your best venue.</Text>
        <Text style={styles.heroSubtitle}>See what every venue category offers within your budget—not just venue rent.</Text>
      </LinearGradient>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Tell us what you need</Text>

        <Text style={styles.searchTypeLabel}>
          How would you like to search?
        </Text>

        <View style={styles.searchTypeContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.searchTypeOption,
              !form.includeFood &&
              styles.searchTypeOptionActive,
            ]}
            onPress={() => {
              setForm(current => ({
                ...current,
                includeFood: false,
              }));
            }}
          >
            <View
              style={[
                styles.searchTypeIcon,
                !form.includeFood &&
                styles.searchTypeIconActive,
              ]}
            >
              <IonIcon
                name="wallet-outline"
                size={19}
                color={
                  BRAND
                }
              />
            </View>

            <View style={styles.searchTypeContent}>
              <Text
                style={[
                  styles.searchTypeTitle,
                  !form.includeFood &&
                  styles.searchTypeTitleActive,
                ]}
              >
                Budget Match
              </Text>

              <Text
                style={[
                  styles.searchTypeDescription,
                  !form.includeFood &&
                  styles.searchTypeDescriptionActive,
                ]}
              >
                Find venues within your total budget
              </Text>
            </View>

            {!form.includeFood && (
              <IonIcon
                name="checkmark-circle"
                size={19}
                color={BRAND}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.searchTypeOption,
              form.includeFood &&
              styles.searchTypeOptionActive,
            ]}
            onPress={() => {
              setForm(current => ({
                ...current,
                includeFood: true,
                budget: '',
              }));
            }}
          >
            <View
              style={[
                styles.searchTypeIcon,
                form.includeFood &&
                styles.searchTypeIconActive,
              ]}
            >
              <IonIcon
                name="restaurant-outline"
                size={19}
                color={
                  BRAND
                }
              />
            </View>

            <View style={styles.searchTypeContent}>
              <Text
                style={[
                  styles.searchTypeTitle,
                  form.includeFood &&
                  styles.searchTypeTitleActive,
                ]}
              >
                Menu Based
              </Text>

              <Text
                style={[
                  styles.searchTypeDescription,
                  form.includeFood &&
                  styles.searchTypeDescriptionActive,
                ]}
              >
                Compare venues without a budget limit
              </Text>
            </View>

            {form.includeFood && (
              <IonIcon
                name="checkmark-circle"
                size={19}
                color={BRAND}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.twoColumn}>
          {!form.includeFood && (
            <View style={styles.halfField}>
              <Text style={styles.label}>
                Total budget
              </Text>

              <View style={styles.inputWrap}>
                <Text style={styles.prefix}>{RUPEE}  </Text>

                <TextInput
                  value={formatIndianNumber(
                    form.budget,
                  )}
                  onChangeText={value => {
                    update(
                      'budget',
                      value.replace(/\D/g, ''),
                    );
                  }}
                  keyboardType="number-pad"
                  placeholder="3,00,000"
                  placeholderTextColor="#B3A7AE"
                  style={styles.input}
                />
              </View>
            </View>
          )}

          <View
            style={
              form.includeFood
                ? styles.fullField
                : styles.halfField
            }
          >
            <Text style={styles.label}>
              Guests
            </Text>

            <TextInput
              value={form.guests}
              onChangeText={value =>
                update(
                  'guests',
                  value.replace(/\D/g, ''),
                )
              }
              keyboardType="number-pad"
              placeholder="500"
              placeholderTextColor="#B3A7AE"
              style={styles.standaloneInput}
            />
          </View>
        </View>

        <Text style={styles.label}>Where should we search?</Text>
        <View style={styles.locationModeRow}>
          <TouchableOpacity
            style={[styles.locationMode, form.searchMode === 'current' && styles.locationModeActive]}
            onPress={() => {
              update('searchMode', 'current');
              setLocationDropdownVisible(false);
            }}
          >
            <IonIcon name="navigate" size={16} color={BRAND} />
            <Text style={[styles.locationModeText, form.searchMode === 'current' && styles.locationModeTextActive]}>Near me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.locationMode, form.searchMode === 'area' && styles.locationModeActive]}
            onPress={() => update('searchMode', 'area')}
          >
            <IonIcon name="search" size={16} color={BRAND} />
            <Text style={[styles.locationModeText, form.searchMode === 'area' && styles.locationModeTextActive]}>Choose area</Text>
          </TouchableOpacity>
        </View>

        {form.searchMode === 'area' ? (
          <View style={styles.locationSearchContainer}>
            <View style={styles.iconInput}>
              <IonIcon name="location-outline" size={18} color={BRAND} />
              <TextInput
                value={form.location}
                onChangeText={value => {
                  update('location', value);
                  setLocationDropdownVisible(true);
                }}
                onFocus={() => setLocationDropdownVisible(true)}
                placeholder="Search Hyderabad area"
                placeholderTextColor="#B3A7AE"
                style={styles.input}
                autoCorrect={false}
                returnKeyType="done"
              />
              {locationLoading && <ActivityIndicator size="small" color={BRAND} />}
            </View>

            {locationDropdownVisible && !locationLoading && (
              <View style={styles.locationDropdown}>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location, index) => (
                    <TouchableOpacity
                      key={location._id ?? `${location.value}-${index}`}
                      style={[
                        styles.locationOption,
                        index === filteredLocations.length - 1 && styles.locationOptionLast,
                      ]}
                      activeOpacity={0.75}
                      onPress={() => selectLocation(location)}
                    >
                      <IonIcon name="location-outline" size={16} color={BRAND} />
                      <Text style={styles.locationOptionText}>{location.label}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noLocationOption}>
                    <Text style={styles.noLocationText}>No Hyderabad area found</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <>
            <Text style={styles.smallLabel}>Distance from your current location</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {DISTANCES.map(distance => (
                <TouchableOpacity
                  key={distance}
                  style={[styles.choiceChip, form.radiusKm === distance && styles.choiceChipActive]}
                  onPress={() => update('radiusKm', distance)}
                >
                  <Text style={[styles.choiceText, form.radiusKm === distance && styles.choiceTextActive]}>
                    {distance === 'all' ? 'Anywhere Hyderabad' : `${distance} km`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.label}>Venue category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chipRow}
        >
          {VENUE_CATEGORIES.map(category => {
            const selected = form.venueCategory === category.value;

            return (
              <TouchableOpacity
                key={category.value}
                style={[styles.choiceChip, selected && styles.choiceChipActive]}
                onPress={() => update('venueCategory', category.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.choiceText, selected && styles.choiceTextActive]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.categorySearchNote}>
          <IonIcon name="information-circle-outline" size={15} color={BRAND} />
          <Text style={styles.categorySearchNoteText}>
            {form.includeFood
              ? form.venueCategory === 'Any'
                ? 'Searching menu-based options across all venue categories'
                : `Showing menu-based ${VENUE_CATEGORIES.find(
                  item =>
                    item.value ===
                    form.venueCategory,
                )?.label
                }`
              : form.venueCategory === 'Any'
                ? 'Comparing all venue categories within your budget'
                : `Showing ${VENUE_CATEGORIES.find(
                  item =>
                    item.value ===
                    form.venueCategory,
                )?.label
                } within your budget`}
          </Text>
        </View>

        <Text style={styles.label}>Preferences</Text>
        <View style={styles.preferenceRow}>
          {renderToggle('AC', 'acRequired', 'snow-outline')}
          {/* {renderToggle('Menu based', 'includeFood', 'restaurant-outline')} */}
          {renderToggle('Decoration', 'includeDecoration', 'color-palette-outline')}
          {renderToggle('Outside food', 'outsideCateringRequired', 'fast-food-outline')}
        </View>

        {form.includeFood && (
          <View style={styles.inlineSection}>
            <Text style={styles.smallLabel}>Menu preference</Text>
            <View style={styles.chipRow}>
              {FOOD_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[styles.smallChip, form.foodPreference === option && styles.smallChipActive]}
                  onPress={() => update('foodPreference', option)}
                >
                  <Text style={[styles.smallChipText, form.foodPreference === option && styles.smallChipTextActive]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity onPress={findMatches} disabled={loading} activeOpacity={0.86}>
          <LinearGradient colors={[BRAND, '#FB923C']} style={styles.searchButton}>
            {loading ? <ActivityIndicator color="#fff" /> : <>
              <IonIcon name="sparkles" size={18} color={GOLD} />
              <Text style={styles.searchButtonText}>Find My Best Matches</Text>
              <IonIcon name="arrow-forward" size={18} color="#fff" />
            </>}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.formHint}>Prices are estimates from vendor-provided information.</Text>
      </View>

    </View>
  );

  const ResultsHeader = () => {
    const resultCount = results.reduce(
      (total, section) => total + section.data.length,
      0,
    );

    return (
      <View style={styles.resultsTop}>
        <View style={styles.resultHeader}>
          <View style={styles.resultHeading}>
            <Text style={styles.resultTitle}>
              {form.includeFood
                ? 'Menu-based venues near you'
                : 'Venues within your budget'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {form.includeFood
                ? `${resultCount} menu options across ${results.length} venue categories`
                : `${resultCount} options across ${results.length} venue categories`}
            </Text>
          </View>
          <TouchableOpacity style={styles.editSearchButton} onPress={showSearchForm}>
            <IonIcon name="options-outline" size={15} color={BRAND} />
            <Text style={styles.editSearchText}>Edit search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.budgetSummary}>
          <View>
            <Text style={styles.budgetSummaryLabel}>
              {form.includeFood
                ? 'Pricing preference'
                : 'Your total budget'}
            </Text>

            <Text style={styles.budgetSummaryValue}>
              {form.includeFood
                ? 'Menu Based'
                : money(form.budget)}
            </Text>
          </View>

          <IonIcon
            name={
              form.includeFood
                ? 'restaurant-outline'
                : 'wallet-outline'
            }
            size={22}
            color="#FFFFFF"
          />
        </View>
        {resultCount === 0 && (
          <View style={styles.emptyState}>
            <IonIcon name="search-outline" size={30} color={BRAND} />
            <Text style={styles.emptyTitle}>No venues found within this budget</Text>
            <Text style={styles.emptyText}>Increase your budget or distance and search again.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={showSearchForm}>
              <Text style={styles.emptyButtonText}>Change search</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderVenue = useCallback(({ item, index, section }) => {
    const selected = comparison.some(venue => venue._id === item._id);
    const image = item?.professionalImage?.url;
    const match = item.match ?? {};
    const estimate = match.estimate ?? {};
    const rentAmount = Number(
      estimate.rent ?? item.rentPricePerDay ?? 0,
    );

    const estimatedTotal = Number(
      estimate.knownTotal ?? 0,
    );

    const hasMenu =
      (item.menuImages?.flat?.().length ?? 0) > 0 ||
      item.inHouseCateringAvailable === true ||
      Number(item.vegPricePerPlate ?? 0) > 0 ||
      Number(item.nonVegPricePerPlate ?? 0) > 0;

    /*
     * A venue is menu-based only when:
     * - It has no fixed venue rent
     * - It has menu/catering information
     */
    const isMenuBasedPricing =
      rentAmount <= 0 && hasMenu;

    const platePrices = [
      Number(item.vegPricePerPlate ?? 0),
      Number(item.nonVegPricePerPlate ?? 0),
    ].filter(price => price > 0);
    const startingPlatePrice = platePrices.length
      ? Math.min(...platePrices)
      : 0;

    const validBudget =
      Number(form.budget) > 0;

    const validEstimatedTotal =
      Number(estimate.knownTotal) > 0;

    const shouldShowPricePosition =
      !form.includeFood &&
      !isMenuBasedPricing &&
      match.budgetStatus === 'within' &&
      validBudget &&
      validEstimatedTotal;

    const budgetRatio = shouldShowPricePosition
      ? Number(estimate.knownTotal) /
      Number(form.budget)
      : null;

    const pricePosition =
      budgetRatio === null
        ? null
        : budgetRatio < 0.2
          ? 'Economical option'
          : budgetRatio < 0.4
            ? 'Budget-friendly option'
            : budgetRatio < 0.65
              ? 'Value option'
              : 'Strong budget match';

    const requiresPriceConfirmation =
      !isMenuBasedPricing &&
      estimatedTotal <= 0 &&
      rentAmount <= 0;

    const displayedPrice = isMenuBasedPricing
      ? startingPlatePrice > 0
        ? `From ${money(startingPlatePrice)}/plate`
        : 'Menu Based'
      : estimatedTotal > 0
        ? money(estimatedTotal)
        : rentAmount > 0
          ? money(rentAmount)
          : 'Price on request';
    const venueCategory = item.venueCategory ?? section?.category ?? 'Function Hall';
    const categoryHighlight = CATEGORY_HIGHLIGHTS[venueCategory]
      ?? CATEGORY_HIGHLIGHTS['Function Hall'];

    const categoryMessage =
      match.budgetStatus === 'not_applicable'
        ? `This ${categoryHighlight.label} offers menu-based pricing`
        : isMenuBasedPricing
          ? `This ${categoryHighlight.label} has menu-based pricing`
          : match.budgetStatus === 'within'
            ? `This ${categoryHighlight.label} falls within your budget`
            : `Price confirmation required for this ${categoryHighlight.label}`;


    return (
      <TouchableOpacity
        style={styles.venueCard}
        activeOpacity={0.94}
        onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}
      >
        <View style={styles.imageWrap}>
          <FastImage source={{ uri: image }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
          <LinearGradient colors={['transparent', 'rgba(24,18,16,0.62)']} style={styles.imageShade} />
          <View style={[styles.venueTypeBadge, { backgroundColor: 'rgba(255,255,255,0.90)' }]}>
            <IonIcon name={categoryHighlight.icon} size={12} color={categoryHighlight.color} />
            <Text style={[styles.venueTypeBadgeText, { color: categoryHighlight.color }]}>{categoryHighlight.label}</Text>
          </View>
          {index === 0 && <View style={[styles.bestBadge, { backgroundColor: 'rgba(255,247,224,0.94)' }]}><IonIcon name="trophy" size={12} color="#A56A16" /><Text style={[styles.bestText, { color: '#8A5A16' }]}>BEST MATCH</Text></View>}
          <View style={[styles.scoreBadge, { backgroundColor: 'rgba(255,255,255,0.92)' }]}><Text style={[styles.scoreNumber, { color: '#986A2D' }]}>{match.score}%</Text><Text style={[styles.scoreLabel, { color: '#786F68' }]}> match</Text></View>
          <Text style={styles.venueName} numberOfLines={1}>{item.functionHallName}</Text>
        </View>

        <View style={styles.venueBody}>
          <View style={[styles.categoryBudgetBanner, { backgroundColor: categoryHighlight.background, borderColor: 'rgba(120,90,45,0.10)', borderWidth: 1 }]}>
            <View style={[styles.categoryBudgetIcon, { backgroundColor: categoryHighlight.color, opacity: 0.88 }]}>
              <IonIcon name={categoryHighlight.icon} size={14} color="#fff" />
            </View>
            <Text style={[styles.categoryBudgetText, { color: categoryHighlight.color }]}>
              {categoryMessage}
            </Text>
            <IonIcon
              name={
                match.budgetStatus === 'within'
                  ? 'checkmark-circle'
                  : 'information-circle'
              }
              size={17}
              color={categoryHighlight.color}
            />
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.estimateLabel}>
                {isMenuBasedPricing
                  ? startingPlatePrice > 0
                    ? 'Starting menu price'
                    : 'Pricing type'
                  : estimatedTotal > 0
                    ? 'Estimated total'
                    : rentAmount > 0
                      ? 'Venue rent'
                      : 'Pricing'}
              </Text>

              <Text
                style={[
                  styles.totalPrice,
                  isMenuBasedPricing &&
                  styles.menuBasedPrice,
                ]}
              >
                {displayedPrice}
              </Text>
            </View>
            <View
              style={[
                styles.statusPill,

                match.budgetStatus === 'within'
                  ? [styles.within, { backgroundColor: '#EAF6EF', borderColor: '#C9E8D4' }]
                  : isMenuBasedPricing
                    ? [styles.menuStatus, { backgroundColor: '#FFF5E6', borderColor: '#F1D9AF' }]
                    : match.budgetStatus === 'near'
                      ? [styles.near, { backgroundColor: '#FFF8E8', borderColor: '#F0DFB5' }]
                      : requiresPriceConfirmation ||
                        match.budgetStatus === 'unknown'
                        ? [styles.unknownStatus, { backgroundColor: '#F5F3F1', borderColor: '#E5E0DB' }]
                        : [styles.over, { backgroundColor: '#FFF0EE', borderColor: '#F1D0CA' }],
              ]}
            >
              <Text style={styles.statusText}>
                {match.budgetStatus ===
                  'not_applicable'
                  ? 'Menu Based'
                  : match.budgetStatus ===
                    'within'
                    ? 'Within budget'
                    : match.budgetStatus ===
                      'unknown'
                      ? 'Confirm price'
                      : match.budgetStatus ===
                        'near'
                        ? 'Close to budget'
                        : 'Over budget'}
              </Text>
            </View>
          </View>

          {pricePosition && (
            <View style={styles.pricePositionRow}>
              <IonIcon
                name={
                  budgetRatio < 0.2
                    ? 'wallet-outline'
                    : budgetRatio < 0.4
                      ? 'pricetag-outline'
                      : budgetRatio < 0.65
                        ? 'thumbs-up-outline'
                        : 'sparkles-outline'
                }
                size={14}
                color={BRAND}
              />

              <Text style={styles.pricePositionText}>
                {pricePosition}
              </Text>

              <Text style={styles.pricePositionSaving}>
                Save{' '}
                {money(
                  Number(form.budget) -
                  Number(estimate.knownTotal),
                )}
              </Text>
            </View>
          )}

          <View style={styles.breakdown}>
            {rentAmount > 0 && (
              <Text style={styles.breakdownText}>
                Rent {money(rentAmount)}
              </Text>
            )}

            {isMenuBasedPricing && (
              <Text style={styles.menuBasedChip}>
                Price depends on selected menu
              </Text>
            )}

            {!isMenuBasedPricing &&
              form.includeFood && (
                <Text style={styles.breakdownText}>
                  Menu pricing needs confirmation
                </Text>
              )}

            {Number(estimate.decoration ?? 0) > 0 && (
              <Text style={styles.breakdownText}>
                Decor {money(estimate.decoration)}
              </Text>
            )}
          </View>

          {(match.reasons ?? []).map(reason => (
            <View key={reason} style={styles.reasonRow}>
              <IonIcon name="checkmark-circle" size={15} color="#5D9B72" />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.compareButton, selected && styles.compareButtonActive]}
              onPress={event => { event.stopPropagation?.(); toggleCompare(item); }}
            >
              <IonIcon name={selected ? 'checkmark' : 'git-compare-outline'} size={16} color={selected ? '#fff' : BRAND} />
              <Text style={[styles.compareText, selected && styles.compareTextActive]}>{selected ? 'Added' : 'Compare'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
              <Text style={styles.detailsText}>View venue</Text>
              <IonIcon name="chevron-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [comparison, form.includeFood, navigation, toggleCompare]);

  const renderCategoryHeader = useCallback(({ section }) => {
    return (
      <View style={styles.categoryHeader}>
        <View>
          <Text style={styles.categoryTitle}>
            {section.category === 'Luxury Resort'
              ? 'Resorts you can get within your budget'
              : `${section.category}s you can get within your budget`}
          </Text>
          <Text style={styles.categorySubtitle}>
            {section.data.length} matching options
          </Text>
        </View>
        <View style={styles.categoryCount}><Text style={styles.categoryCountText}>{section.data.length}</Text></View>
      </View>
    );
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IonIcon name="arrow-back" size={23} color={INK} />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Smart Venue Match</Text>
        <View style={styles.headerSpacer} />
      </View>
      <SectionList
        sections={results}
        renderItem={renderVenue}
        renderSectionHeader={renderCategoryHeader}
        keyExtractor={item => item._id}
        ListHeaderComponent={meta ? ResultsHeader() : SearchForm()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        windowSize={7}
        initialNumToRender={4}
        stickySectionHeadersEnabled={false}
      />

      {comparison.length > 0 && (
        <TouchableOpacity style={styles.compareDock} onPress={() => setCompareVisible(true)}>
          <View><Text style={styles.compareDockTitle}>Compare venues</Text><Text style={styles.compareDockSub}>{comparison.length}/3 selected</Text></View>
          <View style={styles.compareDockButton}><Text style={styles.compareDockButtonText}>Compare now</Text><IonIcon name="arrow-forward" size={16} color="#fff" /></View>
        </TouchableOpacity>
      )}

      <Modal
        visible={compareVisible}
        animationType="slide"
        onRequestClose={closeComparison}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <View><Text style={styles.modalTitle}>Venue comparison</Text><Text style={styles.modalSub}>Clear differences at a glance</Text></View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeComparison}
              accessibilityRole="button"
              accessibilityLabel="Close venue comparison"
            >
              <IonIcon name="close" size={20} color={BRAND} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.compareIntro}>
              <View style={styles.compareIntroIcon}>
                <IonIcon name="git-compare-outline" size={19} color={BRAND} />
              </View>
              <View style={styles.compareIntroTextWrap}>
                <Text style={styles.compareIntroTitle}>
                  Compare what matters
                </Text>
                <Text style={styles.compareIntroText}>
                  {form.includeFood
                    ? `Menu-based pricing · ${form.guests || 'Your'} guests`
                    : `${RUPEE}${formatIndianNumber(form.budget)} budget · ${form.guests || 'Your'} guests`}
                </Text>
              </View>
            </View>

            {comparison.map((venue, index) => {
              const comparisonEstimate =
                venue.match?.estimate ?? {};

              const comparisonHasMenu =
                (venue.menuImages?.length ?? 0) > 0 ||
                venue.inHouseCateringAvailable === true;

              const comparisonIsMenuBased =
                Number(comparisonEstimate.knownTotal ?? 0) <= 0 &&
                comparisonHasMenu;

              const isRecommended =
                comparison.length > 1 &&
                String(venue._id) === String(bestComparedVenueId);

              const comparisonLocality =
                venue.county ||
                venue.functionHallAddress?.city ||
                venue.functionHallAddress?.address ||
                'Location to confirm';

              const comparisonImage =
                venue.professionalImage?.url;

              const comparisonReasons = Array.isArray(venue.match?.reasons)
                ? venue.match.reasons.filter(Boolean).slice(0, 2)
                : [];

              return (
                <View
                  key={venue._id}
                  style={[
                    styles.compareCard,
                    isRecommended && styles.compareCardRecommended,
                  ]}
                >
                  <View style={styles.compareCardHeader}>
                    <View style={styles.compareImageWrap}>
                      {comparisonImage ? (
                        <FastImage
                          source={{
                            uri: comparisonImage,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                          }}
                          style={styles.compareImage}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      ) : (
                        <View style={styles.compareImagePlaceholder}>
                          <IonIcon name="business-outline" size={25} color="#B9805D" />
                        </View>
                      )}
                    </View>

                    <View style={styles.compareHeaderContent}>
                      <View style={styles.compareBadgeRow}>
                        <View style={styles.compareOptionBadge}>
                          <Text style={styles.compareRank}>OPTION {index + 1}</Text>
                        </View>
                        {isRecommended && (
                          <View style={styles.compareRecommendedBadge}>
                            <IonIcon name="sparkles" size={10} color="#8A4D00" />
                            <Text style={styles.compareRecommendedText}>BEST MATCH</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.compareName} numberOfLines={2}>
                        {venue.functionHallName}
                      </Text>

                      <View style={styles.compareMetaRow}>
                        <IonIcon name="location-outline" size={12} color={MUTED} />
                        <Text style={styles.compareMetaText} numberOfLines={1}>
                          {venue.venueCategory || 'Venue'} · {comparisonLocality}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.compareScore}>
                      <Text style={styles.compareScoreNumber}>
                        {venue.match?.score ?? 0}%
                      </Text>
                      <Text style={styles.compareScoreLabel}>MATCH</Text>
                    </View>
                  </View>

                  <View style={styles.comparePricePanel}>
                    <View style={styles.comparePriceCopy}>
                      <Text style={styles.comparePriceLabel}>ESTIMATED TOTAL</Text>
                      <Text style={styles.comparePriceHint}>
                        {comparisonIsMenuBased
                          ? 'Final amount depends on selected menu'
                          : 'Based on your entered requirements'}
                      </Text>
                    </View>
                    <Text style={styles.comparePriceValue}>
                      {comparisonIsMenuBased
                        ? 'Menu Based'
                        : money(comparisonEstimate.knownTotal)}
                    </Text>
                  </View>

                  {comparisonReasons.length > 0 && (
                    <View style={styles.compareReasons}>
                      <Text style={styles.compareReasonsTitle}>Why it matches</Text>
                      {comparisonReasons.map((reason, reasonIndex) => (
                        <View key={`${venue._id}-reason-${reasonIndex}`} style={styles.compareReasonRow}>
                          <IonIcon name="checkmark-circle" size={13} color="#2F8A58" />
                          <Text style={styles.compareReasonText} numberOfLines={1}>{reason}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.compareDetailsBox}>
                    <ComparisonRow
                      icon="cash-outline"
                      label="Venue rent"
                      value={
                        Number(comparisonEstimate.rent ?? 0) > 0
                          ? money(comparisonEstimate.rent)
                          : comparisonIsMenuBased
                            ? 'Based on menu'
                            : 'Confirm with venue'
                      }
                    />

                    <ComparisonRow
                      icon="people-outline"
                      label="Capacity"
                      value={`${venue.seatingCapacity ?? 'Confirm'}`}
                    />

                    <ComparisonRow
                      icon="navigate-outline"
                      label="Distance"
                      value={
                        venue.match?.distanceKm == null
                          ? 'Not available'
                          : `${venue.match.distanceKm} km`
                      }
                    />

                    <ComparisonRow
                      icon="restaurant-outline"
                      label="Menu"
                      value={
                        comparisonHasMenu
                          ? 'Menu based'
                          : 'Not available'
                      }
                    />

                    <ComparisonRow
                      icon="bed-outline"
                      label="Rooms"
                      value={`${venue.bedRooms ?? venue.guestRooms ?? 0}`}
                      last
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.chooseButton}
                    onPress={() => viewComparedVenue(venue._id)}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${venue.functionHallName}`}
                  >
                    <Text style={styles.chooseText}>
                      View venue details
                    </Text>
                    <IonIcon name="arrow-forward" size={15} color="#A74416" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const ComparisonRow = ({ icon, label, value, strong, last }) => (
  <View style={[styles.comparisonRow, last && styles.comparisonRowLast]}>
    <View style={styles.comparisonLabelWrap}>
      <View style={styles.comparisonIcon}>
        <IonIcon name={icon} size={14} color={BRAND} />
      </View>
      <Text style={styles.comparisonLabel}>{label}</Text>
    </View>
    <Text
      numberOfLines={2}
      style={[styles.comparisonValue, strong && styles.comparisonStrong]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  venueCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1E7E0',
    elevation: 2,
    shadowColor: '#8B6A57',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  imageWrap: {
    height: 155,
  },

  venueBody: {
    padding: 12,
  },

  categoryBudgetBanner: {
    minHeight: 34,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryBudgetIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  categoryBudgetText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
  },

  priceRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  estimateLabel: {
    color: '#9A8D85',
    fontSize: 10,
    fontWeight: '600',
  },

  totalPrice: {
    color: '#3F332D',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 1,
  },

  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },

  statusText: {
    color: '#75685F',
    fontSize: 9,
    fontWeight: '800',
  },

  pricePositionRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },

  pricePositionText: {
    color: '#806A58',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
  },

  pricePositionSaving: {
    color: '#5D9B72',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 'auto',
  },

  breakdown: {
    marginTop: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },

  breakdownText: {
    color: '#887A70',
    backgroundColor: '#FAF6F2',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    fontSize: 9,
  },

  menuBasedChip: {
    color: '#A27642',
    backgroundColor: '#FFF8EA',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    fontSize: 9,
  },

  reasonRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  reasonText: {
    flex: 1,
    color: '#776B63',
    fontSize: 10,
    marginLeft: 5,
  },

  cardActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },

  compareButton: {
    flex: 0.8,
    minHeight: 36,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D8CC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  detailsButton: {
    flex: 1.2,
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#C98255',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: { flex: 1, backgroundColor: CREAM },
  content: { paddingBottom: 110 },
  screenHeader: { height: 54, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3E3D8' },
  backButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0E5' },
  screenHeaderTitle: { color: INK, fontFamily: 'ManropeRegular', fontSize: 16, fontWeight: '800' },
  headerSpacer: { width: 38 },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDCDB8',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: '#EBC8B1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroBadgeText: {
    color: '#A74416',
    fontFamily: 'ManropeRegular',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#3B2A22',
    fontFamily: 'ManropeRegular',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 35,
    marginTop: 14,
  },
  heroSubtitle: {
    color: '#756158',
    fontFamily: 'ManropeRegular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: 320,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0DED2',
    elevation: 3,
    shadowColor: '#8F5A3A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionTitle: { fontFamily: 'ManropeRegular', fontSize: 18, fontWeight: '800', color: INK, marginBottom: 16 },
  label: { fontFamily: 'ManropeRegular', fontSize: 12, fontWeight: '700', color: MUTED, marginBottom: 7, marginTop: 12 },
  smallLabel: { fontFamily: 'ManropeRegular', fontSize: 11, fontWeight: '700', color: MUTED, marginBottom: 6 },
  searchTypeLabel: {
    color: MUTED,
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },

  searchTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },

  searchTypeOption: {
    flex: 1,
    minHeight: 92,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F2D5C2',
    backgroundColor: '#FFFCF9',
  },

  searchTypeOptionActive: {
    backgroundColor: '#FFF0E6',
    borderColor: '#DFA47E',
  },

  searchTypeIcon: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E5',
    marginBottom: 7,
  },

  searchTypeIconActive: {
    backgroundColor: '#FFFFFF',
  },

  searchTypeContent: {
    flex: 1,
  },

  searchTypeTitle: {
    color: INK,
    fontFamily: 'ManropeRegular',
    fontSize: 12,
    fontWeight: '900',
  },

  searchTypeTitleActive: {
    color: '#8F3E18',
  },

  searchTypeDescription: {
    color: MUTED,
    fontFamily: 'ManropeRegular',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 3,
  },

  searchTypeDescriptionActive: {
    color: '#76574A',
  },
  twoColumn: { flexDirection: 'row', gap: 10 },
  fullField: {
    flex: 1,
  },
  halfField: { flex: 1 },
  inputWrap: { height: 48, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F2D5C2', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFCF9' },
  locationSearchContainer: { position: 'relative', zIndex: 20 },
  iconInput: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#F2D5C2', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFFCF9' },
  locationDropdown: { marginTop: 5, borderWidth: 1, borderColor: '#EFD5C3', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden', elevation: 8, shadowColor: '#7C2D12', shadowOpacity: 0.13, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  locationOption: { minHeight: 44, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EDE3E9' },
  locationOptionLast: { borderBottomWidth: 0 },
  locationOptionText: { flex: 1, color: INK, fontFamily: 'ManropeRegular', fontSize: 12, fontWeight: '600' },
  noLocationOption: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  noLocationText: { color: MUTED, fontFamily: 'ManropeRegular', fontSize: 11 },
  locationModeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  locationMode: { flex: 1, height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#F1C7AB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  locationModeActive: { backgroundColor: '#FFF0E6', borderColor: '#DFA47E' },
  locationModeText: { color: BRAND, fontSize: 12, fontWeight: '800' },
  locationModeTextActive: { color: '#A74416' },
  prefix: { fontSize: 16, color: INK, fontWeight: '700' },
  input: { flex: 1, padding: 0, color: INK, fontFamily: 'ManropeRegular', fontSize: 14 },
  disabledInput: {
    color: '#9A8B82',
  },
  standaloneInput: { height: 48, borderWidth: 1, borderColor: '#F2D5C2', borderRadius: 12, paddingHorizontal: 16, backgroundColor: '#FFFCF9', color: INK, fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 7 },
  choiceChip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, backgroundColor: '#FAF2EC', borderWidth: 1, borderColor: 'transparent' },
  choiceChipActive: { backgroundColor: '#FFF0E5', borderColor: BRAND },
  choiceText: { fontFamily: 'ManropeRegular', fontSize: 12, color: MUTED },
  choiceTextActive: { color: BRAND, fontWeight: '800' },
  categorySearchNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#FFF7ED' },
  categorySearchNoteText: { flex: 1, color: MUTED, fontFamily: 'ManropeRegular', fontSize: 10, lineHeight: 15, fontWeight: '600' },
  preferenceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  preference: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#F0D1BC', backgroundColor: '#fff' },
  preferenceActive: { backgroundColor: '#FFF0E6', borderColor: '#DFA47E' },
  preferenceText: { fontFamily: 'ManropeRegular', fontSize: 11, color: BRAND, fontWeight: '700' },
  preferenceTextActive: { color: '#A74416' },
  inlineSection: { backgroundColor: '#FFF7EC', borderRadius: 12, padding: 11, marginTop: 10 },
  smallChip: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 15, backgroundColor: '#fff' },
  smallChipActive: { backgroundColor: GOLD },
  smallChipText: { fontSize: 11, color: MUTED },
  smallChipTextActive: { color: '#3F2900', fontWeight: '800' },
  searchButton: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 18 },
  searchButtonText: { color: '#fff', fontFamily: 'ManropeRegular', fontWeight: '800', fontSize: 14 },
  formHint: { color: '#998B93', fontFamily: 'ManropeRegular', fontSize: 10, textAlign: 'center', marginTop: 8 },
  resultsTop: {
    paddingTop: 14,
    backgroundColor: '#FFFCFA',
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  resultHeading: {
    flex: 1,
    paddingRight: 8,
  },

  resultTitle: {
    color: '#3F332D',
    fontFamily: 'ManropeRegular',
    fontSize: 18,
    fontWeight: '800',
  },

  resultSubtitle: {
    color: '#9A8D85',
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    marginTop: 2,
  },

  editSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFF8F3',
    borderWidth: 1,
    borderColor: '#EEDDD0',
  },

  editSearchText: {
    color: '#B96F43',
    fontFamily: 'ManropeRegular',
    fontSize: 10,
    fontWeight: '800',
  },

  budgetSummary: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: '#C98255',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  budgetSummaryLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    fontWeight: '700',
  },

  budgetSummaryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  emptyState: {
    margin: 16,
    padding: 24,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#FFFCFA',
    borderWidth: 1,
    borderColor: '#F0E2D8',
  },

  emptyTitle: {
    color: '#463A34',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
  },

  emptyText: {
    color: '#9A8D85',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
  },

  emptyButton: {
    backgroundColor: '#C98255',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  budgetPill: {
    backgroundColor: '#FFF8F3',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E1D6',
  },

  budgetPillText: {
    color: '#B96F43',
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    fontWeight: '800',
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 11,
    marginBottom: 9,
  },

  categoryTitle: {
    color: '#463A34',
    fontSize: 16,
    fontWeight: '900',
  },

  categorySubtitle: {
    color: '#9A8D85',
    fontSize: 10,
    marginTop: 2,
  },

  categoryCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF3EA',
    borderWidth: 1,
    borderColor: '#F1DDCE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryCountText: {
    color: '#B96F43',
    fontSize: 11,
    fontWeight: '900',
  },

  image: { width: '100%', height: '100%', backgroundColor: '#F2D5C2' },
  imageShade: { ...StyleSheet.absoluteFillObject },
  venueTypeBadge: { position: 'absolute', top: 11, left: 11, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  venueTypeBadgeText: { color: '#fff', fontFamily: 'ManropeRegular', fontSize: 10, fontWeight: '900' },
  bestBadge: { position: 'absolute', top: 43, left: 11, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: GOLD, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14 },
  bestText: { color: '#5B3700', fontSize: 9, fontWeight: '900' },
  scoreBadge: { position: 'absolute', top: 11, right: 11, flexDirection: 'row', alignItems: 'baseline', backgroundColor: 'rgba(147,24,108,0.92)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14 },
  scoreNumber: { color: '#fff', fontSize: 13, fontWeight: '900' },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 9 },
  venueName: { position: 'absolute', left: 13, right: 13, bottom: 11, color: '#fff', fontFamily: 'ManropeRegular', fontSize: 17, fontWeight: '800' },
  within: { backgroundColor: '#E3F7EC' }, near: { backgroundColor: '#FFF1D5' }, over: { backgroundColor: '#FCE4E7' },
  menuStatus: {
    backgroundColor: '#FFF0E5',
  },

  unknownStatus: {
    backgroundColor: '#F1F3F5',
  },
  compareButtonActive: { backgroundColor: BRAND },
  compareText: { color: BRAND, fontSize: 12, fontWeight: '800' },
  compareTextActive: { color: '#fff' },
  detailsText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  compareDock: { position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: INK, borderRadius: 17, padding: 12, paddingLeft: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 10 },
  compareDockTitle: { color: '#fff', fontSize: 13, fontWeight: '800' },
  compareDockSub: { color: 'rgba(255,255,255,0.62)', fontSize: 10, marginTop: 2 },
  compareDockButton: { backgroundColor: BRAND, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  compareDockButtonText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  modalSafe: { flex: 1, backgroundColor: '#FFF9F5' },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDFB',
    borderBottomWidth: 1,
    borderBottomColor: '#EEDDD2',
  },
  modalTitle: { color: INK, fontSize: 19, fontWeight: '900' },
  modalSub: { color: MUTED, fontSize: 11, marginTop: 2 },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0E6',
    borderWidth: 1,
    borderColor: '#E8CBB8',
  },
  modalContent: { padding: 16, paddingBottom: 36 },
  compareIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 14,
    borderRadius: 14,
    backgroundColor: '#FFF2E9',
    borderWidth: 1,
    borderColor: '#ECD1BF',
  },
  compareIntroIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  compareIntroTextWrap: { flex: 1, marginLeft: 10 },
  compareIntroTitle: { color: INK, fontSize: 12, fontWeight: '900' },
  compareIntroText: { color: MUTED, fontSize: 10, lineHeight: 15, marginTop: 2 },
  menuBasedPrice: {
    color: BRAND,
    fontSize: 17,
  },
  compareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8D6CA',
    elevation: 2,
    shadowColor: '#8F5A3A',
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
  },
  compareCardRecommended: {
    borderColor: '#DDA06F',
    borderWidth: 1.5,
    backgroundColor: '#FFFEFC',
  },
  compareCardHeader: { flexDirection: 'row', alignItems: 'center' },
  compareImageWrap: {
    width: 72,
    height: 76,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#F7EADF',
  },
  compareImage: { width: '100%', height: '100%' },
  compareImagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  compareHeaderContent: { flex: 1, marginLeft: 11, marginRight: 8 },
  compareBadgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  compareOptionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFF0E6',
  },
  compareRank: { color: BRAND, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  compareRecommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFF1C7',
  },
  compareRecommendedText: { color: '#8A4D00', fontSize: 7, fontWeight: '900', letterSpacing: 0.4 },
  compareName: { color: INK, fontSize: 14, lineHeight: 18, fontWeight: '900', marginTop: 5 },
  compareMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  compareMetaText: { flex: 1, marginLeft: 3, color: MUTED, fontSize: 9 },
  compareScore: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4EC',
    borderWidth: 1,
    borderColor: '#E5B898',
  },
  compareScoreNumber: { color: '#A74416', fontSize: 13, fontWeight: '900' },
  compareScoreLabel: { color: '#9B7764', fontSize: 6, fontWeight: '900', marginTop: 1 },
  comparePricePanel: {
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF7F0',
    borderWidth: 1,
    borderColor: '#F0D8C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  comparePriceCopy: { flex: 1 },
  comparePriceLabel: { color: MUTED, fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  comparePriceHint: { color: '#998074', fontSize: 8, marginTop: 3, maxWidth: 175 },
  comparePriceValue: { maxWidth: '46%', color: '#A74416', fontSize: 16, fontWeight: '900', textAlign: 'right' },
  compareReasons: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 11,
    backgroundColor: '#F1FAF4',
    borderWidth: 1,
    borderColor: '#D5ECDC',
  },
  compareReasonsTitle: { color: '#36704C', fontSize: 9, fontWeight: '900', marginBottom: 4 },
  compareReasonRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  compareReasonText: { flex: 1, marginLeft: 5, color: '#4C6656', fontSize: 9 },
  compareDetailsBox: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFFCFA',
    borderWidth: 1,
    borderColor: '#F1E5DD',
  },
  comparisonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F2E7DF' },
  comparisonRowLast: { borderBottomWidth: 0 },
  comparisonLabelWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  comparisonIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFF0E6', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  comparisonLabel: { color: MUTED, fontSize: 11 },
  comparisonValue: { maxWidth: '48%', color: INK, fontSize: 11, fontWeight: '800', textAlign: 'right' },
  comparisonStrong: { color: BRAND, fontSize: 14, fontWeight: '900' },
  chooseButton: {
    backgroundColor: '#FFF0E6',
    height: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#DFA47E',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },
  chooseText: { color: '#A74416', fontSize: 12, fontWeight: '900' },
});

export default SmartVenueMatch;
