import { StyleSheet, Text, View, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";

const index = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    requestUserPermission()
      .then(() => {
        messaging()
          .getToken()
          .then((token) => {
            console.log(token);
          });
      })
      .catch(() => {
        console.log("Permission not granted", authStatus);
      });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });
  }, []);

  return (
    <View>
      <Text style={styles.text}>index</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "black",
  },
});
