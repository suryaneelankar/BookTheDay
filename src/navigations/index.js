import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabs from "./UserTabs";
import { useDispatch, useSelector } from 'react-redux';
import VendorTabs from "./VendorTabs";
import ViewTrendingDetails from "../screens/Home/ViewTrendingDetails";
import CategoriesList from "../screens/Categories/categoriesList";
import ViewEvents from "../screens/Events/ViewEvents";
import BookingOverView from "../screens/Bookings/BookingOverView";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import Login from "../screens/Authentication/Login";
import Register from "../screens/Authentication/Register";
import AboutUs from "../screens/Profile/ProfileSubScreens/AboutUs"
import ContactUs from "../screens/Profile/ProfileSubScreens/ContactUs";
import DeleteMyAccount from "../screens/Profile/ProfileSubScreens/DeleteMyAccount";
import EditProfileInfo from "../screens/Profile/ProfileSubScreens/EditProfileInfo";
import LogOut from "../screens/Profile/ProfileSubScreens/LogOut";
import MyBookings from "../screens/Profile/ProfileSubScreens/MyBookings";
import MyEvents from "../screens/Profile/ProfileSubScreens/MyEvents";
import MyLocations from "../screens/Profile/ProfileSubScreens/MyLocations";
import Notifications from "../screens/Profile/ProfileSubScreens/Notifications";
import ProfilePolicy from "../screens/Profile/ProfileSubScreens/PrivacyPolicy";
import ReferAndEarn from "../screens/Profile/ProfileSubScreens/ReferAndEarn";
import RefundPolicy from "../screens/Profile/ProfileSubScreens/RefundPolicy";
import TermsAndCondition from "../screens/Profile/ProfileSubScreens/TermsAndConditions";
import NavigationHeader from "../components/NavigationHeader";
import ViewCatDetails from "../screens/Categories/ViewCatDetails";
import BookingDetailsScreen from "../screens/Categories/ViewCartDetails";
import RequestConfirmation from "../screens/VendorScreens/VendorDashBoard/RequestConfirmation";
import ViewProfile from "../screens/Profile/ViewProfile";
import EditProfile from "../screens/Profile/EditProfile";
import ViewMyBookings from "../screens/Profile/MyBookings";
import ViewMyLendings from "../screens/Profile/ViewMyLendings";
import RentOnProducts from "../screens/GiveOnRent/RentOnProducts";
import HireChefOrDriverForm from "../screens/VendorScreens/VendorHireChefOrDriver/HireChefOrDriverForm";
import LocationAdded from "../screens/Location/LocationAdded";
import AddSelectLocation from "../screens/Location/AddSelectLocation";
import AddFunctionalHall from "../screens/VendorScreens/VendorAddFunctionHalls/AddFunctionalHall";
import HallsBookingOverView from "../screens/Bookings/HallsBokingOverView";
import ViewCaterings from "../screens/Caterings/ViewCaterings";
import AddFoodCatering from "../screens/VendorScreens/VendorAddFoodCatering/AddFoodCatering";
import LandingScreen from "../screens/LandingScreen";
import CateringsOverView from "../screens/Bookings/CateringsOverView";
import LoginScreen from "../screens/LandingScreen/LoginScreen";
import OtpValidation from "../screens/LandingScreen/OtpValidation";
import { getDeviceFCMToken } from "../../redux/actions";
import messaging from '@react-native-firebase/messaging';
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

const MainNavigation = () => {

    const Stack = createNativeStackNavigator();
    const switchtab = useSelector((state) => state.userId);
    const dispatch = useDispatch();

    useEffect(() => {
        getToken();
    }, [])

    const getToken = async () => {
        const fcmToken = await messaging().getToken();
        console.log('device fcm test token is ::>>', fcmToken);
        dispatch(getDeviceFCMToken(fcmToken));
    }

    console.log("switch tab id:::::::::::", switchtab)

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

    return (
        <NavigationContainer>

            <Stack.Navigator>
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
                    name="OtpValidation"
                    component={OtpValidation}
                    options={{
                        // header: () => <NavigationHeader Icon={true} title="" />,
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ViewTrendingDetails" component={ViewTrendingDetails} options={{ headerShown: true }} />
                <Stack.Screen name="CategoriesList" component={CategoriesList} options={{
                    header: () => <NavigationHeader Icon={true} title="View Products" />,
                    headerShown: true,
                }} />
                <Stack.Screen name="ViewEvents" component={ViewEvents} options={{ headerShown: true }} />

               
                <Stack.Screen
                    name="ViewProfile"
                    component={ViewProfile}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="View Profile" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Edit Profile" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="ViewMyBookings"
                    component={ViewMyBookings}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="My Bookings" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="ViewMyLendings"
                    component={ViewMyLendings}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="My Lendings" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="ViewCatDetails"
                    component={ViewCatDetails}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Product Details" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="PaymentSuccess"
                    component={PaymentSuccess}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="PaymentSuccess" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="PaymentFailed"
                    component={PaymentFailedScreen}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="PaymentFailed" />,
                        headerShown: true,
                    }}
                />
                 <Stack.Screen
                    name="EditAddFoodCatering"
                    component={EditAddFoodCatering}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Edit Catering Form" />,
                        headerShown: true,
                    }}
                />
                 <Stack.Screen
                    name="EditAddFoodCateringGeneral"
                    component={EditAddFoodCateringGeneral}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Edit Catering Form" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="BookingDetailsScreen"
                    component={BookingDetailsScreen}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Cart" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="AadharUpload"
                    component={AadharUpload}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="KYC Documents" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="UserAadharUpload"
                    component={UserAadharUpload}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="KYC Documents" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="BankDetailsScreen"
                    component={BankDetailsScreen}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Bank Details" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="HallsBookingOverView"
                    component={HallsBookingOverView}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Cart" />,
                        headerShown: true,
                    }}
                />
               
                <Stack.Screen
                    name="LocationAdded"
                    component={LocationAdded}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Location" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="AddSelectLocation"
                    component={AddSelectLocation}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Select Location" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="ViewCaterings"
                    component={ViewCaterings}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Caterings" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="CateringsOverView"
                    component={CateringsOverView}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Cart" />,
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="NearByEvents"
                    component={NearByEvents}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Near By Events" />,
                        headerShown: true,
                    }}
                />
                 <Stack.Screen
                    name="NearByFoodCaterings"
                    component={NearByFoodCaterings}
                    options={{
                        header: () => <NavigationHeader Icon={true} title="Near By Caterings" />,
                        headerShown: true,
                    }}
                />

                {/* ############### profile Screens ################# */}
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: true }} />
                <Stack.Screen name="AboutUs" component={AboutUs} options={{ headerShown: true }} />
                <Stack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false, }} />
                <Stack.Screen name="DeleteMyAccount" component={DeleteMyAccount} options={{ headerShown: true, }} />
                <Stack.Screen name="EditProfileInfo" component={EditProfileInfo} options={{ headerShown: true, }} />
                <Stack.Screen name="LogOut" component={LogOut} options={{ headerShown: true, }} />
                <Stack.Screen name="MyBookings" component={MyBookings} options={{ headerShown: true, }} />
                <Stack.Screen name="MyEvents" component={MyEvents} options={{ headerShown: true, }} />
                <Stack.Screen name="MyLocations" component={MyLocations} options={{ headerShown: true, }} />
                <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: true, }} />
                <Stack.Screen name="PrivacyPolicy" component={ProfilePolicy} options={{ headerShown: true, }} />
                <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} options={{ headerShown: true, }} />
                <Stack.Screen name="RefundPolicy" component={RefundPolicy} options={{ headerShown: true, }} />
                <Stack.Screen name="TermsAndConditions" component={TermsAndCondition} options={{ headerShown: true, }} />
                {/* ############################################################ */}


                <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: true }} />
                <Stack.Screen name="BookingOverView" component={BookingOverView} options={{ headerShown: true }} />

                {/* //////////////////////      VENDOR SCREENS     ///////////////////////////////////////////// */}

                <Stack.Screen name="RequestConfirmation" component={RequestConfirmation} options={{
                    header: () => <NavigationHeader Icon={true} title="Request Details" />,
                    headerShown: true,
                }} />
                <Stack.Screen name="HireChefOrDriverForm" component={HireChefOrDriverForm} options={{
                    header: () => <NavigationHeader Icon={true} title="Hire Driver" />,
                    headerShown: true,
                }} />

                {/* AddTentHouse */}

                <Stack.Screen name="RentOnProducts" component={RentOnProducts} options={{ header: () => <NavigationHeader Icon={true} title="Give on Rent" />, headerShown: true }} />

                {/* AddFunctionalHall */}
                <Stack.Screen name="AddFunctionalHall" component={AddFunctionalHall} options={{
                    header: () => <NavigationHeader Icon={true} title="Give on Rent" />,
                    headerShown: true,
                }} />
               

                <Stack.Screen name="AddFoodCatering" component={AddFoodCatering} options={{
                    header: () => <NavigationHeader Icon={true} title="Food Catering" />,
                    headerShown: true,
                }} />

                <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{
                    header: () => <NavigationHeader Icon={true} title="Admin Dashboard" />,
                    headerShown: true,
                }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;