import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BookDatesButton from '../../components/GradientButton';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { getCurrentLoggedInVendorMobileNum, getCurrentLoggedInUserMobileNum, getLoginUserId, checkIsTokenStored } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { storeUserAuthToken, getVendorAuthToken, getUserAuthToken, storeVendorAuthToken, storeVendorMobileNumber, storeUserMobileNumber } from '../../utils/StoreAuthToken';
import themevariable from '../../utils/themevariable';
import CustomModal from '../../components/AlertModal';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserAndVendorRegister = ({ route }) => {
    const { type } = route.params;
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [authToken, setAuthToken] = useState('');
    const dispatch = useDispatch();
    // const selectedMode = useSelector((state) => state.userId);
    const deviceFCMToken = useSelector((state) => state.deviceFCMToken);
    // console.log("selected mode::::::::;;", selectedMode, type);
    console.log('deviceFCMToken is::>>', deviceFCMToken)
    const [fieldsCheckModalVisible, setFieldsCheckModalVisible] = useState(false);
    const [error, setError] = useState("");
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        if (password !== text) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const storeUserDeviceToken = async () => {
        const payload = {
            mobileNumber: String(phoneNumber),
            fcmToken: deviceFCMToken
        }
        console.log("payload is:::::::", payload, type);
        const token = await getUserAuthToken();
        console.log("LOgin screen sycan", token)
        try {
            const userTokenRes = await axios.post(`${BASE_URL}/addUserFCMToken`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log("userTokenRes  res:::::::::", userTokenRes);
            if (userTokenRes?.status === 200) {

            }
        } catch (error) {
            console.error("Error during add user token 3 :", error);
        }
    };

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
            // console.log("vendorTokenRes  res:::::::::", vendorTokenRes);
            if (vendorTokenRes?.status === 200) {

            }
        } catch (error) {
            console.error("Error during add vendor token:", error);
        }
    };

    const getCheckUserValidation = async () => {
        console.log("baseurl", BASE_URL)

        const payload = {
            mobileNumber: String(phoneNumber),
            password: String(password),
            fullName: fullName,
            role: type
        }
        console.log('URL:', `${BASE_URL}/${type}/register`);
        console.log('Payload:', payload);

        try {
            const RegisterRes = await axios.post(`${BASE_URL}/${type}/register`, payload);
            if (RegisterRes?.data?.message) {
                const loginPayload = {
                    mobileNumber: String(phoneNumber),
                    password: String(password)
                }
                try {
                    const logineRes = await axios.post(`${BASE_URL}/${type}/login`, loginPayload);
                    if (logineRes?.status === 200) {
                        setAuthToken(logineRes?.data?.token);
                        if (type === 'vendor') {
                            console.log('into vendor LOGG');
                            storeVendorDeviceToken();
                            dispatch(getLoginUserId(true));
                            dispatch(getCurrentLoggedInVendorMobileNum(phoneNumber));
                            storeVendorAuthToken(logineRes?.data?.token);
                            storeVendorMobileNumber(phoneNumber);
                            if (logineRes?.data?.token) {
                                dispatch(checkIsTokenStored(true));
                            }
                            // navigation.navigate('Home');
                        } else {
                            console.log('into USER LOGG');
                            storeUserDeviceToken();
                            dispatch(getLoginUserId(false));
                            dispatch(getCurrentLoggedInUserMobileNum(phoneNumber));
                            storeUserAuthToken(logineRes?.data?.token);
                            storeUserMobileNumber(phoneNumber);
                            if (logineRes?.data?.token) {
                                dispatch(checkIsTokenStored(true));
                            }
                            // navigation.navigate('Home');
                        }
                    }
                } catch (error) {
                    // setModalVisible(true)
                    console.error("Error during login:", error);
                }
            }
        } catch (error) {
            console.error("Error during register:", error.response?.data?.message);

            console.error("Error during register:", error);
            Alert.alert(
                 error.response?.data?.message,
                'Please try again',
                [
                    { text: 'OK' },
                ]
            );
        }

    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={{ flex: 1, paddingHorizontal: 20 }}>

                <Text style={styles.title}>Register Here!</Text>
                <Text style={styles.subtitle}>
                    Register here,Connect to your 'Booktheday' account to explore local rental opportunities.
                </Text>

                <Text style={styles.textLabel}>Full Name<Text style={{ color: "red" }}>*</Text></Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                    placeholderTextColor={"#7E8389"}
                    value={fullName}
                    onChangeText={setFullName}
                />
                <Text style={[styles.textLabel, {}]}>Phone Number<Text style={{ color: "red" }}>*</Text></Text>

                <View style={styles.phoneContainer}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                        // style={styles.input}
                        style={{ color: "#333333", width: "100%" }}
                        placeholderTextColor={"#7E8389"}
                        placeholder="Enter Mobile Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10} // Limit the length for phone number
                    />
                </View>
                <>
                    <Text style={[styles.textLabel, { marginTop: 15 }]}>Password<Text style={{ color: "red" }}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Password"
                            placeholderTextColor={"#7E8389"}
                            value={password}
                            onChangeText={handlePasswordChange}
                            secureTextEntry={!isPasswordVisible} // Hide or show password based on isPasswordVisible
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                            <Icon name={!isPasswordVisible ? 'eye-slash' : 'eye'} size={18} color="#666666" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.textLabel]}>Confirm Password<Text style={{ color: "red" }}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={"#7E8389"}
                            value={confirmPassword}
                            onChangeText={handleConfirmPasswordChange}
                            secureTextEntry={!isConfirmPasswordVisible} // Hide or show password based on isConfirmPasswordVisible
                        // onBlur={validatePasswords} // Validate passwords on blur
                        />
                        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                            <Icon name={!isConfirmPasswordVisible ? 'eye-slash' : 'eye'} size={18} color="#666666" />
                        </TouchableOpacity>
                    </View>

                    {passwordError ? <Text style={{ color: 'red' }}>{passwordError} </Text> : null}
                </>

                <CustomModal
                    visible={fieldsCheckModalVisible}
                    message={'Please fill all fields'}
                    onClose={() => setFieldsCheckModalVisible(false)}
                />

                <View style={{}}>

                    <BookDatesButton
                        // onPress={() => getCheckUserValidation()}
                        onPress={() => {
                            if (!phoneNumber) {
                                setFieldsCheckModalVisible(true);
                            } else {
                                getCheckUserValidation()
                            }
                        }}
                        text={'Register'}
                        padding={10}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.RegisterLabelContainer}>
                    <Text style={styles.RegisterLabel}>Already have an account? Login.</Text>
                </TouchableOpacity>

            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        position: 'relative',
        justifyContent: "space-between",
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
    errorText: {
        color: "red",
        marginTop: 5,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
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
        color: themevariable.Color_000000
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 10,
        color: "#666666",
        fontSize: 12,
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
});

export default UserAndVendorRegister;
