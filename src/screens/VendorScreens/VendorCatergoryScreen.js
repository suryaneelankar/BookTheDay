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

const VendorCategoryScreen = ({ navigation }) => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [profileData, setProfileData] = useState();
    const [bookingsOverview, setBookingsOverview] = useState({
        total: 0,
        pending: 0,
        completed: 0,
    });
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            getProfileData();
            fetchBookingsOverview();
            return () => console.log('Screen is unfocused');
        }, [])
    );

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
            title: 'Function Hall Booking',
            description: 'Manage bookings for events, celebrations, and weddings.',
        },
        {
            id: 2,
            CatImg: ClothVendorImg,
            navScreen: 'RentOnProducts',
            title: 'Clothes & Jewellery Rentals',
            description: 'List and manage your rental inventory with ease.',
        },
        {
            id: 3,
            CatImg: CateringVendorImg,
            navScreen: 'AddFoodCatering',
            title: 'Catering Services',
            description: 'Handle food orders and service requests seamlessly.',
        },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate(item.navScreen)}
        >
            <LinearGradient colors={['#FFF5E1', '#FFE2BA']} style={styles.iconContainer}>
                <item.CatImg width={50} height={50} />
            </LinearGradient>
            <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#FFFFFF', '#F9F9F9']}
                style={styles.background}
            >
                {/* Header */}
                <Text style={styles.header}>Vendor Dashboard</Text>

                {/* Bookings Overview */}
                <View style={styles.bookingsOverview}>
                    <Text style={styles.sectionTitle}>Bookings Overview</Text>
                    <View style={styles.overviewCards}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewCount}>{bookingsOverview.total}</Text>
                            <Text style={styles.overviewLabel}>Total Bookings</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewCount}>{bookingsOverview.pending}</Text>
                            <Text style={styles.overviewLabel}>Pending</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewCount}>{bookingsOverview.completed}</Text>
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
        backgroundColor: '#F8F9FA',
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
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#34495E',
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
    },
    overviewCount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3498DB',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    listContainer: {
        paddingBottom: 20,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderColor: '#EDEDED',
        borderWidth: 1,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    categoryInfo: { flex: 1 },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 5,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    quickTips: {
        marginVertical: 20,
    },
    tip: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 5,
    },
});

export default VendorCategoryScreen;
