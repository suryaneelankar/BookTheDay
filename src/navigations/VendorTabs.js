import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Platform,View, TouchableOpacity, Text, Button} from 'react-native';
import { useDispatch } from 'react-redux';
import { getLoginUserId } from '../../redux/actions';
import VendorDashBoardTab from '../screens/VendorScreens/VendorDashBoard/DashBoard';
import VendorCategoryScreen from '../screens/VendorScreens/VendorCatergoryScreen';
import SwitchIcon from '../assets/svgs/tabIcons/profile.svg';
import NavigationHeader from '../components/NavigationHeader';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const VendorTabs = () => {
    const dispatch = useDispatch();

//   const Tab1Screen = ({ navigation }) => {
//     return (
//         <View>
//             <Text>Tab 1 HOME vendors  Screen</Text>
//             <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
//         </View>
//     );
// };
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
    initialRouteName='VendorHome'
      screenOptions={props => {
        return {
          tabBarShowLabel: true,
          tabBarActiveTintColor: 'blue', // Change the active tab color
          tabBarInactiveTintColor: 'gray', // Change the inactive tab color
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
{/* VendorCategoryScreen */}
{/* VendorDashBoardTab */}
     <Tab.Screen
     name="VendorHome"
     component={VendorCategoryScreen}
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
    headerShown: true,
    tabBarLabel:'Services',
    tabBarShowLabel: true,
    header: () => <NavigationHeader Icon={false} title="Services" />,

  })}
/>
<Tab.Screen
  name="Events"
  component={VendorDashBoardTab}
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
    tabBarLabel:'Home',
    tabBarShowLabel: true
  })}
/>

{/* <Tab.Screen
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
/> */}
      <Tab.Screen
  name="Category"
  component={Tab3Screen}
  options={({ focused }) => ({
    tabBarIcon: ({focused}) => (
      focused ? <SwitchIcon/> : <SwitchIcon/>
    ),
    headerShown: true,
    tabBarLabel:'Profile',
    tabBarShowLabel: true,

  })}
/>
{/* <Tab.Screen
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
/> */}

    </Tab.Navigator>
  );
};

export default VendorTabs;
