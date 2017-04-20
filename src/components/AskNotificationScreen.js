import React from 'react';
import {View, Text, StyleSheet, Image, AsyncStorage} from 'react-native';
import {Permissions, Notifications, Amplitude} from 'expo';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import {Button} from '../components/common';
import {userAddPushTokenMutation} from '../graphql/user';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {Actions} from 'react-native-router-flux';
import {Toast} from 'antd-mobile';
import {compose, withHandlers, lifecycle} from 'recompose';
import {setIfPermissionAsked} from './api';

const styles = new StyleSheet.create({
  wrapperView: {
    justifyContent: "space-around",
    alignItems: "center",
    // marginTop: 74,
    flex: 1,
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    color: "#262626",
    fontWeight: "500",
    textAlign: "center",
  },
  contentView: {
    alignItems: "center",
  },
  image: {
    width: responsiveWidth(60),
    // aspectRatio: 0.885,
    height: responsiveWidth(53),
    marginVertical: responsiveHeight(5),
  },
  text: {
    fontSize: responsiveFontSize(2.5),
    color: "#262626",
    fontWeight: "500",
    textAlign: "center",
  },
});

const AskNotificationScreen = (props) => {
  return <View style={styles.wrapperView}>
    <View>
      <Text style={styles.title}>
        Don’t miss out on
        {"\n"}
        your offer!
      </Text>
      
      <Image resizeMode="contain"
             style={styles.image}
             source={require('../../public/images/reward-icon-onboarding.png')}/>
      <Text style={styles.text}>
        Nomii uses notifications
        {"\n"}
        to remind you
        {"\n"}
        of your expiring offers.
      </Text>
    </View>
    
    <View>
      <Button onPress={props.onBtnPressed}>
        Enable Notification Services
      </Button>
      <Button onPress={props.onSkipPressed} type = "skip">
        Not now
      </Button>
    </View>
  </View>
};

export default compose(
    connect(
        (state) => ({
          userId: state.user.id,
          location: state.user.location,
        })
    ),
    graphql(userAddPushTokenMutation),
    withHandlers({
      //registerForPushNotificationsAsync
      onBtnPressed: props => async() => {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        try {
          await setIfPermissionAsked("location");
          let {status} = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
          
          // Stop here if the user did not grant permissions
          if (status === 'granted') {
            Toast.loading("Saving...", 0);
            
            // Get the token that uniquely identifies this device
            let token = await Notifications.getExponentPushTokenAsync();
            
            // console.log("props.userId", props.userId);
            // console.log("pushToken", token);
            
            await props.mutate({
              variables: {
                userId: props.userId,
                pushToken: token,
              }
            });
            
            AsyncStorage.setItem("@NomiiStore:pushToken", token);
            
            Toast.hide();
          }
        } catch (error) {
          // alert(error.message);
          console.warn("error", error);
        }
        // redirect screen
        if (props.location) Actions.home();
        else Actions.location();
      },
      onSkipPressed: props => () => {
        if (props.location) Actions.home();
        else Actions.location();
      },
    }),
    lifecycle({
      componentDidMount(){
        Amplitude.logEvent("Ask notification screen shows up");
      }
    }),
)(AskNotificationScreen);
