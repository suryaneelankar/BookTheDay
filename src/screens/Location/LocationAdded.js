import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import { useNavigation } from '@react-navigation/native';

const LocationAdded = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchProHeader}>
                <SearchIcon style={{ marginLeft: 10 }} />
                <TextInput
                    placeholderTextColor={"#7E8389"}
                    placeholder="Add a new address"
                    style={styles.textInput}
                    />
            </View>

            <TouchableOpacity style={styles.locationItem}>
                <View style={styles.locationTextContainer}>
                    <Text style={styles.locationText}>Use Current Location</Text>
                    <Text style={styles.addressText}>200 Eastern Pkwy, Brooklyn, NY 11238</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.locationItem}>
                <View style={styles.locationTextContainer}>
                    <Text style={styles.locationText}>Home</Text>
                    <Text style={styles.addressText}>29 Norman Ave, Brooklyn, NY 11222</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AddSelectLocation')} style={styles.addButton}>
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
        backgroundColor:"#F2F2F2",
        borderRadius:8,
        marginHorizontal:20
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center",
        fontSize:13,
        fontWeight:"700",
        fontFamily: 'ManropeRegular'
    },
    microphoneButton: {
        marginLeft: 10,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal:20,
        marginTop:15
    },
    locationTextContainer: {
        marginLeft: 10,
    },
    locationText: {
        fontSize: 15,
        fontWeight: '700',
        color:"#000000",
        fontFamily: 'ManropeRegular'

    },
    addressText: {
        fontSize: 12,
        color: '#7E8389',
        fontFamily: 'ManropeRegular',
        fontWeight:"700"

    },
    addButton: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 5,
        borderColor:"#D0433C",
        borderWidth:1,
        marginTop:25
    },
    addButtonText: {
        color: '#D0433C',
        fontSize: 12,
        fontFamily: 'ManropeRegular',
        fontWeight:"700"
    },
});

export default LocationAdded;
