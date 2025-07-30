import React, { useState, useEffect } from 'react';
import { Alert, BackHandler, Button, PermissionsAndroid, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import GetLocation from 'react-native-get-location'
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import { useDispatch } from 'react-redux';
import UserLocationPicker from '../../components/userLocationPicker';
import themevariable from '../../utils/themevariable';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { getUserLocation, setUserCurrentLocation } from "../../../redux/actions";
import { isLocationEnabled } from 'react-native-android-location-enabler';

const LocationAdded = () => {
    const navigation = useNavigation();
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const [userAddress, setUserAddress] = useState();
    const [labelIs, setLabelIs] = useState();
    const [addressList, setAddressList] = useState([]);
    const dispatch = useDispatch();
    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const userLocationFetched = useSelector((state) => state.userCurrentLocation);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [selectedAddressVal, setSelectedAddressVal] = useState('');
    const [selectedCurrentAddress, setSelectedCurrentAddress] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        getUserAddresses();
    }, [])

    const getPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'BookTheDay location permission',
                    message: 'App needs location Permissions',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK'
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                handleCheckPressed();
                // getLocation()
            } else {
                Alert.alert("Location permissions denied")
            }
        } catch (err) {
            // console.warn(err)
        }
    }

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


    const getLocation = async () => {
        setLoadingLocation(true);
        // Check if location services are enabled
        try {
            const location = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            });
            console.log("getting location", location);

            if (location) {
                const apiKey = 'AIzaSyC9nx4lgaP6QuoLMbyIlA_On-IRZkFLbRo';  // Replace with your Google API key
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                // console.log("address in home::::::", JSON.stringify(data));
                // setAddress(data?.results[0]?.formatted_address);
                dispatch(getUserLocation(data?.results[0]));
                dispatch(setUserCurrentLocation(data?.results[0]));
            }
            setLoadingLocation(false);
        } catch (error) {
            console.error("Error: location 1", error);
            setLoadingLocation(false);
        }
    };

    const saveAddress = async (address, location, label) => {
        console.log('address added to user api::>>', address, location);
        const token = await getUserAuthToken();
        const payload = {
            "address": address,
            "city": location?.address?.city,
            "latitude": location?.region?.latitude,
            "longitude": location?.region?.longitude,
            "pinCode": location?.pinCode,
            "addressType": label,
            "userMobileNumber": userLoggedInMobileNum
        }
        try {
            const response = await axios.post(`${BASE_URL}/addUserLocation`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response?.status == 200) {
                showSuccessAlert('"Address added successfully"');
                getUserAddresses();
            }
        } catch (error) {
            console.log("save user address data error>>::", error);
        }
    }

    const showSuccessAlert = (alertText) => {
        Alert.alert(
            "Confirmation",
            alertText,
            [
                { text: "Ok", onPress: () => { } }
            ],
            { cancelable: false }
        );
    }

    const handleLocationSelected = (location, address, label) => {
        console.log('Selected Location:', location);
        console.log('address is::>>', address);
        setUserAddress(address);
        setLabelIs(label);
        setLocationPickerVisible(false);
        saveAddress(address, location, label)
        const newAddress = { address, label };
        // setAddressList(prevAddressList => [...prevAddressList, newAddress]);
    };


    const deleteAddress = async (addressId) => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.delete(`${BASE_URL}/deleteLocationById/${userLoggedInMobileNum}/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response?.status == 200) {
                showSuccessAlert('"Address deleted successfully"')
                getUserAddresses();
            }
        } catch (error) {
            console.log("delete user address data error>>::", error);
        }
    };

    const getUserAddresses = async () => {
        const token = await getUserAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllUserLocations/${userLoggedInMobileNum}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response?.data) {
                // console.log('getUserAddresses response is::', response?.data?.data)
                setAddressList(response?.data?.data?.userAddresses);
            }
        } catch (error) {
            console.log("get user address data error>>::", error);
        }
    }

    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };

    const saveSelectedLoaction = () => {
        // if(selectedAddressVal?.address){
        //     dispatch(getUserLocation(selectedAddressVal?.address))
        // }else{
        dispatch(getUserLocation(selectedAddressVal))
        // }
    }

    const handleBackPress = () => {
        if (isLocationPickerVisible) {
            setLocationPickerVisible(false);
            // Close the modal
            return true; // Prevent default back button behavior (i.e., exiting the app)
        }
        return false;  // Allow default behavior (i.e., exiting the app if the modal is not open)
    };

    useEffect(() => {
        // Add listener when the component is mounted
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Clean up the listener when the component is unmounted
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [isLocationPickerVisible]);

    return (
        <SafeAreaView style={styles.container}>
            {loadingLocation ? (
                <ActivityIndicator size="large" color={themevariable.Color_FD813B} animating={loadingLocation} style={{ position: "absolute", flex: 1, top: "50%",right:"50%" }} />
            ) :
                <>
                    <Modal visible={isLocationPickerVisible} animationType="slide"
                        onRequestClose={() => handleCloseLocationPicker()}>
                        <UserLocationPicker
                            onLocationSelected={handleLocationSelected}
                            onBack={handleCloseLocationPicker} />
                        {/* <Button title="Close" onPress={handleCloseLocationPicker} /> */}
                    </Modal>

                    <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={styles.searchProHeader}>
                        <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                            <SearchIcon style={{}} />
                            <Text style={[styles.textInput, {}]}>
                                Add a new address
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.locationItem, { borderColor: selectedCurrentAddress ? '#FD813B' : '', borderWidth: selectedCurrentAddress ? 1 : 0, borderRadius: selectedCurrentAddress ? 10 : 0, backgroundColor: selectedCurrentAddress ? '#FEF7DE' : "white" }]}
                        onPress={() => {
                            if (userLocationFetched) {
                                setSelectedAddressVal(userLocationFetched), setSelectedCurrentAddress(true), setSelectedAddressId('');
                            } else {
                                setSelectedAddressVal(userLocationFetched), setSelectedCurrentAddress(false), setSelectedAddressId('');
                            }
                            console.log("exec userLocationFetched", userLocationFetched?.formatted_address, userLocationFetched?.address);
                            if (userLocationFetched?.formatted_address === undefined && userLocationFetched?.address === undefined) {
                                console.log("exec userLocationFetched", userLocationFetched);
                                getPermissions();
                            }
                        }}>
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationText}>Use Current Location</Text>
                            <Text style={styles.addressText}>{userLocationFetched?.formatted_address ? userLocationFetched?.formatted_address : userLocationFetched?.address ? userLocationFetched?.address : 'No Location selected'}</Text>
                        </View>
                    </TouchableOpacity>

                    <FlatList
                        data={addressList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            const selectedId = selectedAddressId
                            return (
                                <TouchableOpacity style={[styles.locationItem, { borderColor: selectedAddressId == item?._id ? '#FD813B' : '', borderWidth: selectedAddressId == item?._id ? 1 : 0, borderRadius: selectedAddressId == item?._id ? 10 : 0, backgroundColor: selectedAddressId == item?._id ? '#FEF7DE' : "white" }]}
                                    onPress={() => {
                                        setSelectedAddressId(item?._id), setSelectedAddressVal(item), setSelectedCurrentAddress(false);
                                    }}>
                                    <View style={[styles.locationTextContainer, { flexDirection: "row", alignItems: "center" }]}>
                                        <View style={{ width: "85%" }} >
                                            <Text style={styles.locationText}>{item?.addressType}</Text>
                                            <Text style={styles.addressText}>{item?.address}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteAddress(item?._id)}>
                                            <Text style={{ color: 'red', fontSize: 13, fontWeight: "500" }}>Delete</Text>
                                        </TouchableOpacity>

                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />

                    <TouchableOpacity
                        disabled={!selectedAddressId && !selectedCurrentAddress}
                        onPress={() => { saveSelectedLoaction(), navigation.goBack() }}
                        style={[styles.addButton, { borderColor: (!selectedAddressId && !selectedCurrentAddress) ? '#666666' : 'green' }]}>
                        <Text style={[styles.useButtonText, { color: (!selectedAddressId && !selectedCurrentAddress) ? '#666666' : 'green' }]}>Use This Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={[styles.addButton, { marginBottom: 20 }]}>
                        <Text style={styles.addButtonText}>Add New Location</Text>
                    </TouchableOpacity>
                </>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    searchProduct: {
        height: 45,
        backgroundColor: "#FFFFFF",
        width: "85%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        borderColor: "#FFFFFF",
        borderWidth: 0.8
    },
    searchProHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        borderRadius: 8,
        marginHorizontal: 20,
        height: 45
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center",
        fontSize: 13,
        fontWeight: "600",
        fontFamily: 'ManropeSemiBold',
        color: "#7E8389"
    },
    microphoneButton: {
        marginLeft: 10,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        // marginBottom: 20,
        marginHorizontal: 20,
        // marginTop: 15
    },
    locationTextContainer: {
        padding: 10,
    },
    locationText: {
        fontSize: 15,
        fontWeight: '700',
        color: "#000000",
        fontFamily: 'ManropeRegular'

    },
    addressText: {
        fontSize: 12,
        color: '#7E8389',
        fontFamily: 'ManropeRegular',
        fontWeight: "700"

    },
    addButton: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 5,
        borderColor: "#D0433C",
        borderWidth: 1,
        marginTop: 15
    },
    addButtonText: {
        color: '#D0433C',
        fontSize: 12,
        fontFamily: 'ManropeRegular',
        fontWeight: "700"
    },
    useButtonText: {
        color: 'green',
        fontSize: 12,
        fontFamily: 'ManropeRegular',
        fontWeight: "700"
    },
});

export default LocationAdded;
