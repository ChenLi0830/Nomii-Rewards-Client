import React from 'react';
import {Dimensions, Text, TouchableHighlight, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get("window");

const Button = ({onPress, children, style, type}) => {
  const underlayColor = {
      default: "#37447f",
      ghost: "#FFF",
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
    borderWidth:1,
    borderColor: "#979797",
  },
  ghost: {
    borderWidth:1,
    borderColor: "#979797",
  },
  primary:{
    backgroundColor: "#4A90E2",
    borderWidth:1,
    borderColor: "#979797",
  },
  textBase: {
    textAlign: "center",
    fontSize: 16,
  },
  defaultText: {
    color: "white",
    fontWeight: "900",
  },
  ghostText: {
    color: "#262626",
    // fontWeight: "",
  },
  primaryText: {
    color: "#FFF",
    fontWeight: "900",
    // fontWeight: "",
  },
});

export {Button}