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
    const [venueCategory, setVenueCategory] = useState('Function Hall');
    const [includedGuestCount, setIncludedGuestCount] = useState('');
    const [hallAmenities, setHallAmenities] = useState([]); // array of amenities
    const [menuAvailable, setMenuAvailable] = useState(false);
    const [foodType, setFoodType] = useState('');
    const [rentPricePerDay, setRentPricePerDay] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');
    const [advanceAmountPercentage, setAdvanceAmountPercentage] = useState('');
    const [serviceCharges, setServiceCharges] = useState('');
    const [overTimeCharges, setOverTimeCharges] = useState('');
    const [available, setAvailable] = useState(true);
    const FOOD_TYPES = ["veg", "non-veg", "Both"];
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [oldMainImageFileName, setoldMainImageFileName] = useState('');

    // Address related
    const [functionHallAddress, setFunctionHallAddress] = useState('');
    const [functionHallCity, setFunctionHallCity] = useState('');
    const [functionHallPinCode, setFunctionHallPinCode] = useState('');
    const [county, setCounty] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('onhold');

    const VENUE_CATEGORIES = ['Function Hall', 'Banquet Hall', 'Farm House', 'Luxury Resort'];

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
    }, [hallId]);

    const loadFunctionHallDetails = async () => {
        setLoading(true);
        try {
            const token = await getVendorAuthToken();
            const response = await axios.get(`${BASE_URL}/vendor/function-halls/${hallId}/edit`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data?.data;
            if (!data?._id) throw new Error('Invalid venue response.');

            // Fill basic fields
            setFunctionHallName(data.functionHallName || '');
            setDescription(data.description || '');
            setSeatingCapacity(data.seatingCapacity?.toString() || '');
            setBedRooms(data.bedRooms?.toString() || '');
            setFunctionHallAreaInSft(data.functionHallAreaInSft?.toString() || '');
            // setFoodType(data.foodType || '');
            setMenuAvailable(Boolean(data.menuAvailable || data.pricingType === 'menu_based' || data.menuImages?.flat?.(Infinity)?.length));
            setRentPricePerDay(data.rentPricePerDay?.toString() || '');
            setAdvanceAmount(data.advanceAmount?.toString() || '');
            setAdvanceAmountPercentage(data.advanceAmountInPercentageForMenu?.toString() || '');
            setServiceCharges(data.serviceCharges?.toString() || '');
            setCounty(data.county || '');
            setVenueCategory(data.venueCategory || 'Function Hall');
            setIncludedGuestCount(data.includedGuestCount?.toString() || '');
            setOverTimeCharges(data.overTimeCharges?.toString() || '');
            setAvailable(data.available === true);
            setLatitude(data.latitude?.toString() || '');
            setLongitude(data.longitude?.toString() || '');
            setVerificationStatus(data.verificationStatus || 'onhold');

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
            console.log('data.professionalImage.url is::>>', data.professionalImage?.url);
            setoldMainImageFileName(data.professionalImage?.filename || '');

            // Main image from API response
            if (data.professionalImage?.url) {
                setMainImageUrl({
                    assets: [
                        {
                            uri: data.professionalImage.url,
                            fileName: data.professionalImage.filename || 'main.jpg',
                            type: data.professionalImage.mimetype || 'image/jpeg',
                            serverId: data.professionalImage._id,
                            isExisting: true,
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
                            serverId: img._id,
                            isExisting: true,
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
            console.error(
                'Error loading function hall details:',
                error.response?.status,
                error.response?.data,
            );

            Alert.alert(
                'Unable to load venue',
                error.response?.data?.message ||
                'Please try again.',
            )
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
    const normalizedImages = keyOrder.map((key) => ({
        key,
        uri: additionalImages[key]?.assets?.[0]?.uri || '',
    }));

    const handleLocationSelected = (location, address) => {
        if (!location || !address) return;
        // address is expected string, location has city, pinCode, lat, lon etc
        setFunctionHallAddress(address);
        setFunctionHallCity(location.city || location.subDivisionArea || '');
        setFunctionHallPinCode(location.pinCode?.toString() || '');
        setCounty(location.county || location.subDivisionArea || '');
        const nextLatitude = location?.region?.latitude ?? location?.latitude;
        const nextLongitude = location?.region?.longitude ?? location?.longitude;
        if (Number.isFinite(Number(nextLatitude))) setLatitude(String(nextLatitude));
        if (Number.isFinite(Number(nextLongitude))) setLongitude(String(nextLongitude));
        setLocationPickerVisible(false);
    };

    const setLocationPickerVisibleValue = () => {
        setLocationPickerVisible(false);
    };

    // Save changes handler - Implement API call here
    const onPressEditAndSave = async () => {
        if (!functionHallName.trim()) return Alert.alert('Required field', 'Enter the venue name.');
        if (!selectedAmenities.length) return Alert.alert('Required field', 'Select at least one amenity.');
        if (!seatingCapacity) return Alert.alert('Required field', 'Select seating capacity.');
        if (!foodType) return Alert.alert('Required field', 'Select food type.');
        if (!functionHallAddress || !latitude || !longitude)
            return Alert.alert('Required field', 'Select the venue location on the map.');
        if (!mainImageUrl?.assets?.[0]?.uri)
            return Alert.alert('Required field', 'Keep or select a cover photo.');

        const selectedGallery = keyOrder
            .map(key => additionalImages[key]?.assets?.[0])
            .filter(asset => asset?.uri);
        if (selectedGallery.length < 4 || selectedGallery.length > 8)
            return Alert.alert('Additional photos', 'Keep or select a total of 4–8 photos.');

        if (!menuAvailable && (!Number(rentPricePerDay) || !Number(advanceAmount)))
            return Alert.alert('Pricing details', 'Enter daily rent and advance amount.');
        if (menuAvailable && !Number(advanceAmountPercentage))
            return Alert.alert('Pricing details', 'Enter the menu advance percentage.');
        if (venueCategory === 'Farm House' && includedGuestCount) {
            const guests = Number(includedGuestCount);
            if (!Number.isInteger(guests) || guests < 1 || guests > 10000)
                return Alert.alert('Included guests', 'Enter a whole number between 1 and 10,000.');
        }

        const formData = new FormData();

        // (1) Professional Image — Only if new
        if (mainImageUrl?.assets?.[0]?.uri && !mainImageUrl.assets[0].isExisting) {
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



        const retainedAdditionalImageIds = [];
        keyOrder.forEach((key) => {
            const value = additionalImages[key];
            const imgAsset = value?.assets?.[0];
            if (!imgAsset?.uri) return;

            if (imgAsset.isExisting && imgAsset.serverId) {
                retainedAdditionalImageIds.push(String(imgAsset.serverId));
            } else {
                // Send File for changed image
                formData.append('additionalImages', {
                    uri: imgAsset.uri,
                    type: imgAsset.type,
                    name: imgAsset.fileName,
                });
            }
        });
        formData.append('retainedAdditionalImageIds', JSON.stringify(retainedAdditionalImageIds));

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
        formData.append('hallAmenities', JSON.stringify(selectedAmenities));
        formData.append('foodType', foodType);
        formData.append('seatingCapacity', seatingCapacity);
        formData.append('bedRooms', bedRooms);
        formData.append('rentPricePerDay', rentPricePerDay);
        formData.append('advanceAmount', advanceAmount);
        formData.append('advanceAmountInPercentageForMenu', advanceAmountPercentage);
        formData.append('discountPercentage', discountPercentage);
        formData.append('functionHallAddress', JSON.stringify(functionHallAddessIs));
        formData.append('venueCategory', venueCategory);
        formData.append('menuAvailable', String(menuAvailable));
        formData.append('available', String(available));
        formData.append('overTimeCharges', overTimeCharges || '0');
        formData.append('county', county);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        if (venueCategory === 'Farm House' && includedGuestCount.trim())
            formData.append('includedGuestCount', includedGuestCount.trim());
        // Add other fields as per your API

        const token = await getVendorAuthToken();
        setLoading(true);



        try {
            const response = await axios.patch(`${BASE_URL}/vendor/function-halls/${hallId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setLoading(false);
                Alert.alert(
                    response.data?.requiresReview ? 'Submitted for review' : 'Updated',
                    response.data?.message || 'Venue updated successfully.',
                    [{
                        text: "Ok",
                        onPress: () => navigation.goBack()
                    }]
                );
            } else {
                setLoading(false);
                Alert.alert('Error', 'Failed to update function hall');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert(
                'Unable to update',
                error.response?.data?.message || error.message || 'Please try again.',
            );
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
                    <View style={styles.reviewNotice}>
                        <Text style={styles.reviewNoticeTitle}>Approval policy</Text>
                        <Text style={styles.reviewNoticeText}>
                            Changes to details, pricing, location, category or photos move this listing to On Hold for admin review. Availability-only changes remain approved.
                        </Text>
                        <Text style={styles.currentStatus}>Current status: {verificationStatus}</Text>
                    </View>
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
                            keyExtractor={item => item.key}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity onPress={() => openGalleryOrCameraForAdditonalImages(index)}>
                                    {item.uri ? (
                                        <Image source={{ uri: item.uri }} style={styles.additionalImage} />
                                    ) : (
                                        <View style={[styles.additionalImage, styles.addImagePlaceholder]}>
                                            <Text style={styles.addImageText}>+ Photo</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                        <TextField
                            label="Hall Name"
                            value={functionHallName}
                            onChangeHandler={setFunctionHallName}
                            isRequired
                        />

                        <Text style={styles.label}>Venue Category</Text>
                        <View style={styles.optionWrap}>
                            {VENUE_CATEGORIES.map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[styles.optionChip, venueCategory === category && styles.optionChipSelected]}
                                    onPress={() => setVenueCategory(category)}
                                >
                                    <Text style={[styles.optionChipText, venueCategory === category && styles.optionChipTextSelected]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {venueCategory === 'Farm House' && (
                            <TextField
                                label="Guests Included in Price"
                                value={includedGuestCount}
                                onChangeHandler={setIncludedGuestCount}
                                keyboardType="number-pad"
                            />
                        )}

                        <View style={styles.formSection}>
                            <Text style={styles.fieldTitle}>
                                Food Type <Text style={styles.required}>*</Text>
                            </Text>
                            <Text style={styles.fieldHint}>
                                Select the food options supported by this venue.
                            </Text>

                            <View style={styles.foodTypeRow}>
                                {FOOD_TYPES.map(type => {
                                    const selected = foodType === type;
                                    const label = type === 'veg'
                                        ? 'Veg'
                                        : type === 'non-veg'
                                            ? 'Non-Veg'
                                            : 'Both';

                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            activeOpacity={0.8}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected }}
                                            onPress={() => setFoodType(type)}
                                            style={[
                                                styles.foodTypeOption,
                                                selected && styles.foodTypeOptionSelected,
                                            ]}
                                        >
                                            <View style={[
                                                styles.radioOuter,
                                                selected && styles.radioOuterSelected,
                                            ]}>
                                                {selected && <View style={styles.radioInner} />}
                                            </View>
                                            <Text style={[
                                                styles.foodTypeText,
                                                selected && styles.foodTypeTextSelected,
                                            ]}>
                                                {label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <View style={styles.fieldTitleRow}>
                                <Text style={styles.fieldTitle}>
                                    Amenities <Text style={styles.required}>*</Text>
                                </Text>
                                <Text style={styles.selectedCount}>
                                    {selectedAmenities.length} selected
                                </Text>
                            </View>
                            <Text style={styles.fieldHint}>
                                Select every facility available at the venue.
                            </Text>

                            <View style={styles.amenitiesGrid}>
                                {ALL_AMENITIES.map(item => {
                                    const selected = selectedAmenities.includes(item);

                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            activeOpacity={0.8}
                                            accessibilityRole="checkbox"
                                            accessibilityState={{ checked: selected }}
                                            onPress={() => toggleAmenity(item)}
                                            style={[
                                                styles.amenityOption,
                                                selected && styles.amenityOptionSelected,
                                            ]}
                                        >
                                            <View style={[
                                                styles.checkbox,
                                                selected && styles.checkboxSelected,
                                            ]}>
                                                {selected && (
                                                    <Text style={styles.checkboxTick}>✓</Text>
                                                )}
                                            </View>
                                            <Text style={[
                                                styles.amenityText,
                                                selected && styles.amenityTextSelected,
                                            ]}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.formSection}>
                            <Text style={styles.fieldTitle}>
                                Seating Capacity <Text style={styles.required}>*</Text>
                            </Text>
                            <Text style={styles.fieldHint}>
                                Choose the maximum comfortable seating range.
                            </Text>

                            <View style={styles.seatingGrid}>
                                {SEATING_OPTIONS.map(option => {
                                    const selected = seatingCapacity === option;

                                    return (
                                        <TouchableOpacity
                                            key={option}
                                            activeOpacity={0.8}
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected }}
                                            onPress={() => setSeatingCapacity(option)}
                                            style={[
                                                styles.seatingOption,
                                                selected && styles.seatingOptionSelected,
                                            ]}
                                        >
                                            <Text style={[
                                                styles.seatingValue,
                                                selected && styles.seatingValueSelected,
                                            ]}>
                                                {option}
                                            </Text>
                                            <Text style={[
                                                styles.seatingUnit,
                                                selected && styles.seatingUnitSelected,
                                            ]}>
                                                guests
                                            </Text>
                                            {selected && (
                                                <View style={styles.selectedDot} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <TextField
                            label="Hall Description"
                            value={description}
                            onChangeHandler={setDescription}
                            isDescriptionField
                        />

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
                        />

                        {/* Hall Amenities: You can create UI as checkboxes below if needed */}

                    </View>

                    <View style={styles.switchRow}>
                        <View style={styles.switchCopy}>
                            <Text style={styles.switchLabel}>In-house catering</Text>
                            <Text style={styles.modeHint}>
                                Pricing mode is preserved. Menu photos and prices are not changed here.
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#ccc', true: '#FD813B' }}
                            thumbColor={menuAvailable ? '#ECA73C' : '#fff'}
                            value={menuAvailable}
                            disabled
                        />
                    </View>

                    {menuAvailable && (
                        <View style={styles.card}>
                            <Text style={styles.subTitle}>Menu Details</Text>
                            <Text style={styles.modeHint}>
                                Existing menu images and per-plate prices remain unchanged. You can update the advance percentage below.
                            </Text>
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
                            value={overTimeCharges}
                            onChangeHandler={setOverTimeCharges}
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

                    <View style={styles.switchRow}>
                        <View style={styles.switchCopy}>
                            <Text style={styles.switchLabel}>Accept new booking enquiries</Text>
                            <Text style={styles.modeHint}>
                                Availability-only updates do not require another admin review.
                            </Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#D4D4D8', true: '#F2A66F' }}
                            thumbColor={available ? '#FD813B' : '#FFFFFF'}
                            onValueChange={setAvailable}
                            value={available}
                        />
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
    reviewNotice: {
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1D1B8',
        borderRadius: 10,
        backgroundColor: '#FFF8F2',
    },
    reviewNoticeTitle: {
        color: '#8A3F18',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    reviewNoticeText: {
        color: '#6B4A3A',
        fontSize: 12,
        lineHeight: 18,
    },
    currentStatus: {
        color: '#8A3F18',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 6,
        textTransform: 'capitalize',
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
    formSection: {
        marginTop: 10,
        marginBottom: 16,
    },
    fieldTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fieldTitle: {
        color: '#2F2925',
        fontSize: 14,
        fontWeight: '700',
    },
    fieldHint: {
        color: '#81756D',
        fontSize: 11,
        lineHeight: 16,
        marginTop: 3,
        marginBottom: 10,
    },
    selectedCount: {
        color: '#9A431B',
        fontSize: 10,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#FFF0E5',
    },
    foodTypeRow: {
        flexDirection: 'row',
        marginHorizontal: -3,
    },
    foodTypeOption: {
        flex: 1,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderColor: '#E8E1DC',
        borderRadius: 10,
        backgroundColor: '#FCFBFA',
    },
    foodTypeOptionSelected: {
        borderColor: '#ECA170',
        backgroundColor: '#FFF3EA',
    },
    radioOuter: {
        width: 17,
        height: 17,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        borderWidth: 1.5,
        borderColor: '#B9AEA7',
        borderRadius: 9,
        backgroundColor: '#FFFFFF',
    },
    radioOuterSelected: {
        borderColor: '#D96A2B',
    },
    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#D96A2B',
    },
    foodTypeText: {
        color: '#625A55',
        fontSize: 11,
        fontWeight: '600',
    },
    foodTypeTextSelected: {
        color: '#8F3D17',
        fontWeight: '700',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    amenityOption: {
        width: '48.5%',
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 9,
        paddingVertical: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ECE6E1',
        borderRadius: 9,
        backgroundColor: '#FCFBFA',
    },
    amenityOptionSelected: {
        borderColor: '#EDB28B',
        backgroundColor: '#FFF7F1',
    },
    checkbox: {
        width: 19,
        height: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 7,
        borderWidth: 1.5,
        borderColor: '#BDB3AC',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    checkboxSelected: {
        borderColor: '#D96A2B',
        backgroundColor: '#D96A2B',
    },
    checkboxTick: {
        color: '#FFFFFF',
        fontSize: 12,
        lineHeight: 14,
        fontWeight: '900',
    },
    amenityText: {
        flex: 1,
        color: '#5F5752',
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '500',
    },
    amenityTextSelected: {
        color: '#713716',
        fontWeight: '600',
    },
    seatingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    seatingOption: {
        position: 'relative',
        width: '48.5%',
        minHeight: 55,
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E8E1DC',
        borderRadius: 10,
        backgroundColor: '#FCFBFA',
    },
    seatingOptionSelected: {
        borderColor: '#E99A67',
        backgroundColor: '#FFF3EA',
    },
    seatingValue: {
        color: '#403A36',
        fontSize: 13,
        fontWeight: '700',
    },
    seatingValueSelected: {
        color: '#8F3D17',
    },
    seatingUnit: {
        color: '#91857D',
        fontSize: 9,
        marginTop: 2,
    },
    seatingUnitSelected: {
        color: '#A65B32',
    },
    selectedDot: {
        position: 'absolute',
        top: 9,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#D96A2B',
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
    switchCopy: {
        flex: 1,
        marginRight: 12,
    },
    modeHint: {
        color: '#71717A',
        fontSize: 11,
        lineHeight: 16,
        marginTop: 3,
    },
    optionWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
        marginBottom: 8,
    },
    optionChip: {
        paddingHorizontal: 11,
        paddingVertical: 8,
        margin: 4,
        borderWidth: 1,
        borderColor: '#E7D8CD',
        borderRadius: 16,
        backgroundColor: '#FFF9F5',
    },
    optionChipSelected: {
        borderColor: '#FD813B',
        backgroundColor: '#FFF0E5',
    },
    optionChipText: {
        color: '#52525B',
        fontSize: 12,
        fontWeight: '500',
    },
    optionChipTextSelected: {
        color: '#9A431B',
        fontWeight: '700',
    },
    additionalImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 8,
    },
    addImagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E0B494',
        backgroundColor: '#FFF8F2',
    },
    addImageText: {
        color: '#9A431B',
        fontSize: 11,
        fontWeight: '600',
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
