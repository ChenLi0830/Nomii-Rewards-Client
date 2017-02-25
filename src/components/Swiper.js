import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Swiper from 'react-native-swiper';
import {Button} from 'antd-mobile';
import {Actions} from 'react-native-router-flux';

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
  }
})

const SwiperComponent = () => {
  return (
      <Swiper style={styles.wrapper} loop={false}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Nomii Swiper 1</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Nomii Swiper 2</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>Nomii Swiper 3</Text>
          <Button type="ghost" onClick={() => Actions.main()}>GET STARTED</Button>
        </View>
      </Swiper>
  )
};

export default SwiperComponent;