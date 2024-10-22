import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, TextInput, ScrollView, alert, ActivityIndicator, Modal, Button } from 'react-native';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import themevariable from '../../../utils/themevariable';
import TextField from '../../../commonFields/TextField';
import SelectField from '../../../commonFields/SelectField';
import UploadIcon from '../../../assets/svgs/uploadIcon.svg';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { Dropdown } from 'react-native-element-dropdown';
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

const EditAddFoodCatering = () => {
    const [comboModalSuccess, setcomboModalSuccess] = useState(false);
    const [overTimeCharges, setOverTimeCharges] = useState();
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [foodCateringName, setFoodCateringName] = useState('');
    const [cateringDescription, setCateringDescription] = useState('');
    const navigation = useNavigation();

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

    const [selectedItems, setSelectedItems] = useState({});
    const [foodMenuItems, setFoodMenuItems] = useState();
    const [comboPrice, setComboPrice] = useState({});
    const [minOrderMembers, setMinOrderMembers] = useState({});
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const discountPercentageArr = ['5', '10', '15', '20', '30', '50'];
    const [selectedDiscountVal, setSelectedDiscountVal] = useState();
    const [loading, setLoading] = useState(false);
    const [isFoodDropDownCollapsed, setIsFoodDropDownCollapsed] = useState(true);
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
    const [customisedItems, setCustomisedItems] = useState([]);
    const [finalCombomenu, setFinalComboMenu] = useState([]);

    const onChangeDescription = (value) => {
        setCateringDescription(value);
    }

    const onChangetentHouseName = (value) => {
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

    const onChangetentHouseCity = (value) => {
        setCateringCity(value);
    }

    const onChangetentHousePincode = (value) => {
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
    const transformInput = (input) => {
        return Object.entries(input).map(([key, value]) => {
            return {
                itemName: value[0].itemName || value[0].name,
                perDayPrice: value[0].perDayPrice || 0
            };
        });
    };

    const onPressSaveAndPost = async () => {
        if ( finalCombomenu?.length === 0
        ) {
            Alert.alert('Please fill Mandatory fields');
            return;
        }
       
        finalCombomenu.forEach((obj) => {
            if (obj?.minOrder === 0 && obj?.perPlateCost === 0) {
                Alert.alert('Please fill Mandatory fields', `Details missing for: ${obj.title}`);
                return;
            }
        });


        const vendorMobileNumber = vendorLoggedInMobileNum;
        let payload = {
            newFoodItems: finalCombomenu,
            vendorMobileNumber: vendorMobileNumber

        };
        const token = await getVendorAuthToken();
        console.log("payload is::::::", JSON.stringify(payload));
        setLoading(true);
        try {
            const response = await axios.patch(`${BASE_URL}/updateExistingFoodCateringItems/ByVendorMobileNumber`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.status === 200) {
                setLoading(false);
                console.log('Success', `uploaded successfully`);
                Alert.alert(
                    "Confirmation",
                    "Your product posted successfully",
                    [
                        // {
                        //     text: "No",
                        //     onPress: () => console.log("No Pressed"),
                        //     style: "cancel"
                        // },
                        { text: "Ok", onPress: () => navigation.goBack() }
                    ],
                    { cancelable: false }
                );
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
                            <Text>{item} %</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        );
    }

    const renderMenuItem = ({ item }) => (
        <View style={{ marginHorizontal: 5, backgroundColor: "white", borderWidth: 1, borderColor: "lightgray", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 10 }}>
            <Text style={{ color: "black", fontSize: 14, fontWeight: "700", fontFamily: 'ManropeRegular' }}>{item.title}</Text>
            <Text style={{ marginTop: 5, color: "black", fontSize: 10, fontWeight: "200", fontFamily: 'ManropeRegular' }}>Combo Includes</Text>
            <Text style={{ marginTop: 2, color: "black", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular', width: "60%" }}>{item.items.join(', ')}</Text>
            <Text style={{ marginTop: 5, color: "#FE8235", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular' }}>Per Plate Price: {item.perPlateCost}</Text>
            <Text style={{ marginTop: 5, color: "#FE8235", fontSize: 12, fontWeight: "400", fontFamily: 'ManropeRegular' }}>Min Order: {item.minOrder}</Text>

        </View>
    );


    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address) => {
        console.log('Selected Location food:', location, address);
        setLocationCountyVal(location?.subDivisionArea);
        setLocationLatitude(location?.region?.latitude);
        setLocationLongitude(location?.region?.longitude);

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
                <View style={{ alignSelf: 'center', flex: 1, width: '100%', height: Dimensions.get('window').height, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) :
                <View>

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
                            <Text style={{ color: "black", fontSize: 14, fontWeight: "500", marginBottom: 5, marginHorizontal: 8 }}>Added Combos</Text>
                            <FlatList
                                data={finalCombomenu.filter(item => item.items?.length > 0)}
                                renderItem={renderMenuItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View> :
                        null}

                    <TouchableOpacity onPress={() => { onPressSaveAndPost() }} style={{ padding: 10, backgroundColor: '#FFF5E3', alignSelf: 'center', borderRadius: 5, borderColor: '#ECA73C', borderWidth: 2, marginTop: 40, bottom: 20 }}>
                        <Text style={{ color: '#ECA73C' }}> Save & Post </Text>
                    </TouchableOpacity>

                </View>
            }

        </View>
    )
}

export default EditAddFoodCatering

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
        marginTop: 10,
        marginHorizontal:20
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
        backgroundColor: '#FFD7B5',
        borderRadius: 5,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amenitiesContainer: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#FFF5E3',
        padding: 10,
        borderRadius: 5
    },
    itemButton: {
        // padding: 10,
        borderRadius: 10,
    },
    itemText: {
        marginHorizontal: 5,
    },
    input: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
    },
    inputContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        marginBottom: 10,
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
    icon: {
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
        marginHorizontal: 10
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