import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabs from "./UserTabs";
import { useDispatch, useSelector } from 'react-redux';
import VendorTabs from "./VendorTabs";
import ViewTrendingDetails from "../screens/Home/ViewTrendingDetails";
import CategoriesList from "../screens/Categories/categoriesList";
import ViewEvents from "../screens/Events/ViewEvents";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import AboutUs from "../screens/Profile/ProfileSubScreens/AboutUs"
import ContactUs from "../screens/Profile/ProfileSubScreens/ContactUs";
import DeleteMyAccount from "../screens/Profile/ProfileSubScreens/DeleteMyAccount";
import RefundPolicy from "../screens/Profile/ProfileSubScreens/RefundPolicy";
import TermsAndCondition from "../screens/Profile/ProfileSubScreens/TermsAndConditions";
import NavigationHeader from "../components/NavigationHeader";
import ViewCatDetails from "../screens/Categories/ViewCatDetails";
import BookingDetailsScreen from "../screens/Categories/ViewCartDetails";
import RequestConfirmation from "../screens/VendorScreens/VendorDashBoard/RequestConfirmation";
import EditProfile from "../screens/Profile/EditProfile";
import ViewMyBookings from "../screens/Profile/MyBookings";
import RentOnProducts from "../screens/GiveOnRent/RentOnProducts";
import LocationAdded from "../screens/Location/LocationAdded";
import AddFunctionalHall from "../screens/VendorScreens/VendorAddFunctionHalls/AddFunctionalHall";
import HallsBookingOverView from "../screens/Bookings/HallsBokingOverView";
import ViewCaterings from "../screens/Caterings/ViewCaterings";
import AddFoodCatering from "../screens/VendorScreens/VendorAddFoodCatering/AddFoodCatering";
import LandingScreen from "../screens/LandingScreen";
import CateringsOverView from "../screens/Bookings/CateringsOverView";
import LoginScreen from "../screens/LandingScreen/LoginScreen";
import OtpValidation from "../screens/LandingScreen/OtpValidation";
import { checkIsTokenStored, getCurrentLoggedInUserMobileNum, getCurrentLoggedInVendorMobileNum, getDeviceFCMToken, getLoginUserId } from "../../redux/actions";
// import messaging from '@react-native-firebase/messaging';
import AadharUpload from "../screens/KYC/AadharUpload";
import BankDetailsScreen from "../screens/VendorScreens/VendorProfile/BankDetails";
import UserAadharUpload from "../screens/KYC/UserAadharUpload";
import AdminDashboard from "../screens/Admin/adminDashboard";
import PaymentSuccess from "../screens/PaymentScreens/PaymentSuccess";
import PaymentFailedScreen from "../screens/PaymentScreens/PaymentFailed";
import EditAddFoodCatering from "../screens/VendorScreens/VendorAddFoodCatering/EditAddFoodCatering";
import EditAddFoodCateringGeneral from "../screens/VendorScreens/VendorAddFoodCatering/EditFoodCateringGeneral";
import NearByEvents from "../screens/Events/NearByEvents";
import NearByFoodCaterings from "../screens/Caterings/NearByFoodCaterings";
import MyTransactions from "../screens/VendorScreens/VendorProfile/MyTransactions";
import AboutUsScreen from "../screens/VendorScreens/VendorProfile/VendorAboutus";
import VendorTersmAndCond from "../screens/VendorScreens/VendorProfile/VendorTermsAndCond";
import VendorTermsAndCond from "../screens/VendorScreens/VendorProfile/VendorTermsAndCond";
import VendorRefundPolicy from "../screens/VendorScreens/VendorProfile/VendorRefundPolicy";
import TermsAndConditionsScreen from "../screens/Profile/ProfileSubScreens/TermsAndConditions";
import { getUserAuthToken, getUserMobileNumber, getVendorAuthToken, getVendorMobileNumber } from "../utils/StoreAuthToken";
import { ActivityIndicator, View, SafeAreaView } from "react-native";
import UserAndVendorRegister from "../screens/LandingScreen/UserAndVendorRegister";
import BookingReview from "../screens/Profile/BookingReview";

const MainNavigation = () => {

    const Stack = createNativeStackNavigator();
    const AuthStack = createNativeStackNavigator();
    const HomeStack = createNativeStackNavigator();
    const switchtab = useSelector((state) => state.userId);
    const checkIfAnyTokenStored = useSelector((state) => state.checkStoredToken);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getToken();
    }, [checkIfAnyTokenStored, switchtab, loading]);

    const getToken = async () => {
        // const fcmToken = await messaging().getToken();
        // console.log('device fcm test token is ::>>', fcmToken);
        // dispatch(getDeviceFCMToken(fcmToken));
        const userToken = await getUserAuthToken();
        const vendorToken = await getVendorAuthToken();
        const vendorMobileNumber = await getVendorMobileNumber();
        const userMobileNumber = await getUserMobileNumber();
        console.log("user token for auto login is ::>>>>", userToken);
        console.log("vendorToken token for auto login is ::>>>>", vendorToken);
        console.log("switch tab id:::::::::::", switchtab);
        if (userToken || vendorToken) {
            dispatch(checkIsTokenStored(true));
            setLoading(false);

        } else {
            dispatch(checkIsTokenStored(false));
            setLoading(false);
        }

        console.log("checkIfAnyTokenStored is ::>>>", checkIfAnyTokenStored);
        if (vendorToken) {
            dispatch(getLoginUserId(true));
            dispatch(getCurrentLoggedInVendorMobileNum(vendorMobileNumber));
            return;
        }
        if (userToken) {
            dispatch(getLoginUserId(false));
            dispatch(getCurrentLoggedInUserMobileNum(userMobileNumber));
            return;
        }
    }

    // console.log("switch tab id:::::::::::", switchtab)

    const HomeScreen = () => {
        return (
            <>
                {switchtab ?
                    <VendorTabs />
                    :
                    <UserTabs />
                }
            </>
        );
    };

    const AuthNavigator = () => (
        <AuthStack.Navigator
            initialRouteName="LandingScreen"
        >
            <Stack.Screen
                name="LandingScreen"
                component={LandingScreen}
                options={{
                    header: () => (''),
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    // header: () => <NavigationHeader Icon={true} title="" />,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="UserAndVendorRegister"
                component={UserAndVendorRegister}
                options={{
                    // header: () => <NavigationHeader Icon={true} title="" />,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="OtpValidation"
                component={OtpValidation}
                options={{
                    // header: () => <NavigationHeader Icon={true} title="" />,
                    headerShown: false,
                }}
            />
        </AuthStack.Navigator>
    );

    const HomeNavigator = () => (
        <HomeStack.Navigator
            initialRouteName="Home"
        >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ViewTrendingDetails" component={ViewTrendingDetails} options={{
                  header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Trending" />
                        </SafeAreaView>
                    )
                , headerShown: true }} />
            <Stack.Screen name="CategoriesList" component={CategoriesList} options={{
                 header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="View Products" />
                        </SafeAreaView>
                    ),
                headerShown: true,
            }} />
            <Stack.Screen name="ViewEvents" component={ViewEvents} options={{
                 header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Event Details" />
                        </SafeAreaView>
                    )
                , headerShown: true }} />

            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                     header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Edit Profile" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="ViewMyBookings"
                component={ViewMyBookings}
                options={{
                     header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="My Bookings" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="BookingReview"
                component={BookingReview}
                options={{
                     header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Review Your Booking" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="ViewCatDetails"
                component={ViewCatDetails}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Product Details" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="PaymentSuccess"
                component={PaymentSuccess}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Payment Success" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="PaymentFailed"
                component={PaymentFailedScreen}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Payment Failed" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="EditAddFoodCatering"
                component={EditAddFoodCatering}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Edit Catering Form" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="EditAddFoodCateringGeneral"
                component={EditAddFoodCateringGeneral}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Edit Catering Form" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="BookingDetailsScreen"
                component={BookingDetailsScreen}
                options={{
                   header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Cart" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="AadharUpload"
                component={AadharUpload}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="KYC Documents" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="UserAadharUpload"
                component={UserAadharUpload}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="KYC Documents" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="BankDetailsScreen"
                component={BankDetailsScreen}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Bank Details" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="MyTransactions"
                component={MyTransactions}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="My Transactions" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="HallsBookingOverView"
                component={HallsBookingOverView}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Booking Overview" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="LocationAdded"
                component={LocationAdded}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Add Location" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="ViewCaterings"
                component={ViewCaterings}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="View Caterings" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="CateringsOverView"
                component={CateringsOverView}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Cart" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="NearByEvents"
                component={NearByEvents}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Near By Events" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="NearByFoodCaterings"
                component={NearByFoodCaterings}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Near By Caterings" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            < Stack.Screen
                name="AboutUsScreen"
                component={AboutUsScreen}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="About Us" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            < Stack.Screen
                name="VendorTermsAndCond"
                component={VendorTermsAndCond}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Terms & Condtions" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />
            < Stack.Screen
                name="VendorRefundPolicy"
                component={VendorRefundPolicy}
                options={{
                    header: () => (
                        <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                            <NavigationHeader Icon={true} title="Refund Policy" />
                        </SafeAreaView>
                    ),
                    headerShown: true,
                }}
            />

            {/* ############### profile Screens ################# */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Profile" />
                    </SafeAreaView>
                ),
                headerShown: true
            }} />
            <Stack.Screen name="AboutUs" component={AboutUs} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="About Us" />
                    </SafeAreaView>
                ),
                headerShown: true
            }} />
            <Stack.Screen name="ContactUs" component={ContactUs} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Contact Us" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />
            <Stack.Screen name="DeleteMyAccount" component={DeleteMyAccount} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Delete Account" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />
            <Stack.Screen name="RefundPolicy" component={RefundPolicy} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Refund Policy" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Terms & Condtions" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />
            {/* //////////////////////      VENDOR SCREENS     ///////////////////////////////////////////// */}

            <Stack.Screen name="RequestConfirmation" component={RequestConfirmation} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Request Details" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />



            <Stack.Screen name="RentOnProducts" component={RentOnProducts} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Give On Rent" />
                    </SafeAreaView>
                )
                , headerShown: true
            }} />

            <Stack.Screen name="AddFunctionalHall" component={AddFunctionalHall} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Add Function Hall" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />


            <Stack.Screen name="AddFoodCatering" component={AddFoodCatering} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Add Food Catering" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />

            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{
                header: () => (
                    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
                        <NavigationHeader Icon={true} title="Admin Dashboard" />
                    </SafeAreaView>
                ),
                headerShown: true,
            }} />

        </HomeStack.Navigator >
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FD813B" />
            </View>
        );
    }

    return (
        <NavigationContainer>

            {checkIfAnyTokenStored ? <HomeNavigator /> : <AuthNavigator />}

        </NavigationContainer>
    )
}

export default MainNavigation;