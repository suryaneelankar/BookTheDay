import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Button,
  ActivityIndicator,
  Share,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import crashlytics from '@react-native-firebase/crashlytics';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  scale,
} from '../../utils/scalingMetrics';
import LocationMarkIcon from '../../assets/svgs/location.svg';
import { LinearGradient } from 'react-native-linear-gradient';
import { formatAmount } from '../../utils/GlobalFunctions';
import BannerFunctionHalls from '../../assets/categories/BookTheDay_Function_Halls.png';
import BannerFarmHouses from '../../assets/categories/BookTheDay_Farm_Houses.png';
import BannerResorts from '../../assets/categories/BookTheDay_Resorts.png';
import BannerBanquetHalls from '../../assets/categories/BookTheDay_Banquet_Halls.png';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import {
  getCurrentLoggedInUserName,
  getUserLocation,
  setUserCurrentLocation,
} from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { getRecentlyViewedVenues } from '../../utils/recentlyViewedVenues';

/* COMMENTED OUT — catering/cloth/jewel imports no longer used
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MoneyWavy from '../../assets/svgs/MoneyWavy.svg';
import Cloth from '../../assets/svgs/cloth.svg';
import Cheers from '../../assets/svgs/Cheers.svg';
import FilterIcon from '../../assets/svgs/filter.svg';
import RightArrowIcon from '../../assets/svgs/rightArrow.svg';
import { InfoBox } from '../../components/InfoBox';
import TrendingNow from '../Products/TrendingNow';
import FooterBackGround from '../../assets/svgs/categories/home_footer_banner.svg';
import Swiper from 'react-native-swiper';
import TrendingRingBanner from '../../assets/svgs/trendingNow/home_trendingnow_ring.svg';
import TrendingBracelet from '../../assets/svgs/trendingNow/home_trendingnow_bracelets.svg';
import TrendingBridal from '../../assets/svgs/trendingNow/home_trendingnow_bridal.svg';
import TrendingCatering from '../../assets/svgs/trendingNow/home_trendingnow_catering.svg';
import TrendingEarrings from '../../assets/svgs/trendingNow/home_trendingnow_earrings.svg';
import TrendingJewellery from '../../assets/svgs/trendingNow/home_trendingnow_jewellery.svg';
import TrendingNecklace from '../../assets/svgs/trendingNow/home_trendingnow_necklaces.svg';
import TrendingTshirt from '../../assets/svgs/trendingNow/home_trendingnow_tshirt.svg';
import CatCatering from '../../assets/svgs/categories/home_categories_catering_icon.svg';
import CatClothes from '../../assets/svgs/categories/home_categories_clothes_icon.svg';
import CatHalls from '../../assets/svgs/categories/home_categories_hall_icon.svg';
import CatJewellery from '../../assets/svgs/categories/home_categories_jewellery_icon.svg';
import JewelleryCard from '../../assets/svgs/homeSwippers/home_jewellerycard.png';
import ClothesCard from '../../assets/svgs/homeSwippers/home_shirtcard.png';
import FloatingCartButton from '../../components/FloatingCartButton';
import VegNonVegIcon from '../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../assets/svgs/foodtype/NonVeg.svg';
*/
const FunctionHallImg = require('../../assets/categories/function_hall_category.png');
const ResortImg = require('../../assets/categories/resort_category.png');
const BanquetHallImg = require('../../assets/categories/banquet_hall_category.png');
const FarmHouseIconPng = require('../../assets/categories/farm_house_category.png');
const SmartVenueMatchBanner = require('../../assets/banners/booktheday_smart_venue_match.png');
import CustomAlert from '../../components/CustomAlert';
import { readHomeVenueCache, updateHomeVenueCache, isHomeFeedFresh, venueLocationKey } from './homeVenueCache';

const { width: screenWidth } = Dimensions.get('window');


const HOME_CATEGORIES = ['Function Hall', 'Banquet Hall', 'Farm House', 'Luxury Resort'];
const positiveNumber = value => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const flatMenus = venue => Array.isArray(venue?.menuImages)
  ? venue.menuImages.flat(Infinity).filter(Boolean) : [];
const isMenuVenue = venue => venue?.menuAvailable === true ||
  venue?.pricingType === 'menu_based' || flatMenus(venue).length > 0;
const venuePriceLabel = venue => {
  if (isMenuVenue(venue)) {
    const prices = flatMenus(venue).map(menu => positiveNumber(menu.menuPrice)).filter(n => n !== null);
    return prices.length ? 'From ' + formatAmount(Math.min(...prices)) + '/plate' : 'Menu Based';
  }
  const rent = positiveNumber(venue?.rentPricePerDay);
  return rent ? formatAmount(rent) + '/day' : 'Price on request';
};
const includedGuestsLabel = venue => {
  const n = positiveNumber(venue?.includedGuestCount);
  return venue?.venueCategory === 'Farm House' && !isMenuVenue(venue) && Number.isInteger(n)
    ? 'Includes ' + n + (n === 1 ? ' guest' : ' guests') : '';
};
const venueLocality = venue => {
  const locality = [venue?.county, venue?.functionHallAddress?.city]
    .find(value => typeof value === 'string' && value.trim());
  return locality ? locality.trim() : 'View location details';
};
const distanceLabel = value => {
  if (value == null || String(value).trim() === '') return '';
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n.toFixed(1) + ' km away' : '';
};
const eligibleVenues = values => {
  const seen = new Set();
  return (Array.isArray(values) ? values : []).filter(venue => {
    if (!venue?._id || venue.verificationStatus !== 'approved' ||
      venue.available !== true || !HOME_CATEGORIES.includes(venue.venueCategory) ||
      seen.has(String(venue._id))) return false;
    seen.add(String(venue._id));
    return true;
  });
};
const createdTime = venue => {
  const value = new Date(venue?.createdAt).getTime();
  return venue?.createdAt && Number.isFinite(value) ? value : 0;
};

// Recently viewed venues are stored newest first. Prefer the category with
// the most views; when counts match, the most recently viewed category wins.
const getPreferredCategory = recentlyViewed => {
  const stats = {};

  (Array.isArray(recentlyViewed) ? recentlyViewed : []).forEach(
    (venue, index) => {
      const category = venue?.venueCategory;

      if (!HOME_CATEGORIES.includes(category)) return;

      if (!stats[category]) {
        stats[category] = {
          count: 0,
          latestIndex: index,
        };
      }

      stats[category].count += Math.max(
        1,
        Number(venue?.viewCount) || 1,
      );
      stats[category].latestIndex = Math.min(
        stats[category].latestIndex,
        index,
      );
    },
  );

  return Object.entries(stats)
    .sort(([, first], [, second]) => {
      if (second.count !== first.count) {
        return second.count - first.count;
      }

      return first.latestIndex - second.latestIndex;
    })[0]?.[0] ?? null;
};

const recentlyAddedLabel = createdAt => {
  const value = new Date(createdAt).getTime();
  if (!Number.isFinite(value)) return 'Recently added';

  const elapsed = Math.max(0, Date.now() - value);
  const days = Math.floor(elapsed / (24 * 60 * 60 * 1000));
  if (days === 0) return 'Added today';
  if (days === 1) return 'Added yesterday';
  return `Added ${days} days ago`;
};

const HOME_SECTION_MINIMUM = 10;
const NEARBY_LIMIT = 20;
const RECENT_LIMIT = 20;
const DISCOVER_LIMIT = 10;
const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;

const addUniqueVenues = (target, venues, limit) => {
  const existingIds = new Set(
    target.map(venue => String(venue._id)),
  );

  for (const venue of venues) {
    const venueId = String(venue._id);

    if (
      target.length >= limit ||
      existingIds.has(venueId)
    ) {
      continue;
    }

    target.push(venue);
    existingIds.add(venueId);
  }

  return target;
};

const buildHomeSections = (
  nearby,
  discovery,
  latest,
) => {
  const currentTime = Date.now();

  const near = eligibleVenues(nearby)
    .sort((a, b) => {
      const first =
        a.distance == null
          ? Infinity
          : Number(a.distance);

      const second =
        b.distance == null
          ? Infinity
          : Number(b.distance);

      return (
        (Number.isFinite(first) ? first : Infinity) -
        (Number.isFinite(second) ? second : Infinity)
      );
    })
    .slice(0, NEARBY_LIMIT);

  const nearbyIds = new Set(
    near.map(venue => String(venue._id)),
  );

  const allRecent = eligibleVenues(latest)
    .filter(venue => {
      const createdAt = createdTime(venue);

      return (
        createdAt >= currentTime - TEN_DAYS_IN_MS &&
        createdAt <= currentTime
      );
    })
    .sort(
      (a, b) =>
        createdTime(b) - createdTime(a),
    );

  // Prefer venues not already shown under Nearby.
  const recent = allRecent
    .filter(
      venue =>
        !nearbyIds.has(String(venue._id)),
    )
    .slice(0, RECENT_LIMIT);

  // Backfill from all recent venues when fewer than 10 remain
  // after removing Nearby duplicates.
  if (recent.length < HOME_SECTION_MINIMUM) {
    addUniqueVenues(
      recent,
      allRecent,
      Math.min(
        RECENT_LIMIT,
        Math.max(
          HOME_SECTION_MINIMUM,
          recent.length,
        ),
      ),
    );
  }

  const usedIds = new Set([
    ...near.map(venue => String(venue._id)),
    ...recent.map(venue => String(venue._id)),
  ]);

  const allDiscovery =
    eligibleVenues(discovery);

  const unusedDiscovery =
    allDiscovery.filter(
      venue =>
        !usedIds.has(String(venue._id)),
    );

  const groups = HOME_CATEGORIES.map(
    category =>
      unusedDiscovery.filter(
        venue =>
          venue.venueCategory === category,
      ),
  );

  const discover = [];

  // Pick venues evenly across all categories.
  for (
    let index = 0;
    groups.some(group => index < group.length) &&
    discover.length < DISCOVER_LIMIT;
    index += 1
  ) {
    groups.forEach(group => {
      if (
        group[index] &&
        discover.length < DISCOVER_LIMIT
      ) {
        discover.push(group[index]);
      }
    });
  }

  // Allow overlap only if fewer than 10 unique discovery
  // venues remain after excluding Nearby and Recent.
  if (discover.length < HOME_SECTION_MINIMUM) {
    addUniqueVenues(
      discover,
      allDiscovery,
      DISCOVER_LIMIT,
    );
  }

  return {
    near,
    discover,
    recent,
  };
};

const shortlistSnapshot = venue => ({
  _id: String(venue._id),
  functionHallName: venue.functionHallName || 'Venue',
  venueCategory: venue.venueCategory,
  professionalImage: venue.professionalImage?.url ? { url: venue.professionalImage.url } : null,
  county: venue.county,
  functionHallAddress: venue.functionHallAddress,
  rentPricePerDay: venue.rentPricePerDay,
  includedGuestCount: venue.includedGuestCount,
  menuAvailable: venue.menuAvailable,
  pricingType: venue.pricingType,
  menuImages: flatMenus(venue).map(menu => ({ menuPrice: menu.menuPrice })),
  latitude: venue.latitude,
  longitude: venue.longitude,
  savedAt: new Date().toISOString(),
});
const shortlistShareText = items => 'My BookTheDay venue shortlist\n\n' +
  items.map((venue, index) => {
    const lines = [(index + 1) + '. ' + venue.functionHallName,
    venue.venueCategory, venueLocality(venue), venuePriceLabel(venue), includedGuestsLabel(venue)];
    const lat = Number(venue.latitude), lng = Number(venue.longitude);
    if (venue.latitude != null && venue.longitude != null &&
      String(venue.latitude).trim() && String(venue.longitude).trim() &&
      Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      lines.push('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(lat + ',' + lng));
    }
    return lines.filter(Boolean).join('\n');
  }).join('\n\n') +
  '\n\nSaved listing information, not a confirmed quote. Recheck prices, inclusions and event-date availability in BookTheDay.';

const HomeDashboard = () => {
  // ─── Active state ────────────────────────────────────────────────────────────
  const [address, setAddress] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef(null);
  const [totalVenueCount, setTotalVenueCount] = useState(0);
  const [eventsData, setEventsData] = useState(() => readHomeVenueCache().latest);
  const [nearByEventsData, setNearByEventsData] = useState([]);
  const [getUserAuth, setGetUserAuth] = useState('');
  const [currentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  /* COMMENTED OUT — catering / cloth / jewel state
  const [cateringsData, setCateringsData] = useState([]);
  const [nearbyCateringsData, setNearByCateringsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [newlyAddedProducts, setNewlyAddedProducts] = useState([]);
  const [myBookings, setMyBookings] = useState();
  const [cateringBookings, setCateringBookings] = useState();
  const [hallsBookings, setHallsBookings] = useState();
  */

  // ─── Redux ───────────────────────────────────────────────────────────────────
  const userLocationFetched = useSelector(state => state.userLocation);
  const userLoggedInMobileNumber = useSelector(
    state => state.userLoggedInMobileNum,
  );
  const deviceFCMToken = useSelector(state => state.deviceFCMToken);
  const userLoggedInMobileNum = useSelector(
    state => state.userLoggedInMobileNum,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const latitude = userLocationFetched?.geometry?.location?.lat ?? userLocationFetched?.latitude;
  const longitude = userLocationFetched?.geometry?.location?.lng ?? userLocationFetched?.longitude;

  // console.log('latitude is::::>>>', latitude);

  const [paymentReadyBookings, setPaymentReadyBookings] = useState([]);
  const [showPaymentReadyCard, setShowPaymentReadyCard] = useState(true);

  const paymentReadyCount = paymentReadyBookings.length;
  const firstPaymentReadyBooking = paymentReadyBookings[0];

  const CATEGORY_PLURAL = {
    'Function Hall': 'Function Halls',
    'Banquet Hall': 'Banquet Halls',
    'Farm House': 'Farm Houses',
    'Luxury Resort': 'Luxury Resorts',
  };


  const [homeLoading, setHomeLoading] = useState(() => {
    const cache = readHomeVenueCache();
    return !cache.latestAt && !cache.discoveryAt;
  });
  const [homeRefreshing, setHomeRefreshing] = useState(false);
  const homeFetchBusy = useRef(false);
  const homeMounted = useRef(true);
  const nearbyKey = useRef('');
  const nearbyBusy = useRef('');
  const accountRef = useRef(userLoggedInMobileNumber);
  accountRef.current = userLoggedInMobileNumber;
  const bookingsRequest = useRef(0);
  const profileRequest = useRef(0);
  const [homeErrors, setHomeErrors] = useState({});
  const [shortlistState, setShortlistState] = useState({ key: '', items: [] });
  const [shortlistVisible, setShortlistVisible] = useState(false);
  const [shortlistReadyKey, setShortlistReadyKey] = useState('');
  const [shortlistError, setShortlistError] = useState('');
  const [shortlistReload, setShortlistReload] = useState(0);
  const [shortlistSaving, setShortlistSaving] = useState(false);
  const shortlistBusy = useRef(false);
  const shortlistKey = userLoggedInMobileNumber
    ? 'booktheday:shortlist:v1:' + String(userLoggedInMobileNumber) : '';
  const currentShortlistKey = useRef(shortlistKey);
  currentShortlistKey.current = shortlistKey;
  const shortlist = shortlistState.key === shortlistKey ? shortlistState.items : [];
  const shortlistReady = !!shortlistKey && shortlistReadyKey === shortlistKey;
  const savedIds = new Set(shortlist.map(v => String(v._id)));
  const nearbyRequest = useRef(0);
  const latestRequest = useRef(0);
  const discoverRequest = useRef(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    homeMounted.current = true;
    return () => {
      homeMounted.current = false;
      latestRequest.current++; discoverRequest.current++; nearbyRequest.current++;
      bookingsRequest.current++; profileRequest.current++;
    };
  }, []);

  useEffect(() => {
    setPaymentReadyBookings([]);
    bookingsRequest.current++; profileRequest.current++;
  }, [userLoggedInMobileNumber]);

  useEffect(() => {
    let cancelled = false;
    setShortlistReadyKey(''); setShortlistError('');
    setShortlistState({ key: shortlistKey, items: [] });
    setShortlistVisible(false);
    if (!shortlistKey) return;
    AsyncStorage.getItem(shortlistKey).then(value => {
      if (cancelled) return;
      const parsed = value ? JSON.parse(value) : [];
      if (!Array.isArray(parsed)) throw new Error('Invalid saved shortlist.');
      const unique = new Map();
      parsed.forEach(item => {
        if (item && typeof item._id === 'string' && typeof item.functionHallName === 'string' &&
          !unique.has(item._id)) unique.set(item._id, item);
      });
      setShortlistState({ key: shortlistKey, items: [...unique.values()].slice(0, 30) });
      setShortlistReadyKey(shortlistKey);
    }).catch(() => {
      if (!cancelled) setShortlistError('Unable to load your saved venues. Please retry.');
    });
    return () => { cancelled = true; };
  }, [shortlistKey, shortlistReload]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadRecentlyViewed =
        async () => {
          const venues =
            await getRecentlyViewedVenues(10);

          if (active) {
            setRecentlyViewed(venues);
          }
        };

      loadRecentlyViewed();

      return () => {
        active = false;
      };
    }, []),
  );

  async function toggleShortlist(venue) {
    if (!shortlistReady || shortlistBusy.current || !venue?._id) return;
    const key = shortlistKey;
    const exists = savedIds.has(String(venue._id));
    if (!exists && shortlist.length >= 30) {
      CustomAlert.alert('Shortlist full', 'You can save up to 30 venues. Remove one before adding another.');
      return;
    }
    const next = exists ? shortlist.filter(v => String(v._id) !== String(venue._id))
      : [...shortlist, shortlistSnapshot(venue)];
    shortlistBusy.current = true; setShortlistSaving(true);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
      if (currentShortlistKey.current === key) {
        setShortlistState({ key, items: next });
        setShortlistError('');
      }
    } catch {
      if (currentShortlistKey.current === key) {
        CustomAlert.alert('Unable to save', 'Your shortlist was not changed. Please try again.');
      }
    } finally { shortlistBusy.current = false; setShortlistSaving(false); }
  }

  async function shareShortlist() {
    if (!Array.isArray(shortlist) || shortlist.length === 0) {
      return;
    }

    try {
      const message = shortlistShareText(shortlist);

      if (typeof message !== 'string' || !message.trim()) {
        throw new Error('Shortlist message is empty or invalid.');
      }

      await Share.share({
        title: 'BookTheDay shortlist',
        message,
      });
    } catch (error) {
      console.error('shareShortlist failed:', error);

      Alert.alert(
        'Unable to share',
        'Please try again.',
      );
    }
  }

  const paymentSignature = paymentReadyBookings.map(v => String(v._id)).sort().join(',');
  useEffect(() => { setShowPaymentReadyCard(true); }, [paymentSignature]);

  const VENUE_CATEGORY_THEMES = {
    'Function Hall': {
      label: 'Function Hall',
      backgroundColor: '#FFF0E6',
      color: '#9A3412',
    },
    'Banquet Hall': {
      label: 'Banquet Hall',
      backgroundColor: '#FFF7D6',
      color: '#785A12',
    },
    'Farm House': {
      label: 'Farm House',
      backgroundColor: '#EAF5EC',
      color: '#2F653B',
    },
    'Luxury Resort': {
      label: 'Resort',
      backgroundColor: '#EAF3FB',
      color: '#285E83',
    },
  };

  const VenueCategoryBadge = ({ category, onImage = false }) => {
    const categoryName =
      typeof category === 'string' ? category.trim() : '';

    const theme = VENUE_CATEGORY_THEMES[categoryName] || {
      label: categoryName || 'Venue',
      backgroundColor: '#F3F4F6',
      color: '#4B5563',
    };

    return (
      <View
        style={[
          styles.venueCategoryBadge,
          { backgroundColor: theme.backgroundColor },
          onImage && styles.venueCategoryOnImage,
        ]}
      >
        <Text
          style={[
            styles.venueCategoryBadgeText,
            { color: theme.color || '#4B5563' },
          ]}
        >
          {theme.label}
        </Text>
      </View>
    );
  };


  const WHY_BOOK_FEATURES = [
    {
      id: 'verified',
      icon: 'shield-checkmark-outline',
      title: 'Venue Details',
      description: 'Review photos, amenities and venue information in one place.',
      iconColor: '#07875D',
      iconBackground: '#DDF7ED',
    },
    {
      id: 'nearby',
      icon: 'location-outline',
      title: 'Nearby Options',
      description: 'Explore venues near your selected location.',
      iconColor: '#D97706',
      iconBackground: '#FFF0C7',
    },
    {
      id: 'pricing',
      icon: 'pricetag-outline',
      title: 'Clear Pricing',
      description: 'Compare venue prices and choose within your budget.',
      iconColor: '#7C3AED',
      iconBackground: '#EEE5FF',
    },
    {
      id: 'payments',
      icon: 'lock-closed-outline',
      title: 'Secure Payments',
      description: 'Protected booking payments powered by Razorpay.',
      iconColor: '#B31861',
      iconBackground: '#FBE2EF',
    },
  ];

  /* COMMENTED OUT — trendingData array
  const trendingData = [
    { id: '1', Component: TrendingTshirt, name: 'mens' },
    { id: '2', Component: TrendingBridal, name: 'womens' },
    { id: '3', Component: TrendingCatering, name: 'caterings' },
    { id: '6', Component: TrendingRingBanner, name: 'rings' },
    { id: '7', Component: TrendingEarrings, name: 'earrings' },
    { id: '8', Component: TrendingJewellery, name: 'bridal' },
    { id: '9', Component: TrendingNecklace, name: 'chains' },
    { id: '10', Component: TrendingBracelet, name: 'bracelets' },
  ];
  */

  /* COMMENTED OUT — bannerImages array
  const bannerImages = [
    { id: '1', image: JewelleryCard },
    { id: '2', image: ClothesCard },
  ];
  */

  /* COMMENTED OUT — CategoriesData array
  const CategoriesData = [
    { name: 'Clothes', image: CatClothes },
    { name: 'Jewellery', image: CatJewellery },
    { name: 'Halls', image: CatHalls },
    { name: 'Catering', image: CatCatering },
  ];
  */

  const getHallsBookings = async cachedToken => {
    const request = ++bookingsRequest.current;
    const owner = userLoggedInMobileNumber;
    const token = cachedToken || (await getUserAuthToken());

    try {
      const response = await axios.get(
        `${BASE_URL}/getUserFunctionHallBookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 20000,
        },
      );

      const bookings = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      const approvedAndUnpaidBookings = bookings.filter(booking => {
        const status = booking?.bookingStatus?.toLowerCase();

        return (
          status === 'approved' &&
          Number(booking?.advanceAmountPaid || 0) === 0 &&
          booking?.isActiveBooking === true
        );
      });

      if (homeMounted.current && request === bookingsRequest.current && owner === accountRef.current) {
        setPaymentReadyBookings(approvedAndUnpaidBookings);
      }
    } catch (error) {
      console.log(
        'Payment-ready bookings error:',
        error?.response?.data || error,
      );
    }
  };

  // Public feeds have a five-minute cache. Private booking/profile data still refresh on focus.
  useFocusEffect(useCallback(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const token = await getUserAuthToken();
        if (!active) return;
        // These calls must not hold the venue loader open.
        getUserAuthTokenRes(token);
        getProfileData(token);
        getHallsBookings(token);
        await refreshHomeFeeds(token);
      } catch {
        if (active) setHomeErrors(prev => ({ ...prev, general: 'Unable to refresh your dashboard.' }));
      } finally { if (homeMounted.current && !homeFetchBusy.current) setHomeLoading(false); }
    };
    bootstrap();
    // Keep valid feed requests alive on blur; discard only on unmount or a newer request.
    return () => { active = false; };
  }, [userLoggedInMobileNumber]));

  useFocusEffect(useCallback(() => {
    let active = true;
    getUserAuthToken().then(token => { if (active) getNearByEvents(token); })
      .catch(() => { if (active) setHomeErrors(prev => ({ ...prev, nearby: 'Unable to load nearby venues.' })); });
    return () => { active = false; };
  }, [latitude, longitude, userLoggedInMobileNumber]));

  useEffect(() => {
    storeUserDeviceToken();
  }, []);

  // ─── Auto-scroll banners (pauses when screen unfocused) ─────────────────────
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;
    const bannerTimer = setInterval(() => {
      setActiveBanner(prev => {
        const next = (prev + 1) % 4;
        bannerScrollRef.current?.scrollTo({
          x: next * screenWidth,
          animated: true,
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(bannerTimer);
  }, [isFocused]);

  const handleBannerScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setActiveBanner(index);
  };

  useEffect(() => {
    if (!userLocationFetched && Platform.OS === 'android') getPermissions();
  }, []);

  // ─── API: store FCM token ─────────────────────────────────────────────────────
  const storeUserDeviceToken = async (cachedToken) => {
    const payload = {
      mobileNumber: String(userLoggedInMobileNum),
      fcmToken: deviceFCMToken,
    };
    const token = cachedToken || await getUserAuthToken();
    try {
      const userTokenRes = await axios.post(
        `${BASE_URL}/addUserFCMToken`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // console.log('userTokenRes  res:::::::::', userTokenRes);
      if (userTokenRes?.status === 200) {
        console.log(
          'successfully logged fcm token:',
          userTokenRes?.data?.message,
        );
      }
    } catch (error) {
      console.error('Error during add user token 1 :', error);
    }
  };

  // ─── API: get nearby halls ────────────────────────────────────────────────────
  const getNearByEvents = async (cachedToken, force = false) => {
    const key = venueLocationKey(latitude, longitude);
    const cache = readHomeVenueCache();
    if (nearbyKey.current !== key) {
      nearbyRequest.current++;
      nearbyBusy.current = '';
      nearbyKey.current = key;
      setNearByEventsData(key && cache.nearbyKey === key ? cache.nearby : []);
    }
    if (!key) { nearbyRequest.current++; nearbyBusy.current = ''; return; }
    if (!force && cache.nearbyKey === key && isHomeFeedFresh(cache.nearbyAt)) {
      setNearByEventsData(cache.nearby); return;
    }
    if (nearbyBusy.current === key) return;
    nearbyBusy.current = key;
    const request = ++nearbyRequest.current;
    setHomeErrors(prev => ({ ...prev, nearby: '' }));
    try {
      const token = cachedToken || await getUserAuthToken();
      const response = await axios.get(BASE_URL + '/getNearByFunctionHalls', {
        params: { latitude, longitude }, headers: { Authorization: 'Bearer ' + token }, timeout: 20000,
      });
      if (request === nearbyRequest.current && homeMounted.current && nearbyKey.current === key) {
        const data = eligibleVenues(response?.data?.data);
        setNearByEventsData(data);
        updateHomeVenueCache({ nearby: data, nearbyKey: key, nearbyAt: Date.now() });
      }
    } catch {
      if (request === nearbyRequest.current) setHomeErrors(prev => ({ ...prev, nearby: 'Nearby venues could not load.' }));
    } finally { if (request === nearbyRequest.current) nearbyBusy.current = ''; }
  };

  /* COMMENTED OUT — getNearByCaterings
  const getNearByCaterings = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getNearByFoodCaterings?latitude=${latitude}&longitude=${longitude}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const newCaterings = Array.isArray(response?.data?.data) ? response?.data?.data : [];
      if (response?.data?.data?.length > 0) {
        setNearByCateringsData(newCaterings);
      }
    } catch (error) {
      console.error('Error fetching function halls:', error);
    }
  };
  */

  // ─── API: auth token ──────────────────────────────────────────────────────────
  const getUserAuthTokenRes = async (cachedToken) => {
    const token = cachedToken || await getUserAuthToken();
    setGetUserAuth(token);
  };

  // ─── API: profile ─────────────────────────────────────────────────────────────
  const getProfileData = async (cachedToken) => {
    const request = ++profileRequest.current;
    const owner = userLoggedInMobileNumber;
    const token = cachedToken || await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllUserLocations/${userLoggedInMobileNumber}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 },
      );
      if (!homeMounted.current || request !== profileRequest.current || owner !== accountRef.current) return;
      dispatch(
        getCurrentLoggedInUserName(response?.data?.data?.fullName),
      );
    } catch (error) {
      console.log('profile::::::::::', error);
    }
  };

  // ─── API: all halls ───────────────────────────────────────────────────────────
  const getAllEvents = async (page, cachedToken) => {
    const request = ++latestRequest.current;
    setHomeErrors(prev => ({ ...prev, latest: '' }));
    try {
      const token = cachedToken || await getUserAuthToken();
      const response = await axios.get(BASE_URL + '/filterFunctionHalls', {
        params: { homeFeed: 'recent', page: 1, limit: 20 },
        headers: { Authorization: 'Bearer ' + token }, timeout: 20000,
      });
      if (request !== latestRequest.current) return;
      if (response.data?.homeFeed !== 'recent') throw new Error('Deploy the backend home-feed update first.');
      const data = eligibleVenues(response?.data?.data);
      setEventsData(data);
      updateHomeVenueCache({ latest: data, latestAt: Date.now() });
    } catch {
      if (request === latestRequest.current) setHomeErrors(prev => ({ ...prev, latest: 'Recently added venues could not load.' }));
    }
  };

  // Fetch a small sample from every supported category; no premium/popularity claim.
  const [premiumHalls, setPremiumHalls] = useState(() => readHomeVenueCache().discovery);
  const getPremiumHalls = async (page = 1, append = false, cachedToken) => {
    const request = ++discoverRequest.current;
    setHomeErrors(prev => ({ ...prev, discovery: '' }));
    try {
      const token = cachedToken || await getUserAuthToken();
      const results = await Promise.all(HOME_CATEGORIES.map(async venueCategory => {
        try {
          const response = await axios.get(BASE_URL + '/filterFunctionHalls', {
            params: { page: 1, limit: 8, venueCategory, sortBy: 'price', sortOrder: 'asc' },
            headers: { Authorization: 'Bearer ' + token }, timeout: 20000,
          });
          return { data: eligibleVenues(response?.data?.data), failed: false, venueCategory };
        } catch { return { data: [], failed: true, venueCategory }; }
      }));
      if (request !== discoverRequest.current) return;
      const previous = readHomeVenueCache().discovery;
      const data = results.flatMap(result => result.failed
        ? previous.filter(venue => venue.venueCategory === result.venueCategory) : result.data);
      setPremiumHalls(data);
      updateHomeVenueCache({ discovery: data, discoveryAt: results.some(result => result.failed) ? 0 : Date.now() });
      if (results.some(result => result.failed)) {
        setHomeErrors(prev => ({ ...prev, discovery: 'Some categories could not load. Tap retry to refresh.' }));
      }
    } catch {
      if (request === discoverRequest.current) setHomeErrors(prev => ({ ...prev, discovery: 'Unable to load venues.' }));
    }
  };

  const homeSections = useMemo(
    () => buildHomeSections(nearByEventsData, premiumHalls, eventsData),
    [nearByEventsData, premiumHalls, eventsData],
  );

  const preferredCategory = useMemo(
    () => recentlyViewed.length >= 2
      ? getPreferredCategory(recentlyViewed)
      : null,
    [recentlyViewed],
  );

  const recommendedVenues = useMemo(() => {
    if (!preferredCategory) return [];

    const viewedIds = new Set(
      recentlyViewed.map(venue => String(venue?._id)),
    );

    // premiumHalls is the discovery feed. eventsData contains only the recent
    // feed, so using it alone can leave this section empty unexpectedly.
    const recommendationPool = eligibleVenues([
      ...premiumHalls,
      ...eventsData,
      ...nearByEventsData,
    ]);

    return recommendationPool
      .filter(venue =>
        venue.venueCategory === preferredCategory &&
        !viewedIds.has(String(venue._id)),
      )
      .slice(0, 10);
  }, [preferredCategory, recentlyViewed, premiumHalls, eventsData, nearByEventsData]);
  const refreshHomeFeeds = async (token, force = false) => {
    if (homeFetchBusy.current) return;
    const cache = readHomeVenueCache();
    const latestStale = force || !isHomeFeedFresh(cache.latestAt);
    const discoveryStale = force || !isHomeFeedFresh(cache.discoveryAt);
    if (!latestStale && !discoveryStale) { setHomeLoading(false); return; }
    homeFetchBusy.current = true;
    // Never replace existing cards with a loader during a background refresh.
    setHomeLoading(
      (!cache.latestAt && !cache.latest.length) ||
      (!cache.discoveryAt && !cache.discovery.length),
    );
    try {
      await Promise.all([
        latestStale ? getAllEvents(1, token) : Promise.resolve(),
        discoveryStale ? getPremiumHalls(1, false, token) : Promise.resolve(),
      ]);
    } finally {
      homeFetchBusy.current = false;
      if (homeMounted.current) setHomeLoading(false);
    }
  };
  const retryHome = async () => {
    if (homeRefreshing || homeFetchBusy.current) return;
    setHomeRefreshing(true); setHomeErrors({});
    try {
      const token = await getUserAuthToken();
      await Promise.all([refreshHomeFeeds(token, true), getNearByEvents(token, true), getHallsBookings(token)]);
    } catch { setHomeErrors({ general: 'Unable to refresh. Please try again.' }); }
    finally { if (homeMounted.current) setHomeRefreshing(false); }
  };

  /* COMMENTED OUT — getAllCaterings
  const getAllCaterings = async (page) => {
    const token = await getUserAuthToken();
    setGetUserAuth(token);
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllFoodCaterings?page=${page}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const newCateringsData = Array.isArray(response?.data?.data) ? response?.data?.data : [];
      setCateringsData(newCateringsData);
    } catch (error) {
      console.error('Error fetching user dashbaord', error);
    }
  };
  */

  /* COMMENTED OUT — getCategories
  const getCategories = async () => {
    const token = await getUserAuthToken();
    setGetUserAuth(token);
    try {
      const response = await axios.get(`${BASE_URL}/getAllClothesJewels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response?.data?.data);
      const filteredDiscountItems = response?.data?.data.filter(
        category => category?.componentType === 'discount',
      );
      const filteredNewItems = response?.data?.data.filter(
        category => category?.componentType === 'new',
      );
      setDiscountProducts(filteredDiscountItems);
      setNewlyAddedProducts(filteredNewItems);
    } catch (error) {
      console.log('categories discount::::::::::', error);
    }
  };
  */

  // ─── Location helpers ─────────────────────────────────────────────────────────
  const getLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      console.log('getting location', location);
      if (location) {
        const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAddress(data?.results[0]?.formatted_address);
        dispatch(getUserLocation(data?.results[0]));
        dispatch(setUserCurrentLocation(data?.results[0]));
      }
    } catch (error) {
      console.error('Error: location 1', error);
    }
  };

  const handleCheckPressed = async () => {
    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
      console.log('checkEnabled', checkEnabled);
      if (!checkEnabled) {
        handleEnabledPressed();
      } else {
        getLocation();
      }
    }
  };

  const handleEnabledPressed = async () => {
    if (Platform.OS === 'android') {
      try {
        const enableResult = await promptForEnableLocationIfNeeded();
        console.log('enableResult', enableResult);
        getLocation();
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  };

  const getPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'BookTheDay location permission',
          message: 'App needs location Permissions',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleCheckPressed();
      } else {
        CustomAlert.alert('Permission Denied', 'Location permissions denied');
      }
    } catch (err) {
      // silently ignore
    }
  };

  /* COMMENTED OUT — renderTrendingView
  const renderTrendingView = ({ item }) => {
    const SvgComponent = item.Component;
    return (
      <TouchableOpacity onPress={() => handleTrendingBanners(item?.name)} style={{ marginHorizontal: 10 }}>
        <SvgComponent />
      </TouchableOpacity>
    );
  };
  */

  /* COMMENTED OUT — handleTrendingBanners
  const handleTrendingBanners = (catClicked) => {
    if (catClicked === 'rings') { navigation.navigate('CategoriesList', { catType: 'rings' }); }
    else if (catClicked === 'earrings') { navigation.navigate('CategoriesList', { catType: 'earrings' }); }
    else if (catClicked === 'bridal') { navigation.navigate('CategoriesList', { catType: 'bridal' }); }
    else if (catClicked === 'chains') { navigation.navigate('CategoriesList', { catType: 'chains' }); }
    else if (catClicked === 'bracelets') { navigation.navigate('CategoriesList', { catType: 'bracelets' }); }
    else if (catClicked === 'mens') { navigation.navigate('CategoriesList', { catType: 'mens' }); }
    else if (catClicked === 'womens') { navigation.navigate('CategoriesList', { catType: 'womens' }); }
    else if (catClicked === 'caterings') { navigation.navigate('Caterings'); }
  };
  */

  /* COMMENTED OUT — renderCaterings
  const renderCaterings = ({ item }) => { ... };
  */

  /* COMMENTED OUT — renderNewlyAddedDetails
  const renderNewlyAddedDetails = ({ item }) => { ... };
  */


  // Category, price context and saving are consistent across all home sections.
  const renderHallCard = item => {
    const guestLabel = includedGuestsLabel(item);
    const distance = distanceLabel(item?.distance);
    const saved = savedIds.has(String(item._id));
    return (
      <View style={styles.hallCard}>
        <TouchableOpacity activeOpacity={0.92}
          accessibilityRole="button" accessibilityLabel={'View ' + item.functionHallName}
          onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}>
          <View style={styles.hallImageWrapper}>
            {item?.professionalImage?.url ? (
              <FastImage source={{
                uri: item.professionalImage.url, priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable
              }} style={styles.hallImage} resizeMode={FastImage.resizeMode.cover} />
            ) : <View style={styles.homeImagePlaceholder}><IonIcon name="business-outline" size={34} color="#9A785D" /></View>}
            <VenueCategoryBadge category={item.venueCategory} onImage />
          </View>
          <View style={styles.hallCardBody}>
            <Text numberOfLines={2} style={styles.homeVenueName}>{item.functionHallName}</Text>
            <Text style={styles.homeVenuePrice}>{venuePriceLabel(item)}</Text>
            {!!guestLabel && <Text style={styles.homeGuestLabel}>{guestLabel}</Text>}
            <View style={styles.hallAddressRow}>
              <IonIcon name="location-outline" size={13} color="#8B6F57" />
              <Text numberOfLines={1} style={styles.hallAddress}>{venueLocality(item)}</Text>
            </View>
            {!!distance && <Text style={styles.homeDistance}>{distance}</Text>}
            <View style={styles.chipsRow}>
              {!!item.seatingCapacity && <View style={styles.chip}><Text style={styles.chipText}>Seating: {item.seatingCapacity}</Text></View>}
              {Number(item.bedRooms) > 0 && <View style={styles.chip}><Text style={styles.chipText}>{item.bedRooms} rooms</Text></View>}
            </View>
            <Text style={styles.homeDateHint}>Check date availability in venue details</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeSaveButton} onPress={() => toggleShortlist(item)}
          disabled={!shortlistReady || shortlistSaving} accessibilityRole="button"
          accessibilityLabel={(saved ? 'Remove ' : 'Save ') + item.functionHallName + (saved ? ' from shortlist' : ' to shortlist')}
          accessibilityState={{ selected: saved, disabled: !shortlistReady || shortlistSaving }}>
          <IonIcon name={saved ? 'heart' : 'heart-outline'} size={21} color={saved ? '#AD4325' : '#665347'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHomeSection = (title, items, route = 'SearchVenues', homeFeed = null) => (items.length || homeFeed) ? (
    <View style={{ marginTop: verticalScale(24) }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(route, { homeFeed })} style={styles.seeAllBtn} accessibilityRole="button">
          <Text style={styles.seeAllText}>See all</Text>
          <IonIcon name="arrow-forward" size={16} color="#A74416" />
        </TouchableOpacity>
      </View>
      <FlatList data={items}
        renderItem={({ item }) => renderHallCard(item)}
        horizontal
        extraData={shortlistState}
        keyExtractor={item => String(item._id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
      />
      {!items.length && !homeLoading && <Text style={[styles.homeNoticeText, { marginHorizontal: 20 }]}>Tap See all to browse this collection.</Text>}
    </View>
  ) : null;

  const renderRecentCompactCard = item => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.recentCompactCard}
      onPress={() => navigation.navigate('ViewEvents', { categoryId: item._id })}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.functionHallName}`}>
      <View style={styles.recentCompactImageWrap}>
        {item?.professionalImage?.url ? (
          <FastImage
            source={{
              uri: item.professionalImage.url,
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            style={styles.recentCompactImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={styles.homeImagePlaceholder}>
            <IonIcon name="business-outline" size={28} color="#9A785D" />
          </View>
        )}
        <View style={styles.recentNewBadge}>
          <Text style={styles.recentNewBadgeText}>NEW</Text>
        </View>
      </View>
      <View style={styles.recentCompactBody}>
        <Text numberOfLines={2} style={styles.recentCompactTitle}>{item.functionHallName}</Text>
        <Text numberOfLines={1} style={styles.recentCompactPrice}>{venuePriceLabel(item)}</Text>
        <Text numberOfLines={1} style={styles.recentCompactLocation}>{venueLocality(item)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecentlyAdded = items => {
    const featured = items[0];
    const remaining = items.slice(1, 6);

    return (
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <Text style={styles.sectionSub}>Fresh venues added in the last 10 days</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchVenues', { homeFeed: 'recent' })}
            style={styles.seeAllBtn}
            accessibilityRole="button">
            <Text style={styles.seeAllText}>See all</Text>
            <IonIcon name="arrow-forward" size={16} color="#A74416" />
          </TouchableOpacity>
        </View>

        {featured ? (
          <View style={styles.recentFeaturedCard}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => navigation.navigate('ViewEvents', { categoryId: featured._id })}
              accessibilityRole="button"
              accessibilityLabel={`View ${featured.functionHallName}`}>
              <View style={styles.recentFeaturedImageWrap}>
                {featured?.professionalImage?.url ? (
                  <FastImage
                    source={{
                      uri: featured.professionalImage.url,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    style={styles.recentFeaturedImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View style={styles.homeImagePlaceholder}>
                    <IonIcon name="business-outline" size={40} color="#9A785D" />
                  </View>
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(19,14,10,0.62)']}
                  style={styles.recentFeaturedGradient}
                  pointerEvents="none"
                />
                <VenueCategoryBadge category={featured.venueCategory} onImage />
                <View style={styles.recentFeaturedFreshness}>
                  <IonIcon name="sparkles" size={12} color="#FFFFFF" />
                  <Text style={styles.recentFeaturedFreshnessText}>
                    {recentlyAddedLabel(featured.createdAt)}
                  </Text>
                </View>
              </View>
              <View style={styles.recentFeaturedBody}>
                <View style={styles.recentFeaturedTitleRow}>
                  <Text numberOfLines={2} style={styles.recentFeaturedTitle}>{featured.functionHallName}</Text>
                  <Text numberOfLines={2} style={styles.recentFeaturedPrice}>{venuePriceLabel(featured)}</Text>
                </View>
                <View style={styles.hallAddressRow}>
                  <IonIcon name="location-outline" size={14} color="#8B6F57" />
                  <Text numberOfLines={1} style={styles.hallAddress}>{venueLocality(featured)}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeSaveButton}
              onPress={() => toggleShortlist(featured)}
              disabled={!shortlistReady || shortlistSaving}
              accessibilityRole="button">
              <IonIcon
                name={savedIds.has(String(featured._id)) ? 'heart' : 'heart-outline'}
                size={21}
                color={savedIds.has(String(featured._id)) ? '#AD4325' : '#665347'}
              />
            </TouchableOpacity>
          </View>
        ) : (
          !homeLoading && (
            <TouchableOpacity
              style={styles.homeStateBox}
              onPress={() => navigation.navigate('SearchVenues', { homeFeed: 'recent' })}>
              <Text style={styles.homeNoticeText}>Tap to browse recently added venues.</Text>
            </TouchableOpacity>
          )
        )}

        {!!remaining.length && (
          <FlatList
            data={remaining}
            horizontal
            renderItem={({ item }) => renderRecentCompactCard(item)}
            keyExtractor={item => String(item._id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentCompactList}
          />
        )}
      </View>
    );
  };

  // ─── Return ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFF7E7', '#FFF7E7', '#FFF8EB', '#FFFAF1', '#FFFCF6', '#FFFFFF']}
        locations={[0, 0.4, 0.5, 0.64, 0.77, 1]}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={homeRefreshing} onRefresh={retryHome} colors={['#A74416']} tintColor="#A74416" />}
          contentContainerStyle={{ paddingBottom: 20 }}
        >

          {/* ════════════════════════════════════════
            TOP BAR
        ════════════════════════════════════════ */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.locationPill}
              onPress={() => navigation.navigate('LocationAdded')}>
              <LocationMarkIcon width={16} height={16} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.locationSubText}>
                  Selected location
                </Text>
                <Text numberOfLines={1} style={styles.locationMainText}>
                  {userLocationFetched?.formatted_address
                    ? userLocationFetched.formatted_address
                    : userLocationFetched?.address
                      ? userLocationFetched.address
                      : 'Select Location'}
                </Text>
              </View>
              <IonIcon name="chevron-down" size={14} color="#7D7F88" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('ProfileScreen')}>

              <IonIcon
                name="person-circle-outline"
                size={40}
                color="#131313"
              />

              {paymentReadyCount > 0 && (
                <View style={styles.profilePaymentBadge}>
                  <Text style={styles.profilePaymentBadgeText}>
                    {paymentReadyCount > 9 ? '9+' : paymentReadyCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Search Bar + Filter ── */}
          <View style={styles.homeSearchRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SearchVenues', { homeFeed: null })}
              style={styles.homeSearchBar}>
              <IonIcon name="search-outline" size={18} color="#7E8389" />
              <Text style={styles.homeSearchPlaceholder}>Search venues, halls, resorts...</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchVenues', { homeFeed: null })}
              style={styles.homeFilterIcon}>
              <IonIcon name="options-outline" size={20} color="#D97706" />
            </TouchableOpacity>
          </View>
          {/* <Button
            title="Test Crashlytics"
            color="red"
            onPress={() => {
              crashlytics().log('BookTheDay Crashlytics test started');
              crashlytics().crash();
            }}
          /> */}

          {/* HERO — Auto-scrolling banners */}
          {/* ════════════════════════════════════════ */}
          <View style={styles.heroWrapper}>
            <ScrollView
              ref={bannerScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleBannerScroll}
              style={styles.heroBannerScroll}>

              {/* Banner 1 - Function Halls */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ExploreTab')}
                style={styles.heroBannerSlide}>
                <Image
                  source={BannerFunctionHalls}
                  style={styles.heroBannerGradient}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Banner 2 - Farm Houses */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ExploreTab')}
                style={styles.heroBannerSlide}>
                <Image
                  source={BannerFarmHouses}
                  style={styles.heroBannerGradient}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Banner 3 - Luxury Resorts */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ExploreTab')}
                style={styles.heroBannerSlide}>
                <Image
                  source={BannerResorts}
                  style={styles.heroBannerGradient}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Banner 4 - Banquet Halls */}
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ExploreTab')}
                style={styles.heroBannerSlide}>
                <Image
                  source={BannerBanquetHalls}
                  style={styles.heroBannerGradient}
                  resizeMode="cover"
                />
              </TouchableOpacity>

            </ScrollView>
          </View>

          {/* Pagination dots */}
          <View style={styles.bannerDots}>
            {[0, 1, 2, 3].map(i => (
              <View
                key={i}
                style={[
                  styles.bannerDotIndicator,
                  activeBanner === i && styles.bannerDotActive,
                ]}
              />
            ))}
          </View>

          {paymentReadyCount > 0 && showPaymentReadyCard && (
            <View style={styles.homePaymentNotice}>
              <IonIcon name="wallet-outline" size={22} color="#A74416" />
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ViewMyBookings')}
                accessibilityRole="button" accessibilityLabel="View bookings awaiting payment">
                <Text style={styles.homeNoticeTitle}>{paymentReadyCount} {paymentReadyCount === 1 ? 'booking' : 'bookings'} awaiting payment</Text>
                <Text style={styles.homeNoticeText}>Vendor accepted · View bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPaymentReadyCard(false)} style={styles.homeIconTap}
                accessibilityRole="button" accessibilityLabel="Dismiss payment reminder">
                <IonIcon name="close" size={19} color="#786B64" />
              </TouchableOpacity>
            </View>
          )}
          {/* ════════════════════════════════════════
            CATEGORIES — round circles like Figma
        ════════════════════════════════════════ */}
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Categories</Text>

            <View style={styles.catGrid}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('DiscoverVenues', {
                  mode: 'discover',
                  category: 'Function Hall',
                })}
                style={styles.catItem}>
                <View style={styles.catCircle}>
                  <Image source={FunctionHallImg} style={{ width: 70, height: 70 }} resizeMode="cover" />
                </View>
                <Text style={styles.catLabel}>Function Halls</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('DiscoverVenues', {
                  mode: 'discover',
                  category: 'Farm House',
                })}
                style={styles.catItem}>
                <View style={styles.catCircle}>
                  <Image source={FarmHouseIconPng} style={{ width: 70, height: 70 }} resizeMode="cover" />
                </View>
                <Text style={styles.catLabel}>Farm House</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('DiscoverVenues', {
                  mode: 'discover',
                  category: 'Luxury Resort',
                })}
                style={styles.catItem}>
                <View style={styles.catCircle}>
                  <Image source={ResortImg} style={{ width: 70, height: 70 }} resizeMode="cover" />
                </View>
                <Text style={styles.catLabel}>Resorts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('DiscoverVenues', {
                  mode: 'discover',
                  category: 'Banquet Hall',
                })}
                style={styles.catItem}>
                <View style={styles.catCircle}>
                  <Image source={BanquetHallImg} style={{ width: 70, height: 70 }} resizeMode="cover" />
                </View>
                <Text style={styles.catLabel}>Banquets</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Smart Venue Match */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.smartMatchCard}
            onPress={() =>
              navigation.navigate('SmartVenueMatch', {
                showHeader: true,
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Open Smart Venue Match"
          >
            <ImageBackground
              source={SmartVenueMatchBanner}
              style={styles.smartMatchBackground}
              imageStyle={styles.smartMatchBackgroundImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={[
                  'rgba(255,248,243,0.98)',
                  'rgba(255,248,243,0.82)',
                  'rgba(255,248,243,0.12)',
                ]}
                locations={[0, 0.62, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.smartMatchOverlay}
              >
                <View style={styles.smartMatchContent}>
                  <View style={styles.smartMatchEyebrow}>
                    <IonIcon
                      name="sparkles"
                      size={12}
                      color="#FFE1BF"
                    />

                    <Text style={styles.smartMatchEyebrowText}>
                      SMART VENUE MATCH
                    </Text>
                  </View>

                  <View style={styles.smartMatchTitleRow}>
                    <Text
                      style={styles.smartMatchTitle}
                      numberOfLines={1}
                    >
                      Find a venue that fits you
                    </Text>

                    <View style={styles.smartMatchArrow}>
                      <IonIcon
                        name="arrow-forward"
                        size={13}
                        color="#7C2D12"
                      />
                    </View>
                  </View>

                  <Text
                    style={styles.smartMatchDescription}
                    numberOfLines={1}
                  >
                    Match by budget, guests and area.
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>


          <View style={styles.homeShortlistBar}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              onPress={() => setShortlistVisible(true)} accessibilityRole="button" accessibilityLabel="Open saved venues">
              <IonIcon name="heart-outline" size={20} color="#A74416" />
              <Text style={styles.homeNoticeTitle}>Saved venues ({shortlist.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={!shortlist.length} onPress={shareShortlist} style={styles.homeIconTap}
              accessibilityRole="button" accessibilityLabel="Share saved venue shortlist">
              <IonIcon name="share-social-outline" size={20} color={shortlist.length ? '#A74416' : '#AAA'} />
            </TouchableOpacity>
          </View>
          {!!shortlistError && <TouchableOpacity onPress={() => setShortlistReload(n => n + 1)} style={styles.homeStateBox}>
            <Text style={styles.homeErrorText}>{shortlistError} Tap to retry.</Text>
          </TouchableOpacity>}

          {homeLoading && <View style={styles.homeStateBox}><ActivityIndicator color="#A74416" /><Text style={styles.homeNoticeText}>Finding venues…</Text></View>}
          {Object.values(homeErrors).some(Boolean) && (
            <TouchableOpacity style={styles.homeStateBox} onPress={retryHome} disabled={homeLoading || homeRefreshing}>
              <Text style={styles.homeErrorText}>{Object.values(homeErrors).filter(Boolean).join(' ')} Tap to retry.</Text>
            </TouchableOpacity>
          )}
          {renderHomeSection('Venues Near You', homeSections.near, 'NearByEvents')}

          {recentlyViewed.length > 0 && (
            <View style={styles.rvSection}>
              <View style={styles.rvHeader}>
                <View>
                  <Text style={styles.rvEyebrow}>
                    CONTINUE WHERE YOU LEFT OFF
                  </Text>

                  <Text style={styles.rvTitle}>
                    Recently viewed
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(
                      'RecentlyViewedVenues',
                    )
                  }
                >
                  <Text style={styles.rvSeeAllText}>
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.rvHistoryCard}>
                {recentlyViewed.slice(0, 3).map((item, index) => {
                  const isMenuBased =
                    item.menuAvailable === true ||
                    item.pricingType === 'menu_based';

                  const price = Number(item.rentPricePerDay) > 0
                    ? `₹${Number(item.rentPricePerDay).toLocaleString('en-IN')}`
                    : 'Price on request';

                  return (
                    <TouchableOpacity
                      key={String(item._id)}
                      activeOpacity={0.85}
                      style={[
                        styles.rvRow,
                        index < Math.min(recentlyViewed.length, 3) - 1 &&
                        styles.rvRowBorder,
                      ]}
                      onPress={() =>
                        navigation.navigate(
                          'ViewEvents',
                          {
                            categoryId: item._id,
                          },
                        )
                      }
                    >
                      {item.imageUrl ? (
                        <Image
                          source={{
                            uri: item.imageUrl,
                          }}
                          style={styles.rvImage}
                        />
                      ) : (
                        <View
                          style={[
                            styles.rvImage,
                            styles.rvImagePlaceholder,
                          ]}
                        >
                          <IonIcon
                            name="image-outline"
                            size={22}
                            color="#A58F83"
                          />
                        </View>
                      )}

                      <View style={styles.rvContent}>
                        <View style={styles.rvCategoryRow}>
                          <Text style={styles.rvCategory} numberOfLines={1}>
                            {item.venueCategory || 'Venue'}
                          </Text>
                          <IonIcon name="time-outline" size={11} color="#A06A4C" />
                        </View>

                        <Text
                          style={styles.rvVenueName}
                          numberOfLines={1}
                        >
                          {item.functionHallName}
                        </Text>

                        <View style={styles.rvLocationRow}>
                          <IonIcon name="location-outline" size={12} color="#8D7C72" />
                          <Text style={styles.rvLocation} numberOfLines={1}>
                            {item.locality || 'Location unavailable'}
                          </Text>
                        </View>

                        <View style={styles.rvBottomRow}>
                          <Text style={styles.rvPrice}>
                            {isMenuBased ? 'Menu based' : price}
                          </Text>
                          {Number(item.includedGuestCount) > 0 && (
                            <Text style={styles.rvGuestText}>
                              {item.includedGuestCount} guests included
                            </Text>
                          )}
                        </View>
                      </View>

                      <View style={styles.rvArrow}>
                        <IonIcon name="chevron-forward" size={16} color="#98461F" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {!homeLoading && !homeSections.near.length && (
            <TouchableOpacity style={styles.homeStateBox} onPress={() => navigation.navigate('LocationAdded')}>
              <Text style={styles.homeNoticeTitle}>Explore a different area</Text>
              <Text style={styles.homeNoticeText}>Select a location to find nearby venues.</Text>
            </TouchableOpacity>
          )}
          {renderHomeSection('Discover Venues', homeSections.discover, 'SearchVenues', 'discover')}
 
          {preferredCategory &&
            recommendedVenues.length > 0 && (
              <View style={styles.recommendedSection}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>
                      Recommended for you
                    </Text>

                    <Text style={styles.recommendedSubtitle}>
                      More {CATEGORY_PLURAL[preferredCategory] || 'venues'} based on what you viewed
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DiscoverVenues', {
                        mode: 'discover',
                        category: preferredCategory,
                      })
                    }
                  >
                    <Text style={styles.seeAllText}>
                      See all
                    </Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  horizontal
                  data={recommendedVenues}
                  keyExtractor={item =>
                    `recommended-${item._id}`
                  }
                  renderItem={({ item }) => renderHallCard(item)}
                  extraData={shortlistState}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listPadding}
                  initialNumToRender={4}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  removeClippedSubviews
                />
              </View>
            )}
          {renderRecentlyAdded(homeSections.recent)}
          {/* ════════════════════════════════════════


          {/* ════════════════════════════════════════
            WHY BOOKTHEDAY
        ════════════════════════════════════════ */}
          <View style={styles.whyBookContainer}>
            {/* Decorative elements */}
            <View style={styles.whyBookGlow} />

            {/* Section header */}
            <View style={styles.whyBookHeader}>
              <View style={styles.whyBookBadge}>
                <IonIcon
                  name="sparkles"
                  size={moderateScale(12)}
                  color="#93186C"
                />

                <Text style={styles.whyBookBadgeText}>
                  THE BOOKTHEDAY ADVANTAGE
                </Text>
              </View>

              <Text style={styles.whyBookTitle}>
                Why choose{' '}
                <Text style={styles.whyBookTitleAccent}>BookTheDay?</Text>
              </Text>

              <Text style={styles.whyBookSubtitle}>
                A simpler way to discover the right venue for your special day.
              </Text>
            </View>

            {/* Feature grid */}
            <View style={styles.whyBookGrid}>
              {WHY_BOOK_FEATURES.map(feature => (
                <View key={feature.id} style={styles.whyBookCard}>
                  <View
                    style={[
                      styles.whyBookCardIcon,
                      { backgroundColor: feature.iconBackground },
                    ]}>
                    <IonIcon
                      name={feature.icon}
                      size={moderateScale(21)}
                      color={feature.iconColor}
                    />
                  </View>

                  <Text style={styles.whyBookCardTitle}>
                    {feature.title}
                  </Text>

                  <Text style={styles.whyBookCardDesc}>
                    {feature.description}
                  </Text>

                  <View
                    style={[
                      styles.whyBookCardAccent,
                      { backgroundColor: feature.iconColor },
                    ]}
                  />
                </View>
              ))}
            </View>

            {/* Trust strip */}
            <View style={styles.whyBookTrustBadge}>
              <View style={styles.whyBookTrustIcon}>
                <IonIcon
                  name="checkmark"
                  size={moderateScale(13)}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.whyBookTrustContent}>
                <Text style={styles.whyBookTrustTitle}>
                  Built for Hyderabad celebrations
                </Text>

                <Text style={styles.whyBookTrustText}>
                  Discover function halls, banquet halls, farm houses and resorts.
                </Text>
              </View>
            </View>
          </View>


          <TouchableOpacity onPress={() =>
            navigation.navigate('SearchVenues', {
              homeFeed: 'discover',
            })
          } style={styles.homeBrowseAll} accessibilityRole="button">
            <Text style={styles.homeBrowseAllText}>Explore all venues</Text><IonIcon name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} style={styles.homeSupportLink} accessibilityRole="button">
            <IonIcon name="chatbubble-ellipses-outline" size={18} color="#A74416" /><Text style={styles.homeNoticeTitle}>Need help? Contact BookTheDay</Text>
          </TouchableOpacity>
          <View style={{ height: 28 }} />
          {/* ── Location modal ── */}
          <Modal transparent visible={isModalVisible} animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                  For a better experience, your device will need to use Location Accuracy
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.noThanksText}>No, thanks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={getPermissions}>
                    <Text style={styles.turnOnText}>Turn on</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </ScrollView>


        <Modal visible={shortlistVisible} animationType="slide" onRequestClose={() => setShortlistVisible(false)}>
          <SafeAreaView style={styles.homeShortlistScreen}>
            <View style={styles.homeShortlistHeader}>
              <View style={{ flex: 1 }}><Text style={styles.homeShortlistTitle}>Saved venues</Text>
                <Text style={styles.homeNoticeText}>Saved on this device · Up to 30 venues</Text></View>
              <TouchableOpacity onPress={() => setShortlistVisible(false)} style={styles.homeIconTap} accessibilityRole="button" accessibilityLabel="Close saved venues">
                <IonIcon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.homeShortlistDisclaimer}>Saved prices may change. Open a venue to check current details and date availability.</Text>
            {!!shortlistError && <TouchableOpacity onPress={() => setShortlistReload(n => n + 1)} style={styles.homeStateBox}>
              <Text style={styles.homeErrorText}>{shortlistError} Tap to retry.</Text>
            </TouchableOpacity>}
            {!shortlistKey ? <Text style={styles.homeShortlistDisclaimer}>Log in to save venues on this device.</Text>
              : !shortlistReady && !shortlistError ? <ActivityIndicator color="#A74416" /> : null}
            <FlatList data={shortlist} keyExtractor={item => String(item._id)}
              contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
              ListEmptyComponent={shortlistReady ? <Text style={styles.homeNoticeText}>Tap the heart on a venue card to build your shortlist.</Text> : null}
              renderItem={({ item }) => (
                <View style={styles.homeSavedRow}>
                  <TouchableOpacity style={styles.homeSavedContent} accessibilityRole="button"
                    onPress={() => { setShortlistVisible(false); navigation.navigate('ViewEvents', { categoryId: item._id }); }}>
                    {!!item.professionalImage?.url && <FastImage source={{ uri: item.professionalImage.url }} style={styles.homeSavedImage} />}
                    <View style={{ flex: 1 }}><Text style={styles.homeNoticeTitle} numberOfLines={2}>{item.functionHallName}</Text>
                      <Text style={styles.homeNoticeText}>{item.venueCategory} · {venueLocality(item)}</Text>
                      <Text style={styles.homeSavedPrice}>{venuePriceLabel(item)}</Text>
                      {!!includedGuestsLabel(item) && <Text style={styles.homeGuestLabel}>{includedGuestsLabel(item)}</Text>}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleShortlist(item)} disabled={shortlistSaving} style={styles.homeIconTap}
                    accessibilityRole="button" accessibilityLabel={'Remove ' + item.functionHallName + ' from shortlist'}>
                    <IonIcon name="trash-outline" size={19} color="#A74416" />
                  </TouchableOpacity>
                </View>
              )} />
            <TouchableOpacity style={[styles.homeBrowseAll, { opacity: shortlist.length ? 1 : 0.5 }]} disabled={!shortlist.length}
              onPress={shareShortlist} accessibilityRole="button" accessibilityLabel="Share shortlist">
              <IonIcon name="share-social-outline" size={18} color="#FFF" /><Text style={styles.homeBrowseAllText}>Share shortlist</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({

const styles = StyleSheet.create({

  smartMatchCard: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
    height: verticalScale(90),

    borderRadius: moderateScale(16),
    overflow: 'hidden',

    borderWidth: 1,
    // borderColor: '#E8CBB8',
    borderColor: '#DDB69D',
    backgroundColor: '#FFF8F3',

    elevation: 3,
    shadowColor: '#A74416',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },

  smartMatchBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  smartMatchBackgroundImage: {
    borderRadius: moderateScale(16),
  },

  smartMatchOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(6),
  },

  smartMatchContent: {
    width: '100%',
  },

  smartMatchEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(3),
  },

  smartMatchEyebrowText: {
    marginLeft: horizontalScale(5),
    color: '#A74416',
    fontSize: moderateScale(8),
    fontWeight: '800',
    letterSpacing: 0.7,
    fontFamily: 'ManropeRegular',
  },

  //   smartMatchEyebrowText: {
  //   color: '#A74416',
  // },

  smartMatchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },

  smartMatchTitle: {
    flexShrink: 1,
    color: '#39271E',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(20),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },

  smartMatchArrow: {
    width: moderateScale(27),
    height: moderateScale(27),
    marginLeft: horizontalScale(8),
    borderRadius: moderateScale(14),
    backgroundColor: '#FFF1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  smartMatchDescription: {
    marginTop: verticalScale(3),
    color: '#756158',
    fontSize: moderateScale(9),
    lineHeight: moderateScale(13),
    fontFamily: 'ManropeRegular',
  },

  homeVenueName: { color: '#24201D', fontSize: moderateScale(14), lineHeight: moderateScale(20), fontWeight: '700', fontFamily: 'ManropeRegular', marginBottom: 6 },
  homeVenuePrice: { color: '#A74416', fontSize: moderateScale(15), fontWeight: '700', fontFamily: 'ManropeRegular', marginBottom: 6 },
  homeGuestLabel: { color: '#2F653B', fontSize: moderateScale(11), fontWeight: '600', marginBottom: 8 },
  homeDistance: { fontSize: moderateScale(11), color: '#78634F', marginBottom: 6 },
  homeDateHint: { fontSize: moderateScale(10), lineHeight: moderateScale(15), color: '#777', marginTop: 9 },
  homeImagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4EDE3' },
  homeSaveButton: { position: 'absolute', top: 8, right: 8, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF9', elevation: 2 },
  homePaymentNotice: { marginHorizontal: 16, marginTop: 10, borderWidth: 1, borderColor: '#EED7C4', backgroundColor: '#FFF5EA', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  homeNoticeTitle: { color: '#382E27', fontSize: moderateScale(13), fontWeight: '700', fontFamily: 'ManropeRegular' },
  homeNoticeText: { color: '#766D65', fontSize: moderateScale(12), lineHeight: moderateScale(18), marginTop: 4 },
  homeIconTap: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  homeShortlistBar: { marginHorizontal: 16, marginTop: 18, paddingLeft: 14, paddingRight: 6, borderWidth: 1, borderColor: '#EADBCD', borderRadius: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFDF9' },
  homeStateBox: { marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 10, backgroundColor: '#FFF6EC' },
  homeErrorText: { color: '#984321', fontSize: moderateScale(12), lineHeight: moderateScale(18) },
  homeBrowseAll: { marginHorizontal: 16, marginVertical: 16, padding: 15, borderRadius: 12, backgroundColor: '#A74416', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  homeBrowseAllText: { color: '#FFF', fontSize: moderateScale(14), fontWeight: '700' },
  homeSupportLink: { marginHorizontal: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  homeShortlistScreen: { flex: 1, backgroundColor: '#FFFCF8' },
  homeShortlistHeader: { flexDirection: 'row', padding: 16, paddingTop: 24, alignItems: 'center' },
  homeShortlistTitle: { fontSize: moderateScale(23), fontWeight: '700', color: '#382E27' },
  homeShortlistDisclaimer: { marginHorizontal: 16, color: '#766D65', fontSize: moderateScale(12), lineHeight: moderateScale(18), marginBottom: 8 },
  homeSavedRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EADBCD', borderRadius: 12, padding: 10, marginBottom: 12 },
  homeSavedContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  homeSavedImage: { width: 70, height: 80, borderRadius: 8, backgroundColor: '#F4EDE3' },
  homeSavedPrice: { color: '#A74416', fontWeight: '700', fontSize: moderateScale(12), marginTop: 6 },

  recentSection: {
    marginTop: verticalScale(26),
  },
  recentFeaturedCard: {
    position: 'relative',
    marginHorizontal: horizontalScale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2E2118',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },
  recentFeaturedImageWrap: {
    width: '100%',
    height: verticalScale(190),
    backgroundColor: '#F4EDE3',
  },
  recentFeaturedImage: {
    width: '100%',
    height: '100%',
  },
  recentFeaturedGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: verticalScale(78),
  },
  recentFeaturedFreshness: {
    position: 'absolute',
    left: horizontalScale(11),
    bottom: verticalScale(11),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(5),
    paddingHorizontal: horizontalScale(9),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(167,68,22,0.92)',
  },
  recentFeaturedFreshnessText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10),
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  recentFeaturedBody: {
    paddingHorizontal: horizontalScale(13),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(14),
  },
  recentFeaturedTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: horizontalScale(10),
    marginBottom: verticalScale(8),
  },
  recentFeaturedTitle: {
    flex: 1,
    color: '#24201D',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(21),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  recentFeaturedPrice: {
    maxWidth: '42%',
    color: '#A74416',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    fontWeight: '800',
    textAlign: 'right',
    fontFamily: 'ManropeRegular',
  },
  recentCompactList: {
    paddingLeft: horizontalScale(16),
    paddingRight: horizontalScale(6),
    paddingTop: verticalScale(13),
  },
  recentCompactCard: {
    width: moderateScale(184),
    marginRight: horizontalScale(11),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(13),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE2D8',
  },
  recentCompactImageWrap: {
    height: verticalScale(105),
    backgroundColor: '#F4EDE3',
  },
  recentCompactImage: {
    width: '100%',
    height: '100%',
  },
  recentNewBadge: {
    position: 'absolute',
    top: verticalScale(8),
    left: horizontalScale(8),
    paddingHorizontal: horizontalScale(7),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(7),
    backgroundColor: '#A74416',
  },
  recentNewBadgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(8.5),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recentCompactBody: {
    paddingHorizontal: horizontalScale(10),
    paddingTop: verticalScale(9),
    paddingBottom: verticalScale(11),
  },
  recentCompactTitle: {
    minHeight: moderateScale(36),
    color: '#29231F',
    fontSize: moderateScale(12.5),
    lineHeight: moderateScale(17),
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  recentCompactPrice: {
    color: '#A74416',
    fontSize: moderateScale(11.5),
    fontWeight: '700',
    marginTop: verticalScale(5),
  },
  recentCompactLocation: {
    color: '#7B6B60',
    fontSize: moderateScale(10),
    marginTop: verticalScale(5),
  },

  safeArea: { flex: 1, backgroundColor: '#FFF7E7' },
  scrollView: { flex: 1, marginBottom: verticalScale(70) },

  // ── TOP BAR ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(6),
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: horizontalScale(50),
    gap: 6,
  },
  locationSubText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#7D7F88',
    lineHeight: moderateScale(16),
  },
  locationMainText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#404348',
    lineHeight: moderateScale(21),
  },
  venueCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },

  venueCategoryOnImage: {
    position: 'absolute',
    top: 10,
    left: 10,
    marginBottom: 0,
    zIndex: 2,
  },

  venueCategoryBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'ManropeRegular',
    fontSize: 11,
    fontWeight: '700',
  },

  // ── HOME SEARCH BAR ──────────────────────────────────────────────────────────
  homeSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(6),
    gap: 10,
  },
  homeSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  homeSearchPlaceholder: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#7E8389',
    marginLeft: 10,
    flex: 1,
  },
  homeFilterIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.15)',
  },

  // bottom floating card
  viewBookingsButton: {
    height: moderateScale(38),

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: horizontalScale(8),
    borderRadius: moderateScale(12),

    backgroundColor: '#FD813B',
  },

  viewBookingsButtonText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    lineHeight: moderateScale(12),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  profileBtn: {
    position: 'relative',
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    justifyContent: 'center',
    alignItems: 'center',
  },

  profilePaymentBadge: {
    position: 'absolute',
    top: moderateScale(-4),
    right: moderateScale(-5),

    minWidth: moderateScale(20),
    height: moderateScale(20),
    paddingHorizontal: horizontalScale(4),
    borderRadius: moderateScale(10),

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FD813B',
    borderWidth: 2,
    borderColor: '#FFF7E7',
  },

  profilePaymentBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(8.5),
    fontWeight: '800',
    color: '#FFFFFF',
  },

  paymentReadyCardWrapper: {
    position: 'absolute',
    left: horizontalScale(18),
    right: horizontalScale(18),

    // Above bottom tabs
    bottom: verticalScale(78),

    borderRadius: moderateScale(16),
    overflow: 'hidden',

    backgroundColor: '#FFF9F4',
    borderWidth: 1,
    borderColor: '#F4D6C5',

    elevation: 8,
    shadowColor: '#7A3514',
    shadowOffset: {
      width: 0,
      height: verticalScale(4),
    },
    shadowOpacity: 0.16,
    shadowRadius: moderateScale(8),
  },

  paymentReadyCard: {
    minHeight: verticalScale(60),
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: horizontalScale(9),
    paddingRight: horizontalScale(6),
    paddingVertical: verticalScale(7),
  },

  paymentReadyIcon: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(11),

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFDDCA',
  },

  paymentReadyCountBadge: {
    position: 'absolute',
    top: moderateScale(-6),
    right: moderateScale(-6),

    minWidth: moderateScale(18),
    height: moderateScale(18),
    paddingHorizontal: horizontalScale(3),
    borderRadius: moderateScale(9),

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FD813B',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  paymentReadyCountText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(7.5),
    fontWeight: '800',
    color: '#FFFFFF',
  },

  paymentReadyContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: horizontalScale(9),
    marginRight: horizontalScale(6),
    justifyContent: 'center',
  },

  paymentReadyTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    lineHeight: moderateScale(14),
    fontWeight: '800',
    color: '#2A211D',
  },

  paymentReadySubtitle: {
    marginTop: verticalScale(1),
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(8.5),
    lineHeight: moderateScale(12),
    color: '#786B64',
  },

  paymentReadyClose: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: horizontalScale(4),

    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#F1E2DA',
  },

  scrollContentWithPaymentCard: {
    paddingBottom: verticalScale(150),
  },

  // ── HERO ─────────────────────────────────────────────────────────────────────
  heroWrapper: {
    marginTop: verticalScale(6),
    marginBottom: verticalScale(0),
  },
  heroBannerScroll: {
  },
  heroBannerSlide: {
    width: screenWidth,
    paddingHorizontal: 16,
  },
  heroBannerGradient: {
    borderRadius: moderateScale(16),
    width: screenWidth - 32,
    height: 220,
    overflow: 'hidden',
  },
  heroBannerDecor1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroBannerDecor2: {
    position: 'absolute',
    bottom: -20,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  heroBannerTextArea: {
    flex: 1,
    paddingRight: 10,
  },
  heroBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 4,
  },
  heroBannerBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#fff',
  },
  heroBannerTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#fff',
    lineHeight: moderateScale(30),
    marginBottom: 6,
  },
  heroBannerDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: moderateScale(17),
    marginBottom: 14,
  },
  heroBannerCtaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    gap: 5,
  },
  heroBannerCtaText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#fff',
  },
  heroBannerIconWrap: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  // floating stats card
  statsFloat: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  statNum: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#ECA73C',
    textAlign: 'center',
  },
  statLbl: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#7D7F88',
    marginTop: 2,
    textAlign: 'center',
  },
  statSep: {
    width: 1,
    height: '70%',
    backgroundColor: '#FFDB7E',
    alignSelf: 'center',
  },

  // ── CATEGORIES ────────────────────────────────────────────────────────────────
  categoriesSection: {
    marginTop: verticalScale(20),
    paddingHorizontal: horizontalScale(16),
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  catHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoriesTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: verticalScale(16),
  },
  categoriesSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#999',
    marginTop: 1,
  },
  catHeaderCrown: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(236,167,60,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldAccentBar: {
    width: 3,
    height: moderateScale(32),
    borderRadius: 2,
    backgroundColor: '#FD813B',
  },
  catGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  catItem: {
    alignItems: 'center',
    width: (screenWidth - 32) / 4,
  },
  catCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    // borderWidth: 1,
    // borderColor: '#707070',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  catLabel: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#202020',
    textAlign: 'center',
  },
  catScrollContent: {
    paddingRight: horizontalScale(16),
    gap: 12,
  },
  catCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
  },
  catCardLink: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  // keep old aliases so nothing else breaks
  catCardOuter: { width: moderateScale(155), height: verticalScale(210), borderRadius: moderateScale(20), overflow: 'hidden', elevation: 3 },
  catGoldBorder: { flex: 1, borderRadius: moderateScale(20), padding: 1.5 },
  catCardInner: { flex: 1, borderRadius: moderateScale(20), padding: horizontalScale(14), paddingTop: 0, justifyContent: 'flex-end', overflow: 'hidden' },
  catTopLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: moderateScale(20), borderTopRightRadius: moderateScale(20) },
  catIconWrap: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(16), justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(10), marginTop: verticalScale(20) },
  catBadge: { alignSelf: 'flex-start', borderRadius: moderateScale(8), paddingHorizontal: horizontalScale(7), paddingVertical: verticalScale(3), marginBottom: verticalScale(8) },
  catBadgeText: { fontFamily: 'ManropeRegular', fontSize: moderateScale(9), fontWeight: '800', letterSpacing: 0.3 },
  catArrow: { width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(14), justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },

  // ── SECTION HEADER ────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    marginBottom: verticalScale(14),
  },
  recommendedSection: {
    marginTop: verticalScale(24),
  },
  recommendedSubtitle: {
    marginTop: verticalScale(3),
    color: '#806F64',
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10.5),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: verticalScale(2),
  },
  sectionTitle: {
    fontFamily: 'Manrope',
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#999',
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seeAllText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllArrow: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: '#FBB302',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listPadding: {
    paddingLeft: horizontalScale(16),
    paddingRight: horizontalScale(8),
  },

  // ── HALL CARD ─────────────────────────────────────────────────────────────────
  hallCard: {
    width: moderateScale(260),
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    marginRight: horizontalScale(12),
    marginBottom: verticalScale(4),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  hallImageWrapper: {
    width: '100%',
    height: verticalScale(150),
  },
  hallImage: {
    width: '100%',
    height: '100%',
  },
  hallImageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: verticalScale(50),
  },
  premiumRibbon: {
    position: 'absolute',
    top: verticalScale(8),
    left: horizontalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FD813B',
    borderRadius: moderateScale(6),
    paddingHorizontal: horizontalScale(7),
    paddingVertical: verticalScale(3),
    gap: 3,
  },
  premiumRibbonText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: '#fff',
  },
  cardPricePill: {
    position: 'absolute',
    bottom: verticalScale(8),
    left: horizontalScale(8),
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: moderateScale(6),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(3),
  },
  cardPriceText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#fff',
  },
  hallCardBody: {
    padding: horizontalScale(12),
    paddingTop: verticalScale(10),
  },
  hallNamePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  hallName: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: horizontalScale(8),
  },
  hallPrice: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#FD813B',
  },
  hallAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: verticalScale(8),
  },
  hallAddress: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#777',
    flex: 1,
  },
  availableBadge: {
    backgroundColor: '#E6F9F0',
    borderRadius: moderateScale(4),
    paddingHorizontal: horizontalScale(6),
    paddingVertical: verticalScale(2),
  },
  availableBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9),
    fontWeight: '600',
    color: '#06BE66',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: moderateScale(6),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  chipText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    color: '#555',
    fontWeight: '500',
  },

  // ── PREMIUM DISCOVERY BANNER ────────────────────────────────────────────────

  destBannerWrapper: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(24),
    borderRadius: moderateScale(18),
    overflow: 'hidden',

    elevation: 3,
    shadowColor: '#5C1E3E',
    shadowOffset: {
      width: 0,
      height: verticalScale(3),
    },
    shadowOpacity: 0.12,
    shadowRadius: moderateScale(8),
  },

  destBanner: {
    minHeight: verticalScale(190),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    overflow: 'hidden',
  },

  destCircleLarge: {
    position: 'absolute',
    width: moderateScale(190),
    height: moderateScale(190),
    borderRadius: moderateScale(95),
    right: horizontalScale(-60),
    top: verticalScale(-55),
    backgroundColor: 'rgba(147,24,108,0.07)',
  },

  destCircleSmall: {
    position: 'absolute',
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    right: horizontalScale(35),
    bottom: verticalScale(-48),
    backgroundColor: 'rgba(217,119,6,0.09)',
  },

  destContent: {
    flex: 1,
    zIndex: 2,
    paddingRight: horizontalScale(10),
  },

  destPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(5),

    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    marginBottom: verticalScale(10),

    borderWidth: 1,
    borderColor: 'rgba(147,24,108,0.12)',
  },

  destPillText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9.5),
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#7A144F',
  },

  destTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(22),
    fontWeight: '800',
    lineHeight: moderateScale(28),
    color: '#2A1A14',
    marginBottom: verticalScale(7),
  },

  destTitleAccent: {
    color: '#93186C',
  },

  destSub: {
    maxWidth: horizontalScale(210),
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11.5),
    lineHeight: moderateScale(17),
    color: '#654F42',
    marginBottom: verticalScale(14),
  },

  destCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(7),

    backgroundColor: '#93186C',
    borderRadius: moderateScale(22),
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(9),

    elevation: 2,
    shadowColor: '#93186C',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
  },

  destCtaText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: '#FFFFFF',
  },

  destVisual: {
    width: horizontalScale(105),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  destIconOuter: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: moderateScale(1),
    borderColor: 'rgba(255,255,255,0.65)',
  },

  destIconInner: {
    width: moderateScale(78),
    height: moderateScale(78),
    borderRadius: moderateScale(39),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',

    elevation: 2,
    shadowColor: '#7A144F',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
  },

  destPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),

    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    paddingHorizontal: horizontalScale(9),
    paddingVertical: verticalScale(5),
    marginTop: verticalScale(-8),

    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: verticalScale(1),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3),
  },

  destPriceText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9.5),
    fontWeight: '800',
    color: '#8A4B08',
  },

  // Recently viewed uses its own rv* namespace so it does not clash with
  // the shared section header or the existing Recently Added styles.
  rvSection: {
    marginTop: verticalScale(22),
  },
  rvHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
  },
  rvEyebrow: {
    color: '#A05B36',
    fontSize: moderateScale(8),
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: 'ManropeRegular',
  },
  rvTitle: {
    marginTop: verticalScale(2),
    color: '#312824',
    fontSize: moderateScale(18),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  rvSeeAllText: {
    color: '#98461F',
    fontSize: moderateScale(11),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  rvHistoryCard: {
    marginHorizontal: horizontalScale(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8D9CF',
    borderRadius: moderateScale(17),
    backgroundColor: '#FFFDFC',
    elevation: 2,
    shadowColor: '#59331F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
  },
  rvRow: {
    minHeight: verticalScale(104),
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(10),
  },
  rvRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E9DED7',
  },
  rvImage: {
    width: horizontalScale(86),
    height: verticalScale(82),
    borderRadius: moderateScale(12),
    backgroundColor: '#F2E9E3',
  },
  rvImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rvContent: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginLeft: horizontalScale(11),
  },
  rvCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rvCategory: {
    maxWidth: '82%',
    marginRight: horizontalScale(5),
    color: '#A25932',
    fontSize: moderateScale(8),
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontFamily: 'ManropeRegular',
  },
  rvVenueName: {
    marginTop: verticalScale(3),
    color: '#332A26',
    fontSize: moderateScale(13),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  rvLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  rvLocation: {
    flex: 1,
    marginLeft: horizontalScale(3),
    color: '#81736B',
    fontSize: moderateScale(10),
    fontFamily: 'ManropeRegular',
  },
  rvBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(7),
  },
  rvPrice: {
    color: '#93401B',
    fontSize: moderateScale(11),
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  rvGuestText: {
    marginLeft: horizontalScale(8),
    color: '#5F7564',
    fontSize: moderateScale(8),
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  rvArrow: {
    width: moderateScale(28),
    height: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: horizontalScale(5),
    borderRadius: moderateScale(14),
    backgroundColor: '#FFF0E6',
  },
  // ── WHY BOOKTHEDAY ──────────────────────────────────────────────────────────

  whyBookContainer: {
    position: 'relative',
    marginTop: verticalScale(26),
    marginHorizontal: horizontalScale(16),
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    backgroundColor: '#FFFCF8',
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: '#F2E9DF',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#5C1E3E',
    shadowOffset: {
      width: 0,
      height: verticalScale(3),
    },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(9),
  },

  whyBookGlow: {
    position: 'absolute',
    width: moderateScale(150),
    height: moderateScale(150),
    borderRadius: moderateScale(75),
    top: verticalScale(-85),
    right: horizontalScale(-55),
    backgroundColor: 'rgba(255,219,126,0.18)',
  },

  whyBookHeader: {
    marginBottom: verticalScale(17),
    zIndex: 1,
  },

  whyBookBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(5),

    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    marginBottom: verticalScale(10),

    backgroundColor: '#FAEAF3',
    borderRadius: moderateScale(20),
  },

  whyBookBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9.5),
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#93186C',
  },

  whyBookTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(21),
    fontWeight: '800',
    lineHeight: moderateScale(27),
    color: '#201A1D',
    marginBottom: verticalScale(6),
  },

  whyBookTitleAccent: {
    color: '#93186C',
  },

  whyBookSubtitle: {
    maxWidth: '92%',
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11.5),
    lineHeight: moderateScale(17),
    color: '#74666D',
  },

  whyBookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: verticalScale(10),
  },


  whyBookCard: {
    position: 'relative',
    width: '48.4%',
    minHeight: verticalScale(138),

    paddingHorizontal: horizontalScale(12),
    paddingTop: verticalScale(13),
    paddingBottom: verticalScale(12),

    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: '#EEE8EA',
    overflow: 'hidden',

    elevation: 1,
    shadowColor: '#4A2638',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.04,
    shadowRadius: moderateScale(4),
  },

  whyBookCardIcon: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },

  whyBookCardTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '800',
    lineHeight: moderateScale(17),
    color: '#211A1E',
    marginBottom: verticalScale(5),
  },

  whyBookCardDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14.5),
    color: '#786C72',
  },

  whyBookCardAccent: {
    position: 'absolute',
    width: horizontalScale(26),
    height: verticalScale(3),
    left: horizontalScale(12),
    bottom: 0,
    borderTopLeftRadius: moderateScale(3),
    borderTopRightRadius: moderateScale(3),
  },

  whyBookTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),

    marginTop: verticalScale(14),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(11),

    backgroundColor: '#FFF5D9',
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#F4D789',
  },

  whyBookTrustIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07875D',
  },

  whyBookTrustContent: {
    flex: 1,
  },

  whyBookTrustTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: '#684306',
    marginBottom: verticalScale(2),
  },

  whyBookTrustText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9.5),
    lineHeight: moderateScale(13),
    color: '#88631F',
  },

  // ── POPULAR VENUES ─────────────────────────────────────────────────────────────
  popularVenueCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  popularVenueImage: {
    width: '100%',
    height: verticalScale(180),
    borderTopLeftRadius: moderateScale(14),
    borderTopRightRadius: moderateScale(14),
  },
  popularVenueBody: {
    padding: 14,
  },
  popularVenueName: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#1A1E25',
    flex: 1,
    marginRight: 8,
  },
  popularVenuePrice: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#D97706',
  },
  popularVenueAddress: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    color: '#7E8389',
    marginLeft: 4,
    flex: 1,
  },
  popularVenueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF8EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    gap: 4,
  },
  popularVenueChipText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#D97706',
  },

  // ── EXPLORE ALL CTA ───────────────────────────────────────────────────────────
  exploreAllBtn: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(28),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#A0143E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  exploreAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    gap: 10,
  },
  exploreAllText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#fff',
  },

  // ── PROMOTIONAL BANNERS ───────────────────────────────────────────────────────
  bannerSection: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(4),
  },
  bannerScroller: {
    paddingLeft: horizontalScale(16),
  },
  bannerSlide: {
    width: screenWidth - 32,
    marginRight: 12,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  bannerGradient: {
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(18),
    minHeight: verticalScale(145),
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  bannerTextArea: {
    flex: 1,
    paddingRight: 10,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 8,
    gap: 4,
  },
  bannerBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#fff',
  },
  bannerTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  bannerDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11.5),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: moderateScale(16),
    marginBottom: 12,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  bannerCtaText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#fff',
  },
  bannerIconArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bannerDecor1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bannerDecor2: {
    position: 'absolute',
    bottom: -15,
    left: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(0),
    gap: 7,
  },
  bannerDotIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  bannerDotActive: {
    width: 24,
    height: 7,
    backgroundColor: '#D97706',
    borderRadius: 4,
  },

  // ── MODAL ─────────────────────────────────────────────────────────────────────
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: horizontalScale(20),
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    alignItems: 'center',
  },
  modalText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: verticalScale(20),
    color: '#333',
    lineHeight: moderateScale(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noThanksText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(14),
    color: '#939393',
  },
  turnOnText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FD813B',
  },
});

export default HomeDashboard;
