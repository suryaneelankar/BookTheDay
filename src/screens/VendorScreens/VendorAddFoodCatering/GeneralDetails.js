import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, TextInput, alert } from 'react-native';
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
import CarpetIcon from '../../../assets/svgs/VendorCatering/Rug.svg';
import ChairIcon from '../../../assets/svgs/VendorCatering/Chair.svg';
import ChefHatIcon from '../../../assets/svgs/VendorCatering/ChefHat.svg';
import CookingPot from '../../../assets/svgs/VendorCatering/CookingPot.svg';
import DeskIcon from '../../../assets/svgs/VendorCatering/Desk.svg';
import JarIcon from '../../../assets/svgs/VendorCatering/Jar.svg';
import LightsIcon from '../../../assets/svgs/VendorCatering/Lightbulb.svg';
import RecycleIcon from '../../../assets/svgs/VendorCatering/Recycle.svg';
import SpeakerIcon from '../../../assets/svgs/VendorCatering/SpeakerHifi.svg';
import FanIcon from '../../../assets/svgs/VendorCatering/vendor_fan.svg';
import WallIcon from '../../../assets/svgs/VendorCatering/Wall.svg';
import CrossIconRed from '../../../assets/vendorIcons/crossIconRed.svg';
import CheckIconGreen from '../../../assets/vendorIcons/checkIconGreen.svg';
import CrossIcon from '../../../assets/vendorIcons/crossIcon.svg';

const GeneralDetails = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [overTimeCharges, setOverTimeCharges] = useState();
    const [vehicleName, setVehicleName] = useState('');
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [tentHouseName, settentHouseName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined
    });
    const [tentHouseAddress, settentHouseAddress] = useState('');
    const [tentHouseCity, settentHouseCity] = useState('');
    const [tentHousePincode, settentHousePincode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState();
    const [perKMPrice, setPerKMPrice] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState();
    const [selectedRentalItem, setSelectedRentalItem] = useState();

    const [itemPrices, setItemPrices] = useState({});


    const [rentalItemPricingDetails, setRentalItemPricingDetails] = useState({
        "Carpet": [{ "itemName": "Carpet", "perDayPrice": 0 }],
        "Chairs": [{ "itemName": "Chairs", "perDayPrice": 0 }],
        "Side Walls": [{ "itemName": "SideWalls", "perDayPrice": 0 }],
        "Lights": [{ "itemName": "Lights", "perDayPrice": 0 }],
        "Tables/Furniture": [{ "itemName": "Tables/Furniture", "perDayPrice": 0 }],
        "Portable stove or campfire cooking equipment": [{ name: 'Portable stove or campfire cooking equipment', icon: 'ios-flame' }],
        "Cookware": [{ name: 'Cookware', icon: 'ios-restaurant' }],
        "Coolers / Fans": [{ name: 'Coolers / Fans', icon: 'ios-snow' }],
        "Reusable plates, cups, and cutlery": [{ name: 'Reusable plates, cups, and cutlery', icon: 'ios-cut' }],
        "Food storage containers": [{ name: 'Food storage containers', icon: 'ios-basket' }],
        "Sound Box/ Speakers": [{ name: 'Sound Box/ Speakers', icon: 'ios-volume-high' }]
    });

    const rentalItems = [
        { name: 'Carpet', icon: CarpetIcon },
        { name: 'Chairs', icon: ChairIcon },
        { name: 'Side Walls', icon: WallIcon },
        { name: 'Lights', icon: LightsIcon },
        { name: 'Tables/Furniture', icon: DeskIcon },
        { name: 'Portable stove or campfire cooking equipment', icon: ChairIcon },
        { name: 'Cookware', icon: ChefHatIcon },
        { name: 'Coolers / Fans', icon: FanIcon },
        { name: 'Reusable plates, cups, and cutlery', icon: RecycleIcon },
        { name: 'Food storage containers', icon: JarIcon },
        { name: 'Sound Box/ Speakers', icon: SpeakerIcon }
    ];

    const foodMenu = [{
        title: "Non Veg Standard Menu",
        id: 1,
        subItems: [
            "Sweet",
            "Roti",
            "Paneer",
            "Veg Biryani",
            "Veg Curry",
            "Raitha",
            "White Rice",
            "Dal",
            "Fry",
            "Sambar",
            "Pickel",
            "Chutney",
            "Papad",
            "Salad",
            "Veg Snack",
            "Curd",
            "Mouth Freshener"
        ],
    },
    {
        title: "Vegetarian Standard Menu",
        id: 2,
        subItems: [
            "Sweet",
            "Roti",
            "Paneer",
            "Veg Biryani",
            "Veg Curry",
            "Raitha",
            "White Rice",
            "Dal",
            "Fry",
            "Sambar",
            "Pickel",
            "Chutney",
            "Papad",
            "Salad",
            "Veg Snack",
            "Curd",
            "Mouth Freshener"
        ],
    }
    ];

    const [selectedItemArray, setSelectedItemArray] = useState([]);
    const [selectedId, setSelectedId] = useState(true);
    const [customItemVal, setCustomItemVal] = useState();
    const [customisedItems, setCustomisedItems] = useState([]);
    const [showCustomTextInput, setShowCustomTextInput] = useState(false);

    const onPressAddCustomizedItem = () => {
        setShowCustomTextInput(true);
    };

    const handleInputChange = (text, index) => {
        setCustomItemVal(text);
    };

    const handleRemoveInput = (index) => {
        setShowCustomTextInput(false);
    };

    const onAddItemsFinish = () => {
        setCustomisedItems(oldArray => [...oldArray, customItemVal]);
        setCustomItemVal('');
    }

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

    const ItemList = () => {
        const screenWidth = Dimensions.get('window').width;

        // Function to render items in rows
        const renderItemsInRows = () => {
            const itemsPerRow = [];
            let currentRow = [];
            let currentRowWidth = 0;

            customisedItems.forEach((itemName) => {
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
                            // const itemDetails = rentalItemPricingDetails[itemName]?.[0];
                            // const price = itemDetails?.perDayPrice?.toString() || '';

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

    const RentalItemsList = () => {
        // const [isCollapsed, setIsCollapsed] = useState(true);

        const toggleCollapse = (id) => {
            setSelectedId(id);
            setIsCollapsed(!isCollapsed);
        };

        const renderItem = ({ item, index }) => {
            const currentSelected = item.id === selectedId ? true : false;
            return (
                <TouchableOpacity onPress={() => {toggleCollapse(item.id), addRentalItemOnPress(item)}} style={{ backgroundColor: '#FFF4E1', width: '100%', padding: 10, borderRadius: 10, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.headerText}>{item.title}</Text>
                        <Icon name={isCollapsed ? 'arrow-down' : 'arrow-up'} size={20} />
                    </View>
                    {currentSelected ?
                        <View style={{}}>
                            {item?.subItems?.map((itemData, index) => {
                                return (
                                    <TouchableOpacity style={styles.item} onPress={() => { }}>
                                        <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                                            <View style={{ backgroundColor: selectedItemArray.includes(item.name) ? 'green' : 'white', width: 10, height: 10, alignSelf: 'center', marginTop: 3 }}>

                                            </View>
                                        </View>
                                        <Text style={styles.itemText}>{itemData}</Text>
                                    </TouchableOpacity>
                                )
                            })}

                            {customisedItems?.length>0 ?
                                <>
                                <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'black', fontSize: 16 }}>Your customized items</Text>
                                    {customisedItems.map((item) => {
                                        return (
                                            <Text>{item}</Text>
                                        )
                                    })}
                                </> : null}
                            {showCustomTextInput ?
                                <View key={index} style={styles.inputContainer}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            style={styles.input}
                                            value={customItemVal}
                                            onChangeText={(text) => handleInputChange(text, index)}
                                            placeholder={`Add Item ${index + 1}`}
                                        />
                                        <TouchableOpacity
                                            style={{ marginHorizontal: 5, marginTop: 10 }}
                                            onPress={() => onAddItemsFinish()}
                                        >
                                            <CheckIconGreen />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ marginHorizontal: 5, marginTop: 10 }}
                                            onPress={() => handleRemoveInput(index)}
                                        >
                                            <CrossIconRed />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : null}

                            <TouchableOpacity style={{ backgroundColor: '#D2453B', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 }}
                                onPress={() => { onPressAddCustomizedItem() }}
                            >
                                <Text style={{ color: 'white', fontFamily: 'ManropeRegular', fontWeight: 'bold', }}>Add Your Customized item in this combo</Text>
                            </TouchableOpacity>
                        </View>
                        : null}
                </TouchableOpacity>
            )
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={foodMenu}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>
        );
    };

    const onChangeDescription = (value) => {
        setProductDescription(value);
    }

    const onChangetentHouseName = (value) => {
        settentHouseName(value);
    }

    const onChangePerDayRentPrice = (value) => {
        setPerDayRentPrice(value);
    }

    const onChangeAdvanceAmount = (value) => {
        setAdvanceAmount(value);
    }

    const onChangeDiscountPercentage = (value) => {
        setDiscountPercentage(value);
    }

    const onChangetentHouseAddress = (value) => {
        settentHouseAddress(value);
    }

    const onChangeOverTimeCharges = (value) => {
        setOverTimeCharges(value);
    }

    const onChangetentHouseCity = (value) => {
        settentHouseCity(value);
    }

    const onChangetentHousePincode = (value) => {
        settentHousePincode(value);
    }

    const onChangeItemPrice = (text, itemName) => {
        console.log('text text on change is::>>>', text);
        // setRentalItemPricingDetails?.[itemName][0]?.perDayPrice(text);
        // setRentalItemPricingDetails({...rentalItemPricingDetails, })
        const newPrice = parseFloat(text) || 0;
        setRentalItemPricingDetails((prevDetails) => ({
            ...prevDetails,
            [itemName]: [{ ...prevDetails[itemName]?.[0], itemName, perDayPrice: newPrice }],
        }));
        console.log('rentalItemPricingDetails is::><><><>', rentalItemPricingDetails);
    };

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
    const transformInput = (input) => {
        return Object.entries(input).map(([key, value]) => {
            return {
                itemName: value[0].itemName || value[0].name,
                perDayPrice: value[0].perDayPrice || 0
            };
        });
    };

    const onPressSaveAndPost = async () => {
        const vendorMobileNumber = "8297735285"
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

        const tentHousAddessIs = { "address": tentHouseAddress, "city": tentHouseCity, "pinCode": tentHousePincode };
        const RentItems = [{ "itemName": "Tent", "perHourPrice": 80, "perDayPrice": 300 }, { "itemName": "Chairs", "perHourPrice": 400, "perDayPrice": 2000 }, { "itemName": "Carpet", "perHourPrice": 50, "perDayPrice": 200 }, { "itemName": "Side Walls", "perHourPrice": 75, "perDayPrice": 320 }, { "itemName": "Lights", "perHourPrice": 45, "perDayPrice": 960 }, { "itemName": "Tables/Furniture", "perHourPrice": 75, "perDayPrice": 620 }, { "itemName": "Portable Stove", "perHourPrice": 35, "perDayPrice": 420 }, { "itemName": "Cookware", "perHourPrice": 65, "perDayPrice": 270 }, { "itemName": "Coolers/Fans", "perHourPrice": 435, "perDayPrice": 2210 }, { "itemName": "Coolers/Fans", "perHourPrice": 435, "perDayPrice": 2210 }, { "itemName": "Reusable Plates andCcontainers", "perHourPrice": 425, "perDayPrice": 1210 }, { "itemName": "Food storage containers", "perHourPrice": 435, "perDayPrice": 2210 }, { "itemName": "Sound Box/Speakers", "perHourPrice": 535, "perDayPrice": 3210 }]
        const Address = {
            "address": "Ameerpet",
            "city": "Hyderabad",
            "pinCode": 500075
        }
        formData.append('description', productDescription);
        formData.append('rentalItems', JSON.stringify(transformInput(rentalItemPricingDetails)));
        formData.append('tentHosueAddress', JSON.stringify(tentHousAddessIs));
        formData.append('tentHouseName', tentHouseName);
        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('discountPercentage', discountPercentage);
        formData.append('available', true);
        formData.append('advanceAmount', advanceAmount);
        formData.append('overTimeCharges', overTimeCharges);

        console.log('formdata is ::>>', JSON.stringify(formData));

        try {
            const response = await axios.post(`${BASE_URL}/AddTentHouse`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
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


    return (
        <View>
            <View style={styles.mainContainer}>
                <ChooseFileField
                    label={'Tent House Image'}
                    isRequired={true}
                    placeholder={'Add Tent House Image'}
                    onPressChooseFile={openGalleryOrCamera}
                />
                {mainImageUrl ?
                    <Image
                        source={{ uri: mainImageUrl?.assets[0]?.uri }}
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
                    label='Tent House Name'
                    placeholder="Please Enter Tent House Name"
                    value={tentHouseName}
                    onChangeHandler={onChangetentHouseName}
                    keyboardType='default'
                    isRequired={true}
                />

                <TextField
                    label='Tent House Description'
                    placeholder="Describe about your service"
                    value={productDescription}
                    onChangeHandler={onChangeDescription}
                    keyboardType='default'
                    isRequired={true}
                    isDescriptionField={true}
                />
            </View>
            <Text style={styles.title}>Pricing Details</Text>
            <View style={styles.mainContainer}>

                <TextField
                    label='Per Day Charge (₹/ Per Day)*'
                    placeholder="Please Enter per Day Charge"
                    value={perDayRentPrice}
                    onChangeHandler={onChangePerDayRentPrice}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Advance Booking Amount'
                    placeholder="Please Enter Advance Booking Amount"
                    value={advanceAmount}
                    onChangeHandler={onChangeAdvanceAmount}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Discount if Any'
                    placeholder="Please Enter Discount Percentage"
                    value={discountPercentage}
                    onChangeHandler={onChangeDiscountPercentage}
                    keyboardType='default'
                    isRequired={false}
                />
            </View>

            <Text style={styles.title}>Add Menu Items</Text>
            <View style={styles.mainContainer}>
                {RentalItemsList()}
                {ItemList()}
            </View>

            <Text style={styles.title}>Other Charges</Text>
            <View style={styles.mainContainer}>
                <TextField
                    label='Over Time Charges'
                    placeholder="Please Enter OverTime Charges"
                    value={overTimeCharges}
                    onChangeHandler={onChangeOverTimeCharges}
                    keyboardType='default'
                    isRequired={true}
                />
            </View>

            <Text style={styles.title}>Catering Address</Text>
            <View style={styles.mainContainer}>
                <TextField
                    label='Address'
                    placeholder="Please Enter Address"
                    value={tentHouseAddress}
                    onChangeHandler={onChangetentHouseAddress}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='City'
                    placeholder="Please Enter City"
                    value={tentHouseCity}
                    onChangeHandler={onChangetentHouseCity}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Pin code'
                    placeholder="Please Enter Pin code"
                    value={tentHousePincode}
                    onChangeHandler={onChangetentHousePincode}
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
    },
    icon: {
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
        marginHorizontal: 10
    },
})