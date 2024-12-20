import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../../utils/scalingMetrics';
import { OTPWidget } from '@msg91comm/sendotp-react-native';

const widgetId = "346c70705566333632373330";
const tokenAuth = "436669TfIot32ZJOj67605d73P1";

const OtpValidation = ({ navigation, route }) => {

    const { mobileNumber } = route.params;

    useEffect(() => {
        OTPWidget.initializeWidget(widgetId, tokenAuth); //Widget initialization
        handleSendOtp();
    }, [])


    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpResponse, setOtpResponse] = useState();
    const inputRefs = useRef([]);



    // const handleOtpChange = (text, index) => {
    //     const newOtp = [...otp];
    //     newOtp[index] = text;
    //     setOtp(newOtp);
    // };

    const handleSubmit = () => {
        // Handle OTP submission logic
        console.log('OTP Submitted:', otp.join(''));
        navigation.navigate('Home')

    };

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
    }

    const handleResubmit = () => {
        // Handle OTP resubmission logic
        console.log('OTP Resubmitted');
    };

    const handleRetryOtp = async () => {
        const body = {
            reqId: '3463***************43931',
            retryChannel: 11 // Retry channel code (here, SMS:11)
        }
        const response = await OTPWidget.retryOTP(body);
        console.log(response);
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
                    <Text style={styles.resubmitLink} onPress={handleResubmit}>Resubmit</Text>
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
