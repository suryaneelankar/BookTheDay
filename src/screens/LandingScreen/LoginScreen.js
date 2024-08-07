import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BookDatesButton from '../../components/GradientButton';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { getLoginUserId } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const LoginScreen = ({ route }) => {
    const { type } = route.params;
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const dispatch = useDispatch();
    const selectedMode = useSelector((state) => state.userId);
    console.log("selected mode::::::::;;", selectedMode);


    const getCheckUserValidation = async () => {

        const payload = {
            mobileNumber: String(phoneNumber),
            password: String(password)
            // fullName: fullName,
            // role: type
        }
        console.log("payload is:::::::", payload, type);
        if (type === 'vendor') {
            dispatch(getLoginUserId(true));
            navigation.navigate('Home')
        } else {
            navigation.navigate('Home')
        }
        try {
            const logineRes = await axios.post(`${BASE_URL}/user/login`, payload);
            console.log("login  res:::::::::", logineRes);
            if (logineRes?.status === 200) {
                setAuthToken(logineRes?.data?.token);
                if (type === 'vendor') {
                    dispatch(getLoginUserId(true));
                    navigation.navigate('Home')
                } else {
                    navigation.navigate('Home')
                }
            }
        } catch (error) {
            console.error("Error during booking:", error);
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1, paddingHorizontal: 20 }}>

                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>
                    Connect to your 'Booktheday' account to explore local rental opportunities.
                </Text>

                <Text style={styles.textLabel}>Full Name*</Text>

                <TextInput
                    style={styles.input}
                    placeholder="your name"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <Text style={styles.textLabel}>Email Address</Text>

                <TextInput
                    style={styles.input}
                    placeholder="your email id"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.textLabel}>Phone Number*</Text>

                <TextInput
                    style={styles.input}
                    placeholder="+91 9343467389"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
                <Text style={styles.textLabel}>Password*</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                />


                <View style={styles.checkboxContainer}>
                    {/* <CheckBox
          value={termsAccepted}
          onValueChange={setTermsAccepted}
        /> */}
                    <Text style={styles.checkboxLabel}>Terms And Conditions</Text>
                </View>

                <View style={{ flex: 1, bottom: 0, position: "absolute" }}>

                    <BookDatesButton
                        onPress={() => getCheckUserValidation()}
                        // onPress={() => navigation.navigate('OtpValidation')}
                        text={'Create Account'}
                        padding={10}
                    />
                </View>

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginVertical: 20,
        color: "#1A1E25",
        fontFamily: 'ManropeRegular'
    },
    subtitle: {
        fontSize: 14,
        color: '#7D7F88',
        marginBottom: 20,
        fontFamily: 'ManropeRegular',
        fontWeight: "400"


    },
    textLabel: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'ManropeRegular',
        fontWeight: "700",
        marginBottom: 5
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#FF6F61',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        color: '#666',
    },
    signInText: {
        color: '#FF6F61',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
