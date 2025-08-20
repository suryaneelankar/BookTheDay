import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Switch,
    ActivityIndicator,
    Modal,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import TextField from '../../../commonFields/TextField';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import DetectLocation from '../../../assets/svgs/detectLocation.svg';
import UserLocationPicker from '../../../components/LocationPicker';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { getVendorAuthToken } from '../../../utils/StoreAuthToken';
import BASE_URL from '../../../apiconfig';
import { useSelector } from 'react-redux';

const EditFunctionHall = ({ route, navigation }) => {
    const { hallId } = route.params;
    const [loading, setLoading] = useState(false);

    // Editable fields from API response
    const [functionHallName, setFunctionHallName] = useState('');
    const [description, setDescription] = useState('');
    const [seatingCapacity, setSeatingCapacity] = useState('');
    const [bedRooms, setBedRooms] = useState('');
    const [functionHallAreaInSft, setFunctionHallAreaInSft] = useState('');
    const [hallAmenities, setHallAmenities] = useState([]); // array of amenities
    const [menuAvailable, setMenuAvailable] = useState(false);
    const [foodType, setFoodType] = useState('');
    const [rentPricePerDay, setRentPricePerDay] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [advanceAmountPercentage, setAdvanceAmountPercentage] = useState('');
    const [serviceCharges, setServiceCharges] = useState('');
    const FOOD_TYPES = ["veg", "non-veg", "Both"];
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [oldMainImageFileName, setoldMainImageFileName] = useState('');

    // Address related
    const [functionHallAddress, setFunctionHallAddress] = useState('');
    const [functionHallCity, setFunctionHallCity] = useState('');
    const [functionHallPinCode, setFunctionHallPinCode] = useState('');
    const [county, setCounty] = useState('');

    // Location picker modal
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);

    // Images
    const [mainImageUrl, setMainImageUrl] = useState(null);
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined,
        additionalImageFive: undefined,
        additionalImageSix: undefined,
        additionalImageSeven: undefined,
        additionalImageEight: undefined,
    });

    const keyOrder = [
        'additionalImageOne', 'additionalImageTwo', 'additionalImageThree', 'additionalImageFour',
        'additionalImageFive', 'additionalImageSix', 'additionalImageSeven', 'additionalImageEight'
    ];

    const ALL_AMENITIES = [
        "Tables with basic covers", "Chairs", "Restrooms/Toilets", "Parking",
        "Wheelchair access", "Coolers / Fans", "Air Conditioners (AC)", "Bedrooms",
        "Sound/music license", "Lighting", "Power Backup", "Bridal Room", "Kitchen Space"
    ];

    const SEATING_OPTIONS = ["50-100", "100-200", "200-400", "400-600", "600-800", "800-1000", "1000-1200", "1200+"];

    const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 50];

    const [selectedAmenities, setSelectedAmenities] = useState([]);

    useEffect(() => {
        loadFunctionHallDetails();
    }, []);

    const loadFunctionHallDetails = async () => {
        setLoading(true);
        try {
            const token = await getVendorAuthToken();
            const response = await axios.get(`${BASE_URL}/getFunctionHallDetailsById/689b5718cc6425607182aef9`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;

            // Fill basic fields
            setFunctionHallName(data.functionHallName || '');
            setDescription(data.description || '');
            setSeatingCapacity(data.seatingCapacity?.toString() || '');
            setBedRooms(data.bedRooms?.toString() || '');
            setFunctionHallAreaInSft(data.functionHallAreaInSft?.toString() || '');
            // setFoodType(data.foodType || '');
            setMenuAvailable(Boolean(data.menuAvailable));
            setRentPricePerDay(data.rentPricePerDay?.toString() || '');
            setAdvanceAmount(data.advanceAmount?.toString() || '');
            setAdvanceAmountPercentage(data.advanceAmountInPercentageForMenu?.toString() || '');
            setServiceCharges(data.serviceCharges?.toString() || '');
            setCounty(data.county || '');

            setSelectedAmenities(parseAmenities(data.hallAmenities));
            setFoodType(data.foodType);
            setSeatingCapacity(data.seatingCapacity); // e.g. '50-100'
            setDiscountPercentage(data.discountPercentage ?? 0);


            // Address object handling
            if (data.functionHallAddress) {
                if (typeof data.functionHallAddress === 'object') {
                    setFunctionHallAddress(data.functionHallAddress.address || '');
                    setFunctionHallCity(data.functionHallAddress.city || '');
                    setFunctionHallPinCode(data.functionHallAddress.pinCode?.toString() || '');
                } else if (typeof data.functionHallAddress === 'string') {
                    // If string, just use directly as address
                    setFunctionHallAddress(data.functionHallAddress);
                }
            }

            console.log('data.functionHallAddress is::>>', data);
            console.log('data.professionalImage.url is::>>', data.professionalImage.url);
            setoldMainImageFileName(data.professionalImage?.filename || '');

            // Main image from API response
            if (data.professionalImage?.url) {
                setMainImageUrl({
                    assets: [
                        {
                            uri: data.professionalImage.url,
                            fileName: data.professionalImage.filename || 'main.jpg',
                            type: data.professionalImage.mimetype || 'image/jpeg',
                        },
                    ],
                });
            }

            // Additional images from API response (flatten nested array)
            if (Array.isArray(data.additionalImages)) {
                const flattened = data.additionalImages.flat().map((img, index) => ({
                    assets: [
                        {
                            uri: img.url,
                            fileName: img.filename || `image${index + 1}.jpg`,
                            type: img.mimetype || 'image/jpeg',
                        },
                    ],
                }));
                const imgMap = {};
                ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'].forEach((suffix, index) => {
                    imgMap[`additionalImage${suffix}`] = flattened[index];
                });
                setAdditionalImages(imgMap);
            }

        } catch (error) {
            console.error('Error loading function hall details:', error.message || error);
        } finally {
            setLoading(false);
        }
    };

    function parseAmenities(arr) {
        if (!Array.isArray(arr)) return [];
        // Flatten and split comma-separated if needed
        return arr
            .flat()
            .map(a => typeof a === 'string' ? a.split(',') : [])
            .flat()
            .map(a => a.trim())
            .filter(Boolean);
    }

    const toggleAmenity = (item) => {
        setSelectedAmenities(prev =>
            prev.includes(item)
                ? prev.filter(v => v !== item)
                : [...prev, item]
        );
    };

    // Update a specific field in form
    const updateFormField = (field, value) => {
        switch (field) {
            case 'functionHallName':
                setFunctionHallName(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'seatingCapacity':
                setSeatingCapacity(value);
                break;
            case 'bedRooms':
                setBedRooms(value);
                break;
            case 'functionHallAreaInSft':
                setFunctionHallAreaInSft(value);
                break;
            case 'rentPricePerDay':
                setRentPricePerDay(value);
                break;
            case 'advanceAmount':
                setAdvanceAmount(value);
                break;
            case 'advanceAmountInPercentageForMenu':
                setAdvanceAmountPercentage(value);
                break;
            case 'serviceCharges':
                setServiceCharges(value);
                break;
            case 'county':
                setCounty(value);
                break;
            case 'functionHallAddress':
                setFunctionHallAddress(value);
                break;
            case 'functionHallCity':
                setFunctionHallCity(value);
                break;
            case 'functionHallPinCode':
                setFunctionHallPinCode(value);
                break;
            default:
                break;
        }
    };

    // Open Image Picker for main image
    const openGalleryOrCamera = async () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setMainImageUrl(response);
            }
        });
    };

    // Open Image Picker for additional images by index
    const openGalleryOrCameraForAdditonalImages = async (index) => {
        const options = {
            mediaType: 'photo',
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                // Map index to additionalImage key
                const keyMap = [
                    'additionalImageOne',
                    'additionalImageTwo',
                    'additionalImageThree',
                    'additionalImageFour',
                    'additionalImageFive',
                    'additionalImageSix',
                    'additionalImageSeven',
                    'additionalImageEight',
                ];
                const key = keyMap[index] || 'additionalImageOne';
                setAdditionalImages(prev => ({ ...prev, [key]: response }));
            }
        });
    };

    // Normalize additional images for FlatList
    const normalizedImages = Object.values(additionalImages)
        .filter(Boolean)
        .map(img => {
            if (img.url) return { uri: img.url };
            if (img.assets && img.assets[0]?.uri) return { uri: img.assets[0].uri };
            return null;
        })
        .filter(Boolean);

    const handleLocationSelected = (location, address) => {
        if (!location || !address) return;
        // address is expected string, location has city, pinCode, lat, lon etc
        setFunctionHallAddress(address);
        setFunctionHallCity(location.city || location.subDivisionArea || '');
        setFunctionHallPinCode(location.pinCode?.toString() || '');
        setCounty(location.county || location.subDivisionArea || '');
        setLocationPickerVisible(false);
    };

    const setLocationPickerVisibleValue = () => {
        setLocationPickerVisible(false);
    };

    // Save changes handler - Implement API call here
    const onPressEditAndSave = async () => {
        // Validation as in Add. (reuse your checks)

        const vendorMobileNumber = vendorLoggedInMobileNum;
        const formData = new FormData();

        // (1) Professional Image — Only if new
        if (mainImageUrl?.assets?.[0]?.uri && mainImageUrl?.assets?.[0]?.fileName !== oldMainImageFileName) {
            formData.append('professionalImage', {
                uri: mainImageUrl.assets[0].uri,
                type: mainImageUrl.assets[0].type,
                name: mainImageUrl.assets[0].fileName,
            });
        }

        console.log('mainImageUrl?.assets?.[0]?.fileName is::>>', mainImageUrl?.assets?.[0]?.fileName);
        console.log('oldMainImageFileName is::>>', oldMainImageFileName);
        // If no new main image, backend will use the old one (handled by backend logic)
        console.log('formData is::>>', formData);



        keyOrder.forEach((key) => {
            const value = additionalImages[key];
            const imgAsset = value?.assets?.[0];
            if (!imgAsset?.uri) return;

            if (imgAsset.uri.startsWith('http')) {
                // Send URL for unchanged image
                formData.append('additionalImages', imgAsset.uri);
            } else {
                // Send File for changed image
                formData.append('additionalImages', {
                    uri: imgAsset.uri,
                    type: imgAsset.type,
                    name: imgAsset.fileName,
                });
            }
        });

        // (3) Menu Images with Meta
        // const menuImageMetaData = [];
        // Object.entries(menuImages).forEach(([key, value]) => {
        //     const imgAsset = value?.assets?.[0];
        //     if (imgAsset?.uri && !imgAsset.uri.startsWith('https://')) {
        //         formData.append('menuImages', {
        //             uri: imgAsset.uri,
        //             type: imgAsset.type,
        //             name: imgAsset.fileName,
        //         });
        //         menuImageMetaData.push({
        //             fileName: imgAsset.fileName,
        //             menuType: value?.menuType || "",
        //             menuPrice: value?.menuPrice || 0
        //         });
        //     }
        // });
        // formData.append('menuImagesMeta', JSON.stringify(menuImageMetaData));

        // (4) Append all text fields
        const functionHallAddessIs = { address: functionHallAddress, city: functionHallCity, pinCode: functionHallPinCode };
        formData.append('functionHallName', functionHallName);
        formData.append('description', description);
        formData.append('functionHallAreaInSft', functionHallAreaInSft);
        formData.append('hallAmenities', JSON.stringify(hallAmenities));
        formData.append('foodType', foodType);
        formData.append('seatingCapacity', seatingCapacity);
        formData.append('bedRooms', bedRooms);
        formData.append('rentPricePerDay', rentPricePerDay);
        formData.append('advanceAmount', advanceAmount);
        formData.append('advanceAmountInPercentageForMenu', advanceAmountPercentage);
        formData.append('discountPercentage', discountPercentage);
        formData.append('functionHallAddress', JSON.stringify(functionHallAddessIs));
        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('available', true);
        formData.append('accepted', false);
        formData.append('overTimeCharges', 500);
        formData.append('county', county);
        formData.append('latitude', '10.12');
        formData.append('longitude', '10.23');
        formData.append('serviceCharges', serviceCharges);
        formData.append('vendorEarningAmount', rentPricePerDay);
        formData.append('vendorEarningAmountAfterDiscount', discountPercentage);
        // Add other fields as per your API

        const token = await getVendorAuthToken();
        setLoading(true);



        try {
            const response = await axios.patch(`${BASE_URL}/EditFunctionHall/689b5718cc6425607182aef9`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setLoading(false);
                Alert.alert("Success", "Function Hall updated successfully!", [{
                    text: "Ok",
                    onPress: () => navigation.goBack()
                }]);
            } else {
                setLoading(false);
                Alert.alert('Error', 'Failed to update function hall');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to update: ' + (error.message || 'Unknown error'));
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#EBEDF3' }}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 12 }}>
                    <Modal
                        visible={isLocationPickerVisible}
                        animationType="slide"
                        onRequestClose={() => setLocationPickerVisible(false)}
                    >
                        <UserLocationPicker onLocationSelected={handleLocationSelected} onBack={setLocationPickerVisibleValue} />
                    </Modal>

                    <Text style={styles.sectionTitle}>General Details</Text>
                    <View style={styles.card}>
                        <ChooseFileField
                            label="Hall Image"
                            isRequired
                            onPressChooseFile={openGalleryOrCamera}
                        />
                        <TouchableOpacity onPress={openGalleryOrCamera}>
                            {mainImageUrl?.assets?.[0]?.uri ? (
                                <Image
                                    source={{ uri: mainImageUrl.assets[0].uri }}
                                    style={{ width: '100%', height: 300, borderRadius: 5 }}
                                    resizeMode="cover"
                                />
                            ) : null}
                        </TouchableOpacity>

                        <Text style={styles.label}>
                            Additional Images <Text style={styles.required}>*</Text>
                        </Text>
                        <FlatList
                            data={normalizedImages}
                            horizontal
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => openGalleryOrCameraForAdditonalImages(index)}>
                                    <Image source={{ uri: item.uri }} style={styles.additionalImage} />
                                </TouchableOpacity>
                            )}
                        />

                        <TextField
                            label="Hall Name"
                            value={functionHallName}
                            onChangeHandler={setFunctionHallName}
                            isRequired
                        />

                        <Text style={styles.label}>Food Type</Text>
                        <TextField
                            label="Food Type"
                            value={foodType}
                            onChangeHandler={setFoodType}
                        />

                        <TextField
                            label="Hall Description"
                            value={description}
                            onChangeHandler={setDescription}
                            isDescriptionField
                        />

                        {FOOD_TYPES.map(type => (
                            <TouchableOpacity key={type} onPress={() => setFoodType(type)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20, marginBottom: 10 }}>
                                <View style={{
                                    width: 22, height: 22, borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
                                    backgroundColor: foodType === type ? '#FD813B' : undefined,
                                    marginRight: 8
                                }} />
                                <Text>{type}</Text>
                            </TouchableOpacity>
                        ))}

                        {ALL_AMENITIES.map(item => (
                            <TouchableOpacity key={item} onPress={() => toggleAmenity(item)} style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <View style={{
                                    width: 22, height: 22, borderWidth: 1, borderColor: "#FD813B", borderRadius: 4,
                                    backgroundColor: selectedAmenities.includes(item) ? '#FD813B' : undefined,
                                    marginRight: 8
                                }} />
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        ))}

                        {SEATING_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={{
                                    borderWidth: seatingCapacity === opt ? 2 : 0,
                                    borderColor: seatingCapacity === opt ? '#ECA73C' : 'transparent',
                                    backgroundColor: '#FFF5E3',
                                    borderRadius: 5,
                                    padding: 10,
                                    margin: 5
                                }}
                                onPress={() => setSeatingCapacity(opt)}
                            >
                                <Text>{opt}</Text>
                            </TouchableOpacity>
                        ))}

                        <TextField
                            label="Bedrooms"
                            value={bedRooms}
                            onChangeHandler={setBedRooms}
                            keyboardType="number-pad"
                            isRequired
                        />

                        <TextField
                            label="Hall Area (in sft)"
                            value={functionHallAreaInSft}
                            onChangeHandler={setFunctionHallAreaInSft}
                            keyboardType="number-pad"
                            isRequired
                        />

                        {/* Hall Amenities: You can create UI as checkboxes below if needed */}

                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Do you have in-house catering?</Text>
                        <Switch
                            trackColor={{ false: '#ccc', true: '#FD813B' }}
                            thumbColor={menuAvailable ? '#ECA73C' : '#fff'}
                            onValueChange={() => setMenuAvailable(!menuAvailable)}
                            value={menuAvailable}
                        />
                    </View>

                    {menuAvailable && (
                        <View style={styles.card}>
                            <Text style={styles.subTitle}>Menu Details</Text>
                            {/* Insert menu upload UI here */}
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Pricing Details</Text>
                    <View style={styles.card}>
                        {!menuAvailable && (
                            <TextField
                                label="Per Day Charge (₹)"
                                value={rentPricePerDay}
                                onChangeHandler={setRentPricePerDay}
                                keyboardType="number-pad"
                            />
                        )}

                        <TextField
                            label={menuAvailable ? 'Advance Amount (%)' : 'Advance Booking Amount'}
                            value={menuAvailable ? advanceAmountPercentage : advanceAmount}
                            onChangeHandler={menuAvailable ? setAdvanceAmountPercentage : setAdvanceAmount}
                            keyboardType="number-pad"
                        />

                        <TextField
                            label="Over Time Charges / hr"
                            value={serviceCharges}
                            onChangeHandler={setServiceCharges}
                            keyboardType="number-pad"
                        />

                        {DISCOUNT_OPTIONS.map(opt => (
                            <TouchableOpacity key={opt}
                                onPress={() => setDiscountPercentage(opt)}
                                style={{
                                    backgroundColor: discountPercentage == opt ? '#FFD700' : '#FFF5E3',
                                    padding: 8, borderRadius: 5, margin: 5
                                }}>
                                <Text>{opt} %</Text>
                            </TouchableOpacity>
                        ))}

                    </View>

                    <Text style={styles.sectionTitle}>Function Hall Address</Text>
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={styles.addressPicker}>
                            <Text>{functionHallAddress || 'Select Address'}</Text>
                            <DetectLocation />
                        </TouchableOpacity>

                        <TextField
                            label="City"
                            value={functionHallCity}
                            onChangeHandler={setFunctionHallCity}
                        />
                        <TextField
                            label="Pin Code"
                            value={functionHallPinCode}
                            onChangeHandler={setFunctionHallPinCode}
                            keyboardType="number-pad"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={onPressEditAndSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
};

export default EditFunctionHall;

export const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBEDF3',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginVertical: 10,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    required: {
        color: 'red',
        fontWeight: '700',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 8,
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    additionalImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 8,
    },
    addressPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#FD813B',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
