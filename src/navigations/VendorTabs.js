import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Platform,View, TouchableOpacity, Text, Button} from 'react-native';
import { useDispatch } from 'react-redux';
import { getLoginUserId } from '../../redux/actions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const VendorTabs = () => {
    const dispatch = useDispatch();

  const StackNavigation = () => {
    return (
      <Stack.Navigator initialRouteName="Tab1Screen">
           <Stack.Screen name="Tab1" component={Tab1Screen} />
           <Stack.Screen name="Tab2" component={Tab2Screen} />

      </Stack.Navigator>
    );
  };


  const EventsNavigation = () => {
    return (
      <Stack.Navigator initialRouteName="Events" >
       <Stack.Screen name="Tabevent1" component={Tab1Screen} />
           <Stack.Screen name="Tabevent2" component={Tab2Screen} />
      </Stack.Navigator>
    );
  };
  const StackCategoriesNavigation = () => {
    return (
      <Stack.Navigator initialRouteName="Categories" >
        <Stack.Screen name="Tabcat1" component={Tab1Screen} />
           <Stack.Screen name="Tabcat2" component={Tab2Screen} />
      </Stack.Navigator>
    );
  };
  const Tab1Screen = ({ navigation }) => {
    return (
        <View>
            <Text>Tab 1 HOME vendors  Screen</Text>
            <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
        </View>
    );
};
const Tab2Screen = ({ navigation }) => {
    return (
        <View>
            <Text>Tab 2  GIVE RENT Screen</Text>
            <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
        </View>
    );
};
const Tab3Screen = ({ navigation }) => {
  return (
      <View>
          <Text>Tab 3  PROFILE Screen</Text>
          <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      </View>
  );
};
const Tab4Screen = ({ navigation }) => {
  return (
      <View>
          <Text>Tab 4  vendors Screen</Text>
          <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      </View>
  );
};




  const TabProfile = ({focused}) => {
  
    const handleTabPress = () => {
      dispatch(getLoginUserId(false));
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
    initialRouteName='HomeDashboard'
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
     name="Home"
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
  component={Tab4Screen}
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

export default VendorTabs;
