import React, { useEffect, useState } from 'react';
import { OTPWidget } from '@msg91comm/sendotp-react-native';
import { View, TextInput, TouchableOpacity, Text } from "react-native";


const widgetId = "346c70705566333632373330";
const tokenAuth = "436669TfIot32ZJOj67605d73P1";

const UserOTPScreen = () => {
    useEffect(() => {
        OTPWidget.initializeWidget(widgetId, tokenAuth); //Widget initialization
    }, [])

    const [number, setNumber] = useState('');

    const handleSendOtp = async () => {
        const data = {
            identifier: '8297735285'
        }
        const response = await OTPWidget.sendOTP(data);
        console.log(response);  
    }

    return (
        <View>
            <TextInput
                placeholder='Number'
                value={number}
                keyboardType='numeric'
                style={{ backgroundColor: '#ededed', margin: 10 }}
                onChangeText={(text) => {
                    setNumber(text)
                }}
            />
            <TouchableOpacity
                // style={styles.button}
                onPress={()=>{
                    handleSendOtp()
                }}
            >
                <Text>
                    Send OTP
                </Text>
            </TouchableOpacity>
        </View>
    );
}
    
export default UserOTPScreen;