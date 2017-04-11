import React from 'react';
import {StyleSheet, View} from 'react-native';
import Swiper from 'react-native-swiper';
import SwiperContent1 from './SwiperContent1';
import SwiperContent2 from './SwiperContent2';
import SwiperContent3 from './SwiperContent3';
import SwiperDots from './SwiperDots';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  paginationView: {
    alignSelf: "center",
    bottom: responsiveHeight(20),
  },
});

const renderPagination = (index, total, context) => {
  switch (index) {
    case 0: Amplitude.logEvent('Step 1 of onboarding'); break;
    case 1: Amplitude.logEvent('Step 2 of onboarding'); break;
    case 2: Amplitude.logEvent('Step 3 of onboarding'); break;
  }
  return (
      <View style={styles.paginationView}>
        <SwiperDots index={index}/>
      </View>
  )
};

const SwiperComponent = () => {
  return (
      <Swiper renderPagination={renderPagination}
              style={styles.wrapper} loop={false}>
        <SwiperContent1/>
        <SwiperContent2/>
        <SwiperContent3/>
      </Swiper>
  )
};

export default SwiperComponent;