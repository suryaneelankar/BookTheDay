import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import ProfileIcon from '../../../assets/profilesvgs/profile.svg'
import RefundPolicy from '../../../assets/profilesvgs/refundPolicy.svg';
import TermsConditionIcon from '../../../assets/profilesvgs/termsandCondition.svg';
import TransactionIcon from '../../../assets/profilesvgs/transactions.svg';
import AboutUsIcon from '../../../assets/profilesvgs/aboutUs.svg';
import RightSideIcon from '../../../assets/profilesvgs/Chevron-Right.svg';
import LinearGradient from 'react-native-linear-gradient';
import DownArrow from '../../../assets/profilesvgs/blackdownarrow.svg';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import themevariable from '../../../utils/themevariable';
import LinkBgm from '../../../assets/profilesvgs/linkBgm.svg';
import CrossIcon from '../../../assets/profilesvgs/orangeCross.svg';
import { moderateScale } from '../../../utils/scalingMetrics';
import LogOutIcon from '../../../assets/svgs/logOutIcon.svg';
import { getVendorAuthToken, removeUserAuthToken, removeVendorAuthToken, removeVendorMobileNumber } from '../../../utils/StoreAuthToken';
import axios from 'axios';
import BASE_URL from '../../../apiconfig';
import { useSelector, useDispatch } from 'react-redux';
import { checkIsTokenStored, getLoginUserId } from '../../../../redux/actions';
import ProfileDefaultIcon from 'react-native-vector-icons/EvilIcons';
import DashboardIcon from '../../../assets/profilesvgs/dashboard.svg';


const VendorProfile = () => {
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [isMyAccountOpen, setIsMyAccountOpen] = React.useState(false);
    const [isMyDashboardOpen, setIsMyDashboardOpen] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMyAccount, setSelectedMyAccount] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [profileData, setProfileData] = useState();
    const dispatch = useDispatch();


    const link = "www.xyz.com";
    const vendorLoggedInMobileNum = useSelector((state) => state.vendorLoggedInMobileNum);

    useEffect(() => {
        getProfileData();
    }, []);

    const getProfileData = async () => {
        const token = await getVendorAuthToken();
        try {
            console.log("vendou num:", vendorLoggedInMobileNum)
            const response = await axios.get(`${BASE_URL}/vendor/getVendorProfile/${vendorLoggedInMobileNum}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfileData(response?.data?.data);
            console.log("profile vendor res:::", response?.data?.data?.aadharImage);

        } catch (error) {
            console.log("profile::::::::::", error);
        }
    }

    const shareLink = async (platform) => {
        try {
            const result = await Share.share({
                message: `B2B Team link: ${link}`,
                url: link,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('shared with activity type:', result.activityType);
                } else {
                    console.log('shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#FFF3CD', '#FFDB7E', '#FFDB7E', '#FFDB7E']}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileContainer}>
                    <View style={styles.profileImageContainer}>
                        <ProfileDefaultIcon name="user" size={90} />
                    </View>
                    <Text style={styles.profileName}>{profileData?.fullName}</Text>
                    <Text style={styles.profileEmail}>+91 {vendorLoggedInMobileNum}</Text>
                </View>

                <View style={styles.menuContainer}>
                    <MenuItem
                        icon={<ProfileIcon />}
                        title="My KYC"
                        onPress={() => navigation.navigate('AadharUpload')}
                    />
                    <MenuItem
                        icon={<ProfileIcon />}
                        title="Update Bank Account"
                        onPress={() => navigation.navigate('BankDetailsScreen')}
                    />
                    <MenuItem
                        icon={<DashboardIcon />}
                        title="My Bookings"
                        onPress={() => navigation.navigate('MyBookings')}
                    />
                    <MenuItem
                        icon={<TransactionIcon />}
                        title="My Transactions"
                        onPress={() => navigation.navigate('MyTransactions')}
                    />
                    <MenuItem icon={<AboutUsIcon />} title="About Us" onPress={() => navigation.navigate('AboutUsScreen')} />

                    <MenuItem
                        icon={<TermsConditionIcon />}
                        title="Terms & Condition"
                        onPress={() => navigation.navigate('VendorTermsAndCond')}
                    />
                    <MenuItem
                        icon={<RefundPolicy />}
                        title="Refund Policy"
                        onPress={() => navigation.navigate('VendorRefundPolicy')}
                    />
                    <MenuItem
                        icon={<LogOutIcon />}
                        title="Log Out"
                        onPress={async () => {
                            dispatch(checkIsTokenStored(false));
                            await removeVendorAuthToken();
                            await removeVendorMobileNumber();
                        }}
                    />
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const MenuItem = ({ icon, title, children, isSelected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.menuItem, { backgroundColor: isSelected ? "#FFF2CF" : 'white' }]}>
            <View style={{ backgroundColor: isSelected ? '#FD813B' : "#FFF2CF", borderRadius: 20, width: 48, height: 48, alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
                <Text style={styles.menuIcon}>{icon}</Text>
            </View>
            <Text style={styles.menuText}>{title}</Text>
            {children ? children :
                isSelected ?
                    <DownArrow /> :
                    <RightSideIcon />
            }
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF3CD',
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
        alignSelf: "center"
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#121826',
        fontFamily: 'ManropeRegular',
    },
    profileEmail: {
        fontSize: 12,
        color: '#121826',
        fontFamily: 'ManropeRegular',
        fontWeight: "400"
    },
    menuContainer: {
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        marginVertical: 2
    },
    menuIcon: {
        fontSize: 24,
        color: themevariable.Color_000000,
    },
    menuText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#121826",
        fontFamily: 'ManropeRegular',
        marginLeft: 15,
        flex: 1,
    },
    copyLink: {
        backgroundColor: '#FFF2CF',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 20,
        borderColor: "#FD813B",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    copyLinkText: {
        color: '#FD813B',
        fontSize: 12,
        fontWeight: "600",
        fontFamily: 'ManropeRegular',
        marginLeft: 5
    },
    dropdownContainer: {
        paddingLeft: 20,
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginLeft: "22%",
        marginHorizontal: 20,
        elevation: 5,
        marginVertical: 5

    },
    dropdownItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    dropdownItemText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#121826",
        fontFamily: 'ManropeRegular',

    },
    modalView: {
        marginHorizontal: 10,
        // margin: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // width: '95%',
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingTop: 30

    },
    modalText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '800',
        color: "#000000",
        fontFamily: "ManropeRegular",

    },
    modalDescription: {
        textAlign: 'center',
        // marginBottom: 20,
        fontSize: 15,
        color: '#000000',
        fontFamily: "ManropeRegular",
        fontWeight: "400",
        marginTop: moderateScale(15),
        marginHorizontal: 15
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(25),
        borderColor: "#D2453B", borderWidth: 1,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        marginBottom: 20,

    },
    linkText: {
        //    borderColor:"#D2453B", borderWidth:1,
        //    borderTopLeftRadius:8,
        //    borderBottomLeftRadius:8,
        padding: 5,
        width: '70%',
        color: themevariable.Color_000000,
    },
    copiedText: {
        color: 'red',
        fontWeight: 'bold',
    },
    shareText: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: themevariable.Color_000000,
    },
    shareButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    shareButton: {
        alignItems: 'center',
    },
});

export default VendorProfile;