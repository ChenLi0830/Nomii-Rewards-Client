import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import {branch, compose, lifecycle, pure, renderComponent, withHandlers} from 'recompose';
import {Button, Loading} from './common';
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
  },
  configRow: {
    flexDirection: "row",
    marginTop: responsiveHeight(2.5),
  },
  numberCol: {
    width: numberColWidth,
  },
  textCol: {
    flex: 1,
  },
  configText: {
    fontSize: responsiveFontSize(1.5),
  },
  configNumber: {
    color: "#A1A1A1",
    fontSize: responsiveFontSize(1.5),
  }
});

const androidText = <View style={styles.configView}>
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

const iosText = <View style={styles.configView}>
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
      props.locationPermissionAsked && Platform.OS === "ios"
      &&
      iosText
    }
    
    {
      // permissions in android can be asked for more than once
      (!props.locationPermissionAsked || Platform.OS === "android")
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
          locationPermissionAsked: state.user.locationPermissionAsked,
        }),
        {
          updateUserLocation: userActions.updateUserLocation,
          updateUser: userActions.updateUser,
          userWatchLocationStart: userActions.userWatchLocationStart,
        }
    ),
    withHandlers({
      askLocationPermission: (props) => async () => {
        try {
          props.updateUser({locationPermissionAsked: true});
          
          // redirect screen
          const {status} = await Permissions.askAsync(Permissions.LOCATION);
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
            
            // // update state so that the screen with config guide will show
            // props.updateUserLocation(null);
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