import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, StyleSheet, FlatList, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import { moderateScale, verticalScale, horizontalScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
import { formatAmount } from "../../utils/GlobalFunctions";
import OfferStikcer from '../../assets/svgs/offerSticker.svg';

const CategoriesList = ({ route }) => {
    const { catType } = route.params;
    // console.log("RECEIED TYPE IS:::", catType)
    // const CategoryType = catType == 'Jewellery' ? 'jewellery' : catType == 'Furniture' ? 'furniture' : catType == 'Events' ? 'event' : catType == 'Electronics' ? 'electronic' : catType == 'Drivers Rentals' ? 'driver' : catType == 'Clothes' ? 'cloth' : catType == 'Master Chefs' ? 'chef' : null;
    // console.log("final catetype:::::::::::", CategoryType)
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    console.log("passed cat type ::::", catType)

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllClothesJewels`);
            const filteredCategories = response?.data.filter(category => category?.categoryType === catType);
            setCategories(filteredCategories);
        } catch (error) {
            console.log("categories::::::::::", error);
        } finally {
            setLoading(false); // Set loading to false after data is fetched
        }
    }

    const navigation = useNavigation();
    // const renderItem = ({ item, index }) => {
    //     return (
    //         <TouchableOpacity
    //             onPress={() => navigation.navigate('ViewTrendingDetails', { categoryId: item?._id })}
    //             key={index} style={styles.itemView}>
    //             <Image source={{ uri: item?.catImageUrl }} style={styles.renderImage} />
    //             <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    //                 <Text style={styles.itemHeading}>{item?.name}</Text>
    //                 <Image
    //                     source={require('../../assets/wishlist.png')}
    //                     style={styles.wishListimage}
    //                 />
    //             </View>
    //             <View style={styles.priceContainer}>
    //                 <Text style={{ color: "black", fontSize: 12, fontWeight: "700" }}> ₹1000</Text>
    //                 <Text style={styles.strickedoffer}>₹800</Text>
    //                 <Text style={styles.off}> 20% off</Text>
    //             </View>

    //             <View>
    //                 <Text style={[styles.status, { color: item?.rented ? "#a85705" : "white", backgroundColor: item?.rented ? "#fabdb6" : "green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text>
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }

    const renderItem = ({ item }) => {
        const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;
        //  console.log("UPDATED IMAGE IN CATEGEROIES IS:::::::::", item?.professionalImage?.url)

        const originalPrice = item?.rentPricePerDay;
        const discountPercentage = item?.discountPercentage;
        const strikethroughPrice = discountPercentage
            ? Math.round(originalPrice * (1 + discountPercentage / 100))
            : originalPrice;

        return (
            <View style={{}}>
                <TouchableOpacity onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id })}
                    style={{ elevation: 5, width: Dimensions.get('window').width / 2.2, margin: 5, borderRadius: 8, backgroundColor: 'white', height: 'auto' }}>
                    <Image resizeMode="contain" source={{ uri: updatedImgUrl }} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, width: '100%', height: Dimensions.get('window').height / 5 }}
                    />
                    {item?.discountPercentage ?
                        <>
                            <OfferStikcer style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }} />
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 5,
                                right: 0,
                                bottom: 0,

                            }}>
                                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700", fontFamily: 'ManropeRegular' }}>{item?.discountPercentage}%</Text>
                                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700", fontFamily: 'ManropeRegular' }}>Off</Text>
                            </View>
                        </> : null}
                    <View style={{ marginTop: 15, marginHorizontal: 10 }}>
                        <Text numberOfLines={1} style={{ fontWeight: '600', color: '#000000', fontSize: 12, fontFamily: 'ManropeRegular' }}>{item?.brandName}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                            {/* <Text style={{ fontWeight: '700', color:'#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.price)}/day</Text> */}
                            <Text style={{ fontWeight: '700', color: '#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.rentPricePerDay)}/day</Text>
                            {item?.discountPercentage ?
                                <Text style={styles.strickedoffer}>{formatAmount(strikethroughPrice)}</Text>
                                : null}
                        </View>
                        <TouchableOpacity style={{ width: "100%", borderColor: "#D0433C", borderWidth: 1, borderRadius: 5, alignSelf: "center", alignItems: "center", padding: 5, marginVertical: 10 }}>
                            <Text style={{ color: "#D0433C", fontSize: 12, fontWeight: "700", fontFamily: 'ManropeRegular' }}>{item?.available ? 'Rent Now' : 'Not Available'}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    console.log("cat list render:::::::::", categories)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={[styles.headerContainer, { flexDirection: "row", }]}>
                <View style={styles.searchView}>
                    <Image source={require('../../assets/searchIcon.png')}
                        style={styles.serachIcon}
                    />
                    <TextInput
                        placeholder="Browse requirements"
                        style={styles.textInput} />
                </View>
            </View>

            <View style={{ marginBottom: "30%" }}>
                {loading ? (
                    <ActivityIndicator size="large" color={themevariable.Color_202020} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ alignSelf: "center", marginTop: 20 }}
                        data={categories}
                        renderItem={renderItem}
                    />
                )}
            </View>


        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        // height: moderateScale(65),
        width: "100%",
        paddingVertical: verticalScale(10),
        alignSelf: "center",
        justifyContent: "center"
    },
    status: {
        fontSize: 10,
        padding: 4,
        borderRadius: 5,
        marginTop: 5
    },
    searchView: {
        flexDirection: "row",
        width: "95%",
        alignSelf: "center",
        alignItems: "center",
        borderRadius: moderateScale(10),
        borderColor: themevariable.cementgray,
        backgroundColor: themevariable.cementgray,
        borderWidth: 1,
    },
    serachIcon: {
        height: moderateScale(15),
        width: moderateScale(15),
        marginLeft: horizontalScale(10),
        alignSelf: "center"
    },
    backIcon: {
        height: moderateScale(25),
        width: moderateScale(25),
        marginLeft: horizontalScale(10),
        alignSelf: "center"
    },
    renderImage: {
        width: "100%",
        height: moderateScale(220),
        borderRadius: 10
    },
    textInput: {
        marginLeft: verticalScale(15),
        alignSelf: "center"
    },
    wishListimage: {
        height: 20,
        width: 20,
        marginRight: horizontalScale(5)
    },
    titleHeader: {
        color: "black",
        fontSize: 22,
        fontWeight: "bold"
    },
    off: {
        fontSize: 13,
        color: "#ed890e",
        fontWeight: "bold"
    },
    strickedoffer: {
        fontSize: 14,
        color: "#FF00006E",
        fontWeight: "700",
        fontFamily: 'ManropeRegular',
        marginLeft: 4,
        textDecorationLine: 'line-through'
    },
    text: { fontSize: 12, textAlign: 'center' },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: verticalScale(2)
    },
    itemView: {
        padding: moderateScale(5),
        alignSelf: "center",
        width: "50%"
    },
    itemHeading: {
        fontSize: 14,
        color: "black",
        fontWeight: "500",
        width: "85%"
    },
    card: {
        marginTop: 10,
        alignItems: 'center',
        width: 120,
        // backgroundColor:"#f7f5f5"
    },
    listcard: {
        marginTop: 20,
        width: "90%",
        borderRadius: 20,
        backgroundColor: "#ECECEC",
        alignSelf: "center",
        alignItems: "center",
        height: 130, flexDirection: "row", justifyContent: "space-around"
    },
});

export default CategoriesList;

