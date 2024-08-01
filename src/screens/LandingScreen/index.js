import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import SvgUri from 'react-native-svg-uri'; // Use this for handling SVG files
import CateringIcon from '../../assets/svgs/LandingScreen/cateringDash.svg';
import Clothes from '../../assets/svgs/LandingScreen/clothesDashboard.svg';
import DecorationIcon from '../../assets/svgs/LandingScreen/decorationDash.svg';
import DressesIcon from '../../assets/svgs/LandingScreen/dressesDash.svg';
import EventsMarriage from '../../assets/svgs/LandingScreen/eventsMarriage.svg';
import JewelleryIcon from '../../assets/svgs/LandingScreen/jewellryDash.svg';
import LinearGradient from 'react-native-linear-gradient';
import GiveOnRentSub from '../../assets/SelectUserOrVendor/GiveOnRentSub.svg';
import TakeOnRentSubImage from '../../assets/SelectUserOrVendor/takeOnRentSub.svg';
import Svg, { Image } from 'react-native-svg';


const LandingScreen = () => {

    const items = [
        { id: '1', component: <CateringIcon width="100%" height="100%" />, title: 'Catering' },
        { id: '2', component: <Clothes width="100%" height="100%" />, title: 'Clothes' },
        { id: '3', component: <DecorationIcon width="100%" height="100%" />, title: 'Decoration' },
        { id: '4', component: <DressesIcon width="100%" height="100%" />, title: 'Dresses' },
        { id: '5', component: <EventsMarriage width="100%" height="100%" />, title: 'Events' },
        { id: '6', component: <JewelleryIcon width="100%" height="100%" />, title: 'Jewellery' },
    ];

    const categories = [
        { id: '1', source: require('../../assets/svgs/LandingScreen/marriageDecoration.png') },
        { id: '2', source: require('../../assets/svgs/LandingScreen/jewelleryLandScreen.png') },
        { id: '3', source: require('../../assets/svgs/LandingScreen/dressesLandscreen.png') },
        { id: '4', source: require('../../assets/svgs/LandingScreen/decorationLandScreen.png') },
        { id: '5', source: require('../../assets/svgs/LandingScreen/clothesLandingscreen.png') },
        { id: '6', source: require('../../assets/svgs/LandingScreen/cateringLandScreen.png') },

    ]

    const { width } = Dimensions.get('window');

    const data = [
        {
            id: '1',
            title: 'Take on Rent',
            description: 'Rent the items and make it more easy',
            buttonText: 'Start Lending',
            SvgImage: TakeOnRentSubImage,
        },
        {
            id: '2',
            title: 'Give on Rent',
            description: 'Rent the items and make it more Profitable',
            buttonText: 'Start Renting',
            SvgImage: GiveOnRentSub,
        },
    ];

    const Item = ({ title, description, buttonText, SvgImage }) => (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                <SvgImage width={100} height={100} />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1 }}>

                <FlatList
                    data={items}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            {item.component}
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    contentContainerStyle={styles.grid}
                />

                <Text style={styles.rentTitle}>Rent products & Services</Text>
                <Text style={styles.subtitle}>Are you ready to uproot and start over in a new area? Placoo will help you on your journey!</Text>

            </LinearGradient>

            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Item
                        title={item.title}
                        description={item.description}
                        buttonText={item.buttonText}
                        SvgImage={item.SvgImage}
                    />
                )}
                contentContainerStyle={{flex:1,marginTop:15}}
                keyExtractor={item => item.id}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
        // alignItems: 'center',
        // justifyContent: 'center',
        // padding: 16,
    },
    overlayContainer: {
        position: 'absolute',
        top: Dimensions.get('window').height / 7,
        left: Dimensions.get('window').height / 3.5,
    },
    grid: {
        marginTop: 30,
        alignSelf: "center",
        alignItems: "center",

        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent: 'space-around',
    },
    item: {
        width: "33%",
        height: 100,
        marginBottom: 16,
    },
    rentTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        color: "#1A1E25",
        fontFamily: 'ManropeRegular'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: "#7D7F88",
        fontWeight: "400",
        marginTop: 10,
        marginHorizontal: 35
    },
    loginButton: {
        backgroundColor: '#F04A49',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginVertical: 10,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
    },
    signupButton: {
        borderColor: '#F04A49',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginVertical: 10,
    },
    signupButtonText: {
        color: '#F04A49',
        fontSize: 18,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 3,
      },
      textContainer: {
        flex: 1,
      },
      title: {
        fontSize: 16,
        fontWeight: '800',
        color:"#222831",
        fontFamily: 'ManropeRegular'

      },
      description: {
        fontSize: 10,
        color: '#7D7F88',
        fontWeight:"400",
        marginVertical: 5,
      },
      button: {
        backgroundColor: '#FD8236',
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10,
        width:"50%",
        alignItems:"center",
        borderRadius:20
      },
      buttonText: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize:12,
        fontFamily: 'ManropeRegular'

      },
      imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default LandingScreen;
