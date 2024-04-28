import React from "react";
import { View, Text, Button , Image, Platform} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserTabs from "./UserTabs";
import { useSelector } from 'react-redux';
import VendorTabs from "./VendorTabs";

const MainNavigation = () => {

    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    const os = Platform.OS;
    const switchtab = useSelector((state) => state.userId);

    const HomeScreen = () => {
        return (
            <>
            {switchtab ?
                <VendorTabs/>
               : 
               <UserTabs/>
                 }
                 </>
//             <Tab.Navigator>
//                 <Tab.Screen  name="Tab1" component={Tab1Screen}  options={({ focused }) => ({
//               tabBarIcon: ({focused}) => (
      
//                 <Image
//           source={require('../assets/eventsicon.png')}
//           style={{
//             width: 20,
//             height: 20,
//             marginTop: os === 'ios' ? 30 : 0,
//             tintColor: focused ? 'black' : 'gray',
//           }}
//         />
//     ),
//     headerShown: false,
//   })}/>
//                 <Tab.Screen name="Tab2" component={Tab2Screen} />
//                 <Tab.Screen name="Tab3" component={Tab3Screen} />
//             </Tab.Navigator>
        );
    };

    const Tab1Screen = ({ navigation }) => {
        return (
            <View>
                <Text>Tab 1 Screen</Text>
                <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
            </View>
        );
    };

    const Tab2Screen = () => {
        return (
            <View>
                <Text>Tab 2 Screen</Text>
            </View>
        );
    };

    const Tab3Screen = () => {
        return (
            <View>
                <Text>Tab 3 Screen</Text>
            </View>
        );
    };

    const DetailsScreen = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Details" component={DetailsStackNavigator} />
                <Stack.Screen name="SubDetails" component={SubDetailsScreen} />
            </Stack.Navigator>
        );
    };

    const DetailsStackNavigator = ({ navigation }) => {
        return (
            <View>
                <Text>Details Screen</Text>
                <Button title="Go to Sub Details" onPress={() => navigation.navigate('SubDetails')} />
            </View>
        );
    };
    const SubDetailsScreen = () => {
        return (
            <View>
                <Text>Sub Details Screen</Text>
            </View>
        );
    };

    return (
        <NavigationContainer>

            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
                <Stack.Screen name="Details" component={DetailsScreen} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainNavigation;