import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';

const Button = ({onPress, children, style}) => {
  return <TouchableHighlight underlayColor="#37447f" style={[styles.button, style]}
                             onPress={() => onPress()}>
    <Text style={styles.text}>
      {children}
    </Text>
  </TouchableHighlight>
};

const styles = new StyleSheet.create({
  button: {
    overflow: "hidden",
    alignSelf: 'stretch',
    borderRadius: 50,
    backgroundColor: "#3b5998",
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
  },
  text: {
    fontWeight: "700",
    textAlign: "center",
    color: "white",
    // lineHeight: 35,
    // textAlignVertical: "center"
  },
});

export {Button}