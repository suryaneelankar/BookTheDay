/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Alert,
  StyleSheet,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { store } from "./redux/store";
import { Provider } from "react-redux";
import MainNavigation from './src/navigations';
import SplashScreen from 'react-native-splash-screen';
import RazorpayCheckout from 'react-native-razorpay';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    requestUserPermission();
    getToken();
  },[])

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('token is ::>>',fcmToken);
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived in foreground mode', JSON.stringify(remoteMessage));
      console.log("remoted message is:::::::::", JSON.stringify(remoteMessage))
      Alert.alert(remoteMessage?.notification?.body);
      // setNotificationMessage(remoteMessage?.data?.user_relations_id)
      // setModalVisible(true);
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <MainNavigation />
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
