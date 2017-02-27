import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform} from 'react-native';

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
  }
});

const SwiperContent2 = () => {
  return (
      <View style={styles.slide}>
        <Text style={styles.title}>
          Visit the Store
          {'\n'}
          Earn Your Stamp
        </Text>
        <Image resizeMode={Image.resizeMode.contain}
               style={styles.image}
               source = {require('../../public/images/Hand-over-icon-onboarding.png')}/>
      </View>
  )
};

export default SwiperContent2;