import React from 'react';
import {View, StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  containerBar:{
    backgroundColor: "#F6F6F7",
  },
  progressBar:{
    backgroundColor: "#E31155",
  }
});

const RatingProgressBar = ({height = 10, width = responsiveWidth(90), progress=70, total = 100}) => {
  const percentage = progress / total;
  
  return <View>
    <View style={[styles.containerBar, {borderRadius:height/2, height: height, width: width}]}/>
    <View style={[styles.progressBar, {borderRadius:height/2, height: height, width: percentage * width, top: -height}]}/>
  </View>
};

export default RatingProgressBar;