import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import {Button} from 'antd-mobile';
import {Actions} from 'react-native-router-flux';
import SwiperContent1 from './SwiperContent1';
import SwiperContent2 from './SwiperContent2';
import SwiperContent3 from './SwiperContent3';
import SwiperDots from './SwiperDots';

const {width, height} = Dimensions.get('window');

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
  // pagination:{
  //   bottom: - height * 0.2, //left: null, right: 10,
  //   alignSelf: "center",
  // },
  paginationView: {
    alignSelf: "center",
    bottom: height * 0.2,
  },
});

const renderPagination = (index, total, context) => {
  return (
      <View style={styles.paginationView}>
        <SwiperDots index={index} />
      </View>
  )
};

const SwiperComponent = () => {
  return (
      <Swiper style={styles.wrapper} loop={false} renderPagination={renderPagination}>
        <SwiperContent1/>
        <SwiperContent2/>
        <SwiperContent3/>
      </Swiper>
  )
};

export default SwiperComponent;