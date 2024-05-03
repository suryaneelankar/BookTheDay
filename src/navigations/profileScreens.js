import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileMainScreen from '../screens/Profile/ProfileMainScreen';
import { NavigationContainer } from "@react-navigation/native";
import AboutUs from '../screens/Profile/ProfileInnerScreens/AboutUs';
import ContactUs from '../screens/Profile/ProfileInnerScreens/ContactUs';
import DeleteMyAccount from '../screens/Profile/ProfileInnerScreens/DeleteMyAccount';
import EditProfileInfo from '../screens/Profile/ProfileInnerScreens/EditProfileInfo';
import LogOut from '../screens/Profile/ProfileInnerScreens/LogOut';
import MyBookings from '../screens/Profile/ProfileInnerScreens/MyBookings';
import MyEvents from '../screens/Profile/ProfileInnerScreens/MyEvents';
import MyLocations from '../screens/Profile/ProfileInnerScreens/MyLocations';
import Notifications from '../screens/Profile/ProfileInnerScreens/Notifications';
import PrivacyPolicy from '../screens/Profile/ProfileInnerScreens/PrivacyPolicy';
import ReferAndEarn from '../screens/Profile/ProfileInnerScreens/ReferAndEarn';
import RefundPolicy from '../screens/Profile/ProfileInnerScreens/RefundPolicy';
import TermsAndConditions from '../screens/Profile/ProfileInnerScreens/TermsAndConditions';

const StackProfileNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileMainScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ContactUs"
          component={ContactUs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DeleteMyAccount"
          component={DeleteMyAccount}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfileInfo"
          component={EditProfileInfo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LogOut"
          component={LogOut}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyEvents"
          component={MyEvents}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyLocations"
          component={MyLocations}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ReferAndEarn"
          component={ReferAndEarn}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RefundPolicy"
          component={RefundPolicy}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  export default StackProfileNavigation