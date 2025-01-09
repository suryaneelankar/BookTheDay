import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator, PermissionsAndroid, ScrollView, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import SaveLocationButton from './SaveLocationButton';
import Iconleftcircle from 'react-native-vector-icons/AntDesign';
import { isLocationEnabled } from 'react-native-android-location-enabler';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import themevariable from '../utils/themevariable';

const UserLocationPicker = ({ onLocationSelected, onBack }) => {
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [street, setStreet] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [label, setLabel] = useState('Home');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [onSelectLoc,setOnSelectLoc] = useState(false);
  const [searchLocation, setSearchLocation] = useState();

  const [places, setPlaces] = useState([]);

  const [completeAddress, setCompleteAddress] = useState();
  const [subDivisionArea, setSubDivisionArea] = useState();

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
        // console.log('data sub div is:::>>>', JSON.stringify(data));
        setCompleteAddress(data?.results[0]?.formatted_address);
        setAddress(data?.results[0]?.formatted_address);

        const postalCodeComponent = data?.results[0]?.address_components.find(component =>
          component.types.includes("postal_code")
        );
        setPinCode(postalCodeComponent?.long_name || "Postal code not found");

        const subDivisionAreaCodeComponent = data?.results[0]?.address_components.find(component =>
          component.types.includes("sublocality_level_1")
        );
        setSubDivisionArea(subDivisionAreaCodeComponent?.long_name || "");
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
        handleCheckPressed();
      } else {
        Alert.alert(
          'Location Permission Denied',
          'You have denied the location permission. Please enable it in your settings to use this feature.',
          [
            { text: 'OK' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );      }
    } catch (err) {
      console.warn(err);
    }
  };

  const [searchText, setSearchText] = useState('');

  // Function to fetch places from Google Places API
  const fetchPlaces = async (text) => {
    const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}&language=en`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      console.log('result is::>>', JSON.stringify(result));

      if (result?.predictions) {
        setPlaces(result?.predictions);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call fetchPlaces whenever the text changes
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length > 2) {
      fetchPlaces(text);
    } else {
      setPlaces([]); // Clear results if text length is <= 1
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
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          // The user has not accepted to enable the location services or something went wrong during the process
          // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
          // codes :
          //  - ERR00 : The user has clicked on Cancel button in the popup
          //  - ERR01 : If the Settings change are unavailable
          //  - ERR02 : If the popup has failed to open
          //  - ERR03 : Internal error
        }
      }
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
    // console.log('handle maps preeesss::>>', JSON.stringify(data))
    setCompleteAddress(data?.results[0]?.formatted_address);
    setAddress(data?.results[0]?.formatted_address);

    const postalCodeComponent = data?.results[0]?.address_components.find(component =>
      component.types.includes("postal_code")
    );

    const subDivisionAreaCodeComponent = data?.results[0]?.address_components.find(component =>
      component.types.includes("sublocality_level_1")
    );
    // sublocality_level_1
    setSubDivisionArea(subDivisionAreaCodeComponent?.long_name || "");
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
      subDivisionArea
    };
    onLocationSelected(locationData, completeAddress, label);
  };

  const fetchPlaceDetails = async (placeId) => {
    const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.result) {
        console.log('result.result is::>>>',result.result)
        const { lat, lng } = result.result.geometry.location;
        setSelectedLocation({ latitude: lat, longitude: lng });
        const name  = result?.result?.name ? `${result?.result?.name}, ` : "";
        setCompleteAddress(`${name}${result?.result?.formatted_address}`);
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
        // alert(`Latitude: ${lat}, Longitude: ${lng}`); // Display or store this data as needed
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* {console.log('places is::>>',places)} */}


      <View style={{width:"95%",marginTop: 10, flexDirection: "row", alignSelf: "center" ,alignItems:"center",justifyContent:"space-between"}}>
        <TouchableOpacity onPress={() => onBack()}>
          <Iconleftcircle name='leftcircle' color={'#494a49'} size={33} />
        </TouchableOpacity>
        <TextInput
          placeholder="Enter Location"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.locationInput}
          onFocus={() => setOnSelectLoc(false)}
        />
      </View>

      {console.log('!selectedLocation is::>>',!selectedLocation)}

      {onSelectLoc ?
        <>

          {region ? (
            <MapView
              style={styles.map}
              region={region}
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {selectedLocation && (
                <Marker coordinate={selectedLocation} />
              )}
            </MapView>
          ) : (
            <ActivityIndicator size="large" color="orange" />
          )}


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
        </>

        :
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={() => {setOnSelectLoc(true),setSearchText(item.description),fetchPlaceDetails(item.place_id)}}>
              <Text style={styles.placeText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    // flex: 1,
    height: 200,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 10,
    width: '95%',
    alignSelf: 'center',
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  placeText: {
    fontSize: 16,
    color: '#333',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    bottom: 0
  },
  input: {
    height: 90,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F0F5FA",
    color:themevariable.Color_000000,
  },
  locationInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F0F5FA",
    width: "90%",
    color:themevariable.Color_000000,
  },
  searchInput: {
    height: 50,
    borderColor: '#3e423e',
    borderWidth: 0.5,
    borderWidth: 1,
    marginBottom: 15,
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
    // zIndex: 2,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserLocationPicker;
