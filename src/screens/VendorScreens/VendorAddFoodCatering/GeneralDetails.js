import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, TextInput, ScrollView, ActivityIndicator, Modal } from 'react-native';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import themevariable from '../../../utils/themevariable';
import TextField from '../../../commonFields/TextField';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from '../../../apiconfig';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import VegNonVegIcon from '../../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../../assets/svgs/foodtype/NonVeg.svg';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import LocationPicker from '../../../components/LocationPicker';
import DetectLocation from '../../../assets/svgs/detectLocation.svg';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FoodMenu from '../../../components/VendorAddOwnCombo';
import CustomModal from '../../../components/AlertModal';
import { useNavigation } from '@react-navigation/native';

const GeneralDetails = ({isAadharUpdate}) => {
    const navigation = useNavigation();
    const [comboModalSuccess, setcomboModalSuccess] = useState(false);
    const [overTimeCharges, setOverTimeCharges] = useState();
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [foodCateringName, setFoodCateringName] = useState('');
    const [cateringDescription, setCateringDescription] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined
    });
    const [cateringAddress, setCateringAddress] = useState('');
    const [locationLatitude, setLocationLatitude] = useState();
    const [locationLongitude, setLocationLongitude] = useState();
    const [locationCountyVal, setLocationCountyVal] = useState();

    const [cateringCity, setCateringCity] = useState('');
    const [cateringPincode, setCateringPincode] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState();
    const [foodMenuItems, setFoodMenuItems] = useState();
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const discountPercentageArr = ['5', '10', '15', '20', '30', '50'];
    const [selectedDiscountVal, setSelectedDiscountVal] = useState();
    const [loading, setLoading] = useState(false);
    const [isFoodDropDownCollapsed, setIsFoodDropDownCollapsed] = useState(false);
    const [selectedFoodType, setSelectedFoodType] = useState('');
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    const foodTypes = [
        { name: 'veg', icon: VegIcon },
        { name: 'non-veg', icon: NonVegIcon },
        { name: 'Both', icon: VegNonVegIcon }
    ]

    useEffect(() => {
        getFoodMenuItems();
    }, []);

    const getFoodMenuItems = async () => {
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodItems`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setFoodMenuItems(response?.data?.data[0]?.foodMenuItems);
        } catch (error) {
            console.log("events data error>>::", error);
        }
    };
    const [finalCombomenu, setFinalComboMenu] = useState([]);

    const onChangeDescription = (value) => {
        setCateringDescription(value);
    }

    const onChangeCateringName = (value) => {
        setFoodCateringName(value);
    }

    const onChangeAdvanceAmount = (value) => {
        setAdvanceAmount(value);
    }

    const onChangeCateringAddress = (value) => {
        setCateringAddress(value);
    }

    const onChangeOverTimeCharges = (value) => {
        setOverTimeCharges(value);
    }

    const onChangeCateringCity = (value) => {
        setCateringCity(value);
    }

    const onChangeCateringPincode = (value) => {
        setCateringPincode(value);
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

    const RentalFoodTypeList = () => {

        const toggleCollapse = () => {
            setIsFoodDropDownCollapsed(!isFoodDropDownCollapsed);
        };

        const onSelectFoodType = (name) => {
            setSelectedFoodType(name);
        }

        const renderItem = ({ item }) => {
            const IconImage = item?.icon;
            return (
                <TouchableOpacity style={styles.item} onPress={() => { onSelectFoodType(item?.name) }}>
                    <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                        {selectedFoodType === item.name ? <FontAwesome5 style={{ marginHorizontal: 1 }} name={'check'} size={14} color={'green'} /> : null}
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: "center" }} onPress={() => { }}>
                        <IconImage style={{ marginHorizontal: 2 }} />
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
                    <Text style={styles.headerText}>Select Food Type</Text>
                    <Icon name={isFoodDropDownCollapsed ? 'arrow-down' : 'arrow-up'} size={20} />
                </TouchableOpacity>
                {!isFoodDropDownCollapsed && (
                    <View style={styles.itemsContainer}>
                        <FlatList
                            data={foodTypes}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                )}
            </View>
        );
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
        if (!mainImageUrl || foodCateringName === '' || cateringDescription === '' ||
            cateringAddress === '' || (overTimeCharges === undefined || overTimeCharges === '') || (advanceAmount === undefined || advanceAmount === '') || finalCombomenu?.length === 0
        ) {
            Alert.alert('Please fill Mandatory fields');
            return;
        }
        for (const [key, value] of Object.entries(additionalImages)) {
            if (value === undefined) {
                Alert.alert('Incomplete Details', `Please fill ${key.replace('additionalImage', 'Image ')}`);
                return;
            }
        }
        finalCombomenu.forEach((obj) => {
            if (obj?.minOrder === 0 && obj?.perPlateCost === 0) {
                Alert.alert('Please fill Mandatory fields', `Details missing for: ${obj.title}`);
                return;
            }
        });


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

        const foodCateringAddressIs = { "address": cateringAddress, "city": cateringCity, "pinCode": cateringPincode };
        formData.append('description', cateringDescription);
        formData.append('foodCateringAddress', JSON.stringify(foodCateringAddressIs));
        formData.append('foodCateringName', foodCateringName);
        formData.append('foodItems', JSON.stringify(finalCombomenu));

        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('discountPercentage', discountPercentage);
        formData.append('available', true);
        formData.append('advanceAmount', advanceAmount);
        formData.append('overTimeCharges', overTimeCharges);
        formData.append('accepted', false);
        formData.append('county', locationCountyVal);
        formData.append('latitude', locationLatitude);
        formData.append('longitude', locationLongitude);
        formData.append('foodType', selectedFoodType);


        console.log('formdata is ::>>', JSON.stringify(formData));
        const token = await getVendorAuthToken();
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/AddFoodCatering`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                setLoading(false);
                console.log('Success', `uploaded successfully`);
                if(isAadharUpdate){
                    Alert.alert(
                        "Confirmation",
                        "Your product posted successfully",
                        [
                            { text: "Ok", onPress: () => navigation.goBack() }
                        ],
                        { cancelable: false }
                    );

                }else{
                Alert.alert(
                    "Confirmation",
                    "Your product posted successfully, Please complete KYC Status",
                    [
                        { text: "Ok", onPress: () =>   navigation.goBack()
                        }
                    ],
                    { cancelable: false }
                );
            }
            } else {
                setLoading(false);
                console.log('Error', 'Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            setLoading(false);
            console.log('Error', 'Failed to upload document');
        }
    }

    const discountPercentageList = () => {

        const onPressDiscountPercentage = (item) => {
            setDiscountPercentage(item);
            setSelectedDiscountVal(item);
        }
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                {discountPercentageArr.map((item) => {
                    const isSelected = item === selectedDiscountVal;
                    const backgroundColor = isSelected ? '#FFD700' : '#FFF5E3';
                    return (
                        <TouchableOpacity style={{ backgroundColor: backgroundColor, marginHorizontal: 10, borderRadius: 5, padding: 10, marginTop: 15 }}
                            onPress={() => onPressDiscountPercentage(item)}
                        >
                            <Text style={{color:themevariable.Color_000000}}>{item} %</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        );
    }

    const renderMenuItem = ({ item }) => (
        <View style={styles.combocontainer}>
            <Text style={styles.combotitle}>{item.title}</Text>
            <Text style={styles.combosubtitle}>Combo Includes</Text>
            <Text style={styles.combotitle}>{item.items.join(', ')}</Text>
            <Text style={styles.comboprice}>Per Plate Price: <Text style={styles.combopriceValue}>{item.perPlateCost}</Text></Text>
            <Text style={styles.combominOrder}>Min Order: <Text style={styles.combopriceValue}>{item.minOrder}</Text></Text>

        </View>
    );


    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address) => {
        // console.log('Selected Location food:', location, address);
        setLocationCountyVal(location?.subDivisionArea);
        setLocationLatitude(location?.region?.latitude || 17.4021);
        setLocationLongitude(location?.region?.longitude || 78.4840);

        setCateringAddress(address);
        setCateringCity(location?.address?.city);
        setCateringPincode(location.pinCode);
        setLocationPickerVisible(false); // Hide the LocationPicker after selection
    };

    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) :
                <View>
                    <Modal visible={isLocationPickerVisible} animationType="slide">
                        <LocationPicker onLocationSelected={handleLocationSelected} onBack={handleCloseLocationPicker}/>
                        {/* <Button title="Close" onPress={handleCloseLocationPicker} /> */}
                    </Modal>
                    <View style={styles.mainContainer}>
                        <ChooseFileField
                            label={'Catering Image'}
                            isRequired={true}
                            placeholder={'Add Catering Image'}
                            onPressChooseFile={openGalleryOrCamera}
                        />
                         <TouchableOpacity onPress={() => { openGalleryOrCamera() }}>
                        {mainImageUrl ?
                            <Image
                                source={{ uri: mainImageUrl?.assets[0]?.uri }}
                                width={'100%'}
                                height={300}
                                resizeMode='cover'
                            /> : null}
                        </TouchableOpacity>

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
                            label='Catering Name'
                            placeholder="Please Enter Catering Name"
                            value={foodCateringName}
                            onChangeHandler={onChangeCateringName}
                            keyboardType='default'
                            isRequired={true}
                        />

                        <TextField
                            label='Catering Description'
                            placeholder="Describe about your service"
                            value={cateringDescription}
                            onChangeHandler={onChangeDescription}
                            keyboardType='default'
                            isRequired={true}
                            isDescriptionField={true}
                        />
                        <Text style={styles.labelText}>Food Type</Text>
                        {RentalFoodTypeList()}
                    </View>

                    <Text style={styles.title}>Add Menu Items</Text>
                    <View style={styles.mainContainer}>
                        <FoodMenu onSaveClick={(menuItems) => {
                            setcomboModalSuccess(true);
                            setFinalComboMenu(prevMenu => [...prevMenu, ...menuItems]);

                        }} />
                    </View>

                    <CustomModal
                        visible={comboModalSuccess}
                        message={'Combo Successfully Added'}
                        onClose={() => setcomboModalSuccess(false)}
                    />

                    {finalCombomenu?.length > 0 ?
                        <View style={styles.mainContainer}>
                            <Text style={styles.addedComboText}>Added Combos</Text>
                            <FlatList
                                data={finalCombomenu.filter(item => item.items?.length > 0)}
                                renderItem={renderMenuItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View> :
                        null}

                    <Text style={styles.title}>Pricing Details</Text>
                    <View style={styles.mainContainer}>

                        <TextField
                            label='Advance Booking Amount'
                            placeholder="Please Enter Advance Booking Amount"
                            value={advanceAmount}
                            onChangeHandler={onChangeAdvanceAmount}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                        <Text style={styles.commissionLabel}>Service Fee Details:</Text>
                        <Text style={styles.discountlabel}>3% for orders below ₹10,000</Text>
                        <Text style={styles.discountlabel}>5% for orders above ₹10,000</Text>

                        {/* <Text style={styles.textInputlabel}>Discount if any</Text> */}
                        {/* {discountPercentageList()} */}
                        
                        <TextField
                            label='Travel Chargers'
                            placeholder="Please Enter Travel Charges"
                            value={overTimeCharges}
                            onChangeHandler={onChangeOverTimeCharges}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                    </View>

                    <Text style={styles.title}>Catering Address</Text>
                    <View style={styles.mainContainer}>

                        <Text style={styles.textInputlabel}>
                            Address<Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TouchableOpacity onPress={handleOpenLocationPicker} style={[styles.textTnputView, { height: 100, flexDirection: "row", }]}>
                            <View style={{ height: '100%', width: "85%" }}>
                                <TextInput
                                    onChangeText={onChangeCateringAddress}
                                    value={cateringAddress}
                                    placeholder="Please Enter Address"
                                    keyboardType={'default'}
                                    style={styles.addressTextInput}
                                    multiline={true}
                                    numberOfLines={4}
                                    editable={false}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <DetectLocation />
                            </View>
                        </TouchableOpacity>

                        <TextField
                            label='City'
                            placeholder="Please Enter City"
                            value={cateringCity}
                            onChangeHandler={onChangeCateringCity}
                            keyboardType='default'
                            isRequired={false}
                        />
                        <TextField
                            label='Pin code'
                            placeholder="Please Enter Pin code"
                            value={cateringPincode}
                            onChangeHandler={onChangeCateringPincode}
                            keyboardType='number-pad'
                            isRequired={false}
                        />
                    </View>

                    <TouchableOpacity onPress={() => { onPressSaveAndPost() }} style={{ padding: 10, backgroundColor: '#FFF5E3', alignSelf: 'center', borderRadius: 5, borderColor: '#ECA73C', borderWidth: 2, marginTop: 40, bottom: 20 }}>
                        <Text style={{ color: '#ECA73C' }}> Save & Post </Text>
                    </TouchableOpacity>

                </View>
            }

        </View>
    )
}

export default GeneralDetails

const styles = StyleSheet.create({
    container:{ 
        alignSelf: 'center',
         flex: 1,
          width: '100%',
           height: Dimensions.get('window').height,
            justifyContent: 'center' 
        },
    mainContainer: {
        backgroundColor: themevariable.Color_FFFFFF,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 15,
        flex: 1
    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 18,
        marginTop: 10
    },
    labelText: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 20,
        bottom: 10
    },
    subTitle: {
        fontFamily: 'ManropeRegular',
        color: themevariable.Color_000000,
        fontSize: 13,
        marginTop: 7,
        marginBottom: 10,
    },
    imageContainer: {
        alignSelf: 'center',

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
    container: {
        // backgroundColor: '#FFF4E1',
        // padding: 10,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFF7E7',
        borderRadius: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color:themevariable.Color_000000,
    },
    itemsContainer: {
        marginTop: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        width: "50%"
    },
    itemText: {
        fontSize: 14,
        marginHorizontal: 10,
        color:themevariable.Color_000000,
    },
    textInputlabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    commissionLabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    discountlabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: '600',
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
    },
    addedComboText:{ 
        color: "black", 
        fontSize: 14, 
        fontWeight: "500",
         marginBottom: 5, 
         marginHorizontal: 8 
    },
    addressTextInput:{ 
        height: '100%', 
        textAlignVertical: 'top', 
        padding: 10,
        color:themevariable.Color_000000,
    },
    combocontainer: {
        marginHorizontal: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width:Dimensions.get('window').width - 150
    },
    combotitle: {
        color: 'black',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
    },
    combosubtitle: {
        marginTop: 5,
        color: 'black',
        fontSize: 10,
        fontWeight: '200',
        fontFamily: 'ManropeRegular',
    },
    comboitems: {
        marginTop: 2,
        color: 'black',
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'ManropeRegular',
        width: '60%',
    },
    comboprice: {
        marginTop: 5,
        color: '#FE8235',
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'ManropeRegular',
    },
    combopriceValue: {
        marginTop: 5,
        color: '#FE8235',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'ManropeRegular',
    },
    combominOrder: {
        marginTop: 5,
        color: '#FE8235',
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'ManropeRegular',
    },
})