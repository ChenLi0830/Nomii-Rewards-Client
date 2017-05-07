import React from 'react';
import {View, StyleSheet, TextInput, Keyboard} from 'react-native';

styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    backgroundColor: "#F9F9F9",
    borderColor: "#E5E5E5",
    borderRadius: 5,
    color: "#717171",
    fontSize: 13,
    paddingLeft: 10,
  },
  multilineStyle: {
    paddingTop: 10,
    textAlignVertical: "top",
  }
});

const InputBox = ({height = 46, width = 200, onChange, text, multiline = false, placeholder = "", keyboardType = "default", maxLength}) => {
  return <View style={{justifyContent: "center",}}>
    <TextInput
        style={[{height, width}, styles.input, multiline && styles.multilineStyle]}
        onChangeText={onChange}
        value={text}
        multiline={multiline}
        onBlur={() => Keyboard.dismiss()}
        underlineColorAndroid="rgba(0,0,0,0)"
        blurOnSubmit
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
    />
  </View>
};

export {InputBox};