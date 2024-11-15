import { StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Text, View, ScrollView } from 'react-native';
import themevariable from '../../utils/themevariable';
import FunctionHallVendorImg from '../../assets/vendorIcons/functionHallVendorImgs.svg';
import ClothVendorImg from '../../assets/vendorIcons/clothVendorImg.svg';
import CateringVendorImg from '../../assets/vendorIcons/cateringVendorImg.svg';
import { getVendorAuthToken } from '../../utils/StoreAuthToken';
import LinearGradient from 'react-native-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import BASE_URL from '../../apiconfig';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentVendorLoggedInUserName } from '../../../redux/actions';
import { useFocusEffect } from '@react-navigation/native';
import VendorHowItWorks from '../../components/VendorHowItWorks';

const VendorCategoryScreen = ({ navigation }) => {
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);
    const [profileData, setProfileData] = useState();
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            getProfileData();
            return () => console.log('Screen is unfocused');
        }, [])
    );

    const getProfileData = async () => {
        const token = await getVendorAuthToken();
        try {
            const response = await axios.get(`${BASE_URL}/vendor/getVendorProfile/${vendorLoggedInMobileNum}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("user profile res::::::::", JSON.stringify(response?.data?.data))
            setProfileData(response?.data?.data);
            dispatch(getCurrentVendorLoggedInUserName(response?.data?.data?.fullName));
        } catch (error) {
            console.log("profile error:", error);
        }
    };

    const categoriesData = [
        {
            id: 1,
            CatImg: FunctionHallVendorImg,
            navScreen: 'AddFunctionalHall',
            catType: 'functionalHalls',
            title: 'Function Hall Booking',
            description: 'Add your function hall and attract customers for events and celebrations.',
        },
        {
            id: 2,
            CatImg: ClothVendorImg,
            navScreen: 'RentOnProducts',
            catType: 'clothesJewels',
            title: 'Clothes & Jewellery Rentals',
            description: 'List your clothes and jewellery for rentals and get bookings quickly.',
        },
        {
            id: 3,
            CatImg: CateringVendorImg,
            navScreen: 'AddFoodCatering',
            catType: 'caterings',
            title: 'Catering Services',
            description: 'Offer your catering services and make it easy for customers to book.',
        },
    ];

    const renderItem = ({ item }) => {
        return (
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
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FBF5E8', '#FBF5E8']} style={styles.background}>
                <Text style={styles.header}>Vendor Categories</Text>
                <FlatList
                    data={categoriesData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />

                {/* How It Works Section */}
                <View style={{marginBottom:50}}>
               <VendorHowItWorks/>
               </View>
            </LinearGradient>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1 },
    header: {
        fontSize: 26,
        fontWeight: '700',
        color: '#4A4A4A',
        textAlign: 'center',
        marginVertical: 20,
    },
    listContainer: {
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
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
        color: '#3E3E3E',
        marginBottom: 5,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#787878',
    },
    howItWorksSection: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        // backgroundColor: '#F2F2F2',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: 20,
        paddingBottom: 50,
    },
    howItWorksHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 12,
    },
    howItWorksStep: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555555',
    },
    stepDescription: {
        fontSize: 14,
        color: '#666666',
        marginTop: 5,
    },
});

export default VendorCategoryScreen;
