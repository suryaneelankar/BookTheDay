import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
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
import DistanceIcon from '../../assets/svgs/distanceIcon.svg';

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
import FarmHouseIcon from '../../assets/svgs/categories/home_categories_farm_house_icon.svg';

const { width: screenWidth } = Dimensions.get('window');

const HomeDashboard = () => {
  // ─── Active state ────────────────────────────────────────────────────────────
  const [address, setAddress] = useState('');
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
      console.log('userTokenRes  res:::::::::', userTokenRes);
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
    } catch (error) {
      console.log('events data error>>::', error);
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
        Alert.alert('Location permissions denied');
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
            source={{ uri: imgUrl, priority: FastImage.priority.normal }}
            style={styles.hallImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={styles.hallImageGradient}
          />
          {/* premium ribbon */}
          {showPremiumBadge && (
            <View style={styles.premiumRibbon}>
              <IonIcon name="ribbon" size={10} color="#FD813B" />
              <Text style={styles.premiumRibbonText}>Premium</Text>
            </View>
          )}
          {/* price pill — bottom left over gradient */}
          <View style={styles.cardPricePill}>
            <Text style={styles.cardPriceText}>{priceLabel}</Text>
          </View>
        </View>

        {/* body */}
        <View style={styles.hallCardBody}>
          <Text numberOfLines={1} style={styles.hallName}>
            {item?.functionHallName}
          </Text>
          <View style={styles.hallAddressRow}>
            <IonIcon name="location-outline" size={11} color="#FD813B" />
            <Text numberOfLines={1} style={styles.hallAddress}>
              {item?.functionHallAddress?.address || item?.county || ''}
            </Text>
          </View>
          <View style={styles.chipsRow}>
            {item?.seatingCapacity ? (
              <View style={styles.chip}>
                <IonIcon name="people-outline" size={10} color="#FD813B" />
                <Text style={styles.chipText}> {item?.seatingCapacity} pax</Text>
              </View>
            ) : null}
            {item?.distance ? (
              <View style={styles.chip}>
                <IonIcon name="navigate-outline" size={10} color="#FD813B" />
                <Text style={styles.chipText}> {item?.distance?.toFixed(1)} km</Text>
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        {/* ════════════════════════════════════════
            TOP BAR
        ════════════════════════════════════════ */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.locationPill}
            onPress={() => navigation.navigate('LocationAdded')}>
            <IonIcon name="location" size={14} color="#FD813B" />
            <Text numberOfLines={1} style={styles.locationPillText}>
              {userLocationFetched?.formatted_address
                ? userLocationFetched.formatted_address
                : userLocationFetched?.address
                  ? userLocationFetched.address
                  : 'Select Location'}
            </Text>
            <IonIcon name="chevron-down" size={13} color="#939393" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('ProfileScreen')}>
            <IonIcon name="person-circle-outline" size={32} color="#131313" />
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════
            HERO — warm gradient, on-brand
        ════════════════════════════════════════ */}
        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={['#FD813B', '#DF6E12', '#B46609']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}>

            {/* decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />

            {/* gold badge */}
            <View style={styles.heroBadge}>
              <IonIcon name="star" size={10} color="#ECA73C" />
              <Text style={styles.heroBadgeText}>Hyderabad's #1 Venue Platform</Text>
            </View>

            <Text style={styles.heroTitle}>Your Dream{'\n'}Venue Awaits</Text>
            {/* gold underline accent */}
            <View style={styles.heroTitleAccent} />
            <Text style={styles.heroSubtitle}>
              Premium Halls · Farm Houses · Resorts
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Events')}
              style={styles.heroCta}>
              <LinearGradient
                colors={['#D2453B', '#A0143E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heroCtaGradient}>
                <Text style={styles.heroCtaText}>Browse Venues</Text>
                <IonIcon name="arrow-forward" size={14} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

          {/* floating stats card — overlaps hero bottom */}
          <View style={styles.statsFloat}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>50+</Text>
              <Text style={styles.statLbl}>Venues</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>500+</Text>
              <Text style={styles.statLbl}>Bookings</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>4.8★</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════
            CATEGORIES — premium venue types
        ════════════════════════════════════════ */}
        <View style={styles.categoriesSection}>

          {/* section header */}
          <View style={styles.categoriesHeader}>
            <View style={styles.catHeaderLeft}>
              <View style={styles.goldAccentBar} />
              <View>
                <Text style={styles.categoriesTitle}>Explore By Type</Text>
                <Text style={styles.categoriesSub}>Choose your perfect venue style</Text>
              </View>
            </View>
            <View style={styles.catHeaderCrown}>
              <IonIcon name="diamond" size={14} color="#ECA73C" />
            </View>
          </View>

          {/* horizontal scroll of cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScrollContent}>

            {/* ── Function Halls ── */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Events')}
              style={styles.catCard}>
              <View style={[styles.catIconArea, { backgroundColor: '#FFF0E6' }]}>
                <View style={[styles.catIconCircle, { backgroundColor: 'rgba(253,129,59,0.15)' }]}>
                  <CatHalls width={60} height={60} />
                </View>
                <View style={[styles.catTagPill, { backgroundColor: 'rgba(253,129,59,0.12)' }]}>
                  <Text style={[styles.catTagText, { color: '#DF6E12' }]}>★ Popular</Text>
                </View>
              </View>
              <View style={styles.catCardBody}>
                <Text style={styles.catCardTitle}>Function Halls</Text>
                <Text style={styles.catCardDesc}>Grand banquets & event spaces</Text>
                <View style={[styles.catCardFooter, { borderTopColor: '#FFE8D6' }]}>
                  <Text style={[styles.catCardLink, { color: '#FD813B' }]}>Explore</Text>
                  <IonIcon name="arrow-forward" size={12} color="#FD813B" />
                </View>
              </View>
            </TouchableOpacity>

            {/* ── Farm Houses ── */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('FarmHouse')}
              style={styles.catCard}>
              <View style={[styles.catIconArea, { backgroundColor: '#E8F8F0' }]}>
                <View style={[styles.catIconCircle, { backgroundColor: 'rgba(6,190,102,0.15)' }]}>
                  <FarmHouseIcon width={60} height={60} />
                </View>
                <View style={[styles.catTagPill, { backgroundColor: 'rgba(6,190,102,0.12)' }]}>
                  <Text style={[styles.catTagText, { color: '#047A42' }]}>✦ Scenic</Text>
                </View>
              </View>
              <View style={styles.catCardBody}>
                <Text style={styles.catCardTitle}>Farm Houses</Text>
                <Text style={styles.catCardDesc}>Open-air & nature retreats</Text>
                <View style={[styles.catCardFooter, { borderTopColor: '#D0F0E0' }]}>
                  <Text style={[styles.catCardLink, { color: '#06BE66' }]}>Explore</Text>
                  <IonIcon name="arrow-forward" size={12} color="#06BE66" />
                </View>
              </View>
            </TouchableOpacity>

            {/* ── Luxury Resorts ── */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('LuxuryResorts')}
              style={styles.catCard}>
              <View style={[styles.catIconArea, { backgroundColor: '#FEF8E8' }]}>
                <View style={[styles.catIconCircle, { backgroundColor: 'rgba(236,167,60,0.15)' }]}>
                  <ResortIcon width={60} height={60} />
                </View>
                <View style={[styles.catTagPill, { backgroundColor: 'rgba(236,167,60,0.12)' }]}>
                  <Text style={[styles.catTagText, { color: '#B8860B' }]}>◆ Luxury</Text>
                </View>
              </View>
              <View style={styles.catCardBody}>
                <Text style={styles.catCardTitle}>Luxury Resorts</Text>
                <Text style={styles.catCardDesc}>5-star stays & celebrations</Text>
                <View style={[styles.catCardFooter, { borderTopColor: '#FDF0C8' }]}>
                  <Text style={[styles.catCardLink, { color: '#ECA73C' }]}>Explore</Text>
                  <IonIcon name="arrow-forward" size={12} color="#ECA73C" />
                </View>
              </View>
            </TouchableOpacity>

            {/* ── Destination Weddings ── */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Events')}
              style={styles.catCard}>
              <View style={[styles.catIconArea, { backgroundColor: '#FDF0F4' }]}>
                <View style={[styles.catIconCircle, { backgroundColor: 'rgba(160,20,62,0.1)' }]}>
                  <DestinationIcon width={60} height={60} />
                </View>
                <View style={[styles.catTagPill, { backgroundColor: 'rgba(160,20,62,0.08)' }]}>
                  <Text style={[styles.catTagText, { color: '#A0143E' }]}>✦ Exclusive</Text>
                </View>
              </View>
              <View style={styles.catCardBody}>
                <Text style={styles.catCardTitle}>Destination Weddings</Text>
                <Text style={styles.catCardDesc}>Unforgettable celebrations</Text>
                <View style={[styles.catCardFooter, { borderTopColor: '#FAE0E8' }]}>
                  <Text style={[styles.catCardLink, { color: '#A0143E' }]}>Explore</Text>
                  <IonIcon name="arrow-forward" size={12} color="#A0143E" />
                </View>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </View>

        {/* ════════════════════════════════════════
            HALLS NEAR YOU
        ════════════════════════════════════════ */}
        {nearByEventsData?.length > 0 && (
          <View style={{ marginTop: 28 }}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.goldAccentBar} />
                  <Text style={styles.sectionTitle}>Near You</Text>
                </View>
                <Text style={styles.sectionSub}>Halls close to your location</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('NearByEvents')}
                style={styles.seeAllPill}>
                <Text style={styles.seeAllText}>See All</Text>
                <IonIcon name="arrow-forward" size={12} color="#FD813B" />
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
          <View style={{ marginTop: 28 }}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.goldAccentBar} />
                  <Text style={styles.sectionTitle}>Premium Halls</Text>
                </View>
                <Text style={styles.sectionSub}>Handpicked high-end venues</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Events')}
                style={styles.seeAllPill}>
                <Text style={styles.seeAllText}>View All</Text>
                <IonIcon name="arrow-forward" size={12} color="#FD813B" />
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
            DESTINATION WEDDINGS BANNER
        ════════════════════════════════════════ */}
        <View style={styles.destBannerWrapper}>
          <LinearGradient
            colors={['#131313', '#2a1a0e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.destBanner}>
            <View style={styles.destCircle} />
            <View style={styles.destLeft}>
              <View style={styles.destNewPill}>
                <Text style={styles.destNewText}>✦ Exclusive</Text>
              </View>
              <Text style={styles.destTitle}>Destination{'\n'}Weddings</Text>
              <Text style={styles.destSub}>
                Farm houses & luxury resorts{'\n'}around Hyderabad
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Events')}
                style={styles.destCta}>
                <Text style={styles.destCtaText}>Explore</Text>
                <IonIcon name="arrow-forward" size={13} color="#131313" />
              </TouchableOpacity>
            </View>
            <View style={styles.destRight}>
              <IonIcon name="flower" size={90} color="rgba(253,129,59,0.18)" />
            </View>
          </LinearGradient>
        </View>

        {/* ════════════════════════════════════════
            WHY BOOKTHEDAY
        ════════════════════════════════════════ */}
        <View style={styles.whyBookContainer}>
          {/* header */}
          <View style={styles.whyBookHeader}>
            <View style={styles.whyBookHeaderLeft}>
              <View style={styles.whyBookAccentBar} />
              <View>
                <Text style={styles.whyBookTitle}>Why BookTheDay?</Text>
                <Text style={styles.whyBookSubtitle}>Everything you need, guaranteed</Text>
              </View>
            </View>
            <View style={styles.whyBookDiamondWrap}>
              <IonIcon name="diamond" size={14} color="#ECA73C" />
            </View>
          </View>

          {/* feature rows */}
          <View style={styles.whyBookList}>
            <View style={styles.whyBookFeatureRow}>
              <LinearGradient colors={['#009C4D', '#047A42']} style={styles.whyBookFeatureIcon}>
                <IonIcon name="flash" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.whyBookFeatureText}>
                <Text style={styles.whyBookFeatureTitle}>Instant Confirmation</Text>
                <Text style={styles.whyBookFeatureDesc}>Your booking is confirmed immediately — no waiting</Text>
              </View>
              <IonIcon name="checkmark-circle" size={18} color="#009C4D" />
            </View>

            <View style={styles.whyBookDivider} />

            <View style={styles.whyBookFeatureRow}>
              <LinearGradient colors={['#FD813B', '#DF6E12']} style={styles.whyBookFeatureIcon}>
                <IonIcon name="refresh" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.whyBookFeatureText}>
                <Text style={styles.whyBookFeatureTitle}>Easy Cancellation</Text>
                <Text style={styles.whyBookFeatureDesc}>Flexible cancellation policy with quick refunds</Text>
              </View>
              <IonIcon name="checkmark-circle" size={18} color="#009C4D" />
            </View>

            <View style={styles.whyBookDivider} />

            <View style={styles.whyBookFeatureRow}>
              <LinearGradient colors={['#042CB0', '#0A3FD4']} style={styles.whyBookFeatureIcon}>
                <IonIcon name="headset" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.whyBookFeatureText}>
                <Text style={styles.whyBookFeatureTitle}>24/7 Support</Text>
                <Text style={styles.whyBookFeatureDesc}>Our team is always available to assist you</Text>
              </View>
              <IonIcon name="checkmark-circle" size={18} color="#009C4D" />
            </View>

            <View style={styles.whyBookDivider} />

            <View style={styles.whyBookFeatureRow}>
              <LinearGradient colors={['#A0143E', '#D2453B']} style={styles.whyBookFeatureIcon}>
                <IonIcon name="shield-checkmark" size={18} color="#fff" />
              </LinearGradient>
              <View style={styles.whyBookFeatureText}>
                <Text style={styles.whyBookFeatureTitle}>Secure Payments</Text>
                <Text style={styles.whyBookFeatureDesc}>100% safe transactions powered by Razorpay</Text>
              </View>
              <IonIcon name="checkmark-circle" size={18} color="#009C4D" />
            </View>
          </View>

          {/* gold trust badge */}
          <View style={styles.whyBookTrustBadge}>
            <IonIcon name="star" size={12} color="#ECA73C" />
            <Text style={styles.whyBookTrustText}>Trusted by 500+ happy customers in Hyderabad</Text>
          </View>
        </View>

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
            <IonIcon name="business-outline" size={18} color="#ECA73C" />
            <Text style={styles.exploreAllText}>Explore All Venues</Text>
            <IonIcon name="arrow-forward" size={16} color="#fff" />
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
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFBF5' },
  scrollView: { flex: 1, marginBottom: verticalScale(70) },

  // ── TOP BAR ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(8),
    backgroundColor: '#FFFBF5',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    gap: 5,
    elevation: 2,
    shadowColor: '#FD813B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
    marginRight: horizontalScale(10),
  },
  locationPillText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#131313',
    flex: 1,
    lineHeight: moderateScale(17),
  },
  profileBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  // ── HERO ─────────────────────────────────────────────────────────────────────
  heroWrapper: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(36),
  },
  heroBanner: {
    borderRadius: moderateScale(24),
    padding: horizontalScale(22),
    paddingBottom: verticalScale(48),
    overflow: 'hidden',
    minHeight: verticalScale(200),
    justifyContent: 'flex-end',
  },
  heroCircle1: {
    position: 'absolute',
    width: moderateScale(180),
    height: moderateScale(180),
    borderRadius: moderateScale(90),
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40,
    right: -40,
  },
  heroCircle2: {
    position: 'absolute',
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 30,
    right: 60,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(236,167,60,0.2)',
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(12),
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(236,167,60,0.35)',
  },
  heroBadgeText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#ECA73C',
  },
  heroTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(30),
    fontWeight: '800',
    color: '#fff',
    lineHeight: moderateScale(36),
    marginBottom: verticalScale(8),
  },
  heroTitleAccent: {
    width: horizontalScale(48),
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ECA73C',
    marginBottom: verticalScale(10),
  },
  heroSubtitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    color: 'rgba(255,255,255,0.8)',
    marginBottom: verticalScale(20),
  },
  heroCta: {
    alignSelf: 'flex-start',
    borderRadius: moderateScale(20),
    overflow: 'hidden',
  },
  heroCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(18),
    paddingVertical: verticalScale(10),
    gap: 7,
  },
  heroCtaText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#fff',
  },
  // floating stats card
  statsFloat: {
    position: 'absolute',
    bottom: -28,
    left: horizontalScale(16),
    right: horizontalScale(16),
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(14),
    elevation: 6,
    shadowColor: '#FD813B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#ECA73C',
  },
  statLbl: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#939393',
    marginTop: 2,
  },
  statSep: {
    width: 1,
    height: '70%',
    backgroundColor: '#F5E7B6',
    alignSelf: 'center',
  },

  // ── CATEGORIES ────────────────────────────────────────────────────────────────
  categoriesSection: {
    marginTop: verticalScale(28),
    paddingHorizontal: horizontalScale(16),
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(18),
  },
  catHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoriesTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: '#131313',
  },
  categoriesSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#939393',
    marginTop: 1,
  },
  catHeaderCrown: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    backgroundColor: 'rgba(236,167,60,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(236,167,60,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldAccentBar: {
    width: 4,
    height: moderateScale(36),
    borderRadius: 2,
    backgroundColor: '#ECA73C',
  },
  catScrollContent: {
    paddingRight: horizontalScale(16),
    gap: 12,
  },
  // ── category card ──
  catCard: {
    width: moderateScale(148),
    backgroundColor: '#fff',
    borderRadius: moderateScale(18),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  catIconArea: {
    height: verticalScale(110),
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  catIconCircle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  catTagPill: {
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(3),
  },
  catTagText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(9),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  catCardBody: {
    padding: horizontalScale(12),
    paddingTop: verticalScale(10),
  },
  catCardTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '800',
    color: '#131313',
    marginBottom: verticalScale(3),
  },
  catCardDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    color: '#939393',
    lineHeight: moderateScale(14),
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
    alignItems: 'flex-end',
    paddingHorizontal: horizontalScale(16),
    marginBottom: verticalScale(12),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: verticalScale(2),
  },
  sectionTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: '#131313',
  },
  sectionSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    color: '#939393',
    marginTop: 2,
  },
  seeAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    borderRadius: moderateScale(20),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    gap: 3,
  },
  seeAllText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#FD813B',
  },
  listPadding: {
    paddingLeft: horizontalScale(16),
    paddingRight: horizontalScale(8),
  },

  // ── HALL CARD ─────────────────────────────────────────────────────────────────
  hallCard: {
    width: moderateScale(220),
    backgroundColor: '#fff',
    borderRadius: moderateScale(20),
    marginRight: horizontalScale(12),
    marginBottom: verticalScale(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  hallImageWrapper: {
    width: '100%',
    height: verticalScale(145),
  },
  hallImage: {
    width: '100%',
    height: '100%',
  },
  hallImageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: verticalScale(70),
  },
  premiumRibbon: {
    position: 'absolute',
    top: verticalScale(10),
    left: horizontalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236,167,60,0.92)',
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(7),
    paddingVertical: verticalScale(3),
    gap: 3,
    elevation: 2,
  },
  premiumRibbonText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  cardPricePill: {
    position: 'absolute',
    bottom: verticalScale(10),
    left: horizontalScale(10),
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: moderateScale(10),
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
  },
  hallName: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#131313',
    marginBottom: verticalScale(4),
  },
  hallAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: verticalScale(8),
  },
  hallAddress: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#939393',
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  chipText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(10),
    color: '#4A4A4A',
    fontWeight: '500',
  },

  // ── DESTINATION BANNER ────────────────────────────────────────────────────────
  destBannerWrapper: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(28),
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
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
    color: '#fff',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(6),
  },
  destSub: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(12),
    color: 'rgba(255,255,255,0.6)',
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(16),
  },
  destCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#A0143E',
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
    borderRadius: moderateScale(20),
    padding: horizontalScale(18),
    borderWidth: 1,
    borderColor: '#F1F1F1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  whyBookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  whyBookHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  whyBookAccentBar: {
    width: 4,
    height: moderateScale(36),
    borderRadius: 2,
    backgroundColor: '#ECA73C',
  },
  whyBookTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: '#131313',
  },
  whyBookSubtitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#939393',
    marginTop: 2,
  },
  whyBookDiamondWrap: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    backgroundColor: 'rgba(236,167,60,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(236,167,60,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whyBookList: {
    backgroundColor: '#FAFAFA',
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  whyBookFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(13),
    gap: 12,
  },
  whyBookFeatureIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  whyBookFeatureText: { flex: 1 },
  whyBookFeatureTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#131313',
  },
  whyBookFeatureDesc: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    color: '#939393',
    marginTop: 2,
    lineHeight: moderateScale(15),
  },
  whyBookDivider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginHorizontal: horizontalScale(14),
  },
  whyBookTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: verticalScale(14),
    backgroundColor: '#FFF9EE',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(14),
    borderWidth: 1,
    borderColor: '#FFEAC1',
  },
  whyBookTrustText: {
    fontFamily: 'ManropeRegular',
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#B8860B',
  },

  // ── EXPLORE ALL CTA ───────────────────────────────────────────────────────────
  exploreAllBtn: {
    marginHorizontal: horizontalScale(16),
    marginTop: verticalScale(28),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#FD813B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    fontWeight: '800',
    color: '#fff',
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
