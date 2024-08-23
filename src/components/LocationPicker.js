import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, PermissionsAndroid, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location'

const LocationPicker = ({ onLocationSelected }) => {
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
    console.log("iam inside get location")
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log("getting location", location);
        if (location) {
          let latitude = location?.latitude;
          let longitude = location?.longitude;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
          setSelectedLocation({ latitude, longitude });

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
          )
            .then(response => response.json())
            .then(data => {
              setCompleteAddress(data?.display_name)
              // console.log("address is::::::", data)
              setAddress(data?.address);
              setPinCode(data?.address?.postcode);

            })
            .catch(error => {
              console.error(error);
            });
        }
      })
      .catch(error => {
        const { code, message } = error;
        console.log(code, message);
      })

  }

  const getPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'APP location permission',
          message: 'App needs location Permissions',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation()
      } else {
        Alert.alert("Location persmiion denied")
      }
    } catch (err) {
      // console.warn(err)
    }
  }

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log("position is",position.coords)
  //       const { latitude, longitude } = position.coords;
  //       setRegion({
  //         latitude,
  //         longitude,
  //         latitudeDelta: 0.015,
  //         longitudeDelta: 0.0121,
  //       });
  //       // setSelectedLocation({ latitude, longitude });

  //       if(latitude && longitude){

  //               fetch(
  //                   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //               )
  //                   .then(response => response.json())
  //                   .then(data => {
  //                       console.log("address is::::::", data)
  //                       setAddress(data?.address);
  //                       setPinCode(data?.address?.postcode);

  //                   })
  //                   .catch(error => {
  //                       console.error(error);
  //                   });

  //       }
  //     },
  //     (error) => {
  //       Alert.alert('Error', 'Failed to get current location');
  //       console.log("error::::::::", error)
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 20000, // 20 seconds timeout
  //       maximumAge: 1000, // Accept a cached location that is at most 1 second old
  //     }
  //   );
  // }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
      .then(response => response.json())
      .then(data => {
        console.log("address is::::::", data);
        setCompleteAddress(data?.display_name);
        setAddress(data?.address);
        setPinCode(data?.address?.postcode);

      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  const handleRegionChangeComplete = (region) => {
    setRegion(region);
    // You can also use Google Places API to get the address from coordinates
    // For now, we just set a dummy address
    // setAddress(`Address at (${region.latitude}, ${region.longitude})`);
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
    onLocationSelected(locationData, completeAddress);
  };

  return (
    <View style={styles.container}>

      
         <GooglePlacesAutocomplete
          placeholder="Search for an address"
          fetchDetails={true}
          onChangeText={(text) =>{
            console.log("test is::::::::::::", text);
            setSearchLocation(text);

          }}
          value={searchLocation}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            const { lat, lng } = details.geometry.location;
            console.log("details is:::::::::", data);
            setSearchLocation(data?.description);

            setSelectedLocation({ latitude: lat, longitude: lng });
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            });
            setCompleteAddress(data?.description);
            setPinCode(details.address_components.find(ac => ac.types.includes('postal_code')).long_name);
            setStreet(details.address_components.find(ac => ac.types.includes('route')).long_name);
          }}
          onFail={(err) => {console.log('failed err is :>>',err)}}
          query={{
            key: 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo',
            language: 'en', // language of the results
          }}
          styles={{
            textInput: styles.input,
          }}
        />
        

      {region ?
        <MapView
          style={styles.map}
          //   region={{
          //     latitude: 37.78825,
          //     longitude: -122.4324,
          //     latitudeDelta: 0.015,
          //     longitudeDelta: 0.0121,
          // }}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}

        //   onRegionChangeComplete={handleRegionChangeComplete}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
          {/* <Marker coordinate={region} /> */}

        </MapView>
        :
        <ActivityIndicator size={'large'} color={'orange'} />
      }



      <ScrollView style={styles.form}>
        <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5 }}>Address</Text>
        <TextInput
          numberOfLines={3}
          label={'address'}
          style={[styles.input, { height: 100 }]}
          value={completeAddress}
          placeholder="Address"
          editable={true}
          multiline={true}
        />

        <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5 }}>Appartment</Text>
        <TextInput
          style={styles.input}
          value={apartment}
          onChangeText={setApartment}
          placeholder="Apartment"
        />

      

        <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5, marginTop: 0 }}>Land Mark</Text>

        <TextInput
          style={[styles.input, { marginTop: 0 }]}
          value={street}
          onChangeText={setStreet}
          placeholder="LandMark"
        />

        <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5 }}>Pincode</Text>

        <TextInput
          style={styles.input}
          value={pinCode}
          onChangeText={setPinCode}
          placeholder="Pin Code"
        />
        {/* <View style={styles.labels}>
          <TouchableOpacity
            style={[styles.label, label === 'Home' && styles.selectedLabel]}
            onPress={() => setLabel('Home')}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.label, label === 'Office' && styles.selectedLabel]}
            onPress={() => setLabel('Office')}>
            <Text>Office</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.label, label === 'Other' && styles.selectedLabel]}
            onPress={() => setLabel('Other')}>
            <Text>Other</Text>
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
          <Text style={styles.saveButtonText}>Save Location</Text>
        </TouchableOpacity>
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
  form: {
    flex:1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  label: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    width: '30%',
    alignItems: 'center',
  },
  selectedLabel: {
    backgroundColor: 'gold',
  },
  saveButton: {
    backgroundColor: '#F00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom:"20%"
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LocationPicker;