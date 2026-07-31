/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  StyleSheet,
} from 'react-native';
// import messaging from '@react-native-firebase/messaging'; // COMMENTED OUT — testing without Firebase
import { store } from "./redux/store";
import { Provider } from "react-redux";
import MainNavigation from './src/navigations';
import SplashScreen from 'react-native-splash-screen';
import { AlertProvider, AlertBridge } from './src/components/CustomAlert';
import { ScrollProvider } from './src/context/ScrollContext';
// import RazorpayCheckout from 'react-native-razorpay';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // COMMENTED OUT — Firebase permission + token fetch
  // useEffect(() => {
  //   requestUserPermission();
  //   getToken();
  // }, [])

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // const getToken = async () => {
  //   const fcmToken = await messaging().getToken();
  // }

  // COMMENTED OUT — Firebase foreground message listener
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log("remoted message is:::::::::", JSON.stringify(remoteMessage))
  //     Alert.alert(remoteMessage?.notification?.body);
  //   });
  //   return unsubscribe;
  // }, []);

  return (
    <Provider store={store}>
      <ScrollProvider>
        <AlertProvider>
          <AlertBridge />
          <MainNavigation />
        </AlertProvider>
      </ScrollProvider>
    </Provider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
