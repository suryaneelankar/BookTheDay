import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Platform,View, TouchableOpacity, Text, Button} from 'react-native';
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
import FocusedHire from '../assets/svgs/tabIcons/focusedHire.svg';
import SwitchIcon from '../assets/svgs/tabIcons/profile.svg';
import Hire from '../screens/MyBox';
import NavigationHeader from '../components/NavigationHeader';
import ViewProfile from '../screens/Profile/ViewProfile';
import ProfileMainScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => {
    const dispatch = useDispatch();

  
const Tab4Screen = ({ navigation }) => {
  return (
      <View>
          <Text>Tab 4  user Profile</Text>
          <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      </View>
  );
};

  const StackProfileNavigation = () => {
    return (
      <Stack.Navigator initialRouteName="Tabpro">
        <Stack.Screen name="Tabpro" component={Tab4Screen} />

      </Stack.Navigator>
    );
  };

  const TabProfile = ({focused}) => {
  
    const handleTabPress = () => {
      console.log("IAM PRESSING THEDISPACTH")
      dispatch(getLoginUserId(true));
    };
  
    return (
      <TouchableOpacity onPress={handleTabPress}>
        {focused ? <FocusedHomeIcon/> : <SwitchIcon/>}
      </TouchableOpacity>
    );
  };

  const os = Platform.OS;
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
            fontSize: 12,fontWeight:"400",
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
          tabBarShowLabel:true,
          headerShown: false,
        }}
      />

 <Tab.Screen
  name="Category"
  component={Categories}
  options={{
    tabBarIcon: ({ focused }) => (
      focused ? <FocusedCollection /> : <CollectionIcon />
    ),
    tabBarLabel: 'Collections',
    tabBarShowLabel:true,
    header: () => <NavigationHeader Icon={false} title="Products" />,
    headerShown: true,
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
    tabBarShowLabel:true,
    header: () => <NavigationHeader Icon={false} title="Event Management" />,
    headerShown: true,
  }}
/>

{/* <Tab.Screen
  name="My Box"
  component={Hire}
  options={{
    tabBarIcon: ({ focused }) => (
      focused ? <FocusedHire /> : <HireIcon />
    ),
    tabBarLabel: 'Hire',
    tabBarShowLabel:true,
    header: () => <NavigationHeader Icon={false} title="Hire Professionals" />,
    headerShown: true,
  }}
/> */}

<Tab.Screen
  name="My Profile"
  // component={StackProfileNavigation}
  component={ProfileMainScreen}
  options={{
    tabBarIcon: ({ focused }) => (
      focused ? <HireIcon /> : <SwitchIcon />
    ),}}
  // listeners={{
  //   tabPress: (e) => {
  //     // Prevent default action
  //     e.preventDefault();
  //   },
  // }}
  // options={{
  //   tabBarIcon: ({ focused }) => <TabProfile focused={focused} />,
  //   headerShown: false,
  // }}
/>

    </Tab.Navigator>
  );
};

export default UserTabs;
