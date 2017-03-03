import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';

const {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    color: '#262626',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: -height * 0.1,
    width: width * 0.7,
  },
  image: {
    width: width * 0.5,
    height: 250,
    // marginTop: - height * 0.1
  },
  button: {
    width: width * 0.8,
    height: 40,
    // marginTop: Platform.OS === "ios" ? -30 : 0,
    // bottom: Platform.OS === "ios" ? 10 : -40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

const PromoSuccess = () => {
  return (
      <View style={styles.slide}>
        <Image resizeMode={Image.resizeMode.contain}
               style={styles.image}
               source = {require('../../public/images/reward-icon-onboarding.png')}/>
        
        <Text style={styles.title}>
          SUCCESS!!
          {'\n'}
          You unlocked 5% off at all restaurants on your 1st visit
        </Text>
        
        <Button style={styles.button} type="primary" onPress={() => Actions.home()}>AWESOME!</Button>
      </View>
  )
};

export default PromoSuccess;