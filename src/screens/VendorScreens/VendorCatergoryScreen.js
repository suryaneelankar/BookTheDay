import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getCurrentVendorLoggedInUserName} from '../../../redux/actions';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {getVendorAuthToken} from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import VendorHowItWorks from '../../components/VendorHowItWorks';
import ProfileIcon from '../../assets/vendorIcons/profileIcon.svg';
import HallImage from '../../assets/HallImage1.jpeg';
import IonIcon from 'react-native-vector-icons/Ionicons';

const VendorCategoryScreen = ({navigation}) => {
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
        {headers: {Authorization: `Bearer ${token}`}},
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
        {headers: {Authorization: `Bearer ${token}`}},
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
        {headers: {Authorization: `Bearer ${token}`}},
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
        {headers: {Authorization: `Bearer ${token}`}},
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
        {headers: {Authorization: `Bearer ${token}`}},
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
        headers: {Authorization: `Bearer ${token}`},
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.88}
      onPress={() =>
        navigation.navigate(item.navScreen, {
          isAadharUpdate: profileData?.aadharImage?.url ? true : false,
        })
      }>

      {/* ── Image with overlaid info ── */}
      <View style={styles.categoryImageWrapper}>
        <Image source={item.CatImg} style={styles.categoryImage} resizeMode="cover" />

        {/* Dark scrim */}
        <View style={styles.categoryScrim} />

        {/* Active badge top-right */}
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeBadgeText}>Active</Text>
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

        {/* Feature chips */}
        <View style={styles.chipsRow}>
          {item.features.map((f, i) => (
            <View key={i} style={styles.chip}>
              <IonIcon name="checkmark-circle" size={12} color="#059669" />
              <Text style={styles.chipText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* CTA row */}
        <View style={styles.ctaRow}>
          <View>
            <Text style={styles.ctaLabel}>Ready to manage?</Text>
            <Text style={styles.ctaHint}>Tap to open your listings</Text>
          </View>
          <View style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>Open</Text>
            <IonIcon name="arrow-forward" size={14} color="#fff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={['#FFF7E7', '#FFF7E7']}
        style={styles.background}>

        {/* Profile Header */}
        <View style={styles.profileRow}>
          <ProfileIcon />
          <View style={{flex: 1}}>
            <Text numberOfLines={2} style={styles.vendorNameText}>
              Hi, {vendorLoggedInName}
            </Text>
            <Text style={styles.vendorPhoneText}>
              +91 {vendorLoggedInMobileNum}
            </Text>
          </View>
        </View>

        {/* Bookings Overview */}
        <View style={styles.bookingsOverview}>
          <View style={styles.overviewCards}>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewCount}>{totalBookings}</Text>
              <Text style={styles.overviewLabel}>Total Bookings</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Events')}
              style={styles.overviewCard}>
              <Text style={styles.overviewCount}>{pending}</Text>
              <Text style={styles.overviewLabel}>Pending</Text>
            </TouchableOpacity>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewCount}>{completed}</Text>
              <Text style={styles.overviewLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Vendor Categories */}
        <Text style={styles.sectionTitle}>Vendor Categories</Text>
        <FlatList
          data={categoriesData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />

        {/* Quick Tips */}
        <View>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <Text style={styles.tip}>
            1. Update your profile regularly to attract more customers.
          </Text>
          <Text style={styles.tip}>
            2. Respond to inquiries quickly to improve customer satisfaction.
          </Text>
          <Text style={styles.tip}>
            3. Keep your pricing competitive for better conversions.
          </Text>
        </View>

        {/* How It Works */}
        <VendorHowItWorks />

      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -15,
  },
  vendorNameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1E25',
    fontFamily: 'PoppinsRegular',
    textTransform: 'capitalize',
  },
  vendorPhoneText: {
    fontFamily: 'LeagueSpartanRegular',
    color: '#333333',
  },
  bookingsOverview: {
    marginTop: 25,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'ManropeRegular',
    marginBottom: 10,
  },
  overviewCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 100,
    justifyContent: 'center',
  },
  overviewCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FD813B',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'ManropeRegular',
  },
  listContainer: {
    paddingBottom: 20,
  },

  // ── CATEGORY CARD ──
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.09,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  categoryImageWrapper: {
    position: 'relative',
  },
  categoryImage: {
    height: 175,
    width: '100%',
  },
  categoryScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,20,0.38)',
  },
  activeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 11,
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
    padding: 16,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#7E8389',
    fontFamily: 'ManropeRegular',
    lineHeight: 20,
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  chipText: {
    fontSize: 12,
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
  ctaLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#100D25',
    fontFamily: 'ManropeRegular',
  },
  ctaHint: {
    fontSize: 11,
    color: '#ABABAB',
    fontFamily: 'ManropeRegular',
    marginTop: 2,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FD813B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },

  tip: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
    fontFamily: 'ManropeRegular',
    marginHorizontal: 10,
  },
});

export default VendorCategoryScreen;
