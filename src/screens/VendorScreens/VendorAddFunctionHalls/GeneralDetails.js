import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, Modal, Button, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import themevariable from '../../../utils/themevariable';
import TextField from '../../../commonFields/TextField';
import SelectField from '../../../commonFields/SelectField';
import UploadIcon from '../../../assets/svgs/uploadIcon.svg';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { launchImageLibrary } from 'react-native-image-picker';
import BASE_URL from '../../../apiconfig';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import CrossIcon from '../../../assets/vendorIcons/crossIcon.svg';
import VegNonVegIcon from '../../../assets/svgs/foodtype/vegNonveg.svg';
import VegIcon from '../../../assets/svgs/foodtype/veg.svg';
import NonVegIcon from '../../../assets/svgs/foodtype/NonVeg.svg';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import LocationPicker from '../../../components/LocationPicker';
import DetectLocation from '../../../assets/svgs/detectLocation.svg';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const GeneralDetails = () => {
    const [BedRooms, setBedRooms] = useState();
    const [foodType, setFoodType] = useState('');
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [functionHallName, setfunctionHallName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isFoodDropDownCollapsed, setIsFoodDropDownCollapsed] = useState(true);
    const [selectedFoodType, setSelectedFoodType] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined
    });
    const [functionHallAddress, setfunctionHallAddress] = useState('');
    const [functionHallCity, setfunctionHallCity] = useState('');
    const [functionHallPinCode, setfunctionHallPinCode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState();
    const [perKMPrice, setPerKMPrice] = useState();
    const [perMonthRentPrice, setPerMonthRentPrice] = useState();
    const [securityDeposit, setSecurityDeposit] = useState();
    const [available, setAvailable] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState();
    const [overTimeCharges, setOverTimeCharges] = useState();
    const [selectedItemArray, setSelectedItemArray] = useState([]);
    const [selectedFoodTypeItem, setSelectedFoodTypeItem] = useState('');
    const [itemPrices, setItemPrices] = useState({});
    const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState('');

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const discountPercentageArr = ['5', '10', '15', '20', '30', '50'];
    const [selectedDiscountVal, setSelectedDiscountVal] = useState();

    const [loading, setLoading] = useState(false);

    // console.log('vendorLoggedInMobileNum is ::>>',vendorLoggedInMobileNum);

    const [rentalItemPricingDetails, setRentalItemPricingDetails] = useState({
        "Tables with basic covers": [{ "itemName": "Tables with basic covers", "perDayPrice": 0 }],
        "Chairs": [{ "itemName": "Chairs", "perDayPrice": 0 }],
        "Restrooms/Toilets": [{ "itemName": "Restrooms/Toilets", "perDayPrice": 0 }],
        "Parking": [{ "itemName": "Parking", "perDayPrice": 0 }],
        "Wheelchair access": [{ "itemName": "Wheelchair access", "perDayPrice": 0 }],
        "Coolers / Fans": [{ name: 'Coolers / Fans', icon: 'ios-flame' }],
        "Air Conditioners": [{ name: 'Air Conditioners', icon: 'ios-restaurant' }],
        "Power Backup/Generator": [{ name: 'Power Backup/Generator', icon: 'ios-snow' }],
        "Bedrooms": [{ name: 'Bedrooms', icon: 'ios-cut' }],
        "Lighting": [{ name: 'Lighting', icon: 'ios-basket' }],
        "Kitchen Space": [{ name: 'Kitchen Space', icon: 'ios-cut' }],
        "Bridal Room": [{ name: 'Bridal Room', icon: 'ios-basket' }],
        "Sound/music license": [{ name: 'Sound/music license', icon: 'ios-volume-high' }]
    });
    const rows = [];

    const foodTypes = [
        { name: 'veg', icon: VegIcon },
        { name: 'non-veg', icon: NonVegIcon },
        { name: 'Both', icon: VegNonVegIcon }
    ]

    const seatingCapacity = ['0-100', '100-200', '200-300', '300+']
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);

    const rentalItems = [
        { name: 'Tables with basic covers' },
        { name: 'Chairs' },
        { name: 'Restrooms/Toilets' },
        { name: 'Parking' },
        { name: 'Wheelchair access' },
        { name: 'Coolers / Fans' },
        { name: 'Air Conditioners' },
        { name: 'Bedrooms' },
        { name: 'Sound/music license' },
        { name: 'Lighting' },
        { name: 'Power Backup' },
        { name: 'Bridal Room' },
        { name: 'Kitchen Space' }
    ];

    const onChangePerKMChargePrice = (value) => {
        setPerKMPrice(value);
    }

    const onChangeBedRooms = (value) => {
        setBedRooms(value);
    }

    const onChangeFoodType = (value) => {
        setFoodType(value);
    }

    const onChangeDescription = (value) => {
        setProductDescription(value);
    }

    const onChangefunctionHallName = (value) => {
        setfunctionHallName(value);
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

    const onChangeOverTimeCharges = (value) => {
        setOverTimeCharges(value);
    }

    const onChangefunctionHallAddress = (value) => {
        setfunctionHallAddress(value);
    }

    const onChangefunctionHallCity = (value) => {
        setfunctionHallCity(value);
    }

    const onChangefunctionHallPinCode = (value) => {
        setfunctionHallPinCode(value);
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
        if (!mainImageUrl || functionHallName === '' || productDescription === '' || functionHallCity === '' ||
            selectedItemArray?.length === 0 || (perDayRentPrice === '' || perDayRentPrice === undefined) || selectedItemArray === '' || (BedRooms === '' || BedRooms === undefined) || functionHallAddress === '' || functionHallPinCode === '' || (overTimeCharges === undefined || overTimeCharges === '') || (advanceAmount === undefined || advanceAmount === '') || (discountPercentage === undefined || discountPercentage === '')
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

        const functionHallAddessIs = { "address": functionHallAddress, "city": functionHallCity, "pinCode": functionHallPinCode };
        console.log('selectedItemArray is ::>>>', selectedItemArray)
        formData.append('serviceType', 'driver');
        formData.append('description', productDescription);
        // formData.append('subscriptionChargesPerMonth', perMonthRentPrice);
        formData.append('hallAmenities', selectedItemArray);
        formData.append('functionHallName', functionHallName);
        formData.append('rentPricePerDay', perDayRentPrice);
        formData.append('bedRooms', BedRooms);
        formData.append('available', true);
        formData.append('functionHallAddress', JSON.stringify(functionHallAddessIs));
        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('advanceAmount', advanceAmount);
        formData.append('discountPercentage', discountPercentage);
        formData.append('seatingCapacity', selectedSeatingCapacity);
        formData.append('accepted', false);
        formData.append('overTimeCharges', overTimeCharges);

        console.log('formdata is ::>>', formData);
        const token = await getVendorAuthToken();
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/AddFunctionHall`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
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
                        { text: "Ok", onPress: () => console.log("yes pressed") }
                    ],
                    { cancelable: false }
                );
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

    const discountPercentageList = () => {

        const onPressDiscountPercentage = (item) => {
            setDiscountPercentage(item);
            setSelectedDiscountVal(item);
        }

        <Modal visible={isLocationPickerVisible} animationType="slide">
            <LocationPicker onLocationSelected={handleLocationSelected} />
            <Button title="Close" onPress={handleCloseLocationPicker} />
        </Modal>
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

    const ItemList = () => {
        const screenWidth = Dimensions.get('window').width;

        // Function to render items in rows
        const renderItemsInRows = () => {
            const itemsPerRow = [];
            let currentRow = [];
            let currentRowWidth = 0;

            selectedItemArray.forEach((itemName) => {
                const itemWidth = measureTextWidth(itemName) + 20; // Add padding and margin

                if (currentRowWidth + itemWidth > screenWidth) {
                    itemsPerRow.push(currentRow);
                    currentRow = [itemName];
                    currentRowWidth = itemWidth;
                } else {
                    currentRow.push(itemName);
                    currentRowWidth += itemWidth;
                }
            });

            // Push the last row
            if (currentRow.length > 0) {
                itemsPerRow.push(currentRow);
            }

            return itemsPerRow;
        };

        // Function to measure text width (simplified, should be improved for real scenarios)
        const measureTextWidth = (text) => {
            // Adjust the base width as needed
            return text.length * 10;
        };

        const itemsPerRow = renderItemsInRows();

        return (
            <View style={styles.amenitiesContainer}>
                {itemsPerRow.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((itemName, itemIndex) => {
                            const itemDetails = rentalItemPricingDetails[itemName]?.[0];
                            const price = itemDetails?.perDayPrice?.toString() || '';

                            return (
                                <View key={itemIndex} style={styles.itemContainer}>
                                    <TouchableOpacity style={styles.itemButton}>
                                        <Text style={styles.itemText}>{itemName}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => addRentalItemOnPress(itemName)}>
                                        <CrossIcon />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    const addRentalItemOnPress = (itemName) => {
        setSelectedItemArray((previous) => {
            if (previous.includes(itemName)) {
                // Remove the item if it's already selected
                const updatedPrices = { ...itemPrices };
                console.log('updated price is::>>', updatedPrices);
                delete updatedPrices[itemName];
                setItemPrices(updatedPrices);
                return previous.filter((item) => item !== itemName);
            } else {
                // Add the item if it's not already selected
                const updatedPrices = { ...itemPrices, itemName };
                console.log('updated price added is::>>', updatedPrices);
                setItemPrices(updatedPrices);
                return [...previous, itemName];
            }
        });
    };

    const RentalItemsList = () => {

        const toggleCollapse = () => {
            setIsCollapsed(!isCollapsed);
        };

        const renderItem = ({ item }) => {
            const IconImage = item?.icon;
            return (
                <TouchableOpacity style={styles.item} onPress={() => { addRentalItemOnPress(item.name) }}>
                    <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                        {/* <View style={{ backgroundColor: selectedItemArray.includes(item.name) ? 'green' : 'white', width: 10, height: 10, alignSelf: 'center', marginTop: 3 }}>

                        </View> */}
                        {selectedItemArray.includes(item.name) ? <FontAwesome5 style={{ marginHorizontal: 1 }} name={'check'} size={14} color={'green'} /> : null}
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: "center" }} onPress={() => { }}>

                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
                    <Text style={styles.headerText}>Available Amenities</Text>
                    <Icon name={isCollapsed ? 'arrow-down' : 'arrow-up'} size={20} />
                </TouchableOpacity>
                {!isCollapsed && (
                    <View style={styles.itemsContainer}>
                        <FlatList
                            data={rentalItems}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                )}
            </View>
        );
    };


    const seatingCapacityList = () => {

        const onPressSeatingCapacity = (item) => {
            setSelectedSeatingCapacity(item);
        }

        return (
            <View style={{ flexDirection: 'row' }}>
                {seatingCapacity.map((item) =>
                    <TouchableOpacity key={item} style={{
                        borderWidth: item === selectedSeatingCapacity ? 2 : 0,
                        borderColor: item === selectedSeatingCapacity ? '#ECA73C' : 'transparent', backgroundColor: '#FFF5E3', marginHorizontal: 10, borderRadius: 5, padding: 10
                    }}
                        onPress={() => onPressSeatingCapacity(item)}
                    >
                        <Text>{item}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }


    const RentalFoodTypeList = () => {

        const toggleCollapse = () => {
            setIsFoodDropDownCollapsed(!isFoodDropDownCollapsed);
            // setSelectedFoodType(name);
        };

        const onSelectFoodType = (name) => {
            setSelectedFoodType(name);
        }


        const renderItem = ({ item }) => {
            const IconImage = item?.icon;
            return (
                <TouchableOpacity style={styles.item} onPress={() => { onSelectFoodType(item?.name) }}>
                    <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                        {/* <View style={{ backgroundColor: selectedFoodType === item.name ? 'green' : 'white', width: 10, height: 10, alignSelf: 'center', marginTop: 3 }}>

                        </View> */}
                        {selectedFoodType === item.name ? <FontAwesome5 style={{ marginHorizontal: 1 }} name={'check'} size={14} color={'green'} /> : null}
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: "center" }} onPress={() => { }}>
                        {/* <Icon name={item.icon} size={20} style={styles.icon} /> */}

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


    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address) => {
        console.log('Selected Location:', location, address);
        setfunctionHallAddress(address);
        setfunctionHallCity(location?.address?.city);
        setfunctionHallPinCode(location.pinCode);
        setLocationPickerVisible(false); // Hide the LocationPicker after selection
    };

    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };



    return (
        <View style={{ flex: 1, backgroundColor: "#EBEDF3", paddingHorizontal: 10 }}>
            {loading ? (
                <View style={{ alignSelf: 'center', flex: 1, width: '100%', height: Dimensions.get('window').height, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#FEF7DE" />
                </View>
            ) :
                <View>
                    <Modal visible={isLocationPickerVisible} animationType="slide">
                        <LocationPicker onLocationSelected={handleLocationSelected} />
                        <Button title="Close" onPress={handleCloseLocationPicker} />
                    </Modal>



                    <Text style={styles.mainHeading}>General Details</Text>
                    <View style={styles.mainContainer}>
                        <ChooseFileField
                            label={'Hall Image'}
                            isRequired={true}
                            placeholder={'Hall Image'}
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
                            label='Hall Name'
                            placeholder="Please Enter Hall Name"
                            value={functionHallName}
                            onChangeHandler={onChangefunctionHallName}
                            keyboardType='default'
                            isRequired={true}
                        />

                        {/* <TextField
                    label='Food Type'
                    placeholder=""
                    value={foodType}
                    onChangeHandler={onChangeFoodType}
                    keyboardType='default'
                    isRequired={false}
                /> */}
                        <Text style={styles.labelText}>Food Type</Text>
                        {RentalFoodTypeList()}

                        <TextField
                            label='Hall Description'
                            placeholder="Describe about function hall"
                            value={productDescription}
                            onChangeHandler={onChangeDescription}
                            keyboardType='default'
                            isRequired={true}
                            isDescriptionField={true}
                        />

                        <Text style={styles.labelText}>Seating Capacity pax</Text>
                        {seatingCapacityList()}

                        <TextField
                            label='Bedrooms'
                            placeholder="Select Number"
                            value={BedRooms}
                            onChangeHandler={onChangeBedRooms}
                            keyboardType='number-pad'
                            isRequired={true}
                        />

                        <Text style={styles.labelText}>Available Hall Amenities</Text>
                        {RentalItemsList()}
                        {ItemList()}

                    </View>
                    <Text style={styles.title}>Pricing Details</Text>
                    <View style={styles.mainContainer}>

                        <TextField
                            label='Per Day Charge (₹/ Per Day)*'
                            placeholder="Please Enter per Day Charge"
                            value={perDayRentPrice}
                            onChangeHandler={onChangePerDayRentPrice}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                        <TextField
                            label='Advance Booking Amount'
                            placeholder="Please Enter Advance Booking Amount"
                            value={advanceAmount}
                            onChangeHandler={onChangeAdvanceAmount}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                        <TextField
                            label='Over Time Charges'
                            placeholder="Please Enter OverTime Charges"
                            value={overTimeCharges}
                            onChangeHandler={onChangeOverTimeCharges}
                            keyboardType='number-pad'
                            isRequired={true}
                        />

                        {/* <TextField
                            label='Discount if Any'
                            placeholder="Please Enter Discount Percentage"
                            value={discountPercentage}
                            onChangeHandler={onChangeDiscountPercentage}
                            keyboardType='number-pad'
                            isRequired={false}
                        /> */}
                        <Text style={styles.textInputlabel}>Discount if any</Text>
                        {discountPercentageList()}
                    </View>
                    <Text style={styles.title}>Item Available Address</Text>
                    <View style={styles.mainContainer}>

                        <Text style={styles.textInputlabel}>
                            Address<Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TouchableOpacity onPress={handleOpenLocationPicker} style={[styles.textTnputView, { height: 100, flexDirection: "row", }]}>
                            <View style={{ height: '100%', width: "85%" }}>
                                <TextInput
                                    onChangeText={onChangefunctionHallAddress}
                                    value={functionHallAddress}
                                    placeholder="Please Enter Address"
                                    keyboardType={'default'}
                                    style={{ height: '100%', textAlignVertical: 'top', padding: 10 }}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <DetectLocation />
                            </View>
                        </TouchableOpacity>


                        {/* <TextField
                    label='Address'
                    placeholder="Please Enter Address"
                    value={functionHallAddress}
                    onChangeHandler={onChangefunctionHallAddress}
                    keyboardType='default'
                    isRequired={true}
                /> */}
                        <TextField
                            label='City'
                            placeholder="Please Enter City"
                            value={functionHallCity}
                            onChangeHandler={onChangefunctionHallCity}
                            keyboardType='default'
                            isRequired={true}
                        />
                        <TextField
                            label='Pin code'
                            placeholder="Please Enter Pin code"
                            value={functionHallPinCode}
                            onChangeHandler={onChangefunctionHallPinCode}
                            keyboardType='number-pad'
                            isRequired={true}
                        />
                    </View>

                    {/* <Text style={{ fontFamily: 'InterRegular', color: '#5F6377', fontSize: 15, fontWeight: '600' }}>I Accept Terms and Conditions</Text> */}
                    <TouchableOpacity onPress={() => { onPressSaveAndPost() }} style={{ padding: 10, backgroundColor: '#FFF5E3', alignSelf: 'center', borderRadius: 5, borderColor: '#ECA73C', borderWidth: 2, marginTop: 40, bottom: 20 }}>
                        <Text style={{ color: '#ECA73C' }}> Save & Post </Text>
                    </TouchableOpacity>
                </View>}

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
        marginTop: 10,
        flex: 1
    },
    detailsContainer: {
        // backgroundColor: themevariable.Color_FFFFFF,
        backgroundColor: 'red',
        borderRadius: 10,

    },
    mainHeading: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 20,
        color: themevariable.Color_000000
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
        // backgroundColor: '#FFE9DA',
        padding: 5,
        borderRadius: 5,
        borderColor: themevariable.Color_C8C8C6,
        borderWidth: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        // backgroundColor: '#FFD7B5',
        borderRadius: 5,
    },
    headerText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'ManropeRegular',

    },
    itemsContainer: {
        marginTop: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },

    amenitiesContainer: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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