import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import {Button} from 'antd-mobile';
import {Actions} from 'react-native-router-flux';
import SwiperContent1 from './SwiperContent1';
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
        <View style={styles.slide2}>
          <Text style={styles.text}>Nomii Swiper 2</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>Nomii Swiper 3</Text>
          <Button type="ghost" onClick={() => Actions.promoCode()}>GET STARTED</Button>
        </View>
      </Swiper>
  )
};

export default SwiperComponent;