import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {I18nManager, StatusBar, Alert} from 'react-native';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async (remoteMessage) => {
  PushNotification.createChannel(
    {
      channelId: '1',
      channelName: 'My channel',
      channelDescription: 'A channel to categorise your notifications',
      playSound: false,
      soundName: 'default',
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`),
  );
  console.log('Initial Notification', remoteMessage);

  PushNotification.localNotification({
    channelId: '1', // (required)
    channelName: 'My channel', // (required)
    message: remoteMessage.notification.body,
    title: remoteMessage.notification.title,
    bigPictureUrl: remoteMessage.notification.android.imageUrl,
    smallIcon: remoteMessage.notification.android.imageUrl,
  });

  PushNotification.popInitialNotification((remoteMessage) => {
    console.log('Initial Notification', remoteMessage);
  });
});

import {store, persistor} from './redux/store';

const RNRedux = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <StatusBar
        backgroundColor="black"
        setBackgroundColor="black"
        networkActivityIndicatorVisible={true}
      />

      <App />
    </PersistGate>
  </Provider>
);

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

AppRegistry.registerComponent(appName, () => RNRedux);
