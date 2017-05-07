import React from 'react';
import {View, Text, StyleSheet, Platform, Keyboard} from 'react-native';
import {InputBox} from './common';
import {responsiveFontSize, responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Button, BackButton} from './common';
import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions, appActions} from '../modules';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveWidth(5),
  },
  backBtnView:{
    alignSelf: "flex-start",
    left: -responsiveWidth(4),
  },
  titleView: {
    marginTop: -responsiveHeight(6),
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  title: {
    fontWeight: "600",
    fontSize: responsiveFontSize(3.5),
  },
  inputBoxTitle:{
    
  },
  contentView:{
    
  },
  button: {
    width: responsiveWidth(80),
  }
});

const FeedbackContent3 = (props) => {
  return <View style={{flex: 1}}>
    <View style={styles.wrapper}>
      <View style={styles.backBtnView}>
        <BackButton size={responsiveFontSize(3.6)} onPress={() => props.prevFeedbackStep()}/>
      </View>
  
      {
        !props.keyboardIsShown
          &&
        <View style={styles.titleView}>
          <Text style={styles.title}>
            Would you like to be
            {"\n"}
            contacted about this
            {"\n"}
            feedback?
          </Text>
        </View>
      }
      
      <View style={styles.contentView}>
        <View style={{paddingBottom: responsiveHeight(4)}}>
            <InputBox text={props.contactName}
                    width={responsiveWidth(76)}
                    //height={responsiveHeight(5)}
                    onChange={props.changeContactName}
                    placeholder="Name"/>
        </View>
        <View>
          <InputBox text={props.contact}
                    width={responsiveWidth(76)}
                    //height={responsiveHeight(5)}
                    onChange={props.changeContact}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholder="Phone Number"/>
        </View>
      </View>
  
      <Button rounded={false} shadow={false} style={styles.button}
              onPress={props.submitFeedback}>
        Submit
      </Button>
    </View>
    <KeyboardSpacer/>
  </View>
};

export default compose(
    connect(
        (state) => ({
          contact: state.feedback.contact,
          contactName: state.feedback.contactName,
          keyboardIsShown: state.app.keyboardIsShown,
        }),
        {
          changeContact: feedbackActions.changeContact,
          changeContactName: feedbackActions.changeContactName,
          toggleKeyboardVisibility: appActions.toggleKeyboardVisibility,
          prevFeedbackStep: feedbackActions.prevFeedbackStep,
        }
    ),
    lifecycle({
      componentWillMount () {
        const keyboardShow = Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
        const keyboardHide = Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
        this.keyboardDidShowListener =
            Keyboard.addListener(keyboardShow, this.props.toggleKeyboardVisibility);
        this.keyboardDidHideListener =
            Keyboard.addListener(keyboardHide, this.props.toggleKeyboardVisibility);
      },
      componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    }),
)(FeedbackContent3);