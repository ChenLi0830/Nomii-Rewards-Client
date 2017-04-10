import React from 'react';
import {StyleSheet, Text, View, Image, Platform} from 'react-native';
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
  annotation: {
    color: '#b6b6b6',
    fontSize: 16,
    textAlign: 'center',
    bottom: Platform.OS === "ios" ? 10 : -40,
  },
  image: {
    width: responsiveWidth(70),
    marginTop: -responsiveHeight(10),
  }
});

const SwiperContent1 = () => {
  return (
      <View style={styles.slide}>
        <Text style={styles.title}>
          Reward Cards
          {'\n'}
          with Three Stamps
        </Text>
        <Image resizeMode="contain"
               style={styles.image}
               source={require('../../public/images/card-icons-onboarding.png')}/>
        <Text style={styles.annotation}>swipe left to the next page</Text>
      </View>
  )
};

export default SwiperContent1;