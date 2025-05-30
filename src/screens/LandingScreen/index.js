import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TakeOnRentSubImage from '../../assets/SelectUserOrVendor/takeOnRentSub.svg';
import { useNavigation } from '@react-navigation/native';
import BookDatesButton from '../../components/GradientButton';
import WheelWithImageQuads from './ImageQuadrants';
import OnboardingBGImg from '../../assets/OnboardingBGImg.png';

const LandingScreen = () => {

    const navigation = useNavigation();

    return (
        <ImageBackground
            source={OnboardingBGImg} // Background image
            style={{ flex: 1 }}
            resizeMode="cover" // Adjust the image scaling
        >
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['transparent', 'transparent', 'transparent']} style={{ flex: 1 }}>

                <Text style={{ alignSelf: "center", fontSize: 24, color: "black", fontFamily: "ManropeRegular", fontWeight: 'bold', marginTop: "30%" }}>All-in-One Event Planner</Text>

                <Text style={styles.rentTitle}>Plan your perfect event with just one app.</Text>

                <WheelWithImageQuads />

                <BookDatesButton
                    onPress={() => navigation.navigate('LoginScreen', { type: "user" })}
                    text={"Get Started"}
                    padding={10}
                    showIcon={true}
                    gradientButtonStyle={styles.button}
                />

                <View style={{ position: "absolute", bottom: "4%", alignSelf: "flex-end", flexDirection: "row", right: 30 }}>
                    <Text style={{ color: "black", fontSize: 13, fontFamily: 'ManropeRegular', }}>Offer your services? Become a vendor!</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LoginScreen', { type: "vendor" })}>
                        <Text style={{ color: "#D0433C", textDecorationLine: "underline", fontSize: 15, fontFamily: 'ManropeRegular', fontWeight: '700' }}>Join</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    CircleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    item: {
        width: "33%",
        height: 100,
        marginBottom: 16,
    },
    rentTitle: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: "black",
        fontFamily: 'ManropeRegular',
        marginTop: 10,
        width: "80%",
        alignSelf: "center",
        textAlign: "center"
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: "#7D7F88",
        fontWeight: "400",
        marginTop: 10,
        width: "80%",
        alignSelf: "center",
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
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: "#222831",
        fontFamily: 'ManropeRegular'

    },
    description: {
        fontSize: 13,
        color: '#7D7F88',
        fontWeight: "400",
        marginVertical: 5,
        fontWeight: '500',
        fontFamily: 'ManropeRegular'
    },
    button: {
        marginTop: 30,
        width: "70%",
        alignSelf: "center",
        borderRadius: 10
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '400',
        fontSize: 12,
        fontFamily: 'ManropeRegular'

    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LandingScreen;
