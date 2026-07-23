import React, {useState, useEffect} from 'react';
import {
  BackHandler,
  PermissionsAndroid,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import {getUserAuthToken} from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import {useDispatch} from 'react-redux';
import UserLocationPicker from '../../components/userLocationPicker';
import themevariable from '../../utils/themevariable';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import {getUserLocation, setUserCurrentLocation} from '../../../redux/actions';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CustomAlert from '../../components/CustomAlert';

const LocationAdded = () => {
  const navigation = useNavigation();
  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const dispatch = useDispatch();
  const userLoggedInMobileNum = useSelector(
    state => state.userLoggedInMobileNum,
  );
  const userLocationFetched = useSelector(
    state => state.userCurrentLocation,
  );
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    getUserAddresses();
  }, []);

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
        CustomAlert.alert('Permission Denied', 'Location permissions denied', undefined, {type: 'warning'});
      }
    } catch (err) {
      // console.warn(err)
    }
  };

  const handleCheckPressed = async () => {
    if (Platform.OS === 'android') {
      const checkEnabled = await isLocationEnabled();
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
        await promptForEnableLocationIfNeeded();
        getLocation();
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      if (location) {
        const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(getUserLocation(data?.results[0]));
        dispatch(setUserCurrentLocation(data?.results[0]));
      }
      setLoadingLocation(false);
    } catch (error) {
      console.error('Error: location 1', error);
      setLoadingLocation(false);
    }
  };

  const saveAddress = async (address, location, label) => {
    const token = await getUserAuthToken();
    const payload = {
      address: address,
      city: location?.address?.city,
      latitude: location?.region?.latitude,
      longitude: location?.region?.longitude,
      pinCode: location?.pinCode,
      addressType: label,
      userMobileNumber: userLoggedInMobileNum,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/addUserLocation`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response?.status == 200) {
        showSuccessAlert('"Address added successfully"');
        getUserAddresses();
      }
    } catch (error) {
      console.log('save user address data error>>::', error);
    }
  };

  const showSuccessAlert = alertText => {
    CustomAlert.alert('Confirmation', alertText, undefined, {type: 'success'});
  };

  const handleLocationSelected = (location, address, label) => {
    setLocationPickerVisible(false);
    saveAddress(address, location, label);
  };

  const deleteAddress = async addressId => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteLocationById/${userLoggedInMobileNum}/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response?.status == 200) {
        showSuccessAlert('"Address deleted successfully"');
        getUserAddresses();
      }
    } catch (error) {
      console.log('delete user address data error>>::', error);
    }
  };

  const getUserAddresses = async () => {
    const token = await getUserAuthToken();
    try {
      const response = await axios.get(
        `${BASE_URL}/getAllUserLocations/${userLoggedInMobileNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response?.data) {
        setAddressList(response?.data?.data?.userAddresses);
      }
    } catch (error) {
      console.log('get user address data error>>::', error);
    }
  };

  const handleCloseLocationPicker = () => {
    setLocationPickerVisible(false);
  };

  // Directly select and use the location (no separate "Use This Location" button)
  const selectAndUseLocation = locationVal => {
    dispatch(getUserLocation(locationVal));
    navigation.goBack();
  };

  const handleCurrentLocationPress = () => {
    if (
      userLocationFetched?.formatted_address === undefined &&
      userLocationFetched?.address === undefined
    ) {
      getPermissions();
    } else {
      // Directly use the current location
      selectAndUseLocation(userLocationFetched);
    }
  };

  const handleBackPress = () => {
    if (isLocationPickerVisible) {
      setLocationPickerVisible(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [isLocationPickerVisible]);

  return (
    <SafeAreaView style={styles.container}>
      {loadingLocation ? (
        <ActivityIndicator
          size="large"
          color={themevariable.Color_FD813B}
          animating={loadingLocation}
          style={{position: 'absolute', flex: 1, top: '50%', right: '50%'}}
        />
      ) : (
        <>
          <Modal
            visible={isLocationPickerVisible}
            animationType="slide"
            onRequestClose={() => handleCloseLocationPicker()}>
            <UserLocationPicker
              onLocationSelected={handleLocationSelected}
              onBack={handleCloseLocationPicker}
            />
          </Modal>

          {/* Header title */}
          {/* <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}>
              <IonIcon name="chevron-back" size={20} color="#1A1E25" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Location</Text>
          </View> */}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Search bar */}
          <TouchableOpacity
            onPress={() => setLocationPickerVisible(true)}
            style={styles.searchBar}>
            <SearchIcon width={15} height={15} />
            <Text style={styles.searchText}>Add a new address</Text>
          </TouchableOpacity>

          {/* Use Current Location */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={handleCurrentLocationPress}>
            <View style={styles.iconCircle}>
              <IonIcon name="navigate" size={15} color="#1A1E25" />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Use Current Location</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {userLocationFetched?.formatted_address
                  ? userLocationFetched?.formatted_address
                  : userLocationFetched?.address
                  ? userLocationFetched?.address
                  : 'Tap to detect your location'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.rowDivider} />

          {/* Saved addresses list — tap to directly select & use */}
          <FlatList
            data={addressList}
            keyExtractor={(item, index) => item?._id || index.toString()}
            ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => selectAndUseLocation(item)}>
                <View style={styles.iconCircle}>
                  <IonIcon name="location" size={15} color="#1A1E25" />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>
                    {item?.addressType}
                  </Text>
                  <Text style={styles.locationAddress} numberOfLines={1}>
                    {item?.address}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteAddress(item?._id)}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          {/* Add New Location button */}
          <TouchableOpacity
            onPress={() => setLocationPickerVisible(true)}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Location</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 20,
    color: '#1A1E25',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(126, 131, 137, 0.2)',
    marginHorizontal: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    height: 45,
    paddingHorizontal: 12,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
    color: '#7E8389',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.8)',
    fontFamily: 'ManropeRegular',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E8389',
    fontFamily: 'ManropeRegular',
  },
  rowDivider: {
    height: 0.5,
    backgroundColor: 'rgba(126, 131, 137, 0.2)',
    marginLeft: 20,
  },
  deleteText: {
    color: '#D0433C',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'ManropeRegular',
  },
  addButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 6,
    borderColor: '#D0433C',
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#D0433C',
    fontSize: 12,
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
  },
});

export default LocationAdded;
