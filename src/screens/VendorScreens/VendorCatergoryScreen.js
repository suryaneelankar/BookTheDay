import { StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Text, View, ScrollView } from 'react-native';
import themevariable from '../../utils/themevariable';
import FunctionHallVendorImg from '../../assets/vendorIcons/functionHallVendorImgs.svg';
import ClothVendorImg from '../../assets/vendorIcons/clothVendorImg.svg';
import CateringVendorImg from '../../assets/vendorIcons/cateringVendorImg.svg';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentVendorLoggedInUserName } from '../../../redux/actions';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { getVendorAuthToken } from '../../utils/StoreAuthToken';
import BASE_URL from '../../apiconfig';
import VendorHowItWorks from '../../components/VendorHowItWorks';
import JewelleryCard from '../../assets/svgs/homeSwippers/home_jewellerycard.svg';
import RightSideIcon from '../../assets/profilesvgs/Chevron-Right.svg';

const VendorCategoryScreen = ({ navigation }) => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [clothJewelBookingsData, setclothJewelBookingsData] = useState([]);
    const [functionHallBookingsData, setFunctionHallBookingsData] = useState([]);
    const [cateringsBookingsData, setCateringBookingsData] = useState([]);
    const [profileData, setProfileData] = useState();
    const [bookingsOverview, setBookingsOverview] = useState({
        total: 0,
        pending: 0,
        completed: 0,
    });
    const [totalBookings, setTotalBookings] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [pending, setPending] = useState(0);


    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            getProfileData();
            fetchBookingsOverview();
            getVendorClothJewelBookings();
            getVendorFunctionHallBookings();
            getVendorFoodCateringBookings();
            return () => console.log('Screen is unfocused');
        }, [])
    );

    useEffect(() => {
        const combinedData = [...functionHallBookingsData, ...cateringsBookingsData, ...clothJewelBookingsData];

        setTotalBookings(combinedData?.length);

        const completedCount = combinedData.filter(item => item?.bookingStatus === "approved" || item?.bookingStatus === "payment successful");

        const pendingCount = combinedData.filter(booking => booking?.bookingStatus === 'requested');

        setCompleted(completedCount?.length);
        setPending(pendingCount?.length);
    }, [functionHallBookingsData, cateringsBookingsData, clothJewelBookingsData]);

    const getVendorClothJewelBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/clothJewelBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const activeBookings = response?.data?.data.filter((booking) => booking.isActiveBooking === true);
            setclothJewelBookingsData(activeBookings);
        } catch (error) {
            console.log("clothJewelBookingsGotForVendor error::::::::::", error);
        }
    };

    const getVendorFunctionHallBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/functionHallBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const activeBookings = response?.data?.data.filter((booking) => booking.isActiveBooking === true);
            setFunctionHallBookingsData(activeBookings);

        } catch (error) {
            console.log("functionHallBookingsGotForVendor error::::::::::", error);
        }
    };

    const getVendorFoodCateringBookings = async () => {
        const vendorMobileNumber = vendorLoggedInMobileNum;
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/foodCateringBookingsGotForVendor/${vendorMobileNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log('resp foodcateringBookings ::>>', response?.data?.data);
            const activeBookings = response?.data?.data.filter((booking) => booking.isActiveBooking === true);
            // const outputData = consolidateFoodCateringDataByProductId(activeBookings);
            // const outputData = consolidateFoodCateringDataByProductId(response?.data?.data);
            setCateringBookingsData(activeBookings);

        } catch (error) {
            console.log("foodCateringBookingsGotForVendor error::::::::::", error);
        }
    };


    const getProfileData = async () => {
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/vendor/getVendorProfile/${vendorLoggedInMobileNum}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData(response?.data?.data);
            dispatch(getCurrentVendorLoggedInUserName(response?.data?.data?.fullName));
        } catch (error) {
            console.log("Profile fetch error:", error);
        }
    };

    const fetchBookingsOverview = async () => {
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/vendor/bookingsOverview`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookingsOverview(response?.data || { total: 0, pending: 0, completed: 0 });
        } catch (error) {
            console.log("Bookings fetch error:", error);
        }
    };

    const categoriesData = [
        {
            id: 1,
            CatImg: FunctionHallVendorImg,
            navScreen: 'AddFunctionalHall',
            title: 'Add Function Hall',
            description: 'Manage listings for events, celebrations, and weddings.',
            catType:'funtionHalls'

        },
        {
            id: 2,
            CatImg: ClothVendorImg,
            navScreen: 'RentOnProducts',
            title: 'Add Cloth & Jewels',
            description: 'List and manage your rental inventory with ease.',
            catType:'clothsJewels'

        },
        {
            id: 3,
            CatImg: CateringVendorImg,
            navScreen: 'AddFoodCatering',
            title: 'Add Food Catering',
            description: 'Handle food orders and service requests seamlessly.',
            catType:'caterings'
        },
    ];

    const renderItem = ({ item }) => { 

        console.log("item cattype:::::", item?.catType,'+++', profileData?.posts?.some(post => post?.postModel === "Catering"))
        return(

        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => {
                const targetScreen = item.catType === 'caterings' && profileData?.posts?.some(post => post?.postModel === "Catering")
                    ? 'EditAddFoodCateringGeneral'
                    : item.navScreen;
                navigation.navigate(targetScreen, { isAadharUpdate: profileData?.aadharImage?.url ? true : false });
            }}
        >
            <LinearGradient colors={['#FFF5E1', '#FFE2BA']} style={styles.iconContainer}>
                <item.CatImg width={50} height={50} />
            </LinearGradient>
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
            <RightSideIcon />
        </TouchableOpacity>
    )};

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#FFF7E7', '#FFF7E7']}
                style={styles.background}
            >
                {/* Header */}

                {/* Bookings Overview */}
                <TouchableOpacity onPress={() => navigation.navigate('Events')}  style={{ marginTop: 15, alignSelf: "center" }}>
                    <JewelleryCard />
                </TouchableOpacity>
                <View style={styles.bookingsOverview}>
                    <View style={styles.overviewCards}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewCount}>{totalBookings}</Text>
                            <Text style={styles.overviewLabel}>Total Bookings</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Events')} style={styles.overviewCard}>
                            <Text style={styles.overviewCount}>{pending}</Text>
                            <Text style={styles.overviewLabel}>Pending</Text>
                        </TouchableOpacity>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewCount}>{completed}</Text>
                            <Text style={styles.overviewLabel}>Completed</Text>
                        </View>
                    </View>
                </View>

                {/* Vendor Categories */}
                <Text style={styles.sectionTitle}>Vendor Categories</Text>
                <FlatList
                    data={categoriesData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />

                {/* Quick Tips */}
                <View style={styles.quickTips}>
                    <Text style={styles.sectionTitle}>Quick Tips</Text>
                    <Text style={styles.tip}>1. Update your profile regularly to attract more customers.</Text>
                    <Text style={styles.tip}>2. Respond to inquiries quickly to improve customer satisfaction.</Text>
                    <Text style={styles.tip}>3. Keep your pricing competitive for better conversions.</Text>
                </View>

                {/* How It Works */}
                <VendorHowItWorks />
            </LinearGradient>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        marginVertical: 20,
    },
    bookingsOverview: {
        marginTop: 25,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'ManropeRegular',
        marginBottom: 10,
    },
    overviewCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    overviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignSelf: "center",
        height: 100
    },
    overviewCount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FD813B',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#333333',
        textAlign: "center",
        fontFamily: 'ManropeRegular',
    },
    listContainer: {
        paddingBottom: 20,
    },
    //     #FFC19A – Slightly lighter
    // #FFD3B6 – Medium light
    // #FFE3D0 – Softer light
    // #FFF0E4 – Very light pastel
    // #FFF8F2 – Extremely light (almost white)
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderColor: '#EDEDED',
        borderWidth: 1,
        height:150
    },
    iconContainer: {
        width: 120,
        height: 120,
        // borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15
    },
    categoryInfo: { flex: 1 },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 5,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#333333',
    },
    quickTips: {
        // marginVertical: 20,
        marginHorizontal: 20
    },
    tip: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 5,
        fontFamily: 'ManropeRegular',
        marginHorizontal: 10

    },
});

export default VendorCategoryScreen;
