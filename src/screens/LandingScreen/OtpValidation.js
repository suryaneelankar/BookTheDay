import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../../utils/scalingMetrics';
import { OTPWidget } from '@msg91comm/sendotp-react-native';
import BASE_URL from '../../apiconfig';
import { getCurrentLoggedInUserMobileNum, getCurrentLoggedInVendorMobileNum, getLoginUserId } from '../../../redux/actions';
import { getUserAuthToken, getVendorAuthToken, storeUserAuthToken, storeVendorAuthToken } from '../../utils/StoreAuthToken';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const widgetId = "346c70705566333632373330";
const tokenAuth = "436669TfIot32ZJOj67605d73P1";

const OtpValidation = ({ navigation, route }) => {

    const { mobileNumber,loginType } = route.params;
    const dispatch = useDispatch();
    const selectedMode = useSelector((state) => state.userId);
    const deviceFCMToken = useSelector((state) => state.deviceFCMToken);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpResponse, setOtpResponse] = useState();
    const [otperrorMessage, setOtpErrorMessage] = useState();
    const [authToken, setAuthToken] = useState('');

    const inputRefs = useRef([]);


    useEffect(() => {
        OTPWidget.initializeWidget(widgetId, tokenAuth); //Widget initialization
        handleSendOtp();
    }, [])


    const handleSendOtp = async () => {
        const data = {
            identifier: `91${mobileNumber}`
        }
        const response = await OTPWidget.sendOTP(data);
        console.log("otp response********", response);
        // {"message": "346c746a5033353630313235", "type": "success"}
        setOtpResponse(response);
    }

    const handleVerifyOtp = async () => {
        const otpString = otp.join(""); // "3059"

        const body = {
            reqId: otpResponse?.message,
            otp: otpString
        }
        console.log("body for verify otp is", body)
        const response = await OTPWidget.verifyOTP(body);
        console.log("verify otp response", response);
        if(response?.type === 'error'){
            showToastWithGravityAndOffset();
            setOtpErrorMessage(true);
        }
        if(response?.type === 'success'){
            getCheckUserValidation();
            setOtpErrorMessage(false);

        }
    };
    
      const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
          'Inavlid OTP',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          100,
        );
      };


    const handleRetryOtp = async () => {
        const body = {
            reqId: otpResponse?.message,
            retryChannel: 11 // Retry channel code (here, SMS:11)
        }
        const response = await OTPWidget.retryOTP(body);
        console.log("retry otp response is",response);
        if(response?.type === 'error'){
            ToastAndroid.show(response?.message, ToastAndroid.SHORT);
        }
    };

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Automatically focus the next field
        if (text && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const storeUserDeviceToken = async () => {
        const payload = {
            mobileNumber: String(mobileNumber),
            fcmToken: deviceFCMToken
        }
        console.log("payload is:::::::", payload, loginType);
        const token = await getUserAuthToken();
        console.log("LOgin screen sycan", token)
        try {
            const userTokenRes = await axios.post(`${BASE_URL}/addUserFCMToken`, payload,{
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });
            // console.log("userTokenRes  res:::::::::", userTokenRes);
            if (userTokenRes?.status === 200) {

            }
        } catch (error) {
            console.error("Error during add user token :", error);
        }
    };

    const storeVendorDeviceToken = async () => {
        const payload = {
            mobileNumber: String(mobileNumber),
            fcmToken: deviceFCMToken
        }
        console.log("payload is:::::::", payload, loginType);
        const token = await getVendorAuthToken();
        try {
            const vendorTokenRes = await axios.post(`${BASE_URL}/addVendorFCMToken`, payload,{
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
    };

    const getCheckUserValidation = async () => {

        const payload = {
            mobileNumber: String(mobileNumber),
            // password: String(password)
            // fullName: fullName,
            // role: type
        }
        console.log("payload is:::::::", payload, loginType);
        try {
            const logineRes = await axios.post(`${BASE_URL}/${loginType}/login`, payload);
            console.log("login  res:::::::::", logineRes?.data);
            if (logineRes?.status === 200) {
                setAuthToken(logineRes?.data?.token);
                if (loginType === 'vendor') {
                    console.log('into vendor LOGG');
                    dispatch(getLoginUserId(true));
                    dispatch(getCurrentLoggedInVendorMobileNum(mobileNumber));
                    storeVendorDeviceToken();
                    storeVendorAuthToken(logineRes?.data?.token)
                    navigation.navigate('Home');
                } else {
                    console.log('into USER LOGG');
                    storeUserDeviceToken();
                    dispatch(getLoginUserId(false));
                    dispatch(getCurrentLoggedInUserMobileNum(mobileNumber));
                    storeUserAuthToken(logineRes?.data?.token);
                    navigation.navigate('Home');
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={styles.gradient}>
                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>{`Please enter the OTP sent to your mobile  ${mobileNumber}`}</Text>
                <View style={styles.otpContainer}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            value={value}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            ref={(ref) => (inputRefs.current[index] = ref)} // Assign reference
                            onKeyPress={({ nativeEvent }) => {
                                // Handle backspace to focus the previous field
                                if (nativeEvent.key === 'Backspace' && !value && index > 0) {
                                    inputRefs.current[index - 1].focus();
                                }
                            }}
                        />
                    ))}
                </View>
                {otperrorMessage ?
                <Text style={{color:"red", fontSize:12, fontWeight:"400",fontFamily: "ManropeRegular"}}>Invalid OTP enter.Please re-try</Text> : null}
                <TouchableOpacity onPress={handleVerifyOtp} >
                    <LinearGradient
                        colors={['#D2453B', '#A0153E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.buttonView, { width: Dimensions.get('window').width - 80, padding: 10, alignSelf: 'center' }]}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.buttonText} >Submit</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.resubmitText}>
                    Can't get OTP?{' '}
                    <TouchableOpacity onPress={handleRetryOtp}>
                    <Text style={styles.resubmitLink}>Resubmit</Text>
                    </TouchableOpacity>
                </Text>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    buttonText: {
        color: "#F4F4F6",
        fontSize: 14,
        fontWeight: "800",
        fontFamily: "ManropeRegular",
        textAlign: "center"
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1A1E25',
        marginBottom: 10,
        fontFamily: 'ManropeRegular'

    },
    buttonView: {
        // marginHorizontal:horizontalScale(25),
        // padding:moderateScale(12),
        borderRadius: moderateScale(10),
        alignItems: "center",
        marginTop: Dimensions.get('window').height / 10

    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#7D7F88',
        fontWeight: '400',
        marginBottom: 20,
        fontFamily: 'ManropeRegular'

    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    otpInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        width: 40,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        color: '#000000',
    },
    submitButton: {
        backgroundColor: '#FD8236',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resubmitText: {
        fontSize: 14,
        color: '#7D7F88',
        marginTop: 20,
        fontFamily: 'ManropeRegular'

    },
    resubmitLink: {
        color: '#FD8236',
        fontWeight: '600',
        fontFamily: 'ManropeRegular'

    },
});

export default OtpValidation;
