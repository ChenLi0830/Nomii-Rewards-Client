import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';

const {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  title: {
    color: '#262626',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '400',
  },
  image: {
    width: width * 0.7,
    marginTop: - height * 0.1
  },
  button: {
    width: width * 0.8,
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
          The More Visits
          {'\n'}
          The Better
          {'\n'}
          The Rewards
        </Text>
        <Image resizeMode="contain"
               style={styles.image}
               source = {require('../../public/images/reward-icon-onboarding.png')}/>
        <Button style={styles.button} type="primary" onPress={() => Actions.main()}>GET STARTED</Button>
      </View>
  )
};

export default SwiperContent3;