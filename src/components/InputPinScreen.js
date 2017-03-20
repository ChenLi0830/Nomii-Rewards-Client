import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, View} from 'react-native';
import Card from './common/Card';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import {inputPinActions} from '../modules';
import {Modal} from './common';
import gql from 'graphql-tag';
import {userStampCardMutation} from '../graphql/user';
import {graphql} from 'react-apollo';

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
    this.props.toggleModal();
  }
  
  onChangeText(text, card) {
    // console.log(this.props);
    if (text.length === 4) {
      this.props.onChangePin(text);
      
      const variables = {
        userId: this.props.userId,
        cardId: card.id,
        PIN: text,
      };
      
      this.props.onSubmitPin(card, this.props.mutate, variables);
    } else {
      this.props.onChangePin(text)
    }
  };
  
  toggleModal(){
    this.props.toggleModal();
    setTimeout(()=>{
      // focus input text box
      this.refs.input.focus();
    }, 100);
  }
  
  render() {
    const {card, pin, message, showModal, toggleModal} = this.props;
    
    return <View style={{flex:1}}>
      <Modal visible={showModal}
             image={require("../../public/images/Hand-over-icon.png")}
             text={"PASS PHONE TO STAFF\nCOLLECT STAMP"}
             toggle={() => {this.toggleModal()}}/>
      
      <View style={styles.view}>
        <Card {...card}/>
        <Text style={styles.titleText}>
          Enter Restaurant PIN
        </Text>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputText} maxLength={4} ref='input'
                     secureTextEntry={true}
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

const InputPinWithGraphQL = graphql(userStampCardMutation)(InputPinScreen);

const mapStateToProps = (state) => {
  const {inputPin, user} = state;
  return {
    pin: inputPin.pin,
    message: inputPin.message,
    showModal: inputPin.showModal,
    userId: user.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangePin: (pin) => dispatch(inputPinActions.changePin(pin)),
    onSubmitPin: (card, stampCardMutation, variables) => {
      return dispatch(inputPinActions.userSubmitPin(card, stampCardMutation, variables))
    },
    toggleModal: () => dispatch(inputPinActions.toggleModal()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InputPinWithGraphQL);
