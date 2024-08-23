import React, { useState } from 'react';
import { Button, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import { useNavigation } from '@react-navigation/native';
import LocationPicker from '../../components/LocationPicker';
import UserLocationPicker from '../../components/userLocationPicker';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const LocationAdded = () => {
    const navigation = useNavigation();
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const [userAddress, setUserAddress] = useState();
    const [labelIs, setLabelIs] = useState();
    const [addressList, setAddressList] = useState([]);


    const userLocationFetched = useSelector((state) => state.userLocation);
    console.log("user locations is::::::::::", userLocationFetched);


    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address, label) => {
        console.log('Selected Location:', location, address);
        setUserAddress(address);
        setLabelIs(label);
        setLocationPickerVisible(false);

        const newAddress = { address, label };
        setAddressList(prevAddressList => [...prevAddressList, newAddress]);
    };


    const deleteAddress = (index) => {
        setAddressList(prevAddressList =>
            prevAddressList.filter((_, i) => i !== index)
        );
    };


    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };

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

            <TouchableOpacity style={styles.locationItem}>
                <View style={styles.locationTextContainer}>
                    <Text style={styles.locationText}>Use Current Location</Text>
                    <Text style={styles.addressText}>{userLocationFetched}</Text>
                </View>
            </TouchableOpacity>

            <FlatList
                data={addressList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (

                    <TouchableOpacity style={styles.locationItem}>
                        <View style={[styles.locationTextContainer, { flexDirection: "row", alignItems: "center" }]}>
                            <View style={{ width: "85%" }} >
                                <Text style={styles.locationText}>{item?.label}</Text>
                                <Text style={styles.addressText}>{item?.address}</Text>
                            </View>
                            <TouchableOpacity onPress={() => deleteAddress(index)}>
                                <Text style={{ color: 'red' }}>Delete</Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableOpacity>
                )}
            />

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
        marginBottom: 20,
        marginHorizontal: 20,
        marginTop: 15
    },
    locationTextContainer: {
        marginLeft: 10,
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
});

export default LocationAdded;
