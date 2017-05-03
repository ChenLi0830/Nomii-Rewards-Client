import React from 'react';
import {View, StyleSheet, TextInput, Keyboard, Platform} from 'react-native';

styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    backgroundColor: "#F9F9F9",
    borderColor: "#E5E5E5",
    borderRadius: 5,
    color: "#717171",
    fontSize: 13,
    paddingLeft: 10,
    paddingTop: Platform.OS === "android" ? 0 : 10,
  }
});

const InputBox = ({height = 50, width = 200, onChange, text, multiline = false}) => {
  return <View style={{}}>
    <TextInput
        style={[{height, width}, styles.input]}
        onChangeText={onChange}
        value={text}
        multiline={multiline}
        onBlur={() => Keyboard.dismiss()}
        underlineColorAndroid="rgba(0,0,0,0)"
        blurOnSubmit
    />
  </View>
};

export {InputBox};