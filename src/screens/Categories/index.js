import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground,StyleSheet,FlatList, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Wedding from '../../assets/wedding.png';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { horizontalScale, verticalScale, moderateScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
import SearchIcon from '../../assets/svgs/searchIcon.svg';
import SwipperOne from '../../assets/svgs/homeSwippers/swipperOne.svg';
import { formatAmount } from "../../utils/GlobalFunctions";
import OfferStikcer from '../../assets/svgs/offerSticker.svg';
import Svg, { Image as SvgImage } from 'react-native-svg';
import { LinearGradient } from 'react-native-linear-gradient';
import DiscountComponent from "../Products/DiscountComponent";
import shirtImg from '../../assets/shirt.png'
import TrendingNow from "../Products/TrendingNow";
import HowItWorks from "../Products/HowItWorks";


const Categories = () => {

    const navigation = useNavigation();
    const images = [SwipperOne, SwipperOne, SwipperOne]; //svg images for swipper  
    const { width } = Dimensions.get('window');
    const [categories, setCategories] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const categoryFilterList = [{name:'Chains'},{name:'Rings'},{name:'Bridal'},{name:'Anklet'},{name:'Bangles'}]; //svg images for swipper  

    //Products you may like data
    const DATA = [
        {
          id: 0,
          productName: 'Trail Running Jacket Nike Windrunner',
          productPrice:700,
          productDiscount:20,
          discountPercentage:20,
          imageUrl:shirtImg
        },
        {
          id: 1,
          productName: 'Trail Running Jacket Nike Windrunner',
          productPrice:700,
          productDiscount:20,
          discountPercentage:20,
          imageUrl:shirtImg,
        },
        {
          id: 2,
          productName: 'Trail Running Jacket Nike Windrunner',
          productPrice:700,
          productDiscount:20,
          discountPercentage:20,
          imageUrl:shirtImg,
        },
        {
            id:3,
            productName: 'Trail Running Jacket Nike Windrunner',
            productPrice:700,
            productDiscount:20,
            discountPercentage:20,
            imageUrl:shirtImg,
        },
        {
            id:4,
            productName: 'Trail Running Jacket Nike Windrunner',
            productPrice:700,
            productDiscount:20,
            discountPercentage:20,
            imageUrl:shirtImg,
        },
        {
            id:5,
            productName: 'Trail Running Jacket Nike Windrunner',
            productPrice:700,
            productDiscount:20,
            discountPercentage:20,
            imageUrl:shirtImg,
        }
      ];
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
            id:3,
            value: '30%',
        },
        {
            id:4,
            value: '40%',
        },
        {
            id:5,
            value: '50%',
        },
      ];
       
    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        console.log("IAM CALLING API in home")
        try {
            const response = await axios.get(`${BASE_URL}/all-category`);
            // console.log("categories::::::::::", response?.data?.data);
            setCategories(response?.data?.data)
        } catch (error) {
            console.log("categories::::::::::", error);

        }
    }
    const category = [
        { image: require('../../assets/jwelleryIcon.png'), name: 'Jewellery', status: 'Available' },
        { image: require('../../assets/furbitureIcon.png'), name: 'Furniture', status: 'Available' },
        // { image: require('../../assets/events.png'), name: 'Events', status: 'Available' },
        { image: require('../../assets/Electronic.png'), name: 'Electronics', status: 'Available' },
        // { image: require('../../assets/driversIcon.png'), name: 'Drivers Rentals', status: 'Available' },
        { image: require('../../assets/clothes.png'), name: 'Clothes', status: 'Available' },
        // { image: require('../../assets/chefIcon.png'), name: 'Master Chefs', status: 'Available' },
        { image: require('../../assets/others.png'), name: 'Others', status: 'Available' },
    ]

    const renderFilterBox = ({ item }) => {
        const isSelected = selectedItem === item?.name;

        return (
            <TouchableOpacity onPress={() => setSelectedItem(isSelected ? null : item?.name)}>
            <View style={{height:60,width:80,}}>
                {isSelected ?
                                <LinearGradient start={{ x: 0, y: 1.2 }} end={{ x: 0, y: 0}} colors={['#FFF3CD', '#FFDB7E',]} style={{ flex: 1, }}>
                                <View style={{width:"auto",height:4,backgroundColor:"#D2453B",borderTopRightRadius:5,borderTopLeftRadius:5,}}/>
                                <Text style={{marginTop:10,alignSelf:"center",color:"#D2453B",fontSize:11,fontWeight:"400", fontFamily: "ManropeRegular",}}>{item?.name}</Text>
                                </LinearGradient>
                                :
                                <View>
                                <Text style={{marginTop:10,alignSelf:"center",color:"#000000",fontSize:11,fontWeight:"400", fontFamily: "ManropeRegular",}}>{item?.name}</Text>
                                </View>
                }
            </View>
            </TouchableOpacity>
        )
    }

    const   renderJewellery = ({ item }) => {

        return (
            <View style={{}}>
                <TouchableOpacity
                    style={{ width: Dimensions.get('window').width /2.8, alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', height: 'auto',marginLeft:16}}>
                    <Image source={{ uri: item?.catImageUrl }} style={{ borderTopLeftRadius:8,borderTopRightRadius:8,width: '100%', height:Dimensions.get('window').height/5 }}
                    />
                    <OfferStikcer  style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}/>
                    <View  style={{
                        position: 'absolute',
                        top: 0,
                        left: 5,
                        right: 0,
                        bottom: 0,
                        
                    }}>
                   <Text style={{color:"#FFFFFF", fontSize:10,fontWeight:"700",fontFamily: 'ManropeRegular'}}>20%</Text>
                   <Text style={{color:"#FFFFFF", fontSize:10,fontWeight:"700",fontFamily: 'ManropeRegular'}}>Off</Text>
                    </View>
                    <View style={{ marginTop: 15,marginHorizontal:6 }}>
                            <Text numberOfLines={1} style={{ fontWeight: '600', color: '#000000', fontSize: 12, fontFamily: 'ManropeRegular' }}>{item?.name}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                            {/* <Text style={{ fontWeight: '700', color:'#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount(item?.price)}/day</Text> */}
                            <Text style={{ fontWeight: '700', color:'#202020', fontSize: 14, fontFamily: 'ManropeRegular' }}>{formatAmount('700')}/day</Text>
 
                                <Text style={styles.strickedoffer}>{formatAmount(item?.price + 1000)}</Text>
                            </View>   
                            <TouchableOpacity style={{width:"100%",borderColor:"#D0433C",borderWidth:1,borderRadius:5,alignSelf:"center",alignItems:"center",padding:5,marginVertical:10}}>
                                <Text style={{color:"#D0433C",fontSize:12,fontWeight:"700",fontFamily: 'ManropeRegular'}}>Rent Now</Text>
                            </TouchableOpacity>                    
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
            <ScrollView style={{ marginBottom: 70 }} >
                        <View style={styles.searchProduct}>
                            <View style={styles.searchProHeader}>
                                <SearchIcon style={{ marginLeft: verticalScale(20) }} />
                                <TextInput
                                    placeholder="Search fashion"
                                    style={styles.textInput} />
                            </View>
                        </View>
                        <View style={{ width: "100%" }}>
                        <SwiperFlatList
                            autoplay
                            autoplayDelay={2}
                            autoplayLoop
                            index={2}
                            showPagination
                            paginationDefaultColor='#DDD4F3'
                            paginationActiveColor='#ECA73C'
                            paginationStyle={{ bottom: -20,}}
                            paginationStyleItem={{ backgroundColor: "red" }}
                            paginationStyleItemInactive={{ width: 8, height: 8 }}
                            paginationStyleItemActive={{ height: 8, width: 20 }}
                            data={images}
                            style={{marginTop:20}}
                            renderItem={({ item: Item }) => (
                                <View style={{ width,alignItems: "center" }}>
                                    <Item />
                                </View>

                            )}
                        />
                        </View>
            
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                        <Text style={{ fontFamily: "ManropeRegular", fontWeight: "700", fontSize: 16, color: '#202020' }}>Categories</Text>
                        </View>
                       
                        <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={categoryFilterList}
                        contentContainerStyle={{marginHorizontal:20,}}
                        renderItem={renderFilterBox}/>
                       
                        <FlatList
                        horizontal
                        data={categories}
                        contentContainerStyle={{backgroundColor:"#FDF7D7",paddingVertical:20}}
                        renderItem={renderJewellery}/>
                        <DiscountComponent data={DATA}/>
                        <TrendingNow data={DATA} discountList={discountList}/>
                        <HowItWorks/>
                   

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
    serachIcon: {
        height: moderateScale(15),
        width: moderateScale(15),
        marginLeft: horizontalScale(10),
        alignSelf: "center"
    },strickedoffer: {
        fontSize: 14,
        color: "#FF00006E",
        fontWeight: "700",
        fontFamily:'ManropeRegular',
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
        // backgroundColor:"#f7f5f5"
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
        marginHorizontal:20,
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
});

export default Categories;

