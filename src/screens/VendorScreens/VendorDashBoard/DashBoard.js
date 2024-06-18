import React, { useEffect, useState } from "react"; { }
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Animated, FlatList } from "react-native";
import ProfileIcon from '../../../assets/vendorIcons/profileIcon.svg'
import LinearGradient from "react-native-linear-gradient";
import shirtImg from '../../../assets/shirt.png';
import axios from "axios";
import BASE_URL from "../../../apiconfig";
import { LocalHostUrl } from "../../../apiconfig";
import { formatAmount } from '../../../utils/GlobalFunctions';
import ArrowRight from '../../../assets/vendorIcons/arrowRight.svg';
import PersonOne from '../../../assets/vendorIcons/personOne.svg';
import PersonTwo from '../../../assets/vendorIcons/personTwo.svg';
import PersonThree from '../../../assets/vendorIcons/personThree.svg';
import themevariable from "../../../utils/themevariable";
import ListedTimeIcon from '../../../assets/vendorIcons/listedTimeIcon.svg';
import EditButton from '../../../assets/vendorIcons/editButton.svg';
import Avatar from "../../../components/NameAvatar";

const VendorDashBoardTab = ({ navigation }) => {

    const [allBookings, setAllBookings] = useState([]);
    const [wholeBookingData, setWholeBookingData] = useState([]);
    const [vendorListing, setVendorListings] = useState([]);
    const [driverChefBookingsData, setDriverChefBookingsData] = useState([]);

    useEffect(() => {
        getVendorClothJewelBookings();
        getVendorDriverChefBookings();
        getVendorChefDriverBookings();
        getVendorListings();
    }, [])


    const getVendorListings = async () => {
        const vendorMobileNumber = "8297735285"
        try {
            const response = await axios.get(`${BASE_URL}/getAllVendorProductsAdded/${vendorMobileNumber}`);
            // console.log("postsposts::::::::::", response?.data?.posts);
            setVendorListings(response?.data?.posts)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorDriverChefBookings = async () => {
        const vendorMobileNumber = "8297735285"
        try {
            const response = await axios.get(`${BASE_URL}/driverChefBookingsGotForVendor/${vendorMobileNumber}`);
            // console.log("setAllBookings::::::::::", response?.data?.data);
            setWholeBookingData(response?.data?.data);
            // const output = consolidateByProductId(response?.data?.data);
            // console.log('output is ::>>', output);
            // setAllBookings(output)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorClothJewelBookings = async () => {
        const vendorMobileNumber = "8297735285"
        try {
            const response = await axios.get(`${BASE_URL}/clothJewelBookingsGotForVendor/${vendorMobileNumber}`);
            // console.log("setAllBookings::::::::::", response?.data?.data);
            setWholeBookingData(response?.data?.data)
            const output = consolidateByProductId(response?.data?.data);
            // console.log('output is ::>>', output);
            setAllBookings(output)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const getVendorChefDriverBookings = async () => {
        console.log("getVendorChefDriverBookings::::::::::");
        const vendorMobileNumber = "8297735285"
        try {
            const response = await axios.get(`${BASE_URL}/driverChefBookingsGotForVendor/${vendorMobileNumber}`);
            console.log('resp driver ::>>', response?.data?.data);
            setDriverChefBookingsData(response?.data?.data);

        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const renderVendorList = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10, width: '48%', marginHorizontal: 5, alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                <View style={{ marginTop: 5, width: '100%', marginHorizontal: 5 }}>
                    <Image style={{ width: '95%', height: 200, backgroundColor: 'red', borderRadius: 10 }} source={{ uri: convertedImageUrl }} resizeMode="cover" />
                    <Text style={styles.productName}>{capitalizeFirstLetters(item?.productName)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between', width: '90%', bottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
                            <ListedTimeIcon />
                            <Text style={styles.price}>22 April</Text>
                        </View>
                        <EditButton />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderChefDriverItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 4 }}>Test </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.perDayPrice)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    function capitalizeFirstLetters(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    const renderItem = ({ item }) => {
        const convertedImageUrl = item?.professionalImage?.url !== undefined ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('RequestConfirmation', { productId: item?.productId })}
                style={{ flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: convertedImageUrl }} style={{ width: 50, height: 50 }} resizeMode="contain" />
                    <View style={{ margin: 10 }}>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500', width: Dimensions.get('window').width / 4 }}>{capitalizeFirstLetters(item?.productName)} </Text>
                        <Text style={{ color: '#1A1F36', fontFamily: 'ManropeRegular', fontWeight: '500' }}>{formatAmount(item?.perDayPrice)}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#FFF8F0', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', height: 35, borderRadius: 5, position: 'absolute', right: 10 }}>
                    <Text style={{ color: '#FD813B', marginHorizontal: 5 }}>{item?.count == 1 ? '1 Request ' : `${item?.count} Requests `}</Text>
                    {item?.count == 1 ? <PersonOne /> :
                        <>
                            <PersonOne style={{ marginRight: -10 }} />
                            <PersonTwo style={{ marginRight: -10 }} />
                            <PersonThree />
                        </>}
                    <ArrowRight style={{ marginTop: 3, marginHorizontal: 10 }} />
                </View>


            </TouchableOpacity>
        )
    }

    const consolidateByProductId = (data) => {
        const grouped = data.reduce((acc, item) => {
            if (!acc[item?.productId]) {
                acc[item?.productId] = {
                    productId: item?.productId,
                    productName: item?.productName,
                    perDayPrice: item?.perDayPrice,
                    professionalImage: item?.professionalImage,
                    count: 0
                };
            }
            acc[item?.productId].count += 1;
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const ItemSeparator = () => {
        return <View style={{ width: '80%', alignSelf: 'center', height: 1, backgroundColor: 'gray' }} />;
    };


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                <ProfileIcon style={{}} />
                <View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#1A1E25', fontFamily: 'PoppinsRegular' }}>Hi, Surya Neelankar</Text>
                    <Text style={{ fontFamily: 'LeagueSpartanRegular' }}>+91 8297735285</Text>
                </View>
            </View>


            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF3CD', '#FFDB7E']} style={{ width: '90%', alignSelf: 'center', padding: 20, borderRadius: 10, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ color: '#1A1F36', fontSize: 14, fontWeight: 700, color: '#1A1F36' }}>Total Earning:</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 40, color: '#1A1F36', }}>₹4,500</Text>
                    </View>
                    <View style={{ width: 2, height: '100%', backgroundColor: '#F9CD4F' }} />
                    <View>
                        <Text style={{ color: '#1A1F36', fontSize: 14, fontWeight: 700, color: '#1A1F36' }}>Current Listing</Text>
                        <Text style={{ fontFamily: 'ManropeRegular', fontWeight: '700', fontSize: 40, color: '#1A1F36' }}>{vendorListing?.length}</Text>
                    </View>
                </View>

            </LinearGradient>
            <ScrollView>
                <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%', marginTop: '5%' }}>Recent Request</Text>
                <View >
                    <FlatList
                        data={allBookings}
                        renderItem={renderItem}
                        contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                        ItemSeparatorComponent={ItemSeparator}
                    />
                      <FlatList
                        data={driverChefBookingsData}
                        renderItem={renderChefDriverItem}
                        contentContainerStyle={{ borderRadius: 15, marginHorizontal: '5%', margin: 15 }}
                        ItemSeparatorComponent={ItemSeparator}
                    />
                </View>
                <View style={{}}>
                    <Text style={{ fontFamily: 'ManropeRegular', fontWeight: 700, fontSize: 16, color: '#000000', marginHorizontal: '5%' }}>All Listed Products</Text>
                    <FlatList
                        data={vendorListing}
                        renderItem={renderVendorList}
                        contentContainerStyle={{ borderRadius: 15, margin: 15, bottom: 20 }}
                        numColumns={2}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    productContainer: {

    },
    productText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        fontSize: 18,
        color: themevariable.Color_202020
    },
    productImage: {
        alignSelf: 'center',
        borderRadius: 10,
        // width: 150,
        // height: 150,
        backgroundColor: 'red'
    },
    productName: {
        fontFamily: 'ManropeRegular',
        fontSize: 12,
        color: '#202020',
        width: '90%',
        margin: 5
    },
    price: {
        color: themevariable.Color_202020,
        fontWeight: '400',
        fontSize: 14,
        fontFamily: 'ManropeRegular',
        color: '#202020',
        marginHorizontal: 5,
        margin: 5
    },


})

export default VendorDashBoardTab;