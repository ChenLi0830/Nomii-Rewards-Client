import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const Button = ({onPress, children, style, type="primary", rounded=true, shadow=true, disabled=false}) => {
  if (disabled) type = "disabled";
  
  const underlayColor = {
      default: "#37447f",
      ghost: "#FFF",
      primary: "#3b74b6",
      skip: "rgba(0,0,0,0)",
      disabled: "#E2E2E2",
    };
  
  const shadowStyle = shadow ? {
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 3,
          width: 0
        },
  } : {};

  return <TouchableHighlight underlayColor={underlayColor[type]}
                             style={[
                               styles.buttonBase,
                               styles[type],
                               style,
                               {borderRadius: rounded ? 50 : 7},
                               shadowStyle
                             ]}
                             onPress={()=>{
                               if (!disabled) {
                                 onPress()
                               }
                             }}>
    <Text style={[styles.textBase, styles[type+"Text"]]}>
      {children}
    </Text>
  </TouchableHighlight>
};

const styles = new StyleSheet.create({
  buttonBase: {
    overflow: "hidden",
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: responsiveWidth(90),
  },
  default: {
    backgroundColor: "#3A5998",
    overflow: null,
  },
  ghost: {
    borderWidth:1,
    borderColor: "#979797",
  },
  primary:{
    backgroundColor: "#4A90E2",
    overflow: null,
  },
  disabled:{
    backgroundColor: "#E2E2E2",
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
  disabledText:{
    color: "#fff",
    fontWeight: "bold",
  }
});

export {Button}