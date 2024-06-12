import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const EditProfile = () => {
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const handleSave = () => {
        // Save logic here
        console.log({ fullName, contactNumber, email, address });
    };

    const handleCancel = () => {
        // Cancel logic here
        setFullName('');
        setContactNumber('');
        setEmail('');
        setAddress('');
    };

    return (
        <>
        <View style={styles.container}>
            <Text style={styles.header}>Personal Information</Text>
            <View style={{elevation:2,borderRadius:10,backgroundColor: "white", paddingHorizontal: 10, paddingVertical: 20 }}>
                <Text style={{ color: "#000000", fontSize: 13, fontWeight: "700", fontFamily: 'ManropeRegular' }}>Full Name*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <Text style={{ color: "#000000", fontSize: 13, fontWeight: "700", fontFamily: 'ManropeRegular', marginTop: 20 }}>Contact Number*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                />
                <Text style={{ color: "#000000", fontSize: 13, fontWeight: "700", fontFamily: 'ManropeRegular', marginTop: 20 }}>Email Address*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={{ color: "#000000", fontSize: 13, fontWeight: "700", fontFamily: 'ManropeRegular', marginTop: 20 }}>Address*</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
            </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <LinearGradient colors={['#D2453B', '#A0153E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
            >
                <TouchableOpacity  onPress={handleSave}>
                    <Text style={[styles.buttonText,{color:"#F4F4F6",textAlign:"center"}]}>Save</Text>
                </TouchableOpacity>
                </LinearGradient>
            </View>
       </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F3F5FB',
    },
    header: {
        fontSize: 16,
        marginBottom: 16,
        marginHorizontal: 5,
        fontWeight: "800",
        color: "#000000",
        fontFamily: 'ManropeRegular',

    },
    input: {
        // height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        width:"98%"
    },
    buttonContainer: {
        flexDirection: 'row',
        position:"absolute",
        bottom:0,
        backgroundColor:"white",
        paddingVertical:10,
        width:"100%",
        paddingHorizontal:"10%",
        alignItems:"center"
    },
    cancelButton: {
        padding: 10,
        borderRadius: 13,
        width: '30%',
        alignItems: 'center',
        borderWidth:1,
        borderColor:"#D2453B",
        marginLeft:"15%"
    },
    saveButton: {
        backgroundColor: '#D2453B',
        padding: 10,
        borderRadius: 13,
        width: '30%',
        alignItems: 'center',
        marginLeft:25
    },
    buttonText: {
        color: '#D2453B',
        fontSize: 14,
        fontWeight:"800",
        fontFamily: 'ManropeRegular',

    },
});

export default EditProfile;
