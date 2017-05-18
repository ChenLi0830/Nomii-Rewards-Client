import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight
} from 'react-native-responsive-dimensions';
import {branch, withState, lifecycle, compose, renderComponent, pure, withHandlers, onlyUpdateForKeys} from 'recompose';
import {getIfPermissionAsked, setIfPermissionAsked} from './api';
import {Loading, Button} from './common';
import {Amplitude, Location, Permissions} from 'expo';
import {Toast} from 'antd-mobile';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {userActions} from '../modules';

const numberColWidth = responsiveWidth(4);

const styles = new StyleSheet.create({
  wrapper: {
    marginTop: 74,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: responsiveWidth(50),
  },
  title: {
    color: "#7F8C8D",
    fontSize: responsiveFontSize(2.8),
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "600"
  },
  configView: {
    backgroundColor: "#F0F0F0",
    borderRadius: 7,
    overflow: "hidden",
    width: responsiveWidth(90),
    padding: responsiveWidth(8),
    // alignItems: "center",
  },
  configRow: {
    flexDirection: "row",
    marginTop: responsiveHeight(2.5),
  },
  numberCol: {
    width: numberColWidth,
    // backgroundColor:"yellow",
  },
  textCol: {
    flex: 1,
    // backgroundColor:"green",
  },
  configText: {
    fontSize: responsiveFontSize(1.5),
    // lineHeight: responsiveFontSize(3),
    // textAlign: ""
  },
  configNumber: {
    color: "#A1A1A1",
    fontSize: responsiveFontSize(1.5),
    // lineHeight: responsiveFontSize(3),
  }
});

const androidText =     <View style={styles.configView}>
  <Text style={styles.configText}>
    To turn on Location Services for your Android device:
  </Text>
  
  <View style={{left: -numberColWidth}}>
    <View style={styles.configRow}>
      <View style={styles.numberCol}>
        <Text style={styles.configNumber}>1</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.configText}>
          Tap
          <Text style={styles.bold}> Settings </Text>
          >
          <Text style={styles.bold}> Apps </Text>
          >
          <Text style={styles.bold}> Nomii Rewards</Text>
          .
        </Text>
      </View>
    </View>
    
    <View style={styles.configRow}>
      <View style={styles.numberCol}>
        <Text style={styles.configNumber}>2</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.configText}>
          Tap
          <Text style={styles.bold}> Permissions </Text>
          and toggle
          <Text style={styles.bold}> Location</Text>
          .</Text>
      </View>
    </View>
  
  </View>
</View>;
const iosText =       <View style={styles.configView}>
  <Text style={styles.configText}>
    To turn on Location Services for your iOS device:
  </Text>
  
  <View style={{left: -numberColWidth}}>
    <View style={styles.configRow}>
      <View style={styles.numberCol}>
        <Text style={styles.configNumber}>1</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.configText}>Go to your device's home screen.</Text>
      </View>
    </View>
    
    <View style={styles.configRow}>
      <View style={styles.numberCol}>
        <Text style={styles.configNumber}>2</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.configText}>
          Tap
          <Text style={styles.bold}> Settings </Text>
          >
          <Text style={styles.bold}> Privacy </Text>
          >
          <Text style={styles.bold}> Location Services</Text>
          .
        </Text>
      </View>
    </View>
    
    <View style={styles.configRow}>
      <View style={styles.numberCol}>
        <Text style={styles.configNumber}>3</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.configText}>Scroll through the list of apps below, tap
          <Text style={styles.bold}> Nomii rewards </Text>
          and select
          <Text style={styles.bold}> While Using the App </Text>
          .</Text>
      </View>
    </View>
  
  </View>

</View>;

const NoLocationScreen = (props) => {
  return <View style={styles.wrapper}>
    <Image resizeMode="contain"
           style={styles.image}
           source={require('../../public/images/Home-empty-screen-card.png')}/>
    
    <Text style={styles.title}>
      To Start Earning Rewards
    </Text>
    
    <Text style={styles.text}>
      Accept the app to use your
      {"\n"}
      <Text style={styles.bold}>location </Text>
      to offer a great selection
      {"\n"}
      of stores
      <Text style={styles.bold}> around you</Text>
    </Text>
    
    {
      props.locationPermissionAsked
      &&
      (
          Platform.OS === "android" ?
            androidText
            :
            iosText
      )
    }
    
    {
      !props.locationPermissionAsked
      &&
      <Button onPress={props.askLocationPermission}>
        ENABLE LOCATION
      </Button>
    }
  </View>
};

export default compose(
    connect(
        state => ({
          location: state.user.location,
        }),
        {updateUserLocation: userActions.updateUserLocation}
    ),
    withState('locationPermissionAsked', 'updatePermissionAsked', undefined),
    lifecycle({
      async componentWillMount(){
        let locationPermissionAsked = await getIfPermissionAsked("location");
        console.log("componentWillMount locationPermissionAsked", locationPermissionAsked);
        this.props.updatePermissionAsked(locationPermissionAsked);
  
        // Constantly check for location permission, redirect to 'home' screen when location is obtained
        let location;
        const getLocationInterval = setInterval(async() => {
          try {
            location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
            if (!!location) {
              console.log("location is obtained", location);
              props.updateUserLocation(location.coords);
        
              clearInterval(getLocationInterval);
        
              setTimeout(() => Actions.home(), 300);// wait 300 millisecond for location to be updated.
            }
          }
          catch (err) {
            console.log("no location permission yet");
          }
        }, 2000);
      },
      async componentWillUpdate(nextProps){
        console.log("this.props", this.props);
        console.log("nextProps", nextProps);
        let locationPermissionAsked = await getIfPermissionAsked("location");
  
        console.log("componentWillUpdate locationPermissionAsked", locationPermissionAsked);
        
        if (locationPermissionAsked !== this.props.locationPermissionAsked){
          console.log("locationPermissionAsked changed, calling updatePermissionAsked");
          this.props.updatePermissionAsked(locationPermissionAsked);
        }
      }
    }),
    branch(
        props => props.locationPermissionAsked === undefined,
        renderComponent(Loading),
    ),
    withHandlers({
      askLocationPermission: (props) => async() => {
        try {
          // redirect screen
          const {status} = await Permissions.askAsync(Permissions.LOCATION);
          // console.log("status",status);
          if (status === 'granted') {
            Toast.loading('', 0);
            
            Amplitude.logEvent("User allowed location request");
            
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
            
            // iOS will update location right away while android will wait, the current location is
            // obtained here for android
            if (Platform.OS === 'android') {
              //Get instant location
              let location = {};
              
              await Promise.race([
                Location.getCurrentPositionAsync({enableHighAccuracy: true}),
                new Promise((resolve, reject) => setTimeout(
                    () => reject(new Error("Get Location Timeout")), 5000))
              ])
                  .then(result => {
                    location = result;
                  })
                  .catch(error => {
                    // console.log("error", error);
                    Toast.offline("There is something wrong with\nyour system location settings",
                        3);
                  });
              
              // console.log("location", location);
              props.updateUserLocation(location.coords);
            }
            
            // redirect screen
            setTimeout(async() => {
              await setIfPermissionAsked("location");
              Toast.hide();
              Actions.home();
            }, 300);
          }
          else { // location is not granted
            await setIfPermissionAsked("location");
            Amplitude.logEvent("User denied location request");
            console.log(new Error('Location permission not granted'));
            props.updateUserLocation(null);
          }
          
          return status;
        }
        catch (error) {
          console.log("error", error);
          Toast.fail("Something is wrong\nPlease try again", 2);
        }
      },
    }),
    pure,
)(NoLocationScreen);