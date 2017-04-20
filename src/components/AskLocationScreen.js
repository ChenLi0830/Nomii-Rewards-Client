import React from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import {Button} from './common';
import {Location, Permissions} from 'expo';
import {Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import {userActions} from '../modules';
import {Actions} from 'react-native-router-flux';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';
import {lifecycle, withHandlers, compose} from 'recompose';
import {setIfPermissionAsked, getIfPermissionAsked} from './api';

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
  image:{
    width: responsiveWidth(50),
  },
  title:{
    marginTop: 15,
    color: "#7F8C8D",
    fontSize: responsiveFontSize(2.8),
  },
  text:{
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
             source = {require('../../public/images/Location-services-icon.png')}/>
      
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
      <Button onPress = {props.askLocationPermission}>
        ENABLE LOCATION
      </Button>
    </View>
  </View>
};

// Container
export default compose(
    connect(
        null,
        {updateUserLocation: userActions.updateUserLocation}
    ),
    withHandlers({
      askLocationPermission: (props) => async ()=>{
        try {
          await setIfPermissionAsked("location");
          
          const { status } = await Permissions.askAsync(Permissions.LOCATION);
          // console.log("status",status);
          if (status === 'granted') {
            Toast.loading('', 0);
        
            // Keep track of User's location
            const options = {
              enableHighAccuracy: true,
              timeInterval: 5000,
              distanceInterval: 5
            };
        
            Location.watchPositionAsync(options, (updateResult) => {
              // console.log("updateResult", updateResult);
              props.updateUserLocation(updateResult.coords);
            });
        
            // iOS will update location right away while android will wait, the current location is obtained here for android
            if (Platform.OS === 'android'){
              //Get instant location
              let location = {};
          
              await Promise.race([
                Location.getCurrentPositionAsync({enableHighAccuracy: true}),
                new Promise((resolve, reject) => setTimeout(()=>reject(new Error("Get Location Timeout")), 5000))
              ])
                  .then(result => {
                    location = result;
                  })
                  .catch(error => {
                    // console.log("error", error);
                    Toast.offline("There is something wrong with\nyour system location settings", 3);
                  });
          
              // console.log("location", location);
              props.updateUserLocation(location.coords);
            }
        
            setTimeout(async () => {
              Toast.hide();
              let notificationPermissionAsked = await getIfPermissionAsked("notification");
              // console.log("location screen notificationPermissionAsked", notificationPermissionAsked);
              if (notificationPermissionAsked) {
                Actions.home();
              } else {
                Actions.askNotification();
              }
            }, 300);
          }
          else { // location is not granted
            console.log(new Error('Location permission not granted'));
            Actions.home();
          }
          return status;
        }
        catch (error){
          console.log("error", error);
          Toast.fail("Something is wrong\nPlease try again", 2);
        }
      }
    }),
    lifecycle({
      componentDidMount(){
        Amplitude.logEvent("Ask location screen shows up");
      }
    }),
)(AskLocationScreen);