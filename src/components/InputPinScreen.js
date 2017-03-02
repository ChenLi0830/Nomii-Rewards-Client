import React from 'react';
import {StyleSheet, Text, TextInput, Dimensions, View} from 'react-native';
import Card from './Card';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import {inputPinActions} from '../modules';


const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  view: {
    flex: 1,
    // height: height * 0.7,
    marginTop: 54,
    paddingTop: 10,
    paddingBottom: height * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    // flex: 0.8,
    // backgroundColor: "yellow"
  },
  titleText: {
    color: "#3498DB",
    fontSize: 22,
    fontWeight: "300",
  },
  inputBox:{
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    width: width * 0.5,
    // flex: 1,
  },
  
  inputText: {
    textAlign: "center",
    height: 25,
    fontSize: 25,
    color: "#3498DB",
  },

});

const InputPinScreen = (props) => {
  
  const onChangeText = (text) => {
    if (text.length === 4) {
      props.onChangePin(text);
      props.onSubmitPin();
    } else {
      props.onChangePin(text)
    }
  };
  
  
  // console.log("props", props);
  return <View style={styles.view}>
    <Card {...props.card}/>
    <Text style={styles.titleText}>
      Enter Restaurant PIN
    </Text>
    <View style={styles.inputBox}>
      <TextInput style={styles.inputText}
                 secureTextEntry autoFocus
                 value={props.pin} onChangeText={(text) => onChangeText(text)}
                 underlineColorAndroid='rgba(0,0,0,0)'
                 keyboardType="phone-pad">
      </TextInput>
    </View>
    <KeyboardSpacer topSpacing={-100}/>
  </View>
};

// Container
const mapStateToProps = (state) => {
  const {inputPin} = state;
  return {
    pin: inputPin.pin,
    message: inputPin.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangePin: (pin) => dispatch(inputPinActions.changePin(pin)),
    onSubmitPin: () => dispatch(inputPinActions.userSubmitPin()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InputPinScreen);
