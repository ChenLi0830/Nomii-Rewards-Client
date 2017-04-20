import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const Button = ({onPress, children, style, type="primary"}) => {
  const underlayColor = {
      default: "#37447f",
      ghost: "#FFF",
      primary: "#3b74b6",
      skip: "rgba(0,0,0,0)"
    };
  
  return <TouchableHighlight underlayColor={underlayColor[type]}
                             style={[styles.buttonBase, styles[type], style]}
                             onPress={() => onPress()}>
    <Text style={[styles.textBase, styles[type+"Text"]]}>
      {children}
    </Text>
  </TouchableHighlight>
};

const styles = new StyleSheet.create({
  buttonBase: {
    overflow: "hidden",
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: responsiveWidth(90),
  },
  default: {
    backgroundColor: "#3A5998",
    elevation: 2,
    overflow: null,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0
    },  },
  ghost: {
    borderWidth:1,
    borderColor: "#979797",
  },
  primary:{
    backgroundColor: "#4A90E2",
    elevation: 2,
    overflow: null,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0
    },
  },
  textBase: {
    textAlign: "center",
    fontSize: 16,
  },
  defaultText: {
    color: "white",
    fontWeight: "bold",
  },
  ghostText: {
    color: "#262626",
    // fontWeight: "",
  },
  primaryText: {
    color: "#FFF",
    fontWeight: "bold",
    // fontWeight: "",
  },
  skipText:{
    color: "#5c5c5c",
  },
});

export {Button}