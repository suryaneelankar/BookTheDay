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
       <Image
          source={require('../assets/eventsicon.png')}
          style={{
            width: 20,
            height: 20,
            marginTop: os === 'ios' ? 30 : 0,
            tintColor: focused ? 'black' : 'gray',
          }}
        />
      </TouchableOpacity>
    );
  };

  const os = Platform.OS;
  return (
   
    <Tab.Navigator
    initialRouteName='Homie'
      screenOptions={props => {
        return {
          tabBarShowLabel: false,
          // tabBarActiveTintColor: 'blue', // Change the active tab color
          // tabBarInactiveTintColor: 'white', // Change the inactive tab color
          tabBarStyle: {
            backgroundColor: 'white',
            height: 45,
            position: 'absolute',
          },
        };
      }}>

     <Tab.Screen
     name="Homie"
     component={HomeDashboard}
     options={({ focused }) => ({
     tabBarIcon: ({focused}) => (
        <Image
        source={require('../assets/homie.png')}
        style={{
          width: 20,
          height: 20,
          marginTop: os === 'ios' ? 30 : 0,
          tintColor: focused ? 'black' : 'gray',
        }}
      />
    ),
    headerShown: false,
  })}
/>

 <Tab.Screen
  name="Category"
  component={Categories}
  options={({ focused }) => ({
    tabBarIcon: ({focused}) => (
      
        <Image
        source={require('../assets/categories.png')}
        style={{
          width: 20,
          height: 20,
          marginTop: os === 'ios' ? 30 : 0,
          tintColor: focused ? 'black' : 'gray',
        }}
      />
    ),
    headerShown: false,
  })}
/>

<Tab.Screen
  name="Events"
  component={Events}
  options={({ focused }) => ({
    tabBarIcon: ({focused}) => (
      
        <Image
        source={require('../assets/eventsicon.png')}
        style={{
          width: 20,
          height: 20,
          marginTop: os === 'ios' ? 30 : 0,
          tintColor: focused ? 'black' : 'gray',
        }}
      />
    ),
    headerShown: false,
  })}
/>

<Tab.Screen
  name="My Box"
  component={MyBox}
  options={({ focused }) => ({
    tabBarIcon: ({focused}) => (
     
        <Image
          source={require('../assets/Home.png')}
          style={{
            width: 20,
            height: 20,
            marginTop: os === 'ios' ? 30 : 0,
            tintColor: focused ? 'black' : 'gray',
          }}
        />
    ),
    headerShown: false,
  })}
/>

<Tab.Screen
  name="My Profile"
  component={StackProfileNavigation}
  listeners={{
    tabPress: (e) => {
      // Prevent default action
      e.preventDefault();
    },
  }}
  options={{
    tabBarIcon: ({ focused }) => <TabProfile focused={focused} />,
    headerShown: false,
  }}
/>

    </Tab.Navigator>
  );
};

export default UserTabs;
