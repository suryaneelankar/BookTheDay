import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, PermissionsAndroid, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location';
import BookDatesButton from './GradientButton';
import SaveLocationButton from './SaveLocationButton';
import Iconleftcircle from 'react-native-vector-icons/AntDesign';
import { height, width } from '../utils/scalingMetrics';

const UserLocationPicker = ({ onLocationSelected, onBack }) => {
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [street, setStreet] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [label, setLabel] = useState('Home');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState();

  const [completeAddress, setCompleteAddress] = useState();

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
        const { latitude, longitude } = location;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        setSelectedLocation({ latitude, longitude });

        const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCompleteAddress(data?.results[0]?.formatted_address);
        setAddress(data?.results[0]?.formatted_address);

        const postalCodeComponent = data?.results[0]?.address_components.find(component =>
          component.types.includes("postal_code")
        );
        setPinCode(postalCodeComponent?.long_name || "Postal code not found");
      }
    } catch (error) {
      console.log("Error:", error.message);
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
          buttonPositive: 'OK'
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setCompleteAddress(data?.results[0]?.formatted_address);
    setAddress(data?.results[0]?.formatted_address);

    const postalCodeComponent = data?.results[0]?.address_components.find(component =>
      component.types.includes("postal_code")
    );
    setPinCode(postalCodeComponent?.long_name || "Postal code not found");
  };

  const saveLocation = () => {
    const locationData = {
      address,
      apartment,
      street,
      pinCode,
      label,
      region,
    };
    onLocationSelected(locationData, completeAddress, label);
  };

  return (
    <View style={styles.container}>



      {region ? (
        <MapView
          style={styles.map}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="orange" />
      )}

      <View style={styles.autocompleteContainer}>


        <View style={{ marginTop: 10 }}>
          <TouchableOpacity onPress={() => onBack()}>
            <Iconleftcircle name='leftcircle' color={'#494a49'} size={33} />
          </TouchableOpacity>
        </View>

        <GooglePlacesAutocomplete
          placeholder="Search for an address"
          fetchDetails={true}
          onChangeText={(text) => {
            setSearchLocation(text);
          }}
          value={searchLocation}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setSearchLocation(data?.description);
            setSelectedLocation({ latitude: lat, longitude: lng });
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            });
            setCompleteAddress(data?.description);
            setPinCode(details.address_components.find(ac => ac.types.includes('postal_code'))?.long_name);
            setStreet(details.address_components.find(ac => ac.types.includes('route'))?.long_name);
          }}
          onFail={(err) => { console.log('Failed to fetch places:', err); }}
          query={{
            key: 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo',
            language: 'en',
          }}
          styles={{
            // container: styles.autocompleteContainer,
            textInput: styles.searchInput,
          }}
        />
      </View>


      <ScrollView style={styles.form}>
        <Text style={[styles.labelText, { marginTop: 20 }]}>Address</Text>
        <TextInput
          numberOfLines={3}
          label="address"
          style={[styles.input, { height: 100 }]}
          value={completeAddress}
          placeholder="Address"
          editable={true}
          multiline={true}
        />

        <Text style={[styles.labelText, { marginTop: 20 }]}>Pincode</Text>
        <TextInput
          style={styles.input}
          value={pinCode}
          onChangeText={setPinCode}
          placeholder="Pin Code"
        />

        <View style={styles.labels}>
          {['Home', 'Office', 'Other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.label, label === type && styles.selectedLabel]}
              onPress={() => setLabel(type)}
            >
              <Text style={styles.labelAsText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>


        <SaveLocationButton
          onPress={() => saveLocation()}
          text={'Save Location'}
          padding={10}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  autocompleteContainer: {
    // position: 'absolute',
    top: 10,
    width: '95%',
    alignSelf: 'center',
    // zIndex: 1,
    flexDirection: "row",
    // alignItems:"center"
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    bottom: 0
  },
  input: {
    height: 50,
    // borderColor: '#ccc',
    // borderWidth: 1,
    // marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F0F5FA",
  },
  searchInput: {
    height: 50,
    borderColor: '#3e423e',
    borderWidth: 0.5,
    // borderWidth: 1,
    // marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#e3e6e4",
    marginHorizontal: 5
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    width: '30%',
    alignItems: 'center',
    borderColor: "#ECBF46"
  },
  labelAsText: {
    color: "#100D25",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: 'ManropeRegular',
  },
  selectedLabel: {
    backgroundColor: '#FFE49B',
  },
  saveButton: {
    backgroundColor: '#F00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: '20%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: '20%',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labelText: {
    color: "#000000",
    marginVertical: 5,
    paddingHorizontal: 5,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: 'ManropeRegular',
  },
  backButton: {
    // position: "static",
    // top: 20,
    // left: 20,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // padding: 5,
    backgroundColor: "black",
    borderRadius: 20,
    zIndex: 1000,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserLocationPicker;
