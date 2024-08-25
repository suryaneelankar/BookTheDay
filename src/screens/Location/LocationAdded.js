import React, { useState, useEffect } from 'react';
import { Alert, Button, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import { useNavigation } from '@react-navigation/native';
import LocationPicker from '../../components/LocationPicker';
import UserLocationPicker from '../../components/userLocationPicker';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import { useDispatch } from 'react-redux';
import { getUserLocation } from '../../../redux/actions';

const LocationAdded = () => {
    const navigation = useNavigation();
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const [userAddress, setUserAddress] = useState();
    const [labelIs, setLabelIs] = useState();
    const [addressList, setAddressList] = useState([]);
    const dispatch = useDispatch();

    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const userLocationFetched = useSelector((state) => state.userCurrentLocation);
    console.log("user locations is::::::::::", userLocationFetched);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [selectedAddressVal,setSelectedAddressVal] = useState('');
    const [selectedCurrentAddress,setSelectedCurrentAddress] = useState(false);


    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    useEffect(() => {
        getUserAddresses();
    }, [])

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
                console.log('getUserAddresses response is::', response?.data?.data)
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
        if(selectedAddressVal?.address){
            dispatch(getUserLocation(selectedAddressVal?.address))
        }else{
            dispatch(getUserLocation(selectedAddressVal))
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Modal visible={isLocationPickerVisible} animationType="slide">
                <UserLocationPicker onLocationSelected={handleLocationSelected} />
                <Button title="Close" onPress={handleCloseLocationPicker} />
            </Modal>

            <View style={styles.searchProHeader}>
                <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                    <SearchIcon style={{}} />

                    <TextInput
                        placeholderTextColor={"#7E8389"}
                        placeholder="Add a new address"
                        style={[styles.textInput, { marginLeft: 0, height: 50 }]}
                        // value={userAddress}
                        numberOfLines={4}
                        multiline={true}
                    // onChangeText={(text) => [setLocationPickerVisible(true)]}

                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.locationItem,{borderColor: selectedCurrentAddress ? 'red' : '', borderWidth: selectedCurrentAddress ? 1 : 0, borderRadius: selectedCurrentAddress ? 10 : 0}]} onPress={() => {setSelectedAddressVal(userLocationFetched),setSelectedCurrentAddress(true)}}>
                <View style={styles.locationTextContainer}>
                    <Text style={styles.locationText}>Use Current Location</Text>
                    <Text style={styles.addressText}>{userLocationFetched}</Text>
                </View>
            </TouchableOpacity>

            <FlatList
                data={addressList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const selectedId = selectedAddressId
                    return (
                        <TouchableOpacity style={[styles.locationItem, { borderColor: selectedAddressId == item?._id ? 'red' : '', borderWidth: selectedAddressId == item?._id ? 1 : 0, borderRadius: selectedAddressId == item?._id ? 10 : 0 }]} onPress={() => { setSelectedAddressId(item?._id),setSelectedAddressVal(item) }}>
                            <View style={[styles.locationTextContainer, { flexDirection: "row", alignItems: "center" }]}>
                                <View style={{ width: "85%" }} >
                                    <Text style={styles.locationText}>{item?.addressType}</Text>
                                    <Text style={styles.addressText}>{item?.address}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteAddress(item?._id)}>
                                    <Text style={{ color: 'red' }}>Delete</Text>
                                </TouchableOpacity>

                            </View>
                        </TouchableOpacity>
                    )
                }}
            />

            <TouchableOpacity onPress={() => {saveSelectedLoaction(),navigation.goBack()}} style={[styles.addButton,{borderColor:'green'}]}>
                <Text style={styles.useButtonText}>Use This Location</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add New Location</Text>
            </TouchableOpacity>
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
        marginHorizontal: 20
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center",
        fontSize: 13,
        fontWeight: "700",
        fontFamily: 'ManropeRegular'
    },
    microphoneButton: {
        marginLeft: 10,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginTop: 25
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
