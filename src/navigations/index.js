import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserTabs from "./UserTabs";
import { useSelector } from 'react-redux';
import VendorTabs from "./VendorTabs";
import ViewTrendingDetails from "../screens/Home/ViewTrendingDetails";
import CategoriesList from "../screens/Categories/categoriesList";
import ViewEvents from "../screens/Events/ViewEvents";

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

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;