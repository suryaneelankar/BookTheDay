import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, StyleSheet, FlatList, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL, { LocalHostUrl } from "../../apiconfig";
import axios from "axios";
import { horizontalScale, verticalScale, moderateScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import SwipperOne from '../../assets/svgs/homeSwippers/swipperOne.svg';
import BackButton from '../../assets/svgs/backButton.svg'
import { formatAmount } from "../../utils/GlobalFunctions";
import OfferStikcer from '../../assets/svgs/offerSticker.svg';
import Svg, { Image as SvgImage } from 'react-native-svg';
import { LinearGradient } from 'react-native-linear-gradient';
import shirtImg from '../../assets/shirt.png'
import TrendingNow from "../Products/TrendingNow";
import HowItWorks from "../Products/HowItWorks";
import Swiper from 'react-native-swiper';

const Categories = () => {

    const navigation = useNavigation();
    const { width } = Dimensions.get('window');
    const [categories, setCategories] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [jewelleryCategory, setJewelleryCategory] = useState([]);
    const [productYouMayLike, setProductYouMayLike] = useState([]);
    const bannerImages = [{ image: require('../../assets/svgs/productBanners/productBannerone.png') },
    { image: require('../../assets/svgs/productBanners/productBannerone.png') },
    { image: require('../../assets/svgs/productBanners/productBannerone.png') },
    ]

    const categoryFilterList = [{ name: 'Chains' }, { name: 'Rings' }, { name: 'Bridal' }, { name: 'Bangles' }, { name: 'EarRings' }, { name: 'Bracelets' }]; //svg images for swipper  
    const [selectedJewelFilter, setSelectedJewelFilter] = useState(categoryFilterList[0]?.name);


    const discountList = [
        {
            id: 0,
            value: 'All',
        },
        {
            id: 1,
            value: '10%',
        },
        {
            id: 2,
            value: '20%',
        },
        {
            id: 3,
            value: '30%',
        },
        {
            id: 4,
            value: '40%',
        },
        {
            id: 5,
            value: '50%',
        },
    ];

    useEffect(() => {
        getCategories();
    }, [filteredJewellery]);

    const getCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllClothesJewels`);
            setCategories(response?.data)
            const filteredClothesCategories = response?.data.filter(category => category?.categoryType === 'clothes');
            const filteredJewelleryCategories = response?.data.filter(category => category?.categoryType === 'jewels');
            const filteredDiscountItems = response?.data.filter(category => category?.componentType === 'discount');

            setJewelleryCategory(filteredJewelleryCategories);
            setProductYouMayLike(filteredClothesCategories);
            setDiscountProducts(filteredDiscountItems)
        } catch (error) {
            console.log("categories::::::::::", error);

        }
    }
    const limitedData = productYouMayLike.slice(0, 6);

    const renderFilterBox = ({ item }) => {
        const isSelected = selectedJewelFilter === item?.name;

        return (
            <TouchableOpacity onPress={() => setSelectedJewelFilter(isSelected ? null : item?.name)}>
                <View style={{ height: 60, width: 80, }}>
                    {isSelected ?
                        <LinearGradient start={{ x: 0, y: 1.2 }} end={{ x: 0, y: -1 }} colors={['#FFF3CD', '#FFDB7E']} style={{ flex: 1, }}>
                            <View style={{ width: "auto", height: 4, backgroundColor: "#D2453B", borderTopRightRadius: 5, borderTopLeftRadius: 5, }} />
                            <Text style={{ marginTop: 10, alignSelf: "center", color: "#D2453B", fontSize: 11, fontWeight: "400", fontFamily: "ManropeRegular", }}>{item?.name}</Text>
                        </LinearGradient>
                        :
                        <View>
                            <Text style={{ marginTop: 10, alignSelf: "center", color: "#000000", fontSize: 11, fontWeight: "400", fontFamily: "ManropeRegular", }}>{item?.name}</Text>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    const renderJewellery = ({ item }) => {
        const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        const originalPrice = item?.rentPricePerDay;
        const discountPercentage = item?.discountPercentage;
        const strikethroughPrice = discountPercentage
            ? Math.round(originalPrice * (1 + discountPercentage / 100))
            : originalPrice;

        return (
            <View style={{}}>
                <TouchableOpacity onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id })}
                    style={{ width: Dimensions.get('window').width / 2.8, alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', height: 'auto', marginLeft: 16 }}>
                    <Image source={{ uri: updatedImgUrl }} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, width: '100%', height: Dimensions.get('window').height / 5 }}
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
                    <View style={{ marginTop: 15, marginHorizontal: 6 }}>
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

    function capitalizeFirstLetters(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    const renderClothesCat = ({ item, index }) => {
        const updatedImgUrl = item?.professionalImage?.url ? item?.professionalImage?.url.replace('localhost', LocalHostUrl) : item?.professionalImage?.url;

        return (
            <TouchableOpacity onPress={() => navigation.navigate('ViewCatDetails', { catId: item?._id })} style={{ backgroundColor: 'white', marginTop: 10, width: '48%', marginHorizontal: 5, alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                <View style={{ marginTop: 5, width: '100%', marginHorizontal: 5 }}>
                    <Image style={{ width: '95%', height: 200, backgroundColor: 'red', borderRadius: 10 }} source={{ uri: updatedImgUrl }} resizeMode="cover" />
                    <Text style={styles.productName}>{capitalizeFirstLetters(item?.productName)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, justifyContent: 'space-between', width: '90%', bottom: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
                            <Text style={styles.price}>{formatAmount(item?.rentPricePerDay)}</Text>
                            <Text style={styles.discount}>{formatAmount(item?.rentPricePerDay + 500)}</Text>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const filteredJewellery = selectedJewelFilter === 'All'
        ? jewelleryCategory
        : jewelleryCategory.filter(item => item?.jewellaryType === selectedJewelFilter.toLowerCase());


    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={{ marginBottom: 70 }} >
                <View style={{ backgroundColor: "#F9F9F9" }}>
                    <View style={styles.searchProduct}>
                        <View style={styles.searchProHeader}>
                            <SearchIcon style={{ marginLeft: verticalScale(20) }} />
                            <TextInput
                                placeholder="Search fashion"
                                style={styles.textInput} />
                        </View>
                    </View>

                    <Swiper
                        autoplay
                        autoplayTimeout={3}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                        style={{ height: Dimensions.get('window').height / 3.3, marginHorizontal: 20, marginTop: 10 }}
                    >
                        {bannerImages.map((image, index) => (
                            <View style={{}} key={index}>
                                <Image source={image?.image} />
                            </View>
                        ))}
                    </Swiper>
                    <View style={{ marginHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontFamily: "ManropeRegular", fontWeight: "700", fontSize: 16, color: '#202020' }}>Categories</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('CategoriesList', { catType: 'jewels' })} style={styles.sellAllContainer}>
                            <Text style={styles.seeAllText}>See All</Text>
                            <BackButton width={20} height={20} style={styles.backButton} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={categoryFilterList}
                        contentContainerStyle={{ marginHorizontal: 20, marginTop: 15 }}
                        renderItem={renderFilterBox} />

                    <FlatList
                        horizontal
                        data={filteredJewellery}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ backgroundColor: "#FDF7D7", paddingVertical: 20 }}
                        renderItem={renderJewellery} />
                </View>


                <View style={{ marginHorizontal: 20, flexDirection: "row", justifyContent: "space-between", marginTop: 25, marginBottom: 5 }}>
                    <Text style={{ fontFamily: "ManropeRegular", fontWeight: "700", fontSize: 16, color: '#202020' }}>Products You May Like</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CategoriesList', { catType: 'clothes' })} style={styles.sellAllContainer}>
                        <Text style={styles.seeAllText}>See All</Text>
                        <BackButton width={20} height={20} style={styles.backButton} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={limitedData}
                    numColumns={2}
                    contentContainerStyle={{ alignSelf: "center", marginHorizontal: 10 }}
                    renderItem={renderClothesCat} />
                <TrendingNow data={discountProducts} textHeader={'Trending Now'} />
                <HowItWorks />
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        height: moderateScale(65),
        width: "100%",
        paddingVertical: verticalScale(10),
        borderBottomColor: themevariable.lightgray,
        borderBottomWidth: moderateScale(1),
        elevation: 1
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
    productContainer: {
        margin: 5,
        width: Dimensions.get('window').width / 2.2,
    },
    firstContainer: {
        backgroundColor: themevariable.Color_FFFFFF,
        borderRadius: 7,
        paddingHorizontal: 5,
        paddingVertical: 8,
    },
    productName: {
        fontFamily: 'ManropeRegular',
        color: 'black',
        marginHorizontal: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        marginLeft: 5
    },
    price: {
        color: themevariable.Color_202020,
        fontWeight: 'bold',
        fontSize: 20
    },
    discount: {
        color: themevariable.Color_ECA73C99,
        fontWeight: 'bold',
        fontSize: 18,
        textAlignVertical: 'center',
        marginLeft: 8,
        textDecorationLine: 'line-through'

    },
    serachIcon: {
        height: moderateScale(15),
        width: moderateScale(15),
        marginLeft: horizontalScale(10),
        alignSelf: "center"
    }, 
    strickedoffer: {
        fontSize: 14,
        color: "#FF00006E",
        fontWeight: "700",
        fontFamily: 'ManropeRegular',
        marginLeft: 4,
        textDecorationLine: 'line-through'
    },
    off: {
        fontSize: 13,
        color: "#57A64F",
        fontWeight: "bold"
    },
    textInput: {
        marginLeft: verticalScale(15),
        alignSelf: "center"
    },
    titleHeader: {
        color: "black",
        fontSize: 22,
        fontWeight: "bold"
    },
    text: { fontSize: 12, textAlign: 'center' },
    card: {
        marginTop: 10,
        alignItems: 'center',
        width: 120,
    },
    searchContainer: {
        marginHorizontal: 20,
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "space-between"
    },
    searchProduct: {
        height: 45,
        backgroundColor: '#F2F2F3',
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 50,
        borderColor: "#E3E3E7",
        borderWidth: 0.8
    },
    searchProHeader: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center"
    },
    textInput: {
        marginLeft: 10,
        alignSelf: "center"
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
    slide: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "pink",
    },
    image: {
        height: 200,
        resizeMode: 'cover',
    },
    dot: {
        backgroundColor: '#DCD7FD',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    activeDot: {
        backgroundColor: '#FF6347',
        width: 18,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    sellAllContainer: {
        flexDirection: 'row',
    },
    seeAllText: {
        fontWeight: '700',
        fontSize: 16,
        color: themevariable.Color_202020,
        fontFamily: 'ManropeRegular',
    },
    backButton: {
        marginLeft: 12,
        alignSelf: 'center'
    },
});

export default Categories;

