import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {Button} from '../components/common'

const styles = new StyleSheet.create({
  wrapperView: {
    justifyContent: "space-around",
    alignItems: "center",
    // marginTop: 74,
    flex:1,
  },
  title:{
    fontSize: responsiveFontSize(3.5),
    color: "#262626",
    fontWeight: "500",
    textAlign: "center",
  },
  contentView:{
    alignItems: "center",
  },
  image:{
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

const AskNotificationScreen = () => {
  return <View style={styles.wrapperView}>
      <View>
        <Text style={styles.title}>
          Don’t miss out on
          {"\n"}
          your offer!
        </Text>
        
        <Image resizeMode="contain"
               style={styles.image}
               source = {require('../../public/images/reward-icon-onboarding.png')}/>
        <Text style={styles.text}>
          Nomii uses notifications
          {"\n"}
          to remind you
          {"\n"}
          of your expiring offers.
        </Text>
      </View>
      
      <Button onPress={() => {}}>
        Ok, Got it!
      </Button>
    </View>
};

export default AskNotificationScreen;