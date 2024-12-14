import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BASE_URL from '../../../apiconfig';
import BookDatesButton from '../../../components/GradientButton';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import themevariable from '../../../utils/themevariable';

const BankDetailsScreen = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const navigation = useNavigation();
    const [ifscCode, setIfscCode] = useState('');
    const [upiId, setUpiId] = useState('');
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [mobileNumber, setMobileNumber] = useState();
    const [profileData, setProfileData] = useState();
    const [isEditable, setIsEditable] = useState(false);



    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        const token = await getVendorAuthToken();
        try {
            console.log("vendou num:", vendorLoggedInMobileNum)
            const response = await axios.get(`${BASE_URL}/vendor/getVendorProfile/${vendorLoggedInMobileNum}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfileData(response?.data?.data);
            setAccountNumber(response?.data?.data?.bankAccountNumber);
            setIfscCode(response?.data?.data?.ifscCode);
            setUpiId(response?.data?.data?.upiId);
            setMobileNumber(response?.data?.data?.phonepeOrGPayNumber);

            console.log("profile vendor res:::", JSON.stringify(response?.data?.data));

        } catch (error) {
            console.log("profile::::::::::", error);
        }
    }

    const handleSave = async () => {

        const isValidBankAccount = /^[0-9]{9,18}$/.test(accountNumber);
        const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode);
        // const isValidUPI = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);

        if (!isValidBankAccount) {
            Alert.alert('Enter valid Bank Account Number');
            return;
        }
        if (!isValidIFSC) {
            Alert.alert('Enter valid IFSC Code');
            return;
        }
        // if (!isValidUPI) {
        //     Alert.alert('Enter valid UPI ID');
        //     return;
        // }

        let payload = {
            bankAccountNumber: accountNumber,
            ifscCode: ifscCode,
            upiId: upiId,
            vendorMobileNumber: vendorLoggedInMobileNum,
            phonepeOrGPayNumber: mobileNumber
        }
        const token = await getVendorAuthToken();
        if(isEditable){

            try {
                const response = await axios.patch(`${BASE_URL}/vendor/update-bank-details`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    console.log('Success', `uploaded successfully`);
                    Alert.alert(
                        "Confirmation",
                        "KYC posted successfully",
                        [
                            { text: "OK", onPress: () => { navigation.goBack() } }
                        ],
                        { cancelable: false }
                    );
                } else {
                    console.log('Error', 'Failed to upload Bank details error');
                }
            } catch (error) {
                console.error('Error  updating bank details:', error);
                console.log('Error', 'Failed to upload Bank Deatils', error);
            }

        }else{
        try {
            const response = await axios.post(`${BASE_URL}/vendor/updateVendorProfileData`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                console.log('Success', `uploaded successfully`);
                Alert.alert(
                    "Confirmation",
                    "KYC posted successfully",
                    [
                        { text: "OK", onPress: () => { navigation.goBack() } }
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Error', 'Failed to upload Bank details error');
            }
        } catch (error) {
            console.error('Error  updating banck details:', error);
            console.log('Error', 'Failed to upload Bank Deatils', error);
        }
    }

    };

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.editIconContainer}
                onPress={() => setIsEditable(true)}>
                <Icon name="edit" size={24} color="orange" />
            </TouchableOpacity>
            <Text style={{ marginTop:30,marginVertical: 5, color: "black", fontSize: 14, fontWeight: "400", fontFamily: 'ManropeRegular', }}>Bank Account Number</Text>

            <TextInput
                style={styles.input}
                placeholder="Bank Account Number"
                editable={isEditable}
                // keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
            />
            <Text style={{ marginVertical: 5, color: "black", fontSize: 14, fontWeight: "400", fontFamily: 'ManropeRegular', }}>IFSC Code</Text>

            <TextInput
                style={styles.input}
                placeholder="IFSC Code"
                value={ifscCode}
                editable={isEditable}
                onChangeText={setIfscCode}
            />

            <Text style={{ marginVertical: 5, color: "black", fontSize: 14, fontWeight: "400", fontFamily: 'ManropeRegular', }}>UPI Id</Text>

            <TextInput
                style={styles.input}
                placeholder="UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                editable={isEditable}
            />
            <Text style={{ marginVertical: 5, color: "black", fontSize: 14, fontWeight: "400", fontFamily: 'ManropeRegular', }}> PhonePe/ Gpay Number</Text>
            <TextInput
                style={styles.input}
                placeholder="PhonePe/Gpay Number"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                editable={isEditable}
            />

            <View style={{ position: 'absolute', bottom: 0 }}>
                <BookDatesButton
                    onPress={() => { handleSave() }}
                    text={'Submit'}
                    padding={10} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: '#f9f9f9',
        fontFamily: 'ManropeRegular',
        color:themevariable.Color_000000,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editIconContainer: {
        position: 'absolute',
        top: 5,
        right: 20,
        // backgroundColor:"white",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 50,
        
    },
});

export default BankDetailsScreen;
