/**
 * @format
 */

import {AppRegistry,Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    Alert.alert('A new FCM message arrived in background mode', JSON.stringify(remoteMessage?.notification?.body));
 
     console.log('Message handled in the background!', remoteMessage);
   });
   messaging().getInitialNotification(async remoteMessage => {
     console.log('Message handled in the app kill mode!', remoteMessage);
   })
AppRegistry.registerComponent(appName, () => App);
