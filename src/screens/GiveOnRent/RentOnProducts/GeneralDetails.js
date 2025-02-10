import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, Modal, ActivityIndicator, Button, TextInput, ScrollView, BackHandler } from 'react-native';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import themevariable from '../../../utils/themevariable';
import TextField from '../../../commonFields/TextField';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from '../../../apiconfig';
import LocationPicker from '../../../components/LocationPicker';
import DetectLocation from '../../../assets/svgs/detectLocation.svg';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../../utils/GlobalFunctions';


const GeneralDetails = ({ isAadharUpdate }) => {
    console.log("isAadharUpdate value at fomr", isAadharUpdate);
    const navigation = useNavigation();
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
    const [locationLatitude, setLocationLatitude] = useState();
    const [locationLongitude, setLocationLongitude] = useState();
    const [locationCountyVal, setLocationCountyVal] = useState();
    const [productCity, setProductCity] = useState('');
    const [productPinCode, setProductPinCode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState();
    const [perMonthRentPrice, setPerMonthRentPrice] = useState();
    const [securityDeposit, setSecurityDeposit] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState('');
    const discountPercentageArr = ['0', '5', '10', '15', '20', '25', '30', '50'];
    const [selectedDiscountVal, setSelectedDiscountVal] = useState();
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const jewelleryTypes = ["Rings", "Bridal", "Chains", "Ear Rings", "Bangles", "Bracelets"];
    const [jewelleryTypeSelected, setJewelleryTypeSelected] = useState();
    const [jewelleryTypeVal, setJewelleryTypeVal] = useState();
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [genderTypeSelected, setGenderTypeSelected] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [clothSize, setClothSize] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    // Options for radio buttons
    const options = [
        { id: 'clothes', label: 'Clothes' },
        { id: 'jewels', label: 'Jewels' }
    ];

    const genderTypes = [
        { id: 'mens', label: 'Mens' },
        { id: 'womens', label: 'Womens' }
    ];

    const clothesSizeData = [
        { label: 'Small (S)', value: 'S' },
        { label: 'Medium (M)', value: 'M' },
        { label: 'Large (L)', value: 'L' },
        { label: 'Extra Large (XL)', value: 'XL' },
        { label: 'XXL', value: 'XXL' },
    ];
    const colorOptions = [
        { label: 'Red', value: '#FF5733' },
        { label: 'Green', value: '#33FF57' },
        { label: 'Blue', value: '#3357FF' },
        { label: 'Pink', value: '#FF33A8' },
        { label: 'Yellow', value: '#FFC300' },
        { label: 'Dark Red', value: '#C70039' },
        { label: 'Purple', value: '#581845' },
        { label: 'Light Green', value: '#DAF7A6' },
        { label: 'Black', value: '#000000' },
        { label: 'White', value: '#FFFFFF' },
        { label: 'Gray', value: '#808080' },
        { label: 'Orange', value: '#FFA500' },
        { label: 'Brown', value: '#A52A2A' },
        { label: 'Cyan', value: '#00FFFF' },
        { label: 'Magenta', value: '#FF00FF' },
        { label: 'Light Blue', value: '#ADD8E6' },
        { label: 'Lime', value: '#00FF00' },
        { label: 'Gold', value: '#FFD700' },
        { label: 'Silver', value: '#C0C0C0' },
        { label: 'Teal', value: '#008080' },
        { label: 'Navy', value: '#000080' },
        { label: 'Indigo', value: '#4B0082' },
        { label: 'Beige', value: '#F5F5DC' },
        { label: 'Coral', value: '#FF7F50' },
        { label: 'Lavender', value: '#E6E6FA' },
        { label: 'Turquoise', value: '#40E0D0' },
        { label: 'Peach', value: '#FFDAB9' }
    ];


    const handleBackPress = () => {
        if (isLocationPickerVisible) {
            setLocationPickerVisible(false);
            // Close the modal
            return true; // Prevent default back button behavior (i.e., exiting the app)
        }
        return false;  // Allow default behavior (i.e., exiting the app if the modal is not open)
    };

    useEffect(() => {
        // Add listener when the component is mounted
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Clean up the listener when the component is unmounted
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [isLocationPickerVisible]);

    const renderItem = (item) => (
        <View style={styles.itemContainer}>
            <View style={[styles.colorBox, { backgroundColor: item?.value }]} />
            <Text style={styles.label}>{item.label}</Text>
        </View>
    );

    const handleSelect = (id) => {
        setSelectedOption(id);
    };

    const handleGenderTypeSelect = (id) => {
        setGenderTypeSelected(id);
    };

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

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

    const onChangeSecurityDepositAmount = (value) => {
        setSecurityDeposit(value);
    }

    const onChangeAdvanceAmount = (value) => {
        setAdvanceAmount(value);
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

    const calculateCharges = () => {
        const earningAmount = perDayRentPrice - (perDayRentPrice * discountPercentage / 100);
        const serviceFeePercentage = earningAmount < 10000 ? 0.03 : 0.05; // 3% for < ₹10,000, 5% for ≥ ₹10,000
        const serviceCharges = earningAmount * serviceFeePercentage;
        const finalEarningAfterDiscount = earningAmount - serviceCharges;

        return { finalEarningAfterDiscount, earningAmount, serviceCharges }

    }

    const onPressSaveAndPost = async () => {
        const { finalEarningAfterDiscount, earningAmount, serviceCharges } = calculateCharges();
        // console.log('selectedOption os:::>>', finalEarningAfterDiscount.toFixed(2), earningAmount.toFixed(2), serviceCharges.toFixed(2));

        if (!mainImageUrl || productName === '' ||
            (perDayRentPrice === '' || perDayRentPrice === undefined) || productAddress === '' || (securityDeposit === undefined || securityDeposit === '') || (selectedOption == null)
            || (selectedColor === '' && ((selectedOption !== null
                && selectedOption === 'clothes'))) || (clothSize === '' && ((selectedOption !== null
                    && selectedOption === 'clothes')))
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

        formData.append('genderType', genderTypeSelected);
        formData.append('categoryType', selectedOption);
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
        // formData.append('advanceAmount', advanceAmount);
        formData.append('discountPercentage', discountPercentage);
        formData.append('county', locationCountyVal);
        formData.append('latitude', locationLatitude);
        formData.append('longitude', locationLongitude);
        formData.append('jewellaryType', jewelleryTypeSelected);
        formData.append('size', clothSize);
        formData.append('color', selectedColor);
        formData.append('serviceCharges', serviceCharges.toFixed(2));
        formData.append('vendorEarningAmount', earningAmount.toFixed(2));
        formData.append('vendorEarningAmountAfterDiscount', finalEarningAfterDiscount.toFixed(2))

        console.log('formdata is ::>>', JSON.stringify(formData));
        const token = await getVendorAuthToken();
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/AddClothJewels`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                setLoading(false);
                console.log('Success', `uploaded successfully`);
                if (isAadharUpdate) {
                    Alert.alert(
                        "Confirmation",
                        "Your product posted successfully",
                        [
                            { text: "OK", onPress: () => navigation.goBack() }
                        ],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(
                        "Confirmation",
                        "Your product posted successfully, Please complete the KYC status",
                        [
                            { text: "OK", onPress: () => navigation.goBack() }
                        ],
                        { cancelable: false }
                    );
                }
            } else {
                setLoading(false);
                console.log('Error', 'Failed to upload document');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error uploading document:', error);
            console.log('Error', 'Failed to upload document');
        }
    }

    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address) => {
        console.log('Selected Location products:', location, address);
        setLocationCountyVal(location?.subDivisionArea);
        setLocationLatitude(location?.region?.latitude || 17.4021);
        setLocationLongitude(location?.region?.longitude || 78.4840);
        setProductAddress(address);
        setProductCity(location?.address?.city);
        setProductPinCode(location.pinCode);
        setLocationPickerVisible(false); // Hide the LocationPicker after selection
    };

    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };

    const discountPercentageList = () => {
        const onPressDiscountPercentage = (item) => {
            setDiscountPercentage(item);
            setSelectedDiscountVal(item);
        };

        return (
            <FlatList
                data={discountPercentageArr}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingVertical: 15 }}
                renderItem={({ item }) => {
                    const isSelected = item === selectedDiscountVal;
                    const backgroundColor = isSelected ? '#FFD700' : '#FFF5E3';

                    return (
                        <TouchableOpacity
                            style={{
                                backgroundColor,
                                flex: 1,
                                margin: 5,
                                borderRadius: 5,
                                padding: 10,
                                alignItems: 'center',
                            }}
                            onPress={() => onPressDiscountPercentage(item)}
                        >
                            <Text style={{ color: themevariable.Color_000000 }}>{item} %</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        );
    };


    const jewelleryTypeList = () => {
        const onPressJewelleryType = (item) => {
            setJewelleryTypeSelected(item);
            setJewelleryTypeVal(item);
        };

        return (
            <FlatList
                data={jewelleryTypes}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingVertical: 15 }}
                renderItem={({ item }) => {
                    const isSelected = item === jewelleryTypeVal;
                    const backgroundColor = isSelected ? '#FFD700' : '#FFF5E3';

                    return (
                        <TouchableOpacity
                            style={{
                                backgroundColor,
                                flex: 1,
                                margin: 5,
                                borderRadius: 5,
                                padding: 10,
                                alignItems: 'center',
                            }}
                            onPress={() => onPressJewelleryType(item)}
                        >
                            <Text style={{ color: themevariable.Color_000000 }}>{item}</Text>
                        </TouchableOpacity>
                    );
                }}
            />
        );
    };



    return (
        <View>
            {loading ? (
                <View style={{ alignSelf: 'center', flex: 1, width: '100%', height: Dimensions.get('window').height, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) :
                <View>
                    <Modal visible={isLocationPickerVisible} animationType="slide" onRequestClose={() => handleCloseLocationPicker()}>
                        <LocationPicker onLocationSelected={handleLocationSelected} onBack={handleCloseLocationPicker} />
                        {/* <Button title="Close" onPress={handleCloseLocationPicker} /> */}
                    </Modal>


                    <View style={styles.mainContainer}>
                        <ChooseFileField
                            label={'Product Image'}
                            isRequired={true}
                            placeholder={'Main Image'}
                            onPressChooseFile={openGalleryOrCamera}
                        />
                        <TouchableOpacity onPress={() => { openGalleryOrCamera() }}>
                            {mainImageUrl ?
                                <Image
                                    source={{ uri: mainImageUrl?.assets[0].uri }}
                                    width={'100%'}
                                    height={300}
                                    resizeMode='cover'
                                /> : null}
                        </TouchableOpacity>

                        <Text style={styles.title}>Additional Images<Text style={{ color: "red" }}>*</Text></Text>
                        <Text style={styles.subTitle}>Please add up to 4 images</Text>
                        <FlatList
                            data={data}
                            renderItem={ListItem}
                            keyExtractor={item => item.id}
                            horizontal
                            contentContainerStyle={{ width: '100%', justifyContent: 'space-around' }}
                        />
                        <View style={styles.radioViewcontainer}>
                            <Text style={[styles.title, {}]}>Choose an option<Text style={{ color: "red" }}>*</Text></Text>
                            {options.map(option => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.radioContainer}
                                    onPress={() => handleSelect(option.id)}
                                >
                                    <View style={styles.radioCircle}>
                                        {selectedOption === option.id && <View style={styles.selectedCircle} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* add here */}
                        {selectedOption !== null ?
                            selectedOption === 'clothes' ?
                                <View style={styles.radioViewcontainer}>
                                    <Text style={[styles.title, {}]}>Select the Gender<Text style={{ color: "red" }}>*</Text></Text>
                                    {genderTypes.map(option => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={styles.radioContainer}
                                            onPress={() => handleGenderTypeSelect(option.id)}
                                        >
                                            <View style={styles.radioCircle}>
                                                {genderTypeSelected === option.id && <View style={styles.selectedCircle} />}
                                            </View>
                                            <Text style={styles.radioLabel}>{option.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                :
                                <>
                                    <Text style={styles.textInputlabel}>Select the jewellery type<Text style={{ color: "red" }}>*</Text></Text>
                                    {jewelleryTypeList()}
                                </>
                            : null}
                        <TextField
                            label='Product Name'
                            placeholder="Please Enter Product Name"
                            value={productName}
                            onChangeHandler={onChangeProductName}
                            keyboardType='default'
                            isRequired={true}
                        />

                        <TextField
                            label='Brand Name'
                            placeholder="Please Enter Brand Name"
                            value={productBrand}
                            onChangeHandler={onChangeProductBrand}
                            keyboardType='default'
                            isRequired={false}
                        />
                        {(selectedOption !== null
                            && selectedOption === 'clothes') ?
                            <>
                                <Text style={styles.sizeLabel}>Select Cloth Size<Text style={{ color: "red" }}>*</Text></Text>
                                <Dropdown
                                    style={[styles.dropdown]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={clothesSizeData}
                                    activeColor={'#f0e68c'}
                                    selectedStyle={{ backgroundColor: "red" }}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={'Select Size'}
                                    value={clothSize}
                                    containerStyle={{ borderColor: "orange", borderWidth: 1, borderRadius: 5 }}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setClothSize(item.value);
                                        setIsFocus(false);
                                    }}
                                />

                                <Text style={styles.sizeLabel}>Select Cloth Color<Text style={{ color: "red" }}>*</Text></Text>

                                <Dropdown
                                    style={styles.dropdown}
                                    data={colorOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select a color"
                                    value={selectedColor}
                                    selectedTextStyle={[styles.selectedTextStyle, { marginHorizontal: 5 }]}
                                    activeColor={'#f0e68c'}
                                    onChange={(item) => {
                                        setSelectedColor(item?.value);
                                        console.log(`Selected Color Code: ${item.value}`);
                                    }}
                                    renderItem={renderItem}
                                    renderLeftIcon={() => <View style={{ backgroundColor: selectedColor, borderRadius: 15, width: 20, height: 20 }} />}
                                />
                            </> : null}


                        <TextField
                            label='Description'
                            placeholder="Please Enter Description"
                            value={productDescription}
                            onChangeHandler={onChangeDescription}
                            keyboardType='default'
                            isRequired={false}
                            isDescriptionField={true}
                        />
                    </View>
                    <Text style={[styles.title, { marginHorizontal: 10 }]}>Rent Type</Text>
                    <View style={[styles.mainContainer, { paddingVertical: 0 }]}>
                        <TextField
                            label='Day Price (₹ / 1 day)'
                            placeholder="Please Enter per Day Price"
                            value={perDayRentPrice}
                            onChangeHandler={onChangePerDayRentPrice}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                        {
                            !isNaN(perDayRentPrice - (perDayRentPrice * discountPercentage / 100)) && perDayRentPrice ? (
                                <>
                                    {(() => {
                                        const discountedPrice = perDayRentPrice - (perDayRentPrice * discountPercentage / 100);
                                        const serviceFeePercentage = discountedPrice < 10000 ? 0.03 : 0.05; // 3% for < ₹10,000, 5% for ≥ ₹10,000
                                        const serviceFee = discountedPrice * serviceFeePercentage;
                                        const finalEarning = discountedPrice - serviceFee;

                                        return (
                                            <>
                                                <Text style={styles.discountlabel}>
                                                    Your Product Price (After Discount):
                                                    <Text style={styles.highlightedValue}>{formatAmount(discountedPrice.toFixed(2))}</Text>
                                                </Text>
                                                <Text style={styles.discountlabel}>
                                                    Service Fee ({serviceFeePercentage * 100}%):
                                                    <Text style={styles.highlightedValue}>{formatAmount(serviceFee.toFixed(2))}</Text>
                                                </Text>
                                                <Text style={styles.discountlabel}>
                                                    Your Earning (After Service Fee):
                                                    <Text style={styles.highlightedValue}>{formatAmount(finalEarning.toFixed(2))}</Text>
                                                </Text>
                                            </>
                                        );
                                    })()}
                                </>
                            ) : null
                        }
                        <Text style={styles.commissionLabel}>Service Fee Details:</Text>
                        <Text style={styles.discountlabel}>3% for orders below ₹10,000</Text>
                        <Text style={styles.discountlabel}>5% for orders above ₹10,000</Text>

                        <TextField
                            label='Security Deposit'
                            placeholder="Please Enter Security Deposit"
                            value={securityDeposit}
                            onChangeHandler={onChangeSecurityDepositAmount}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                        <Text style={styles.textInputlabel}>Discount if any</Text>
                        {discountPercentageList()}
                    </View>
                    <Text style={[styles.title, { marginTop: 10, marginHorizontal: 10 }]}>Item Available Address</Text>
                    <View style={[styles.mainContainer, { paddingVertical: 10 }]}>
                        <Text style={[styles.textInputlabel,{marginTop:5}]}>
                            Address<Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TouchableOpacity onPress={handleOpenLocationPicker} style={[styles.textTnputView, { height: 100, flexDirection: "row", }]}>
                            <View style={{ height: '100%', width: "85%" }}>
                                <TextInput
                                    onChangeText={onChangeAddress}
                                    value={productAddress}
                                    placeholder="Please Enter Address"
                                    keyboardType={'default'}
                                    placeholderTextColor={"#7E8389"}
                                    style={{ height: '100%', textAlignVertical: 'top', padding: 10, color: themevariable.Color_000000, }}
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
                            value={productCity}
                            onChangeHandler={onChangeCity}
                            keyboardType='default'
                            isRequired={false}
                        />
                        <TextField
                            label='Pin code'
                            placeholder="Please Enter Pin code"
                            value={productPinCode}
                            onChangeHandler={onChangePinCode}
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
    radioViewcontainer: {
        // marginTop: 10
    },
    radioTextlabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sizeLabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    colorBlock: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
        marginTop: 15,
        borderWidth: 2, // border for selection
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 10,


    },
    colorBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: themevariable.Color_FD813B,
    },
    radioLabel: {
        fontSize: 16,
        fontFamily: 'ManropeRegular',
        color: themevariable.Color_000000,
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
        borderRadius: 5
    },
    icon: {
        marginRight: 5,
    },
    label: {
        fontSize: 14,
        fontFamily: 'ManropeRegular',
        fontWeight: "400",
        color: "black",
    },
    commissionLabel: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 15,
        marginTop: 15
    },
    placeholderStyle: {
        fontSize: 14,
        color: "gray",
        fontFamily: 'ManropeRegular',
        fontWeight: "400"
    },
    selectedTextStyle: {
        fontSize: 14,
        color: "black",
        fontFamily: 'ManropeRegular',
        fontWeight: "400",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: themevariable.Color_000000,
    },
    textInputlabel: {
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
    highlightedValue: {
        fontWeight: 'bold',
        color: '#FD813B', // Blue color for highlighting values
    },
    textTnputView: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: themevariable.Color_C8C8C6,
        borderRadius: 5,
    }

})