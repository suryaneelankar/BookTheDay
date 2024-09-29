import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import BookDatesButton from '../../components/GradientButton';
import { getVendorAuthToken } from '../../utils/StoreAuthToken';
import axios from 'axios';
import BASE_URL from '../../apiconfig';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const AadharUpload = ({route}) => {
    const [selectedImage, setSelectedImage] = useState();
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);


    const navigation = useNavigation();
    const [selectedFoodLicenseImage, setSelectedFoodLicenseImage] = useState();

    const loginType = route.params.type;
    const handleImagePick = (type, userType) => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        if (type === 'camera') {
            launchCamera(options, (response) => {
                if (response.assets) {
                    if(userType === 'user'){
                        setSelectedImage(response);
                    }else if(userType === 'vendor'){
                        selectedFoodLicenseImage(response)
                    }
                }
            });
        } else {
            launchImageLibrary(options, (response) => {
                if (response.assets) {
                    if(userType === 'user'){
                        setSelectedImage(response)
                    }else if(userType === 'vendor'){
                        selectedFoodLicenseImage(response)
                    }
                    // setSelectedImage(response.assets[0].uri);
                }
            });
        }
    };

    const onSubmitCallVendor = async() =>{

        if(!selectedImage){
            Alert.alert('Please upload Aadhar Image')
            return;
        }
        const formData = new FormData();
        
        formData.append('aadharImage', {
            uri: selectedImage?.assets[0]?.uri,
            type: selectedImage?.assets[0]?.type,
            name: selectedImage?.assets[0]?.fileName,
        });
        // formData.append('aadharImage', selectedImage?.assets[0]?.uri);
        formData.append('vendorMobileNumber', vendorLoggedInMobileNum);
        console.log('formdata is ::>>', JSON.stringify(formData));
        const token = await getVendorAuthToken();
        try {
            const response = await axios.post(`${BASE_URL}/vendor/uploadVendorAadharImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("response:::::", response)
            if (response.status === 200) {
                console.log('Success', `uploaded successfully`);
                Alert.alert(
                    "Confirmation",
                    "KYC posted successfully",
                    [
                        { text: "OK", onPress: () => {navigation.goBack()} }
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Error', 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            console.log('Error', 'Failed to upload document Aadhar');
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Aadhar Proof <Text style={{color:"red", fontSize:18,}}>*</Text> </Text>
            <View style={styles.uploadBox}>
                {selectedImage ? (
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <Image source={{ uri: selectedImage?.assets[0]?.uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.editIconContainer}
                            onPress={() => handleImagePick('gallery', 'user')}>
                            <Icon name="edit" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={styles.icon}>☁️</Text>
                        <Text style={styles.uploadText}>Drag & drop files</Text>
                        <TouchableOpacity onPress={() => handleImagePick('gallery', 'user')}>
                            <Text style={styles.browseLink}>Browse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleImagePick('camera', 'user')}>
                            <Text style={styles.cameraLink}>Or take a photo</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {loginType === 'vendor' ?
            <>
             <Text style={[styles.label,{marginTop:20}]}>Food Safety License</Text>
            <View style={styles.uploadBox}>
                {selectedFoodLicenseImage ? (
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <Image source={{ uri: selectedFoodLicenseImage?.assets[0]?.uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.editIconContainer}
                            onPress={() => handleImagePick('gallery', 'vendor')}>
                            <Icon name="edit" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={styles.icon}>☁️</Text>
                        <Text style={styles.uploadText}>Drag & drop files</Text>
                        <TouchableOpacity onPress={() => handleImagePick('gallery', 'vendor')}>
                            <Text style={styles.browseLink}>Browse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleImagePick('camera', 'vendor')}>
                            <Text style={styles.cameraLink}>Or take a photo</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            </>
             : <></>}

            <View style={{ position: 'absolute', bottom: 0}}>
                <BookDatesButton
                    onPress={() => {
                        if(loginType === 'vendor'){
                            onSubmitCallVendor()
                        }else{

                        }
                     }}
                    text={'Submit'}
                    padding={10} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white"
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 10,
        color: "#111111",
        fontFamily: 'ManropeRegular'
    },
    uploadBox: {
        width: 200,
        height: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFBF3',
        borderStyle: 'dashed'
    },
    uploadText: {
        color: '#0F0F0F',
        fontSize: 14,
        marginTop: 10,
        fontFamily: 'ManropeRegular',
        fontSize: 14,
        fontFamily: "700"
    },
    browseLink: {
        color: '#ECA73C',
        fontWeight: '700',
        marginTop: 5,
        fontFamily: 'ManropeRegular',
        fontSize: 14

    },
    cameraLink: {
        color: '#ECA73C',
        marginTop: 5,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
        fontSize: 14
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    icon: {
        fontSize: 40,
    },
    editIconContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 50,
    },
});

export default AadharUpload;
