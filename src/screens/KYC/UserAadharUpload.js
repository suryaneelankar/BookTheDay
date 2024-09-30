import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import BookDatesButton from '../../components/GradientButton';
import { getUserAuthToken } from '../../utils/StoreAuthToken';
import axios from 'axios';
import BASE_URL, { LocalHostUrl } from '../../apiconfig';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

const UserAadharUpload = () => {
    const userLoggedInMobileNum = useSelector((state) => state.userLoggedInMobileNum);
    const navigation = useNavigation();
    const [getUserAuth, setGetUserAuth] = useState('');


    const [selectedImage, setSelectedImage] = useState();
    const [profileData, setProfileData] = useState();
    const [isAadharAvailable, setIsAadharAvailable] = useState();



    useEffect(()=>{
        getProfileData();
      },[]);
  
      const getProfileData = async() => {
          const token = await getUserAuthToken();
          try {
            console.log("vendou num:", userLoggedInMobileNum)
            const response = await axios.get(`${BASE_URL}/getAllUserLocations/${userLoggedInMobileNum}`,{
                headers: {
                      Authorization: `Bearer ${token}`,
                    },
              });
              setProfileData(response?.data?.data);
            //   setSelectedImage(response?.data?.data?.aadharImage);
              const updatedImgUrl = response?.data?.data?.aadharImage?.url ? response?.data?.data?.aadharImage?.url.replace('localhost', LocalHostUrl) : response?.data?.data?.aadharImage?.url;
              setIsAadharAvailable(updatedImgUrl);
              setGetUserAuth(token);
          console.log("profile user res:::", updatedImgUrl);
             
          } catch (error) {
              console.log("profile::::::::::", error);
          }
      }


    const handleImagePick = (type,isEdit ) => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        if (type === 'camera') {
            launchCamera(options, (response) => {
                if (response.assets) {
                    setSelectedImage(response);
                }
            });
        } else {
            launchImageLibrary(options, (response) => {
                if (response.assets) {
                    if(isEdit==='edit'){
                        setIsAadharAvailable(response?.assets[0]?.uri);
                        setSelectedImage(response);
                    }else{
                    setSelectedImage(response)
                    }
                }
            });
        }
    };

    const onSubmitCallUser = async() =>{

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
        formData.append('userMobileNumber', userLoggedInMobileNum);
        console.log('formdata is ::>>', JSON.stringify(formData));
        const token = await getUserAuthToken();
        try {
            const response = await axios.post(`${BASE_URL}/user/uploadUserAadharImage`, formData, {
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

    console.log("selectmage image url::::::", isAadharAvailable)
    
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Aadhar Proof <Text style={{color:"red", fontSize:18,}}>*</Text> </Text>
            <View style={styles.uploadBox}>
                {isAadharAvailable ? (
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        {isAadharAvailable ?
                        // <></>
                        <FastImage 
                        source={{ uri: isAadharAvailable,
                            headers:{Authorization : `Bearer ${getUserAuth}`}

                        }} style={styles.image} />
                         : 
                        <FastImage 
                        source={{ uri: selectedImage?.assets[0]?.uri ,

                        }} style={styles.image} /> }
                        <TouchableOpacity
                            style={styles.editIconContainer}
                            onPress={() => handleImagePick('gallery', 'edit')}>
                            <Icon name="edit" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={styles.icon}>☁️</Text>
                        <Text style={styles.uploadText}>Drag & drop files</Text>
                        <TouchableOpacity onPress={() => handleImagePick('gallery',)}>
                            <Text style={styles.browseLink}>Browse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleImagePick('camera',)}>
                            <Text style={styles.cameraLink}>Or take a photo</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>


            <View style={{ position: 'absolute', bottom: 0}}>
                <BookDatesButton
                    onPress={() => { onSubmitCallUser()}}
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

export default UserAadharUpload;
