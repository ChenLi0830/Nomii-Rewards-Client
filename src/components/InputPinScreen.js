import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, View} from 'react-native';
import Card from './common/Card';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import {inputPinActions} from '../modules';
import {Modal} from './common';


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
  inputBox: {
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
  messageBox:{
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    color: "#a6342e",
    fontSize: 20,
    fontWeight: "400",
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
});

class InputPinScreen extends Component {
  componentDidMount() {
    setTimeout(() => this.props.toggleModal(), 500);
  }
  
  onChangeText(text, card) {
    if (text.length === 4) {
      this.props.onChangePin(text);
      this.props.onSubmitPin(card);
    } else {
      this.props.onChangePin(text)
    }
  };
  
  render() {
    const {card, pin, message, showModal, toggleModal} = this.props;
    
    return <View style={{flex:1}}>
      <Modal visible={showModal}
             image={require("../../public/images/Hand-over-icon.png")}
             text={"PASS TO A STAFF\nTO GET A STAMP"}
             toggle={toggleModal}/>
      
      <View style={styles.view}>
        <Card {...card}/>
        <Text style={styles.titleText}>
          Enter Restaurant PIN
        </Text>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputText}
                     autoFocus secureTextEntry={true}
                     value={pin} onChangeText={(text) => this.onChangeText(text, card)}
                     underlineColorAndroid='rgba(0,0,0,0)'
                     keyboardType="numeric">
          </TextInput>
          {
            message.length > 0
            &&
            <View style={styles.messageBox}>
              <Text style={styles.message}>{message}</Text>
            </View>
          }
        </View>
        <KeyboardSpacer topSpacing={-100}/>
      
      </View>
    </View>
  }
}

// Container
const mapStateToProps = (state) => {
  const {inputPin} = state;
  return {
    pin: inputPin.pin,
    message: inputPin.message,
    showModal: inputPin.showModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangePin: (pin) => dispatch(inputPinActions.changePin(pin)),
    onSubmitPin: (card) => dispatch(inputPinActions.userSubmitPin(card)),
    toggleModal: () => dispatch(inputPinActions.toggleModal()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InputPinScreen);
