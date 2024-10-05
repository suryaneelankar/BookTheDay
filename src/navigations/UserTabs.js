import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Platform, View, TouchableOpacity, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { getLoginUserId } from '../../redux/actions';
import HomeDashboard from '../screens/Home';
import Events from '../screens/Events';
import Categories from '../screens/Categories';
import MyBox from '../screens/MyBox';
import HomeIcon from '../assets/svgs/tabIcons/home.svg';
import CollectionIcon from '../assets/svgs/tabIcons/collections.svg';
import FocusedHomeIcon from '../assets/svgs/tabIcons/focusedHome.svg';
import FocusedCollection from '../assets/svgs/tabIcons/focusedCollection.svg';
import EventsIcon from '../assets/svgs/tabIcons/events.svg';
import FocusedEvents from '../assets/svgs/tabIcons/focusedEvents.svg';
import HireIcon from '../assets/svgs/tabIcons/hire.svg';
import SwitchIcon from '../assets/svgs/tabIcons/profile.svg';
import Hire from '../screens/MyBox';
import NavigationHeader from '../components/NavigationHeader';
import ViewProfile from '../screens/Profile/ViewProfile';
import ProfileMainScreen from '../screens/Profile/ProfileScreen';
import Caterings from '../screens/Caterings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => {
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
      initialRouteName='UserHome'
      screenOptions={props => {
        return {
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            height: 50,
            position: 'absolute',
          },
          tabBarActiveTintColor: '#ED9D20',
          tabBarInactiveTintColor: '#AAAEBB',
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400",
          },
        };
      }}>

      <Tab.Screen
        name="UserHome"
        component={HomeDashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedHomeIcon /> : <HomeIcon />
          ),
          tabBarLabel: 'Home',
          tabBarShowLabel: true,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Caterings"
        component={Caterings}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Caterings',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="Catering Services" />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedCollection /> : <CollectionIcon />
          ),
          tabBarLabel: 'Collections',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="Products" />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Events',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="Event Management" />,
          headerShown: false,
        }}
      />

    </Tab.Navigator>
  );
};

export default UserTabs;
