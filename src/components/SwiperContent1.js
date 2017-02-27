import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform} from 'react-native';

const {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 30,
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
    bottom: Platform.OS === "ios" ? null : -40,
  },
  image: {
    width: width * 0.7,
  }
});

const SwiperContent1 = () => {
  return (
      <View style={styles.slide}>
        <Text style={styles.title}>
          Collect Three
          {'\n'}
          Digital Stamps
        </Text>
        <Image resizeMode={Image.resizeMode.contain}
               style={styles.image}
               source = {require('../../public/images/card-icons-onboarding.png')}/>
        <Text style = {styles.annotation}>swipe left to the next page</Text>
      </View>
  )
};

export default SwiperContent1;