import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BASE_URL from '../../../apiconfig';
import BookDatesButton from '../../../components/GradientButton';
import { useNavigation } from '@react-navigation/native';

const BankDetailsScreen = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const navigation = useNavigation();
    const [ifscCode, setIfscCode] = useState('');
    const [upiId, setUpiId] = useState('');
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    const [mobileNumber, setMobileNumber] = useState(vendorLoggedInMobileNum);

    const handleSave = async () => {

        const isValidBankAccount = /^[0-9]{9,18}$/.test(accountNumber);
        const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode);
        const isValidUPI = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);

        if (!isValidBankAccount) {
            Alert.alert('Enter valid Bank Account Number');
            return;
        }
        if (!isValidIFSC) {
            Alert.alert('Enter valid IFSC Code');
            return;
        }
        if (!isValidUPI) {
            Alert.alert('Enter valid UPI ID');
            return;
        }

        let payload = {
            bankAccountNumber: accountNumber,
            ifscCode: ifscCode,
            upiId: upiId,
            vendorMobileNumber: vendorLoggedInMobileNum
        }
        const token = await getVendorAuthToken();
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

    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Bank Account Number"
                // keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
            />

            <TextInput
                style={styles.input}
                placeholder="IFSC Code"
                value={ifscCode}
                onChangeText={setIfscCode}
            />

            <TextInput
                style={styles.input}
                placeholder="UPI ID"
                value={upiId}
                onChangeText={setUpiId}
            />

            <TextInput
                style={styles.input}
                editable={false}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
            />

            <View style={{ position: 'absolute', bottom: 0 }}>
                <BookDatesButton
                    onPress={() => {handleSave()}}
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
        fontSize: 16,
        backgroundColor: '#f9f9f9',
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
});

export default BankDetailsScreen;
