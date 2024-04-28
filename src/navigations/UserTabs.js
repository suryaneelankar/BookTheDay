import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Platform,View, TouchableOpacity, Text, Button} from 'react-native';
import { useDispatch } from 'react-redux';
import { getLoginUserId } from '../../redux/actions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => {
    const dispatch = useDispatch();

  
  const Tab1Screen = ({ navigation }) => {
    return (
        <View>
            <Text>Tab 1 User Home screen</Text>
            <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
        </View>
    );
};
const Tab2Screen = ({ navigation }) => {
    return (
        <View>
            <Text>Tab 2  user Events screen</Text>
            <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
        </View>
    );
};
const Tab3Screen = ({ navigation }) => {
  return (
      <View>
          <Text>Tab 3  user Categories screen</Text>
          <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      </View>
  );
};
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
    initialRouteName='UserHome'
      screenOptions={props => {
        return {
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'blue', // Change the active tab color
          tabBarInactiveTintColor: 'white', // Change the inactive tab color
          tabBarStyle: {
            backgroundColor: 'white',
            height: 40,
            position: 'absolute',
            // bottom: 20,
            // borderRadius: 90,
            // marginHorizontal: 25,
            // ...props.route.name === 'WebViewScreen' ? { display: 'none' } : {},
          },
        };
      }}>

     <Tab.Screen
     name="UserHome"
     component={Tab1Screen}
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
  name="Events"
  component={Tab2Screen}
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
  name="Category"
  component={Tab3Screen}
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
