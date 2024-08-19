import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, Modal, Button, TextInput } from 'react-native';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import themevariable from '../../../utils/themevariable';
import TextField from '../../../commonFields/TextField';
import SelectField from '../../../commonFields/SelectField';
import UploadIcon from '../../../assets/svgs/uploadIcon.svg';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from '../../../apiconfig';
import LocationPicker from '../../../components/LocationPicker';
import DetectLocation from '../../../assets/svgs/detectLocation.svg';


import axios from 'axios';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';

const GeneralDetails = () => {
    const [productName, setProductName] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined
    });
    const [productAddress, setProductAddress] = useState('');
    const [productCity, setProductCity] = useState('');
    const [productPinCode, setProductPinCode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState();
    const [perMonthRentPrice, setPerMonthRentPrice] = useState();
    const [securityDeposit, setSecurityDeposit] = useState();
    const [available, setAvailable] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState();
    const [isSelected, setSelection] = useState(false);
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    console.log('vendorLoggedInMobileNum is ::>>',vendorLoggedInMobileNum);

    const inputHandler = (value) => {
        console.log("general details inputhandler", value)
    }

    const onChangeProductName = (value) => {
        setProductName(value);
    }

    const onChangeProductBrand = (value) => {
        setProductBrand(value);
    }

    const onChangeDescription = (value) => {
        setProductDescription(value);
    }

    const onChangePerDayRentPrice = (value) => {
        setPerDayRentPrice(value);
    }

    const onChangePerMonthRentPrice = (value) => {
        setPerMonthRentPrice(value);
    }

    const onChangeSecurityDepositAmount = (value) => {
        setSecurityDeposit(value);
    }

    const onChangeAdvanceAmount = (value) => {
        setAdvanceAmount(value);
    }

    const onChangeDiscountPercentage = (value) => {
        setDiscountPercentage(value);
    }

    const onChangeAddress = (value) => {
        setProductAddress(value);
    }

    const onChangeCity = (value) => {
        setProductCity(value);
    }

    const onChangePinCode = (value) => {
        setProductPinCode(value);
    }

    const data = [
        {
            id: 0,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 1,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 2,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 3,
            imageUrl: SelectedUploadIcon,
        }
    ]

    const openGalleryOrCamera = async () => {
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
                setMainImageUrl(response);
                console.log('image lib resp ::>>', response);
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
                if (index == 0) {
                    setAdditionalImages({ ...additionalImages, additionalImageOne: response });
                } else if (index == 1) {
                    setAdditionalImages({ ...additionalImages, additionalImageTwo: response });
                } else if (index == 2) {
                    setAdditionalImages({ ...additionalImages, additionalImageThree: response });
                } else {
                    setAdditionalImages({ ...additionalImages, additionalImageFour: response });
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

    const onPressSaveAndPost = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum
        const formData = new FormData();
        formData.append('professionalImage', {
            uri: mainImageUrl?.assets[0]?.uri,
            type: mainImageUrl?.assets[0]?.type,
            name: mainImageUrl?.assets[0]?.fileName,
        });

        formData.append('additionalImages', {
            uri: additionalImages?.additionalImageOne?.assets[0]?.uri,
            type: additionalImages?.additionalImageOne?.assets[0]?.type,
            name: additionalImages?.additionalImageOne?.assets[0]?.fileName,
        });

        formData.append('additionalImages', {
            uri: additionalImages?.additionalImageTwo?.assets[0]?.uri,
            type: additionalImages?.additionalImageTwo?.assets[0]?.type,
            name: additionalImages?.additionalImageTwo?.assets[0]?.fileName,
        });

        formData.append('additionalImages', {
            uri: additionalImages?.additionalImageThree?.assets[0]?.uri,
            type: additionalImages?.additionalImageThree?.assets[0]?.type,
            name: additionalImages?.additionalImageThree?.assets[0]?.fileName,
        });

        formData.append('additionalImages', {
            uri: additionalImages?.additionalImageFour?.assets[0]?.uri,
            type: additionalImages?.additionalImageFour?.assets[0]?.type,
            name: additionalImages?.additionalImageFour?.assets[0]?.fileName,
        });

        formData.append('categoryType', 'clothes');
        formData.append('description', productDescription);
        formData.append('rentPricePerMonth', perMonthRentPrice);
        formData.append('productName', productName);
        formData.append('brandName', productBrand);
        formData.append('rentPricePerDay', perDayRentPrice);
        formData.append('itemAvailableAddress', productAddress);
        formData.append('available', true);
        formData.append('itemAvailablePinCode', productPinCode);
        formData.append('itemAvailableCity', productCity);
        formData.append('securityDepositAmount', securityDeposit);
        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('advanceAmount', advanceAmount);
        formData.append('discountPercentage', discountPercentage);

        console.log('formdata is ::>>',JSON.stringify(formData));
        const token = await getVendorAuthToken();
 
          try {
            const response = await axios.post(`${BASE_URL}/AddClothJewels`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.status === 201) {
                console.log('Success', `uploaded successfully`);
                Alert.alert(
                    "Confirmation",
                    "Your proudct posted successfully",
                    [
                        {
                            text: "No",
                            onPress: () => console.log("No Pressed"),
                            style: "cancel"
                        },
                        { text: "Yes", onPress: () => console.log("yes pressed") }
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Error', 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            console.log('Error', 'Failed to upload document');
        }
    }

    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address) => {
        console.log('Selected Location:', location, address);
        setProductAddress(address);
        setProductCity(location?.address?.city);
        setProductPinCode(location.pinCode);
        setLocationPickerVisible(false); // Hide the LocationPicker after selection
    };

    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };


    return (
        <View>

            <Modal visible={isLocationPickerVisible} animationType="slide">
                <LocationPicker onLocationSelected={handleLocationSelected} />
                <Button title="Close" onPress={handleCloseLocationPicker} />
            </Modal>


            <View style={styles.mainContainer}>
                <ChooseFileField
                    label={'Product Image'}
                    isRequired={true}
                    placeholder={'Main Image'}
                    onPressChooseFile={openGalleryOrCamera}
                />
                {mainImageUrl ?
                    <Image
                        source={{ uri: mainImageUrl?.assets[0].uri }}
                        width={'100%'}
                        height={300}
                        resizeMode='cover'
                    /> : null}

                <Text style={styles.title}>Additional Images</Text>
                <Text style={styles.subTitle}>Please add up to 4 images*</Text>
                <FlatList
                    data={data}
                    renderItem={ListItem}
                    keyExtractor={item => item.id}
                    horizontal
                    contentContainerStyle={{ width: '100%', justifyContent: 'space-around' }}
                />
                <TextField
                    label='Product Name'
                    placeholder="Please Enter Product Name"
                    value={productName}
                    onChangeHandler={onChangeProductName}
                    keyboardType='default'
                    isRequired={true}
                />

                <TextField
                    label='Product`s Brand'
                    placeholder="Please Enter Brand"
                    value={productBrand}
                    onChangeHandler={onChangeProductBrand}
                    keyboardType='default'
                    isRequired={false}
                />

                <TextField
                    label='Description'
                    placeholder="Please Enter Description"
                    value={productDescription}
                    onChangeHandler={onChangeDescription}
                    keyboardType='default'
                    isRequired={true}
                    isDescriptionField={true}
                />
            </View>
            <Text style={styles.title}>Rent Type</Text>
            <View style={styles.mainContainer}>
                <TextField
                    label='Day Price (₹ / 1day)*'
                    placeholder="Please Enter per Day Price"
                    value={perDayRentPrice}
                    onChangeHandler={onChangePerDayRentPrice}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Monthly Price (₹ / 30 days)*'
                    placeholder="Please Enter Monthly Price"
                    value={perMonthRentPrice}
                    onChangeHandler={onChangePerMonthRentPrice}
                    keyboardType='default'
                    isRequired={false}
                />
                <TextField
                    label='Security Deposit'
                    placeholder="Please Enter Security Deposit"
                    value={securityDeposit}
                    onChangeHandler={onChangeSecurityDepositAmount}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Advance Amount'
                    placeholder="Please Enter Advance Amount"
                    value={advanceAmount}
                    onChangeHandler={onChangeAdvanceAmount}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Discount'
                    placeholder="Please Enter Discount Percentage"
                    value={discountPercentage}
                    onChangeHandler={onChangeDiscountPercentage}
                    keyboardType='default'
                    isRequired={false}
                />
            </View>
            <Text style={styles.title}>Item Available Address</Text>
            <View style={styles.mainContainer}>
            <Text style={styles.textInputlabel}>
                    Address<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity onPress={handleOpenLocationPicker} style={[styles.textTnputView, { height: 100, flexDirection: "row",}]}>
                    <View style={{height: '100%',width:"85%" }}>
                        <TextInput
                            onChangeText={onChangeAddress}
                            value={productAddress}
                            placeholder="Please Enter Address"
                            keyboardType={'default'}
                            style={{ height: '100%', textAlignVertical: 'top', padding: 10 }}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center' }}>
                        <DetectLocation />
                    </View>
                </TouchableOpacity>

                {/* <TextField
                    label='Address'
                    placeholder="Please Enter Address"
                    value={productAddress}
                    onChangeHandler={onChangeAddress}
                    keyboardType='default'
                    isRequired={true}
                /> */}
                <TextField
                    label='City'
                    placeholder="Please Enter City"
                    value={productCity}
                    onChangeHandler={onChangeCity}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Pin code'
                    placeholder="Please Enter Pin code"
                    value={productPinCode}
                    onChangeHandler={onChangePinCode}
                    keyboardType='default'
                    isRequired={true}
                />
            </View>

            {/* <Text style={{ fontFamily: 'InterRegular', color: '#5F6377', fontSize: 15, fontWeight: '600' }}>I Accept Terms and Conditions</Text> */}
            <TouchableOpacity onPress={() => { onPressSaveAndPost() }} style={{ padding: 10, backgroundColor: '#FFF5E3', alignSelf: 'center', borderRadius: 5, borderColor: '#ECA73C', borderWidth: 2, marginTop: 40, bottom: 20 }}>
                <Text style={{ color: '#ECA73C' }}> Save & Post </Text>
            </TouchableOpacity>


        </View>
    )
}

export default GeneralDetails

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: themevariable.Color_FFFFFF,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 15,
        flex: 1
    },
    detailsContainer: {
        // backgroundColor: themevariable.Color_FFFFFF,
        backgroundColor: 'red',
        borderRadius: 10,

    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 18,
        marginTop: 10
    },
    subTitle: {
        fontFamily: 'ManropeRegular',
        color: themevariable.Color_000000,
        fontSize: 13,
        marginTop: 7,
        marginBottom: 10,
    },
    image: {
        // marginLeft: 15,
        // marginRight: 7,
        // marginTop: 5,
        // backgroundColor:'red'
    },
    imageContainer: {
        alignSelf: 'center',

    },
    dropdown: {
        height: 50,
        width: 350,
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    textInputlabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    textTnputView: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        // paddingHorizontal:12,
        borderRadius: 5,
    }

})