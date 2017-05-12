import React from 'react';
import {View, Text, Image, StyleSheet, Picker, Platform, Keyboard} from 'react-native';
import {InputBox} from './common';
import {responsiveFontSize, responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Button, BackButton} from './common';
import {compose, lifecycle, withState, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions, appActions} from '../modules';
//import { PickerView } from 'antd-mobile';


let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveWidth(5),
  },
  titleView:{
    alignItems: "center",
  },
  picker: {
    width: 100,
  },
  title:{
    alignSelf: "center",
    fontWeight: "600",
    fontSize: responsiveFontSize(3.5),
  },
  subTitle: {
    color: "#808080",
    fontSize: Math.max(responsiveFontSize(1.6), 12),
  },
  restaurantName:{
    fontWeight: "600",
    fontSize: responsiveFontSize(2.8),
    marginTop: -responsiveHeight(2),
  },
  button: {
    width:responsiveWidth(80),
  },
  btnView: {
    width: responsiveWidth(80)
  },
  storeLogo:{
    width: responsiveWidth(36),
    height: responsiveWidth(27),
    marginTop: -responsiveHeight(3),
    borderRadius: 5,
  },
  ratingView:{
    marginBottom:-30,
    width: responsiveWidth(60)
  },
  ratingSummary:{
    paddingBottom: 10,
    alignSelf: "center",
    fontSize: responsiveFontSize(2.2),
  }
});

const seasons = [
  [
    {
      label: '2013',
      value: '2013',
    },
    {
      label: '2014',
      value: '2014',
    },
  ],
  [
    {
      label: '春',
      value: '春',
    },
    {
      label: '夏',
      value: '夏',
    },
  ],
];

const VisitFrequencyFeedback = (props) => {
  const {visitedAt, stampCountOfCard, employeeName, restaurant, skipCount} = props.awaitFeedback;
  
  return <View style={styles.wrapper}>
    <Text style={styles.title}>
      How often do you eat at
      {/*Please rate your*/}
      {/*{'\n'}*/}
      {/*experience*/}
    </Text>
  
    <View style={styles.titleView}>
      <Text style={styles.restaurantName}>
        {restaurant.name}
      </Text>
    </View>
  
    <Image resizeMode={Image.resizeMode.contain}
           style={styles.storeLogo}
           source={{uri: restaurant.imageURL}}/>
  
    <View style={styles.ratingView}>
      <Text>First Time</Text>
    </View>
  
    <View style={styles.btnView}>
      <Button disabled = {props.rating === 0} rounded={false} shadow={false} style={styles.button} onPress={props.submitFeedback}>
        Submit
      </Button>
    </View>
  
    <View>
      <Picker
          style={styles.picker}
          selectedValue={props.value}
          onValueChange={props.onChange}>
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </View>
    
    {/*<PickerView*/}
        {/*onChange={props.onChange}*/}
        {/*value={props.value}*/}
        {/*data={seasons}*/}
        {/*cascade={false}*/}
    {/*/>*/}
  </View>
};

export default compose(
    withState('value', 'updateValue', null),
    withHandlers({
      onChange : props => (value) => {
        console.log(value);
        props.updateValue(value);
      }
    }),
    // connect(
    //     (state) => ({
    //       contact: state.feedback.contact,
    //       contactName: state.feedback.contactName,
    //       keyboardIsShown: state.app.keyboardIsShown,
    //     }),
    //     {
    //       changeContact: feedbackActions.changeContact,
    //       changeContactName: feedbackActions.changeContactName,
    //       toggleKeyboardVisibility: appActions.toggleKeyboardVisibility,
    //       prevFeedbackStep: feedbackActions.prevFeedbackStep,
    //     }
    // ),
    // lifecycle({
    //   componentWillMount () {
    //     const keyboardShow = Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    //     const keyboardHide = Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
    //     this.keyboardDidShowListener =
    //         Keyboard.addListener(keyboardShow, ()=>this.props.toggleKeyboardVisibility(true));
    //     this.keyboardDidHideListener =
    //         Keyboard.addListener(keyboardHide, ()=>this.props.toggleKeyboardVisibility(false));
    //   },
    //   componentWillUnmount () {
    //     this.keyboardDidShowListener.remove();
    //     this.keyboardDidHideListener.remove();
    //   }
    // }),
)(VisitFrequencyFeedback);