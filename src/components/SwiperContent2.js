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
    width: width * 0.8,
    marginTop: - height * 0.10
  }
});

const SwiperContent2 = () => {
  return (
      <View style={styles.slide}>
        <Text style={styles.title}>
          Earn Stamps for
          {'\n'}
          Every Store Visits
        </Text>
        <Image resizeMode="contain"
               style={styles.image}
               source = {require('../../public/images/Hand-over-icon-onboarding.png')}/>
        <Text/>
      </View>
  )
};

export default SwiperContent2;