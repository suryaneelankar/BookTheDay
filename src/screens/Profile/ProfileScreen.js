import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import ProfileIcon from '../../assets/profilesvgs/profile.svg';
import DashboardIcon from '../../assets/profilesvgs/dashboard.svg';
import LocationIcon from '../../assets/profilesvgs/GpsFix.svg';
import NotificationIcon from '../../assets/profilesvgs/notificationBell.svg';
import ReferEarn from '../../assets/profilesvgs/referandEarn.svg';
import RefundPolicy from '../../assets/profilesvgs/refundPolicy.svg';
import TermsConditionIcon from '../../assets/profilesvgs/termsandCondition.svg';
import TransactionIcon from '../../assets/profilesvgs/transactions.svg';
import AboutUsIcon from '../../assets/profilesvgs/aboutUs.svg';
import RightSideIcon from '../../assets/profilesvgs/Chevron-Right.svg';
import LinearGradient from 'react-native-linear-gradient';
import DownArrow from '../../assets/profilesvgs/blackdownarrow.svg';
import ActiveProfile from '../../assets/profilesvgs/profileLight.svg';
import ActiveDashboard from '../../assets/profilesvgs/dashboardLight.svg';
import CopyLinkIcon from '../../assets/profilesvgs/copyLink.svg';
import CustomToggle from '../../components/ProfileToggle';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import themevariable from '../../utils/themevariable';
import LinkBgm from '../../assets/profilesvgs/linkBgm.svg';
import CrossIcon from '../../assets/profilesvgs/orangeCross.svg';
import WhiteDashboard from '../../assets/profilesvgs/whiteDashboard.svg';
import { moderateScale } from '../../utils/scalingMetrics';

const ProfileMainScreen = () => {
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [isMyAccountOpen, setIsMyAccountOpen] = React.useState(false);
    const [isMyDashboardOpen, setIsMyDashboardOpen] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMyAccount, setSelectedMyAccount] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleMyAccount = () => {
        setIsMyAccountOpen(!isMyAccountOpen);
        setSelectedMyAccount(!selectedMyAccount)
    }
    const toggleMyDashboard = () => {
        setIsMyDashboardOpen(!isMyDashboardOpen);
    }

    const link = "www.xyz.com";

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
        <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} colors={['#FFF3CD', '#FFDB7E', '#FFDB7E', '#FFDB7E']} style={{ flex: 1 }}>
            <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image, replace with your image source
                        style={styles.profileImage}
                    />
                </View>
                <Text style={styles.profileName}>Donye Collins</Text>
                <Text style={styles.profileEmail}>iamcollinsdonye@gmail.com</Text>
            </View>

            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                <MenuItem
                    icon={<ProfileIcon />}
                    title="My Account"
                    isSelected={isMyAccountOpen ? true : false}
                    onPress={() => toggleMyAccount()}
                />
                {isMyAccountOpen && (
                    <View style={styles.dropdownContainer}>
                        <DropdownItem title="My Profile" navigation={navigation} />
                        <DropdownItem title="KYC Documents" navigation={navigation} />
                        <DropdownItem title="Saved Items" navigation={navigation} />
                        <DropdownItem title="Change Password" navigation={navigation} />
                        <DropdownItem title="Log Out" navigation={navigation} />
                        <DropdownItem title="Delete Account" navigation={navigation} />
                    </View>
                )}
                <MenuItem icon={<DashboardIcon />}
                    title="Dashboard"
                    isSelected={isMyDashboardOpen ? true : false}
                    onPress={() => toggleMyDashboard()}
                />
                {isMyDashboardOpen && (
                    <View style={styles.dropdownContainer}>
                        <DropdownItem title="My Booking" navigation={navigation} />
                        <DropdownItem title="My Lend" navigation={navigation} />
                    </View>
                )}
                <MenuItem icon={<ReferEarn />} title="Refer & Earn">
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.copyLink}>
                        <CopyLinkIcon />
                        <Text style={styles.copyLinkText}>Copy Link</Text>
                    </TouchableOpacity>
                </MenuItem>
                <MenuItem icon={<TransactionIcon />} title="My Transaction" />
                <MenuItem icon={<LocationIcon />} title="Manage Location" />
                <MenuItem icon={<NotificationIcon />} title="Notification Preferences">
                    {/* <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    /> */}
                    <CustomToggle value={isEnabled} onValueChange={toggleSwitch} />
                </MenuItem>
                <MenuItem icon={<AboutUsIcon />} title="About Us" />
                <MenuItem icon={<TermsConditionIcon />} title="Terms & Condition" />
                <MenuItem icon={<RefundPolicy />} title="Refund Policy" />
            </ScrollView>

            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                backdropOpacity={0.9}
                backdropColor={themevariable.Color_000000}
                hideModalContentWhileAnimating={true}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                animationInTiming={500}
                style={{
                    // flex: 1,
                    position: "absolute",
                    bottom: 0, 
                    // backgroundColor: "pink",
                    alignSelf: "center", width: "100%"
                }}
                onBackButtonPress={() => {
                    setModalVisible(false)
                }}
                animationOut={'slideOutDown'}
                animationType={'slideInUp'}
            >
                <View style={{ flex: 1, alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end' }}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <CrossIcon />
                        </TouchableOpacity>
                        <LinkBgm style={{backgroundColor:"pink"}} />
                        <Text style={styles.modalText}>Link Copied</Text>
                        <Text style={styles.modalDescription}>B2B Team link is copied to your clipboard. Now you can share with others</Text>
                        <View style={styles.linkContainer}>
                            <TextInput
                                style={styles.linkText}
                                value={link}
                                editable={false}
                            />
                              <LinearGradient colors={['#D2453B', '#A0153E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{height:"100%",}}
            // style={styles.saveButton}
            >
                <TouchableOpacity  onPress={() => ('')}>
                    <Text style={{color:"#F4F4F6"}}>Save</Text>
                </TouchableOpacity>
                </LinearGradient>
                            {/* <Text style={styles.copiedText}>Copied!</Text> */}
                        </View>
                        <Text style={styles.shareText}>Share the link through</Text>
                        <View style={styles.shareButtons}>
                            <TouchableOpacity style={styles.shareButton} onPress={() => shareLink('airdrop')}>
                                {/* <Icon name="share-social-outline" size={30} color="blue" /> */}
                                <Text>AirDrop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareButton} onPress={() => shareLink('messages')}>
                                {/* <Icon name="chatbubble-outline" size={30} color="green" /> */}
                                <Text>Messages</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareButton} onPress={() => shareLink('whatsapp')}>
                                {/* <Icon name="logo-whatsapp" size={30} color="green" /> */}
                                <Text>WhatsApp</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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

const DropdownItem = ({ title, navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                if (title === 'My Profile') {
                    navigation.navigate('ViewProfile')
                } else if (title === 'KYC Documents') {
                    // navigation.navigate('');
                } else if (title === 'Saved Items') {
                    // navigation.navigate('');
                } else if (title === 'Change Password') {
                    // navigation.navigate('');
                } else if (title === 'Log Out') {
                    // Handle log out
                } else if (title === 'Delete Account') {
                    // Handle delete account
                } else if (title === 'My Booking') {
                    navigation.navigate('ViewMyBookings')
                } else if (title === 'My Lend') {
                    navigation.navigate('ViewMyLendings')
                }
            }}
            style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{title}</Text>
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
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
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
        backgroundColor: "white",
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
        marginHorizontal:10,
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
        color:"#000000",
        fontFamily: "ManropeRegular",

    },
    modalDescription: {
        textAlign: 'center',
        // marginBottom: 20,
        fontSize: 15,
        color: '#000000',
        fontFamily: "ManropeRegular",
        fontWeight:"400",
        marginTop:moderateScale(15),
        marginHorizontal:15
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:moderateScale(25),
        borderColor:"#D2453B", borderWidth:1,
           borderTopLeftRadius:8,
           borderBottomLeftRadius:8,
        marginBottom: 20,
       
    },
    linkText: {
    //    borderColor:"#D2453B", borderWidth:1,
    //    borderTopLeftRadius:8,
    //    borderBottomLeftRadius:8,
        padding: 5,
        width: '70%',
    },
    copiedText: {
        color: 'red',
        fontWeight: 'bold',
    },
    shareText: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
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

export default ProfileMainScreen;
