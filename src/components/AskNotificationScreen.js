import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {Amplitude, Notifications, Permissions} from 'expo';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import {Button} from '../components/common';
import {userAddPushTokenMutation} from '../graphql/user';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {Actions} from 'react-native-router-flux';
import {Toast} from 'antd-mobile';
import {compose, lifecycle, withHandlers} from 'recompose';
import {userActions} from '../modules';

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
        ENABLE NOTIFICATION
      </Button>
      <Button onPress={props.onSkipPressed} type="skip">
        Not Now
      </Button>
    </View>
  </View>
};

export default compose(
    connect(
        (state) => ({
          userId: state.user.id,
          location: state.user.location,
          locationPermissionAsked: state.user.locationPermissionAsked,
        }),
        {updateUser: userActions.updateUser}
    ),
    graphql(userAddPushTokenMutation),
    withHandlers({
      //registerForPushNotificationsAsync
      onBtnPressed: props => async () => {
        try {
          props.updateUser({notificationPermissionAsked: true});
          let {status} = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
          
          // Stop here if the user did not grant permissions
          if (status === 'granted') {
            Toast.loading("Saving...", 0);
            
            Amplitude.logEvent("User allowed notification request");
            
            // Get the token that uniquely identifies this device
            let token = await Notifications.getExponentPushTokenAsync();
            
            await props.mutate({
              variables: {
                userId: props.userId,
                pushToken: token,
              }
            });
            
            if (props.locationPermissionAsked) {
              Actions.home();
            } else {
              Actions.askLocation();
            }
            
            Toast.hide();
          }
        } catch (error) {
          // alert(error.message);
          Amplitude.logEvent("User denied notification request");
          console.warn("error", error);
          // redirect screen
          Actions.home();
        }
      },
      onSkipPressed: props => async () => {
        Amplitude.logEvent("User skipped notification request");
        
        if (props.locationPermissionAsked) {
          Actions.home();
        } else {
          Actions.askLocation();
        }
      },
    }),
    lifecycle({
      componentDidMount(){
        Amplitude.logEvent("Ask notification screen shows up");
        if (Platform.OS === "android") {
          // Android remote notification permissions are granted during the app install
          this.props.onBtnPressed();
        }
      }
    }),
)(AskNotificationScreen);
