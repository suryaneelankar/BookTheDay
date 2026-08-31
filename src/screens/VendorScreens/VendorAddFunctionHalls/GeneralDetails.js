import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Switch, Image, Dimensions, TouchableOpacity, Alert, Modal, TextInput, ScrollView, ActivityIndicator, BackHandler } from 'react-native';
import CustomAlert from '../../../components/CustomAlert';
import ChooseFileField from '../../../commonFields/ChooseFileField';
import ChooseMenuField from '../../../commonFields/ChooseMenuField';
import themevariable from '../../../utils/themevariable';
import TextField from '../../../commonFields/TextField';
import SelectedUploadIcon from '../../../assets/svgs/selectedUploadIcon.svg';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
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
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { formatAmount } from '../../../utils/GlobalFunctions';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';

const GeneralDetails = ({ isAadharUpdate }) => {
    const navigation = useNavigation();
    const [BedRooms, setBedRooms] = useState('');
    const [mainImageUrl, setMainImageUrl] = useState('');
    const [functionHallName, setfunctionHallName] = useState('');
    const [venueCategory, setVenueCategory] = useState(''); // Function Hall | Farm House | Luxury Resort | Banquet Hall
    const [productDescription, setProductDescription] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isFoodDropDownCollapsed, setIsFoodDropDownCollapsed] = useState(false);
    const [selectedFoodType, setSelectedFoodType] = useState('');
    const [additionalImages, setAdditionalImages] = useState({
        additionalImageOne: undefined,
        additionalImageTwo: undefined,
        additionalImageThree: undefined,
        additionalImageFour: undefined,
        additionalImageFive: undefined,
        additionalImageSix: undefined,
        additionalImageSeven: undefined,
        additionalImageEight: undefined
    });
    const [menuImages, setMenuImages] = useState({
        menuImageOne: undefined,
        menuImageTwo: undefined,
        menuImageThree: undefined,
        menuImageFour: undefined,
        menuImageFive: undefined,
        menuImageSix: undefined,
        menuImageSeven: undefined,
        menuImageEight: undefined
    });
    const [functionHallAddress, setfunctionHallAddress] = useState('');
    const [locationLatitude, setLocationLatitude] = useState();
    const [locationLongitude, setLocationLongitude] = useState();
    const [locationCountyVal, setLocationCountyVal] = useState();
    const [functionHallCity, setfunctionHallCity] = useState('');
    const [functionHallPinCode, setfunctionHallPinCode] = useState();
    const [perDayRentPrice, setPerDayRentPrice] = useState(0);
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [overTimeCharges, setOverTimeCharges] = useState();
    const [selectedItemArray, setSelectedItemArray] = useState([]);
    const [itemPrices, setItemPrices] = useState({});
    const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState('');
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const discountPercentageArr = ['0', '5', '10', '15', '20', '25', '30', '50'];
    const [selectedDiscountVal, setSelectedDiscountVal] = useState();
    const [menuAvailable, setMenuAvailable] = useState(false);
    const [basicNonVegPrice, setBasicNonVegPrice] = useState(0);
    const [basicVegPrice, setBasicVegPrice] = useState(0);
    const [premiumVegPrice, setPremiumVegPrice] = useState(0);
    const [premiumNonVegPrice, setPremiumNonVegPrice] = useState(0);
    const [eliteNonVegPrice, setEliteNonVegPrice] = useState(0);
    const [eliteVegPrice, setEliteVegPrice] = useState(0);
    const [basicVegMenuName, setBasicVegMenuName] = useState('');
    const [premiumVegMenuName, setPremiumVegMenuName] = useState('');
    const [eliteVegMenuName, setEliteVegMenuName] = useState('');
    const [basicNonVegMenuName, setBasicNonVegMenuName] = useState('');
    const [premiumNonVegMenuName, setPremiumNonVegMenuName] = useState('');
    const [eliteNonVegMenuName, setEliteNonVegMenuName] = useState('');
    const [advanceAmountPercentage, setAdvanceAmountPercentage] = useState(0);
    const [pickerModal, setPickerModal] = useState({ visible: false, index: null });
    const [videos, setVideos] = useState([null, null, null]);
    const [videoPickerModal, setVideoPickerModal] = useState({ visible: false, index: null });
    const [videoPreview, setVideoPreview] = useState({ visible: false, uri: null });
    const [videoPaused, setVideoPaused] = useState(false);

    const [loading, setLoading] = useState(false);
    const [functionHallAreaInSft, setfunctionHallAreaInSft] = useState('');

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

    const [includedGuestCount, setIncludedGuestCount] = useState('');

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

    const foodTypes = [
        { name: 'veg', icon: VegIcon },
        { name: 'non-veg', icon: NonVegIcon },
        { name: 'Both', icon: VegNonVegIcon }
    ]

    const seatingCapacity = ['50-100', '100-200', '200-400', '400-600', '600-800', '800-1000', '1000-1200', '1200+'];
    const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);

    const rentalItems = [
        { name: 'Tables with basic covers' },
        { name: 'Chairs' },
        { name: 'Restrooms/Toilets' },
        { name: 'Parking' },
        { name: 'Wheelchair access' },
        { name: 'Coolers / Fans' },
        { name: 'Air Conditioners (AC)' },
        { name: 'Bedrooms' },
        { name: 'Sound/music license' },
        { name: 'Lighting' },
        { name: 'Power Backup' },
        { name: 'Bridal Room' },
        { name: 'Kitchen Space' }
    ];

    const onChangeBedRooms = (value) => {
        setBedRooms(value);
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

    const onChangeAdvanceAmount = (value) => {
        setAdvanceAmount(value);
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

    const onChangeAdvanceAmountPercentage = (value) => {
        setAdvanceAmountPercentage(value);
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
        },
        {
            id: 4,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 5,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 6,
            imageUrl: SelectedUploadIcon,
        },
        {
            id: 7,
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


    const VIDEO_SIZE_LIMIT = 35 * 1024 * 1024; // 35 MB

    const handlePickVideo = async (source) => {
        const idx = videoPickerModal.index;
        setVideoPickerModal({ visible: false, index: null });
        try {
            let picked = null;
            if (source === 'gallery') {
                await new Promise(resolve => {
                    launchImageLibrary({ mediaType: 'video' }, (res) => {
                        if (!res.didCancel && !res.errorCode) {
                            const asset = res.assets?.[0];
                            if (asset?.fileSize > VIDEO_SIZE_LIMIT) {
                                CustomAlert.alert('File too large', 'Please select a video under 35 MB.', undefined, { type: 'warning' });
                            } else {
                                picked = asset;
                            }
                        }
                        resolve();
                    });
                });
            } else {
                const result = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.video] });
                if (result.size > VIDEO_SIZE_LIMIT) {
                    CustomAlert.alert('File too large', 'Please select a video under 35 MB.', undefined, { type: 'warning' });
                } else {
                    picked = { uri: result.uri, fileName: result.name, type: result.type, fileSize: result.size };
                }
            }
            if (picked) {
                setVideos(prev => { const updated = [...prev]; updated[idx] = picked; return updated; });
            }
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) console.error('Video picker error:', err);
        }
    };

    const VideoPreviewModal = ({ visible, uri, onClose }) => (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={onClose}
                    style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, padding: 8 }}
                >
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>

                {uri && (
                    <TouchableOpacity activeOpacity={1} onPress={() => setVideoPaused(p => !p)}>
                        <Video
                            source={{ uri }}
                            style={{ width: Dimensions.get('window').width, height: 300 }}
                            resizeMode="contain"
                            paused={videoPaused}
                            controls={true}
                            onError={(e) => console.error('Video error:', e)}
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={onClose}
                    style={[styles.cancelBtn, { marginHorizontal: 20, marginTop: 20 }]}
                >
                    <Text style={styles.cancelText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );

    const VideoPickerModal = ({ visible, onClose }) => (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Select Video</Text>
                <Text style={[styles.subTitle, { marginBottom: 8 }]}>Max size: 35 MB</Text>

                <TouchableOpacity style={styles.option} onPress={() => handlePickVideo('gallery')}>
                    <Text style={styles.optionIcon}>🎞️</Text>
                    <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => handlePickVideo('file')}>
                    <Text style={styles.optionIcon}>📁</Text>
                    <Text style={styles.optionText}>File Manager</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );

    const ImagePickerModal = ({ visible, onClose, onGallery, onCamera, onFileManager }) => (
        <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
            <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Select Image</Text>

                <TouchableOpacity style={styles.option} onPress={onGallery}>
                    <Text style={styles.optionIcon}>🖼️</Text>
                    <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={onCamera}>
                    <Text style={styles.optionIcon}>📷</Text>
                    <Text style={styles.optionText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={onFileManager}>
                    <Text style={styles.optionIcon}>📁</Text>
                    <Text style={styles.optionText}>File Manager</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );


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
                if (index == 0) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageOne: response }));
                } else if (index == 1) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageTwo: response }));
                } else if (index == 2) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageThree: response }));
                } else if (index == 3) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageFour: response }));
                } else if (index == 4) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageFive: response }));
                } else if (index == 5) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageSix: response }));
                } else if (index == 6) {
                    setAdditionalImages(prev => ({ ...prev, additionalImageSeven: response }));
                } else {
                    setAdditionalImages(prev => ({ ...prev, additionalImageEight: response }));
                }
            }
        });
    };

    const imageKeys = [
        'additionalImageOne', 'additionalImageTwo', 'additionalImageThree',
        'additionalImageFour', 'additionalImageFive', 'additionalImageSix',
        'additionalImageSeven', 'additionalImageEight'
    ];

    const handleSetImage = (response) => {
        const key = imageKeys[pickerModal.index];
        setAdditionalImages(prev => ({ ...prev, [key]: response }));
        setPickerModal({ visible: false, index: null });
    };


    const openGalleryOrCameraForAdditonalIma = async (index) => {
        const imageKeys = [
            'additionalImageOne', 'additionalImageTwo', 'additionalImageThree',
            'additionalImageFour', 'additionalImageFive', 'additionalImageSix',
            'additionalImageSeven', 'additionalImageEight'
        ];

        const setImage = (response) => {
            setAdditionalImages({ ...additionalImages, [imageKeys[index]]: response });
        };

        Alert.alert('Select Image', 'Choose an option', [
            {
                text: 'Gallery',
                onPress: () => {
                    const options = { mediaType: 'photo', maxWidth: 1920, maxHeight: 1920, quality: 1 };
                    launchImageLibrary(options, (response) => {
                        if (!response.didCancel && !response.errorCode) setImage(response);
                    });
                }
            },
            {
                text: 'Camera',
                onPress: () => {
                    const options = { mediaType: 'photo', maxWidth: 1920, maxHeight: 1920, quality: 1 };
                    launchCamera(options, (response) => {
                        if (!response.didCancel && !response.errorCode) setImage(response);
                    });
                }
            },
            {
                text: 'File Manager',
                onPress: async () => {
                    try {
                        const result = await DocumentPicker.pickSingle({
                            type: [DocumentPicker.types.images],
                        });
                        setImage({ assets: [{ uri: result.uri, fileName: result.name, type: result.type }] });
                    } catch (err) {
                        if (!DocumentPicker.isCancel(err)) console.error('File picker error:', err);
                    }
                }
            },
            { text: 'Cancel', style: 'cancel' }
        ]);
    };

    const onChangeBasicVegMenuName = (value) => {
        setBasicVegMenuName(value);
        setMenuImages({
            ...menuImages,
            menuImageOne: {
                ...menuImages.menuImageOne,
                menuType: value,
            },
        });
    }

    const onChangePremiumVegMenuName = (value) => {
        setPremiumVegMenuName(value);
        setMenuImages({
            ...menuImages,
            menuImageTwo: {
                ...menuImages.menuImageTwo,
                menuType: value,
            },
        });
    }

    const onChangeEliteVegMenuName = (value) => {
        setEliteVegMenuName(value);
        setMenuImages({
            ...menuImages,
            menuImageThree: {
                ...menuImages.menuImageThree,
                menuType: value,
            },
        });
    }

    const onChangeBasicNonVegMenuName = (value) => {
        setBasicNonVegMenuName(value);
        setMenuImages({
            ...menuImages,
            menuImageFour: {
                ...menuImages.menuImageFour,
                menuType: value,
            },
        });
    }

    const onChangePremiumNonVegMenuName = (value) => {
        setPremiumNonVegMenuName(value);
        setMenuImages({
            ...menuImages,
            menuImageFive: {
                ...menuImages.menuImageFive,
                menuType: value,
            },
        });
    }

    const onChangeEliteNonVegMenuName = (value) => {
        setEliteNonVegMenuName(value);
        setMenuImages({
            ...menuImages,
            menuImageSix: {
                ...menuImages.menuImageSix,
                menuType: value,
            },
        });
    }

    const openGalleryOrCameraForMenuImages = async (index) => {
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
                    setMenuImages({
                        ...menuImages,
                        menuImageOne: {
                            assets: response.assets, // or just response if that's your structure
                            menuType: basicVegMenuName,
                            menuPrice: basicVegPrice, // replace with your price variable
                        },
                    });
                } else if (index == 1) {
                    setMenuImages({
                        ...menuImages,
                        menuImageTwo: {
                            assets: response.assets, // or just response if that's your structure
                            menuType: premiumVegMenuName,
                            menuPrice: premiumVegPrice, // replace with your price variable
                        },
                    });

                } else if (index == 2) {
                    setMenuImages({
                        ...menuImages,
                        menuImageThree: {
                            assets: response.assets, // or just response if that's your structure
                            menuType: eliteVegMenuName,
                            menuPrice: eliteVegPrice, // replace with your price variable
                        },
                    });
                }
                else if (index == 3) {
                    setMenuImages({
                        ...menuImages,
                        menuImageFour: {
                            assets: response.assets, // or just response if that's your structure
                            menuType: basicNonVegMenuName,
                            menuPrice: basicNonVegPrice, // replace with your price variable
                        },
                    });
                } else if (index == 4) {
                    setMenuImages({
                        ...menuImages,
                        menuImageFive: {
                            assets: response.assets, // or just response if that's your structure
                            menuType: premiumNonVegMenuName,
                            menuPrice: premiumNonVegPrice, // replace with your price variable
                        },
                    });
                } else if (index == 5) {
                    setMenuImages({
                        ...menuImages,
                        menuImageSix: {
                            assets: response.assets, // or just response if that's your structure
                            menuType: eliteNonVegMenuName,
                            menuPrice: eliteNonVegPrice, // replace with your price variable
                        },
                    });
                }
            }
        });
    }

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
                                : additionalImages?.additionalImageFive && index == 4 ?
                                    <Image
                                        source={{ uri: additionalImages?.additionalImageFive?.assets[0]?.uri }}
                                        width={Dimensions.get('window').width / 4.8}
                                        height={100}
                                        style={{ borderRadius: 5 }}
                                        resizeMode='cover'
                                    />
                                    : additionalImages?.additionalImageSix && index == 5 ?
                                        <Image
                                            source={{ uri: additionalImages?.additionalImageSix?.assets[0]?.uri }}
                                            width={Dimensions.get('window').width / 4.8}
                                            height={100}
                                            style={{ borderRadius: 5 }}
                                            resizeMode='cover'
                                        />
                                        : additionalImages?.additionalImageSeven && index == 6 ?
                                            <Image
                                                source={{ uri: additionalImages?.additionalImageSeven?.assets[0]?.uri }}
                                                width={Dimensions.get('window').width / 4.8}
                                                height={100}
                                                style={{ borderRadius: 5 }}
                                                resizeMode='cover'
                                            />
                                            : additionalImages?.additionalImageEight && index == 7 ?
                                                <Image
                                                    source={{ uri: additionalImages?.additionalImageEight?.assets[0]?.uri }}
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
        const { finalEarningAfterDiscount, earningAmount, serviceCharges } = calculateCharges();
        const missingField = [
            {
                invalid: !mainImageUrl,
                message: 'Please upload a main venue image.',
            },
            {
                invalid: !functionHallName?.trim(),
                message: 'Please enter the venue name.',
            },
            {
                invalid:
                    !selectedItemArray ||
                    selectedItemArray.length === 0,
                message: 'Please select at least one amenity.',
            },
            {
                invalid: !functionHallAddress,
                message: 'Please select the venue location on Google Maps.',
            },
            {
                invalid: !venueCategory?.trim(),
                message: 'Please select a venue category.',
            },
        ].find(field => field.invalid);

        if (missingField) {
            CustomAlert.alert(
                'Required field',
                missingField.message,
                undefined,
                { type: 'warning' },
            );
            return;
        }
        // console.log('menuAvailable is::>>>',menuAvailable);
        if (!menuAvailable) {
            if ((perDayRentPrice === 0 || perDayRentPrice === undefined) || (advanceAmount === undefined || advanceAmount === 0)) {
                CustomAlert.alert('Please fill Mandatory fields', 'Please fill Per Day Rent Price & Advance amount', undefined, { type: 'warning' });
                return;
            }
        } else {
            if ((basicVegPrice === 0 || basicVegPrice === undefined) || (advanceAmountPercentage === 0 || advanceAmountPercentage === undefined)) {
                CustomAlert.alert('Please fill Mandatory fields', 'Please fill Veg Menu Price & Advance percentage', undefined, { type: 'warning' });
                return;
            }
        }

        if (selectedSeatingCapacity === '') {
            CustomAlert.alert('Please fill Mandatory fields', 'Please select the seating capacity of your venue', undefined, { type: 'warning' });
            return;
        }

        if (selectedFoodType === '') {
            CustomAlert.alert('Please fill Mandatory fields', 'Please select the food type allowed in your venue', undefined, { type: 'warning' });
            return;
        }

        if (BedRooms === '') {
            CustomAlert.alert('Please fill Mandatory fields', 'Please enter total rooms count', undefined, { type: 'warning' });
            return;
        }

        if (basicVegPrice > 0 && basicVegMenuName === '') {
            setBasicVegMenuName('Basic Veg Menu');
        }
        if (premiumVegPrice > 0 && premiumVegMenuName === '') {
            setPremiumVegMenuName('Premium Veg Menu');
        }
        if (eliteVegPrice > 0 && eliteVegMenuName === '') {
            setEliteVegMenuName('Elite Veg Menu');
        }
        if (basicNonVegPrice > 0 && basicNonVegMenuName === '') {
            setBasicNonVegMenuName('Basic Non Veg Menu');
        }
        if (premiumNonVegPrice > 0 && premiumNonVegMenuName === '') {
            setPremiumNonVegMenuName('Premium Non Veg Menu');
        }
        if (eliteNonVegPrice > 0 && eliteNonVegMenuName === '') {
            setEliteNonVegMenuName('Elite Non Veg Menu');
        }

        Object.entries(menuImages).forEach(([key, value]) => {
            console.log('value is ::>>', value);
            if (value?.menuPrice && (!value?.assets || value.assets.length === 0)) {
                CustomAlert.alert('Missing Image', `Please upload an image for menu.`, undefined, { type: 'warning' });
                return;
            }
        });

        const uploadedImagesCount = Object.values(additionalImages).filter(value => value !== undefined).length;

        if (uploadedImagesCount < 4) {
            CustomAlert.alert('Incomplete Details', 'Please upload at least 4 images.', undefined, { type: 'warning' });
            return; // Exit immediately if the total uploaded images are less than 4
        }

        for (const [key, value] of Object.entries(additionalImages)) {
            if (uploadedImagesCount < 4) {
                if (value === undefined) {
                    CustomAlert.alert('Incomplete Details', `Please fill ${key.replace('additionalImage', 'Image ')}`, undefined, { type: 'warning' });
                    return; // Exit immediately if any image is undefined
                }
            }
        }

        // if (venueCategory === 'Farm House') {
        //     const guestCount = Number(includedGuestCount);

        //     if (
        //         !Number.isInteger(guestCount) ||
        //         guestCount < 1 ||
        //         guestCount > 10000
        //     ) {
        //         Alert.alert(
        //             'Guests included',
        //             'Enter a whole number between 1 and 10,000.',
        //         );
        //         return;
        //     }
        // }

        const vendorMobileNumber = vendorLoggedInMobileNum
        const formData = new FormData();
        // console.log('mainImageUrl is ::>>>', mainImageUrl);
        // console.log('additionalImages is::>>>', additionalImages);

        // Helper: sanitize filename — remove spaces, parentheses, special chars
        const sanitizeFileName = (name) => {
            if (!name) return `image_${Date.now()}.jpg`;
            return name.replace(/[^a-zA-Z0-9._-]/g, '_');
        };

        formData.append('professionalImage', {
            uri: mainImageUrl?.assets[0]?.uri,
            type: mainImageUrl?.assets[0]?.type || 'image/jpeg',
            name: sanitizeFileName(mainImageUrl?.assets[0]?.fileName),
        });

        if (venueCategory === 'Farm House') {
            if (String(includedGuestCount ?? '').trim() !== '') {
                formData.append(
                    'includedGuestCount',
                    String(includedGuestCount).trim(),
                );
            }
        }

        Object.entries(additionalImages).forEach(([key, value]) => {
            const imageAsset = value?.assets?.[0];
            if (imageAsset?.uri) {
                formData.append('additionalImages', {
                    uri: imageAsset.uri,
                    type: imageAsset.type || 'image/jpeg',
                    name: sanitizeFileName(imageAsset.fileName),
                });
            }
        });


        const menuImageMetaData = [];

        Object.entries(menuImages).forEach(([key, value]) => {
            const imageAsset = value?.assets?.[0];
            if (imageAsset?.uri) {
                formData.append('menuImages', {
                    uri: imageAsset.uri,
                    type: imageAsset.type,
                    name: imageAsset.fileName,
                });

                // Save related metadata separately
                menuImageMetaData.push({
                    fileName: imageAsset.fileName,
                    menuType: value?.menuType || "",
                    menuPrice: value?.menuPrice || 0,
                });
            }
        });

        formData.append('menuImagesMeta', JSON.stringify(menuImageMetaData));

        videos.forEach((video, idx) => {
            if (video?.uri) {
                formData.append('hallVideos', {
                    uri: video.uri,
                    type: video.type || 'video/mp4',
                    name: video.fileName || `hall_video_${idx + 1}.mp4`,
                });
            }
        });

        const functionHallAddessIs = { "address": functionHallAddress, "city": functionHallCity, "pinCode": functionHallPinCode };
        formData.append('serviceType', 'driver');
        formData.append('description', productDescription);
        formData.append('hallAmenities', selectedItemArray);
        formData.append('functionHallName', functionHallName);
        formData.append('rentPricePerDay', perDayRentPrice);
        formData.append('venueCategory', venueCategory);
        formData.append('bedRooms', BedRooms);
        formData.append('available', true);
        formData.append('functionHallAddress', JSON.stringify(functionHallAddessIs));
        formData.append('vendorMobileNumber', vendorMobileNumber);
        formData.append('advanceAmount', advanceAmount);
        formData.append('advanceAmountInPercentageForMenu', advanceAmountPercentage);
        formData.append('discountPercentage', discountPercentage);
        formData.append('seatingCapacity', selectedSeatingCapacity);
        formData.append('accepted', false);
        formData.append('overTimeCharges', overTimeCharges);
        formData.append('county', locationCountyVal);
        formData.append('latitude', locationLatitude);
        formData.append('longitude', locationLongitude);
        formData.append('foodType', selectedFoodType);
        formData.append('functionHallAreaInSft', functionHallAreaInSft);
        formData.append('serviceCharges', serviceCharges);
        formData.append('vendorEarningAmount', earningAmount);
        formData.append('vendorEarningAmountAfterDiscount', finalEarningAfterDiscount)


        console.log('formdata is ::>>', formData);
        const token = await getVendorAuthToken();
        console.log('Vendor Token is::::::::>>', token);
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/AddFunctionHall`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 120000, // 2 minutes for large file uploads
            });
            console.log("booking response:", response);
            if (response.status === 201) {
                setLoading(false);
                console.log('Success', `uploaded successfully`);
                if (isAadharUpdate) {
                    CustomAlert.alert(
                        "Confirmation",
                        "Your product posted successfully",
                        [
                            {
                                text: "Ok", onPress: () => {
                                    navigation.goBack()
                                }
                            }
                        ],
                        { cancelable: false, type: 'success' }
                    );
                } else {
                    CustomAlert.alert(
                        "Confirmation",
                        "Your product posted successfully, Please complete KYC Status",
                        [
                            {
                                text: "Ok", onPress: () => {
                                    navigation.goBack()
                                    // navigation.navigate('EditFunctionHall');
                                }
                            }
                        ],
                        { cancelable: false, type: 'success' }
                    );
                }
            } else {
                setLoading(false);
                console.log('Error', 'Failed to upload document');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error uploading document test:', error.response?.data);
            console.error('Error uploading document:', error);
            console.log('Error', 'Failed to upload document');
        }
    }

    const discountPercentageList = () => {
        const onPressDiscountPercentage = (item) => {
            setDiscountPercentage(item);
            setSelectedDiscountVal(item);
        };

        return (
            <>
                {/* Location Picker Modal */}
                <Modal
                    visible={isLocationPickerVisible}
                    animationType="slide"
                    onRequestClose={handleCloseLocationPicker}
                >
                    <LocationPicker
                        onLocationSelected={handleLocationSelected}
                        onBack={handleCloseLocationPicker}
                    />
                </Modal>

                {/* Discount Percentage List */}
                <FlatList
                    data={discountPercentageArr}
                    numColumns={4}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.discountGrid}
                    renderItem={({ item }) => {
                        const isSelected = item === selectedDiscountVal;

                        return (
                            <TouchableOpacity
                                accessibilityRole="radio"
                                accessibilityState={{ selected: isSelected }}
                                style={[styles.discountOption, isSelected && styles.discountOptionSelected]}
                                onPress={() => onPressDiscountPercentage(item)}
                            >
                                <Text style={[styles.discountOptionText, isSelected && styles.discountOptionTextSelected]}>
                                    {item}%
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </>
        );
    };


    const ItemList = () => null; // replaced by AmenitiesGrid

    const RentalItemsList = () => null; // replaced by AmenitiesGrid

    const amenityIcons = {
        'Tables with basic covers': 'grid-outline',
        'Chairs': 'person-outline',
        'Restrooms/Toilets': 'water-outline',
        'Parking': 'car-outline',
        'Wheelchair access': 'accessibility-outline',
        'Coolers / Fans': 'thermometer-outline',
        'Air Conditioners (AC)': 'snow-outline',
        'Bedrooms': 'bed-outline',
        'Sound/music license': 'musical-notes-outline',
        'Lighting': 'bulb-outline',
        'Power Backup': 'battery-charging-outline',
        'Bridal Room': 'rose-outline',
        'Kitchen Space': 'restaurant-outline',
    };

    const AmenitiesGrid = () => (
        <View style={styles.amenitiesGrid}>
            {rentalItems.map((item) => {
                const isSelected = selectedItemArray.includes(item.name);
                return (
                    <TouchableOpacity
                        key={item.name}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                        style={[styles.amenityOption, isSelected && styles.amenityOptionSelected]}
                        onPress={() => addRentalItemOnPress(item.name)}
                        activeOpacity={0.75}>
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                        </View>
                        <Text style={[styles.amenityText, isSelected && styles.amenityTextSelected]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const addRentalItemOnPress = (itemName) => {
        setSelectedItemArray((previous) => {
            if (previous.includes(itemName)) {
                // Remove the item if it's already selected
                const updatedPrices = { ...itemPrices };
                // console.log('updated price is::>>', updatedPrices);
                delete updatedPrices[itemName];
                setItemPrices(updatedPrices);
                return previous.filter((item) => item !== itemName);
            } else {
                // Add the item if it's not already selected
                const updatedPrices = { ...itemPrices, itemName };
                // console.log('updated price added is::>>', updatedPrices);
                setItemPrices(updatedPrices);
                return [...previous, itemName];
            }
        });
    };


    const seatingCapacityList = () => {

        const onPressSeatingCapacity = (item) => {
            setSelectedSeatingCapacity(item);
        }

        return (
            <View style={styles.seatingGrid}>
                {seatingCapacity.map((item) => {
                    const isSelected = item === selectedSeatingCapacity;
                    return (
                    <TouchableOpacity
                        key={item}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isSelected }}
                        style={[styles.seatingOption, isSelected && styles.seatingOptionSelected]}
                        onPress={() => onPressSeatingCapacity(item)}
                    >
                        <Text style={[styles.seatingValue, isSelected && styles.seatingValueSelected]}>
                            {item}
                        </Text>
                        <Text style={[styles.seatingUnit, isSelected && styles.seatingUnitSelected]}>
                            guests
                        </Text>
                        {isSelected && <View style={styles.selectedDot} />}
                    </TouchableOpacity>
                    );
                })}
            </View>
        );
    }


    const RentalFoodTypeList = () => {

        const onSelectFoodType = (name) => {
            setSelectedFoodType(name);
        };

        const foodTypeConfig = [
            { name: 'veg', label: 'Veg' },
            { name: 'non-veg', label: 'Non-Veg' },
            { name: 'Both', label: 'Both' },
        ];

        return (
            <View style={styles.foodTypeWrapper}>
                <Text style={styles.labelText}>
                    Food Type<Text style={{ color: 'red' }}>*</Text>
                </Text>
                <Text style={styles.fieldHint}>Select the food options supported by this venue.</Text>
                <View style={styles.foodTypeRow}>
                    {foodTypeConfig.map((type) => {
                        const isSelected = selectedFoodType === type.name;
                        return (
                            <TouchableOpacity
                                key={type.name}
                                accessibilityRole="radio"
                                accessibilityState={{ selected: isSelected }}
                                style={[styles.foodTypeCard, isSelected && styles.foodTypeCardSelected]}
                                onPress={() => onSelectFoodType(type.name)}
                                activeOpacity={0.75}>
                                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                                <Text style={[styles.foodTypeLabel, isSelected && styles.foodTypeLabelSelected]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };


    const handleOpenLocationPicker = () => {
        setLocationPickerVisible(true);
    };

    const handleLocationSelected = (location, address) => {
        console.log('Selected Location halls:', location, "+++++++++", address);
        setfunctionHallAddress(address);
        setLocationCountyVal(location?.subDivisionArea);
        setLocationLatitude(location?.region?.latitude || 17.4021);
        setLocationLongitude(location?.region?.longitude || 78.4840);
        setfunctionHallCity(location?.subDivisionArea || '');
        setfunctionHallPinCode(location.pinCode);
        setLocationPickerVisible(false); // Hide the LocationPicker after selection
    };

    const handleCloseLocationPicker = () => {
        setLocationPickerVisible(false);
    };

    const handleMenuAvailableSwitch = () => {
        setMenuAvailable(!menuAvailable);
        if (!menuAvailable) {
            setAdvanceAmount(0); // If switching to true, set advance amount to 0
            setPerDayRentPrice(0);
        } else {
            setAdvanceAmountPercentage(0); // If switching to false, set advance amount percentage to 0
        }
    };


    const calculateCharges = () => {
        let earningAmount = perDayRentPrice - (perDayRentPrice * discountPercentage / 100);
        let serviceFeePercentage = 0.03; // 3% for < ₹10,000, 5% for ≥ ₹10,000
        let serviceCharges = earningAmount * serviceFeePercentage;
        let finalEarningAfterDiscount = earningAmount - serviceCharges;
        if (menuAvailable) {
            finalEarningAfterDiscount = 0;
            earningAmount = 0;
            serviceCharges = 0;
        }

        return { finalEarningAfterDiscount, earningAmount, serviceCharges }

    }

    const menuTypes = [
        {
            key: 'menuImageOne',
            label: 'Basic Veg',
            icon: 'veg',
            priceSetter: setBasicVegPrice,
            menuName: basicVegMenuName,
            menuNameSetter: onChangeBasicVegMenuName,
            imageIndex: 0,
            imageObj: menuImages?.menuImageOne,
        },
        {
            key: 'menuImageTwo',
            label: 'Premium Veg',
            icon: 'veg',
            priceSetter: setPremiumVegPrice,
            menuName: premiumVegMenuName,
            menuNameSetter: onChangePremiumVegMenuName,
            imageIndex: 1,
            imageObj: menuImages?.menuImageTwo,
        },
        {
            key: 'menuImageThree',
            label: 'Elite Veg',
            icon: 'veg',
            priceSetter: setEliteVegPrice,
            menuName: eliteVegMenuName,
            menuNameSetter: onChangeEliteVegMenuName,
            imageIndex: 2,
            imageObj: menuImages?.menuImageThree,
        },
        {
            key: 'menuImageFour',
            label: 'Basic Non-Veg',
            icon: 'non-veg',
            priceSetter: setBasicNonVegPrice,
            menuName: basicNonVegMenuName,
            menuNameSetter: onChangeBasicNonVegMenuName,
            imageIndex: 3,
            imageObj: menuImages?.menuImageFour,
        },
        {
            key: 'menuImageFive',
            label: 'Premium Non-Veg',
            icon: 'non-veg',
            priceSetter: setPremiumNonVegPrice,
            menuName: premiumNonVegMenuName,
            menuNameSetter: onChangePremiumNonVegMenuName,
            imageIndex: 4,
            imageObj: menuImages?.menuImageFive,
        },
        {
            key: 'menuImageSix',
            label: 'Elite Non-Veg',
            icon: 'non-veg',
            priceSetter: setEliteNonVegPrice,
            menuName: eliteNonVegMenuName,
            menuNameSetter: onChangeEliteNonVegMenuName,
            imageIndex: 5,
            imageObj: menuImages?.menuImageSix,
        },
    ];

    return (
        <View style={styles.screen}>
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



                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Icon name="business-outline" size={18} color="#A44A1F" />
                        </View>
                        <View style={styles.sectionHeaderCopy}>
                            <Text style={styles.mainHeading}>Venue details</Text>
                            <Text style={styles.sectionDescription}>Add accurate information customers can trust.</Text>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        <View style={styles.fieldBlock}>
                            <Text style={styles.fieldTitle}>Cover photo<Text style={styles.required}>*</Text></Text>
                            <Text style={styles.fieldHint}>Use a clear, well-lit photo that represents the venue.</Text>
                        <ChooseFileField
                            label={'Hall Image'}
                            isRequired={true}
                            placeholder={'Hall Image'}
                            onPressChooseFile={openGalleryOrCamera}
                        />
                        <TouchableOpacity onPress={() => { openGalleryOrCamera() }}>
                            {mainImageUrl ?
                                <Image
                                    source={{ uri: mainImageUrl?.assets[0].uri }}
                                    width={'100%'}
                                    height={300}
                                    style={styles.coverImage}
                                    resizeMode='cover'
                                /> : null}
                        </TouchableOpacity>
                        </View>

                        <View style={styles.fieldBlock}>
                        <Text style={styles.fieldTitle}>Gallery photos<Text style={styles.required}>*</Text></Text>
                        <Text style={styles.fieldHint}>Upload at least 4 and up to 8 additional photos.</Text>
                        <FlatList
                            data={data}
                            numColumns={4}
                            scrollEnabled={false}
                            renderItem={ListItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.photoGrid}
                        />
                        </View>

                        <View style={styles.fieldBlock}>
                        <Text style={styles.fieldTitle}>Venue videos</Text>
                        <Text style={styles.fieldHint}>Optional · up to 3 videos · maximum 35 MB each.</Text>
                        <View style={styles.videoRow}>
                            {videos.map((video, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => setVideoPickerModal({ visible: true, index: idx })}
                                    style={[styles.videoSlot, video && styles.videoSlotSelected]}
                                >
                                    <View style={styles.videoIconCircle}>
                                        <Icon name={video ? 'videocam' : 'videocam-outline'} size={20} color={video ? '#A44A1F' : '#8B817B'} />
                                    </View>
                                    <Text style={[styles.videoSlotText, video && styles.videoSlotTextSelected]} numberOfLines={2}>
                                        {video ? (video.fileName || 'Video ' + (idx + 1)) : `Upload Video ${idx + 1}`}
                                    </Text>
                                    {video && (
                                        <>
                                            <TouchableOpacity
                                                onPress={(e) => { e.stopPropagation?.(); setVideoPaused(false); setVideoPreview({ visible: true, uri: video.uri }); }}
                                                style={styles.previewButton}
                                            >
                                                <Text style={styles.previewButtonText}>Preview</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={(e) => { e.stopPropagation?.(); setVideos(prev => { const u = [...prev]; u[idx] = null; return u; }); }}
                                                style={styles.removeVideoButton}
                                            >
                                                <Icon name="close" size={13} color="#A13A3A" />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                        </View>

                        <TextField
                            label='Hall Name'
                            placeholder="Please Enter Hall Name"
                            value={functionHallName}
                            onChangeHandler={onChangefunctionHallName}
                            keyboardType='default'
                            isRequired={true}
                        />

                        {/* ── Venue Category ── */}
                        <Text style={styles.labelText}>
                            Venue Category<Text style={styles.required}>*</Text>
                        </Text>
                        <Text style={styles.fieldHint}>Choose the type that best describes your venue.</Text>
                        <View style={styles.venueCategoryGrid}>
                            {[
                                {
                                    label: 'Function Hall',
                                    desc: 'Indoor venues for weddings & events',
                                    iconName: 'business',
                                    color: '#FD813B',
                                    bg: '#FFF3EA',
                                },
                                {
                                    label: 'Farm House',
                                    desc: 'Open-air spaces & nature retreats',
                                    iconName: 'leaf',
                                    color: '#06BE66',
                                    bg: '#EDFBF3',
                                },
                                {
                                    label: 'Luxury Resort',
                                    desc: 'Premium venues & destination stays',
                                    iconName: 'water',
                                    color: '#ECA73C',
                                    bg: '#FFFBEA',
                                },
                                {
                                    label: 'Banquet Hall',
                                    desc: 'Elegant halls for grand celebrations',
                                    iconName: 'flower',
                                    color: '#A0143E',
                                    bg: '#FEF2F5',
                                },
                            ].map(cat => {
                                const selected = venueCategory === cat.label;
                                return (
                                    <TouchableOpacity
                                        key={cat.label}
                                        activeOpacity={0.88}
                                        onPress={() => setVenueCategory(cat.label)}
                                        style={[
                                            styles.venueCategoryCard,
                                            selected && styles.venueCategoryCardSelected,
                                        ]}>
                                        {/* Selected checkmark */}
                                        {selected && (
                                            <View style={styles.venueCategoryTick}>
                                                <Icon name="checkmark" size={11} color="#fff" />
                                            </View>
                                        )}
                                        {/* Icon circle */}
                                        <View style={[
                                            styles.venueCategoryIcon,
                                            selected && styles.venueCategoryIconSelected,
                                        ]}>
                                            <Icon
                                                name={`${cat.iconName}-outline`}
                                                size={26}
                                                color={selected ? '#FFFFFF' : '#8B5A3C'}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.venueCategoryLabel,
                                            selected && styles.venueCategoryLabelSelected,
                                        ]}>
                                            {cat.label}
                                        </Text>
                                        <Text style={styles.venueCategoryDesc} numberOfLines={2}>
                                            {cat.desc}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {RentalFoodTypeList()}

                        <TextField
                            label='Hall Description'
                            placeholder="Describe about function hall"
                            value={productDescription}
                            onChangeHandler={onChangeDescription}
                            keyboardType='default'
                            isRequired={false}
                            isDescriptionField={true}
                        />

                        <Text style={styles.labelText}>Seating Capacity<Text style={styles.required}>*</Text></Text>
                        <Text style={styles.fieldHint}>Choose the maximum comfortable seating range.</Text>
                        {seatingCapacityList()}


                        {venueCategory === 'Farm House' && (
                            <View style={styles.guestCountContainer}>
                                <TextField
                                    label='Guests Included'
                                    value={includedGuestCount}
                                    onChangeHandler={value => setIncludedGuestCount(value.replace(/[^0-9]/g, ''))}
                                    placeholder="Example: 12"
                                    placeholderTextColor="#999"
                                    keyboardType="number-pad"
                                    maxLength={5}
                                    accessibilityLabel="Guests included in the price"
                                    isRequired={false}
                                />



                                <Text style={styles.guestCountHint}>
                                    If your price is ₹15,000 for 12 members, enter 12.
                                    This is not the maximum venue capacity.
                                </Text>
                            </View>
                        )}

                        <TextField
                            label='Bedrooms'
                            placeholder="Select Number"
                            value={BedRooms}
                            onChangeHandler={onChangeBedRooms}
                            keyboardType='number-pad'
                            isRequired={true}
                        />

                        <TextField
                            label='Hall Area (in sft)'
                            placeholder="Enter Sq Feet Area approx."
                            value={functionHallAreaInSft}
                            onChangeHandler={(text) => setfunctionHallAreaInSft(text)}
                            keyboardType='number-pad'
                            isRequired={false}
                        />


                        <View style={styles.fieldTitleRow}>
                            <Text style={styles.labelText}>Amenities<Text style={styles.required}>*</Text></Text>
                            <Text style={styles.selectedCount}>{selectedItemArray.length} selected</Text>
                        </View>
                        <Text style={styles.fieldHint}>Select every facility available at the venue.</Text>
                        {AmenitiesGrid()}

                        <View style={styles.cateringCard}>
                            <View style={styles.cateringCopy}>
                                <Text style={styles.cateringTitle}>In-house catering</Text>
                                <Text style={styles.cateringHint}>Enable this to add menus and per-plate prices.</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#D5D0CC', true: '#F0A374' }}
                                thumbColor={menuAvailable ? '#D96A2B' : '#FFFFFF'}
                                ios_backgroundColor="#D5D0CC"
                                // onValueChange={() => setMenuAvailable(!menuAvailable)}
                                onValueChange={handleMenuAvailableSwitch}
                                style={{ marginLeft: 10 }}
                                value={menuAvailable}
                            />
                        </View>
                        {menuAvailable && (
                            <View style={styles.menuSection}>
                                <Text style={styles.fieldTitle}>Menu packages</Text>
                                <Text style={styles.fieldHint}>Add only the menu packages currently offered by your venue.</Text>
                                {menuTypes.map((type, idx) => (
                                    <View key={type.key} style={styles.menuPackageCard}>
                                        <ChooseMenuField
                                            label={type.label}
                                            isRequired={false}
                                            placeholder={`Enter ${type.label} Price`}
                                            showIcon={true}
                                            IconName={type.icon}
                                            onChangeTextValue={text => {
                                                type.priceSetter(text);
                                                setMenuImages(prev => ({
                                                    ...prev,
                                                    [type.key]: {
                                                        ...prev[type.key],
                                                        menuPrice: text,
                                                    },
                                                }));
                                            }}
                                            onPressChooseFile={() => openGalleryOrCameraForMenuImages(type.imageIndex)}
                                        />
                                        <View style={{ bottom: 15 }}>
                                            <TextField
                                                label=""
                                                placeholder="Please Enter Menu Name"
                                                value={type.menuName}
                                                onChangeHandler={type.menuNameSetter}
                                                isRequired={false}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => openGalleryOrCameraForMenuImages(type.imageIndex)}>
                                            {type.imageObj?.assets && (
                                                <Image
                                                    source={{ uri: type.imageObj.assets[0]?.uri }}
                                                    width={'100%'}
                                                    height={300}
                                                    style={{ borderRadius: 5, marginTop: 0 }}
                                                    resizeMode="cover"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                    </View>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Icon name="pricetag-outline" size={18} color="#A44A1F" />
                        </View>
                        <View style={styles.sectionHeaderCopy}>
                            <Text style={styles.mainHeading}>Pricing details<Text style={styles.required}>*</Text></Text>
                            <Text style={styles.sectionDescription}>Keep rent, advance and additional charges transparent.</Text>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        {!menuAvailable ? (
                            <TextField
                                label='Per Day Charge (₹/ Per Day)'
                                placeholder="Please Enter per Day Charge"
                                value={perDayRentPrice}
                                onChangeHandler={onChangePerDayRentPrice}
                                keyboardType='number-pad'
                                isRequired={true}
                            />)
                            :
                            null
                        }
                        {!menuAvailable ? (
                            !isNaN(perDayRentPrice - (perDayRentPrice * discountPercentage / 100)) && perDayRentPrice ? (
                                <>
                                    {(() => {
                                        const discountedPrice = perDayRentPrice - (perDayRentPrice * discountPercentage / 100);
                                        const serviceFeePercentage = 0.03; // 3% for < ₹10,000, 5% for ≥ ₹10,000
                                        const serviceFee = discountedPrice * serviceFeePercentage;
                                        const finalEarning = discountedPrice - serviceFee;

                                        return (
                                            <View style={styles.earningSummary}>
                                                <Text style={styles.earningSummaryTitle}>Earning estimate</Text>
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
                                            </View>
                                        );
                                    })()}
                                </>
                            ) : null
                        ) : null}
                        <View style={styles.feeNotice}>
                            <Icon name="information-circle-outline" size={17} color="#8A4A22" />
                            <Text style={styles.feeNoticeText}>BookTheDay service fee: 3% for all orders.</Text>
                        </View>
                        {/* <Text style={styles.discountlabel}>5% for orders above ₹30,000</Text> */}

                        {!menuAvailable ? (
                            <TextField
                                label='Advance Booking Amount'
                                placeholder="Please Enter Advance Booking Amount"
                                value={advanceAmount}
                                onChangeHandler={onChangeAdvanceAmount}
                                keyboardType='number-pad'
                                isRequired={true}
                            />)
                            :
                            <TextField
                                label='Advance Amount Percentage ( % )'
                                placeholder="Please Enter Advance Amount Percentage %"
                                value={advanceAmountPercentage}
                                onChangeHandler={onChangeAdvanceAmountPercentage}
                                keyboardType='number-pad'
                                isRequired={true}
                            />
                        }
                        <TextField
                            label='Over Time Charges / hr'
                            placeholder="Please Enter OverTime Charges"
                            value={overTimeCharges}
                            onChangeHandler={onChangeOverTimeCharges}
                            keyboardType='number-pad'
                            isRequired={false}
                        />

                        <Text style={styles.labelText}>Discount, if any</Text>
                        <Text style={styles.fieldHint}>Select the discount applied to the venue rent.</Text>
                        {discountPercentageList()}
                    </View>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Icon name="location-outline" size={18} color="#A44A1F" />
                        </View>
                        <View style={styles.sectionHeaderCopy}>
                            <Text style={styles.mainHeading}>Venue location</Text>
                            <Text style={styles.sectionDescription}>Pick the exact location so customers can find the venue.</Text>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>

                        <Text style={[styles.textInputlabel, { marginTop: 0 }]}>
                            Address<Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TouchableOpacity onPress={handleOpenLocationPicker} style={[styles.textTnputView, { height: 100, flexDirection: "row", }]}>
                            <View style={{ height: '100%', width: "85%" }}>
                                <TextInput
                                    onChangeText={onChangefunctionHallAddress}
                                    value={functionHallAddress}
                                    placeholder="Please Enter Address"
                                    placeholderTextColor={"#7E8389"}
                                    keyboardType={'default'}
                                    style={{ height: '100%', textAlignVertical: 'top', padding: 10, color: "#333333" }}
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
                            value={functionHallCity}
                            onChangeHandler={onChangefunctionHallCity}
                            keyboardType='default'
                            isRequired={false}
                        />
                        <TextField
                            label='Pin code'
                            placeholder="Please Enter Pin code"
                            value={functionHallPinCode}
                            onChangeHandler={onChangefunctionHallPinCode}
                            keyboardType='number-pad'
                            isRequired={false}
                        />
                    </View>

                    <VideoPreviewModal
                        visible={videoPreview.visible}
                        uri={videoPreview.uri}
                        onClose={() => { setVideoPreview({ visible: false, uri: null }); setVideoPaused(true); }}
                    />

                    <VideoPickerModal
                        visible={videoPickerModal.visible}
                        onClose={() => setVideoPickerModal({ visible: false, index: null })}
                    />

                    <ImagePickerModal
                        visible={pickerModal.visible}
                        onClose={() => setPickerModal({ visible: false, index: null })}
                        onGallery={() => {
                            const idx = pickerModal.index;
                            setPickerModal({ visible: false, index: null });
                            launchImageLibrary({ mediaType: 'photo', maxWidth: 1920, maxHeight: 1920, quality: 1 }, (res) => {
                                if (!res.didCancel && !res.errorCode) {
                                    const key = imageKeys[idx];
                                    setAdditionalImages(prev => ({ ...prev, [key]: res }));
                                }
                            });
                        }}
                        onCamera={() => {
                            const idx = pickerModal.index;
                            setPickerModal({ visible: false, index: null });
                            launchCamera({ mediaType: 'photo', maxWidth: 1920, maxHeight: 1920, quality: 1 }, (res) => {
                                if (!res.didCancel && !res.errorCode) {
                                    const key = imageKeys[idx];
                                    setAdditionalImages(prev => ({ ...prev, [key]: res }));
                                }
                            });
                        }}
                        onFileManager={async () => {
                            const idx = pickerModal.index;
                            setPickerModal({ visible: false, index: null });
                            try {
                                const result = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.images] });
                                const key = imageKeys[idx];
                                setAdditionalImages(prev => ({ ...prev, [key]: { assets: [{ uri: result.uri, fileName: result.name, type: result.type }] } }));
                            } catch (err) {
                                if (!DocumentPicker.isCancel(err)) console.error('File picker error:', err);
                            }
                        }}
                    />

                    {/* <Text style={{ fontFamily: 'InterRegular', color: '#5F6377', fontSize: 15, fontWeight: '600' }}>I Accept Terms and Conditions</Text> */}

                </View>}

            {/* ── STICKY PUBLISH BUTTON ── */}
            {!loading && (
                // <View style={styles.stickyBar}>
                <TouchableOpacity
                    onPress={() => { onPressSaveAndPost(); }}
                    style={styles.publishBtn}
                    activeOpacity={0.85}>
                    <LinearGradient
                        colors={['#E47A3A', '#C75B24']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.publishBtnGradient}>
                        <Icon name="cloud-upload-outline" size={20} color="#fff" />
                        <Text style={styles.publishBtnText}>Submit for Review</Text>
                    </LinearGradient>
                </TouchableOpacity>
                // </View>
            )}

        </View>
    )
}

export default GeneralDetails

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#F7F5F3',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 4,
        marginBottom: 9,
    },
    sectionIcon: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#EDD3C2',
        borderRadius: 12,
        backgroundColor: '#FFF4EC',
    },
    sectionHeaderCopy: {
        flex: 1,
    },
    sectionDescription: {
        marginTop: 2,
        color: '#81756D',
        fontSize: 11,
        lineHeight: 15,
        fontFamily: 'ManropeRegular',
    },
    mainContainer: {
        paddingVertical: 16,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: '#ECE5E0',
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        shadowColor: '#5A3925',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },
    detailsContainer: {
        backgroundColor: 'red',
        borderRadius: 10,
    },
    mainHeading: {
        color: '#302A27',
        fontSize: 17,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
    },
    title: {
        fontFamily: 'ManropeRegular',
        fontWeight: 'bold',
        color: themevariable.Color_000000,
        fontSize: 18,
        marginTop: 10
    },
    guestCountContainer: {
        padding: 11,
        marginTop: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EFE4DD',
        borderRadius: 11,
        backgroundColor: '#FFFAF6',
    },
    guestCountLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    guestCountInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111',
        backgroundColor: '#FFF',
    },
    guestCountHint: {
        marginTop: 6,
        fontSize: 12,
        lineHeight: 18,
        color: '#786D66',
    },
    labelText: {
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        color: '#2F2925',
        fontSize: 15,
        marginTop: 16,
        marginBottom: 3,
    },
    required: {
        color: '#D14343',
        fontWeight: '800',
    },
    fieldBlock: {
        marginBottom: 18,
    },
    fieldTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    fieldTitle: {
        color: '#2F2925',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
    },
    fieldHint: {
        color: '#81756D',
        fontSize: 13,
        lineHeight: 16,
        marginTop: 3,
        marginBottom: 10,
        fontFamily: 'ManropeRegular',
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
    coverImage: {
        width: '100%',
        height: 230,
        marginTop: 9,
        borderRadius: 12,
    },
    photoGrid: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 4,
    },
    videoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    videoSlot: {
        flex: 1,
        minHeight: 108,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        marginHorizontal: 3,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#DDD3CC',
        borderRadius: 11,
        backgroundColor: '#FBFAF9',
    },
    videoSlotSelected: {
        borderStyle: 'solid',
        borderColor: '#E6B494',
        backgroundColor: '#FFF7F1',
    },
    videoIconCircle: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 11,
        backgroundColor: '#FFF0E5',
    },
    videoSlotText: {
        marginTop: 6,
        color: '#847A73',
        fontSize: 9,
        lineHeight: 12,
        textAlign: 'center',
        fontFamily: 'ManropeRegular',
    },
    videoSlotTextSelected: {
        color: '#8B3E19',
        fontWeight: '600',
    },
    previewButton: {
        marginTop: 6,
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#D96A2B',
    },
    previewButtonText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '700',
    },
    removeVideoButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 11,
        backgroundColor: '#FDECEC',
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
        marginHorizontal: 3,
        marginVertical: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E8DDD6',
        borderRadius: 8,
        backgroundColor: '#FAF8F6',
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
        color: themevariable.Color_000000,

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
        color: themevariable.Color_000000,
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
        color: '#4F6256',
        fontSize: 13,
        lineHeight: 16,
        marginTop: 5,
    },
    highlightedValue: {
        fontWeight: '800',
        color: '#277047',
    },
    textTnputView: {
        borderWidth: 1,
        marginTop: 13,
        borderColor: themevariable.Color_C8C8C6,
        // paddingHorizontal:12,
        borderRadius: 5,
    },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 34,
    },
    handle: {
        width: 40, height: 4, backgroundColor: '#ddd',
        borderRadius: 2, alignSelf: 'center', marginBottom: 16,
    },
    sheetTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 16 },
    option: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    },
    optionIcon: { fontSize: 22, marginRight: 14 },
    optionText: { fontSize: 15, color: '#333' },
    cancelBtn: {
        marginTop: 12, paddingVertical: 14,
        alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12,
    },
    cancelText: { fontSize: 15, color: '#e74c3c', fontWeight: '600' },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        marginBottom: 18,
    },

    categoryItem: {
        width: '23%',
    },

    categoryCard: {
        borderWidth: 1,
        borderRadius: 24,

        paddingTop: 18,
        paddingBottom: 14,
        paddingHorizontal: 8,

        alignItems: 'center',
        justifyContent: 'space-between',

        minHeight: 132,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,

        elevation: 2,
    },

    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 12,
    },

    categoryText: {
        fontSize: 11.5,
        textAlign: 'center',
        lineHeight: 16,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',

        minHeight: 34,
    },

    bottomIndicator: {
        width: 24,
        height: 4,
        borderRadius: 10,
        marginTop: 12,
    },
    // ── VENUE CATEGORY ──
    venueCategoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 6,
    },
    venueCategoryCard: {
        width: '48.5%',
        minHeight: 130,
        padding: 12,
        marginBottom: 9,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E2DD',
        backgroundColor: '#FCFBFA',
        alignItems: 'flex-start',
        position: 'relative',
    },
    venueCategoryCardSelected: {
        borderColor: '#E6A77F',
        backgroundColor: '#FFF4EC',
    },
    venueCategoryTick: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D96A2B',
    },
    venueCategoryIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 9,
        backgroundColor: '#F7EBE3',
    },
    venueCategoryIconSelected: {
        backgroundColor: '#D96A2B',
    },
    venueCategoryLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#100D25',
        fontFamily: 'ManropeRegular',
        marginBottom: 4,
    },
    venueCategoryLabelSelected: {
        color: '#8B3E19',
        fontWeight: '800',
    },
    venueCategoryDesc: {
        fontSize: 11,
        color: '#939393',
        fontFamily: 'ManropeRegular',
        lineHeight: 15,
    },

    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 6,
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
        fontSize: 13,
        lineHeight: 14,
        fontWeight: '500',
        fontFamily: 'ManropeRegular',
    },
    amenityTextSelected: {
        color: '#713716',
        fontWeight: '600',
    },
    amenitiesHint: {
        fontSize: 14,
        color: '#939393',
        fontFamily: 'ManropeRegular',
        marginTop: 2,
        marginBottom: 4,
    },
    amenitiesCount: {
        fontSize: 12,
        color: '#A0153E',
        fontFamily: 'ManropeRegular',
        fontWeight: '700',
        marginTop: 8,
    },
    // ── FOOD TYPE ──
    foodTypeWrapper: {
        marginTop: 5,
        marginBottom: 12,
    },
    foodTypeRow: {
        flexDirection: 'row',
        marginHorizontal: -3,
    },
    foodTypeCard: {
        flex: 1,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        paddingHorizontal: 7,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E8E1DC',
        backgroundColor: '#FCFBFA',
    },
    foodTypeCardSelected: {
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
    foodTypeLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#625A55',
        fontFamily: 'ManropeRegular',
        textAlign: 'center',
    },
    foodTypeLabelSelected: {
        color: '#8F3D17',
        fontWeight: '700',
    },
    seatingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
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
    cateringCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#E9DFD8',
        borderRadius: 12,
        backgroundColor: '#FFFAF6',
    },
    cateringCopy: {
        flex: 1,
        marginRight: 12,
    },
    cateringTitle: {
        color: '#332D29',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'ManropeRegular',
    },
    cateringHint: {
        marginTop: 3,
        color: '#81756D',
        fontSize: 10,
        lineHeight: 15,
        fontFamily: 'ManropeRegular',
    },
    menuSection: {
        marginTop: 14,
    },
    menuPackageCard: {
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EEE5DF',
        borderRadius: 12,
        backgroundColor: '#FCFBFA',
    },
    discountGrid: {
        paddingVertical: 7,
    },
    discountOption: {
        flex: 1,
        alignItems: 'center',
        margin: 4,
        paddingVertical: 9,
        borderWidth: 1,
        borderColor: '#E7DED8',
        borderRadius: 9,
        backgroundColor: '#FCFBFA',
    },
    discountOptionSelected: {
        borderColor: '#E79C6C',
        backgroundColor: '#FFF1E7',
    },
    discountOptionText: {
        color: '#655C57',
        fontSize: 11,
        fontWeight: '600',
    },
    discountOptionTextSelected: {
        color: '#8F3D17',
        fontWeight: '800',
    },
    earningSummary: {
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DCEEE3',
        borderRadius: 12,
        backgroundColor: '#F3FAF6',
    },
    earningSummaryTitle: {
        color: '#28613F',
        fontSize: 14,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
    },
    feeNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#FFF5ED',
    },
    feeNoticeText: {
        flex: 1,
        marginLeft: 7,
        color: '#71503C',
        fontSize: 10,
        lineHeight: 15,
        fontFamily: 'ManropeRegular',
    },
    locationPickerCard: {
        minHeight: 100,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
        borderWidth: 1,
        borderColor: '#E5D9D1',
        borderRadius: 11,
        backgroundColor: '#FBFAF9',
    },
    locationIconWrap: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#FFF0E5',
    },
    publishBtn: {
        marginTop: 18,
        marginHorizontal: 4,
        marginBottom: 24,
    },
    publishBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderRadius: 14,
        paddingVertical: 12,
    },
    publishBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'ManropeRegular',
        letterSpacing: 0.3,
    },
    stickyBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
})
