import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {EvilIcons} from '@expo/vector-icons';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    top: -20,
    left: -responsiveWidth(3)
  },
  text:{
    color: "#E12059",
    fontSize: responsiveFontSize(2),
  },
});

const DashboardBackBtn = (props) => {
  return <TouchableOpacity style={styles.wrapper} onPress={() => Actions.pop()}>
    <EvilIcons name="chevron-left" size={responsiveFontSize(5)} color="#E12059"/>
    
    <Text style={styles.text}>
      {props.backText}
    </Text>
  </TouchableOpacity>
};

export default DashboardBackBtn;