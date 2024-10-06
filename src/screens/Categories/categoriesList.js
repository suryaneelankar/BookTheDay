import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, StyleSheet, FlatList, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import { moderateScale, verticalScale, horizontalScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
import { formatAmount } from "../../utils/GlobalFunctions";
import OfferStikcer from '../../assets/svgs/offerSticker.svg';
import { getUserAuthToken } from "../../utils/StoreAuthToken";
import FastImage from "react-native-fast-image";

const CategoriesList = ({ route }) => {
    const { catType,componentType } = route.params;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [getUserAuth, setGetUserAuth] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [listLoading,setListingLoading] = useState(false);

    // console.log("passed cat type ::::", catType, componentType)

    useEffect(() => {
        getCategories(currentPage);
    }, []);
    const getCategories = async (page) => {
        setListingLoading(true);
        console.log('page num is ::>>>', page);
        const token = await getUserAuthToken();
        setGetUserAuth(token);
        try {
            const response = await axios.get(`${BASE_URL}/getAllClothesJewels?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const finalResponseData = Array.isArray(response?.data?.data) ? response?.data?.data : [];
    
            // If there's no data on this page, stop pagination
            if (finalResponseData.length === 0) {
                setHasMore(false);
                setListingLoading(false);
                return;
            }
    
            let filteredData = [];
            if (componentType === 'discount' || componentType === 'new') {
                filteredData = finalResponseData?.filter(category => category?.componentType === componentType);
            } else if (catType === 'jewels' || catType === 'clothes') {
                filteredData = finalResponseData?.filter(category => category?.categoryType === catType);
            } else if (catType === 'mens' || catType === 'womens') {
                filteredData = finalResponseData?.filter(category =>
                    category?.categoryType === 'clothes' && category?.genderType === catType
                );
            } else {
                filteredData = finalResponseData.filter(item => item?.jewellaryType === catType.toLowerCase());
            }
    
            // Filter out duplicates based on _id
            const uniqueItems = filteredData.filter(newItem => {
                return !categories.some(existingItem => existingItem._id === newItem._id);
            });
    
            // Append new unique items to the existing list
            setCategories((prevData) => [...prevData, ...uniqueItems]);
    
            // Update current page and stop loading more if less than 10 items were loaded
            if (finalResponseData.length < 10) {
                setHasMore(false);
            }
            setCurrentPage(page);
    
        } catch (error) {
            console.log("categories::::::::::", error);
        } finally {
            setLoading(false);
            setListingLoading(false); // Set loading to false after data is fetched
        }
    };

    const navigation = useNavigation();

    const renderItem = ({ item }) => {
        const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        // console.log('gendertype is::>>>>',item?.genderType);
        const originalPrice = item?.rentPricePerDay;
        const discountPercentage = item?.discountPercentage;
        const strikethroughPrice = discountPercentage
            ? Math.round(originalPrice * (1 + discountPercentage / 100))
            : originalPrice;

        return (
            <View style={{}}>
                <TouchableOpacity onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id,genderType: item?.genderType })}
                    style={{ elevation: 5, width: Dimensions.get('window').width / 2.2, margin: 5, borderRadius: 8, backgroundColor: 'white', height: 'auto' }}>
                    <FastImage source={{ uri: updatedImgUrl,
                        headers:{Authorization : `Bearer ${getUserAuth}`}
                     }} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, width: '100%', height: Dimensions.get('window').height / 5 }}
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
                        <Text numberOfLines={1} style={{ fontWeight: '600', color: '#000000', fontSize: 12, fontFamily: 'ManropeRegular' }}>{item?.productName}</Text>
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

    const loadMoreClothJewels = () => {
        if (hasMore && !loading && !listLoading) {
            console.log('hasmore values::>>>',hasMore,loading);
            getCategories(currentPage + 1);
        }
    };

    // console.log("cat list render:::::::::", categories)

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

            <View style={{ marginBottom: "10%" }}>
                <Text style={{alignSelf:'center'}}>{categories?.length} products</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={themevariable.Color_202020} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ marginVertical: 10,marginHorizontal:15,paddingBottom:verticalScale(50) }}
                        data={categories}
                        renderItem={renderItem}
                        onEndReached={loadMoreClothJewels} // Fetch more when list ends
                        onEndReachedThreshold={0.5} // Trigger when user scrolls near the bottom
                        ListFooterComponent={() =>
                            listLoading ? <ActivityIndicator size="large" color="orange" /> : null
                        }
                        ListEmptyComponent={
                            <View >
                              <Text>No Products Available</Text>
                            </View>
                          }
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

