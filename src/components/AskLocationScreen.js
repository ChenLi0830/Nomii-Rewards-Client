import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {Button} from './common';
import {Amplitude, Location, Permissions} from 'expo';
import {Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import {userActions} from '../modules';
import {Actions} from 'react-native-router-flux';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {compose, lifecycle, withHandlers} from 'recompose';

const styles = new StyleSheet.create({
  wrapper: {
    marginTop: 74, flex: 1,
  },
  contentView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 4,
  },
  buttonView: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: responsiveWidth(50),
  },
  title: {
    marginTop: 15,
    color: "#7F8C8D",
    fontSize: responsiveFontSize(2.8),
  },
  text: {
    marginTop: 20,
    color: "#262626",
    fontSize: responsiveFontSize(2),
    textAlign: "center",
  }
});

const AskLocationScreen = (props) => {
  return <View style={styles.wrapper}>
    <View style={styles.contentView}>
      <Image resizeMode="contain"
             style={styles.image}
             source={require('../../public/images/Location-services-icon.png')}/>
      
      <Text style={styles.title}>To Start Earning Rewards</Text>
      <Text style={styles.text}>
        Accept the app to use your
        {"\n"}
        <Text style={{fontWeight: "600"}}>location </Text>
        to offer a great selection
        {"\n"}
        of stores
        <Text style={{fontWeight: "600"}}> around you</Text>
      </Text>
    </View>
    
    <View style={styles.buttonView}>
      <Button onPress={props.askLocationPermission}>
        ENABLE LOCATION
      </Button>
      <Button onPress={props.onSkipPressed} type="skip">
        Not Now
      </Button>
    </View>
  </View>
};

// Container
export default compose(
    connect(
        null,
        {
          updateUserLocation: userActions.updateUserLocation,
          updateUser: userActions.updateUser,
        }
    ),
    withHandlers({
      askLocationPermission: (props) => async () => {
        try {
          props.updateUser({locationPermissionAsked: true});
          
          // redirect screen
          const {status} = await Permissions.askAsync(Permissions.LOCATION);
          // console.log("status",status);
          if (status === 'granted') {
            Toast.loading('', 0);
            Amplitude.logEvent("User allowed location request");
  
            await props.userWatchLocationStart();
            
            // redirect screen
            setTimeout(async () => {
              Toast.hide();
              Actions.home();
            }, 300);
          }
          else { // location is not granted
            Amplitude.logEvent("User denied location request");
            console.log(new Error('Location permission not granted'));
            Actions.home();
          }
          return status;
        }
        catch (error) {
          console.log("error", error);
          Toast.fail("Something is wrong\nPlease try again", 2);
        }
      },
      onSkipPressed: props => async () => {
        Amplitude.logEvent("User skipped location request");
        Actions.home();
      },
    }),
    lifecycle({
      componentDidMount(){
        Amplitude.logEvent("Ask location screen shows up");
      }
    }),
)(AskLocationScreen);