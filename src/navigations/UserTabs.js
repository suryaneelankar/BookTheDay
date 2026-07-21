import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeDashboard from '../screens/Home';
import Events from '../screens/Events';
import HomeIcon from '../assets/svgs/tabIcons/home.svg';
import FocusedHomeIcon from '../assets/svgs/tabIcons/focusedHome.svg';
import EventsIcon from '../assets/svgs/tabIcons/events.svg';
import FocusedEvents from '../assets/svgs/tabIcons/focusedEvents.svg';
import NavigationHeader from '../components/NavigationHeader';
import { Platform } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LuxuryResorts from '../screens/Events/LuxuryResorts';
import FarmHouse from '../screens/Events/FarmHouse';
import BanquetHalls from '../screens/Events/BanquetHalls';
import SmartSearch from '../screens/Search/SmartSearch';

const Tab = createBottomTabNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='UserHome'
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'white',
          height: Platform.OS === 'ios' ? 90 : 60,
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: '#F1F1F1',
          elevation: 8,
        },
        tabBarActiveTintColor: '#FD813B',
        tabBarInactiveTintColor: '#AAAEBB',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'ManropeRegular',
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        },
      }}>

      {/* ── Halls (Home) ── */}
      <Tab.Screen
        name="UserHome"
        component={HomeDashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedHomeIcon /> : <HomeIcon />
          ),
          tabBarLabel: 'Halls',
          headerShown: false,
        }}
      />

      {/* ── Search ── */}
      <Tab.Screen
        name="SmartSearch"
        component={SmartSearch}
        options={{
          tabBarIcon: ({ focused }) => (
            <IonIcon name={focused ? "search" : "search-outline"} size={22} color={focused ? '#FD813B' : '#AAAEBB'} />
          ),
          tabBarLabel: 'Search',
          headerShown: false,
        }}
      />

      {/* ── Banquets ── */}
      <Tab.Screen
        name="BanquetHallsTab"
        component={BanquetHalls}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Banquets',
          headerShown: false,
        }}
      />

      {/* ── Resorts ── */}
      <Tab.Screen
        name="Luxury Resorts"
        component={LuxuryResorts}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Resorts',
          headerShown: false,
        }}
      />

      {/* ── Farm Houses ── */}
      <Tab.Screen
        name="Farm House"
        component={FarmHouse}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Farm Houses',
          headerShown: false,
        }}
      />

      {/* ── Function Halls (all) ── */}
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedHomeIcon /> : <HomeIcon />
          ),
          tabBarLabel: 'All Halls',
          headerShown: false,
        }}
      />

    </Tab.Navigator>
  );
};

export default UserTabs;
