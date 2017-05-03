import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, Keyboard} from 'react-native';
import Card from './common/Card';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import {inputPinActions, appActions} from '../modules';
import {Modal} from './common';
import {userStampCardMutation, userAddAwaitFeedbackMutation} from '../graphql/user';
import {graphql} from 'react-apollo';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
//Container dependency
import {compose, withHandlers, lifecycle} from 'recompose';
import {Toast} from 'antd-mobile';
import {getAllRestaurantCardsQuery} from '../graphql/restaurant';
import {cardIsExpired} from '../components/api';
import {Actions} from 'react-native-router-flux';
import {Amplitude} from 'expo';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginTop: 54,
    paddingTop: 10,
    paddingBottom: responsiveHeight(15),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  titleText: {
    color: "#3498DB",
    fontSize: 22,
    fontWeight: "300",
  },
  inputBox: {
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
    width: responsiveWidth(50),
  },
  inputText: {
    textAlign: "center",
    height: 25,
    fontSize: 25,
    color: "#3498DB",
  },
  messageBox: {
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
  componentWillMount() {
    this.props.onEnterScreen(); // <-- props is not defined
  }
  
  componentDidMount() {
    this.props.toggleModal();
  }
  
  onChangeText(text, card) {
    // console.log(this.props);
    if (text.length === 4) {
      this.props.onChangePin(text);
      this.props.onSubmitPin(card, text);
    } else {
      this.props.onChangePin(text)
    }
  };
  
  toggleModal() {
    this.props.toggleModal();
    setTimeout(() => {
      // focus input text box
      this.refs.input.focus();
    }, 100);
  }
  
  render() {
    const {card, pin, message, showModal, toggleModal} = this.props;
    
    return <View style={{flex: 1}}>
      <Modal visible={showModal}
             image={require("../../public/images/Hand-over-icon.png")}
             text={"PASS PHONE TO STAFF\nCOLLECT STAMP"}
             toggle={() => {
               this.toggleModal()
             }}/>
      
      <View style={styles.view}>
        <Card {...card} canPress={false}/>
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

export default compose(
    connect(
        (state) => ({
          pin: state.inputPin.pin,
          message: state.inputPin.message,
          showModal: state.inputPin.showModal,
          userId: state.user.id,
        }),
        {
          onChangePin: inputPinActions.changePin,
          onEnterScreen: inputPinActions.userEnterScreen,
          toggleModal: inputPinActions.toggleModal,
          submitPinSuccess: inputPinActions.submitPinSuccess,
          submitPinFailed: inputPinActions.submitPinFailed,
        }
    ),
    graphql(userStampCardMutation, {
      name: "stampCard"
    }),
    graphql(userAddAwaitFeedbackMutation, {
      name: "addAwaitFeedback"
    }),
    withHandlers({
      onSubmitPin: props => (card, text) => {
        console.log("inputScreen props", props);
        Toast.loading('Loading...', 0);
        props.stampCard({
          variables: {
            userId: props.userId,
            cardId: card.id,
            PIN: text,
          },
          refetchQueries: [{query: getAllRestaurantCardsQuery, variables: {userId: props.userId}}]
        })
            .then(result =>{
              // console.log("result", result);
              Toast.hide();
              props.submitPinSuccess();
              Keyboard.dismiss();
              setTimeout(()=>{
                // console.warn("cardIsExpired(card)", cardIsExpired(card));
                if (cardIsExpired(card)) {
                  Actions.reward({progress: 0});
                  Amplitude.logEventWithProperties("Input PIN Success",
                      {restaurantName: card.restaurant.name, stampCount: 0});
                }
                else {
                  Amplitude.logEventWithProperties("Input PIN Success",
                      {restaurantName: card.restaurant.name, stampCount: card.stampCount});
                  
                  let successScreen = null;
                  if (card.PINSuccessScreens) successScreen = card.PINSuccessScreens[card.stampCount];
                  Actions.reward({
                    progress: card.stampCount,
                    successScreen
                  });
  
                  props.addAwaitFeedback({
                    variables: {
                      userId: props.userId,
                      restaurantId: card.id,
                      stampCountOfCard: card.stampCount,
                      //employeeName: ,
                    }
                  });
                }
              }, 100);
            })
            .catch(err => {
              Toast.hide();
              Amplitude.logEventWithProperties("Input PIN Error", {err: err.graphQLErrors[0]});
              props.submitPinFailed(err.graphQLErrors[0].message)
            });
      }
    }),
)(InputPinScreen);