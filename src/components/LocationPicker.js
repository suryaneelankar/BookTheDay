// const LocationPicker = ({ onLocationSelected }) => {
//   const [region, setRegion] = useState(null);
//   const [address, setAddress] = useState('');
//   const [apartment, setApartment] = useState('');
//   const [street, setStreet] = useState('');
//   const [pinCode, setPinCode] = useState('');
//   const [label, setLabel] = useState('Home');
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [searchLocation, setSearchLocation] = useState();

//   const [completeAddress, setCompleteAddress] = useState();
//   const [subDivisionArea, setSubDivisionArea] = useState();


//   useEffect(() => {
//     getPermissions();
//   }, []);

//   const getLocation = async () => {
//     console.log("I am inside get location");
  
//     try {
//       // Get current location
//       const location = await GetLocation.getCurrentPosition({
//         enableHighAccuracy: true,
//         timeout: 60000,
//     });
  
//       console.log("Getting location picker*******", location);
  
//       if (location) {
//         const { latitude, longitude } = location;
  
//         // Update region and selected location state
//         setRegion({
//           latitude,
//           longitude,
//           latitudeDelta: 0.015,
//           longitudeDelta: 0.0121,
//         });
//         setSelectedLocation({ latitude, longitude });
  
//         // Fetch address from Google Geocode API
//         const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo'; // Replace with your Google API key
//         const response = await fetch(
//           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`
//         );
  
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
  
//         const data = await response.json();
//         console.log("Address in home::::::", JSON.stringify(data));
  
//         // Set address and postal code
//         setCompleteAddress(data?.results[0]?.formatted_address);
//         setAddress(data?.results[0]?.formatted_address);
  
//         const postalCodeComponent = data?.results[0]?.address_components.find(component =>
//           component.types.includes("postal_code")
//         );
//         setPinCode(postalCodeComponent?.long_name || "Postal code not found");
//       }
//     } catch (error) {
//       console.log("Error:", error.message);
//     }
//   };
  
//   const getPermissions = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'APP location permission',
//           message: 'App needs location Permissions',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK'
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         getLocation()
//       } else {
//         Alert.alert("Location persmiion denied")
//       }
//     } catch (err) {
//       // console.warn(err)
//     }
//   }

//   // useEffect(() => {
//   //   Geolocation.getCurrentPosition(
//   //     (position) => {
//   //       console.log("position is",position.coords)
//   //       const { latitude, longitude } = position.coords;
//   //       setRegion({
//   //         latitude,
//   //         longitude,
//   //         latitudeDelta: 0.015,
//   //         longitudeDelta: 0.0121,
//   //       });
//   //       // setSelectedLocation({ latitude, longitude });

//   //       if(latitude && longitude){

//   //               fetch(
//   //                   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//   //               )
//   //                   .then(response => response.json())
//   //                   .then(data => {
//   //                       console.log("address is::::::", data)
//   //                       setAddress(data?.address);
//   //                       setPinCode(data?.address?.postcode);

//   //                   })
//   //                   .catch(error => {
//   //                       console.error(error);
//   //                   });

//   //       }
//   //     },
//   //     (error) => {
//   //       Alert.alert('Error', 'Failed to get current location');
//   //       console.log("error::::::::", error)
//   //     },
//   //     {
//   //       enableHighAccuracy: true,
//   //       timeout: 20000, // 20 seconds timeout
//   //       maximumAge: 1000, // Accept a cached location that is at most 1 second old
//   //     }
//   //   );
//   // }, []);

//   const handleMapPress = (event) => {
//     const { latitude, longitude } = event.nativeEvent.coordinate;
//     setSelectedLocation({ latitude, longitude });
//     fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//     )
//       .then(response => response.json())
//       .then(data => {
//         console.log("address is picker comp::::::", data);
//         setCompleteAddress(data?.display_name);
//         setAddress(data?.address);
//         setPinCode(data?.address?.postcode);

//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   const handleSaveLocation = () => {
//     if (selectedLocation) {
//       onLocationSelected(selectedLocation);
//     }
//   };

//   const handleRegionChangeComplete = (region) => {
//     setRegion(region);
//     // You can also use Google Places API to get the address from coordinates
//     // For now, we just set a dummy address
//     // setAddress(`Address at (${region.latitude}, ${region.longitude})`);
//   };

//   const saveLocation = () => {
//     const locationData = {
//       address,
//       apartment,
//       street,
//       pinCode,
//       label,
//       region,
//       subDivisionArea,
//     };
//     console.log("passing data::::::", locationData, '+++++++++++++', completeAddress)
//     onLocationSelected(locationData, completeAddress);
//   };

//   return (
//     <View style={styles.container}>

      
//          <GooglePlacesAutocomplete
//           placeholder="Search for an address"
//           fetchDetails={true}
//           onChangeText={(text) =>{
//             console.log("test is::::::::::::", text);
//             setSearchLocation(text);

//           }}
//           value={searchLocation}
//           onPress={(data, details = null) => {
//             // 'details' is provided when fetchDetails = true
//             const { lat, lng } = details.geometry.location;
//             console.log("details is:::::::::", data);
//             setSearchLocation(data?.description);
//             setSubDivisionArea(data?.structured_formatting?.main_text);
//             setSelectedLocation({ latitude: lat, longitude: lng });
//             setRegion({
//               latitude: lat,
//               longitude: lng,
//               latitudeDelta: 0.015,
//               longitudeDelta: 0.0121,
//             });
//             setCompleteAddress(data?.description);
//             setPinCode(details.address_components.find(ac => ac.types.includes('postal_code'))?.long_name);
//             setStreet(details.address_components.find(ac => ac.types.includes('route'))?.long_name);
//           }}
//           onFail={(err) => {console.log('failed err is :>>',err)}}
//           query={{
//             key: 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo',
//             language: 'en', // language of the results
//           }}
//           styles={{
//             textInput: styles.input,
//           }}
//         />
        

//       {/* {region ?
//         <MapView
//           style={styles.map}
//           //   region={{
//           //     latitude: 37.78825,
//           //     longitude: -122.4324,
//           //     latitudeDelta: 0.015,
//           //     longitudeDelta: 0.0121,
//           // }}
//           region={region}
//           onPress={handleMapPress}
//           showsUserLocation={true}
//           showsMyLocationButton={true}

//         //   onRegionChangeComplete={handleRegionChangeComplete}
//         >
//           {selectedLocation && (
//             <Marker coordinate={selectedLocation} />
//           )}
//           {/* <Marker coordinate={region} /> */}

//         {/* </MapView>
//         :
//         <ActivityIndicator size={'large'} color={'#FEF7DE'} />
//       }  */}



//       <ScrollView style={styles.form}>
//         <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5 }}>Address</Text>
//         <TextInput
//           numberOfLines={3}
//           label={'address'}
//           style={[styles.input, { height: 100 }]}
//           value={completeAddress}
//           placeholder="Address"
//           editable={true}
//           multiline={true}
//         />

//         <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5 }}>Appartment</Text>
//         <TextInput
//           style={styles.input}
//           value={apartment}
//           onChangeText={setApartment}
//           placeholder="Apartment"
//         />

      

//         <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5, marginTop: 0 }}>Land Mark</Text>

//         <TextInput
//           style={[styles.input, { marginTop: 0 }]}
//           value={street}
//           onChangeText={setStreet}
//           placeholder="LandMark"
//         />

//         <Text style={{ color: "black", marginVertical: 5, paddingHorizontal: 5 }}>Pincode</Text>

//         <TextInput
//           style={styles.input}
//           value={pinCode}
//           onChangeText={setPinCode}
//           keyboardType='number-pad'
//           placeholder="Pin Code"
//         />
//         {/* <View style={styles.labels}>
//           <TouchableOpacity
//             style={[styles.label, label === 'Home' && styles.selectedLabel]}
//             onPress={() => setLabel('Home')}>
//             <Text>Home</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.label, label === 'Office' && styles.selectedLabel]}
//             onPress={() => setLabel('Office')}>
//             <Text>Office</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.label, label === 'Other' && styles.selectedLabel]}
//             onPress={() => setLabel('Other')}>
//             <Text>Other</Text>
//           </TouchableOpacity>
//         </View> */}
//         <TouchableOpacity style={styles.saveButton} onPress={saveLocation}>
//           <Text style={styles.saveButtonText}>Save Location</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

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
        console.log('data sub div is:::>>>',JSON.stringify(data));
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
    console.log('handle maps rsss::>>',JSON.stringify(data))
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
    position: 'absolute',
    top: 10,
    width: '95%',
    alignSelf: 'center',
    zIndex: 1,
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
    position: "static",
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
