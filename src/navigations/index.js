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
import StackProfileNavigation from "./profileScreens";
import Login from "../screens/Authentication/Login";
import Register from "../screens/Authentication/Register";
import ForgotPassword from "../screens/Authentication/ForgotPassword"
import ResetPassword from "../screens/Authentication/ResetPassword"

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
                <Stack.Screen name="CategoriesList" component={CategoriesList} options={{ headerShown: false }} />
                <Stack.Screen name="ViewEvents" component={ViewEvents} options={{ headerShown: true }} />
                <Stack.Screen name="BookingOverView" component={BookingOverView} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={StackProfileNavigation} options={{ headerShown: true }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: true }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: true }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;