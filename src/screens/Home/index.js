import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../utils/scalingMetrics';
import LocationMarkIcon from '../../assets/svgs/location.svg';
import ArrowDown from '../../assets/svgs/arrowDown.svg';
import { LinearGradient } from 'react-native-linear-gradient';
import themevariable from '../../utils/themevariable';
import { formatAmount } from '../../utils/GlobalFunctions';
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
import LocationIcon from '../../assets/svgs/locationIcon.svg';

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
import CatHalls from '../../assets/svgs/categories/home_categories_hall_icon.svg';
import ResortIcon from '../../assets/svgs/categories/home_categories_resort_icon.svg';
import DestinationIcon from '../../assets/svgs/categories/home_categories_destination_icon.svg';
const FarmHouseIconPng = require('../../assets/categories/hall_category.png');
import BgHeroFrame from '../../assets/svgs/BgHeroFrame.svg';
import CustomAlert from '../../components/CustomAlert';

const { width: screenWidth } = Dimensions.get('window');

const HomeDashboard = () => {
  // ─── Active state ────────────────────────────────────────────────────────────
  const [address, setAddress] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef(null);
  const [totalVenueCount, setTotalVenueCount] = useState(0);
  const [eventsData, setEventsData] = useState([]);
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

  const latitude = userLocationFetched?.geometry?.location?.lat
    ? userLocationFetched?.geometry?.location?.lat
    : userLocationFetched?.latitude;
  const longitude = userLocationFetched?.geometry?.location?.lng
    ? userLocationFetched?.geometry?.location?.lng
    : userLocationFetched?.longitude;

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

  // ─── useFocusEffect: halls + auth + profile ──────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      /* COMMENTED OUT — getCategories(); getAllCaterings(currentPage); */
      getAllEvents(currentPage);
      getPremiumHalls(1);
      getUserAuthTokenRes();
      getProfileData();
      return () => {
        console.log('Screen is unfocused');
      };
    }, []),
  );

  // ─── useFocusEffect: nearby halls ────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      getNearByEvents();
      /* COMMENTED OUT — getNearByCaterings(); */
      return () => {
        console.log('Screen is unfocused');
      };
    }, [latitude, longitude]),
  );

  useEffect(() => {
    storeUserDeviceToken();
  }, []);

  // ─── Auto-scroll banners ──────────────────────────────────────────────────────
  useEffect(() => {
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
  }, []);

  const handleBannerScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setActiveBanner(index);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  // ─── API: store FCM token ─────────────────────────────────────────────────────
  const storeUserDeviceToken = async () => {
    const payload = {
      mobileNumber: String(userLoggedInMobileNum),
      fcmToken: deviceFCMToken,
    };
    const token = await getUserAuthToken();
    console.log('LOgin screen scan', token);
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
  const getNearByEvents = async () => {
    console.log('latitude , long are::>>', latitude, longitude);
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getNearByFunctionHalls?latitude=${latitude}&longitude=${longitude}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const newFunctionHalls = Array.isArray(response?.data?.data)
        ? response?.data?.data
        : [];
      setNearByEventsData(newFunctionHalls);
    } catch (error) {
      console.error('Error fetching function halls:', error);
    }
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
  const getUserAuthTokenRes = async () => {
    const token = await getUserAuthToken();
    setGetUserAuth(token);
  };

  // ─── API: profile ─────────────────────────────────────────────────────────────
  const getProfileData = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllUserLocations/${userLoggedInMobileNumber}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(
        getCurrentLoggedInUserName(response?.data?.data?.fullName),
      );
    } catch (error) {
      console.log('profile::::::::::', error);
    }
  };

  // ─── API: all halls ───────────────────────────────────────────────────────────
  const getAllEvents = async page => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllFunctionHalls?page=${page}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEventsData(response?.data?.data);
      // Store total count from API response
      if (response?.data?.totalCount) {
        setTotalVenueCount(response.data.totalCount);
      } else if (response?.data?.totalPages) {
        setTotalVenueCount(response.data.totalPages * 10);
      }
    } catch (error) {
      console.log('events data error>>::', error);
    }
  };

  // ─── API: premium halls (3L+) with pagination ──────────────────────────────────
  const [premiumHalls, setPremiumHalls] = useState([]);
  const [premiumPage, setPremiumPage] = useState(1);
  const [premiumHasMore, setPremiumHasMore] = useState(true);
  const [premiumLoading, setPremiumLoading] = useState(false);

  const getPremiumHalls = async (page = 1, append = false) => {
    if (premiumLoading) return;
    setPremiumLoading(true);
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/filterFunctionHalls`,
        {
          params: { page, limit: 10, priceRanges: '3L-5L' },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const newData = Array.isArray(response?.data?.data) ? response.data.data : [];
      const totalPages = response?.data?.totalPages ?? 1;
      setPremiumHalls(prev => append ? [...prev, ...newData] : newData);
      setPremiumPage(page);
      setPremiumHasMore(page < totalPages);
    } catch (error) {
      console.log('premium halls error:', error);
    } finally {
      setPremiumLoading(false);
    }
  };

  const loadMorePremiumHalls = () => {
    if (premiumHasMore && !premiumLoading) {
      getPremiumHalls(premiumPage + 1, true);
    }
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

  // ─── Render: hall card (shared base) ────────────────────────────────────────
  const renderHallCard = (item, showPremiumBadge = false) => {
    const imgUrl = item?.professionalImage?.url;
    const hasMenu = item?.menuImages?.length > 0;
    const priceLabel = hasMenu
      ? 'Menu Based'
      : `${formatAmount(item?.rentPricePerDay)}/day`;

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
        style={styles.hallCard}>
        {/* image */}
        <View style={styles.hallImageWrapper}>
          <FastImage
            source={{ uri: imgUrl, priority: FastImage.priority.high }}
            style={styles.hallImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          {showPremiumBadge && (
            <View style={styles.premiumRibbon}>
              <IonIcon name="ribbon" size={10} color="#fff" />
              <Text style={styles.premiumRibbonText}>Premium</Text>
            </View>
          )}
        </View>

        {/* body */}
        <View style={styles.hallCardBody}>
          <View style={styles.hallNamePriceRow}>
            <Text numberOfLines={1} style={styles.hallName}>
              {item?.functionHallName}
            </Text>
            <Text style={styles.hallPrice}>{priceLabel}</Text>
          </View>
          <View style={styles.hallAddressRow}>
            <IonIcon name="location-sharp" size={12} color="#FD813B" />
            <Text numberOfLines={1} style={styles.hallAddress}>
              {item?.functionHallAddress?.address || item?.county || ''}
            </Text>
            <View style={styles.availableBadge}>
              <Text style={styles.availableBadgeText}>Available</Text>
            </View>
          </View>
          <View style={styles.chipsRow}>
            {item?.seatingCapacity ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item?.seatingCapacity} pax</Text>
              </View>
            ) : null}
            {item?.bedRooms > 0 ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item?.bedRooms} Rooms</Text>
              </View>
            ) : null}
            {item?.distance ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item?.distance?.toFixed(1)} km</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNearbyCard = ({ item }) => renderHallCard(item, false);
  const renderPremiumCard = ({ item }) => renderHallCard(item, true);

  // ─── Return ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFF7E7', '#FFF7E7', '#FFF8EB', '#FFFAF1', '#FFFCF6', '#FFFFFF']}
        locations={[0, 0.4, 0.5, 0.64, 0.77, 1]}
        style={{ flex: 1 }}
      >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

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
                Your current location
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
            <IonIcon name="person-circle-outline" size={40} color="#131313" />
          </TouchableOpacity>
        </View>

        {/* ── Search Bar + Filter ── */}
        <View style={styles.homeSearchRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SearchVenues')}
            style={styles.homeSearchBar}>
            <IonIcon name="search-outline" size={18} color="#7E8389" />
            <Text style={styles.homeSearchPlaceholder}>Search venues, halls, resorts...</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchVenues')}
            style={styles.homeFilterIcon}>
            <IonIcon name="options-outline" size={20} color="#D97706" />
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════
            HERO — Auto-scrolling banners
        ════════════════════════════════════════ */}
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
              onPress={() => navigation.navigate('Events')}
              style={styles.heroBannerSlide}>
              <LinearGradient
                colors={['#78350F', '#A16207', '#EAB308']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.heroBannerGradient}>
                <View style={styles.heroBannerDecor1} />
                <View style={styles.heroBannerDecor2} />
                <View style={styles.heroBannerContent}>
                  <View style={styles.heroBannerTextArea}>
                    <View style={styles.heroBannerBadge}>
                      <IonIcon name="business" size={10} color="#fff" />
                      <Text style={styles.heroBannerBadgeText}>Best Value</Text>
                    </View>
                    <Text style={styles.heroBannerTitle}>Function{'\n'}Halls</Text>
                    <Text style={styles.heroBannerDesc}>Spacious venues with AC, catering & all amenities</Text>
                    <View style={styles.heroBannerCtaPill}>
                      <Text style={styles.heroBannerCtaText}>Explore Now</Text>
                      <IonIcon name="arrow-forward" size={13} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.heroBannerIconWrap}>
                    <IonIcon name="business" size={40} color="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Banner 2 - Farm Houses */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => navigation.navigate('FarmHouse')}
              style={styles.heroBannerSlide}>
              <LinearGradient
                colors={['#1B4332', '#2D6A4F', '#52B788']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.heroBannerGradient}>
                <View style={styles.heroBannerDecor1} />
                <View style={styles.heroBannerDecor2} />
                <View style={styles.heroBannerContent}>
                  <View style={styles.heroBannerTextArea}>
                    <View style={styles.heroBannerBadge}>
                      <IonIcon name="leaf" size={10} color="#fff" />
                      <Text style={styles.heroBannerBadgeText}>Popular Choice</Text>
                    </View>
                    <Text style={styles.heroBannerTitle}>Scenic Farm{'\n'}Houses</Text>
                    <Text style={styles.heroBannerDesc}>Open-air retreats for unforgettable celebrations</Text>
                    <View style={styles.heroBannerCtaPill}>
                      <Text style={styles.heroBannerCtaText}>Explore Now</Text>
                      <IonIcon name="arrow-forward" size={13} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.heroBannerIconWrap}>
                    <IonIcon name="leaf" size={40} color="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Banner 3 - Luxury Resorts */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => navigation.navigate('LuxuryResorts')}
              style={styles.heroBannerSlide}>
              <LinearGradient
                colors={['#4A1942', '#803D7A', '#CD6DBB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.heroBannerGradient}>
                <View style={styles.heroBannerDecor1} />
                <View style={styles.heroBannerDecor2} />
                <View style={styles.heroBannerContent}>
                  <View style={styles.heroBannerTextArea}>
                    <View style={styles.heroBannerBadge}>
                      <IonIcon name="sparkles" size={10} color="#fff" />
                      <Text style={styles.heroBannerBadgeText}>Premium</Text>
                    </View>
                    <Text style={styles.heroBannerTitle}>Luxury{'\n'}Resorts</Text>
                    <Text style={styles.heroBannerDesc}>World-class venues for grand weddings & parties</Text>
                    <View style={styles.heroBannerCtaPill}>
                      <Text style={styles.heroBannerCtaText}>Explore Now</Text>
                      <IonIcon name="arrow-forward" size={13} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.heroBannerIconWrap}>
                    <IonIcon name="sparkles" size={40} color="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

             {/* Banner 4 - Banquet Halls */}
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => navigation.navigate('BanquetHalls')}
              style={styles.heroBannerSlide}>
              <LinearGradient
                colors={['#92400E', '#D97706', '#FBBF24']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.heroBannerGradient}>
                <View style={styles.heroBannerDecor1} />
                <View style={styles.heroBannerDecor2} />
                <View style={styles.heroBannerContent}>
                  <View style={styles.heroBannerTextArea}>
                    <View style={styles.heroBannerBadge}>
                      <IonIcon name="ribbon" size={10} color="#fff" />
                      <Text style={styles.heroBannerBadgeText}>Elegant</Text>
                    </View>
                    <Text style={styles.heroBannerTitle}>Banquet{'\n'}Halls</Text>
                    <Text style={styles.heroBannerDesc}>Elegant spaces for receptions, sangeets & celebrations</Text>
                    <View style={styles.heroBannerCtaPill}>
                      <Text style={styles.heroBannerCtaText}>Explore Now</Text>
                      <IonIcon name="arrow-forward" size={13} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.heroBannerIconWrap}>
                    <IonIcon name="ribbon" size={40} color="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              </LinearGradient>
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

        {/* Stats card — below dots */}
        <View style={styles.statsFloat}>
          <View style={styles.statItem}>
            <IonIcon name="business" size={18} color="#D97706" style={{marginRight: 8}} />
            <View>
              <Text style={styles.statNum}>{totalVenueCount > 0 ? `${totalVenueCount}+` : '—'}</Text>
              <Text style={styles.statLbl}>Venues</Text>
            </View>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <IonIcon name="location" size={18} color="#D97706" style={{marginRight: 8}} />
            <View>
              <Text style={styles.statNum}>Hyderabad</Text>
              <Text style={styles.statLbl}>Location</Text>
            </View>
          </View>
          <View style={styles.statSep} />
          <View style={styles.statItem}>
            <IonIcon name="headset" size={18} color="#D97706" style={{marginRight: 8}} />
            <View>
              <Text style={styles.statNum}>24/7</Text>
              <Text style={styles.statLbl}>Support</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════
            CATEGORIES — round circles like Figma
        ════════════════════════════════════════ */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Categories</Text>

          <View style={styles.catGrid}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Events')}
              style={styles.catItem}>
              <View style={styles.catCircle}>
                <CatHalls width={68} height={68} />
              </View>
              <Text style={styles.catLabel}>Halls</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('FarmHouse')}
              style={styles.catItem}>
              <View style={styles.catCircle}>
                <Image source={FarmHouseIconPng} style={{width: 62, height: 62, borderRadius: 34}} resizeMode="cover" />
              </View>
              <Text style={styles.catLabel}>Farm House</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('LuxuryResorts')}
              style={styles.catItem}>
              <View style={styles.catCircle}>
                <ResortIcon width={68} height={68} />
              </View>
              <Text style={styles.catLabel}>Resorts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('BanquetHalls')}
              style={styles.catItem}>
              <View style={styles.catCircle}>
                <DestinationIcon width={68} height={68} />
              </View>
              <Text style={styles.catLabel}>Banquets</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ════════════════════════════════════════
            HALLS NEAR YOU
        ════════════════════════════════════════ */}
        {nearByEventsData?.length > 0 && (
          <View style={{ marginTop: verticalScale(24) }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Function Halls Near You</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('NearByEvents')}
                style={styles.seeAllBtn}>
                <Text style={styles.seeAllText}>See All</Text>
                <View style={styles.seeAllArrow}>
                  <IonIcon name="arrow-forward" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={nearByEventsData}
              renderItem={renderNearbyCard}
              horizontal
              keyExtractor={item => item?._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listPadding}
            />
          </View>
        )}

        {/* ════════════════════════════════════════
            PREMIUM HALLS
        ════════════════════════════════════════ */}
        {eventsData?.length > 0 && (
          <View style={{ marginTop: verticalScale(24) }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Event Halls</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Events')}
                style={styles.seeAllBtn}>
                <Text style={styles.seeAllText}>See All</Text>
                <View style={styles.seeAllArrow}>
                  <IonIcon name="arrow-forward" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              data={eventsData?.slice(0, 6)}
              renderItem={renderPremiumCard}
              horizontal
              keyExtractor={item => item?._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listPadding}
            />
          </View>
        )}

        {/* ════════════════════════════════════════
            BANQUET HALLS BANNER
        ════════════════════════════════════════ */}
        <View style={styles.destBannerWrapper}>
          <LinearGradient
            colors={['#FFF3CD', '#FFDB7E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.destBanner}>
            <View style={styles.destCircle} />
            <View style={styles.destLeft}>
              <View style={styles.destNewPill}>
                <Text style={styles.destNewText}>✦ Exclusive</Text>
              </View>
              <Text style={styles.destTitle}>Expect More{'\n'}With Less</Text>
              <Text style={styles.destSub}>
                We are here for your every need.{'\n'}Premium venues at best prices.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('BanquetHalls')}
                style={styles.destCta}>
                <Text style={styles.destCtaText}>About us »</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.destRight}>
              <IonIcon name="flower" size={80} color="rgba(217,119,6,0.2)" />
            </View>
          </LinearGradient>
        </View>

        {/* ════════════════════════════════════════
            WHY BOOKTHEDAY
        ════════════════════════════════════════ */}
        <View style={styles.whyBookContainer}>
          {/* header */}
          <View style={styles.whyBookHeader}>
            <View style={styles.whyBookBadge}>
              <IonIcon name="sparkles" size={12} color="#FD813B" />
              <Text style={styles.whyBookBadgeText}>Why Us</Text>
            </View>
            <Text style={styles.whyBookTitle}>Why BookTheDay?</Text>
            <Text style={styles.whyBookSubtitle}>
              Everything you need for a perfect event, guaranteed.
            </Text>
          </View>

          {/* feature cards — 2x2 grid */}
          <View style={styles.whyBookGrid}>
            <View style={[styles.whyBookCard, {backgroundColor: '#ECFDF5'}]}>
              <View style={[styles.whyBookCardIcon, {backgroundColor: '#D1FAE5'}]}>
                <IonIcon name="flash" size={20} color="#059669" />
              </View>
              <Text style={styles.whyBookCardTitle}>Instant{'\n'}Confirmation</Text>
              <Text style={styles.whyBookCardDesc}>Booking confirmed immediately</Text>
            </View>

            <View style={[styles.whyBookCard, {backgroundColor: '#FFF7ED'}]}>
              <View style={[styles.whyBookCardIcon, {backgroundColor: '#FED7AA'}]}>
                <IonIcon name="refresh" size={20} color="#EA580C" />
              </View>
              <Text style={styles.whyBookCardTitle}>Easy{'\n'}Cancellation</Text>
              <Text style={styles.whyBookCardDesc}>Flexible policy with quick refunds</Text>
            </View>

            <View style={[styles.whyBookCard, {backgroundColor: '#EFF6FF'}]}>
              <View style={[styles.whyBookCardIcon, {backgroundColor: '#BFDBFE'}]}>
                <IonIcon name="headset" size={20} color="#2563EB" />
              </View>
              <Text style={styles.whyBookCardTitle}>24/7{'\n'}Support</Text>
              <Text style={styles.whyBookCardDesc}>Our team is always here for you</Text>
            </View>

            <View style={[styles.whyBookCard, {backgroundColor: '#FDF2F8'}]}>
              <View style={[styles.whyBookCardIcon, {backgroundColor: '#FBCFE8'}]}>
                <IonIcon name="shield-checkmark" size={20} color="#DB2777" />
              </View>
              <Text style={styles.whyBookCardTitle}>Secure{'\n'}Payments</Text>
              <Text style={styles.whyBookCardDesc}>100% safe via Razorpay</Text>
            </View>
          </View>

          {/* trust badge */}
          <View style={styles.whyBookTrustBadge}>
            <IonIcon name="checkmark-circle" size={14} color="#059669" />
            <Text style={styles.whyBookTrustText}>Every venue personally verified in Hyderabad</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════
            POPULAR VENUES — vertical list
        ════════════════════════════════════════ */}
        {premiumHalls?.length > 0 && (
          <View style={{ marginTop: verticalScale(24) }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Venues</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Events')}
                style={styles.seeAllBtn}>
                <Text style={styles.seeAllText}>View All</Text>
                <View style={styles.seeAllArrow}>
                  <IonIcon name="arrow-forward" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: horizontalScale(16) }}>
              {premiumHalls.map((item) => (
                <TouchableOpacity
                  key={item?._id}
                  activeOpacity={0.92}
                  onPress={() => navigation.navigate('ViewEvents', { categoryId: item?._id })}
                  style={styles.popularVenueCard}>
                  <FastImage
                    source={{ uri: item?.professionalImage?.url, priority: FastImage.priority.normal }}
                    style={styles.popularVenueImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View style={styles.popularVenueBody}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text numberOfLines={1} style={styles.popularVenueName}>{item?.functionHallName}</Text>
                      <Text style={styles.popularVenuePrice}>
                        {item?.menuImages?.length > 0 ? 'Menu Based' : `${formatAmount(item?.rentPricePerDay)}/day`}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <IonIcon name="location-sharp" size={12} color="#FD813B" />
                      <Text numberOfLines={1} style={styles.popularVenueAddress}>
                        {item?.functionHallAddress?.address || ''}
                      </Text>
                    </View>
                    {item?.seatingCapacity ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <View style={styles.popularVenueChip}>
                          <IonIcon name="people-outline" size={11} color="#D97706" />
                          <Text style={styles.popularVenueChipText}>{item?.seatingCapacity} pax</Text>
                        </View>
                        {item?.bedRooms > 0 && (
                          <View style={styles.popularVenueChip}>
                            <IonIcon name="bed-outline" size={11} color="#D97706" />
                            <Text style={styles.popularVenueChipText}>{item?.bedRooms} Rooms</Text>
                          </View>
                        )}
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
              {premiumHasMore && (
                <TouchableOpacity
                  onPress={loadMorePremiumHalls}
                  style={{ alignSelf: 'center', marginTop: 12, marginBottom: 8, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: '#D97706' }}>
                  {premiumLoading ? (
                    <ActivityIndicator size="small" color="#D97706" />
                  ) : (
                    <Text style={{ fontFamily: 'ManropeRegular', fontSize: 13, fontWeight: '700', color: '#D97706' }}>Load More</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ════════════════════════════════════════
            EXPLORE ALL CTA
        ════════════════════════════════════════ */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Events')}
          style={styles.exploreAllBtn}
          activeOpacity={0.88}>
          <LinearGradient
            colors={['#D2453B', '#A0143E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreAllGradient}>
            <IonIcon name="business-outline" size={18} color="#FFDB7E" />
            <Text style={styles.exploreAllText}>Explore All Venues</Text>
            <IonIcon name="arrow-forward" size={16} color="#FFDB7E" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 32 }} />

        {/* ── Location modal ── */}
        <Modal transparent visible={isModalVisible} animationType="slide">
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
      </LinearGradient>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({

const styles = StyleSheet.create({
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
  profileBtn: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: verticalScale(24),
    paddingHorizontal: horizontalScale(20),
    minHeight: verticalScale(170),
    overflow: 'hidden',
    justifyContent: 'center',
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

  // ── DESTINATION BANNER ────────────────────────────────────────────────────────
  destBannerWrapper: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(28),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  destBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: horizontalScale(22),
    overflow: 'hidden',
  },
  destCircle: {
    position: 'absolute',
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(100),
    backgroundColor: 'rgba(253,129,59,0.06)',
    right: -60,
    top: -40,
  },
  destLeft: { flex: 1 },
  destRight: { justifyContent: 'center', alignItems: 'center', paddingLeft: 8 },
  destNewPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FD813B',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(3),
    marginBottom: verticalScale(10),
  },
  destNewText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#fff',
  },
  destTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(22),
    fontWeight: '800',
    color: '#1A1E25',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(6),
  },
  destSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    color: '#555',
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(16),
  },
  destCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(160,20,62,0.75)',
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    gap: 6,
  },
  destCtaText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#fff',
  },

  // ── TRUST CARDS ───────────────────────────────────────────────────────────────
  trustRow: {
    flexDirection: 'row',
    gap: 10,
  },
  trustCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: horizontalScale(14),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  trustIconCircle: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  trustTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#131313',
    textAlign: 'center',
  },
  trustSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    color: '#939393',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: moderateScale(14),
  },

  // ── WHY BOOKTHEDAY ───────────────────────────────────────────────────────────
  whyBookContainer: {
    marginTop: verticalScale(28),
    marginHorizontal: horizontalScale(16),
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: horizontalScale(18),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  whyBookHeader: {
    marginBottom: verticalScale(16),
  },
  whyBookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(253, 129, 59, 0.08)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 4,
  },
  whyBookBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#FD813B',
  },
  whyBookTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: '#1A1E25',
    marginBottom: 4,
  },
  whyBookSubtitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    color: '#7E8389',
    lineHeight: moderateScale(17),
  },
  whyBookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  whyBookCard: {
    width: '48%',
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    flexGrow: 1,
  },
  whyBookCardIcon: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  whyBookCardTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#1A1E25',
    marginBottom: 4,
    lineHeight: moderateScale(17),
  },
  whyBookCardDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10.5),
    color: '#7E8389',
    lineHeight: moderateScale(14),
  },
  whyBookTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: verticalScale(14),
    backgroundColor: '#F0FDF4',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(14),
    borderWidth: 1,
    borderColor: '#FFDB7E',
  },
  whyBookTrustText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#D97706',
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
