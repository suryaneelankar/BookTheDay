import { useEffect, useState } from 'react';
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
    const [cateringCity, setCateringCity] = useState('');
    const [cateringPincode, setCateringPincode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState();
    const [advanceAmount, setAdvanceAmount] = useState();
    const [discountPercentage, setDiscountPercentage] = useState();

    const [itemPrices, setItemPrices] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [foodMenuItems, setFoodMenuItems] = useState();
    const [comboPrice, setComboPrice] = useState({});
    const [minOrderMembers, setMinOrderMembers] = useState({});

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

    // /getAllFoodItems
    useEffect(() =>{
        getFoodMenuItems();
    },[]);

    const getFoodMenuItems = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllFoodItems`);
            console.log("foodmenu items::::::::", JSON.stringify(response?.data?.data[0]?.foodMenuItems));
            setFoodMenuItems(response?.data?.data[0]?.foodMenuItems);
        }catch (error) {
            console.log("events data error>>::", error);
        }
    };

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


    const RentalItemsList = () => {
        // const [selectedId, setSelectedId] = useState(null);
        // const [isCollapsed, setIsCollapsed] = useState(true);
        // const [selectedItems, setSelectedItems] = useState({});

        const toggleCollapse = (id) => {
            setSelectedId(id);
            setIsCollapsed(id === selectedId ? !isCollapsed : true);
        };

        const handleComboPriceChange = (id, price) => {
            setComboPrice(prevPrices => ({
                ...prevPrices,
                [id]: price
            }));
        };
    
        const handleMinOrderMembersChange = (id, members) => {
            setMinOrderMembers(prevMembers => ({
                ...prevMembers,
                [id]: members
            }));
        };

        const handleItemSelect = (menuId, itemName) => {
            setSelectedItems((prevState) => {
                const updatedItems = { ...prevState };
                if (!updatedItems[menuId]) {
                    updatedItems[menuId] = [];
                }

                if (updatedItems[menuId].includes(itemName)) {
                    updatedItems[menuId] = updatedItems[menuId].filter(item => item !== itemName);
                } else {
                    updatedItems[menuId].push(itemName);
                }

                return updatedItems;
            });
        };

        const handleAddCustomItem = (id) => {
            console.log("id i::::::::::::,", id)
            // if (customItemVal.trim() !== '') {
            //     setCustomisedItems([...customisedItems, customItemVal.trim(), id]);
            //     setCustomItemVal('');
            //     setShowCustomTextInput(false);
            // }

            if (customItemVal.trim() !== '') {
                setCustomisedItems(prevItems => {
                    const itemIndex = prevItems.findIndex(item => item.id === id);
                    if (itemIndex > -1) {
                        // Update existing entry
                        const updatedItems = [...prevItems];
                        updatedItems[itemIndex].items.push(customItemVal.trim());
                        return updatedItems;
                    } else {
                        // Add new entry
                        return [...prevItems, {
                            id: id,
                            items: [customItemVal.trim()],
                        }];
                    }
                });
                setCustomItemVal('');
                setShowCustomTextInput(false);
            }
        };

        const handleRemoveCustomItem = (id, itemIndex) => {
            // const updatedItems = customisedItems.filter((_, i) => i !== index);
            // setCustomisedItems(updatedItems);
            setCustomisedItems(prevItems => {
                const updatedItems = prevItems.map(custom => {
                    if (custom.id === id) {
                        return {
                            ...custom,
                            items: custom.items.filter((_, index) => index !== itemIndex),
                        };
                    }
                    return custom;
                }).filter(custom => custom.items.length > 0); // Remove any entries with no items
                return updatedItems;
            });
        };

        const renderCustomizedItems = (id) => {
            const customItem = customisedItems.find(custom => custom.id === id);
    
            if (!customItem) return null;
            return (
                <View>
                    <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'black', fontSize: 16 }}>Your customized items</Text>
                    {customItem.items.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{item}</Text>
                            <TouchableOpacity onPress={() => handleRemoveCustomItem(id, index)}>
                                <Icon name="trash" size={20} color="red" style={{ marginHorizontal: 5 }} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        };


        const renderItem = ({ item, index }) => {
            const currentSelected = item._id === selectedId;
            console.log("curenntsle", currentSelected);
            const customItem = customisedItems.find(custom => custom.id === item._id);
           console.log("custom item :::::::::", customItem)
            return (
                <TouchableOpacity
                    onPress={() => toggleCollapse(item?._id)}
                    style={{ backgroundColor: '#FFF4E1', width: '100%', padding: 10, borderRadius: 10, marginTop: 20 }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.headerText}>{item.title}</Text>
                        <Icon name={isCollapsed ? 'arrow-down' : 'arrow-up'} size={20} />
                    </View>
                    {isCollapsed &&
                        <View>
                            <FlatList
                                data={item?.subItems}
                                keyExtractor={(subItem, index) => index.toString()}
                                numColumns={2}
                                renderItem={({ item: subItem }) => (
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => handleItemSelect(item._id, subItem)}
                                    >
                                        <View style={{ borderColor: 'green', borderWidth: 2, width: 20, height: 20, borderRadius: 5 }}>
                                            <View style={{
                                                backgroundColor: selectedItems[item._id]?.includes(subItem) ? 'green' : 'white',
                                                width: 10,
                                                height: 10,
                                                alignSelf: 'center',
                                                marginTop: 3
                                            }} />
                                        </View>
                                        <Text style={styles.itemText}>{subItem}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    }

                    {selectedItems[item._id]?.length > 0 &&
                        <View>
                            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Selected Items:</Text>
                            {selectedItems[item._id].map((selectedItem, index) => (
                                <Text key={index} style={{ marginLeft: 5 }}>{selectedItem}</Text>
                            ))}
                        </View>
                    }

                    {/* {customisedItems?.length > 0 ?
                        <>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'black', fontSize: 16 }}>Your customized items</Text>
                            {customisedItems.map((item) => {
                                return (
                                    <Text>{item}</Text>
                                )
                            })}
                        </> : null} */}
                                        {renderCustomizedItems(item._id)}

                    {/* {customItem > 0 &&
                        <>
                            <Text style={{ textAlign: 'left', fontWeight: 'bold', color: 'black', fontSize: 16 }}>Your customized items</Text>
                            {customItem.items.map.map((customItem, index) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>{customItem}</Text>
                                    <TouchableOpacity onPress={() => handleRemoveCustomItem(index)}>
                                        <Icon name="trash" size={20} color="red" style={{marginHorizontal:5}} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </>
                    } */}
                    {showCustomTextInput ?
                        <View style={styles.inputContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={styles.input}
                                    value={customItemVal}
                                    onChangeText={(text) => setCustomItemVal(text)}
                                    // onChangeText={(text) => handleInputChange(text, index)}
                                    placeholder={`Add Item`}
                                />
                                <TouchableOpacity
                                    style={{ marginHorizontal: 5, marginTop: 10 }}
                                    // onPress={() => onAddItemsFinish()}
                                    onPress={() =>handleAddCustomItem(item._id)}

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

                    {isCollapsed ?
                        <TouchableOpacity style={{ backgroundColor: '#D2453B', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 }}
                            onPress={() => { onPressAddCustomizedItem() }}
                        >
                            <Text style={{ color: 'white', fontFamily: 'ManropeRegular', fontWeight: 'bold', }}>Add Your Customized item in this combo</Text>
                        </TouchableOpacity>
                        : null}

                       {isCollapsed &&
                    <>
                        <TextInput
                            style={{ borderColor: "lightgray", borderWidth: 1, marginTop: 5, padding: 5 }}
                            placeholder='Enter per plate Combo price'
                            value={comboPrice[item._id] || ''}
                            onChangeText={(text) => handleComboPriceChange(item._id, text)}
                        />
                        <TextInput
                            style={{ borderColor: "lightgray", borderWidth: 1, marginTop: 5, padding: 5 }}
                            placeholder='Enter min Order members'
                            value={minOrderMembers[item._id] || ''}
                            onChangeText={(text) => handleMinOrderMembersChange(item._id, text)}
                        />
                    </>
                }

                </TouchableOpacity>
            );
        };

       
        return (
            <View style={styles.container}>
                <FlatList
                    data={foodMenuItems}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                />
            </View>
        );
    };

    const processItems = () => {
        return Object.keys(selectedItems).map(id => ({
            title: foodMenuItems.find(item => item._id === id).title,
            items: selectedItems[id].concat(customisedItems.find(custom => custom.id === id)?.items || []),
            perPlateCost: comboPrice[id] || 0,
            minOrder: minOrderMembers[id] || 0,
        }));
    };

    const finalCombomenu = processItems();

    console.log("Processed items:", finalCombomenu);

    const onChangeDescription = (value) => {
        setCateringDescription(value);
    }

    const onChangetentHouseName = (value) => {
        setFoodCateringName(value);
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


        console.log('formdata is ::>>', JSON.stringify(formData));

        try {
            const response = await axios.post(`${BASE_URL}/AddFoodCatering`, formData, {
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

    const renderMenuItem = ({ item }) => (
        <View style={{marginHorizontal:5,backgroundColor:"white",borderWidth:1,borderColor:"lightgray", borderRadius:10,paddingVertical:10,paddingHorizontal:10}}>
          <Text style={{color:"black", fontSize:14, fontWeight:"700", fontFamily: 'ManropeRegular'}}>{item.title}</Text>
          <Text style={{marginTop:5,color:"black", fontSize:10, fontWeight:"200", fontFamily: 'ManropeRegular'}}>Combo Includes</Text>
          <Text style={{marginTop:2,color:"black", fontSize:12, fontWeight:"400", fontFamily: 'ManropeRegular', width:"60%"}}>{item.items.join(', ')}</Text>
          <Text style={{marginTop:5,color:"#FE8235", fontSize:12, fontWeight:"400", fontFamily: 'ManropeRegular'}}>Per Plate Price: {item.perPlateCost}</Text>
          <Text style={{marginTop:5,color:"#FE8235", fontSize:12, fontWeight:"400", fontFamily: 'ManropeRegular'}}>Min Order: {item.minOrder}</Text>

        </View>
      );

      

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
                    label='Catering Name'
                    placeholder="Please Enter Catering Name"
                    value={foodCateringName}
                    onChangeHandler={onChangetentHouseName}
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
            </View>
           

            <Text style={styles.title}>Add Menu Items</Text>
            <View style={styles.mainContainer}>
                {RentalItemsList()}
                {/* {ItemList()} */}
            </View>

            {finalCombomenu?.length > 0 ?
            <View style={styles.mainContainer}>
            <Text style={{color:"black", fontSize:14, fontWeight:"500", marginBottom:5,marginHorizontal:8}}>Added Combos</Text>
             <FlatList
             data={finalCombomenu}
             renderItem={renderMenuItem}
             keyExtractor={(item, index) => index.toString()}
             horizontal
             showsHorizontalScrollIndicator={false}
           />
           </View>: 
           null}

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
                    label='Discount if Any'
                    placeholder="Please Enter Discount Percentage"
                    value={discountPercentage}
                    onChangeHandler={onChangeDiscountPercentage}
                    keyboardType='default'
                    isRequired={false}
                />
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
                    value={cateringAddress}
                    onChangeHandler={onChangetentHouseAddress}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='City'
                    placeholder="Please Enter City"
                    value={cateringCity}
                    onChangeHandler={onChangetentHouseCity}
                    keyboardType='default'
                    isRequired={true}
                />
                <TextField
                    label='Pin code'
                    placeholder="Please Enter Pin code"
                    value={cateringPincode}
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
        width: "50%"
    },
    icon: {
        marginRight: 10,
    },
    itemText: {
        fontSize: 14,
        marginHorizontal: 10
    },
})