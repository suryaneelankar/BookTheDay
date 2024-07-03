import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import themevariable from '../../../utils/themevariable';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { launchImageLibrary } from 'react-native-image-picker';

export const Accordion = ({ itemName, onChangeDescription, onUploadImage, onChangePrice }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [images, setImages] = useState([]);
    const data = [
        {
            id: 0,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 1,
            imageUrl: SelectedUploadIcon,
        },
    ];
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined
    });

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleImagePicker = () => {
        ImagePicker.showImagePicker({}, response => {
            if (response.uri) {
                const newImages = [...images, response.uri];
                setImages(newImages);
                onUploadImage(itemName, newImages);
            }
        });
    };

    const openGalleryOrCameraForAdditonalImages = async (index) => {
        const options = {
            mediaType: 'photo',
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const newImages = [...images, response];
                setImages(newImages);
                onUploadImage(itemName, newImages);
                if (index == 0) {
                    setAdditionalImages({ ...additionalImages, additionalImageOne: response });
                } else if (index == 1) {
                    setAdditionalImages({ ...additionalImages, additionalImageTwo: response });
                }
            }
        });
    };

    const ListItem = ({ item, index }) => {

        return (
            <TouchableOpacity style={styles.imageContainer} onPress={() => { openGalleryOrCameraForAdditonalImages(index) }}>
                {additionalImages &&
                    additionalImages?.additionalImageOne && index == 0 ?
                    <Image
                        source={{ uri: additionalImages?.additionalImageOne?.assets[0]?.uri }}
                        width={Dimensions.get('window').width / 4.8}
                        height={100}
                        style={{ borderRadius: 5 }}
                        resizeMode='cover'
                    /> :
                    additionalImages?.additionalImageTwo && index == 1 ?
                        <Image
                            source={{ uri: additionalImages?.additionalImageTwo?.assets[0]?.uri }}
                            width={Dimensions.get('window').width / 4.8}
                            height={100}
                            style={{ borderRadius: 5 }}
                            resizeMode='cover'
                        />
                        : additionalImages?.additionalImageThree && index == 2 ?
                            <Image
                                source={{ uri: additionalImages?.additionalImageThree?.assets[0]?.uri }}
                                width={Dimensions.get('window').width / 4.8}
                                height={100}
                                style={{ borderRadius: 5 }}
                                resizeMode='cover'
                            />
                            : additionalImages?.additionalImageFour && index == 3 ?
                                <Image
                                    source={{ uri: additionalImages?.additionalImageFour?.assets[0]?.uri }}
                                    width={Dimensions.get('window').width / 4.8}
                                    height={100}
                                    style={{ borderRadius: 5 }}
                                    resizeMode='cover'
                                />
                                :
                                <item.imageUrl style={{}} width={Dimensions.get('window').width / 4.8} height={100} />
                }

            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity onPress={toggleCollapse} style={styles.accordionHeader}>
                <Text style={styles.accordionHeaderText}>{itemName}</Text>
                <Icon name={isCollapsed ? 'arrow-down' : 'arrow-up'} size={20} />
                </TouchableOpacity>
            {isCollapsed && (
                <View style={styles.accordionContent}>
                     <Text style={styles.subTitle}>Please add up to 2 images*</Text>
                <FlatList
                    data={data}
                    renderItem={ListItem}
                    keyExtractor={item => item.id}
                    horizontal
                    contentContainerStyle={{ width: '100%', justifyContent: 'space-around' }}
                />
                    {/* <FlatList
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.imagePreview} />
                        )}
                        horizontal
                    /> */}
                    <Text style={{color:"#000000", fontSize:13, fontWeight:"700",fontFamily: 'ManropeRegular', marginTop:20}}>Package Contains</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder={`Package contains for ${itemName}`}
                        value={description}
                        onChangeText={(text) => {
                            setDescription(text);
                            onChangeDescription(itemName, text);
                        }}
                    />
                     <Text style={{color:"#000000", fontSize:13, fontWeight:"700",fontFamily: 'ManropeRegular', marginTop:20}}>Package Price</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder={`Package contains for ${itemName}`}
                        value={price}
                        onChangeText={(text) => {
                            setPrice(text);
                            onChangePrice(itemName, text);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    accordionContainer: {
        marginVertical: 10,
        borderRadius:5,
        borderWidth:1,
        borderColor:"lightgray"
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
        // elevation:4,
        borderRadius:10
    },
    accordionHeaderText: {
        fontSize: 13,
        fontFamily: 'ManropeRegular',
        fontWeight:"700",
        color:"#000000"
    },
    accordionContent: {
        padding: 10,
        backgroundColor: 'white',
        marginHorizontal:5,
        borderRadius:5,
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    textInput: {
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginTop:10
    },
    subTitle: {
        fontFamily: 'ManropeRegular',
        color: themevariable.Color_000000,
        fontSize: 13,
        marginBottom: 10,
    },
});
