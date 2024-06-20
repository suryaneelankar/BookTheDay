import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabs from "./UserTabs";
import { useSelector } from 'react-redux';
import VendorTabs from "./VendorTabs";
import ViewTrendingDetails from "../screens/Home/ViewTrendingDetails";
import CategoriesList from "../screens/Categories/categoriesList";
import ViewEvents from "../screens/Events/ViewEvents";
import BookingOverView from "../screens/Bookings/BookingOverView";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import Login from "../screens/Authentication/Login";
import Register from "../screens/Authentication/Register";
import ForgotPassword from "../screens/Authentication/ForgotPassword"
import ResetPassword from "../screens/Authentication/ResetPassword"
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
import BookingConfirm from "../screens/Bookings/BookingConfirmScreen";
import ProductScreen from "../screens/Products/ProductScreen";
import NavigationHeader from "../components/NavigationHeader";
import ViewHireDetails from "../screens/MyBox/ViewHireDetails";
import SelectDateTimeScreen from "../screens/MyBox/SelectDateTime";
import ViewCatDetails from "../screens/Categories/ViewCatDetails";
import BookingDetailsScreen from "../screens/Categories/ViewCartDetails";
import RequestConfirmation from "../screens/VendorScreens/VendorDashBoard/RequestConfirmation";
import ViewProfile from "../screens/Profile/ViewProfile";
import EditProfile from "../screens/Profile/EditProfile";
import ViewMyBookings from "../screens/Profile/MyBookings";
import ViewMyLendings from "../screens/Profile/ViewMyLendings";
import ViewHireCartDetails from "../screens/MyBox/ViewHireCartDetails";
import ViewTentHouse from "../screens/Events/ViewTentHouse";
import RentOnProducts from "../screens/GiveOnRent/RentOnProducts";
import ViewDecors from "../screens/Events/ViewDecors";

const MainNavigation = () => {

    const Stack = createNativeStackNavigator();
    const switchtab = useSelector((state) => state.userId);

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
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ViewTrendingDetails" component={ViewTrendingDetails} options={{ headerShown: true }} />
                <Stack.Screen name="CategoriesList" component={CategoriesList}  options={{
                         header: () => <NavigationHeader Icon={true} title="View Products" />,
                         headerShown: true,
                }} />
                <Stack.Screen name="ViewEvents" component={ViewEvents} options={{ headerShown: true }} />
               
               <Stack.Screen 
               name="ViewHireDetails"
                component={ViewHireDetails}  
                options={{
                         header: () => <NavigationHeader Icon={true} title="Hire Professionals" />,
                         headerShown: true,
                }}
                />
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
                         header: () => <NavigationHeader Icon={true} title="Hire Professionals" />,
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
               name="ViewHireCartDetails"
                component={ViewHireCartDetails}  
                options={{
                         header: () => <NavigationHeader Icon={true} title="Cart" />,
                         headerShown: true,
                }}
                />
                <Stack.Screen 
               name="ViewTentHouse"
                component={ViewTentHouse}  
                options={{
                         header: () => <NavigationHeader Icon={true} title="Tent Houses" />,
                         headerShown: true,
                }}
                />
                <Stack.Screen 
               name="ViewDecors"
                component={ViewDecors}  
                options={{
                         header: () => <NavigationHeader Icon={true} title="Decorations" />,
                         headerShown: true,
                }}
                />
                <Stack.Screen 
               name="SelectDateTime"
                component={SelectDateTimeScreen}  
                options={{
                         header: () => (''),
                         headerShown: false,
                }}
                />
               
               
                 {/* ############### profile Screens ################# */}
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: true}} />
                <Stack.Screen name="AboutUs" component={AboutUs} options={{headerShown: true}}/>
                <Stack.Screen name="ContactUs"component={ContactUs}options={{headerShown: false,}}/>
                <Stack.Screen name="DeleteMyAccount" component={DeleteMyAccount} options={{headerShown: true,}}/>
                <Stack.Screen name="EditProfileInfo" component={EditProfileInfo} options={{headerShown: true,}}/>
                <Stack.Screen name="LogOut" component={LogOut} options={{headerShown: true,}}/>
                <Stack.Screen name="MyBookings" component={MyBookings} options={{headerShown: true,}} />
                <Stack.Screen name="MyEvents" component={MyEvents} options={{headerShown: true,}} />
                <Stack.Screen name="MyLocations" component={MyLocations} options={{headerShown: true,}} />
                <Stack.Screen name="Notifications" component={Notifications} options={{headerShown: true,}} />
                <Stack.Screen name="PrivacyPolicy" component={ProfilePolicy} options={{headerShown: true,}} />
                <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} options={{headerShown: true,}} />
                <Stack.Screen name="RefundPolicy" component={RefundPolicy} options={{headerShown: true,}} />
                <Stack.Screen name="TermsAndConditions" component={TermsAndCondition} options={{headerShown: true,}} />
                {/* ############################################################ */}

                <Stack.Screen name="ProductScreen" component={ProductScreen} options={{headerShown: true,}} />

                <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: true }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: true }} />
                <Stack.Screen name="BookingOverView" component={BookingOverView} options={{ headerShown: true }} />
                <Stack.Screen name="BookingConfirm" component={BookingConfirm} options={{ headerShown:false }}/>

                {/* //////////////////////      VENDOR SCREENS     ///////////////////////////////////////////// */}

                <Stack.Screen name="RequestConfirmation" component={RequestConfirmation}  options={{
                         header: () => <NavigationHeader Icon={true} title="Request Details" />,
                         headerShown: true,
                }}/>

                <Stack.Screen name="RentOnProducts" component={RentOnProducts} options={{ headerShown:false }}/>

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;