import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentVendorLoggedInUserName } from '../../../redux/actions';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { getVendorAuthToken } from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import VendorHowItWorks from '../../components/VendorHowItWorks';
import ProfileIcon from '../../assets/vendorIcons/profileIcon.svg';
import HallImage from '../../assets/HallImage1.jpeg';
import IonIcon from 'react-native-vector-icons/Ionicons';

const VendorCategoryScreen = ({ navigation }) => {
  const vendorLoggedInMobileNum = useSelector(
    state => state.vendorLoggedInMobileNum,
  );
  const vendorLoggedInName = useSelector(state => state.vendorLoggedInName);
  const [clothJewelBookingsData, setclothJewelBookingsData] = useState([]);
  const [functionHallBookingsData, setFunctionHallBookingsData] = useState([]);
  const [cateringsBookingsData, setCateringBookingsData] = useState([]);
  const [profileData, setProfileData] = useState();
  const [totalBookings, setTotalBookings] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const deviceFCMToken = useSelector(state => state.deviceFCMToken);

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getProfileData();
      fetchBookingsOverview();
      getVendorClothJewelBookings();
      getVendorFunctionHallBookings();
      getVendorFoodCateringBookings();
      return () => console.log('Screen is unfocused');
    }, [vendorLoggedInMobileNum]),
  );

  useEffect(() => {
    const combinedData = [
      ...functionHallBookingsData,
      ...cateringsBookingsData,
      ...clothJewelBookingsData,
    ];
    setTotalBookings(combinedData?.length);
    const completedCount = combinedData.filter(
      item =>
        item?.bookingStatus === 'approved' ||
        item?.bookingStatus === 'payment successful',
    );
    const pendingCount = combinedData.filter(
      booking => booking?.bookingStatus === 'requested',
    );
    setCompleted(completedCount?.length);
    setPending(pendingCount?.length);
    storeVendorDeviceToken();
  }, [functionHallBookingsData, cateringsBookingsData, clothJewelBookingsData]);

  const storeVendorDeviceToken = async () => {
    const payload = {
      mobileNumber: String(vendorLoggedInMobileNum),
      fcmToken: deviceFCMToken,
    };
    const token = await getVendorAuthToken();
    try {
      const vendorTokenRes = await axios.post(
        `${BASE_URL}/addVendorFCMToken`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (vendorTokenRes?.status === 200) {
        console.log('Vendor token added successfully:', vendorTokenRes?.data?.message);
      }
    } catch (error) {
      console.error('Error during add vendor token:', error);
    }
  };

  const getVendorClothJewelBookings = async () => {
    const token = await getVendorAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/clothJewelBookingsGotForVendor/${vendorLoggedInMobileNum}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const activeBookings = response?.data?.data.filter(
        booking => booking.isActiveBooking === true,
      );
      setclothJewelBookingsData(activeBookings);
    } catch (error) {
      console.log('clothJewelBookingsGotForVendor error:', error);
    }
  };

  const getVendorFunctionHallBookings = async () => {
    const token = await getVendorAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/functionHallBookingsGotForVendor/${vendorLoggedInMobileNum}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const activeBookings = response?.data?.data.filter(
        booking => booking.isActiveBooking === true,
      );
      setFunctionHallBookingsData(activeBookings);
    } catch (error) {
      console.log('functionHallBookingsGotForVendor error:', error);
    }
  };

  const getVendorFoodCateringBookings = async () => {
    const token = await getVendorAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/foodCateringBookingsGotForVendor/${vendorLoggedInMobileNum}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const activeBookings = response?.data?.data.filter(
        booking => booking.isActiveBooking === true,
      );
      setCateringBookingsData(activeBookings);
    } catch (error) {
      console.log('foodCateringBookingsGotForVendor error:', error);
    }
  };

  const getProfileData = async () => {
    const token = await getVendorAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/vendor/getVendorProfile/${vendorLoggedInMobileNum}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProfileData(response?.data?.data);
      dispatch(getCurrentVendorLoggedInUserName(response?.data?.data?.fullName));
    } catch (error) {
      console.log('Profile fetch error:', error);
    }
  };

  const fetchBookingsOverview = async () => {
    const token = await getVendorAuthToken();
    try {
      await axios.get(`${BASE_URL}/vendor/bookingsOverview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log('Bookings fetch error:', error);
    }
  };

  const categoriesData = [
    {
      id: 1,
      CatImg: HallImage,
      navScreen: 'AddFunctionalHall',
      title: 'Function Halls',
      subtitle: 'Venues & Event Spaces',
      description: 'Add and manage hall listings for weddings, receptions, and corporate events.',
      icon: 'business-outline',
      features: ['Add & Edit Halls', 'Manage Bookings', 'Set Pricing'],
      catType: 'funtionHalls',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.categoryCard}>

      {/* ── Image with overlaid info ── */}
      <View style={styles.categoryImageWrapper}>
        <Image source={item.CatImg} style={styles.categoryImage} resizeMode="cover" />

        {/* Dark scrim */}
        <View style={styles.categoryScrim} />

        {/* Listing type badge */}
        <View style={styles.activeBadge}>
          <IonIcon name="business-outline" size={12} color="#FFFFFF" />
          <Text style={styles.activeBadgeText}>VENUE SERVICE</Text>
        </View>

        {/* Title + subtitle bottom-left */}
        <View style={styles.categoryImageFooter}>
          <View style={styles.categoryIconCircle}>
            <IonIcon name={item.icon} size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.categoryImageTitle}>{item.title}</Text>
            <Text style={styles.categoryImageSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={styles.categoryBody}>
        <Text style={styles.categoryDescription}>{item.description}</Text>

        {/* Service capabilities */}
        <View style={styles.chipsRow}>
          {item.features.map((f, i) => (
            <View key={i} style={styles.chip}>
              <IonIcon name="checkmark-circle" size={12} color="#059669" />
              <Text style={styles.chipText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardDivider} />

        {/* Clear, separate actions */}
        <View style={styles.ctaRow}>
          <View style={styles.ctaCopy}>
            <Text style={styles.ctaLabel}>Venue workspace</Text>
            <Text style={styles.ctaHint}>Add a venue or update an existing listing</Text>
          </View>
        </View>

        <View style={styles.categoryActions}>
          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.secondaryAction}
            onPress={() => navigation.navigate('VendorVenueListings')}>
            <IonIcon name="list-outline" size={16} color="#9A431B" />
            <Text style={styles.secondaryActionText}>My Listings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            style={styles.primaryAction}
            onPress={() =>
              navigation.navigate(item.navScreen, {
                isAadharUpdate: Boolean(profileData?.aadharImage?.url),
              })
            }>
            <IonIcon name="add" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Add Venue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#FAF7F4', '#F7F2EE']}
          style={[
            styles.background,
            pending > 0 && styles.backgroundWithPendingCard,
          ]}>

          {/* Vendor header */}
          <LinearGradient
            colors={['#7B3B20', '#A4542A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileRow}>
            <View style={styles.profileIconWrap}>
              <ProfileIcon width={42} height={42} />
            </View>

            <View style={styles.profileCopy}>
              <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
              <Text numberOfLines={1} style={styles.vendorNameText}>
                {vendorLoggedInName || 'Vendor'}
              </Text>
              <Text style={styles.vendorPhoneText}>
                +91 {vendorLoggedInMobileNum}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.listingsHeaderButton}
              onPress={() => navigation.navigate('VendorVenueListings')}
              accessibilityRole="button"
              accessibilityLabel="Open my venue listings">
              <IonIcon name="business-outline" size={18} color="#7B3518" />
              <Text style={styles.listingsHeaderText}>My Listings</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Bookings Overview */}
          <View style={styles.bookingsOverview}>
            <View style={styles.sectionHeadingRow}>
              <View>
                <Text style={[styles.sectionEyebrow, styles.bookingEyebrow]}>
                  BOOKING ACTIVITY
                </Text>
                <Text style={[styles.sectionTitle, styles.bookingTitle]}>
                  Overview
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.navigate('Events')}>
                <Text style={styles.viewAllText}>View requests</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.overviewCards}>
              <View style={[styles.overviewCard, styles.totalOverviewCard]}>
                <View style={[styles.overviewIcon, styles.totalIcon]}>
                  <IonIcon name="calendar-outline" size={16} color="#8A4A22" />
                </View>
                <Text style={styles.overviewCount}>{totalBookings}</Text>
                <Text style={styles.overviewLabel}>Total</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Events')}
                activeOpacity={0.8}
                style={[styles.overviewCard, styles.pendingOverviewCard]}>
                <View style={[styles.overviewIcon, styles.pendingIcon]}>
                  <IonIcon name="time-outline" size={16} color="#B25A1E" />
                </View>
                <Text style={styles.overviewCount}>{pending}</Text>
                <Text style={styles.overviewLabel}>Pending</Text>
              </TouchableOpacity>
              <View style={[styles.overviewCard, styles.completedOverviewCard]}>
                <View style={[styles.overviewIcon, styles.completedIcon]}>
                  <IonIcon name="checkmark-circle-outline" size={16} color="#28754A" />
                </View>
                <Text style={styles.overviewCount}>{completed}</Text>
                <Text style={styles.overviewLabel}>Completed</Text>
              </View>
            </View>
          </View>

          {/* Venue management */}
          <View style={styles.sectionHeadingRow}>
            <View>
              <Text style={styles.sectionEyebrow}>YOUR BUSINESS</Text>
              <Text style={styles.sectionTitle}>Manage venues</Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            {categoriesData.map(item => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionEyebrow}>GROW YOUR BOOKINGS</Text>
            <Text style={styles.sectionTitle}>Quick tips</Text>

            <View style={styles.tipsCard}>
              {[
                ['images-outline', 'Keep venue photos and details updated.'],
                ['flash-outline', 'Respond quickly to new booking requests.'],
                ['pricetag-outline', 'Review your pricing regularly.'],
              ].map(([icon, tip], index) => (
                <View
                  key={tip}
                  style={[
                    styles.tipRow,
                    index < 2 && styles.tipRowBorder,
                  ]}>
                  <View style={styles.tipIcon}>
                    <IonIcon name={icon} size={16} color="#A44A1F" />
                  </View>
                  <Text style={styles.tip}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* How It Works */}
          <VendorHowItWorks />

        </LinearGradient>
      </ScrollView>

      {pending > 0 && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`${pending} pending booking ${pending === 1 ? 'request' : 'requests'
            }`}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Events')}
          style={styles.pendingCardWrapper}>

          <LinearGradient
            colors={['#FFFDF9', '#FFF1E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pendingCard}>

            <View style={styles.pendingIconContainer}>
              <IonIcon
                name="notifications"
                size={22}
                color="#FD813B"
              />

              <View style={styles.pendingCountBadge}>
                <Text style={styles.pendingCountText}>
                  {pending > 9 ? '9+' : pending}
                </Text>
              </View>
            </View>

            <View style={styles.pendingCardContent}>
              <Text style={styles.pendingCardTitle}>
                {pending === 1
                  ? 'New booking request'
                  : `${pending} new booking requests`}
              </Text>

              <Text style={styles.pendingCardSubtitle}>
                Review and respond to the customer’s request.
              </Text>
            </View>

            <View style={styles.pendingArrowContainer}>
              <IonIcon
                name="arrow-forward"
                size={17}
                color="#FD813B"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#FAF7F4',
  },

  pendingCardWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,

    // Keeps it above the bottom tabs
    bottom: 78,

    borderRadius: 18,
    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#F6D6C4',

    // Floating appearance
    elevation: 10,
    shadowColor: '#7A3514',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    backgroundColor: '#FFF9F4',
  },

  pendingCard: {
    // minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 6,
  },

  pendingIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE0CF',

    elevation: 2,
    shadowColor: '#B94C16',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  pendingCountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,

    minWidth: 21,
    height: 21,
    paddingHorizontal: 4,
    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FD813B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  pendingCountText: {
    fontFamily: 'ManropeRegular',
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  pendingCardContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  pendingCardTitle: {
    fontFamily: 'ManropeRegular',
    fontSize: 13.5,
    fontWeight: '800',
    color: '#2A211D',
  },

  pendingCardSubtitle: {
    marginTop: 3,
    fontFamily: 'ManropeRegular',
    fontSize: 10.5,
    lineHeight: 14,
    color: '#786B64',
  },

  pendingArrowContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFD7C1',
  },

  backgroundWithPendingCard: {
    paddingBottom: 175,
  },
  background: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#6D3018',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#54210F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  profileIconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  profileCopy: {
    flex: 1,
    marginLeft: 10,
  },
  welcomeLabel: {
    color: '#F8D7C2',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: 'ManropeRegular',
  },
  vendorNameText: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'ManropeRegular',
    textTransform: 'capitalize',
  },
  vendorPhoneText: {
    marginTop: 1,
    fontFamily: 'LeagueSpartanRegular',
    color: '#F5D8C8',
    fontSize: 11,
  },
  listingsHeaderButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    borderRadius: 11,
    backgroundColor: '#FFF4EC',
  },
  listingsHeaderText: {
    marginTop: 2,
    color: '#783817',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  bookingsOverview: {
    marginTop: 20,
    marginBottom: 22,
    padding: 13,
    borderWidth: 1,
    borderColor: '#FFF3CD',
    borderRadius: 16,
    backgroundColor: '#FFF3CD',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionEyebrow: {
    color: '#A06E50',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
    fontFamily: 'ManropeRegular',
  },
  viewAllText: {
    color: '#7D3518',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  sectionTitle: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '800',
    color: '#312B28',
    fontFamily: 'ManropeRegular',
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewCard: {
    backgroundColor: '#FFF8F3',
    borderRadius: 13,
    paddingVertical: 11,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#DFC0AC',
    elevation: 1,
    shadowColor: '#5B3824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    minHeight: 104,
    justifyContent: 'center',
  },
  pendingOverviewCard: {
    borderColor: '#E3A574',
    backgroundColor: '#FFF8F3',
  },
  totalOverviewCard: {
    borderColor: '#D7AA8D',
    backgroundColor: '#FFF8F3',
  },
  completedOverviewCard: {
    borderColor: '#AFCDBA',
    backgroundColor: '#FFF8F3',
  },
  overviewIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    marginBottom: 5,
  },
  totalIcon: { backgroundColor: '#F8EEE8' },
  pendingIcon: { backgroundColor: '#FFF0E4' },
  completedIcon: { backgroundColor: '#EAF6EF' },
  overviewCount: {
    fontSize: 21,
    fontWeight: '800',
    color: '#713716',
    fontFamily: 'ManropeRegular',
  },
  overviewLabel: {
    marginTop: 1,
    fontSize: 10,
    color: '#5F4D43',
    textAlign: 'center',
    fontFamily: 'ManropeRegular',
  },
  bookingEyebrow: {
    color: '#8B4928',
  },
  bookingTitle: {
    color: '#4C2818',
  },
  listContainer: {
    paddingBottom: 16,
  },

  // ── CATEGORY CARD ──
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#56331F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#EDE5DF',
  },
  categoryImageWrapper: {
    position: 'relative',
  },
  categoryImage: {
    height: 150,
    width: '100%',
  },
  categoryScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(35,22,15,0.32)',
  },
  activeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40,25,17,0.44)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  activeBadgeText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 8,
    letterSpacing: 0.5,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  categoryImageFooter: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FD813B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImageTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  categoryImageSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: 'ManropeRegular',
    marginTop: 1,
  },
  categoryBody: {
    padding: 14,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#7E8389',
    fontFamily: 'ManropeRegular',
    lineHeight: 20,
    marginBottom: 11,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 11,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF6',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  chipText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginBottom: 14,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaCopy: {
    flex: 1,
  },
  ctaLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#100D25',
    fontFamily: 'ManropeRegular',
  },
  ctaHint: {
    fontSize: 11,
    color: '#8B8079',
    fontFamily: 'ManropeRegular',
    marginTop: 2,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderWidth: 1,
    borderColor: '#E8CBB8',
    borderRadius: 11,
    backgroundColor: '#FFF8F3',
  },
  secondaryActionText: {
    marginLeft: 5,
    color: '#8B3E19',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  primaryAction: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
    borderRadius: 11,
    backgroundColor: '#D96A2B',
  },
  primaryActionText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'ManropeRegular',
  },
  tipsSection: {
    marginTop: 12,
    marginBottom: 18,
  },
  tipsCard: {
    marginTop: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EDE5DF',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  tipRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDE7E2',
  },
  tipIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#FFF2E8',
  },
  tip: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#615852',
    fontFamily: 'ManropeRegular',
  },
});

export default VendorCategoryScreen;
