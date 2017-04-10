import React from 'react';
import {StyleSheet, Text, View, Image, Platform} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(10),
  },
  title: {
    color: '#262626',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '400',
  },
  image: {
    width: responsiveWidth(60),
    marginTop: - responsiveHeight(10),
    flex: 1,
  },
  button: {
    width: responsiveWidth(80),
    height: 40,
    // marginTop: Platform.OS === "ios" ? -30 : 0,
    bottom: Platform.OS === "ios" ? 0 : -40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

const SwiperContent3 = () => {
  return (
      <View style={styles.slide}>
        <Text style={styles.title}>
          More Visits
          {'\n'}
          Better Rewards
        </Text>
        <Image resizeMode="contain"
               style={styles.image}
               source = {require('../../public/images/reward-icon-onboarding.png')}/>
        <Button style={styles.button} type="primary" onPress={() => Actions.promoCode()}>GET STARTED</Button>
      </View>
  )
};

export default SwiperContent3;
