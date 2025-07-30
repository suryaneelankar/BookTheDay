import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BookDatesButton from '../../components/GradientButton';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { getCurrentLoggedInVendorMobileNum, getCurrentLoggedInUserMobileNum, getLoginUserId, checkIsTokenStored } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserAuthToken, getVendorAuthToken, getUserAuthToken, storeVendorAuthToken, storeVendorMobileNumber, storeUserMobileNumber } from '../../utils/StoreAuthToken';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModal from '../../components/AlertModal';

const LoginScreen = ({ route }) => {
    const { type } = route.params;
    const [fullName, setFullName] = useState('');
    const [modalVisible, setModalVisible] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [authToken, setAuthToken] = useState('');
    const dispatch = useDispatch();
    const deviceFCMToken = useSelector((state) => state.deviceFCMToken);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [fieldsCheckModalVisible, setFieldsCheckModalVisible] = useState(false);
    const token = useSelector((state) => state.authToken);
    const [userOrVendorAuthToken, setUserOrVendorAuthToken] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    // const storeUserDeviceToken = async () => {
    //     const payload = {
    //         mobileNumber: String(phoneNumber),
    //         fcmToken: deviceFCMToken
    //     }
    //     console.log("payload is:::::::", payload, type);
    //     const token = await getUserAuthToken();
    //     console.log("LOgin screen scan", token);
    //     try {
    //         const userTokenRes = await axios.post(`${BASE_URL}/addUserFCMToken`, payload, {
    //             headers: {
    //                 Authorization: `Bearer ${userOrVendorAuthToken}`,
    //             },
    //         });
    //         console.log("userTokenRes  res:::::::::", userTokenRes);
    //         if (userTokenRes?.status === 200) {
    //             console.warn("successfully logged fcm token:", userTokenRes?.data?.message);
    //         }
    //     } catch (error) {
    //         console.error("Error during add user token 1 :", error);
    //     }
    // }

    const storeVendorDeviceToken = async () => {
        const payload = {
            mobileNumber: String(phoneNumber),
            fcmToken: deviceFCMToken
        }
        console.log("payload is:::::::", payload, type);
        const token = await getVendorAuthToken();
        try {
            const vendorTokenRes = await axios.post(`${BASE_URL}/addVendorFCMToken`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("vendorTokenRes  res:::::::::", vendorTokenRes);
            if (vendorTokenRes?.status === 200) {

            }
        } catch (error) {
            console.error("Error during add vendor token:", error);
        }
    }

    const getCheckUserValidation = async () => {
        if (!phoneNumber || !password) {
            setFieldsCheckModalVisible(true);
            return;
        }

        const payload = {
            mobileNumber: String(phoneNumber),
            password: String(password)
        }
        try {
            const logineRes = await axios.post(`${BASE_URL}/${type}/login`, payload);
            if (logineRes?.status === 200) {
                setAuthToken(logineRes?.data?.token);
                if (type === 'vendor') {
                    console.log('into vendor LOGG');
                    dispatch(getLoginUserId(true));
                    dispatch(getCurrentLoggedInVendorMobileNum(phoneNumber));
                    // storeVendorDeviceToken();
                    storeVendorAuthToken(logineRes?.data?.token);
                    storeVendorMobileNumber(phoneNumber);
                    if (logineRes?.data?.token) {
                        dispatch(checkIsTokenStored(true));
                    }
                } else {
                    console.log('into USER LOGG');
                    // storeUserDeviceToken();
                    dispatch(getLoginUserId(false));
                    dispatch(getCurrentLoggedInUserMobileNum(phoneNumber));
                    storeUserAuthToken(logineRes?.data?.token);
                    storeUserMobileNumber(phoneNumber);
                    if (logineRes?.data?.token) {
                        dispatch(checkIsTokenStored(true));
                    }
                }
            }
        } catch (error) {
            setModalVisible(true)
            console.error("Error during login:", error);
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1, paddingHorizontal: 20 }}>

                <Text style={styles.title}>Welcome!</Text>
                {type === 'user' ?
                    <Text style={styles.subtitle}>
                        Connect to 'Booktheday', From dazzling outfits to grand halls & catering, book everything you need in just a few taps
                    </Text>
                    :
                    <Text style={styles.subtitle}>
                        Connect to 'Booktheday', Whether it’s catering, venues, or fashion rentals, let customers find you & book instantly.
                    </Text>

                }

                <CustomModal
                    visible={fieldsCheckModalVisible}
                    message={'Please fill all fields'}
                    onClose={() => setFieldsCheckModalVisible(false)}
                />

                <Text style={styles.textLabel}>Phone Number<Text style={{ color: "red", fontSize: 14 }}> *</Text></Text>
                <View style={styles.phoneContainer}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                        style={{ color: "#333333", width: "100%" }}
                        placeholderTextColor={"#7E8389"}
                        placeholder="Enter Mobile Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10} // Limit the length for phone number
                    />
                </View>
                <Text style={styles.textLabel}>Password<Text style={{ color: "red", fontSize: 14 }}> *</Text></Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Password"
                        placeholderTextColor={"#7E8389"}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible} // Hide or show password based on isPasswordVisible
                    />

                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Icon name={!isPasswordVisible ? 'eye-slash' : 'eye'} size={18} color="#666666" />
                    </TouchableOpacity>
                </View>


                <BookDatesButton
                    onPress={() => getCheckUserValidation()}
                    // onPress={() => navigation.navigate('OtpValidation')}
                    text={'Login'}
                    padding={10}
                    buttonStyle={{ top: 10 }}
                />

                <TouchableOpacity
                    onPress={() => navigation.navigate('UserAndVendorRegister', { type: type })}
                    style={styles.RegisterLabelContainer}>
                    <Text style={styles.RegisterLabel}>Create new account</Text>
                </TouchableOpacity>

                <CustomModal
                    visible={modalVisible}
                    message={'Please Enter Valid Credentials'}
                    onClose={() => setModalVisible(false)}
                />

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
        marginBottom: 5,
        marginTop: 20
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: "#333333"
    },
    RegisterLabelContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        marginTop: 50
    },
    RegisterLabel: {
        alignSelf: "center",
        color: "grey",
        textDecorationLine: "underline",
        fontSize: 14,
        fontWeight: "400",
        fontFamily: 'ManropeRegular',

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
    inputContainer: {
        position: 'relative',
        justifyContent: "space-between",
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
        // top:Dimensions.get('window').height/65
        // top: '50%',
        // transform: [{ translateY: -10 }],
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 8,
        borderRadius: 5,
        height: 45
    },
    countryCode: {
        // fontSize: 16,
        color: '#000',
    },
});

export default LoginScreen;