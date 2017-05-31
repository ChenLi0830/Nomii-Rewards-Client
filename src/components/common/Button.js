import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const Button = ({onPress, children, style, type="primary", rounded=true, shadow=true, disabled=false}) => {
  if (disabled) type = "disabled";
  
  const underlayColor = {
      default: "#37447f",
      ghost: "#FFF",
      primary: "#3b74b6",
      primary2: "rgba(225,32,89,0.9)",
      skip: "rgba(0,0,0,0)",
      disabled: "#77ace9",
    };
  
  return <View>
    <TouchableHighlight underlayColor={underlayColor[type]}
                             style={[
                               styles.buttonBase,
                               styles[type],
                               style,
                               {borderRadius: rounded ? 50 : 7},
                               type!=="skip" && shadow && styles.shadowStyle
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
  </View>
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
  primary2:{
    backgroundColor: "rgba(225,32,89,0.9)",
    overflow: null,
    height: 50,
  },
  disabled:{
    backgroundColor: "#77ace9",
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
  primary2Text: {
    color: "#FFF",
    fontWeight: "bold",
    // fontWeight: "",
  },
  skipText:{
    color: "#5c5c5c",
    fontSize: 13,
  },
  disabledText:{
    color: "#fff",
    fontWeight: "bold",
  },
  shadowStyle:{
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0
    },
  }
});

export {Button}