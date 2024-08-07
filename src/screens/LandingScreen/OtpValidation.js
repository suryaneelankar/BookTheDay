import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BookDatesButton from '../../components/GradientButton';
import { moderateScale } from '../../utils/scalingMetrics';
import { useNavigation } from '@react-navigation/native';

const OtpValidation = ({ navigation }) => {
    const [otp, setOtp] = useState(['', '', '', '']);

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
    };

    const handleSubmit = () => {
        // Handle OTP submission logic
        console.log('OTP Submitted:', otp.join(''));
        navigation.navigate('Home')

    };

    const handleResubmit = () => {
        // Handle OTP resubmission logic
        console.log('OTP Resubmitted');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#FFF7E7', '#FFF7E7', '#FFFFFF']} style={styles.gradient}>
                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>Please enter the OTP sent to your email address ****shed@gmail.com or mobile ****3937</Text>
                <View style={styles.otpContainer}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            value={value}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            keyboardType="numeric"
                            maxLength={1}
                        />
                    ))}
                </View>
                <TouchableOpacity onPress={handleSubmit} >
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
    buttonText:{
        color:"#F4F4F6",
        fontSize:14, 
        fontWeight:"800",
        fontFamily: "ManropeRegular",
        textAlign:"center"   
   },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1A1E25',
        marginBottom: 10,
        fontFamily: 'ManropeRegular'

    },
    buttonView:{
        // marginHorizontal:horizontalScale(25),
        // padding:moderateScale(12),
        borderRadius:moderateScale(10),
        alignItems:"center",
        marginTop:Dimensions.get('window').height/10
 
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
        marginTop:20,
        fontFamily: 'ManropeRegular'

    },
    resubmitLink: {
        color: '#FD8236',
        fontWeight: '600',
        fontFamily: 'ManropeRegular'

    },
});

export default OtpValidation;
