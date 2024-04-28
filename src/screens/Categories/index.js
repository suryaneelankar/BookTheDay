import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ImageBackground, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import Wedding from '../../assets/wedding.png';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from "../../apiconfig";
import axios from "axios";
import { horizontalScale, verticalScale, moderateScale } from "../../utils/scalingMetrics";
import themevariable from "../../utils/themevariable";
const Categories = () => {

    const navigation = useNavigation();
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


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ marginBottom: verticalScale(70) }} >
                <View style={styles.headerContainer}>
                    <View style={styles.searchView}>
                        <Image source={require('../../assets/searchIcon.png')}
                            style={styles.serachIcon}
                        />
                        <TextInput
                            placeholder="Browse requirements"
                            style={styles.textInput} />
                    </View>
                </View>

                {category.map((item, index) => (
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('CategoriesList',{catType: item?.name})}
                    key={index} style={styles.listcard}>
                        {index % 2 === 0 ? (
                            <>
                                <Image
                                    source={item?.image}
                                    style={{ width: 150, height: 120 }}
                                    resizeMode="cover"
                                />
                                <Text style={styles.titleHeader}>{item?.name}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.titleHeader}>{item?.name}</Text>
                                <Image
                                    source={item?.image}
                                    style={{ width: 150, height: 100 }}
                                />
                            </>
                        )}
                    </TouchableOpacity>
                ))}
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

