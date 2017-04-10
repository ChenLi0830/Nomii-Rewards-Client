import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
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
    width: responsiveWidth(80),
    marginTop: -responsiveHeight(10),
  }
});

const SwiperContent2 = () => {
  return (
      <View style={styles.slide}>
        <Text style={styles.title}>
          Earn Stamps for
          {'\n'}
          Every Store Visit
        </Text>
        <Image resizeMode="contain"
               style={styles.image}
               source={require('../../public/images/Hand-over-icon-onboarding.png')}/>
        <Text/>
      </View>
  )
};

export default SwiperContent2;