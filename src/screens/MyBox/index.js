import React, {useState, useEffect} from "react";
import {View, Text, TouchableOpacity, Linking, Platform, Alert, PermissionsAndroid} from 'react-native';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from "../../apiconfig";
import axios from "axios";

const MyBox = () =>{

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // requestGalleryPermission();
      }, []);
    
      const requestGalleryPermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'Gallery Permission',
                message: 'App needs access to your gallery to upload images.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                captureAndUpload()
              console.log('Gallery permission granted');
            } else {
              handlePermissionDenied()
              console.log('Gallery permission denied');
            }
          } catch (err) {
            console.warn(err);
          }
        } else {
          console.log('iOS does not require permission for gallery access');
        }
      };

      const handlePermissionDenied = () => {
        Alert.alert(
          'Permission Denied',
          'Please grant access to the gallery in order to proceed.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ],
        );
      };
      
      const openSettings = () => {
        Linking.openSettings();
      };

      const captureAndUpload =  () => {
       launchImageLibrary ({ mediaType: 'photo' }, (response)  => {
       console.log("image rseponse:::::", response)
       handleUpload(response)     
        });
      };


      const handleUpload = async (response) => {
        if (response) {
          const formData = new FormData();
          formData.append('file', {
            uri: response?.assets[0]?.uri,
            type: response?.assets[0]?.type,
            name: response?.assets[0]?.fileName,
          });
    
          try {
            const response = await axios.post('http://192.168.1.4:3000/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.status === 200) {
             console.log('Success', `uploaded successfully`);
              // Handle success response from server
            } else {
             console.log('Error', 'Failed to upload document');
            }
          } catch (error) {
            console.error('Error uploading document:', error);
           console.log('Error', 'Failed to upload document');
          }
        } else {
        //   alert(`Please Select ${documentType} File first`);
        }
      };
    
    return(
        <View>

            <Text>MyBox SCREEN</Text>

            <TouchableOpacity
            onPress={requestGalleryPermission}
             style={{alignSelf:"center", backgroundColor:"pink", padding:10}}>
                <Text>Upload files</Text>
            </TouchableOpacity>

            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />}

        </View>
    )
}

export default MyBox;
