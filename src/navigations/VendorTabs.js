import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Platform, View, TouchableOpacity, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { getLoginUserId } from '../../redux/actions';
import VendorDashBoardTab from '../screens/VendorScreens/VendorDashBoard/DashBoard';
import VendorCategoryScreen from '../screens/VendorScreens/VendorCatergoryScreen';
import SwitchIcon from '../assets/svgs/tabIcons/profile.svg';
import NavigationHeader from '../components/NavigationHeader';
import HomeIcon from '../assets/svgs/tabIcons/home.svg';
import FocusedHomeIcon from '../assets/svgs/tabIcons/focusedHome.svg';
import ActiveForm from '../assets/svgs/activeVendorServiceFormIcon.svg';
import InActiveForm from '../assets/svgs/vendorServiceFormIcon.svg';
import VendorProfile from '../screens/VendorScreens/VendorProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const VendorTabs = () => {
  const dispatch = useDispatch();

  return (

    <Tab.Navigator
      initialRouteName='VendorHome'
      screenOptions={props => {
        return {
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#FD813B', // Change the active tab color
          tabBarInactiveTintColor: '#AAAEBB', // Change the inactive tab color
          tabBarStyle: {
            backgroundColor: 'white',
            height: 40,
            position: 'absolute',
          },
        };
      }}>

      <Tab.Screen
        name="VendorHome"
        component={VendorCategoryScreen}
        options={({ focused }) => ({
          tabBarIcon: ({ focused }) => (
            focused ? <ActiveForm /> : <InActiveForm />
          ),
          headerShown: false,
          tabBarLabel: 'Services',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="" />,

        })}
      />
      <Tab.Screen
        name="Events"
        component={VendorDashBoardTab}
        options={({ focused }) => ({
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedHomeIcon /> : <HomeIcon />
          ),
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarShowLabel: true
        })}
      />

      <Tab.Screen
        name="VendorProfile"
        component={VendorProfile}
        options={({ focused }) => ({
          tabBarIcon: ({ focused }) => (
            focused ? <SwitchIcon /> : <SwitchIcon />
          ),
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarShowLabel: true,

        })}
      />

    </Tab.Navigator>
  );
};

export default VendorTabs;
