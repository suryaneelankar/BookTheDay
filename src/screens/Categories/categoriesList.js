import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, FlatList, Image, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    const [loading, setLoading] = useState(false); // Add loading state
    const [getUserAuth, setGetUserAuth] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [listLoading,setListingLoading] = useState(false);

    useEffect(() => {
        getCategories(currentPage);
    }, []);
    const getCategories = async (page) => {
        setLoading(true);
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
            setLoading(false);
            setListingLoading(false);
            // If there's no data on this page, stop pagination
            if (finalResponseData?.length === 0) {
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
            setLoading(false);
            setListingLoading(false);
            console.log("categories error::::::::::", error);
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
                        <TouchableOpacity onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id,genderType: item?.genderType })} style={{ width: "100%", borderColor: "#D0433C", borderWidth: 1, borderRadius: 5, alignSelf: "center", alignItems: "center", padding: 5, marginVertical: 10 }}>
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
                <Text style={{alignSelf:'center', color:"#000000"}}>{categories?.length} products</Text>
               
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
                            <View style={{flex:1,alignSelf:"center",height: Dimensions.get("window").height-250,justifyContent:"center"}}>
                              <Text style={{fontSize:12, color:"#000000", fontWeight:"400",fontFamily: 'ManropeRegular'}}>No Products Available</Text>
                            </View>
                          }
                    />
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        paddingVertical: verticalScale(10),
        alignSelf: "center",
        justifyContent: "center"
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
    textInput: {
        marginLeft: verticalScale(15),
        alignSelf: "center",
        color:themevariable.Color_000000,
    },
    strickedoffer: {
        fontSize: 14,
        color: "#FF00006E",
        fontWeight: "700",
        fontFamily: 'ManropeRegular',
        marginLeft: 4,
        textDecorationLine: 'line-through'
    },

});

export default CategoriesList;

