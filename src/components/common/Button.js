import React from 'react';
import {Dimensions, Text, TouchableHighlight, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get("window");

const Button = ({onPress, children, style, type}) => {
  const underlayColor = {
      default: "#37447f",
      ghost: "#FFF",
      primary: "#3b74b6"
    };
  
  return <TouchableHighlight underlayColor={underlayColor[type || "default"]}
                             style={[styles.buttonBase, styles[type || "default"], style]}
                             onPress={() => onPress()}>
    <Text style={[styles.textBase, styles[type ? type+"Text" : "defaultText"]]}>
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
    width: width * 0.9
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
});

export {Button}