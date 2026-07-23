import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import SaveLocationButton from './SaveLocationButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {isLocationEnabled} from 'react-native-android-location-enabler';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import CustomAlert from './CustomAlert';

const UserLocationPicker = ({onLocationSelected, onBack}) => {
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [street, setStreet] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [label, setLabel] = useState('Home');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [onSelectLoc, setOnSelectLoc] = useState(false);
  const [places, setPlaces] = useState([]);
  const [completeAddress, setCompleteAddress] = useState();
  const [subDivisionArea, setSubDivisionArea] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getPermissions();
  }, []);

  const getLocation = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      if (location) {
        const {latitude, longitude} = location;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        setSelectedLocation({latitude, longitude});

        const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCompleteAddress(data?.results[0]?.formatted_address);
        setAddress(data?.results[0]?.formatted_address);

        const postalCodeComponent =
          data?.results[0]?.address_components.find(component =>
            component.types.includes('postal_code'),
          );
        setPinCode(postalCodeComponent?.long_name || 'Postal code not found');

        const subDivisionAreaCodeComponent =
          data?.results[0]?.address_components.find(component =>
            component.types.includes('sublocality_level_1'),
          );
        setSubDivisionArea(subDivisionAreaCodeComponent?.long_name || '');
      }
    } catch (error) {
      console.log('Error:', error.message);
      getPermissions();
    }
  };

  const getPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Location Permission',
          message: 'App needs location permissions',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleCheckPressed();
      } else {
        CustomAlert.alert('Permission Denied', 'Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPlaces = async text => {
    const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}&language=en`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result?.predictions) {
        setPlaces(result?.predictions);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = text => {
    setSearchText(text);
    if (text.length > 2) {
      fetchPlaces(text);
    } else {
      setPlaces([]);
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

  const handleMapPress = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});

    const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setCompleteAddress(data?.results[0]?.formatted_address);
    setAddress(data?.results[0]?.formatted_address);

    const postalCodeComponent =
      data?.results[0]?.address_components.find(component =>
        component.types.includes('postal_code'),
      );

    const subDivisionAreaCodeComponent =
      data?.results[0]?.address_components.find(component =>
        component.types.includes('sublocality_level_1'),
      );
    setSubDivisionArea(subDivisionAreaCodeComponent?.long_name || '');
    setPinCode(postalCodeComponent?.long_name || 'Postal code not found');
  };

  const saveLocation = () => {
    const locationData = {
      address,
      apartment,
      street,
      pinCode,
      label,
      region,
      subDivisionArea,
    };
    onLocationSelected(locationData, completeAddress, label);
  };

  const fetchPlaceDetails = async placeId => {
    const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.result) {
        const {lat, lng} = result.result.geometry.location;
        setSelectedLocation({latitude: lat, longitude: lng});
        const name = result?.result?.name
          ? `${result?.result?.name}, `
          : '';
        setCompleteAddress(`${name}${result?.result?.formatted_address}`);
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });

        const addressComponents = result.result.address_components;

        const postalCodeComponent = addressComponents.find(component =>
          component.types.includes('postal_code'),
        );
        setPinCode(postalCodeComponent?.long_name || 'Postal code not found');

        const subDivisionAreaCodeComponent = addressComponents.find(
          component => component.types.includes('sublocality_level_1'),
        );
        setSubDivisionArea(subDivisionAreaCodeComponent?.long_name || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const labelIcons = {
    Home: 'home-outline',
    Office: 'briefcase-outline',
    Other: 'location-outline',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBack()} style={styles.backBtn}>
          <IonIcon name="chevron-back" size={22} color="#1A1E25" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Location</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IonIcon
          name="search-outline"
          size={16}
          color="#7E8389"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search for area, street name..."
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor="#7E8389"
          onFocus={() => setOnSelectLoc(false)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText('');
              setPlaces([]);
            }}>
            <IonIcon name="close-circle" size={18} color="#7E8389" />
          </TouchableOpacity>
        )}
      </View>

      {onSelectLoc ? (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Map */}
          {region ? (
            <MapView
              style={styles.map}
              region={region}
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={true}>
              {selectedLocation && <Marker coordinate={selectedLocation} />}
            </MapView>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FD813B" />
              <Text style={styles.loadingText}>Fetching location...</Text>
            </View>
          )}

          {/* Form */}
          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled">
            {/* Address */}
            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              numberOfLines={3}
              style={styles.addressInput}
              value={completeAddress}
              onChangeText={setCompleteAddress}
              placeholder="Address"
              editable={true}
              multiline={true}
              placeholderTextColor="#7E8389"
            />

            {/* Pincode */}
            <Text style={styles.fieldLabel}>Pincode</Text>
            <TextInput
              style={styles.pincodeInput}
              value={pinCode}
              onChangeText={setPinCode}
              placeholder="Pin Code"
              placeholderTextColor="#7E8389"
              keyboardType="numeric"
            />

            {/* Label selector */}
            <Text style={styles.fieldLabel}>Save As</Text>
            <View style={styles.labelsRow}>
              {['Home', 'Office', 'Other'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.labelChip,
                    label === type && styles.labelChipSelected,
                  ]}
                  onPress={() => setLabel(type)}>
                  <IonIcon
                    name={labelIcons[type]}
                    size={14}
                    color={label === type ? '#1A1E25' : '#7E8389'}
                    style={{marginRight: 6}}
                  />
                  <Text
                    style={[
                      styles.labelChipText,
                      label === type && styles.labelChipTextSelected,
                    ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Save button */}
            <SaveLocationButton
              onPress={() => saveLocation()}
              text="Save Location"
              padding={10}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <>
          {/* Get Current Location */}
          <TouchableOpacity
            onPress={() => setOnSelectLoc(true)}
            style={styles.currentLocRow}>
            <View style={styles.currentLocIcon}>
              <IonIcon name="navigate" size={16} color="#FD813B" />
            </View>
            <Text style={styles.currentLocText}>Get Current Location</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Search results */}
          <FlatList
            data={places}
            keyExtractor={item => item.place_id}
            ItemSeparatorComponent={() => <View style={styles.listDivider} />}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => {
                  setOnSelectLoc(true);
                  setSearchText(item.description);
                  fetchPlaceDetails(item.place_id);
                }}>
                <View style={styles.placeIconCircle}>
                  <IonIcon name="location" size={14} color="#1A1E25" />
                </View>
                <Text style={styles.placeText} numberOfLines={2}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    height: 45,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
    paddingVertical: 0,
  },
  // Current location row
  currentLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  currentLocIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLocText: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 15,
    color: '#FD813B',
  },
  // Place items
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  placeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
    lineHeight: 18,
  },
  listDivider: {
    height: 0.5,
    backgroundColor: 'rgba(126, 131, 137, 0.15)',
    marginLeft: 64,
  },
  // Map
  map: {
    height: 200,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#7E8389',
    fontFamily: 'ManropeRegular',
  },
  // Form
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  fieldLabel: {
    fontFamily: 'ManropeRegular',
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1E25',
    marginBottom: 8,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: 'rgba(126, 131, 137, 0.3)',
    borderRadius: 10,
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  pincodeInput: {
    borderWidth: 1,
    borderColor: 'rgba(126, 131, 137, 0.3)',
    borderRadius: 10,
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'ManropeRegular',
    color: '#1A1E25',
    height: 45,
    marginBottom: 16,
  },
  // Labels
  labelsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 10,
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 131, 137, 0.3)',
    borderRadius: 20,
  },
  labelChipSelected: {
    backgroundColor: '#FEF8EB',
    borderColor: '#ECBF46',
  },
  labelChipText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'ManropeRegular',
    color: '#7E8389',
  },
  labelChipTextSelected: {
    color: '#1A1E25',
  },
});

export default UserLocationPicker;
