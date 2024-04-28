import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, StyleSheet, FlatList, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { moderateScale, verticalScale, horizontalScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";

const CategoriesList = ({ route }) => {
    const { catType } = route.params;
    console.log("RECEIED TYPE IS:::", catType)
    const CategoryType = catType == 'Jewellery' ? 'jewellery' : catType == 'Furniture' ? 'furniture' : catType == 'Events' ? 'event' : catType == 'Electronics' ? 'electronic' : catType == 'Drivers Rentals' ? 'driver' : catType == 'Clothes' ? 'cloth' : catType == 'Master Chefs' ? 'chef' : null;
    console.log("final catetype:::::::::::", CategoryType)
    const [categories, setCategories] = useState([])


    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/all-category`);
            const selectedCategories = response?.data?.data.filter(item => CategoryType ? item.catType == CategoryType : true);
            setCategories(selectedCategories)
        } catch (error) {
            console.log("categories::::::::::", error);
        }
    }

    const navigation = useNavigation();
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ViewTrendingDetails', { categoryId: item?._id })}
                key={index} style={styles.itemView}>
                <Image source={{ uri: item?.catImageUrl }} style={styles.renderImage} />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.itemHeading}>{item?.name}</Text>
                    <Image
                        source={require('../../assets/wishlist.png')}
                        style={styles.wishListimage}
                    />
                </View>
                <View style={styles.priceContainer}>
                    <Text style={{ color: "black", fontSize: 12, fontWeight: "700" }}> ₹1000</Text>
                    <Text style={styles.strickedoffer}>₹800</Text>
                    <Text style={styles.off}> 20% off</Text>
                </View>

                <View>
                    <Text style={[styles.status, { color: item?.rented ? "#a85705" : "white", backgroundColor: item?.rented ? "#fabdb6" : "green" }]}>{item?.rented ? 'Out of Stock' : 'Available'}</Text>
                </View>
            </TouchableOpacity>
        )
    }


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
                <FlatList
                    numColumns={2}
                    contentContainerStyle={{ marginHorizontal: 10 }}
                    data={categories}
                    renderItem={renderItem} />
            </View>


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
        fontSize: 12,
        color: "black",
        fontWeight: "200",
        marginLeft: 7,
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

