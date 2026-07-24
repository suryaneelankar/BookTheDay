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
import RightSideIcon from '../../assets/profilesvgs/zoomRight.svg';
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
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (vendorTokenRes?.status === 200) {
        console.log(
          'Vendor token added successfully:',
          vendorTokenRes?.data?.message,
        );
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
        {
          headers: {Authorization: `Bearer ${token}`},
        },
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
        {
          headers: {Authorization: `Bearer ${token}`},
        },
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
        {
          headers: {Authorization: `Bearer ${token}`},
        },
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
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setProfileData(response?.data?.data);
      dispatch(
        getCurrentVendorLoggedInUserName(response?.data?.data?.fullName),
      );
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
      title: 'Add Function Hall',
      description: 'Manage listings for events, celebrations, and weddings.',
      catType: 'funtionHalls',
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate(item.navScreen, {
            isAadharUpdate: profileData?.aadharImage?.url ? true : false,
          });
        }}>
        <Image
          source={item.CatImg}
          style={styles.categoryImage}
        />
        <View style={styles.categoryBottom}>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Text style={styles.categoryDescription}>{item.description}</Text>
            <View style={styles.categoryCtaRow}>
              <Text style={styles.categoryCtaText}>Manage</Text>
            </View>
          </View>
          <View style={styles.categoryChevron}>
            <IonIcon name="chevron-forward" size={20} color="#FD813B" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderColor: '#EDEDED',
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryImage: {
    height: 140,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  categoryBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryChevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF2CF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1E25',
    marginBottom: 4,
    fontFamily: 'ManropeRegular',
  },
  categoryDescription: {
    fontSize: 13,
    color: '#7E8389',
    fontFamily: 'ManropeRegular',
    marginBottom: 12,
  },
  categoryCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FD813B',
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
