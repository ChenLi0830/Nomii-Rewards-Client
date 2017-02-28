import React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
const emptyImage = require("../../public/images/circle-empty-highlight 2.png");
const filledImage = require("../../public/images/circle-1.png");

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
  },
  dots: {
    width: width * 0.1,
    height: height * 0.1,
  },
  line: {
    width: width * 0.1, borderTopWidth: 4, borderColor: "#61B0BC", top: height * 0.05
  },
  halfLine: {
    width: width * 0.05, borderTopWidth: 4, borderColor: "#61B0BC", top: height * 0.05
  }
});

const SwiperDots = ({index}) => {
  // console.warn("new index" + index);
  const ImageSources = [
    filledImage,
    index > 0 ? filledImage : emptyImage,
    index > 1 ? filledImage : emptyImage,
  ];
  
  return <View style={styles.wrapper}>
    <View style={styles.halfLine}/>
    <Image style={styles.dots}
           source={ImageSources[0]}
           resizeMode={Image.resizeMode.contain}/>
    <View style={styles.line}/>
    <Image style={styles.dots}
           source={ImageSources[1]}
           resizeMode={Image.resizeMode.contain}/>
    <View style={styles.line}/>
    <Image style={styles.dots}
           source={ImageSources[2]}
           resizeMode={Image.resizeMode.contain}/>
    <View style={styles.halfLine}/>
  </View>;
};

export default SwiperDots;