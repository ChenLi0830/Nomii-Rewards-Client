import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Image, View} from 'react-native-animatable';

const {width, height} = Dimensions.get("window");


const emptyImage = require("../../public/images/circle-empty-highlight 2.png");
const filledImage = require("../../public/images/circle-1.png");

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    // top: -50,
    // height: 100,
  },
  dotBox: {
    width: width * 0.1,
    height: width * 0.1,
  },
  full: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.1,
    height: width * 0.1,
  },
  empty:{
    width: width * 0.1,
    height: width * 0.1,
  },
  lineBase: {
    borderTopWidth: 3,
    borderColor: "#35ABBD",
    // borderColor: "#61B0BC",
    height: 0
  },
  line: {
    width: width * 0.1,
  },
  halfLine: {
    width: width * 0.05,
  }
});

const SwiperDots = ({index}) => {
  // console.warn("new index" + index);
  // const ImageSources = [
  //   filledImage,
  //   index > 0 ? filledImage : emptyImage,
  //   index > 1 ? filledImage : emptyImage,
  // ];
  
  return <View style={styles.wrapper}>
    <View style={[styles.lineBase, styles.halfLine]}/>
    
    <View style={styles.dotBox}>
      <Image style={styles.full}
             source={emptyImage}
             resizeMode="contain"/>
      {
        index >= 0
        &&
        <Image style = {styles.empty} source={filledImage}
               animation="fadeIn" duration={500}
               resizeMode="contain"/>
      }
    </View>
    
    <View style={[styles.lineBase, styles.line]}/>
    
    <View style={styles.dotBox}>
      <Image style={styles.full}
             source={emptyImage}
             resizeMode="contain"/>
      {
        index >= 1
        &&
        <Image style = {styles.empty} source={filledImage}
               animation="fadeIn" duration={500}
               resizeMode="contain"/>
      }
    </View>
    
    <View style={[styles.lineBase, styles.line]}/>
  
    <View style={styles.dotBox}>
      <Image style={styles.full}
             source={emptyImage}
             resizeMode="contain"/>
      {
        index >= 2
        &&
        <Image style = {styles.empty} source={filledImage}
               animation="fadeIn" duration={500}
               resizeMode="contain"/>
      }
    </View>
    
    <View style={[styles.lineBase, styles.halfLine]}/>
  </View>;
};

export default SwiperDots;