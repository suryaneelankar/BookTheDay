import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeDashboard from '../screens/Home';
import ExploreScreen from '../screens/Explore';
import SmartVenueMatch from '../screens/Search/SmartVenueMatch';
import ViewMyBookings from '../screens/Profile/MyBookings';
import ProfileMainScreen from '../screens/Profile/ProfileScreen';
import HomeIcon from '../assets/svgs/tabIcons/home.svg';
import FocusedHomeIcon from '../assets/svgs/tabIcons/focusedHome.svg';
import { Platform } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const UserTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="UserHome"
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

      {/* ── 1. Home ── */}
      <Tab.Screen
        name="UserHome"
        component={HomeDashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <FocusedHomeIcon /> : <HomeIcon />,
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />

      {/* ── 2. Explore (all venue categories with filter bar) ── */}
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IonIcon
              name={focused ? 'compass' : 'compass-outline'}
              size={24}
              color={focused ? '#FD813B' : '#AAAEBB'}
            />
          ),
          tabBarLabel: 'Explore',
          headerShown: false,
        }}
      />

      {/* ── 3. Smart Match (centre — primary differentiator) ── */}
      <Tab.Screen
        name="SmartMatchTab"
        component={SmartVenueMatch}
        options={{
          tabBarIcon: ({ focused }) => (
            <IonIcon
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={24}
              color={focused ? '#FD813B' : '#AAAEBB'}
            />
          ),
          tabBarLabel: 'Smart Match',
          headerShown: false,
        }}
      />

      {/* ── 4. My Bookings ── */}
      <Tab.Screen
        name="MyBookingsTab"
        component={ViewMyBookings}
        options={{
          tabBarIcon: ({ focused }) => (
            <IonIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              size={24}
              color={focused ? '#FD813B' : '#AAAEBB'}
            />
          ),
          tabBarLabel: 'My Bookings',
          headerShown: false,
        }}
      />

      {/* ── 5. Profile ── */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileMainScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IonIcon
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={focused ? '#FD813B' : '#AAAEBB'}
            />
          ),
          tabBarLabel: 'Profile',
          headerShown: false,
        }}
      />

    </Tab.Navigator>
  );
};

export default UserTabs;
