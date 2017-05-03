import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BackButton = ({color = "#363636", size=32, onPress}) => {
  console.log("size",size);
  return <TouchableWithoutFeedback onPress = {onPress}>
    <MaterialCommunityIcons name="arrow-left" size={size} color={color} />
  </TouchableWithoutFeedback>
};

export {BackButton};
