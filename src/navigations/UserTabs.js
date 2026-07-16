import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeDashboard from '../screens/Home';
import Events from '../screens/Events';
import Categories from '../screens/Categories';
import HomeIcon from '../assets/svgs/tabIcons/home.svg';
import CollectionIcon from '../assets/svgs/tabIcons/collections.svg';
import FocusedHomeIcon from '../assets/svgs/tabIcons/focusedHome.svg';
import FocusedCollection from '../assets/svgs/tabIcons/focusedCollection.svg';
import EventsIcon from '../assets/svgs/tabIcons/events.svg';
import FocusedEvents from '../assets/svgs/tabIcons/focusedEvents.svg';
import CateringsIcon from '../assets/svgs/tabIcons/CateringsIcon.svg';
import FocusedCaterings from '../assets/svgs/tabIcons/FocusedCaterings.svg';
import NavigationHeader from '../components/NavigationHeader';
import Caterings from '../screens/Caterings';
import { Platform } from 'react-native';
import LuxuryResorts from '../screens/Events/LuxuryResorts';
import FarmHouse from '../screens/Events/FarmHouse';

const Tab = createBottomTabNavigator();

const UserTabs = () => {

  return (
    <Tab.Navigator
      initialRouteName='UserHome'
      screenOptions={props => {
        return {
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            height: Platform.OS === 'ios' ? 90 : 60,
            position: 'absolute',
          },
          tabBarActiveTintColor: '#ED9D20',
          tabBarInactiveTintColor: '#AAAEBB',
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400",fontFamily: "ManropeRegular"
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
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular"
          },
        }}
      />

      <Tab.Screen
        name="Luxury Resorts"
        component={LuxuryResorts}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Resorts',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="Event Management" />,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular"
          },
        }}
      />

      <Tab.Screen
        name="Farm House"
        component={FarmHouse}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedEvents /> : <EventsIcon />
          ),
          tabBarLabel: 'Farm House',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="Event Management" />,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular"
          },
        }}
      />

      {/* <Tab.Screen
        name="Caterings"
        component={Caterings}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <FocusedCaterings /> : <CateringsIcon />
          ),
          tabBarLabel: 'Caterings',
          tabBarShowLabel: true,
          header: () => <NavigationHeader Icon={false} title="Catering Services" />,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular"
          },
        }}
      /> */}

      {/* <Tab.Screen
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
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular"
          },
        }}
      /> */}

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
          tabBarLabelStyle: {
            fontSize: 12, fontWeight: "400", fontFamily: "ManropeRegular"
          },
        }}
      />

    </Tab.Navigator>
  );
};

export default UserTabs;
