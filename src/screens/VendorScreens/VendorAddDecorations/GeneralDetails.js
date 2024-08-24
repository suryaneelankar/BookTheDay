import { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Alert, Modal, Button, TextInput } from 'react-native';
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
import { Accordion } from './Accordion';
import { useSelector } from 'react-redux';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import LocationPicker from '../../../components/LocationPicker';
import DetectLocation from '../../../assets/svgs/detectLocation.svg';


const GeneralDetails = () => {
    const [BedRooms, setBedRooms] = useState();
    const [foodType, setFoodType] = useState('');

    const [itemDescriptions, setItemDescriptions] = useState({});
    const [itemImages, setItemImages] = useState({});
    const [itemPrice, setItemPrice] = useState({});
    const [itemDetails, setItemDetails] = useState({});


    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [eventProviderName, setEventProviderName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFoodDropDownCollapsed, setIsFoodDropDownCollapsed] = useState(true);
    const [selectedFoodType, setSelectedFoodType] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined
    });
    const [eventOrgAddress, seteventOrgAddress] = useState('');
    const [eventOrgCity, seteventOrgCity] = useState('');
    const [eventOrgPinCode, seteventOrgPinCode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState();
    const [perKMPrice, setPerKMPrice] = useState();
    const [perMonthRentPrice, setPerMonthRentPrice] = useState();
    const [securityDeposit, setSecurityDeposit] = useState();
    const [available, setAvailable] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState();
    const [overTimeCharges, setOverTimeCharges] = useState();
    const [selectedItemArray, setSelectedItemArray] = useState([]);
    const [itemPrices, setItemPrices] = useState({});
    const [selectedSeatingCapacity,setSelectedSeatingCapacity] = useState('');

    const decorTypes = [
        { name: 'Marriage' },
        { name: 'Birthday' },
        { name: 'Anniversary' },
        { name: 'Festival' },
        { name: 'Other' }
    ];

    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    console.log('vendorLoggedInMobileNum is ::>>',vendorLoggedInMobileNum);

    const onChangeDescription = (value) => {
        setEventDescription(value);
    }

    const onChangeEventProviderName = (value) => {
        setEventProviderName(value);
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

    const onChangeEventOrganizerAddress = (value) => {
        seteventOrgAddress(value);
    }

    const onChangeeventOrgCity = (value) => {
        seteventOrgCity(value);
    }

    const onChangeeventOrgPinCode = (value) => {
        seteventOrgPinCode(value);
    }

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

    const handleDescriptionChange = (itemName, description) => {
        setItemDetails((prevState) => ({
            ...prevState,
            [itemName]: { ...prevState[itemName], description }
        }));
    };

    const handleImageUpload = (itemName, images) => {
        setItemDetails((prevState) => ({
            ...prevState,
            [itemName]: { ...prevState[itemName], images }
        }));
    };

    const handlePriceChange = (itemName, price) => {
        setItemDetails((prevState) => ({
            ...prevState,
            [itemName]: { ...prevState[itemName], price }
        }));
    };

    const onPressSaveAndPost = async () => {
        if(!mainImageUrl || eventProviderName === '' || eventDescription === '' || eventOrgCity === ''||
            eventOrgAddress === '' || eventOrgPinCode === '' || (overTimeCharges === undefined || overTimeCharges === '') || (advanceAmount === undefined || advanceAmount === '') || (discountPercentage === undefined || discountPercentage ==='') || Object.keys(itemDetails)?.length === 0
        ){
          Alert.alert('Please fill Mandatory fields');
          return;
        }

        for (const [key, value] of Object.entries(itemDetails)) {
            if (
                !value?.description ||
                !value?.price ||
                !value?.images ||
                value?.images?.length !== 2
            ) {
                Alert.alert("Incomplete Details", `Please ensure ${key} has a description, price, and exactly 2 images.`);
                return;
            }
        }

        const vendorMobileNumber = vendorLoggedInMobileNum;
        const formData = new FormData();
        formData.append('professionalImage', {
            uri: mainImageUrl?.assets[0]?.uri,
            type: mainImageUrl?.assets[0]?.type,
            name: mainImageUrl?.assets[0]?.fileName,
        });

        if (itemDetails?.Marriage) {
            itemDetails.Marriage.images.forEach((image, index) => {
                formData.append('marriageImages', {
                    uri: image.assets[0].uri,
                    type: image.assets[0].type,
                    name: image.assets[0].fileName,
                });
            });
            formData.append('marriagePackage', JSON.stringify({
                packageName: "Marriage",
                packagePrice: itemDetails.Marriage.price,
                packageDescription: itemDetails.Marriage.description,
            }));
        }

        if (itemDetails?.Birthday) {
            itemDetails.Birthday.images.forEach((image, index) => {
                formData.append('birthdayImages', {
                    uri: image.assets[0].uri,
                    type: image.assets[0].type,
                    name: image.assets[0].fileName,
                });
            });
            formData.append('birthdayPackage', JSON.stringify({
                packageName: "Birthday",
                packagePrice: itemDetails.Birthday.price,
                packageDescription: itemDetails.Birthday.description,
            }));
        }


        const functionHallAddessIs = { "address": eventOrgAddress, "city": eventOrgCity, "pinCode": eventOrgPinCode };
        console.log('selectedItemArray is ::>>>',selectedItemArray)
        formData.append('serviceType', 'driver');
        formData.append('description', eventDescription);
        // formData.append('subscriptionChargesPerMonth', perMonthRentPrice);
        formData.append('hallAmenities', selectedItemArray);
        formData.append('eventOrganiserName', eventProviderName);
        formData.append('rentPricePerDay', perDayRentPrice);
        formData.append('bedRooms', BedRooms);
        formData.append('available', true);
        formData.append('eventOrganizerAddress', JSON.stringify(functionHallAddessIs));
        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('advanceAmount', advanceAmount);
        formData.append('discountPercentage', discountPercentage);
        formData.append('seatingCapacity', selectedSeatingCapacity);
        formData.append('accepted', false);
        formData.append('overTimeCharges', overTimeCharges);

        console.log('formdata is ::>>', formData);
        const token = await getVendorAuthToken();

        try {
            const response = await axios.post(`${BASE_URL}/AddDecorations`, formData, {
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

    const decorTypesList = () => {

        const toggleCollapse = () => {
            setIsCollapsed(!isCollapsed);
        };

        const renderItem = ({ item }) => {
            const IconImage = item?.icon;
            return (
                <TouchableOpacity style={styles.item} onPress={() => { addRentalItemOnPress(item.name) }}>
                    <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                        <View style={{ backgroundColor: selectedItemArray.includes(item.name) ? 'green' : 'white', width: 10, height: 10, alignSelf: 'center', marginTop: 3 }}>

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, alignItems: "center" }} onPress={() => { }}>
                        {/* <Icon name={item.icon} size={20} style={styles.icon} /> */}

                        {/* <IconImage style={{marginHorizontal:2}}/> */}
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
                    <Text style={styles.headerText}>Decoration Types</Text>
                    <Icon name={isCollapsed ? 'arrow-down' : 'arrow-up'} size={20} />
                </TouchableOpacity>
                {!isCollapsed && (
                    <View style={styles.itemsContainer}>
                        <FlatList
                            data={decorTypes}
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
        seteventOrgAddress(address);
        seteventOrgCity(location?.address?.city);
        seteventOrgPinCode(location.pinCode);
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
                    label={'Event Origanizing Image'}
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
                
                <TextField
                    label='Event Organize Name'
                    placeholder="Please Enter Event Organize Name"
                    value={eventProviderName}
                    onChangeHandler={onChangeEventProviderName}
                    keyboardType='default'
                    isRequired={true}
                />

                <TextField
                    label='About Event Planner'
                    placeholder="Describe about Event Planner"
                    value={eventDescription}
                    onChangeHandler={onChangeDescription}
                    keyboardType='default'
                    isRequired={true}
                    isDescriptionField={true}
                />

            </View>

            <Text style={styles.title}>Packages Available</Text>
            <View style={styles.mainContainer}>
                {decorTypesList()}
                 {selectedItemArray.map((itemName) => (
                <Accordion
                    key={itemName}
                    itemName={itemName}
                    onChangeDescription={handleDescriptionChange}
                    onUploadImage={handleImageUpload}
                    onChangePrice={handlePriceChange}
                />
            ))}

            </View>

            <Text style={styles.title}>Pricing Details</Text>
            <View style={styles.mainContainer}>

                <TextField
                    label='Advance Booking Amount'
                    placeholder="Please Enter Advance Booking Amount"
                    value={advanceAmount}
                    onChangeHandler={onChangeAdvanceAmount}
                    keyboardType='default'
                    isRequired={true}
                />
                 <TextField
                    label='Over Time Charges'
                    placeholder="Please Enter OverTime Charges"
                    value={overTimeCharges}
                    onChangeHandler={onChangeOverTimeCharges}
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
            <Text style={styles.title}>Item Available Address</Text>
            <View style={styles.mainContainer}>
            <Text style={styles.textInputlabel}>
                    Address<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity onPress={handleOpenLocationPicker} style={[styles.textTnputView, { height: 100, flexDirection: "row",}]}>
                    <View style={{height: '100%',width:"85%" }}>
                        <TextInput
                            onChangeText={onChangeEventOrganizerAddress}
                            value={eventOrgAddress}
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
                
                <TextField
                    label='City'
                    placeholder="Please Enter City"
                    value={eventOrgCity}
                    onChangeHandler={onChangeeventOrgCity}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Pin code'
                    placeholder="Please Enter Pin code"
                    value={eventOrgPinCode}
                    onChangeHandler={onChangeeventOrgPinCode}
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
        backgroundColor: '#FFF4E1',
        padding: 5,
        borderRadius: 5,
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
        fontSize: 16,
        fontWeight: 'bold',
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