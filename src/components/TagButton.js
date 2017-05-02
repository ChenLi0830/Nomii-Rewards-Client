import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  container:{
    borderColor: "#E41856",
    width: responsiveWidth(30),
    backgroundColor: "#E41856",
    borderRadius: 5,
    overflow: "hidden",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  text:{
    color: "#fff",
    fontSize: responsiveFontSize(1.5),
  }
});

const TagButton = (props) => {
  return <View style={styles.container}>
    <Text style={styles.text}>
      {props.children}
    </Text>
  </View>
};

export default TagButton;